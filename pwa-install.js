(() => {
  if (window.ISMInstall) return;
  let deferred = null;
  let registration, updating = false;
  const hadController = !!navigator.serviceWorker?.controller;
  function updateNotice(waiting) {
    if (document.getElementById('app-update-notice')) return;
    const css = document.createElement('link');css.rel='stylesheet';css.href='pwa-update.css';document.head.append(css);
    const notice = document.createElement('section');
    notice.id='app-update-notice';notice.setAttribute('aria-label','Atualização do aplicativo');
    notice.innerHTML='<p role="status">Uma nova versão está disponível. Seu progresso salvo será mantido.</p><div><button type="button" data-update>Atualizar agora</button><button type="button" data-later>Depois</button></div>';
    document.body.append(notice);
    notice.querySelector('[data-later]').onclick=()=>notice.remove();
    notice.querySelector('[data-update]').onclick=()=>{
      if (!navigator.onLine) {notice.querySelector('p').textContent='Conecte-se à internet para atualizar. Seu progresso salvo está mantido.';return;}
      updating=true;
      notice.querySelector('[data-update]').disabled=true;
      notice.querySelector('p').textContent='Atualizando…';
      if (waiting && waiting.state!=='activated' && waiting.state!=='redundant') waiting.postMessage({type:'SKIP_WAITING'});
      else location.reload();
    };
  }
  const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  async function register() {
    if (!('serviceWorker' in navigator)) return;
    try {
      registration=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});
      if (registration.waiting && navigator.serviceWorker.controller) updateNotice(registration.waiting);
      registration.addEventListener('updatefound',()=>{
        const worker=registration.installing;
        worker?.addEventListener('statechange',()=>{
          if(worker.state==='installed' && navigator.serviceWorker.controller)updateNotice(registration.waiting||worker);
        });
      });
      await registration.update();
    }
    catch { window.dispatchEvent(new CustomEvent('ism-install-error')); }
  }
  navigator.serviceWorker?.addEventListener('controllerchange',()=>{
    if (updating) location.reload();
    else if (hadController) updateNotice(null);
  });
  window.addEventListener('online',()=>registration?.update().catch(()=>{}));
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); deferred = event;
    window.dispatchEvent(new CustomEvent('ism-install-ready'));
  });
  window.addEventListener('appinstalled', () => {
    deferred = null; window.dispatchEvent(new CustomEvent('ism-installed'));
  });
  window.ISMInstall = {
    isStandalone,
    async prompt() {
      if (isStandalone()) return 'installed';
      if (!deferred) return 'manual';
      const event = deferred; deferred = null;
      try { await event.prompt(); return (await event.userChoice).outcome; }
      catch { return 'manual'; }
    }
  };
})();
