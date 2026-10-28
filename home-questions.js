(() => {
  const home = document.querySelector('#HOME');
  const field = home?.querySelector('.question-field');
  if (!field) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const namespace = 'http://www.w3.org/2000/svg';
  const buttons = [...field.querySelectorAll('.home-question')];
  function svgNode(tag, attributes, parent) {
    const node = document.createElementNS(namespace, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    if (parent) parent.append(node);
    return node;
  }
  function line(parent, points, className, delay = .7) {
    const d = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
    return svgNode('path', { d, class: className, pathLength: 1, style: `--draw-delay:${delay}s` }, parent);
  }
  function network(svg, mobile) {
    const edges = svgNode('g', { class: 'network-edges' }, svg);
    const dots = svgNode('g', { class: 'network-nodes' }, svg);
    const width = mobile ? 3 : 4, depth = 3;
    const point = (i, j, k) => mobile ? [190 + i * 35 - j * 40, 455 + i * 15 + j * 16 + k * 40] : [800 + i * 92 - j * 104, 505 + i * 32 + j * 39 + k * 78];
    let edgeIndex = 0;
    for (let k = 0; k < 2; k++) for (let j = 0; j < depth; j++) for (let i = 0; i < width; i++) {
      const p = point(i, j, k);
      if (i + 1 < width) line(edges, [p, point(i + 1, j, k)], 'network-edge', 1.35 + edgeIndex++ % 6 * .04);
      if (j + 1 < depth) line(edges, [p, point(i, j + 1, k)], 'network-edge', 1.35 + edgeIndex++ % 6 * .04);
      if (!k) line(edges, [p, point(i, j, 1)], 'network-edge', 1.35 + edgeIndex++ % 6 * .04);
      if ((i + j + k) % 4 === 0) svgNode('rect', { x: p[0] - 4, y: p[1] - 4, width: 8, height: 8, class: 'network-node network-node--square', style: '--node-delay:1.65s' }, dots);
      else svgNode('circle', { cx: p[0], cy: p[1], r: mobile ? 1.6 : 1.9, class: 'network-node', style: '--node-delay:1.7s' }, dots);
    }
    const guides = mobile ? ['M290 390V600','M105 425V605','M190 430V455'] : ['M390 168V575','M326 290V445H358V478','M1345 175V620','M1405 240V620','M575 545V735','M725 575V745','M1010 665V810','M1250 420V570','M744 458V505'];
    guides.forEach(d => svgNode('path', { d, class: 'network-guide' }, svg));
    const routeData = mobile ? [
      { key: 'slow', d: 'M50 170H78Q92 170 92 185V194H20V360Q20 390 44 400H130L150 471', start: [50,170], trace: [[150,471],[185,486],[185,526]] },
      { key: 'data', d: 'M70 420H110Q127 420 138 434L150 471', start: [70,420], trace: [[150,471],[150,511],[185,526]] },
      { key: 'failure', d: 'M70 580H93Q110 580 110 560V527', start: [70,580], trace: [[110,527],[145,542],[180,557]] }
    ] : [
      { key: 'slow', d: 'M230 190H330Q362 190 362 222V445Q362 480 395 480H570Q590 480 610 494L696 544', start: [230,190], trace: [[696,544],[788,576],[880,608]] },
      { key: 'simple', d: 'M1320 175V216Q1320 250 1285 250H1200M1320 175H1250V406Q1250 420 1235 431L1070 540H1035L984 569', start: [1320,175], trace: [[984,569],[880,608],[880,686]] },
      { key: 'data', d: 'M240 510H570Q590 510 610 520L696 544', start: [240,510], trace: [[696,544],[696,622],[788,654]] },
      { key: 'scale', d: 'M1405 520H1396Q1386 520 1375 509L1354 490Q1348 480 1333 480H1130Q1111 480 1100 495L1076 601', start: [1405,520], trace: [[1076,601],[972,640],[972,718]] },
      { key: 'failure', d: 'M290 735H346Q377 735 400 707L439 665Q455 645 486 645H563Q585 645 592 661', start: [290,735], trace: [[592,661],[684,693],[776,725]] }
    ];
    routeData.forEach((route, index) => {
      const order = buttons.findIndex(button => button.dataset.question === route.key);
      const delay = .6 + order * .12;
      const group = svgNode('g', { class: 'home-branch', 'data-home-branch': route.key }, svg);
      svgNode('path', { d: route.d, class: 'home-route', pathLength: 1, style: `--draw-delay:${delay}s` }, group);
      line(group, route.trace, 'branch-trace', delay + .35);
      const markers = [route.start, ...route.trace];
      markers.forEach((p, n) => svgNode('rect', { x: p[0] - (n ? 2.5 : 3.5), y: p[1] - (n ? 2.5 : 3.5), width: n ? 5 : 7, height: n ? 5 : 7, class: 'branch-node', style: `--node-delay:${delay + .4}s` }, group));
    });
    const dust = svgNode('g', { class: 'home-dust' }, svg);
    const specks = mobile ? [[300,179],[315,415],[305,580],[80,650]] : [[257,282],[439,263],[284,383],[489,430],[350,420],[699,470],[1154,524],[1261,671],[524,733],[242,606],[305,642],[342,784],[1438,313]];
    specks.forEach(([x, y], i) => svgNode('rect', { x, y, width: i % 4 ? 3 : 6, height: i % 4 ? 3 : 6 }, dust));
    (mobile ? [[300,370],[105,605]] : [[390,166],[326,291],[1345,329],[1250,569],[1070,736]]).forEach(([x,y]) => svgNode('rect', { x: x - 4.5, y: y - 4.5, width: 9, height: 9, class: 'network-node network-node--outline' }, svg));
  }
  network(field.querySelector('.home-network--desktop'), false);
  network(field.querySelector('.home-network--mobile'), true);

  const branches = [...field.querySelectorAll('.home-branch')];
  let hovered = null, focused = null;
  function activate(key) {
    buttons.forEach(button => button.classList.toggle('is-active', button.dataset.question === key));
    branches.forEach(branch => branch.classList.toggle('is-active', branch.dataset.homeBranch === key));
  }
  buttons.forEach(button => {
    const key = button.dataset.question;
    button.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { hovered = key; activate(key); } });
    button.addEventListener('pointerleave', () => { hovered = null; activate(focused); });
    button.addEventListener('focus', () => { focused = key; activate(key); });
    button.addEventListener('blur', () => { focused = null; activate(hovered); });
    button.addEventListener('keydown', event => { if (event.key === 'Escape') { hovered = null; button.blur(); activate(null); } });
  });
  document.addEventListener('keydown', event => { if (event.key === 'Tab') hovered = null; }, true);

  let pointerFrame = false, mouseX = 0, mouseY = 0;
  function paintPointer() {
    pointerFrame = false;
    field.style.setProperty('--pointer-x', `${mouseX.toFixed(2)}px`);
    field.style.setProperty('--pointer-y', `${mouseY.toFixed(2)}px`);
  }
  const stage = home.querySelector('.home-stage');
  stage.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || reduced.matches || !finePointer.matches) return;
    const rect = stage.getBoundingClientRect();
    mouseX = (event.clientX / rect.width - .5) * 10;
    mouseY = ((event.clientY - rect.top) / rect.height - .5) * 8;
    if (!pointerFrame) { pointerFrame = true; requestAnimationFrame(paintPointer); }
  });
  stage.addEventListener('pointerleave', () => { mouseX = 0; mouseY = 0; paintPointer(); });

  const navigation = [...document.querySelectorAll('.desktop-nav a, .section-progress a')];
  let scrollFrame = false;
  function paintScroll() {
    scrollFrame = false;
    const rect = home.getBoundingClientRect();
    const distance = Math.max(1, home.offsetHeight - stage.offsetHeight);
    const rise = reduced.matches ? 0 : Math.min(innerHeight * .045, Math.max(0, -rect.top) * .1);
    field.style.setProperty('--network-rise', `${rise.toFixed(2)}px`);
    if (rect.top <= 1 && -rect.top < distance * .35) {
      navigation.forEach(link => { if (link.hash === '#HOME') link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
    }
  }
  function queueScroll() { if (!scrollFrame) { scrollFrame = true; requestAnimationFrame(paintScroll); } }
  addEventListener('scroll', () => { finishIntro(); queueScroll(); }, { passive: true });
  addEventListener('resize', queueScroll);
  addEventListener('pageshow', queueScroll);
  paintScroll();
  // Default CSS is visible. Only a successful initialization opts into the intro.
  // Removing this class always restores the final state, without restarting on HOME navigation.
  let introTimer;
  let introFinished = reduced.matches || scrollY > 0 || (location.hash && location.hash !== '#HOME');
  function finishIntro() {
    introFinished = true;
    clearTimeout(introTimer);
    field.classList.remove('home-intro-running');
  }
  addEventListener('wheel', finishIntro, { passive: true });
  addEventListener('touchmove', finishIntro, { passive: true });
  addEventListener('keydown', event => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) finishIntro();
  });
  document.addEventListener('click', event => {
    if (event.target.closest('a[href^="#"]')) finishIntro();
  });
  if (!introFinished) {
    try {
      introTimer = setTimeout(finishIntro, 2500);
      field.classList.add('home-intro-running');
    } catch {
      finishIntro();
    }
  }
  reduced.addEventListener('change', () => {
    if (reduced.matches) { finishIntro(); mouseX = 0; mouseY = 0; paintPointer(); }
    queueScroll();
  });
})();
