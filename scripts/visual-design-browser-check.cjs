const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require(process.env.ISM_PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..'),out=process.env.ISM_QA_OUTPUT;
const server=http.createServer((req,res)=>{let f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(f===root)f=path.join(root,'index.html');if(!f.startsWith(root+path.sep))return res.writeHead(404).end();fs.readFile(f,(err,b)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.avif':'image/avif','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream');res.end(b)})});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,...(process.env.ISM_BROWSER_CHANNEL?{channel:process.env.ISM_BROWSER_CHANNEL}:{})});try{
for(const width of [320,390,768,1280]){
 const page=await browser.newPage({viewport:{width,height:900},serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port);await page.locator('.visual-learning-section').waitFor();await page.locator('.visual-learning-section').scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>[...document.querySelectorAll('.visual-scene img')].every(i=>i.complete&&i.naturalWidth>0));
 assert.equal(await page.locator('.visual-scene').count(),4);
 assert(await page.locator('.visual-scene img').evaluateAll(images=>images.every(i=>i.currentSrc.endsWith('.avif')&&i.naturalWidth>=1000)));
 assert.equal(await page.locator('.visual-photo-credits a').getAttribute('href'),'photo-credits.html');
 const cards=await page.locator('.visual-scene').evaluateAll(nodes=>nodes.map(n=>{const i=n.querySelector('img').getBoundingClientRect(),c=n.querySelector('.visual-scene-copy').getBoundingClientRect();return {ratio:i.width/i.height,labelBelow:c.top>=i.bottom-1,height:n.offsetHeight,fit:getComputedStyle(n.querySelector('img')).objectFit}}));
 for(const card of cards){assert(Math.abs(card.ratio-16/9)<.02);assert(card.labelBelow);assert.equal(card.fit,'cover');assert(card.height>=44)}
 await page.locator('.visual-scene img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));
 if(out)await page.locator('.visual-learning-section').screenshot({path:path.join(out,`fotos-cenarios-${width}.png`)});
 for(let i=0;i<4;i++){await page.evaluate(()=>{setNav('home');show('home')});await page.locator('.visual-scene').nth(i).click();assert.equal(await page.locator('.panel.on').getAttribute('id'),i<2?'journey':'simulate')}
 await page.evaluate(()=>{show('lesson');document.getElementById('lessonBody').innerHTML='<div class="lesson-flow-head"><h2>Presenting results</h2></div><div class="lesson-goal"><p>Explain a clear trend.</p></div><section><h3>Practice</h3><p>Distractor: negotiate a deadline.</p></section>'});
 await page.locator('.lesson-visual').waitFor();assert((await page.locator('.lesson-visual img').getAttribute('src')).includes('presentations'));
 assert(await page.locator('.lesson-visual').evaluate(e=>e.previousElementSibling.className==='lesson-goal'));
 await page.locator('.lesson-visual img').evaluate(i=>i.decode());
 if(out)await page.locator('#lessonBody').screenshot({path:path.join(out,`fotos-licao-${width}.png`)});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
 await page.evaluate(()=>{show('home');document.querySelector('.visual-scene img').src='missing-visual-test.svg'});await page.locator('.visual-scene').first().focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.panel.on').getAttribute('id'),'journey');
 await page.emulateMedia({reducedMotion:'reduce'});assert(await page.locator('.visual-scene').first().evaluate(e=>parseFloat(getComputedStyle(e).transitionDuration)<=0.001));
 console.log(`PASS visual ${width}px: photo proportions, labels outside image, 4 navigation actions, lesson semantics/order, overflow, reduced motion`);await page.close();
}
}finally{await browser.close();server.close()}})().catch(e=>{console.error(e);server.close();process.exitCode=1});
