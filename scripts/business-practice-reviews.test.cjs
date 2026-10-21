const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
test('all twelve complete lessons form four review blocks without reusing Core identifiers',async()=>{
 let adapter;
 const context=vm.createContext({window:{ISMReviewPage:{mount(value){adapter=value;return {refresh(){}};}},addEventListener(){}},document:{querySelector(){return {};}}});
 for(const name of ['business-practice-content.js','review-model.js','business-reviews.js'])vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),context);
 const rows=await adapter.load(),model=context.window.ISMReviewModel;
 assert.equal(rows.length,12);assert.equal(new Set(rows.map(l=>l.id)).size,12);
 assert.ok(rows.every(l=>l.id.startsWith('practice:')&&l.terms.length===12&&l.dialogue.length===12));
 const groups=model.blocks(rows);assert.equal(groups.length,4);
 for(const group of groups){const exercises=model.build(group);assert.ok(exercises.length>=9);assert.equal(new Set(exercises.map(q=>q.lesson)).size,3);}
 assert.equal(model.build(groups[2]).length,12);
 assert.deepEqual(Array.from(groups[2].lessons,l=>l.id),['practice:workplace-introductions','practice:scheduling-a-meeting','practice:taking-a-phone-message']);
 assert.deepEqual(Array.from(groups[3].lessons,l=>l.id),['practice:clarify-and-confirm','practice:concise-project-update','practice:handover-across-teams']);
 assert.equal(model.build(groups[3]).length,12);
});
