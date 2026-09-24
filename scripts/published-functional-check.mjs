import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8'),assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
const html=read('index.html'),premium=read('premium.html'),storage=read('storage-guard.js'),audio=read('audio-player.js'),sw=read('sw.js'),features=read('learner-features.js'),coreCss=read('core-shell.css');
assert(html.includes('core-shell.css?v=1')&&html.includes('learner-features.js?v=2'),'Core modular assets missing');assert(features.includes('startSmartReview')&&features.includes('rateReview')&&features.includes('reviewPriority')&&features.includes('openBusinessMode'),'Learner feature module incomplete');assert(coreCss.includes('Core shell base styles'),'Core shell stylesheet missing');assert(html.includes('reviewDone')&&html.includes('reviewHistory'),'Learning evidence state missing');assert(html.includes("Complete pelo menos um desafio da etapa Revise"),'Revise mastery gate missing');assert(storage.includes("mode:storageAvailable?'persistent':'session'"),'Session-safe storage fallback missing');assert(/id="home" class="panel on"/.test(html),'Home panel missing');
for(const id of ['home','journey','practice','simulate','toolkit','premium'])assert(html.includes('id="'+id+'"'),'Core panel missing: '+id);
assert(html.includes('function applyRoute')&&html.includes("addEventListener('hashchange'"),'Core route restoration missing');
assert(html.includes('function continueLearning')&&html.includes('function retryExercise'),'Learning continuation/retry missing');
assert(html.includes('function renderSkills')&&html.includes('function updateToday'),'Home/Journey learning guidance missing');
assert(storage.includes('ism-business-backup-v1')&&storage.includes('restoreLastGood'),'Backup/recovery contract missing');
assert(audio.includes('function capability')&&audio.includes('window.ISMAudio'),'Audio capability contract missing');
assert(premium.includes('premium-shell.js')&&premium.includes('premium-study.js'),'Premium shared runtime missing');
for(const file of ['premium.html','interview.html','emails.html','networking.html','global-teams.html','negotiation.html','difficult-conversations.html','leadership.html','career-growth.html']){const h=read(file);assert(h.includes('premium-shell.css')&&h.includes('premium-shell.js'),'Premium shell missing: '+file);assert(h.includes('storage-guard.js'),'Storage guard missing: '+file);}
assert(sw.includes("const CACHE='ism-business-v48'"),'Expected current PWA cache version');
assert(sw.includes('API_CACHE')&&sw.includes('caches.match(req)'),'Offline API fallback missing');
console.log('functional contracts ok');