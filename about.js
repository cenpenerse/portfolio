// ABOUT navigation state; content motion is shared with the other sections in reveal.js.
(() => {
  const section = document.querySelector('#ABOUT');
  if (!section) return;
  let pending = false;
  function update() {
    pending = false;
    const rect = section.getBoundingClientRect();
    document.body.classList.toggle('about-active', rect.top <= innerHeight * .5 && rect.bottom > innerHeight * .5);
  }
  function queue() { if (!pending) { pending = true; requestAnimationFrame(update); } }
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  addEventListener('pageshow', queue);
  update();
})();
