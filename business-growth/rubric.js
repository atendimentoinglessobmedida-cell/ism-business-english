/* Deterministic rubric normalization, not an AI evaluation engine. */
(function(root){
'use strict';
const keys=['clarity','vocabulary','professionalTone','grammar'];
function normalize(raw){
const scores={};
for(const key of keys){const value=Number(raw?.[key]);if(!Number.isFinite(value)||value<0||value>10)throw new RangeError('Invalid rubric score: '+key);scores[key]=Math.round(value*10)/10;}
const average=Math.round(keys.reduce((sum,k)=>sum+scores[k],0)/4*10)/10;
const priorities=keys.slice().sort((a,b)=>scores[a]-scores[b]).slice(0,2);
return {scores,average,priorities};
}
function recurring(records){const counts={};for(const record of records||[])for(const code of new Set(record?.errorCodes||[])){if(typeof code==='string'&&/^[a-z0-9_-]{1,48}$/.test(code))counts[code]=(counts[code]||0)+1;}return Object.entries(counts).filter(([,n])=>n>=2).sort((a,b)=>b[1]-a[1]).map(([code,count])=>({code,count}));}
root.ISMBusinessRubric=Object.freeze({keys,normalize,recurring});
})(typeof window!=='undefined'?window:globalThis);
