const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const build = path.resolve(process.argv[2] || path.join(root, '../../outputs/business-lesson-neural-2026-10-21'));
const context = { window: {} };
for (const file of ['business-practice-content.js', 'business-reference-content.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
}
const voices = ['af_heart','am_michael','af_bella','am_fenrir','af_nicole','am_puck','af_sarah','am_echo','af_nova','am_liam','af_kore','am_eric','af_jessica','am_onyx','af_river','am_adam','af_sky','am_santa','af_alloy','af_aoede'];
const speakers = [...new Set(context.window.ISM_BUSINESS_PRACTICE.flatMap(lesson => lesson.dialogue.map(line => line[0])))];
if (speakers.length > voices.length) throw new Error('Assign additional real voices before generating.');
const voiceMap = Object.fromEntries(speakers.map((speaker, i) => [speaker, voices[i]]));
const jobs = context.window.ISM_BUSINESS_PRACTICE.flatMap(lesson => lesson.dialogue.map(([speaker, text], turn) => ({
  key: `${lesson.id}-turn-${turn}`, lessonId: lesson.id, turn, speaker, text,
  voice: voiceMap[speaker], lang: 'en-US', rate: 100
})));
fs.mkdirSync(build, { recursive: true });
fs.writeFileSync(path.join(build, 'jobs.json'), JSON.stringify(jobs, null, 2));
fs.writeFileSync(path.join(build, 'voices.json'), JSON.stringify(voiceMap, null, 2));
console.log(JSON.stringify({ lessons: context.window.ISM_BUSINESS_PRACTICE.length, turns: jobs.length, speakers: speakers.length, build }));
