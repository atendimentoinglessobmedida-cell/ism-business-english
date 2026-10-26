const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{stripTypeScriptTypes}=require('node:module');
function fixture({owner=true,rate=[{allowed:true}]}={}){
 let handler,writes=0;
 const client={rpc:async(name)=>({data:name==='ism_rate_limit_check'?rate:null}),auth:{getUser:async()=>({data:{user:owner?{id:'098054e9-39dd-40a7-9934-683ddad83e9e',email:'atendimento.inglessobmedida@gmail.com',email_confirmed_at:'2026-01-01'}:null},error:null})},from(){return {select(){return {order:async()=>({data:[],error:null})}},insert(){writes++;throw Error('Unexpected write')},update(){writes++;throw Error('Unexpected write')}}}};
 const source=fs.readFileSync(require('node:path').join(__dirname,'../supabase/functions/ism-admin-students/index.ts'),'utf8').replace(/^import .*\r?\n/,'');
 vm.runInNewContext(stripTypeScriptTypes(source),{Deno:{serve(fn){handler=fn},env:{get:()=> 'fixture'}},createClient:()=>client,crypto,TextEncoder,Response,console});
 return {request:(method,body,headers={Authorization:'Bearer fixture'})=>handler(new Request('https://fixture.test/admin',{method,headers:{'content-type':'application/json',...headers},body:method==='GET'?undefined:JSON.stringify(body??{})})),writes:()=>writes};
}
test('shared admin keys and non-owner bearer tokens cannot administer licenses',async()=>{const f=fixture({owner:false});assert.equal((await f.request('POST',{}, {'x-admin-key':'legacy-key'})).status,401);assert.equal((await f.request('GET')).status,401);assert.equal(f.writes(),0)});
test('missing rate-limit decision denies access',async()=>{const f=fixture({rate:null});assert.equal((await f.request('GET')).status,429);assert.equal(f.writes(),0)});
test('verified owner can read but all activation and renewal paths remain disabled',async()=>{const f=fixture();assert.equal((await f.request('GET')).status,200);assert.equal((await f.request('POST',{name:'Fixture'})).status,503);for(const change of [{status:'ACTIVE'},{activeUntil:'2099-01-01'},{extendDays:30},{regenerateCode:true}])assert.equal((await f.request('PATCH',{id:'fixture',...change})).status,503);assert.equal(f.writes(),0)});
