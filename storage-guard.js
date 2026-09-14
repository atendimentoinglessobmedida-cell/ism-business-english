/* Keep each course's existing storage key; never silently replace unreadable data. */
window.ISMStorage=(()=>{
 const blocked=new Set();
 const object=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
 function warn(message){let el=document.getElementById('save-warning');if(!el){el=document.createElement('p');el.id='save-warning';el.setAttribute('role','alert');el.style.cssText='padding:16px;margin:16px;border:2px solid #e9a83a;background:#00162c;color:white;font:16px/1.5 system-ui';document.body.prepend(el);}el.textContent=message;}
 function read(key,fallback){try{const raw=localStorage.getItem(key)??(fallback?localStorage.getItem(fallback):null);if(raw===null)return {};const value=JSON.parse(raw);if(!value||typeof value!=='object'||Array.isArray(value))throw Error('invalid');return value;}catch{blocked.add(key);warn('Não foi possível recuperar o progresso. O registro original foi preservado. Copie suas respostas antes de sair e peça ajuda ao professor.');return {};}}
 function write(key,value){if(blocked.has(key)){warn('O salvamento está suspenso para preservar um registro que não pôde ser lido. Copie suas respostas antes de sair e peça ajuda ao professor.');return false;}try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{warn('O navegador não conseguiu salvar suas alterações. Mantenha esta página aberta e copie suas respostas antes de sair.');return false;}}
 return {read,write,object};
})();
