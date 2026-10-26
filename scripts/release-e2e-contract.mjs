import fs from 'node:fs';
const read=f=>fs.readFileSync(f,'utf8');
let failed=false;
function check(ok,msg){console.log(`${ok?'PASS':'FAIL'}: ${msg}`);if(!ok)failed=true}
const index=read('index.html'), exp=read('experience.js'), learner=read('learner-features.js'), speak=read('speaking-experience.js'), coach=read('adaptive-coach.js'), mine=read('my-business-english.js'), real=read('real-business.js'), storage=read('storage-guard.js'), sw=read('sw.js');
const all=[index,exp,learner,speak,coach,mine,real].join('\n');
check(/continueLearning\(\)/.test(index),'Home exposes Continue Learning');
check(/startSmartReview\(\)/.test(index),'Home exposes Smart Review');
check(/openBusinessMode\(\)/.test(index),'Home exposes Business Mode');
check(/data-p="journey"/.test(index)&&/data-p="practice"/.test(index)&&/data-p="simulate"/.test(index)&&/data-p="toolkit"/.test(index),'primary learner navigation is present');
check(/renderSimulation/.test(all),'simulation flow is wired');
check(/speakingEvidence/.test(speak),'speaking attempts create learner evidence');
check(/window\.ISMMyEnglish/.test(mine),'My Business English integration is available');
check(/window\.ISMRealBusiness/.test(real),'Real Business English integration is available');
check(/ISMStorage\.read\('ismbe:v9'/.test(index),'Core hydrates canonical learner state');
check(/restoreLastGood/.test(storage)&&/snapshotPrefix/.test(storage),'corruption recovery uses last-known-good snapshots');
check(/indexedDB\.open/.test(storage)&&/localStorage\.setItem/.test(storage),'persistence has localStorage and IndexedDB paths');
check(/hydrate\(/.test(storage)&&/ready\(/.test(storage),'resume waits for asynchronous hydration');
check(/visibilitychange|pagehide|beforeunload/.test(all),'lifecycle interruption handling exists');
check(/SMART REVIEW 2\.0/.test(learner),'Smart Review 2.0 is active');
check(/ISMCoach|coach/i.test(coach),'adaptive Coach is active');
check(/experience\.js/.test(sw)&&/speaking-experience\.js/.test(sw)&&/my-business-english\.js/.test(sw)&&/real-business\.js/.test(sw),'critical learner modules are in offline shell');
check(/offline|cache/i.test(sw),'service worker contains offline/cache behavior');
if(failed){console.error('\nRelease journey contract failed. Promotion must remain blocked.');process.exit(1)}
console.log('\nRelease journey contract ok');
