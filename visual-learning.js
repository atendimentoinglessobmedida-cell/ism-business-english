(() => {
  'use strict';
  const scenes = [
    {id:'meetings',en:'Meetings',pt:'Reuniões',action:'Ver módulos',target:'journey',caption:'Observe como a equipe compartilha ideias e escuta diferentes pontos de vista.'},
    {id:'presentations',en:'Presentations',pt:'Apresentações',action:'Ver módulos',target:'journey',caption:'Organize sua mensagem: contexto, evidência e próximo passo.'},
    {id:'negotiation',en:'Negotiations',pt:'Negociações',action:'Abrir simulações',target:'simulate',caption:'Identifique interesses em comum antes de propor um acordo.'},
    {id:'client-call',en:'Client calls',pt:'Conversas com clientes',action:'Abrir simulações',target:'simulate',caption:'Escute o pedido do cliente e confirme o próximo passo com clareza.'}
  ];
  const source = scene => 'assets/photo-' + scene.id + '.avif';
  const home = document.getElementById('home');
  if (home && !home.querySelector('.visual-learning-strip')) {
    const section = document.createElement('section');
    section.className = 'visual-learning-section';
    section.setAttribute('aria-labelledby','visualLearningTitle');
    section.innerHTML = '<div class="visual-learning-heading"><span class="ey">INGLÊS EM CONTEXTO</span><h2 id="visualLearningTitle">Pratique para o seu dia a dia</h2><p>Encontre a linguagem para cada situação profissional.</p></div><div class="visual-learning-strip">' + scenes.map(scene => `<button class="visual-scene" type="button" data-target="${scene.target}" aria-label="${scene.pt}: ${scene.action}"><img src="${source(scene)}" alt="" loading="lazy" decoding="async" width="1200" height="675"><span class="visual-scene-copy"><strong lang="en">${scene.en}</strong><small>${scene.pt}</small><span class="visual-scene-action">${scene.action}<i aria-hidden="true">↗</i></span></span></button>`).join('') + '</div><p class="visual-photo-credits"><a href="photo-credits.html">Créditos das fotografias</a></p>';
    home.querySelector('.home-action-grid')?.insertAdjacentElement('afterend',section);
    section.addEventListener('click',event => {
      const button = event.target.closest('.visual-scene');
      if (!button) return;
      const target = button.dataset.target;
      setNav(target); show(target);
      if (target === 'simulate') renderSimulation();
      const heading = document.getElementById(target)?.querySelector('h1,h2,h3');
      if (heading) { heading.tabIndex = -1; heading.focus({preventScroll:true}); }
    });
  }
  function choose(text) {
    text = text.toLowerCase();
    if (/negoti|deadline|disagree|objection|prazo|acordo/.test(text)) return scenes[2];
    if (/client|call|online|hybrid|video|cliente/.test(text)) return scenes[3];
    if (/present|data|result|proposal|apresent/.test(text)) return scenes[1];
    return scenes[0];
  }
  function decorateLesson() {
    const body = document.getElementById('lessonBody');
    if (!body || !body.querySelector('.lesson-flow-head') || body.querySelector('.lesson-visual')) return;
    // Use the lesson's objective, not unrelated vocabulary inside exercises.
    const goal = body.querySelector('.lesson-goal');
    const scene = choose((body.querySelector('.lesson-flow-head h2')?.textContent || '') + ' ' + (goal?.textContent || ''));
    const figure = document.createElement('figure');
    figure.className = 'lesson-visual';
    figure.innerHTML = `<img src="${source(scene)}" alt="" loading="lazy" decoding="async" width="1200" height="675"><figcaption><span>SEU CENÁRIO</span>${scene.caption}</figcaption>`;
    (goal || body.querySelector('.lesson-flow-head')).insertAdjacentElement('afterend',figure);
  }
  const lesson = document.getElementById('lessonBody');
  let pending = false;
  if (lesson) new MutationObserver(() => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; decorateLesson(); });
  }).observe(lesson,{childList:true,subtree:true});
  decorateLesson();
  const business = document.getElementById('businessmode');
  if (business && !business.querySelector('.businessmode-visual')) {
    const figure = document.createElement('figure');
    figure.className = 'businessmode-visual';
    figure.innerHTML = '<img src="assets/photo-negotiation.avif" alt="" loading="lazy" decoding="async" width="1200" height="675"><figcaption>Prepare sua mensagem. Encontre um objetivo em comum.</figcaption>';
    business.querySelector('.muted')?.insertAdjacentElement('afterend',figure);
  }
})();
