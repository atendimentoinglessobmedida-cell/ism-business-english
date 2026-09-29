// Use only a synthetic, short-lived QA account. Never print its code or token.
import assert from 'node:assert/strict';
const email=process.env.ISM_QA_EMAIL,code=process.env.ISM_QA_CODE;
if(!email||!code)throw Error('Set ISM_QA_EMAIL and ISM_QA_CODE for an isolated synthetic account.');
const base='https://bfuoykappwybuxdlrbmo.supabase.co/functions/v1/ism-premium-gateway/';
const anonymous=await fetch(base+'asset?name=premium-courses.js');assert.equal(anonymous.status,401);
const login=await fetch(base+'session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,code})});
assert.equal(login.status,200);const session=await login.json();assert.equal(session.ok,true);
const headers={'x-ism-session':session.token};
for(const resource of ['status','asset?name=premium-courses.js','api?name=ism-premium-content&module=P2']){
 const response=await fetch(base+resource,{headers});assert.equal(response.status,200,resource);assert.match(response.headers.get('cache-control'),/no-store/);
}
const bad=await fetch(base+'status',{headers:{'x-ism-session':session.token+'x'}});assert.equal(bad.status,401);
console.log('Gateway live: anonymous denial, login, status, asset, API and tampering passed. Remove the synthetic account after testing.');
