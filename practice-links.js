/* Presentation-only links to optional practice; no learning-state writes. */
(()=>{
 const nav=document.querySelector('.utility-nav');if(nav){const a=document.createElement('a');a.href='practice-more.html';a.textContent='Praticar mais';nav.append(a);}
 const add=(root,id)=>{if(!root||root.querySelector('.extra-practice-link'))return;let target=id;
 if(/^(7|8|9|10)\./.test(id))target='data-trends';if(/^11\./.test(id))target='data-proposal';
 if(!/^(1\.[1-8]|13\.6|14\.6|15\.6|data-trends|data-proposal)$/.test(target))return;
 const box=document.createElement('div');box.className='card extra-practice-link';const a=document.createElement('a');a.className='btn soft';a.href='practice-more.html#'+target;a.textContent='Praticar mais · vocabulário e desafios →';const p=document.createElement('p');p.className='muted';p.textContent='Atividade complementar com registro próprio. Suas conquistas atuais permanecem.';box.append(a,p);root.append(box);};
 const lesson=document.getElementById('lesson');if(lesson){new MutationObserver(()=>{if(!lesson.classList.contains('on'))return;const ey=lesson.querySelector('.ey');const id=ey?.textContent.match(/\d+\.\d+/)?.[0];if(id)add(lesson,id);}).observe(lesson,{childList:true,subtree:true});}
 const view=document.getElementById('view');if(view){new MutationObserver(()=>{const ey=view.querySelector('.ey');const id=ey?.textContent.match(/\d+\.\d+/)?.[0];if(id)add(view,id);}).observe(view,{childList:true,subtree:true});}
})();
