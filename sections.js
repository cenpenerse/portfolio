// Dummy backend project concepts. Add each repository URL when ready.
const portfolioProjects = [
  {
    "title": "AUTH GATEWAY",
    "description": "인증·인가 API를 주제로 한 더미 프로젝트입니다. 로그인, 토큰 발급, 접근 권한 관리를 다룹니다.",
    "image": "./images/chrome-orb.webp",
    "codeUrl": ""
  },
  {
    "title": "ORDER FLOW",
    "description": "주문·결제 서비스를 주제로 한 더미 프로젝트입니다. 주문 상태와 트랜잭션 흐름을 다룹니다.",
    "image": "./images/chrome-preview.webp",
    "codeUrl": ""
  },
  {
    "title": "QUEUE WORKER",
    "description": "비동기 작업 처리를 주제로 한 더미 프로젝트입니다. 작업 큐와 재시도 흐름을 다룹니다.",
    "image": "./images/chrome-preview.webp",
    "codeUrl": ""
  },
  {
    "title": "CACHE LAYER",
    "description": "캐시 서버를 주제로 한 더미 프로젝트입니다. 조회 성능과 캐시 만료 정책을 다룹니다.",
    "image": "./images/chrome-preview.webp",
    "codeUrl": ""
  },
  {
    "title": "LOG PIPELINE",
    "description": "로그 수집 서비스를 주제로 한 더미 프로젝트입니다. 로그 저장·검색과 오류 추적을 다룹니다.",
    "image": "./images/chrome-preview.webp",
    "codeUrl": ""
  },
  {
    "title": "BOOKING CORE",
    "description": "예약 시스템을 주제로 한 더미 프로젝트입니다. 동시 요청과 중복 예약 방지를 다룹니다.",
    "image": "./images/chrome-orb.webp",
    "codeUrl": ""
  },
  {
    "title": "FILE STORAGE",
    "description": "파일 저장 API를 주제로 한 더미 프로젝트입니다. 업로드와 다운로드 권한 관리를 다룹니다.",
    "image": "./images/chrome-preview.webp",
    "codeUrl": ""
  }
];

const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');

const projectSection = document.querySelector('#PROJECT');
const projectList = document.querySelector('.project-list');
const projectPreview = document.querySelector('.project-preview');
const projectDialog = document.querySelector('.project-dialog');
const finePointer = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 801px)');
let selectedProject = -1;

function configureCodeLink(link, project) {
  if (project.codeUrl) {
    link.href = project.codeUrl;
    link.removeAttribute('aria-disabled');
    link.removeAttribute('title');
  } else {
    link.removeAttribute('href');
    link.setAttribute('aria-disabled', 'true');
    link.title = '저장소 링크 준비 중';
  }
}

function showProject(index) {
  if (!finePointer.matches) return;
  const project = portfolioProjects[index];
  if (selectedProject !== index) {
    projectPreview.querySelector('img').src = project.image;
    projectPreview.querySelector('.preview-name').textContent = project.title;
    projectPreview.querySelector('.preview-description').textContent = project.description;
    selectedProject = index;
  }
  projectList.querySelectorAll('.project-row').forEach((row, i) => row.classList.toggle('is-active', i === index));
  projectSection.classList.add('has-preview');
}
function hideProject() {
  projectSection.classList.remove('has-preview');
  projectList.querySelectorAll('.project-row').forEach(row => row.classList.remove('is-active'));
}
function openProject(index) {
  const project = portfolioProjects[index];
  projectDialog.querySelector('h2').textContent = project.title;
  projectDialog.querySelector('.project-dialog-description').textContent = project.description;
  const image = projectDialog.querySelector('img');
  image.src = project.image; image.alt = project.title + ' 프리뷰';
  configureCodeLink(projectDialog.querySelector('.project-dialog-code'), project);
  projectDialog.showModal(); document.body.classList.add('menu-open');
}
portfolioProjects.forEach((project, index) => {
  const row = document.createElement('li'); row.className = 'project-row';
  const number = document.createElement('span'); number.className = 'project-number'; number.textContent = String(index + 1).padStart(2, '0');
  const title = document.createElement('button'); title.className = 'project-title'; title.textContent = project.title;
  title.setAttribute('aria-haspopup', 'dialog');
  title.addEventListener('click', () => openProject(index));
  const code = document.createElement('a'); code.className = 'project-code'; code.textContent = 'CODE ↗'; code.target = '_blank'; code.rel = 'noopener noreferrer';
  code.setAttribute('aria-label', project.title + ' GitHub 저장소');
  configureCodeLink(code, project);
  row.append(number, title, code);
  row.addEventListener('pointerenter', () => showProject(index));
  row.addEventListener('focusin', () => showProject(index));
  projectList.append(row);
});
projectList.addEventListener('pointerleave', hideProject);
projectList.addEventListener('focusout', event => { if (!projectList.contains(event.relatedTarget)) hideProject(); });
projectList.addEventListener('pointermove', event => {
  if (!finePointer.matches || motionPreference.matches) return;
  const rect = projectList.getBoundingClientRect();
  const y = Math.max(-30, Math.min(110, (event.clientY - rect.top - rect.height * .4) * .22));
  const x = (event.clientX - rect.left - rect.width * .5) * .035;
  projectPreview.style.setProperty('--preview-x', `${x.toFixed(1)}px`);
  projectPreview.style.setProperty('--preview-y', `${y.toFixed(1)}px`);
});
finePointer.addEventListener('change', hideProject);
projectDialog.querySelector('.project-dialog-close').addEventListener('click', () => projectDialog.close());
projectDialog.addEventListener('close', () => document.body.classList.remove('menu-open'));
projectDialog.addEventListener('click', event => { if (event.target === projectDialog) { const r = projectDialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) projectDialog.close(); } });

