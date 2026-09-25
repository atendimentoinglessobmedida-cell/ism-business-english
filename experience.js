/* Shared navigation and explanatory pages. Does not write learning state. */
(()=>{
 const nav=document.createElement('nav');nav.className='utility-nav';nav.setAttribute('aria-label','Sobre o curso');
 nav.innerHTML='<a class="utility-item plans" href="planos.html"><span class="utility-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v12H4z"/><path d="M8 7V5h8v2"/><path d="M4 11h16"/></svg></span><span>Planos e<br>preços</span></a><a class="utility-item professor" href="professor.html"><span class="utility-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6"/></svg></span><span>Professor</span></a><a class="utility-item contact" href="professor.html#contato"><span class="utility-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg></span><span>Contato</span></a>';
 document.querySelector('.top').insertAdjacentElement('afterend',nav);
 document.documentElement.dataset.theme='professional';try{localStorage.removeItem('ismbe:theme')}catch{}
 // Keep the study home focused on its main action; tools remain one tap away.
 const mode=document.querySelector('#home > .mode');
 if(mode){const details=document.createElement('details');details.className='quick-tools';const summary=document.createElement('summary');summary.textContent='Preciso falar agora · expressões rápidas';mode.before(details);details.append(summary,mode);}
 const home=document.getElementById('home');
 // Group progress and recommendation into one learning dashboard to reduce Home card overload.
 const weekly=home&&home.querySelector('.weekly-progress');if(weekly){weekly.classList.add('learning-dashboard');const h=weekly.querySelector('.weekly-head strong');if(h)h.textContent='Seu ritmo de aprendizagem';}
// Progressive disclosure keeps the first screen focused on learning, while preserving the existing course cover and tools.
 const premium=home&&home.querySelector('.premium');
 if(premium){const d=document.createElement('details');d.className='home-more premium-more';const s=document.createElement('summary');s.innerHTML='<span class="summary-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m4 8 4 4 4-7 4 7 4-4-2 10H6z"/><path d="M7 18h10"/></svg></span><span>Conteúdo Premium</span><small>8 trilhas · 88 lições</small>';premium.before(d);d.append(s,premium);}

 if(home){const heading=home.querySelector('.title h3');if(heading)heading.textContent='Suas 4 fases';}
})();
