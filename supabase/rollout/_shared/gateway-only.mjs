// Applied only after the approved client routes all Premium requests through the gateway.
// The public/publishable key and end-user session are deliberately insufficient here.
const headers={'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,OPTIONS','Access-Control-Allow-Headers':'authorization,apikey,content-type','Cache-Control':'no-store, private'};
export async function gatewayOnly(request, secret){
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(!secret||secret.length<32)return new Response(JSON.stringify({ok:false,reason:'temporarily_unavailable'}),{status:503,headers});
  const supplied=request.headers.get('authorization')||'';
  // Hash before comparing so runtime depends on fixed digest length, not matching prefix.
  const enc=new TextEncoder();
  const [left,right]=await Promise.all([supplied,'Bearer '+secret].map(value=>crypto.subtle.digest('SHA-256',enc.encode(value))));
  const a=new Uint8Array(left),b=new Uint8Array(right);let difference=0;
  for(let i=0;i<a.length;i++)difference|=a[i]^b[i];
  if(difference)return new Response(JSON.stringify({ok:false,reason:'gateway_required'}),{status:401,headers});
  if(request.method!=='GET')return new Response(JSON.stringify({ok:false,reason:'method_not_allowed'}),{status:405,headers});
  return null;
}
