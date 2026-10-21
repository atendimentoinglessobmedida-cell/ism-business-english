const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'business-ideas-lab.js'),'utf8');
const draft='Our team needs a clear plan for the next client meeting. The main point is to confirm responsibilities and deadlines together.';
async function fixture(initial={},fail=false){
 const elements=new Map(),writes=[],events={};let stops=0;
 for(const id of ['ideas-view','status','idea-draft','idea-word-count','clear','language','audience'])elements.set(id,{innerHTML:'',textContent:'',value:initial?.demo?.draft||'',checked:initial?.demo?.[id]===true});
 const storage={ready:()=>Promise.resolve(initial),read:()=>initial,storageHealth:()=>({mode:'persistent'}),write(k,v){if(fail)throw Error('Storage unavailable');writes.push(JSON.parse(JSON.stringify(v)));}};
 const context=vm.createContext({window:{ISM_IDEAS_LESSONS:[{id:'demo',level:'B1',track:'Meetings',title:'Clear message',focus:['clarity'],warm:'What matters?',video:'https://example.com/',think:['What is the goal?'],language:['The main point is clear.'],apply:'Write your update.'}],ISMStorage:storage,ISMAudio:{stop(){stops++;}}},document:{hidden:false,getElementById:id=>elements.get(id),addEventListener(name,fn){events[name]=fn;}},location:{hash:'#demo',pathname:'/business-ideas-lab.html'},history:{pushState(){}},addEventListener(name,fn){events[name]=fn;},Date});
 vm.runInContext(source,context);await Promise.resolve();await Promise.resolve();
 return {elements,writes,events,stops:()=>stops,finish(){elements.get('ideas-view').onclick({target:{closest:()=>({dataset:{finish:''}})}});}};
}
test('reflection requires twenty words and all three explicit self-assessments',async()=>{
 const f=await fixture(),e=f.elements;
 e.get('idea-draft').value='Too short';e.get('idea-draft').oninput();f.finish();assert.match(e.get('status').textContent,/20 palavras/);
 e.get('idea-draft').value=draft;e.get('idea-draft').oninput();f.finish();assert.match(e.get('status').textContent,/três critérios/);assert.equal(f.writes.at(-1).demo.done,false);
 for(const key of ['clear','language','audience']){e.get(key).checked=true;e.get(key).onchange({target:e.get(key)});}
 f.finish();assert.equal(f.writes.at(-1).demo.done,true);assert.match(e.get('status').textContent,/Reflexão registrada/);
});
test('editing invalidates current self-assessments but keeps the previous completion evidence and other lessons',async()=>{
 const f=await fixture({demo:{draft,clear:true,language:true,audience:true,done:true,at:123},other:{done:true,at:456}}),e=f.elements;
 e.get('idea-draft').value=draft+' Please confirm.';e.get('idea-draft').oninput();const state=f.writes.at(-1);
 assert.equal(state.demo.done,false);assert.equal(state.demo.lastCompletedAt,123);assert.equal(state.demo.at,123);assert.equal(state.other.done,true);
 for(const key of ['clear','language','audience']){assert.equal(state.demo[key],false);assert.equal(e.get(key).checked,false);}
 assert.match(e.get('status').textContent,/texto mudou/);
});
test('each checkbox change is saved before completion, and unchecking withdraws the current completion',async()=>{
 const f=await fixture({demo:{draft,done:true,at:12,clear:true,language:true,audience:true}}),e=f.elements;
 e.get('language').checked=false;e.get('language').onchange({target:e.get('language')});
 assert.equal(f.writes.at(-1).demo.language,false);assert.equal(f.writes.at(-1).demo.done,false);assert.equal(f.writes.at(-1).demo.lastCompletedAt,12);
});
test('storage failure leaves editing usable and reports recovery instructions',async()=>{
 const f=await fixture({},true),e=f.elements;e.get('idea-draft').value=draft;
 assert.doesNotThrow(()=>e.get('idea-draft').oninput());assert.match(e.get('status').textContent,/exporte um backup/);assert.match(e.get('idea-word-count').textContent,/palavras/);
});
test('malformed top-level saved data recovers safely and audio stops on leaving',async()=>{
 const f=await fixture(null);assert.match(f.elements.get('ideas-view').innerHTML,/Minha resposta em inglês/);const before=f.stops();f.events.pagehide();assert.equal(f.stops(),before+1);
 const html=fs.readFileSync(path.join(root,'business-ideas-lab.html'),'utf8');assert.ok(html.indexOf('storage-guard.js')<html.indexOf('src="business-ideas-lab.js"'));assert.match(source,/aria-describedby="idea-word-count"/);
});
