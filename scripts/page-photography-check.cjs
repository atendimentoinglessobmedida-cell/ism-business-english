const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require(process.env.ISM_PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..'),out=process.env.ISM_QA_OUTPUT;
const server=http.createServer((req,res)=>{let f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(f===root)f=path.join(root,'index.html');if(!f.startsWith(root+path.sep))return res.writeHead(404).end();fs.readFile(f,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.avif':'image/avif','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream');res.end(b)})});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,...(process.env.ISM_BROWSER_CHANNEL?{channel:process.env.ISM_BROWSER_CHANNEL}:{})});try{
const base='http://127.0.0.1:'+server.address().port;
for(const width of [320,390,768,1280]){
 const page=await browser.newPage({viewport:{width,height:900},serviceWorkers:'block'});
 await page.goto(base);await page.locator('.home-photo-cover img').evaluate(i=>i.decode());
 assert.equal(await page.locator('.home-photo-cover').count(),1);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 if(out)await page.locator('.home-photo-cover').screenshot({path:path.join(out,`capa-fotografica-${width}.png`)});
 for(const id of ['journey','simulate','toolkit']){await page.evaluate(id=>{setNav(id);show(id)},id);assert.equal(await page.locator('#'+id+' .page-context-photo').count(),1);await page.locator('#'+id+' .page-context-photo').evaluate(i=>i.decode());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 await page.goto(base+'/planos.html');await page.locator('.intro .page-context-photo').evaluate(i=>i.decode());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 console.log(`PASS ${width}px: cover, Journey/Simulation/Toolkit photos, plans photo, decoding and no overflow`);await page.close();
}
// Isolate asynchronous overview decoration without calling private course APIs.
for(const route of ['premium','interview','emails','networking','global-teams','negotiation','difficult-conversations','leadership','career-growth']){
 const page=await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'});
 await page.route('**/'+route+'.html',r=>r.fulfill({contentType:'text/html',body:'<html><head><link rel="stylesheet" href="page-photography.css"></head><body><main><div id="view"></div></main><script src="page-photography.js"></script></body></html>'}));
 await page.goto(base+'/'+route+'.html');await page.evaluate(()=>document.getElementById('view').innerHTML='<div class="hero"><h2>Overview</h2></div>');
 await page.locator('.hero img').waitFor();await page.locator('.hero img').evaluate(i=>i.decode());
 await page.evaluate(()=>document.querySelector('.hero').append(document.createElement('p')));assert.equal(await page.locator('.hero img').count(),1);
 await page.evaluate(()=>document.getElementById('view').innerHTML='<div class="card"><h2>Exercise</h2><textarea></textarea></div>');assert.equal(await page.locator('.page-context-photo').count(),0);
 assert.equal(await page.locator('a[href="photo-credits.html"]').count(),1);await page.close();
}
console.log('PASS 9 Premium route fixtures: async overview image, no duplicates, removal on exercises, credits');
}finally{await browser.close();server.close()}})().catch(e=>{console.error(e);server.close();process.exitCode=1});
