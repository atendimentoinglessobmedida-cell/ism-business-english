const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('ism-answer-order.js','utf8'),ctx);
const E=ctx.window.ISMAnswerOrder;
for(let run=0;run<100;run++){
 const items=Array.from({length:15},(_,i)=>({options:['A','B','C'],correct:i%3}));
 const order=E.plan(items);const counts=[0,0,0];
 order.forEach((o,i)=>{assert.equal(o.length,3);assert.equal(new Set(o).size,3);counts[o.indexOf(items[i].correct)]++;});
 assert.equal(counts.join(','),'5,5,5');
}
for(let run=0;run<100;run++){const qs=Array.from({length:15},(_,i)=>({options:[0,1,2,3],correct:i%4}));const p=E.plan(qs),counts=[0,0,0,0];p.forEach((o,i)=>counts[o.indexOf(qs[i].correct)]++);assert.equal(Math.max(...counts)-Math.min(...counts),1);}
assert.throws(()=>E.plan([{options:['a','b'],correct:4}]));
console.log('PASS: 200 balanced quizzes, valid indexes, no duplicate options');
