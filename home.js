const home = document.querySelector('.home');
const stage = document.querySelector('.home-stage');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const compactHome = window.matchMedia('(max-width: 1199px)');
const homeSteps = [...home.querySelectorAll('.home-headline, .home-description, .home-question--slow, .home-question--data, .home-question--failure, .home-project-link')];
const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
let queued = false;
function scrollFade(start, end, value) {
  const position = clamp((value - start) / (end - start));
  return position * position * (3 - 2 * position);
}

function renderScroll() {
  home.classList.toggle('home-scroll-sequence', compactHome.matches);
  if (compactHome.matches) {
    stage.style.setProperty('--progress', '0');
    stage.style.setProperty('--copy-opacity', '1');
    stage.style.setProperty('--scene-opacity', '1');
    const transition = home.querySelector('.home-about-transition');
    const bounds = transition.getBoundingClientRect();
    const enter = scrollFade(innerHeight * .95, innerHeight * .45, bounds.top);
    const leave = scrollFade(-bounds.height * .3, -bounds.height * .85, bounds.top);
    stage.style.setProperty('--question-opacity', (reduceMotion.matches ? 1 : enter * (1 - leave)).toFixed(3));
    homeSteps.forEach((element, index) => {
      const top = element.getBoundingClientRect().top;
      const visible = reduceMotion.matches || index === 0 || top < innerHeight * .82;
      element.classList.toggle('home-step-visible', visible);
      // Hidden links and question buttons must not receive focus before their reveal.
      element.inert = !visible;
    });
    queued = false;
    return;
  }
  homeSteps.forEach(element => { element.inert = false; });
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
