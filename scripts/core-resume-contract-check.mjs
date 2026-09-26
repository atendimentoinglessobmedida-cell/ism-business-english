import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const html=read('index.html');
const storage=read('storage-guard.js');
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};

// Stage 1 safety net: resume must stay globally callable and persistence must remain decoupled.
assert(html.includes('onclick="continueLearning()"'),'Continue CTA is not wired');
assert(html.includes('function continueLearning'),'continueLearning is not globally declared');
assert(html.includes("ISMStorage.read('ismbe:v9','ismbe:v8')"),'Main progress state is not restored on startup');
assert(html.includes("ISMStorage.write('ismbe:v9',state)"),'Main progress state is not persisted');
assert(html.includes("window.addEventListener('beforeunload',persistState)"),'beforeunload checkpoint missing');
assert(html.includes("document.addEventListener('visibilitychange'"),'visibility checkpoint missing');
assert(html.includes("window.addEventListener('pagehide',persistState)"),'pagehide checkpoint missing');
assert(storage.includes("indexedDB.open('ism-business-progress'"),'IndexedDB fallback missing');
assert(storage.includes('snapshotPrefix'),'Last-known-good snapshot missing');
assert(storage.includes('exportBackup')&&storage.includes('importBackup'),'Portable backup missing');

// Regression guard: never wrap the Core declaration block in asynchronous storage startup.
assert(!html.includes("ISMStorage.ready().then(()=>{const API="),'Core handlers must not be scoped inside storage hydration');

console.log('core resume/persistence contracts ok');
