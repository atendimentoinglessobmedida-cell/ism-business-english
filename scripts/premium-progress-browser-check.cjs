const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require(process.env.ISM_PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..'),output=process.env.ISM_QA_OUTPUT;
const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(file===root)file=path.join(root,'index.html');if(!file.startsWith(root+path.sep))return res.writeHead(403).end();fs.readFile(file,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.avif':'image/avif','.svg':'image/svg+xml','.png':'image/png'})[path.extname(file)]||'application/octet-stream');res.end(data);});});
const original={done:{'P3.1':true},drafts:{'P3.1':'Original remote draft'},practice:{'P3.1':true},lessons:{'P3.2':{done:true,draft:'Original authored draft',model:true,criteria:[true,true],oral:true}}};
(async()=>{await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;try{browser=await chromium.launch({headless:true,...(process.env.ISM_BROWSER_CHANNEL?{channel:process.env.ISM_BROWSER_CHANNEL}:{})});
for(const width of [390,1280]){
 const page=await browser.newPage({viewport:{width,height:900},serviceWorkers:'block'}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 // This fixture isolates progress compatibility; it does not validate real authorization.
 await page.route('**/ism-premium-gateway/**',async route=>{
  const url=new URL(route.request().url());
  if(url.pathname.endsWith('/session'))return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,token:'fixture-session-only',expiresAt:Date.now()+3600000})});
  const name=url.searchParams.get('name');
  if(url.pathname.endsWith('/asset')&&['premium-courses.js','premium-special.js','premium-dialogues.js','premium-authentic-listening.js','premium-british-comparison.js'].includes(name))return route.fulfill({status:200,contentType:'text/javascript',body:fs.readFileSync(path.join(root,name),'utf8')});
  return route.fulfill({status:404,body:'Fixture does not cover this endpoint'});
 });
 await page.addInitScript(record=>{if(!localStorage.getItem('fixture-seeded')){localStorage.setItem('ismbe:premium:p3:v1',JSON.stringify(record));localStorage.setItem('fixture-seeded','true');}},original);
 const base='http://127.0.0.1:'+server.address().port;
 await page.goto(base+'/premium.html',{waitUntil:'networkidle'});
 if(await page.locator('dialog[open]').count()){
  assert.equal(await page.locator('dialog a').evaluate(e=>getComputedStyle(e).color),'rgb(7, 86, 107)');
  assert.equal(await page.locator('dialog button').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(6, 43, 59)');
 await page.evaluate(()=>scrollTo(0,0));
 if(output){fs.mkdirSync(output,{recursive:true});await page.screenshot({path:path.join(output,`premium-login-${width}.png`)});}
  await page.locator('input[name=email]').fill('fixture@example.test');
  await page.locator('input[name=code]').fill('fixture-code');
  await page.getByRole('button',{name:'Entrar',exact:true}).click();
 }
 assert((await page.locator('.premium-overall').innerText()).includes('1/57 lições de prática aplicada'));
 assert((await page.locator('#course-view').innerText()).includes('registros separados'));
 assert.equal(await page.locator('.premium-track-visual').count(),7);
 for(const img of await page.locator('.premium-track-visual').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());assert(await img.evaluate(i=>i.naturalWidth>=1000&&i.currentSrc.endsWith('.avif')));}
 await page.evaluate(()=>scrollTo(0,0));
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('ismbe:premium:p3:v1'))),original);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 if(output){fs.mkdirSync(output,{recursive:true});await page.screenshot({path:path.join(output,`progresso-hub-${width}.png`),fullPage:true});await page.locator('.premium-track-card').first().screenshot({path:path.join(output,`fotos-premium-card-${width}.png`)});}
 await page.goto(base+'/premium.html#P3/2',{waitUntil:'networkidle'});
 assert.equal(await page.locator('#draft').inputValue(),'Original authored draft');
 const updated='I help teams improve onboarding. New draft '+width;
 await page.locator('#draft').fill(updated);
 assert((await page.locator('#draft-status').innerText()).includes('Rascunho salvo'));
 await page.reload({waitUntil:'networkidle'});
 assert.equal(await page.locator('#draft').inputValue(),updated);
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('ismbe:premium:p3:v1'))),original,'editing and reload preserve complete source');
 const authored=await page.evaluate(()=>JSON.parse(localStorage.getItem('ismbe:premium:authored:p3:v1')));
 assert.equal(authored.lessons['P3.2'].draft,updated);assert.equal(authored.lessons['P3.2'].done,true);
 assert.deepEqual(authored.lessons['P3.2'].criteria,[]);assert.equal(authored.lessons['P3.2'].oral,false);
 if(output)await page.locator('#draft').screenshot({path:path.join(output,`progresso-rascunho-${width}.png`)});

 const catalogue=await page.evaluate(()=>window.ISM_PREMIUM_COURSES.map(c=>({id:c.id,total:c.lessons.length})));
 let audited=0;
 for(const c of catalogue)for(let i=1;i<=c.total;i++){
 await page.evaluate(hash=>location.hash=hash,c.id+'/'+i);await page.waitForFunction(id=>document.querySelector('.reading .ey')?.textContent.startsWith(id+' ·'),c.id+'.'+i);
 assert.equal(await page.locator('#language .en').count(),await page.evaluate(()=>{const route=ISMPremiumEngine.route(location.hash,ISM_PREMIUM_COURSES);return route.course.lessons[route.index][3].length/2}));
 assert.equal(await page.locator('#oral>.learning-rubric').count(),1);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 audited++;
 }
 assert.equal(audited,57);
 await page.evaluate(()=>location.hash='P3/1');await page.waitForFunction(()=>document.querySelector('.reading .ey')?.textContent.startsWith('P3.1 ·'));
 await page.locator('[data-finish]').click();assert((await page.locator('#finish-status').innerText()).includes('Para concluir, falta:'));
 console.log('PASS '+width+'px: all 57 authored lessons render, bilingual pairing, oral markup, overflow and specific completion guidance');
 await page.goto(base+'/index.html#premium',{waitUntil:'networkidle'});
 assert((await page.locator('#premiumTracks').innerText()).includes('1/88 lições'));
 assert((await page.locator('#premiumTracks').innerText()).includes('trilhas originais concluídas'));
 assert.equal(await page.locator('#premium .premium a.btn').innerText(),'ACESSAR CONTEÚDO PREMIUM →');
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 if(output)await page.screenshot({path:path.join(output,`progresso-original-${width}.png`),fullPage:true});
 assert.deepEqual(errors,[]);console.log(`PASS ${width}px: hub 1/57, original 1/88, migration, draft edit/reload, source intact, no overflow or JS errors`);
 await page.close();
}
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}})().catch(error=>{console.error(error);process.exitCode=1;});
