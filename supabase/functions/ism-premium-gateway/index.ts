import { hash, issue, verify } from '../_shared/access-session.mjs';
import assets from './private-assets.json' with { type: 'json' };

const base = Deno.env.get('SUPABASE_URL')!;
const secret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const cors = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type,x-ism-session','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Cache-Control':'no-store, private','Vary':'Origin'};
const json = (body:unknown,status=200) => new Response(JSON.stringify(body), {status,headers:{...cors,'Content-Type':'application/json'}});
async function rest(path:string, body?:unknown) {
  const response = await fetch(base+'/rest/v1/'+path,{method:body===undefined?'GET':'POST',headers:{apikey:secret,Authorization:'Bearer '+secret,'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
  if(!response.ok) throw Error('Database unavailable');
  const text=await response.text();return text?JSON.parse(text):null;
}
const lookup = async (id:string) => (await rest('student_access?select=id,status,active_until&id=eq.'+encodeURIComponent(id)))[0];
const apis = new Set(['ism-premium-content','ism-premium-simulations','ism-interview-content','ism-interview-lab','ism-interview-pathway']);
Deno.serve(async req=>{
  if(req.method==='OPTIONS') return new Response(null,{headers:cors});
  const url=new URL(req.url), action=url.pathname.split('/').pop();
  try {
    if(action==='session' && req.method==='POST') {
      if(Number(req.headers.get('content-length')||0)>4096) return json({ok:false},413);
      const input=await req.text();if(input.length>4096)return json({ok:false},413);
      const body=JSON.parse(input), email=String(body.email||'').trim().toLowerCase(), code=String(body.code||'').trim().toUpperCase();
      const fingerprint=await hash('premium-session|'+(req.headers.get('x-forwarded-for')||'unknown').split(',')[0]);
      const limits=await rest('rpc/ism_rate_limit_check',{p_key:fingerprint,p_limit:15,p_window_seconds:600});
      if(!Array.isArray(limits)||limits[0]?.allowed!==true)return json({ok:false,reason:'too_many_attempts'},429);
      const deny=async()=>{await rest('rpc/ism_rate_limit_fail',{p_key:fingerprint,p_window_seconds:600});return json({ok:false,reason:'access_denied'},403)};
      if(!email.includes('@')||email.length>254||code.replace(/[^A-Z0-9]/g,'').length<6||code.length>128)return await deny();
      const rows=await rest('student_access?select=id,email,status,active_until&or=(code_hash.eq.'+await hash(code)+',code_hash.eq.'+await hash(code.replace(/[^A-Z0-9]/g,''))+')');
      const row=rows[0];if(!row||String(row.email).trim().toLowerCase()!==email)return await deny();
      let token;try{token=await issue(row,secret)}catch{return await deny()}
      await rest('rpc/ism_rate_limit_clear',{p_key:fingerprint});
      return json({ok:true,token,expiresAt:Math.min(Date.now()+1800000,row.active_until?Date.parse(row.active_until):Infinity),activeUntil:row.active_until});
    }
    if(req.method!=='GET')return json({ok:false},405);
    const student=await verify(req.headers.get('x-ism-session'),secret,lookup);
    if(!student)return json({ok:false,reason:'session_required'},401);
    if(action==='status')return json({ok:true,activeUntil:student.active_until});
    const name=url.searchParams.get('name')||'';
    if(action==='asset') {
      if(!Object.hasOwn(assets,name))return json({ok:false},404);
      return new Response(assets[name as keyof typeof assets],{headers:{...cors,'Content-Type':'text/javascript;charset=utf-8','X-Content-Type-Options':'nosniff'}});
    }
    if(action==='api' && apis.has(name)) {
      const upstream=new URL(base+'/functions/v1/'+name);
      for(const [key,value] of url.searchParams)if(key!=='name')upstream.searchParams.append(key,value);
      const response=await fetch(upstream,{headers:{apikey:secret,Authorization:'Bearer '+secret,'x-ism-session':req.headers.get('x-ism-session')!}});
      return new Response(response.body,{status:response.status,headers:{...cors,'Content-Type':response.headers.get('content-type')||'application/json'}});
    }
    return json({ok:false},404);
  } catch {return json({ok:false,reason:'temporarily_unavailable'},503)}
});
