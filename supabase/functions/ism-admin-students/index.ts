import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization,x-client-info,apikey,content-type,x-admin-key',
  'Access-Control-Allow-Methods':'GET,POST,PATCH,OPTIONS'
};
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors,'content-type':'application/json','cache-control':'no-store'}});
async function sha256(v:string){const d=new TextEncoder().encode(v);const h=await crypto.subtle.digest('SHA-256',d);return Array.from(new Uint8Array(h)).map(b=>b.toString(16).padStart(2,'0')).join('')}
function ipOf(req:Request){return (req.headers.get('cf-connecting-ip')||req.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim()}
function generateCode(){const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';const b=crypto.getRandomValues(new Uint8Array(10));return Array.from(b,x=>a[x%a.length]).join('')}

Deno.serve(async(req:Request)=>{
  if(req.method==='OPTIONS') return new Response('ok',{headers:cors});
  const supabase=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  try{
    const rateKey=await sha256(`admin|${ipOf(req)}|${req.headers.get('user-agent')||''}`);
    const {data:limitRows}=await supabase.rpc('ism_rate_limit_check',{p_key:rateKey,p_limit:8,p_window_seconds:900});
    const allowed=Array.isArray(limitRows)&&limitRows[0]?.allowed===true;
    if(!allowed) return json({ok:false,error:'too_many_attempts'},429);
    const bearer=req.headers.get('authorization')?.replace(/^Bearer /i,'');
    let verifiedOwner=false;
    if(bearer){const {data,error}=await supabase.auth.getUser(bearer);verifiedOwner=!error&&data.user?.id==='098054e9-39dd-40a7-9934-683ddad83e9e'&&data.user?.email?.toLowerCase()==='atendimento.inglessobmedida@gmail.com'&&!!data.user?.email_confirmed_at;}
    if(!verifiedOwner){await supabase.rpc('ism_rate_limit_fail',{p_key:rateKey,p_window_seconds:900});return json({ok:false,error:'unauthorized'},401)}
    await supabase.rpc('ism_rate_limit_clear',{p_key:rateKey});

    if(req.method==='GET'){
      const {data,error}=await supabase.from('student_access').select('id,name,email,status,active_until,created_at,updated_at,notes').order('created_at',{ascending:false});
      if(error) throw error;
      return json({ok:true,students:data??[]});
    }

    if(req.method==='POST'){
      // Disabled until banking verification and license writes share an audited transaction.
      return json({ok:false,error:'manual_pix_activation_not_ready'},503);

    }

    if(req.method==='PATCH'){
      const body=await req.json().catch(()=>({}));
      if(body.status==='ACTIVE'||body.activeUntil!==undefined||body.extendDays!==undefined||body.regenerateCode===true)return json({ok:false,error:'manual_pix_activation_not_ready'},503);
      const id=String(body?.id??'').trim();
      if(!id) return json({ok:false,error:'id_required'},400);
      const patch:Record<string,unknown>={};
      let action='UPDATE';
      if(body.status==='ACTIVE'||body.status==='SUSPENDED'){patch.status=body.status;action=body.status==='ACTIVE'?'REACTIVATE':'SUSPEND'}
      if(typeof body.name==='string'&&body.name.trim()) patch.name=body.name.trim();
      if(typeof body.email==='string') patch.email=body.email.trim()||null;
      if(typeof body.notes==='string') patch.notes=body.notes.trim()||null;
      if(typeof body.activeUntil==='string'&&body.activeUntil){const dt=new Date(body.activeUntil);if(Number.isNaN(dt.getTime()))return json({ok:false,error:'invalid_date'},400);patch.active_until=dt.toISOString();action='SET_EXPIRY'}
      if(Number.isFinite(Number(body.extendDays))){const days=Math.max(1,Math.min(730,Number(body.extendDays)));const {data:cur,error:ce}=await supabase.from('student_access').select('active_until').eq('id',id).single();if(ce)throw ce;const base=Math.max(Date.now(),cur?.active_until?new Date(cur.active_until).getTime():0);patch.active_until=new Date(base+days*86400000).toISOString();action='EXTEND'}
      let newCode:string|undefined;
      if(body.regenerateCode===true){newCode=generateCode();patch.code_hash=await sha256(newCode);action='REGENERATE_CODE'}
      patch.updated_at=new Date().toISOString();
      const {data,error}=await supabase.from('student_access').update(patch).eq('id',id).select('id,name,email,status,active_until,created_at,updated_at,notes').single();
      if(error) throw error;
      await supabase.from('student_access_audit').insert({student_id:id,action,detail:{extendDays:body.extendDays??null}});
      return json({ok:true,student:data,accessCode:newCode});
    }

    return json({ok:false,error:'method_not_allowed'},405);
  }catch(e){console.error(e);return json({ok:false,error:'server_error'},500)}
});
