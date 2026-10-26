const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','business-practice.js'),'utf8');
function fixture(savedAnswer){
 const answers=[],messages=[],containers=[];
 const context=vm.createContext({
  document:{createElement(){const bank={children:[],append(b){this.children.push(b);},querySelectorAll(){return this.children;}},actions={children:[],append(...b){this.children.push(...b);}},out={textContent:''};const card={querySelector(selector){return {'.match-options':bank,'.actions':actions,'.order-answer':out}[selector];}};containers.push({card,bank,actions,out});return card;}},
  btn(text,onclick){return {text,onclick,disabled:false};},
  normal(value){return value.toLowerCase().replace(/[?.!,]/g,'').replace(/\s+/g,' ').trim();},
  record(){return {answers:{'order:0':savedAnswer}};},
  answer(...args){answers.push(args);},feedback(_host,message,correct){messages.push({message,correct});}
 });
 const start=source.indexOf(' function restoreOrder('),end=source.indexOf(' function question(',start);assert.ok(start>=0&&end>start);
 vm.runInContext(source.slice(start,end)+'\nthis.render=orderQuestion;this.restore=restoreOrder;',context);
 context.render({append(){}},'We can confirm the meeting.',0);
 return {...containers[0],answers,messages,restore:context.restore};
}
test('empty or incomplete word sequences do not record a wrong answer',()=>{
 const f=fixture();f.actions.children[0].onclick();assert.equal(f.answers.length,0);
 f.bank.children[0].onclick();f.actions.children[0].onclick();assert.equal(f.answers.length,0);assert.match(f.messages.at(-1).message,/não foi registrada/);
});
test('complete wrong sequence records an error, then rebuild allows a correct attempt',()=>{
 const f=fixture();for(const word of f.bank.children)word.onclick();f.actions.children[0].onclick();assert.equal(f.answers[0][1],false);
 f.actions.children[1].onclick();assert.ok(f.bank.children.every(b=>!b.disabled));assert.equal(f.out.textContent,'');
 for(const word of [...f.bank.children].reverse())word.onclick();f.actions.children[0].onclick();assert.equal(f.answers[1][1],true);assert.equal(f.answers[1][2],'We can confirm the meeting');
});
test('a saved correct or wrong complete attempt is restored without recording another answer',()=>{
 for(const [attempt,correct] of [['We can confirm the meeting',true],['meeting the confirm can We',false]]){
  const f=fixture({attempt,correct});assert.equal(f.out.textContent,attempt);assert.ok(f.bank.children.every(b=>b.disabled));assert.equal(f.answers.length,0);assert.equal(f.messages.at(-1).correct,correct);
 }
});
test('restoration respects repeated words and rejects foreign, partial or malformed attempts',()=>{
 const f=fixture();assert.deepEqual(Array.from(f.restore(['we','know','we','can'],'we we know can')),[0,2,1,3]);
 for(const attempt of ['We can','We can confirm the office',{},null,42,'x'.repeat(2001)])assert.equal(f.restore(['We','can','confirm','the','meeting'],attempt).length,0);
});
