import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const assert = (condition, message) => {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
};

const storage = read('storage-guard.js');
const experience = read('experience.js');
const learner = read('learner-features.js');
const speaking = read('speaking-experience.js');
const coach = read('adaptive-coach.js');
const myEnglish = read('my-business-english.js');
const realBusiness = read('real-business.js');
const sw = read('sw.js');

assert(storage.includes("prefix='ismbe:'"), 'ISM progress uses a namespaced persistence key');
assert(storage.includes('indexedDB.open'), 'IndexedDB fallback is available');
assert(storage.includes('localStorage.setItem'), 'localStorage persistence is available');
assert(storage.includes('snapshotPrefix'), 'last-known-good snapshots are maintained');
assert(storage.includes('restoreLastGood'), 'last-known-good restore path exists');
assert(storage.includes('exportBackup') && storage.includes('importBackup'), 'portable backup and restore are available');
assert(storage.includes('ready(') && storage.includes('hydrate('), 'async hydration/resume path exists');
assert(storage.includes('selfTest'), 'persistence self-test exists');
assert(storage.includes('storageHealth'), 'storage health reporting exists');

const modules = [
  ['experience.js', experience],
  ['learner-features.js', learner],
  ['speaking-experience.js', speaking],
  ['adaptive-coach.js', coach],
  ['my-business-english.js', myEnglish],
  ['real-business.js', realBusiness],
];
for (const [name, source] of modules) {
  assert(/ISMStorage|localStorage/.test(source), `${name} participates in persisted learner state or reads it`);
}

assert(/speakingEvidence/.test(speaking), 'speaking evidence is retained for learner resume/profile');
assert(/SMART REVIEW 2\.0/.test(learner), 'Smart Review 2.0 state contract is present');
assert(/window\.ISMMyEnglish/.test(myEnglish), 'My Business English exposes its integration contract');
assert(/window\.ISMRealBusiness/.test(realBusiness), 'Real Business English exposes its integration contract');
assert(/storage-guard\.js/.test(sw), 'offline shell caches storage guard');
assert(/experience\.js/.test(sw), 'offline shell caches experience integration');
assert(/adaptive-coach\.js/.test(sw), 'offline shell caches adaptive coach');
assert(/speaking-experience\.js/.test(sw), 'offline shell caches speaking experience');
assert(/my-business-english\.js/.test(sw), 'offline shell caches My Business English');
assert(/real-business\.js/.test(sw), 'offline shell caches Real Business English');

if (process.exitCode) {
  console.error('\nPersistence/resume contract failed.');
  process.exit(process.exitCode);
}
console.log('\nPersistence/resume contracts ok');