const gallery = document.querySelector('.contact-gallery');
const galleryTrack = document.querySelector('.gallery-track');
const galleryCards = [...document.querySelectorAll('.gallery-card')];
const galleryDots = [...document.querySelectorAll('.gallery-pagination button')];
let galleryIndex = 1;
let galleryOffset = 0;
let drag = null;

function galleryStep() { return galleryCards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(galleryTrack).gap); }
function galleryPosition(index) { return (gallery.clientWidth - galleryCards[0].getBoundingClientRect().width) / 2 - index * galleryStep(); }
function setGallery(index) {
  galleryIndex = Math.max(0, Math.min(galleryCards.length - 1, index));
  galleryOffset = galleryPosition(galleryIndex);
  galleryTrack.style.setProperty('--gallery-offset', `${galleryOffset}px`);
  galleryCards.forEach((card, i) => { card.classList.toggle('is-active', i === galleryIndex); card.setAttribute('aria-current', String(i === galleryIndex)); });
  galleryDots.forEach((dot, i) => { if (i === galleryIndex) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current'); });
}
galleryDots.forEach((dot, index) => dot.addEventListener('click', () => setGallery(index)));
gallery.addEventListener('pointerdown', event => {
  if (event.button !== 0 || !event.isPrimary) return;
  drag = { id: event.pointerId, x: event.clientX, y: event.clientY, offset: galleryOffset, moved: 0, horizontal: false };
  gallery.setPointerCapture(event.pointerId);
});
gallery.addEventListener('pointermove', event => {
  if (!drag || event.pointerId !== drag.id) return;
  const dx = event.clientX - drag.x;
  if (!drag.horizontal && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(event.clientY - drag.y)) { drag.horizontal = true; gallery.classList.add('is-dragging'); }
  if (!drag.horizontal) return;
  drag.moved = dx;
  const min = galleryPosition(galleryCards.length - 1), max = galleryPosition(0);
  let next = drag.offset + dx;
  if (next < min) next = min + (next - min) * .2;
  if (next > max) next = max + (next - max) * .2;
  galleryTrack.style.setProperty('--gallery-offset', `${next}px`);
});
function endDrag(event) {
  if (!drag || event.pointerId !== drag.id) return;
  const next = drag.horizontal ? Math.round(galleryIndex - drag.moved / galleryStep()) : galleryIndex;
  drag = null; gallery.classList.remove('is-dragging'); setGallery(next);
  if (gallery.hasPointerCapture(event.pointerId)) gallery.releasePointerCapture(event.pointerId);
}
gallery.addEventListener('pointerup', endDrag);
gallery.addEventListener('pointercancel', endDrag);
gallery.addEventListener('lostpointercapture', endDrag);
gallery.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); setGallery(galleryIndex + (event.key === 'ArrowRight' ? 1 : -1)); }
  if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); setGallery(event.key === 'Home' ? 0 : galleryCards.length - 1); }
});
const galleryResize = new ResizeObserver(() => { drag = null; gallery.classList.remove('is-dragging'); setGallery(galleryIndex); });
galleryResize.observe(gallery);
setGallery(galleryIndex);

document.querySelector('.copy-email').addEventListener('click', async () => {
  const email = document.querySelector('.contact-email a').textContent;
  const status = document.querySelector('.copy-status');
  try {
    if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(email);
    else {
      const field = document.createElement('textarea'); field.value = email; field.style.position = 'fixed'; field.style.opacity = '0'; document.body.append(field); field.select();
      const copied = document.execCommand('copy'); field.remove(); if (!copied) throw new Error('Copy unavailable');
    }
    status.textContent = '이메일 주소를 복사했습니다.';
  } catch { status.textContent = '이메일 주소를 선택해 복사해 주세요.'; }
});

const homeVisibility = new IntersectionObserver(entries => {
  entries.forEach(entry => document.body.classList.toggle('on-home', entry.isIntersecting));
}, { threshold: 0 });
homeVisibility.observe(document.querySelector('#HOME'));
