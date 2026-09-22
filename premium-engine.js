/* State and route helpers shared by the renderer and regression checks. */
window.ISMPremiumEngine=(()=>{
 const obj=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
 function record(v){v=obj(v);return {done:v.done===true,authenticNotes:typeof v.authenticNotes==="string"?v.authenticNotes:"",listening:Number.isInteger(v.listening)?v.listening:null,listeningCorrect:v.listeningCorrect===true,choice:Number.isInteger(v.choice)?v.choice:null,choiceCorrect:v.choiceCorrect===true,gap:typeof v.gap==='string'?v.gap:'',gapCorrect:v.gapCorrect===true,draft:typeof v.draft==='string'?v.draft:'',model:v.model===true,criteria:Array.isArray(v.criteria)?v.criteria.map(x=>x===true):[],oral:v.oral===true};}
 const key=id=>'ismbe:premium:'+id.toLowerCase()+':v1';
 const lessonId=(c,i)=>c.id+'.'+(i+1);
 const count=(c,s)=>c.lessons.filter((_,i)=>obj(s[lessonId(c,i)]).done===true).length;
 function route(hash,courses){const match=/^#(P[3-9])(?:\/(\d+))?$/.exec(hash);if(!match)return {course:null,index:null};const course=courses.find(c=>c.id===match[1]);if(!course)return {course:null,index:null};const index=match[2]?Number(match[2])-1:null;return {course,index:index!==null&&index>=0&&index<course.lessons.length?index:null};}
 function ready(s,l){return (!l[13]?.listening||l[13].listening.required===false||s.listeningCorrect)&&s.choiceCorrect&&s.gapCorrect&&s.draft.trim().length>0&&s.model&&l[12].every((_,i)=>s.criteria[i]===true)&&s.oral;}
 function order(l,i){return l[6].map((_,n)=>(n+i+1)%l[6].length);}
 const gapOK=(value,l)=>[l[9][1],...(l[9][3]||[])].some(answer=>value.trim().toLowerCase().replace(/[.!?]+$/,'')===answer.toLowerCase());
 return {obj,record,key,lessonId,count,route,ready,order,gapOK};
})();
