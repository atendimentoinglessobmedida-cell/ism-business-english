(() => {
  let deferred = null;
  const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  async function register() {
    if (!('serviceWorker' in navigator)) return;
    try { await navigator.serviceWorker.register('./sw.js'); }
    catch { window.dispatchEvent(new CustomEvent('ism-install-error')); }
  }
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
