/* Shared navigation and explanatory pages. Does not own learning state. */
(()=>{
 const loadStyle=href=>{if(document.querySelector(`link[href^="${href}"]`))return;const l=document.createElement('link');l.rel='stylesheet';l.href=href;document.head.appendChild(l)};
 const loadScript=src=>{if(document.querySelector(`script[src^="${src}"]`))return;const s=document.createElement('script');s.src=src;document.body.appendChild(s)};
 loadStyle('adaptive-coach.css?v=2');loadStyle('speaking-experience.css?v=1');loadStyle('my-business-english.css?v=1');loadStyle('real-business.css?v=1');loadStyle('premium-ux.css?v=1');loadStyle('completion-hardening.css?v=1');loadStyle('visual-learning.css?v=1');loadStyle('action-buttons.css?v=1');
 const nav=document.createElement('nav');nav.className='utility-nav';nav.setAttribute('aria-label','Acesso Premium e informações do curso');
 nav.innerHTML='<a class="utility-item premium-entry" href="premium.html"><span class="utility-icon" aria-hidden="true">✦</span><span>Acessar<br>Premium</span></a><a class="utility-item plans" href="planos.html"><span class="utility-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v12H4z"/><path d="M8 7V5h8v2"/><path d="M4 11h16"/></svg></span><span>Planos e<br>preços</span></a><a class="utility-item professor" href="professor.html"><span class="utility-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6"/></svg></span><span>Professor</span></a><a class="utility-item contact" href="professor.html#contato"><span class="utility-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg></span><span>Contato</span></a>';
 document.querySelector('.top')?.insertAdjacentElement('afterend',nav);
 document.documentElement.dataset.theme='professional';try{localStorage.removeItem('ismbe:theme')}catch{}
 const home=document.getElementById('home');
 if(home){const grid=home.querySelector('.home-action-grid');if(grid&&!document.getElementById('ismCoach')){const coach=document.createElement('section');coach.id='ismCoach';coach.className='ism-coach';coach.setAttribute('aria-live','polite');coach.innerHTML='<span class="ey">ISM COACH</span><p>Preparando sua melhor próxima atividade…</p>';grid.before(coach)}const heading=home.querySelector('.title h3');if(heading)heading.textContent='Suas 4 fases';}
 const mode=document.querySelector('#home > .mode');if(mode){const details=document.createElement('details');details.className='quick-tools';const summary=document.createElement('summary');summary.textContent='Preciso falar agora · expressões rápidas';mode.before(details);details.append(summary,mode);}
 const weekly=home&&home.querySelector('.weekly-progress');if(weekly){weekly.classList.add('learning-dashboard');const h=weekly.querySelector('.weekly-head strong');if(h)h.textContent='Seu ritmo de aprendizagem';}
 const premium=home&&home.querySelector('.premium');if(premium){const d=document.createElement('details');d.className='home-more premium-more';const s=document.createElement('summary');s.innerHTML='<span class="summary-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m4 8 4 4 4-7 4 7 4-4-2 10H6z"/><path d="M7 18h10"/></svg></span><span>Conteúdo Premium</span><small>8 trilhas · 88 lições</small>';premium.before(d);d.append(s,premium);}
 const improveActions=()=>{
  const labels=[
   ['#resumeCard .resume-btn','CONTINUAR LIÇÃO →','Continuar sua próxima atividade'],
   ['.home-review .btn','INICIAR REVISÃO →','Iniciar Smart Review'],
   ['.home-now .btn','PREPARAR AGORA →','Abrir Business Mode para uma situação profissional'],
   ['.home-progress .btn','VER MINHA JORNADA →','Ver sua jornada e progresso'],
   ['#module > .btn','← VOLTAR À JORNADA','Voltar para Minha Jornada'],
   ['#lesson > #backModule','← VOLTAR AO MÓDULO','Voltar ao módulo'],
   ['#smartreview > .btn','← VOLTAR À PRÁTICA','Voltar para Praticar'],
   ['#businessmode > .btn','← VOLTAR AO INÍCIO','Voltar ao início'],
   ['#support > .btn','← VOLTAR AO INÍCIO','Voltar ao início'],
   ['#premium > .btn','← VOLTAR AO INÍCIO','Voltar ao início'],
   ['#premium .premium a.btn','ACESSAR CONTEÚDO PREMIUM →','Acessar conteúdo Premium: coleção de prática aplicada com progresso separado'],
   ['.cta-footer-actions a[href="planos.html"]','VER PLANOS →','Ver planos e preços'],
   ['.cta-footer-actions a.whatsapp','FALAR COM O PROFESSOR','Falar com o Professor Márcio pelo WhatsApp'],
   ['.cta-footer-actions a[href="professor.html"]','CONHECER O PROFESSOR','Conhecer o Professor Márcio']
  ];
  labels.forEach(([sel,text,label])=>document.querySelectorAll(sel).forEach(el=>{el.textContent=text;el.setAttribute('aria-label',label)}));
  document.querySelectorAll('button,a.btn,.practice-option,.tab,.nav,.stat-action').forEach(el=>{
   if(!el.getAttribute('aria-label')){const t=(el.textContent||'').replace(/\s+/g,' ').trim();if(t)el.setAttribute('aria-label',t)}
  });
 };
 improveActions();
 loadScript('adaptive-coach.js?v=2');loadScript('speaking-experience.js?v=1');loadScript('my-business-english.js?v=1');loadScript('real-business.js?v=3');loadScript('completion-hardening.js?v=1');loadScript('visual-learning.js?v=1');
 const attachSpeaking=()=>{const lesson=document.getElementById('lessonBody');if(!lesson||document.getElementById('speakingExperience'))return;const speaking=[...lesson.querySelectorAll('.card,.stage')].find(x=>/SPEAK|fale|gravar/i.test(x.textContent||''));if(speaking){const host=document.createElement('div');host.id='speakingExperience';speaking.insertAdjacentElement('afterend',host);window.ISMSpeaking?.render?.()}};
 const observer=new MutationObserver(()=>requestAnimationFrame(()=>{attachSpeaking();improveActions()}));const lessonBody=document.getElementById('lessonBody');if(lessonBody)observer.observe(lessonBody,{childList:true,subtree:true});window.addEventListener('load',()=>{attachSpeaking();improveActions()});
})();