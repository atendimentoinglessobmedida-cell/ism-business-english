/* Shared navigation and explanatory pages. Does not write learning state. */
(()=>{
 const nav=document.createElement('nav');nav.className='utility-nav';nav.setAttribute('aria-label','Sobre o curso');
 nav.innerHTML='<a href="professor.html">Professor</a><a href="professor.html#contato">Contato</a><a href="professor.html#conquistas">Como ganhar estrelas</a>';
 document.querySelector('.top').insertAdjacentElement('afterend',nav);
 // Keep the study home focused on its main action; tools remain one tap away.
 const mode=document.querySelector('#home > .mode');
 if(mode){const details=document.createElement('details');details.className='quick-tools';const summary=document.createElement('summary');summary.textContent='Preciso falar agora · expressões rápidas';mode.before(details);details.append(summary,mode);}
 const home=document.getElementById('home');
 if(home){const heading=home.querySelector('.title h3');if(heading)heading.textContent='Suas 4 fases';}
})();
