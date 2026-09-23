/* Shared navigation and explanatory pages. Does not write learning state. */
(()=>{
 const nav=document.createElement('nav');nav.className='utility-nav';nav.setAttribute('aria-label','Sobre o curso');
 nav.innerHTML='<a class="utility-item plans" href="planos.html"><span class="utility-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v12H4z"/><path d="M8 7V5h8v2"/><path d="M4 11h16"/></svg></span><span>Planos e<br>preços</span></a><a class="utility-item professor" href="professor.html"><span class="utility-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6"/></svg></span><span>Professor</span></a><a class="utility-item contact" href="professor.html#contato"><span class="utility-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg></span><span>Contato</span></a>';
 document.querySelector('.top').insertAdjacentElement('afterend',nav);
 const themeKey='ismbe:theme';const savedTheme=localStorage.getItem(themeKey)||'professional';document.documentElement.dataset.theme=savedTheme;
 const themeToggle=document.createElement('button');themeToggle.className='theme-toggle';themeToggle.type='button';themeToggle.setAttribute('aria-label','Alternar fundo claro e azul profissional');
 const paintTheme=()=>{const dark=document.documentElement.dataset.theme==='professional';themeToggle.innerHTML=dark?'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><span>FUNDO CLARO</span>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.5A8 8 0 1 1 8.5 4 6.5 6.5 0 0 0 20 15.5z"/></svg><span>AZUL PROFISSIONAL</span>';themeToggle.setAttribute('aria-pressed',dark?'true':'false')};paintTheme();
 themeToggle.onclick=()=>{const next=document.documentElement.dataset.theme==='professional'?'light':'professional';document.documentElement.dataset.theme=next;localStorage.setItem(themeKey,next);paintTheme()};nav.insertAdjacentElement('afterend',themeToggle);
 // Keep the study home focused on its main action; tools remain one tap away.
 const mode=document.querySelector('#home > .mode');
 if(mode){const details=document.createElement('details');details.className='quick-tools';const summary=document.createElement('summary');summary.textContent='Preciso falar agora · expressões rápidas';mode.before(details);details.append(summary,mode);}
 const home=document.getElementById('home');
 // Group progress and recommendation into one learning dashboard to reduce Home card overload.
 const weekly=home&&home.querySelector('.weekly-progress');if(weekly){weekly.classList.add('learning-dashboard');const h=weekly.querySelector('.weekly-head strong');if(h)h.textContent='Seu ritmo de aprendizagem';}
// Progressive disclosure keeps the first screen focused on learning, while preserving the existing course cover and tools.
 const premium=home&&home.querySelector('.premium');
 if(premium){const d=document.createElement('details');d.className='home-more premium-more';const s=document.createElement('summary');s.innerHTML='<span class="summary-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m4 8 4 4 4-7 4 7 4-4-2 10H6z"/><path d="M7 18h10"/></svg></span><span>Conteúdo Premium</span><small>8 trilhas · 86 lições</small>';premium.before(d);d.append(s,premium);}

 if(home){const heading=home.querySelector('.title h3');if(heading)heading.textContent='Suas 4 fases';}
})();
