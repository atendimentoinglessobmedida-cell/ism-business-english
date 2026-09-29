/* Content authorization lives in the gateway; this UI only collects credentials. */
window.ISMPremiumAccess=(()=>{
  'use strict';
  const base='https://bfuoykappwybuxdlrbmo.supabase.co/functions/v1/ism-premium-gateway/';
  const nativeFetch=window.fetch.bind(window), key='ism:premium:session:v1';
  const apis=new Set(['ism-premium-content','ism-premium-simulations','ism-interview-content','ism-interview-lab','ism-interview-pathway']);
  let session=null,pending=null,timer;
  try{session=JSON.parse(sessionStorage.getItem(key))}catch{}
  function clear(){session=null;clearTimeout(timer);try{sessionStorage.removeItem(key)}catch{}}
  function valid(){return session&&typeof session.token==='string'&&session.expiresAt>Date.now()}
  function lock(){clear();location.reload()}
  function arm(){clearTimeout(timer);if(valid())timer=setTimeout(lock,Math.max(0,session.expiresAt-Date.now()))}
  async function login(){
    if(valid())return session;
    if(pending)return pending;
    clear();
    pending=new Promise(resolve=>{
      const dialog=document.createElement('dialog');
      dialog.setAttribute('aria-labelledby','premiumAccessTitle');
      dialog.style.cssText='max-width:420px;width:calc(100% - 40px);border:0;border-radius:18px;padding:24px;color:#102a35;background:white';
      dialog.innerHTML='<form><h2 id="premiumAccessTitle">Acessar Premium</h2><p>Entre com o email e o código recebidos. É necessário estar online.</p><label>Email<input name="email" type="email" autocomplete="email" required style="display:block;width:100%;box-sizing:border-box;margin:8px 0 16px;padding:12px"></label><label>Código de acesso<input name="code" type="password" autocomplete="current-password" required style="display:block;width:100%;box-sizing:border-box;margin:8px 0 16px;padding:12px"></label><p role="status" id="premiumAccessStatus"></p><button type="submit" class="btn" style="background:#062b3b!important;color:#fff!important">Entrar</button> <a href="index.html" style="color:#07566b;text-decoration:underline">Voltar ao Core</a></form>';
      document.body.append(dialog);dialog.showModal();dialog.addEventListener('cancel',e=>e.preventDefault());
      const form=dialog.querySelector('form'),status=dialog.querySelector('[role=status]'),button=form.querySelector('button');
      form.addEventListener('submit',async event=>{
        event.preventDefault();button.disabled=true;status.textContent='Verificando acesso…';
        try{
          const response=await nativeFetch(base+'session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:form.elements.email.value,code:form.elements.code.value}),cache:'no-store'});
          const data=await response.json();
          if(!response.ok||!data.ok)throw Error(response.status===429?'Muitas tentativas. Aguarde alguns minutos.':'Acesso não autorizado. Confira o email, o código e a validade.');
          session={token:data.token,expiresAt:data.expiresAt};try{sessionStorage.setItem(key,JSON.stringify(session))}catch{}
          form.reset();dialog.close();dialog.remove();pending=null;arm();resolve(session);
        }catch(error){status.textContent=navigator.onLine?error.message:'Conecte-se à internet para acessar o Premium.'}finally{button.disabled=false}
      });
      form.elements.email.focus();
    });
    return pending;
  }
  async function request(path,retried=false){
    await login();
    const response=await nativeFetch(base+path,{headers:{'x-ism-session':session.token},cache:'no-store'});
    if(response.status===401||response.status===403){clear();if(retried)throw Error('Acesso indisponível. Recarregue a página ou entre em contato com o suporte.');await login();return request(path,true)}
    return response;
  }
  window.fetch=async(input,options)=>{
    const url=new URL(typeof input==='string'||input instanceof URL?input:input.url,location.href),name=url.pathname.split('/').pop();
    if(url.hostname==='bfuoykappwybuxdlrbmo.supabase.co'&&apis.has(name)){
      const params=new URLSearchParams(url.search);params.set('name',name);return request('api?'+params);
    }
    return nativeFetch(input,options);
  };
  const privateNames=new Set(['premium-courses.js','premium-special.js','premium-dialogues.js','premium-authentic-listening.js','premium-british-comparison.js']);
  async function loadScripts(names){
    for(const name of names){
      let src=name,blob;
      if(privateNames.has(name.split('?')[0])){
        const response=await request('asset?name='+encodeURIComponent(name.split('?')[0]));
        if(!response.ok)throw Error('Não foi possível carregar o conteúdo Premium.');
        blob=URL.createObjectURL(new Blob([await response.text()],{type:'text/javascript'}));src=blob;
      }
      try{await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=reject;document.body.append(script)})}finally{if(blob)URL.revokeObjectURL(blob)}
    }
  }
  async function refreshStatus(){
    if(!session)return;
    if(!valid())return lock();
    try{const response=await nativeFetch(base+'status',{headers:{'x-ism-session':session.token},cache:'no-store'});if(response.status===401||response.status===403)lock()}catch{/* A transient connection error is not a license revocation. */}
  }
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refreshStatus()});
  window.addEventListener('pageshow',event=>{if(event.persisted)refreshStatus()});
  arm();
  return {login,request,loadScripts,loadAssets:loadScripts,logout:lock};
})();
