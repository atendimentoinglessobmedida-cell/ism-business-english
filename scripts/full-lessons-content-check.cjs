const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync('business-practice-content.js','utf8'),sandbox);
const lessons=sandbox.window.ISM_BUSINESS_PRACTICE,ids=new Set(),images=new Set();assert.equal(lessons.length,3);
for(const l of lessons){
 assert(!ids.has(l.id));ids.add(l.id);assert(!images.has(l.image));images.add(l.image);assert(fs.existsSync(l.image));assert.equal(l.vocabulary.length,12);assert.equal(new Set(l.vocabulary.map(v=>v[0])).size,12);
 assert.equal(l.dialogue.length,12);assert.equal(new Set(l.dialogue.map(v=>v[0])).size,2);
 const transcript=l.dialogue.map(v=>v[1]).join(' ').toLowerCase();for(const [term,translation,example] of l.vocabulary){assert(translation.length>2);assert(example.toLowerCase().includes(term),term+' missing from example');assert(transcript.includes(term),term+' missing from dialogue');}
 for(const q of [...l.practice,...l.listening]){assert.equal(q.length,4);assert.equal(q[2].length,3);assert.equal(new Set(q[2]).size,3);assert(q[2].includes(q[1]));assert(q[3].length>30);}
 assert.equal(l.practice.length,6);assert.equal(l.listening.length,5);assert.equal(l.order.length,3);assert.equal(l.simulation.length,4);assert.equal(l.rubric.length,4);const count=l.model.trim().split(/\s+/).length;assert(count>=60&&count<=90,l.id+' model should demonstrate word range');
}
const sw=fs.readFileSync('sw.js','utf8');for(const file of ['business-practice.html','business-practice.js','business-practice.css','business-practice-content.js'])assert(sw.includes(file));assert(fs.readFileSync('storage-guard.js','utf8').includes("'ismbe:practice-course:v1'"));
console.log('PASS: 3 original lessons; 36 contextual expressions/examples; 36 dialogue turns; 6 game instances; 18 practice questions; 15 listening questions; 12 simulation prompts; model word counts, vocabulary recycling, distinct images, backup and offline inventory.');
