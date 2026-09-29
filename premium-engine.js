/* State and route helpers shared by the renderer and regression checks. */
window.ISMPremiumEngine=(()=>{
 const obj=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
 function record(v){v=obj(v);return {done:v.done===true,authenticNotes:typeof v.authenticNotes==="string"?v.authenticNotes:"",listening:Number.isInteger(v.listening)?v.listening:null,listeningCorrect:v.listeningCorrect===true,choice:Number.isInteger(v.choice)?v.choice:null,choiceCorrect:v.choiceCorrect===true,gap:typeof v.gap==='string'?v.gap:'',gapCorrect:v.gapCorrect===true,draft:typeof v.draft==='string'?v.draft:'',model:v.model===true,criteria:Array.isArray(v.criteria)?v.criteria.map(x=>x===true):[],oral:v.oral===true};}
 // Remote courses and authored practice share labels, not completion criteria.
 const legacyKey=id=>'ismbe:premium:'+id.toLowerCase()+':v1';
 const key=id=>'ismbe:premium:authored:'+id.toLowerCase()+':v1';
 const legacyTracks=[['P1','Job Interviews',30,'interview.html'],['P2','Professional Emails & Messages',8,'emails.html'],['P3','Networking',7,'networking.html'],['P4','Global Teams',8,'global-teams.html'],['P5','Negotiation & Persuasion',9,'negotiation.html'],['P6','Difficult Conversations',8,'difficult-conversations.html'],['P7','Leadership',9,'leadership.html'],['P8','Career Growth',9,'career-growth.html']].map(([id,title,total,href])=>({id,title,total,href}));
 function legacySummary(storage){const tracks=legacyTracks.map(t=>{const raw=obj(storage.read(legacyKey(t.id))),values=obj(t.id==='P1'?raw.lessons:raw.done),done=Math.min(t.total,Object.values(values).filter(v=>v===true).length);return {...t,done,pct:Math.round(done/t.total*100)};});const total=tracks.reduce((n,t)=>n+t.total,0),done=tracks.reduce((n,t)=>n+t.done,0);return {tracks,total,done,pct:Math.round(done/total*100),complete:done===total};}
 function load(storage,c){
  const current=obj(storage.read(key(c.id)));
  if(current.collection==='authored-v1')return obj(current.lessons);
  // Copy only authored lesson records. Never modify the original remote record.
  const source=obj(obj(storage.read(legacyKey(c.id))).lessons),lessons={};
  for(const [id,value] of Object.entries(source)){if(value&&typeof value==='object'&&!Array.isArray(value))lessons[id]={...value};}
  // Preserve unexpected IDs too, but count only IDs in the active catalogue.
  const merged={...lessons,...obj(current.lessons)};
  if(Object.keys(merged).length)storage.write(key(c.id),{...current,version:1,collection:'authored-v1',migratedFrom:legacyKey(c.id),lessons:merged});
  return merged;
 }
 function save(storage,c,lessons){return storage.write(key(c.id),{...obj(storage.read(key(c.id))),version:1,collection:'authored-v1',lessons});}
 const lessonId=(c,i)=>c.id+'.'+(i+1);
 const count=(c,s)=>c.lessons.filter((_,i)=>obj(s[lessonId(c,i)]).done===true).length;
 function route(hash,courses){const match=/^#(P\d+)(?:\/(\d+))?$/.exec(hash);if(!match)return {course:null,index:null};const course=courses.find(c=>c.id===match[1]);if(!course)return {course:null,index:null};const index=match[2]?Number(match[2])-1:null;return {course,index:index!==null&&index>=0&&index<course.lessons.length?index:null};}
 function ready(s,l){return (!l[13]?.listening||l[13].listening.required===false||s.listeningCorrect)&&s.choiceCorrect&&s.gapCorrect&&s.draft.trim().length>0&&s.model&&l[12].every((_,i)=>s.criteria[i]===true)&&s.oral;}
 function order(l,i){return l[6].map((_,n)=>(n+i+1)%l[6].length);}
 const gapOK=(value,l)=>[l[9][1],...(l[9][3]||[])].some(answer=>value.trim().toLowerCase().replace(/[.!?]+$/,'')===answer.toLowerCase());
 return {obj,record,key,legacyKey,legacyTracks,legacySummary,load,save,lessonId,count,route,ready,order,gapOK};
})();
