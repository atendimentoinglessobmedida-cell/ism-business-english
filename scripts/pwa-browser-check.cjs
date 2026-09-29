const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require(process.env.ISM_PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..');
let legacy=true;
const oldWorker="self.addEventListener('install',e=>self.skipWaiting());self.addEventListener('activate',e=>e.waitUntil(caches.open('ism-business-api-v1').then(c=>c.put('/legacy-private',new Response('old content'))).then(()=>self.clients.claim())))";
const server=http.createServer((req,res)=>{
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(pathname==='/sw.js'&&legacy){res.setHeader('Content-Type','text/javascript');res.setHeader('Cache-Control','no-store');return res.end(oldWorker)}
 let f=path.resolve(root,'.'+pathname);if(f===root)f=path.join(root,'index.html');
 if(!f.startsWith(root+path.sep))return res.writeHead(403).end();
 fs.readFile(f,(err,data)=>{if(err)return res.writeHead(404).end();res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.webmanifest':'application/manifest+json','.avif':'image/avif','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'application/octet-stream');res.end(data)});
});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,...(process.env.ISM_BROWSER_CHANNEL?{channel:process.env.ISM_BROWSER_CHANNEL}:{})});try{
 const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const origin='http://127.0.0.1:'+server.address().port;
 await page.goto(origin+'/install.html');await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>navigator.serviceWorker.controller);
 await page.evaluate(()=>localStorage.setItem('ismbe:premium:p3:v1',JSON.stringify({done:{'P3.1':true},drafts:{'P3.1':'My saved answer'}})));
 assert((await page.evaluate(()=>caches.keys())).includes('ism-business-api-v1'));
 legacy=false;
 await page.evaluate(async()=>{const prior=navigator.serviceWorker.controller,reg=await navigator.serviceWorker.getRegistration();const changed=new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));await reg.update();if(navigator.serviceWorker.controller===prior)await changed});
 await page.waitForFunction(async()=>!(await caches.keys()).includes('ism-business-api-v1'));
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ismbe:premium:p3:v1')).drafts['P3.1']),'My saved answer');
 await page.reload();await page.waitForFunction(()=>window.ISMInstall);
 await page.locator('#install').click();assert((await page.locator('#status').innerText()).includes('menu'));
 await page.evaluate(()=>{const e=new Event('beforeinstallprompt',{cancelable:true});e.prompt=async()=>{};e.userChoice=Promise.resolve({outcome:'accepted'});window.dispatchEvent(e)});
 await page.locator('#install').click();assert((await page.locator('#status').innerText()).includes('iniciada'));
 await page.evaluate(()=>window.dispatchEvent(new Event('appinstalled')));assert((await page.locator('#install').innerText()).includes('INSTALADO'));
 await page.evaluate(async()=>{const cache=await caches.open('ism-business-core-api-v2');await cache.put('https://bfuoykappwybuxdlrbmo.supabase.co/functions/v1/ism-course-content?lesson=1.1',new Response(JSON.stringify({ok:true,fixture:'core-offline'}),{headers:{'Content-Type':'application/json'}}))});
 await context.setOffline(true);
 const offline=await page.evaluate(async()=>{const core=await fetch('https://bfuoykappwybuxdlrbmo.supabase.co/functions/v1/ism-course-content?lesson=1.1'),premium=await fetch('https://bfuoykappwybuxdlrbmo.supabase.co/functions/v1/ism-premium-gateway/asset?name=premium-courses.js');return {core:await core.json(),premium:premium.status}});
 assert.equal(offline.core.fixture,'core-offline');assert.equal(offline.premium,503);
 await page.reload();assert(await page.locator('h1').isVisible());
 const photos=await page.evaluate(async()=>Promise.all(['meetings','presentations','negotiation','client-call','interview','writing','networking'].map(async id=>{const r=await fetch('assets/photo-'+id+'.avif');return r.ok&&(await r.arrayBuffer()).byteLength>1000})));assert(photos.every(Boolean),'all seven licensed photos available offline');
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ismbe:premium:p3:v1')).done['P3.1']),true);
 assert.deepEqual(errors,[]);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 console.log('PASS PWA: legacy cache removed, update preserves progress/drafts, manual and simulated native install flows, offline install shell/Core fixture, Premium denied offline, 390px layout. Physical installation not certified.');
 await context.close();
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
