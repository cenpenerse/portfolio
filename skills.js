// Backend-focused skills with the existing card layout and interactions.
(() => {
  const section = document.querySelector('#SKILLS');
  if (!section) return;
  // Re-align this section after layout changes, without a shared header offset.
  function alignSkills(behavior = 'smooth') {
    section.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : behavior });
  }
  document.querySelectorAll('a[href="#SKILLS"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      if (location.hash !== '#SKILLS') history.pushState(null, '', '#SKILLS');
      requestAnimationFrame(() => alignSkills());
    });
  });
  let userScrolled = false;
  addEventListener('wheel', () => { userScrolled = true; }, { once: true, passive: true });
  addEventListener('touchmove', () => { userScrolled = true; }, { once: true, passive: true });
  document.fonts.ready.then(() => {
    if (location.hash === '#SKILLS' && !userScrolled) alignSkills('instant');
  });
  // Backend-focused sample stack; adjust to match personal experience.
  const categories = [
  {
    "title": "언어 · 백엔드",
    "description": "백엔드 개발에 사용하는 프로그래밍 언어와 프레임워크, 실행 환경 및 API 설계 방식입니다.",
    "skills": [
      [
        "Java",
        "java"
      ],
      [
        "Spring Boot",
        "springboot"
      ],
      [
        "Spring Security",
        "springsecurity"
      ],
      [
        "Node.js",
        "nodedotjs"
      ],
      [
        "Express",
        "express"
      ],
      [
        "Python",
        "python"
      ],
      [
        "TypeScript",
        "typescript"
      ],
      [
        "REST APIs",
        "rest-api"
      ]
    ]
  },
  {
    "title": "데이터베이스 · 영속성",
    "description": "데이터 저장과 조회, 캐시 및 쿼리를 다루는 기술입니다.",
    "skills": [
      [
        "MySQL",
        "mysql"
      ],
      [
        "PostgreSQL",
        "postgresql"
      ],
      [
        "Redis",
        "redis"
      ],
      [
        "MongoDB",
        "mongodb"
      ],
      [
        "JPA",
        "jpa"
      ],
      [
        "Hibernate",
        "hibernate"
      ],
      [
        "QueryDSL",
        "querydsl"
      ],
      [
        "SQL",
        "sql"
      ]
    ]
  },
  {
    "title": "인프라 · 개발 도구",
    "description": "서버 배포와 운영, 버전 관리 및 API 테스트에 사용하는 도구입니다.",
    "skills": [
      [
        "Docker",
        "docker"
      ],
      [
        "Linux",
        "linux"
      ],
      [
        "Nginx",
        "nginx"
      ],
      [
        "AWS",
        "aws"
      ],
      [
        "Git",
        "git"
      ],
      [
        "GitHub",
        "github"
      ],
      [
        "Gradle",
        "gradle"
      ],
      [
        "Postman",
        "postman"
      ]
    ]
  }
];
  const container = section.querySelector('.skills-categories');
  categories.forEach((category, index) => {
    const group = document.createElement('div'); group.className = 'skills-category';
    const copy = document.createElement('div'); copy.className = 'skills-category-copy';
    const number = document.createElement('span'); number.className = 'skills-category-index'; number.textContent = String(index + 1).padStart(2, '0');
    const title = document.createElement('h3'); title.id = 'skills-category-' + index; title.textContent = category.title;
    const description = document.createElement('p'); description.className = 'skills-category-description'; description.textContent = category.description;
    copy.append(number, title, description);
    const list = document.createElement('ul'); list.className = 'skills-card-list'; list.setAttribute('aria-labelledby', title.id);
    category.skills.forEach(([name, icon]) => {
      const item = document.createElement('li');
      const card = document.createElement('button'); card.type = 'button'; card.className = 'technology-card'; card.setAttribute('aria-pressed', 'false');
      const image = document.createElement('img'); image.src = './images/skill-icons/' + icon + '.svg'; image.alt = ''; image.width = 29; image.height = 29; image.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span'); label.textContent = name;
      card.append(image, label); item.append(card); list.append(item);
    });
    group.append(copy, list); container.append(group);
  });
  const cards = [...section.querySelectorAll('.technology-card')];
  let hovered = null, focused = null, touched = null, pointerType = '';
  document.addEventListener('keydown', event => {
    if (event.key === 'Tab') { pointerType = 'keyboard'; hovered = null; touched = null; }
  }, true);
  function highlight(card) {
    for (const candidate of cards) {
      const selected = candidate === card;
      candidate.classList.toggle('is-highlighted', selected);
      candidate.setAttribute('aria-pressed', String(selected));
    }
    section.querySelectorAll('.skills-category').forEach(group => group.classList.toggle('has-highlight', !!card && group.contains(card)));
  }
  for (const card of cards) {
    card.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      hovered = card; touched = null; highlight(card);
    });
    card.addEventListener('pointerleave', event => {
      if (event.pointerType === 'touch') return;
      hovered = null; highlight(focused || touched);
    });
    card.addEventListener('pointerdown', event => { pointerType = event.pointerType; });
    card.addEventListener('pointerup', event => {
      if (event.pointerType !== 'touch') return;
      touched = touched === card ? null : card; focused = null; highlight(touched);
    });
    card.addEventListener('focus', () => {
      if (pointerType === 'touch') return;
      focused = card; touched = null; highlight(hovered || focused);
    });
    card.addEventListener('blur', () => { focused = null; highlight(hovered || touched); });
    card.addEventListener('keydown', event => {
      pointerType = 'keyboard';
      if (event.key === 'Escape') { hovered = null; focused = null; touched = null; card.blur(); highlight(null); }
      else { focused = card; highlight(card); }
    });
  }
  document.addEventListener('pointerdown', event => {
    if (!section.contains(event.target)) { touched = null; highlight(hovered || focused); }
  });
})();


// Keep the accessible heading complete while its visual text is typed.
(() => {
  const heading = document.querySelector('#skills-title');
  const text = heading?.querySelector('.skills-typed-text');
  if (!text || !('IntersectionObserver' in window)) return;
  const fullText = text.textContent;
  const letters = Array.from(fullText);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let timer, safetyTimer, visible = false;
  function finish() {
    clearTimeout(timer);
    clearTimeout(safetyTimer);
    text.textContent = fullText;
  }
  function start() {
    finish();
    if (reduced.matches) return;
    // Wait for the heading's scroll reveal before beginning to type.
    safetyTimer = setTimeout(finish, 2500);
    timer = setTimeout(() => {
      let count = 0;
      function type() {
        if (!visible || reduced.matches) { finish(); return; }
        text.textContent = letters.slice(0, ++count).join('');
        if (count < letters.length) timer = setTimeout(type, 80);
        else finish();
      }
      type();
    }, 350);
  }
  try {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        visible = entry.isIntersecting;
        if (visible) start();
        else finish();
      }
    }, { threshold: .5, rootMargin: '0px 0px -15% 0px' });
    observer.observe(heading);
    reduced.addEventListener('change', () => { if (reduced.matches) finish(); });
    addEventListener('pagehide', finish);
  } catch {
    finish();
  }
})();
