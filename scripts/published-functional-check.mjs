import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8'),assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
const html=read('index.html'),premium=read('premium.html'),storage=read('storage-guard.js'),audio=read('audio-player.js'),sw=read('sw.js');
assert(/id="home" class="panel on"/.test(html),'Home panel missing');
for(const id of ['home','journey','practice','simulate','toolkit','premium'])assert(html.includes('id="'+id+'"'),'Core panel missing: '+id);
assert(html.includes('function applyRoute')&&html.includes("addEventListener('hashchange'"),'Core route restoration missing');
assert(html.includes('function continueLearning')&&html.includes('function retryExercise'),'Learning continuation/retry missing');
assert(html.includes('function renderSkills')&&html.includes('function updateToday'),'Home/Journey learning guidance missing');
assert(storage.includes('ism-business-backup-v1')&&storage.includes('restoreLastGood'),'Backup/recovery contract missing');
assert(audio.includes('function capability')&&audio.includes('window.ISMAudio'),'Audio capability contract missing');
assert(premium.includes('premium-shell.js')&&premium.includes('premium-study.js'),'Premium shared runtime missing');
for(const file of ['premium.html','interview.html','emails.html','networking.html','global-teams.html','negotiation.html','difficult-conversations.html','leadership.html','career-growth.html']){const h=read(file);assert(h.includes('premium-shell.css')&&h.includes('premium-shell.js'),'Premium shell missing: '+file);assert(h.includes('storage-guard.js'),'Storage guard missing: '+file);}
assert(sw.includes("const CACHE='ism-business-v42'"),'Expected current PWA cache version');
assert(sw.includes('API_CACHE')&&sw.includes('caches.match(req)'),'Offline API fallback missing');
console.log('functional contracts ok');