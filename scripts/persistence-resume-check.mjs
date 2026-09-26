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

for (const [name, source] of [
  ['experience.js', experience],
  ['learner-features.js', learner],
  ['speaking-experience.js', speaking],
  ['adaptive-coach.js', coach],
]) {
  assert(/ISMStorage|localStorage/.test(source), `${name} participates directly in persisted learner state`);
}

// These feature modules intentionally use the canonical hydrated window.state.
// Persistence is centralized through experience.js/window.save rather than duplicated per module.
assert(/window\.state/.test(myEnglish), 'My Business English reads canonical hydrated learner state');
assert(/window\.state/.test(realBusiness) && /window\.save/.test(realBusiness), 'Real Business English reads canonical state and saves through the shared persistence path');
assert(/speakingEvidence/.test(speaking), 'speaking evidence is retained for learner resume/profile');
assert(/SMART REVIEW 2\.0/.test(learner), 'Smart Review 2.0 state contract is present');
assert(/window\.ISMMyEnglish/.test(myEnglish), 'My Business English exposes its integration contract');
assert(/window\.ISMRealBusiness/.test(realBusiness), 'Real Business English exposes its integration contract');

// storage-guard.js is loaded by the document before the application state is hydrated;
// unlike executable UI modules it does not need to be a service-worker shell entry.
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
