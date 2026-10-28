(() => {
  const chapters = [...document.querySelectorAll('.section-transition')];
  const opening = document.querySelector('#HOME');
  const openingStage = opening.querySelector('.home-stage');
  const links = [...document.querySelectorAll('.desktop-nav a, .section-progress a')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let pending = false;
  function smooth(start, end, value) {
    const x = Math.max(0, Math.min(1, (value - start) / (end - start)));
    return x * x * (3 - 2 * x);
  }
  function update() {
    pending = false;
    const height = innerHeight;
    let next = null;
    const openingRect = opening.getBoundingClientRect();
    const openingProgress = Number(openingStage.style.getPropertyValue('--progress'));
    if (!motion.matches && openingProgress > .35 && openingRect.bottom > height * .5) next = 'ABOUT';
    for (const chapter of chapters) {
      const rect = chapter.getBoundingClientRect();
      // Fade while the title is in view, rather than finishing its entrance offscreen.
      const progress = -rect.top / Math.max(1, rect.height - height);
      const enter = smooth(-.12, .42, progress);
      const leave = 1 - smooth(.55, 1.2, progress);
      chapter.style.setProperty('--chapter-opacity', (motion.matches ? 1 : enter * leave).toFixed(3));
      if (!motion.matches && rect.top <= height * .5 && rect.bottom > height * .5) next = chapter.dataset.nextSection;
    }
    document.body.classList.toggle('in-section-transition', !!next);
    if (next) {
      for (const link of links) {
        if (link.hash === '#' + next) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }
  function queue() { if (!pending) { pending = true; requestAnimationFrame(update); } }
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  addEventListener('pageshow', queue);
  motion.addEventListener('change', queue);
  update();
})();
