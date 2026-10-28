(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 767px)');
  const records = [];
  const sections = new Map();
  let pending = false;
  function registerGroup(elements, stage = 0) {
    elements.filter(Boolean).forEach((element, index) => {
      const section = element.closest('main > section');
      if (!section) return;
      if (!sections.has(section)) sections.set(section, []);
      const enhanced = ['ABOUT', 'SKILLS', 'PROJECT', 'CONTACT'].includes(section.id);
      if (enhanced) {
        const step = section.id === 'PROJECT' ? .12 : .065;
        element.style.setProperty('--reveal-delay', Math.min(stage * .09 + index * step, .85).toFixed(3) + 's');
      }
      const record = { element, section, index, stage, enhanced, progress: null };
      sections.get(section).push(record);
      records.push(record);
    });
  }
  const about = document.querySelector('#ABOUT');
  if (about) {
    registerGroup([about.querySelector('.about-intro-label'), about.querySelector('.about-statement'), ...about.querySelectorAll('.about-body p')]);
    registerGroup([about.querySelector('.about-image-heading'), ...about.querySelectorAll('.about-photo'), about.querySelector('.about-tag-label'), ...about.querySelectorAll('.about-tag')], 3);
    registerGroup([...about.querySelectorAll('.about-keyword')], 7);
  }
  const skills = document.querySelector('#SKILLS');
  if (skills) {
    registerGroup([...skills.querySelectorAll('.skills-heading > *')]);
    skills.querySelectorAll('.skills-category').forEach((category, categoryIndex) => {
      registerGroup([category.querySelector('.skills-category-copy'), ...category.querySelectorAll('.skills-card-list > li')], 2 + categoryIndex * 3);
    });
  }
  const projects = document.querySelector('#PROJECT');
  if (projects) registerGroup([projects.querySelector('.eyebrow'), ...projects.querySelectorAll('.project-row')]);
  const contact = document.querySelector('#CONTACT');
  if (contact) {
    registerGroup([...contact.querySelectorAll('.contact-heading > :not(.copy-status)')]);
    registerGroup([contact.querySelector('.contact-gallery')], 3);
    registerGroup([contact.querySelector('.gallery-pagination'), contact.querySelector('.gallery-hint'), contact.querySelector('.contact-footer')], 6);
  }
  function smooth(start, end, value) {
    const x = Math.max(0, Math.min(1, (value - start) / (end - start)));
    return x * x * (3 - 2 * x);
  }
  function layoutTop(element) {
    // Ignore reveal translations so animation never changes its own scroll thresholds.
    let top = 0;
    for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
    return top - scrollY;
  }
  function update() {
    pending = false;
    const height = innerHeight;
    const focused = document.activeElement;
    for (const [section, items] of sections) {
      const bounds = section.getBoundingClientRect();
      // Full-screen desktop sections finish at their anchor position, so all cards fit.
      const fitsScreen = !mobile.matches && bounds.height <= height * 1.12;
      const sectionProgress = (height * .75 - bounds.top) / (height * .75);
      items.forEach((record, index) => {
        let progress = 1;
        if (!reduced.matches && !record.element.contains(focused)) {
          if (fitsScreen) {
            if (section === projects && record.element.classList.contains('project-row')) {
              const rowIndex = Math.max(0, record.index - 1);
              const start = .18 + rowIndex * .07;
              progress = smooth(start, start + .3, sectionProgress);
            } else if (record.enhanced) {
              // Each stage has its own scroll window; fast scrolling retains a timed stagger.
              const stage = Math.min(record.stage * .035 + record.index * .028, .5);
              progress = smooth(.18 + stage, .48 + stage, sectionProgress);
            } else {
              const stagger = index / Math.max(1, items.length - 1) * .25;
              progress = smooth(.02 + stagger, .68 + stagger, sectionProgress);
            }
          } else {
            const top = layoutTop(record.element);
            const position = record.enhanced ? (height * .87 - top) / (height * .3) : (height * .98 - top) / (height * .33);
            const stagger = Math.min(record.index * .025, .16);
            progress = smooth(stagger, 1 + stagger, position);
          }
        }
        const value = progress.toFixed(3);
        if (record.progress !== value) {
          record.element.style.setProperty('--content-progress', value);
          record.progress = value;
        }
      });
    }
  }
  function queue() { if (!pending) { pending = true; requestAnimationFrame(update); } }
  try {
    records.forEach(record => record.element.classList.add('content-reveal'));
    update();
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    addEventListener('pageshow', queue);
    document.addEventListener('focusin', queue);
    document.addEventListener('focusout', queue);
    reduced.addEventListener('change', queue);
  } catch {
    records.forEach(record => record.element.classList.remove('content-reveal'));
  }
})();
