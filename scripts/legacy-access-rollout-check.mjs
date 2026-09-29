import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {stripTypeScriptTypes} from 'node:module';
import {gatewayOnly} from '../supabase/rollout/_shared/gateway-only.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../supabase/rollout');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
const secret='isolated-test-only-key-not-a-real-credential';
function handler(file){
 let callback;
 const source=fs.readFileSync(file,'utf8').replace(/^import \{ gatewayOnly \}[^\n]+\n/,'');
 const context=vm.createContext({Response,Request,URL,crypto,gatewayOnly,Deno:{env:{get:()=>secret},serve:fn=>{callback=fn}}});
 new vm.Script(stripTypeScriptTypes(source)).runInContext(context);
 assert.equal(typeof callback,'function');return callback;
}
for(const item of manifest.functions){
 const original=handler(path.join(root,item.rollbackDirectory,'index.ts'));
 const candidate=handler(path.join(root,item.candidateDirectory,'index.ts'));
 const url='https://example.invalid/'+item.name;
 assert.equal((await candidate(new Request(url))).status,401,item.name+' anonymous');
 assert.equal((await candidate(new Request(url,{headers:{Authorization:'Bearer wrong'}}))).status,401,item.name+' wrong');
 assert.equal((await candidate(new Request(url,{method:'OPTIONS'}))).status,204,item.name+' preflight');
 const response=await candidate(new Request(url,{headers:{Authorization:'Bearer '+secret}}));
 assert.equal(response.status,200,item.name+' authorized');
 assert.match(response.headers.get('cache-control'),/no-store/,item.name+' cache');
 assert.deepEqual(await response.json(),await (await original(new Request(url))).json(),item.name+' content unchanged');
 console.log(item.name+': anonymous401, wrong401, OPTIONS204, gateway200, no-store, original content preserved');
}
assert.equal((await gatewayOnly(new Request('https://example.invalid'),undefined)).status,503);
assert.equal((await gatewayOnly(new Request('https://example.invalid',{method:'POST',headers:{Authorization:'Bearer '+secret}}),secret)).status,405);
console.log('Legacy rollout checks passed. Candidates remain undeployed.');
