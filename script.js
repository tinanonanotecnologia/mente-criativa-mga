(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { menu?.setAttribute('aria-expanded', 'false'); nav?.classList.remove('open'); } });
  document.querySelectorAll('svg.icon').forEach(icon => icon.setAttribute('aria-hidden', 'true'));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .1 });
    document.querySelectorAll('[data-reveal]').forEach((section, i) => {
      section.classList.add('reveal-ready'); section.style.transitionDelay = `${Math.min(i, 2) * 80}ms`; observer.observe(section);
    });
    document.querySelectorAll('.pillar-card,.service-card,.team-badge,.gallery-card').forEach(card => {
      const icon = card.querySelector('.icon');
      card.addEventListener('mouseenter', () => icon?.animate([{ transform: 'translateY(0) scale(1) rotate(0)' }, { transform: 'translateY(-3px) scale(1.12) rotate(-6deg)' }, { transform: 'translateY(0) scale(1) rotate(0)' }], { duration: 700, easing: 'cubic-bezier(.22,.61,.36,1)' }));
    });
    import('https://cdn.jsdelivr.net/npm/motion@11/+esm').then(({ animate, inView }) => {
      document.querySelectorAll('.pillar-card, .service-card, .gallery-card').forEach((card, index) => {
        inView(card, () => animate(card, { opacity: [0, 1], y: [12, 0] }, { duration: .6, delay: index * .06, easing: [.22, .61, .36, 1] }));
      });
      document.querySelectorAll('.icon-heart').forEach(icon => animate(icon, { scale: [1, 1.08, 1] }, { duration: 2.8, repeat: Infinity, easing: 'ease-in-out' }));
    }).catch(() => {});
  }
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    nav?.querySelectorAll('a').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
  }), { rootMargin: '-20% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
})();



(() => {
  const dialog = document.querySelector('.gallery-lightbox');
  const image = dialog?.querySelector('[data-gallery-image]');
  const title = dialog?.querySelector('[data-gallery-title]');
  const caption = dialog?.querySelector('[data-gallery-caption]');
  const close = dialog?.querySelector('[data-gallery-close]');
  let lastTrigger = null;
  const closeDialog = () => {
    if (!dialog) return;
    if (dialog.open && typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  };
  document.querySelectorAll('[data-gallery-item]').forEach(card => {
    const trigger = card.querySelector('.gallery-trigger');
    const source = card.querySelector('img');
    trigger?.addEventListener('click', () => {
      if (!dialog || !image || !source) return;
      lastTrigger = trigger;
      image.src = card.dataset.full || source.src;
      image.alt = source.alt;
      if (title) title.textContent = card.dataset.title || 'Foto ampliada';
      if (caption) caption.textContent = card.dataset.caption || '';
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      close?.focus({preventScroll:true});
    });
  });
  close?.addEventListener('click', closeDialog);
  dialog?.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
  dialog?.addEventListener('close', () => { image?.removeAttribute('src'); lastTrigger?.focus({preventScroll:true}); });
  dialog?.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
})();
