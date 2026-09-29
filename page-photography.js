(() => {
  'use strict';
  const makePhoto = (scene, eager = false) => {
    const image = document.createElement('img');
    image.className = 'page-context-photo';
    image.src = 'assets/photo-' + scene + '.avif';
    image.alt = '';
    image.width = 1200;
    image.height = 675;
    image.loading = eager ? 'eager' : 'lazy';
    image.decoding = 'async';
    return image;
  };
  const home = document.getElementById('home');
  if (home && !home.querySelector('.home-photo-cover')) {
    const cover = document.createElement('section');
    cover.className = 'home-photo-cover';
    cover.setAttribute('aria-label', 'Inglês para sua vida profissional');
    cover.innerHTML = '<div class="home-photo-copy"><span>ISM BUSINESS ENGLISH</span><h1>Seu inglês.<br>Novas possibilidades.</h1><p>Prepare-se para reuniões, apresentações e conversas que fazem parte da sua carreira.</p><a href="photo-credits.html">Créditos das fotografias</a></div>';
    cover.append(makePhoto('networking', true));
    home.prepend(cover);
  }
  for (const [id, scene] of [['journey','presentations'],['simulate','interview'],['toolkit','writing']]) {
    const panel = document.getElementById(id);
    if (!panel || panel.querySelector('.page-context-photo')) continue;
    const heading = panel.querySelector('h1,h2,h3');
    if (heading) heading.insertAdjacentElement('afterend', makePhoto(scene));
  }
  const routes = {
    'premium.html':'networking', 'interview.html':'interview',
    'emails.html':'writing', 'networking.html':'networking',
    'global-teams.html':'meetings', 'negotiation.html':'negotiation',
    'difficult-conversations.html':'negotiation', 'leadership.html':'meetings',
    'career-growth.html':'presentations'
  };
  const scene = routes[location.pathname.split('/').pop()];
  const view = document.getElementById('view') || document.getElementById('course-view');
  if (scene && view) {
    const decorate = () => {
      // Only the overview hero receives a cover; exercises remain compact.
      const hero = view.querySelector('.hero');
      if (hero && !hero.querySelector('.page-context-photo')) hero.prepend(makePhoto(scene));
    };
    new MutationObserver(decorate).observe(view, {childList:true,subtree:true});
    decorate();
    if (!document.querySelector('a[href="photo-credits.html"]')) {
      const credit = document.createElement('p');
      credit.className = 'page-photo-credit';
      credit.innerHTML = '<a href="photo-credits.html">Créditos das fotografias</a>';
      view.insertAdjacentElement('afterend', credit);
    }
  }
  const intro = document.querySelector('main > .intro');
  if (intro && location.pathname.endsWith('/planos.html')) {
    intro.append(makePhoto('presentations', true));
    const credit = document.createElement('p');
    credit.className = 'page-photo-credit';
    credit.innerHTML = '<a href="photo-credits.html">Créditos das fotografias</a>';
    intro.append(credit);
  }
})();
