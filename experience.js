/* Shared navigation and explanatory pages. Does not own learning state. */
(()=>{
 const loadStyle=href=>{if(document.querySelector(`link[href^="${href}"]`))return;const l=document.createElement('link');l.rel='stylesheet';l.href=href;document.head.appendChild(l)};
 const loadScript=src=>{if(document.querySelector(`script[src^="${src}"]`))return;const s=document.createElement('script');s.src=src;document.body.appendChild(s)};
 loadStyle('adaptive-coach.css?v=1');
 const nav=document.createElement('nav');nav.className='utility-nav';nav.setAttribute('aria-label','Sobre o curso');
 nav.innerHTML='<a class="utility-item plans" href="planos.html"><span class="utility-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v12H4z"/><path d="M8 7V5h8v2"/><path d="M4 11h16"/></svg></span><span>Planos e<br>preços</span></a><a class="utility-item professor" href="professor.html"><span class="utility-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6"/></svg></span><span>Professor</span></a><a class="utility-item contact" href="professor.html#contato"><span class="utility-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg></span><span>Contato</span></a>';
 document.querySelector('.top')?.insertAdjacentElement('afterend',nav);
 document.documentElement.dataset.theme='professional';try{localStorage.removeItem('ismbe:theme')}catch{}
 const home=document.getElementById('home');
 if(home){
   const grid=home.querySelector('.home-action-grid');
   if(grid&&!document.getElementById('ismCoach')){const coach=document.createElement('section');coach.id='ismCoach';coach.className='ism-coach';coach.setAttribute('aria-live','polite');coach.innerHTML='<span class="ey">ISM COACH</span><p>Preparando sua melhor próxima atividade…</p>';grid.before(coach)}
   const heading=home.querySelector('.title h3');if(heading)heading.textContent='Suas 4 fases';
 }
 const mode=document.querySelector('#home > .mode');
 if(mode){const details=document.createElement('details');details.className='quick-tools';const summary=document.createElement('summary');summary.textContent='Preciso falar agora · expressões rápidas';mode.before(details);details.append(summary,mode);}
 const weekly=home&&home.querySelector('.weekly-progress');if(weekly){weekly.classList.add('learning-dashboard');const h=weekly.querySelector('.weekly-head strong');if(h)h.textContent='Seu ritmo de aprendizagem';}
 const premium=home&&home.querySelector('.premium');
 if(premium){const d=document.createElement('details');d.className='home-more premium-more';const s=document.createElement('summary');s.innerHTML='<span class="summary-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m4 8 4 4 4-7 4 7 4-4-2 10H6z"/><path d="M7 18h10"/></svg></span><span>Conteúdo Premium</span><small>8 trilhas · 88 lições</small>';premium.before(d);d.append(s,premium);}
 loadScript('adaptive-coach.js?v=1');
})();
