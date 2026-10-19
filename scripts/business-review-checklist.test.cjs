const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','business-practice.js'),'utf8');
function fixture(complete=false){
 const answers={};if(complete)for(const id of ['match:0','order:0','gap:0','exercise:0','listening:0','review:0'])answers[id]={correct:true};
 const context=vm.createContext({lesson:{vocabulary:[{}],order:['We can help.'],practice:[{}],listening:[{}]},record:()=>({answers}),requirements:()=>({simulation:complete?4:0,writing:complete?65:12,criteria:complete,oral:complete}),gapItems:()=>[{}],reviewItems:()=>[{id:'review:0'}]});
 const start=source.indexOf(' function reviewChecklist('),end=source.indexOf(' function openReviewStage(',start);assert.ok(start>=0&&end>start);vm.runInContext(source.slice(start,end)+'\nthis.check=reviewChecklist;this.target=mistakeStage;',context);return context;
}
test('checklist exposes all eight outstanding requirements and their exact destinations',()=>{const f=fixture(),rows=f.check();assert.equal(rows.length,8);assert.ok(rows.every(x=>x.done===false));assert.deepEqual(Array.from(rows,x=>x.stage),[1,2,4,7,5,6,6,6]);assert.match(rows[0].note,/0 de 3/);});
test('fulfilled objective and self-assessed requirements are marked complete',()=>{const rows=fixture(true).check();assert.ok(rows.every(x=>x.done===true));assert.match(rows[0].note,/3 de 3/);});
test('gap and final-recovery mistakes return to the activity that owns the answer',()=>{const f=fixture();for(const key of ['match:0','order:0','gap:0'])assert.equal(f.target(key),1);assert.equal(f.target('exercise:0'),2);assert.equal(f.target('listening:0'),4);assert.equal(f.target('review:0'),7);});
