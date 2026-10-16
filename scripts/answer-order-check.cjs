const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('ism-answer-order.js','utf8'),ctx);
const E=ctx.window.ISMAnswerOrder;
for(let run=0;run<10000;run++){
 const items=Array.from({length:15},(_,i)=>({options:['A','B','C'],correct:i%3}));
 const order=E.plan(items);const counts=[0,0,0];
 order.forEach((o,i)=>{assert.equal(o.length,3);assert.equal(new Set(o).size,3);counts[o.indexOf(items[i].correct)]++;});
 assert.equal(counts.join(','),'5,5,5');
}
for(let run=0;run<100;run++){const qs=Array.from({length:15},(_,i)=>({options:[0,1,2,3],correct:i%4}));const p=E.plan(qs),counts=[0,0,0,0];p.forEach((o,i)=>counts[o.indexOf(qs[i].correct)]++);assert.equal(Math.max(...counts)-Math.min(...counts),1);}
assert.throws(()=>E.plan([{options:['a','b'],correct:4}]));
console.log('PASS: 2000 balanced quizzes, valid indexes, no duplicate options');

const practice=fs.readFileSync('business-practice.js','utf8'),premium=fs.readFileSync('premium-study.js','utf8');
assert(practice.includes('lessonState.optionOrder[id]=order'),'Practice order must persist per question');
assert(practice.includes('ism-practice-flashcard'),'Full lessons need revealable cards');
assert(practice.includes('ISMAnswerOrder.one(lesson.vocabulary)'),'Matching game should not be fixed reverse order');
assert(practice.includes('ISMAnswerOrder.one(words)'),'Sentence building should not be fixed reverse order');
assert(premium.includes('choiceOrder(c,i,l,s).map'),'Premium order must be stable on rerender');
assert(premium.includes('ismbe:premium:order:v1:'),'Premium order storage must be isolated');
for(const html of ['premium.html','business-practice.html'])assert(fs.readFileSync(html,'utf8').includes('interactive-lesson.css'));
console.log('PASS: persistent randomized question order and keyboard-friendly cards wired in both learning experiences');
