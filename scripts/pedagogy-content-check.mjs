import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const context=vm.createContext({window:{}});
for(const name of ['premium-courses.js','premium-special.js','premium-dialogues.js','practice-content.js'])vm.runInContext(fs.readFileSync(name,'utf8'),context);
let lessons=0;
for(const course of context.window.ISM_PREMIUM_COURSES){for(const [i,l] of course.lessons.entries()){
 const id=course.id+'.'+(i+1);lessons++;
 assert(l[6]?.[l[7]],id+' choice answer must exist');
 assert(l[9]?.[1]&&l[10]&&l[11]&&l[12]?.length,id+' gap, transfer, model and criteria required');
 const q=l[13]?.listening;if(q)assert(q.options[q.answer],id+' listening answer must exist');
}}
for(const id of ['P10','P11']){const c=context.window.ISM_PREMIUM_COURSES.find(c=>c.id===id);assert(c.prerequisite&&c.outcome);const l=c.lessons[0],n=l[11].split(/\s+/).length;assert(n>=(id==='P10'?50:60)&&n<=(id==='P10'?80:90),id+' model word count');assert.equal(l[3].length%2,0);assert.equal(new Set(l[6]).size,3);assert(l[13].listening&&l[13].notes.length>=3);}
const units=context.window.ISM_EXTRA_UNITS;
for(const u of units){assert(u.choice[1][u.choice[2]],u.id+' choice');assert(u.listen[2][u.listen[3]],u.id+' listening');}
const intro=units.find(u=>u.id==='13.6').write[1],words=intro.split(/\s+/).length;
assert(words>=60&&words<=90,'13.6 model must meet its 60–90 word instruction');
assert(units.find(u=>u.id==='15.6').write[1].includes('Learning:'),'15.6 model must demonstrate reflection required by rubric');
async function loadFunction(name,query){let handler;const c=vm.createContext({Deno:{serve:fn=>handler=fn},Response,URL});vm.runInContext(fs.readFileSync('supabase/functions/'+name+'/index.ts','utf8'),c);return (await handler(new Request('https://audit.invalid/?'+query))).json();}
const core=await loadFunction('ism-course-content','lesson=1.4');assert(core.ok);assert.equal(core.data.practice.answer,1);assert(core.data.practice.feedback.includes('What do you think? is also valid neutral English'));
const responsibilities=await loadFunction('ism-course-content','lesson=1.3');assert(responsibilities.data.notice.some(n=>n.includes('reporting relationship')));assert(!responsibilities.data.notice.some(n=>n.includes('never “report for”')));
const writing=await loadFunction('ism-premium-content','module=P2');assert(writing.ok);assert.equal(writing.data.lessons.length,8);assert(writing.data.lessons.find(l=>l.id==='P2.4').speak.startsWith('Write a polite follow-up'));
const zones=await loadFunction('ism-course-content','lesson=3.5');assert(zones.data.notice.some(n=>n.includes('on the meeting date')));assert(zones.data.practice.options[0].includes('meeting date'));
assert(context.window.ISM_PREMIUM_COURSES.find(c=>c.id==='P4').lessons[1][3][0].includes('on the meeting date'));
const globalTeam=await loadFunction('ism-premium-content','module=P4');assert(globalTeam.data.lessons.find(l=>l.id==='P4.4').learn[1][0].includes('17:00 UTC'));
const interview=await loadFunction('ism-interview-content','lesson=15.1');assert(interview.data.learn[1][1].includes('com o qual'));
console.log(`PASS: ${lessons} local Premium lessons, ${units.length} extra units, answer indices, ${words}-word introduction, STAR reflection and corrected Core/P2 response contracts.`);
