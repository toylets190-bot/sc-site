/* Santa Clara EC — js/polish.js
   Movimento e acabamento visual: entrada das seções, títulos de fundo, tela de abertura, poeira dourada e menu que acompanha a rolagem.
   Carregado como script clássico, na ordem do index.html (não reordene). */

(function () {
  try {
    var els = [].slice.call(document.querySelectorAll('main>section:not(.hero-match)>.container')); if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { el.classList.add('rv'); io.observe(el); });
    setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 7000);
  } catch (e) {}
})();

(function () {
  try {
    function ghosts() { Array.prototype.forEach.call(document.querySelectorAll('main>section .section-header'), function (h) { var t = h.querySelector('.section-main-title'); if (t && !h.dataset.ghost) h.dataset.ghost = t.textContent.trim().split(/\s+/).slice(0, 3).join(' '); }); }
    ghosts(); window.addEventListener('load', ghosts);
    var hm = document.querySelector('.hero-match'); if (hm && !hm.querySelector('.hero-aurora')) { var au = document.createElement('div'); au.className = 'hero-aurora'; au.setAttribute('aria-hidden', 'true'); hm.insertBefore(au, hm.firstChild); }
    if (!window.matchMedia || !matchMedia('(hover:hover) and (pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    var SEL = '.player-card,.news-featured,.product-card,.ticket-sector-card,.jg-card', root = document.documentElement;
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest(SEL); if (!c || root.classList.contains('a11y-rm')) return;
      var r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
      c.style.transform = 'perspective(900px) rotateX(' + ((.5 - y / r.height) * 7) + 'deg) rotateY(' + ((x / r.width - .5) * 9) + 'deg) translateY(-6px)';
    });
    document.addEventListener('pointerout', function (e) {
      var c = e.target.closest && e.target.closest(SEL); if (c && !c.contains(e.relatedTarget)) { c.style.transform = ''; c.style.removeProperty('--mx'); c.style.removeProperty('--my'); }
    });
  } catch (e) {}
})();

(function () {
  try {
    var root = document.documentElement, reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
    var sp = document.getElementById('introSplash');
    try { if (sessionStorage.getItem('scec_intro') || reduce) { if (sp) sp.remove(); } else { sessionStorage.setItem('scec_intro', '1'); setTimeout(function () { if (sp) sp.remove(); }, 2600); } } catch (e) {}
    /* poeira dourada no topo */
    var hm = document.querySelector('.hero-match');
    if (hm && !reduce && 'IntersectionObserver' in window && !root.classList.contains('a11y-rm')) {
      var cv = document.createElement('canvas'), c = cv.getContext('2d'), W = 0, H = 0, P = [], run = false, dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.className = 'hero-dust'; cv.setAttribute('aria-hidden', 'true'); hm.insertBefore(cv, hm.firstChild);
      var size = function () { W = hm.clientWidth; H = hm.clientHeight; cv.width = W * dpr; cv.height = H * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0); P = []; for (var i = 0, n = Math.round(W * H / 22000); i < n; i++) P.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + .4, v: Math.random() * .35 + .12, a: Math.random() * .5 + .25, p: Math.random() * 6.28 }); };
      var frame = function () { if (!run) return; c.clearRect(0, 0, W, H); P.forEach(function (q) { q.y -= q.v; q.p += .02; q.x += Math.sin(q.p) * .25; if (q.y < -4) { q.y = H + 4; q.x = Math.random() * W; } c.beginPath(); c.fillStyle = 'rgba(243,217,138,' + (q.a * (.6 + .4 * Math.sin(q.p * 2))).toFixed(2) + ')'; c.arc(q.x, q.y, q.r, 0, 6.283); c.fill(); }); requestAnimationFrame(frame); };
      size(); window.addEventListener('resize', size);
      new IntersectionObserver(function (es) { var v = es[0].isIntersecting; if (v && !run) { run = true; frame(); } else if (!v) run = false; }).observe(hm);
    }
    /* títulos de fundo com parallax */
    var heads = [].slice.call(document.querySelectorAll('.section-header[data-ghost]')), vis = new Set(), tick = false;
    if (heads.length && !reduce && 'IntersectionObserver' in window) {
      var upd = function () { tick = false; vis.forEach(function (h) { h.style.setProperty('--gx', ((h.getBoundingClientRect().top - innerHeight / 2) * .12).toFixed(1) + 'px'); }); };
      var hio = new IntersectionObserver(function (es) { es.forEach(function (e) { e.isIntersecting ? vis.add(e.target) : vis.delete(e.target); }); upd(); });
      heads.forEach(function (h) { hio.observe(h); });
      window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    }
    /* menu acompanha a seção em que você está */
    var links = [].slice.call(document.querySelectorAll('.desktop-nav a[href^="#"]')), map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    if (links.length && 'IntersectionObserver' in window) {
      var so = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { links.forEach(function (a) { a.classList.remove('active'); }); [].forEach.call(document.querySelectorAll('.nav-gb'), function (g) { g.classList.remove('on'); }); var ln = map[e.target.id]; if (ln) { ln.classList.add('active'); var gp = ln.closest('.nav-g'); if (gp) gp.querySelector('.nav-gb').classList.add('on'); } } }); }, { rootMargin: '-35% 0px -60% 0px' });
      [].forEach.call(document.querySelectorAll('main>section[id]'), function (el) { so.observe(el); });
    }
  } catch (e) {}
})();
