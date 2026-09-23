/* Shared navigation and explanatory pages. Does not write learning state. */
(()=>{
 const nav=document.createElement('nav');nav.className='utility-nav';nav.setAttribute('aria-label','Sobre o curso');
 nav.innerHTML='<a class="utility-item plans" href="planos.html"><span class="utility-icon" aria-hidden="true">▣</span><span>Planos e<br>preços</span></a><a class="utility-item professor" href="professor.html"><span class="utility-icon" aria-hidden="true">♙</span><span>Professor</span></a><a class="utility-item contact" href="professor.html#contato"><span class="utility-icon" aria-hidden="true">✉</span><span>Contato</span></a><a class="utility-item rewards" href="professor.html#conquistas"><span class="utility-icon" aria-hidden="true">★</span><span>Como ganhar<br>estrelas</span></a><a class="utility-item practice" href="practice-more.html"><span class="utility-icon" aria-hidden="true">▶</span><span>Praticar<br>mais</span></a>';
 document.querySelector('.top').insertAdjacentElement('afterend',nav);
 // Keep the study home focused on its main action; tools remain one tap away.
 const mode=document.querySelector('#home > .mode');
 if(mode){const details=document.createElement('details');details.className='quick-tools';const summary=document.createElement('summary');summary.textContent='Preciso falar agora · expressões rápidas';mode.before(details);details.append(summary,mode);}
 const home=document.getElementById('home');
 if(home){const heading=home.querySelector('.title h3');if(heading)heading.textContent='Suas 4 fases';}
})();
