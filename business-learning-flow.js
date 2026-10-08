/* Shared learning sequence inspired by the ISM Teens lesson cycle. */
(()=>{'use strict';
 const names=['Repertório','Situação','Ouvir','Entender','Praticar','Aplicar'];
 const hints=['Leia as expressões, ouça e tente lembrar sem tradução.','Identifique o interlocutor, o objetivo e o próximo passo.','Ouça antes de ler. Depois confira e repita.','Observe a intenção e o tom; explique por que a expressão funciona.','Responda, confira a explicação e tente novamente.','Produza uma resposta própria, revise e pratique em voz alta.'];
 const storage=()=>window.ISMStorage;
 const read=k=>storage()?.read(k)||{};
 const write=(k,v)=>storage()?.write(k,v)===true;
 const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const key=id=>'ismbe:learning-flow:v1:'+location.pathname.split('/').pop()+':'+id;
 function button(text,fn){const b=document.createElement('button');b.type='button';b.className='btn soft';b.textContent=text;b.addEventListener('click',fn);return b;}
 function make(title,html){const s=document.createElement('section');s.className='card';s.innerHTML='<h2>'+title+'</h2>'+html;return s;}
 function listenFrom(language){
  const s=make('Ouça, confira e repita','<p>Ouça sem ler. Identifique a intenção e uma expressão que poderia usar no trabalho. Abra o texto para conferir.</p><p class="muted">Voz sintética do aparelho. Se o áudio não estiver disponível, use a transcrição como prática de leitura.</p>');
  for(const phrase of language.querySelectorAll('.phrase')){
   const item=document.createElement('div');item.className='flow-listen-item';
   for(const control of phrase.querySelectorAll('button.audio'))item.append(control.cloneNode(true));
   const detail=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Conferir texto e tradução';detail.append(summary);
   for(const text of phrase.querySelectorAll('.en,.pt'))detail.append(text.cloneNode(true));
   item.append(detail);s.append(item);
  }
  return s;
 }
 function planning(host,id){
  if(host.querySelector('textarea'))return;
  const saved=read(key(id)),box=make('Prepare sua resposta','<p>Escreva uma tentativa curta usando uma expressão desta lição. Inclua seu objetivo e um próximo passo. Depois fale com suas próprias palavras.</p><label>Meu plano em inglês<textarea data-flow-draft lang="en" maxlength="12000">'+esc(saved.draft||'')+'</textarea></label><details class="flow-review"><summary>Revisar minha escrita e fala</summary><ul><li>Minha mensagem principal é compreensível?</li><li>Atendi ao objetivo e indiquei o próximo passo?</li><li>Usei uma expressão da atividade com sentido adequado?</li><li>Organizei as ideias e adaptei o tom ao interlocutor?</li></ul><p>Compare com o modelo, escolha uma melhoria, edite sua resposta e pratique novamente sem ler. Outras respostas são possíveis.</p><p>Salvar registra prática. Acerto objetivo, autoavaliação e avaliação por professor são diferentes; esta atividade não recebeu correção automática ou avaliação por professor.</p></details><p data-flow-save role="status">Preparação opcional; os requisitos originais de conclusão continuam valendo.</p>');
  box.querySelector('textarea').addEventListener('input',e=>{const data=read(key(id));data.draft=e.target.value;box.querySelector('[data-flow-save]').textContent=write(key(id),data)?'Plano salvo neste navegador.':'Não foi possível salvar. Copie seu texto antes de sair.';});
  host.prepend(box);
  // The Core can be using the IndexedDB fallback; hydrate before offering editing.
  const input=box.querySelector('textarea');input.disabled=true;
  Promise.resolve(storage()?.dbGet?.(key(id))).then(back=>{const value=read(key(id));input.value=typeof value.draft==='string'?value.draft:typeof back?.draft==='string'?back.draft:'';}).catch(()=>{}).finally(()=>{input.disabled=false;});
 }
 function translations(root,toolbar){
  const saved=read('ismbe:learning-support:v1');let hidden=saved.hideTranslations===true,touched=false;
  const b=button('',()=>{touched=true;hidden=!hidden;const ok=write('ismbe:learning-support:v1',{...read('ismbe:learning-support:v1'),hideTranslations:hidden});apply();if(!ok)b.title='Preferência válida nesta tela; não foi possível salvar.';});
  function apply(){root.classList.toggle('flow-hide-translations',hidden);b.textContent=hidden?'Mostrar traduções':'Ocultar traduções';b.setAttribute('aria-pressed',String(hidden));}
  toolbar.append(b);apply();
  Promise.resolve(storage()?.dbGet?.('ismbe:learning-support:v1')).then(back=>{if(!touched&&back&&typeof saved.hideTranslations!=='boolean'){hidden=back.hideTranslations===true;apply();}}).catch(()=>{});
 }
 function mount(root,id,groups){
  if(root.querySelector(':scope > .business-flow'))return;
  const panels=groups.map((nodes,i)=>{const panel=document.createElement('section');panel.className='flow-panel';panel.dataset.flowPanel=String(i);panel.setAttribute('aria-label',names[i]);for(const node of nodes){const eyebrow=node.querySelector(':scope > .ey');if(eyebrow)eyebrow.textContent=(i+1)+' · '+names[i];panel.append(node);}return panel;});
  const bar=document.createElement('section');bar.className='business-flow card';bar.setAttribute('aria-label','Percurso de aprendizagem');
  const intro=document.createElement('p');intro.textContent='Uma etapa por vez: compreenda, pratique e leve a linguagem para o trabalho.';bar.append(intro);
  const nav=document.createElement('nav');nav.className='flow-steps';nav.setAttribute('aria-label','Etapas de aprendizagem');bar.append(nav);
  const label=document.createElement('p');label.className='flow-hint';label.setAttribute('role','status');bar.append(label);
  const tools=document.createElement('div');tools.className='flow-tools';bar.append(tools);
  const footer=document.createElement('nav');footer.className='flow-footer';footer.setAttribute('aria-label','Avançar no percurso');
  let data=read(key(id)),stage=Number.isInteger(data.stage)&&data.stage>=0&&data.stage<6?data.stage:0,all=false,touched=false;
  const navButtons=names.map((name,i)=>{const b=button((i+1)+'. '+name,()=>select(i,true));nav.append(b);return b;});
  const prev=button('← Etapa anterior',()=>select(stage-1,true)),next=button('Próxima etapa →',()=>select(stage+1,true));
  const allButton=button('Ver aula completa',()=>{all=!all;paint();});tools.append(allButton);translations(root,tools);footer.append(prev,next);
  function paint(){panels.forEach((panel,i)=>panel.hidden=!all&&i!==stage);navButtons.forEach((b,i)=>{b.setAttribute('aria-current',i===stage?'step':'false');b.classList.toggle('flow-current',i===stage);});label.textContent='Etapa '+(stage+1)+' de 6 · '+hints[stage];prev.disabled=stage===0;next.disabled=stage===5;allButton.textContent=all?'Voltar às etapas':'Ver aula completa';allButton.setAttribute('aria-pressed',String(all));}
  function select(i,focus){if(i<0||i>5)return;touched=true;window.ISMAudio?.stop();stage=i;data=read(key(id));data.stage=stage;const ok=write(key(id),data);paint();if(!ok)label.textContent+=' A etapa não pôde ser salva.';if(focus){panels[stage].tabIndex=-1;panels[stage].focus({preventScroll:true});bar.scrollIntoView({block:'start'});}}
  // Move existing controls rather than recreate them: answers and handlers survive.
  root.append(bar,...panels,footer);paint();
  Promise.resolve(storage()?.dbGet?.(key(id))).then(back=>{if(!touched&&!Number.isInteger(data.stage)&&Number.isInteger(back?.stage)&&back.stage>=0&&back.stage<6){stage=back.stage;paint();}}).catch(()=>{});
  root.addEventListener('click',e=>{const link=e.target.closest('[data-section]');if(!link)return;const target=document.getElementById(link.dataset.section),index=panels.findIndex(p=>p.contains(target));if(index>=0)select(index,false);});
 }
 function authored(root){
  const reading=root.querySelector('.reading');if(!reading||reading.querySelector('.business-flow'))return;
  const language=reading.querySelector('#language'),context=reading.querySelector('#context'),exercises=reading.querySelector('#exercises'),writing=reading.querySelector('#writing'),oral=reading.querySelector('#oral');
  if(!language||!context||!exercises||!writing||!oral)return;
  const id=location.hash.slice(1),children=[...reading.children],rest=children.filter(n=>n!==language&&n!==context&&n!==exercises&&n!==writing&&n!==oral&&!n.matches('a,.hero,.section-nav'));
  const listening=rest.filter(n=>n.id==='listening'||n.id==='authentic-listening');
  const practice=rest.filter(n=>n.tagName==='FIELDSET'&&!listening.includes(n));
  const finish=rest.filter(n=>n.querySelector('[data-finish]'));
  const understanding=rest.filter(n=>!listening.includes(n)&&!practice.includes(n)&&!finish.includes(n));
  if(!understanding.length)understanding.push(make('Observe a linguagem profissional','<p>Volte às expressões: qual apresenta o objetivo, qual reduz a imposição e qual propõe uma ação? Compare o tom com a situação antes de responder.</p>'));
  if(!listening.length){listening.push(listenFrom(language));}
  reading.querySelector('.section-nav')?.remove();
  mount(reading,id,[[language],[context],listening,understanding,[exercises,...practice],[writing,oral,...finish]]);
 }
 function legacy(root){
  if(root.querySelector('.business-flow'))return;
  const nodes=[...root.children],label=n=>(n.querySelector('.ey')?.textContent||'').trim().toUpperCase();
  const context=nodes.find(n=>label(n)==='CONTEXT'),language=nodes.find(n=>label(n)==='LEARN + LISTEN');
  if(!context||!language)return;
  const header=nodes.find(n=>/^LESSON /.test(label(n)));if(!header)return;
  const practice=nodes.filter(n=>/^(PRACTICE|CONTROLLED PRACTICE)$/.test(label(n))),apply=nodes.filter(n=>/^(SPEAK|WRITE|TRANSFER|APPLY)/.test(label(n)));
  if(!practice.length||!apply.length)return;
  const understand=nodes.filter(n=>label(n)==='NOTICE');
  if(!understand.length)understand.push(make('Observe a intenção','<p>Compare as expressões: qual é o objetivo, o tom e a ação esperada? Use a situação para decidir.</p>'));
  const id=label(header);planning(apply[0],id);mount(root,id,[[language],[context],[listenFrom(language)],understand,practice,apply]);
 }
 function core(root){
  if(root.querySelector('.business-flow'))return;
  const screen=root.querySelector('.lesson-screen');if(!screen)return;
  const toolbar=document.createElement('div');toolbar.className='business-flow flow-tools';translations(root,toolbar);screen.before(toolbar);
  if(screen.classList.contains('screen-speak'))planning(screen,location.hash.split('/').slice(0,2).join('/'));
 }
 function scan(root){if(root.id==='lessonBody')core(root);else if(root.id==='course-view')authored(root);else legacy(root);}
 for(const id of ['course-view','view','lessonBody']){const root=document.getElementById(id);if(!root)continue;scan(root);new MutationObserver(()=>scan(root)).observe(root,{childList:true});}
})();
