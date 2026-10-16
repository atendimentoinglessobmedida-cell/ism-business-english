/* ISM answer order: fair answer positions, no dependence on display index. */
(function(root){
'use strict';
function shuffle(values,random=Math.random){const a=values.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function plan(questions,random=Math.random){
 const bySize=new Map();
 questions.forEach((q,i)=>{const n=q.options.length;if(n<2||!Number.isInteger(q.correct)||q.correct<0||q.correct>=n)throw Error('Gabarito inválido: '+i);if(!bySize.has(n))bySize.set(n,[]);bySize.get(n).push(i);});
 const out=Array(questions.length);
 for(const [n,indices] of bySize){
  const slots=shuffle(indices.map((_,i)=>i%n),random);
  indices.forEach((qi,k)=>{const q=questions[qi],correct=q.correct,rest=shuffle(q.options.map((_,i)=>i).filter(i=>i!==correct),random);rest.splice(slots[k],0,correct);out[qi]=rest;});
 }
 return out;
}
function one(options,random=Math.random){return shuffle(options.map((_,i)=>i),random);}
root.ISMAnswerOrder={shuffle,plan,one};
})(typeof window!=='undefined'?window:globalThis);
