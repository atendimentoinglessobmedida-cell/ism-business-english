const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
process.chdir(path.join(__dirname,'..'));const ctx={window:{}};vm.createContext(ctx);
for(const f of ['premium-courses.js','premium-dialogues.js','premium-special.js','premium-engine.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx);
const courses=ctx.window.ISM_PREMIUM_COURSES,E=ctx.window.ISMPremiumEngine;let optional=0;
for(const c of courses.filter(c=>c.id!=='P9'))for(const [i,l] of c.lessons.entries()){
 const q=l[13].listening;assert.equal(q.required,false);assert(q.text.length>100);assert(q.question&&q.feedback);assert.equal(new Set(q.options).size,3);assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3);
 const s=E.record({done:true,choiceCorrect:true,gapCorrect:true,draft:'Existing work',model:true,criteria:[true,true],oral:true});assert(E.ready(s,l));assert(E.record(s).done);assert.equal(E.count(c,{[E.lessonId(c,i)]:s}),1);optional++;
}
assert.equal(optional,50);console.log('PASS: 50 optional dialogues, answers, preserved completion and progress');
