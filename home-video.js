(() => {
  const video = document.querySelector('#HOME .home-video');
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.controls = false;
  let visible = true;
  const homeSection = document.querySelector('#HOME');
  const homeStage = homeSection.querySelector('.home-stage');
  const navigation = [...document.querySelectorAll('.desktop-nav a, .section-progress a')];
  let navigationPending = false;
  function syncHomeNavigation() {
    navigationPending = false;
    const top = homeSection.getBoundingClientRect().top;
    const transitionDistance = Math.max(1, homeSection.offsetHeight - homeStage.offsetHeight);
    if (top <= 1 && -top < transitionDistance * .35) {
      navigation.forEach(link => {
        if (link.hash === '#HOME') link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }
  addEventListener('scroll', () => {
    if (!navigationPending) { navigationPending = true; requestAnimationFrame(syncHomeNavigation); }
  }, { passive: true });
  syncHomeNavigation();
  function playVideo() {
    if (!visible || document.hidden) return;
    const playing = video.play();
    if (playing) playing.catch(() => { /* Retry when media or browser visibility is ready. */ });
  }
  video.addEventListener('canplay', playVideo, { once: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else playVideo();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) playVideo();
      else video.pause();
    });
    observer.observe(video);
  }
  playVideo();
})();
