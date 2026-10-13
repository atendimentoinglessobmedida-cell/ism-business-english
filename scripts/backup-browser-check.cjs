const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require(process.env.ISM_PLAYWRIGHT_MODULE||'playwright');
const repo=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
 const name=new URL(req.url,'http://localhost').pathname;
 if(name==='/storage-guard.js'){res.setHeader('Content-Type','text/javascript; charset=utf-8');return res.end(fs.readFileSync(path.join(repo,'storage-guard.js')));}
 if(name==='/intent-paths.js'){res.setHeader('Content-Type','text/javascript');return res.end('');}
 res.setHeader('Content-Type','text/html; charset=utf-8');res.end('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><main><div id="learnerSupport"></div></main><script src="storage-guard.js"></script>');
});
const file=(records)=>({name:'progress.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'ism-business-backup-v1',records}))});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,channel:'msedge'});let checks=0;try{
 for(const width of [320,390,768,1280]){
  const page=await browser.newPage({viewport:{width,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+server.address().port);
  await page.evaluate(async()=>{localStorage.setItem('ismbe:v9',JSON.stringify({draft:'current',lessons:{'2.1':'mastered'}}));localStorage.setItem('ismbe:goal','foundation');sessionStorage.setItem('ism:premium:session:v1','must-stay');await ISMStorage.ready();});
  await page.locator('summary').click();const replacement={'ismbe:v9':{draft:'restored',lessons:{'3.1':'mastered'}},'ismbe:goal':'influence','ismbe:session':{token:'must-ignore'}};
  await page.locator('[data-import]').setInputFiles(file(replacement));await page.locator('[data-confirm]').waitFor();assert.match(await page.locator('[data-summary]').innerText(),/2 registros válidos; 2 serão substituídos; 1/);
  assert.equal(await page.evaluate(()=>ISMStorage.read('ismbe:v9').draft),'current');await page.locator('[data-cancel]').click();assert.equal(await page.evaluate(()=>ISMStorage.read('ismbe:v9').draft),'current');
  await page.locator('[data-import]').setInputFiles(file(replacement));await page.locator('[data-confirm]').waitFor();const download=page.waitForEvent('download');await page.locator('[data-confirm]').click();const saved=JSON.parse(fs.readFileSync(await (await download).path(),'utf8'));assert.equal(saved.records['ismbe:v9'].draft,'current');
  await page.waitForFunction(()=>localStorage.getItem('ismbe:goal')==='influence');await page.waitForTimeout(850);assert.equal(await page.evaluate(()=>ISMStorage.read('ismbe:v9').draft),'restored');assert.equal(await page.evaluate(()=>sessionStorage.getItem('ism:premium:session:v1')),'must-stay');assert.equal(await page.evaluate(()=>localStorage.getItem('ismbe:session')),null);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);checks+=5;await page.close();
 }
 const page=await browser.newPage();await page.goto('http://127.0.0.1:'+server.address().port);
 const tests=await page.evaluate(async()=>{
  let count=0;const ensure=(v,m)=>{if(!v)throw Error(m);count++;};const backup=records=>new File([JSON.stringify({format:'ism-business-backup-v1',records})],'backup.json');
  localStorage.setItem('ismbe:v9',JSON.stringify({draft:'before'}));await ISMStorage.ready();
  for(const records of [{'ismbe:v9':{token:'secret'}},{'ismbe:v9':JSON.parse('{"__proto__":{"polluted":true}}')},{'ismbe:v9':[]},{'ismbe:goal':'invalid'}]){let rejected=false;try{await ISMStorage.previewBackup(backup(records));}catch{rejected=true;}ensure(rejected,'bad input accepted');}
  let rejected=false;try{await ISMStorage.previewBackup(new File(['x'.repeat(2*1024*1024+1)],'large.json'));}catch{rejected=true;}ensure(rejected,'size accepted');
  rejected=false;try{await ISMStorage.importBackup(backup({'ismbe:v9':{draft:'no'}}));}catch{rejected=true;}ensure(rejected&&ISMStorage.read('ismbe:v9').draft==='before','confirmation bypass');
  const beforeDB=JSON.stringify(await ISMStorage.dbGet('ismbe:v9')),plan=await ISMStorage.previewBackup(backup({'ismbe:v9':{draft:'after'},'ismbe:audio:v1':{voice:'British'}}));
  const oldSet=Storage.prototype.setItem;let failed=false;Storage.prototype.setItem=function(k,v){if(k==='ismbe:audio:v1'&&!failed){failed=true;throw new DOMException('full','QuotaExceededError');}return oldSet.call(this,k,v);};
  rejected=false;try{await ISMStorage.restoreBackup(plan);}catch{rejected=true;}finally{Storage.prototype.setItem=oldSet;}
  ensure(rejected&&ISMStorage.read('ismbe:v9').draft==='before','failed restore replaced state');ensure(JSON.stringify(await ISMStorage.dbGet('ismbe:v9'))===beforeDB,'failed restore changed indexeddb');
  localStorage.setItem('ismbe:session',JSON.stringify({token:'never-export'}));
  const db=await new Promise(r=>{const req=indexedDB.open('ism-business-progress',1);req.onsuccess=()=>r(req.result);});await new Promise(r=>{const tx=db.transaction('records','readwrite');tx.objectStore('records').put({draft:'other page'},'ismbe:premium:authored:p10:v1');tx.oncomplete=r;});
  const exported=await ISMStorage.exportBackup();ensure(!exported.records['ismbe:session'],'credential export');ensure(exported.records['ismbe:premium:authored:p10:v1'].draft==='other page','unhydrated DB record lost');
  return count;
 });checks+=tests;
 const fallback=await browser.newPage();await fallback.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new DOMException('blocked','SecurityError');};});await fallback.goto('http://127.0.0.1:'+server.address().port);
 await fallback.evaluate(async()=>{await ISMStorage.ready();const db=await new Promise(r=>{const q=indexedDB.open('ism-business-progress',1);q.onsuccess=()=>r(q.result);});await new Promise(r=>{const tx=db.transaction('records','readwrite');tx.objectStore('records').put({draft:'fallback'},'ismbe:practice-lab:v1');tx.oncomplete=r;});const data=await ISMStorage.exportBackup();if(data.records['ismbe:practice-lab:v1'].draft!=='fallback')throw Error('fallback export lost unopened record');});checks++;
 console.log(JSON.stringify({checks,widths:[320,390,768,1280],status:'passed',scope:'preview/cancel/confirm/reload, previous backup, access excluded, legacy v1, invalid/oversized input, partial-write rollback, unopened IndexedDB and fallback export'}));
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
