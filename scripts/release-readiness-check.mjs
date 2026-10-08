import fs from 'node:fs';
import assert from 'node:assert/strict';
const read = file => fs.readFileSync(file, 'utf8');
const rollout = read('PREMIUM-ACCESS-ROLLOUT.md');
const build = read('scripts/build-static.mjs');
const config = JSON.parse(read('vercel.json'));
const privateAssets = ['premium-courses.js','premium-special.js','premium-dialogues.js','premium-authentic-listening.js','premium-british-comparison.js'];
assert.equal(config.outputDirectory, 'dist', 'Only dist may be deployed');
for (const asset of privateAssets) {
  assert(build.includes(asset), 'Missing private asset exclusion: ' + asset);
}
assert(build.includes('privateAssets.has(entry.name)'), 'Build must exclude private Premium scripts');
assert(build.includes('Internal repository files leaked'), 'Build must reject internal file leaks');
assert(rollout.includes('The transition therefore does not constitute complete Premium enforcement.'), 'Review legacy endpoint protection before declaring Premium enforcement');
console.log('Release readiness source guards passed. Live endpoint authorization and device QA remain mandatory.');
