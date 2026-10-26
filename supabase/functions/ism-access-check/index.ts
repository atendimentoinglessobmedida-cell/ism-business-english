import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization,x-client-info,apikey,content-type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS'
};

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { ...cors, 'content-type': 'application/json', 'cache-control': 'no-store' }
});

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function normalizeCode(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function ipOf(req: Request) {
  return (req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ ok: false, reason: 'method_not_allowed' }, 405);

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  try {
    const bearer=req.headers.get('authorization')?.replace(/^Bearer /i,'');
    if(bearer){const {data,error}=await supabase.auth.getUser(bearer);const u=data.user;if(error||u?.id!=='098054e9-39dd-40a7-9934-683ddad83e9e'||u?.email?.toLowerCase()!=='atendimento.inglessobmedida@gmail.com'||!u?.email_confirmed_at)return json({ok:false,reason:'access_denied'},403);return json({ok:true,administrator:true,student:{id:u.id,name:'Administrador',email:u.email,activeUntil:null}});}
    const body = await req.json().catch(() => ({}));
    const code = normalizeCode(String(body?.code ?? ''));
    const email = normalizeEmail(String(body?.email ?? ''));
    const fingerprint = await sha256(`student|${ipOf(req)}|${req.headers.get('user-agent') || ''}`);

    const { data: limitRows, error: limitErr } = await supabase.rpc('ism_rate_limit_check', {
      p_key: fingerprint,
      p_limit: 15,
      p_window_seconds: 600
    });
    if (limitErr) throw limitErr;

    const allowed = Array.isArray(limitRows) ? limitRows[0]?.allowed : true;
    if (!allowed) return json({ ok: false, reason: 'too_many_attempts' }, 429);

    if (code.length < 6 || code.length > 24) {
      await supabase.rpc('ism_rate_limit_fail', { p_key: fingerprint, p_window_seconds: 600 });
      return json({ ok: false, reason: 'access_denied' }, 403);
    }

    const codeHash = await sha256(code);
    const { data, error } = await supabase
      .from('student_access')
      .select('id,name,email,status,active_until')
      .eq('code_hash', codeHash)
      .maybeSingle();
    if (error) throw error;

    const emailMatches = !email || (!!data?.email && normalizeEmail(data.email) === email);
    const valid = !!data && emailMatches && data.status === 'ACTIVE' && (!data.active_until || new Date(data.active_until).getTime() >= Date.now());

    if (!valid) {
      await supabase.rpc('ism_rate_limit_fail', { p_key: fingerprint, p_window_seconds: 600 });
      return json({ ok: false, reason: 'access_denied' }, 403);
    }

    await supabase.rpc('ism_rate_limit_clear', { p_key: fingerprint });
    return json({
      ok: true,
      student: {
        id: data.id,
        name: data.name,
        email: data.email,
        activeUntil: data.active_until
      }
    });
  } catch (error) {
    console.error(error);
    return json({ ok: false, reason: 'server_error' }, 500);
  }
});
