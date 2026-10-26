(()=>{
 'use strict';
 const view=document.getElementById('ideas-view'),lessons=window.ISM_IDEAS_LESSONS,key='ismbe:ideas-lab:v1';
 const checks=['clear','language','audience'];
 const object=value=>value&&typeof value==='object'&&!Array.isArray(value)?value:{};
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let saved={};
 function entry(id){saved[id]=object(saved[id]);return saved[id];}
 function words(text){return String(text||'').trim().split(/\s+/).filter(Boolean).length;}
 function invalidate(s){
  // Keep historical evidence, but review the current version of the draft again.
  if(s.done&&s.at)s.lastCompletedAt=s.at;
  s.done=false;for(const name of checks)s[name]=false;
 }
 function canFinish(s){return words(s.draft)>=20&&checks.every(name=>s[name]===true);}
 function status(message){const target=document.getElementById('status');if(target)target.textContent=message;}
 function save(){try{window.ISMStorage.write(key,saved);return true;}catch{status('Não foi possível salvar. Mantenha esta página aberta e exporte um backup antes de sair.');return false;}}
 function catalog(){view.innerHTML='<div class="ideas-grid">'+lessons.map(l=>'<article class="idea-card"><div class="ey">'+esc(l.level)+' · '+esc(l.track)+'</div><h2>'+esc(l.title)+'</h2><p>'+l.focus.map(esc).join(' · ')+'</p><a class="btn soft" href="#'+esc(l.id)+'">'+(entry(l.id).done?'Revisar':entry(l.id).draft?'Continuar':'Começar')+' →</a></article>').join('')+'</div>';}
 function lesson(l){
  const s=entry(l.id);
  view.innerHTML='<article class="idea-lesson"><button type="button" class="btn soft" data-back>← Catálogo</button><div class="ey">'+esc(l.level)+' · '+esc(l.track)+'</div><h2>'+esc(l.title)+'</h2>'+
   '<section><h3>1 · WATCH</h3><p>'+esc(l.warm)+'</p><a class="btn" href="'+esc(l.video)+'" target="_blank" rel="noopener noreferrer">Abrir vídeo de referência ↗</a><p class="muted">O vídeo abre no site do provedor. As atividades abaixo são conteúdo original ISM.</p></section>'+
   '<section><h3>2 · THINK</h3><ol>'+l.think.map(q=>'<li>'+esc(q)+'</li>').join('')+'</ol></section>'+
   '<section><h3>3 · LANGUAGE IN ACTION</h3>'+l.language.map(x=>'<p><b lang="en">'+esc(x)+'</b> <button type="button" class="audio" data-say="'+esc(x)+'" aria-label="Ouvir expressão: '+esc(x)+'">▶</button></p>').join('')+'</section>'+
   '<section><h3>4 · APPLY</h3><p lang="en">'+esc(l.apply)+'</p><label for="idea-draft">Minha resposta em inglês</label><textarea id="idea-draft" lang="en" maxlength="12000" aria-describedby="idea-word-count">'+esc(s.draft||'')+'</textarea><p id="idea-word-count"></p></section>'+
   '<section><h3>5 · SPEAK & REFLECT</h3><p>Explique sua resposta em 60–90 segundos sem ler palavra por palavra. Para registrar a reflexão, escreva pelo menos 20 palavras e confirme os três critérios. As marcações são sua autoavaliação, sem correção automática da fala ou da escrita.</p>'+checks.map((name,i)=>'<label><input type="checkbox" id="'+name+'" '+(s[name]===true?'checked':'')+'> '+['Minha mensagem teve uma ideia central clara.','Usei pelo menos uma expressão da aula.','Adaptei a mensagem ao público.'][i]+'</label><br>').join('')+'<div class="idea-actions"><button type="button" class="btn" data-finish>Registrar reflexão</button></div><p id="status" role="status"></p></section></article>';
  const draft=document.getElementById('idea-draft'),count=document.getElementById('idea-word-count');
  const recount=()=>count.textContent=words(draft.value)+' palavras · mínimo para registrar: 20';recount();
  draft.oninput=()=>{const hadReview=s.done||checks.some(name=>s[name]===true);s.draft=draft.value;invalidate(s);for(const name of checks)document.getElementById(name).checked=false;recount();status(hadReview?'Seu texto mudou. Pratique e revise os três critérios novamente.':'');save();};
  for(const name of checks)document.getElementById(name).onchange=e=>{s[name]=e.target.checked;if(!e.target.checked){if(s.done&&s.at)s.lastCompletedAt=s.at;s.done=false;}status('Autoavaliação atualizada. Use Registrar reflexão depois de revisar os três critérios.');save();};
  if(s.done)status('Você já registrou esta reflexão. Pode retomá-la e aprimorar sua resposta.');
 }
 function stop(){window.ISMAudio?.stop();}
 function route(){stop();const l=lessons.find(x=>x.id===location.hash.slice(1));l?lesson(l):catalog();}
 view.onclick=e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.back!==undefined){history.pushState(null,'',location.pathname);route();}
  if(b.dataset.say)window.ISMAudio?.speak(b.dataset.say,.92);
  if(b.dataset.finish!==undefined){
   const l=lessons.find(x=>x.id===location.hash.slice(1));if(!l)return;
   const s=entry(l.id);s.draft=document.getElementById('idea-draft').value;for(const name of checks)s[name]=document.getElementById(name).checked;
   if(!canFinish(s)){status(words(s.draft)<20?'Desenvolva sua resposta com pelo menos 20 palavras antes de registrar.':'Revise e confirme os três critérios antes de registrar a reflexão.');return;}
   s.done=true;s.at=Date.now();if(save())status('Reflexão registrada. Use Dados e backup para levar seu progresso a outro navegador.');
  }
 };
 addEventListener('hashchange',route);addEventListener('pagehide',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 Promise.resolve(window.ISMStorage.ready(key,null)).then(value=>{saved=object(window.ISMStorage.storageHealth().mode==='persistent'?window.ISMStorage.read(key):value);route();}).catch(()=>{saved=object(window.ISMStorage.read(key));route();});
})();
