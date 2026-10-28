const home = document.querySelector('.home');
const stage = document.querySelector('.home-stage');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
let queued = false;
function scrollFade(start, end, value) {
  const position = clamp((value - start) / (end - start));
  return position * position * (3 - 2 * position);
}

function renderScroll() {
  const distance = home.offsetHeight - stage.offsetHeight;
  const rawProgress = reduceMotion.matches ? 0 : Math.max(0, -home.getBoundingClientRect().top / Math.max(1, distance));
  const progress = clamp(rawProgress);
  stage.style.setProperty('--progress', progress.toFixed(4));
  // Give the question the full transition interval before the ABOUT content.
  const homeOpacity = 1 - scrollFade(.1, .45, progress);
  const questionOpacity = scrollFade(.25, .6, rawProgress) * (1 - scrollFade(.72, 1.12, rawProgress));
  stage.style.setProperty('--copy-opacity', homeOpacity.toFixed(3));
  stage.style.setProperty('--scene-opacity', homeOpacity.toFixed(3));
  stage.style.setProperty('--question-opacity', (reduceMotion.matches ? 0 : questionOpacity).toFixed(3));
  queued = false;
}
function queueScroll() {
  if (!queued) { queued = true; requestAnimationFrame(renderScroll); }
}
window.addEventListener('scroll', queueScroll, { passive: true });
window.addEventListener('resize', queueScroll);
reduceMotion.addEventListener('change', queueScroll);
renderScroll();

const menuButton = document.querySelector('.site-header .menu-toggle');
const menu = document.querySelector('#full-menu');
function closeMenu() { menu.close(); }
menuButton.addEventListener('click', () => {
  menu.showModal(); document.body.classList.add('menu-open');
  menuButton.setAttribute('aria-expanded', 'true');
});
menu.addEventListener('close', () => {
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
});
menu.querySelector('.dialog-close').addEventListener('click', closeMenu);
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

const sections = [...document.querySelectorAll('main > section')];
const navLinks = [...document.querySelectorAll('.desktop-nav a, .section-progress a')];
const observer = new IntersectionObserver(() => {
  const active = sections.find(section => {
    const rect = section.getBoundingClientRect();
    return rect.top <= innerHeight * .5 && rect.bottom > innerHeight * .5;
  });
  if (!active) return;
  navLinks.forEach(link => {
    if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}, { rootMargin: '-49% 0px -49% 0px', threshold: 0 });
sections.forEach(section => observer.observe(section));
