const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require(process.env.ISM_PLAYWRIGHT_MODULE||'playwright');
const repo=path.resolve(__dirname,'..'),root=path.join(repo,'dist');
const server=http.createServer((req,res)=>{let f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(f===root)f=path.join(root,'index.html');if(!f.startsWith(root+path.sep))return res.writeHead(404).end();fs.readFile(f,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream');res.end(b)})});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,...(process.env.ISM_BROWSER_CHANNEL?{channel:process.env.ISM_BROWSER_CHANNEL}:{})});try{
for(const width of [320,390,1280]){
 const page=await browser.newPage({viewport:{width,height:900},serviceWorkers:'block'}),errors=[];let allowed=false,revoked=false,assets=0,statusFailure=false;
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/ism-premium-gateway/**',async route=>{
  const req=route.request(),url=new URL(req.url());
  if(url.pathname.endsWith('/session'))return route.fulfill({status:allowed?200:403,contentType:'application/json',body:JSON.stringify(allowed?{ok:true,token:'browser-fixture',expiresAt:Date.now()+1800000}:{ok:false})});
  if(revoked||req.headers()['x-ism-session']!=='browser-fixture')return route.fulfill({status:401,contentType:'application/json',body:'{"ok":false}'});
  if(url.pathname.endsWith('/status'))return route.fulfill({status:statusFailure?503:200,contentType:'application/json',body:'{"ok":true}'});
  const name=url.searchParams.get('name');assert(['premium-courses.js','premium-special.js','premium-dialogues.js','premium-authentic-listening.js','premium-british-comparison.js'].includes(name));assets++;
  return route.fulfill({status:200,contentType:'text/javascript',body:fs.readFileSync(path.join(repo,name),'utf8')});
 });
 const origin='http://127.0.0.1:'+server.address().port;
 assert.equal((await page.request.get(origin+'/premium-courses.js')).status(),404);
 assert.equal((await page.request.get(origin+'/supabase/functions/ism-premium-gateway/private-assets.json')).status(),404);
 await page.goto(origin+'/planos.html');await page.locator('.premium-existing a').click();await page.locator('dialog[open]').waitFor();
 await page.goto(origin+'/index.html');await page.locator('.premium-entry').waitFor();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 if(process.env.ISM_QA_OUTPUT)await page.screenshot({path:path.join(process.env.ISM_QA_OUTPUT,`premium-entry-${width}.png`)});
 await page.locator('.premium-entry').click();await page.locator('dialog[open]').waitFor();assert.equal(assets,0);
 await page.locator('[name=email]').fill('test@example.test');await page.locator('[name=code]').fill('invalid-test');await page.getByRole('button',{name:'Entrar',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#premiumAccessStatus').textContent.includes('não autorizado'));assert.equal(assets,0);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 if(process.env.ISM_QA_OUTPUT)await page.screenshot({path:path.join(process.env.ISM_QA_OUTPUT,`premium-login-${width}.png`)});
 allowed=true;await page.getByRole('button',{name:'Entrar',exact:true}).click();await page.locator('.premium-overall').waitFor();assert.equal(assets,5);assert.equal(await page.locator('dialog[open]').count(),0);
 await page.evaluate(()=>localStorage.setItem('qa-progress','preserved'));
 statusFailure=true;await page.evaluate(()=>{const event=new Event('pageshow');Object.defineProperty(event,'persisted',{value:true});window.dispatchEvent(event)});await page.waitForTimeout(100);assert.equal(await page.locator('dialog[open]').count(),0);assert(await page.evaluate(()=>sessionStorage.getItem('ism:premium:session:v1')));
 revoked=true;await page.reload();await page.locator('dialog[open]').waitFor();assert.equal(await page.evaluate(()=>sessionStorage.getItem('ism:premium:session:v1')),null);assert.equal(await page.evaluate(()=>localStorage.getItem('qa-progress')),'preserved');
 await page.locator('[name=email]').fill('test@example.test');await page.locator('[name=code]').fill('valid-but-revoked');await page.getByRole('button',{name:'Entrar',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#course-view').innerText.includes('Não foi possível carregar'));assert.equal(await page.locator('dialog[open]').count(),0);
 assert.deepEqual(errors,[]);console.log(`PASS access UI ${width}px: invalid login, protected loading/order, unauthorized re-entry, preserved progress, private URLs absent from build (gateway mocked)`);await page.close();
}
}finally{await browser.close();server.close()}})().catch(e=>{console.error(e);server.close();process.exitCode=1});
