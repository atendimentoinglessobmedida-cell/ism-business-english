(()=>{'use strict';
const KEY='ismbe:intent-path:v1';
const PATHS=[
{id:'interview',title:'Preparar uma entrevista',meta:'25 min · 6 etapas',outcome:'Chegue à entrevista com respostas estruturadas e prontas para praticar.',steps:[
['Diagnóstico rápido','Defina cargo, contexto e confiança atual.','diagnose'],['Perguntas essenciais','Veja o que você precisa responder com clareza.','module:1'],['Linguagem em ação','Aprenda estruturas para experiência, resultados e motivação.','ideas'],['Listening','Treine compreensão de inglês profissional real.','listening'],['Construa suas respostas','Prepare respostas curtas e adaptáveis.','toolkit'],['Mock interview','Simule, responda em voz alta e conclua sua preparação.','simulate']]},
{id:'meeting',title:'Participar de uma reunião',meta:'20 min · 5 etapas',outcome:'Entre na reunião sabendo abrir, contribuir, esclarecer e concluir.',steps:[['Objetivo','Defina sua função na reunião.','diagnose'],['Frases essenciais','Recupere linguagem de reuniões.','module:4'],['Listening','Reconheça decisões e próximos passos.','listening'],['Prática','Treine intervenções curtas.','practice'],['Simulação','Conclua um cenário de reunião.','simulate']]},
{id:'presentation',title:'Fazer uma apresentação',meta:'30 min · 6 etapas',outcome:'Estruture e ensaie uma apresentação profissional clara.',steps:[['Objetivo e público','Defina resultado e audiência.','diagnose'],['Estrutura','Planeje abertura, desenvolvimento e fechamento.','module:7'],['Abertura','Treine uma abertura segura.','module:8'],['Dados e transições','Organize evidências e fluxo.','module:9'],['Construa','Use o Presentation Builder.','toolkit'],['Ensaio','Simule sua apresentação.','simulate']]},
{id:'negotiation',title:'Negociar em inglês',meta:'20 min · 5 etapas',outcome:'Negocie com linguagem objetiva, diplomática e orientada a resultados.',steps:[['Contexto','Defina objetivo, limites e concessões.','diagnose'],['Linguagem','Pratique clareza e influência.','module:12'],['Listening','Identifique posição e objeções.','listening'],['Aplicação','Construa argumentos profissionais.','ideas'],['Simulação','Treine a negociação.','simulate']]},
{id:'networking',title:'Fazer networking',meta:'15 min · 4 etapas',outcome:'Apresente-se, mantenha a conversa e crie uma próxima ação.',steps:[['Seu objetivo','Defina com quem quer falar e por quê.','diagnose'],['Pitch profissional','Construa uma apresentação curta.','module:1'],['Prática','Treine perguntas e respostas.','practice'],['Aplicação','Registre e pratique seu pitch.','ideas']]},
{id:'email',title:'Escrever e-mails melhores',meta:'15 min · 4 etapas',outcome:'Escreva mensagens mais claras, diretas e profissionais.',steps:[['Intenção','Defina objetivo e destinatário.','diagnose'],['Linguagem profissional','Revise clareza e tom.','module:1'],['Modelagem','Use frases do Toolkit.','toolkit'],['Aplicação','Produza e revise uma mensagem.','ideas']]},
{id:'confidence',title:'Falar com mais confiança',meta:'10 min · sessão rápida',outcome:'Faça uma sessão curta focada em fluência e resposta rápida.',steps:[['Aquecimento','Ative frases que você já conhece.','practice'],['Listening','Ouça e repita linguagem profissional.','listening'],['Speaking','Responda sem ler.','simulate']]}
];
let state={};try{state=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
function go(action){
 if(action==='diagnose'){document.getElementById('intent-diagnose')?.focus();return}
 if(action==='ideas'){location.href='business-ideas-lab.html';return}
 if(action==='listening'){location.href='real-business-listening.html';return}
 if(action==='practice'){window.setNav?.('practice');window.show?.('practice');return}
 if(action==='simulate'){window.setNav?.('simulate');window.show?.('simulate');window.renderSimulation?.();return}
 if(action==='toolkit'){window.setNav?.('toolkit');window.show?.('toolkit');window.renderToolkit?.();return}
 if(action.startsWith('module:')){window.openModule?.(+action.split(':')[1]);}
}
function currentPath(){return PATHS.find(p=>p.id===state.path)}
function renderHome(){
 const home=document.getElementById('home'); if(!home)return;
 let shell=document.getElementById('intent-home');
 if(!shell){shell=document.createElement('div');shell.id='intent-home';home.prepend(shell)}
 const p=currentPath(),done=p?(state.done?.[p.id]||[]):[];
 shell.innerHTML=p?'<section class="intent-focus"><div class="intent-kicker">SEU OBJETIVO ATUAL</div><h1>'+esc(p.title)+'</h1><p>'+esc(p.outcome)+'</p><div class="intent-progress"><b>'+done.length+'/'+p.steps.length+' etapas</b><span><i style="width:'+Math.round(done.length/p.steps.length*100)+'%"></i></span></div><button class="btn" data-open="'+p.id+'">CONTINUAR PREPARAÇÃO →</button><button class="intent-link" data-change>Trocar objetivo</button></section>':chooser();
 let more=home.querySelector('#intent-more');if(!more){more=document.createElement('details');more.id='intent-more';more.innerHTML='<summary>Mais formas de estudar e explorar</summary>';home.append(more)}for(const child of [...home.children])if(child!==shell&&child!==more)more.append(child);
}
function chooser(){return '<section class="intent-welcome"><div class="intent-kicker">ISM BUSINESS ENGLISH</div><h1>O que você precisa fazer em inglês?</h1><p>Escolha seu objetivo. O app organiza o conteúdo e mostra apenas o próximo passo.</p><button class="btn" data-resume>CONTINUAR MINHA AULA →</button><details class="intent-objectives"><summary>Escolher um objetivo profissional</summary><div class="intent-grid">'+PATHS.map(p=>'<button class="intent-card" data-open="'+p.id+'"><strong>'+esc(p.title)+'</strong><span>'+esc(p.meta)+'</span><small>'+esc(p.outcome)+'</small><b>COMEÇAR →</b></button>').join('')+'</div></details></section>'}
function openPath(id){const p=PATHS.find(x=>x.id===id);if(!p)return;state.path=id;state.done=state.done||{};state.done[id]=state.done[id]||[];save();renderPath(p)}
function renderPath(p){let panel=document.getElementById('intentpath');if(!panel){panel=document.createElement('section');panel.id='intentpath';panel.className='panel';document.querySelector('.main')?.insertBefore(panel,document.querySelector('.cta-footer'))}
 document.querySelectorAll('.panel').forEach(x=>x.classList.remove('on'));panel.classList.add('on');window.setNav?.('');
 const done=state.done?.[p.id]||[];const next=p.steps.findIndex((_,i)=>!done.includes(i));const active=next<0?p.steps.length-1:next;
 panel.innerHTML='<button class="btn soft" data-home>← INÍCIO</button><div class="intent-path-head"><div class="intent-kicker">OBJETIVO PROFISSIONAL</div><h1>'+esc(p.title)+'</h1><p>'+esc(p.outcome)+'</p><strong>'+esc(p.meta)+'</strong></div><label class="intent-diagnose-label" for="intent-diagnose">Contexto pessoal <small>(opcional)</small></label><textarea id="intent-diagnose" placeholder="Ex.: entrevista para gerente comercial na próxima sexta-feira...">'+esc(state.notes?.[p.id]||'')+'</textarea><div class="intent-steps">'+p.steps.map((s,i)=>'<article class="intent-step '+(done.includes(i)?'done':i===active?'active':'')+'"><span>'+(done.includes(i)?'✓':i+1)+'</span><div><small>ETAPA '+(i+1)+'</small><h2>'+esc(s[0])+'</h2><p>'+esc(s[1])+'</p></div><div class="intent-step-actions"><button class="btn '+(i===active?'':'soft')+'" data-action="'+esc(s[2])+'" data-step="'+i+'">'+(done.includes(i)?'REVISAR':'ABRIR')+' →</button>'+(done.includes(i)?'':'<button class="intent-link" data-done="'+i+'">Registrar que pratiquei</button>')+'</div></article>').join('')+'</div>'+(next<0?'<div class="intent-complete"><strong>Preparação registrada</strong><p>As etapas foram registradas por você; isso não é avaliação de domínio. Revise os pontos que ainda precisam de confiança ou escolha um novo objetivo.</p><button class="btn" data-change>ESCOLHER NOVO OBJETIVO →</button></div>':'');
 panel.scrollIntoView({behavior:'instant'});document.getElementById('intent-diagnose')?.addEventListener('input',e=>{state.notes=state.notes||{};state.notes[p.id]=e.target.value;save()});
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-open],[data-change],[data-home],[data-action],[data-done],[data-resume]');if(!b)return;
 if(b.dataset.resume!==undefined){window.continueLearning?.();return}if(b.dataset.open){openPath(b.dataset.open);return}if(b.dataset.change!==undefined){state.path='';save();document.querySelectorAll('.panel').forEach(x=>x.classList.remove('on'));document.getElementById('home')?.classList.add('on');window.setNav?.('home');renderHome();return}
 if(b.dataset.home!==undefined){document.querySelectorAll('.panel').forEach(x=>x.classList.remove('on'));document.getElementById('home')?.classList.add('on');window.setNav?.('home');renderHome();return}
 const p=currentPath();if(!p)return;if(b.dataset.done!==undefined){const i=+b.dataset.done;state.done[p.id]=[...new Set([...(state.done[p.id]||[]),i])];save();renderPath(p);return}
 if(b.dataset.action){go(b.dataset.action)}
});
addEventListener('DOMContentLoaded',renderHome);if(document.readyState!=='loading')renderHome();
})();