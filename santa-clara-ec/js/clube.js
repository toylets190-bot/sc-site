/* Santa Clara EC — js/clube.js
   Menu em grupos, carrossel de destaques, ficha do clube, faixa de patrocinadores e rodapé.
   Carregado como script clássico, na ordem do index.html (não reordene). */

(function () {
  try {
    var E = window.EDITAR || {}, P = E.PROXIMO_JOGO || {}, $ = function (i) { return document.getElementById(i); }, ME = 'Santa Clara EC';
    var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'], DIA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'], pad = function (n) { return String(n).padStart(2, '0'); };
    var go = function (id) { var s = $(id); if (s) s.scrollIntoView({ behavior: 'smooth' }); };
    var brl = function (v) { return 'R$ ' + Number(v).toFixed(2).replace('.', ','); };
    /* ---- menu: dropdown por toque/teclado ---- */
    var groups = [].slice.call(document.querySelectorAll('.nav-g'));
    groups.forEach(function (g) { var b = g.querySelector('.nav-gb');
      b.addEventListener('click', function (e) { e.stopPropagation(); var o = !g.classList.contains('open'); groups.forEach(function (x) { x.classList.remove('open'); x.querySelector('.nav-gb').setAttribute('aria-expanded', 'false'); }); if (o) { g.classList.add('open'); b.setAttribute('aria-expanded', 'true'); } });
      g.querySelectorAll('.nav-dd a').forEach(function (a) { a.addEventListener('click', function () { g.classList.remove('open'); if (document.activeElement) document.activeElement.blur(); }); }); });
    document.addEventListener('click', function () { groups.forEach(function (x) { x.classList.remove('open'); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') groups.forEach(function (x) { x.classList.remove('open'); if (x.contains(document.activeElement)) document.activeElement.blur(); }); });
    /* ---- jogos futuros ---- */
    var G = [P].concat(E.CALENDARIO || []).filter(function (g) { return g && g.data; }).map(function (g) { var d = new Date(g.data), adv = g.adversario || g.adv, casa = g.emCasa !== false; return { adv: adv, casa: casa, iso: g.data, t: d.getTime(), d: d, rod: g.rodada, title: casa ? ME + ' × ' + adv : adv + ' × ' + ME, when: DIA[d.getDay()] + ', ' + d.getDate() + ' ' + MES[d.getMonth()] + ' • ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) }; })
      .filter(function (g) { return g.t > Date.now(); }).sort(function (a, b) { return a.t - b.t; });
    /* ---- carrossel de destaques ---- */
    var S = [], nx = G[0], hm = G.filter(function (g) { return g.casa; })[0];
    if (nx) S.push(nx.casa ? { t: 't1', tag: 'Próximo jogo • em casa', title: nx.title, p: nx.when + ' • Estádio Vale de Santa Clara. Garanta o seu lugar na Toca do Lobo.', emo: '🎟️', c1: ['🎟️ Comprar ingresso', function () { tkPickByDate(nx.iso); }], c2: ['Escolher outro jogo', '#escolha-jogo'] }
      : { t: 't3', tag: 'Próximo jogo • fora de casa', title: nx.title, p: nx.when + '. O estádio é do mandante: veja as informações para a viagem da Matilha.', emo: '🚌', c1: ['🏟️ Estádio do mandante', function () { if (window.jgPick) jgPick(nx.iso); setTimeout(function () { go('estadio-visitante'); }, 80); }], c2: ['Escolher outro jogo', '#escolha-jogo'] });
    if (hm && nx && !nx.casa) S.push({ t: 't1', tag: 'Próximo jogo em casa', title: hm.title, p: hm.when + ' • Estádio Vale de Santa Clara. Os ingressos já estão à venda.', emo: '🎟️', c1: ['🎟️ Comprar ingresso', function () { tkPickByDate(hm.iso); }], c2: ['Ver o calendário', '#jogos'] });
    try { var n0 = DB.news[0]; if (n0) S.push({ t: 't2', tag: 'Notícia • ' + n0.category, title: n0.title, p: n0.excerpt, img: n0.image, cv: 1, c1: ['Ler matéria', '#noticias'], c2: ['Todas as notícias', '#noticias'] }); } catch (e) {}
    try { var pr = DB.products.filter(function (x) { return x.badge; })[0] || DB.products[0]; if (pr) S.push({ t: 't1', tag: 'Loja oficial' + (pr.badge ? ' • ' + pr.badge : ''), title: pr.name, p: 'A partir de ' + brl(pr.price) + '. Vista o manto da Matilha e leve o Terror do Vale com você.', img: pr.img || pr.imgur, c1: ['🛍️ Ver na loja', '#loja'], c2: ['Ser sócio e pagar menos', '#socio'] }); } catch (e) {}
    var evs = (E.EVENTOS || []).map(function (e) { var d = new Date(e.data + 'T' + (e.hora || '12:00') + ':00-03:00'); return { e: e, t: d.getTime(), d: d }; }).filter(function (x) { return x.t > Date.now(); }).sort(function (a, b) { return a.t - b.t; });
    if (evs[0]) { var ev = evs[0], d0 = ev.d; S.push({ t: 't4', tag: 'Evento do clube' + (ev.e.tipo ? ' • ' + ev.e.tipo : ''), title: ev.e.titulo, p: DIA[d0.getDay()] + ', ' + d0.getDate() + ' ' + MES[d0.getMonth()] + (ev.e.local ? ' • ' + ev.e.local : '') + (ev.e.desc ? '. ' + ev.e.desc : ''), emo: '📅', c1: ['Fale com o clube', function () { ctOpen('fal'); }], c2: ['Eventos e espaços', '#espacos'] }); }
    S.push({ t: 't2', tag: 'Programa de sócios', title: 'Seja sócio do Santa Clara', p: 'Desconto em ingressos, pré-venda e benefícios exclusivos para a Matilha. Também dá para doar ao clube.', emo: '💙', c1: ['Ver planos', '#socio'], c2: ['Perguntas e contato', function () { ctOpen('fal'); }] });
    S.push({ t: 't4', tag: 'Matilha Play', title: 'Palpite, quiz e pênaltis', p: 'Jogue, ganhe pontos e mostre que você é Alfa da Matilha.', emo: '🎮', c1: ['Jogar agora', '#matilha-play'], c2: ['Monte seu 11', '#monte-seu-11'] });
    S.push({ t: 't3', tag: 'Categorias de base', title: 'Seja um Lobo', p: 'Faça sua pré-inscrição para as avaliações do Santa Clara e receba um protocolo na hora.', emo: '🐺', c1: ['Fazer pré-inscrição', function () { ctOpen('pen'); }], c2: ['Conhecer o clube', '#clube'] });
    var tr = $('dzTrack'), dots = $('dzDots'), dz = $('dz'), cur = 0, tm = null, hold = false, reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches, DUR = 6500;
    if (tr) {
      var cta = function (c, cls) { return typeof c[1] === 'string' ? '<a class="' + cls + '" href="' + c[1] + '">' + c[0] + '</a>' : '<button type="button" class="' + cls + '" data-f="1">' + c[0] + '</button>'; };
      tr.innerHTML = S.map(function (x, i) { return '<article class="dz-slide ' + x.t + '" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' de ' + S.length + '"><div class="dz-txt"><span class="dz-tag">' + esc(x.tag) + '</span><div class="dz-title" role="heading" aria-level="2">' + esc(x.title) + '</div><p class="dz-p">' + esc(x.p) + '</p><div class="dz-cta">' + cta(x.c1, 'btn-primary') + cta(x.c2, 'btn-outline') + '</div></div><div class="dz-img">' + (x.img ? '<img class="' + (x.cv ? 'cv' : '') + '" src="' + esc(x.img) + '" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement(\'span\'),{className:\'dz-emo\',textContent:\'' + (x.cv ? '📰' : '🛍️') + '\'}))">' : '<span class="dz-emo">' + x.emo + '</span>') + '</div></article>'; }).join('');
      [].forEach.call(tr.querySelectorAll('.dz-slide'), function (el, i) { [].forEach.call(el.querySelectorAll('button[data-f]'), function (b, k) { b.onclick = function () { (k === 0 ? S[i].c1 : S[i].c2)[1](); }; }); });
      dots.innerHTML = S.map(function (x, i) { return '<button type="button" class="dz-dot" aria-label="Ir para o destaque ' + (i + 1) + '"><i></i></button>'; }).join('');
      var show = function (i) { cur = (i + S.length) % S.length; tr.style.transform = 'translateX(-' + cur * 100 + '%)'; [].forEach.call(dots.children, function (d, k) { d.classList.toggle('on', k === cur); void d.offsetWidth; }); [].forEach.call(tr.children, function (el, k) { el.setAttribute('aria-hidden', k !== cur); }); sched(); };
      var sched = function () { clearTimeout(tm); dz.classList.toggle('play', !reduce && !hold); if (!reduce && !hold) tm = setTimeout(function () { show(cur + 1); }, DUR); };
      dz.style.setProperty('--dzt', DUR + 'ms');
      dz.querySelector('.prev').onclick = function () { show(cur - 1); }; dz.querySelector('.next').onclick = function () { show(cur + 1); };
      [].forEach.call(dots.children, function (d, k) { d.onclick = function () { show(k); }; });
      dz.addEventListener('mouseenter', function () { hold = true; sched(); }); dz.addEventListener('mouseleave', function () { hold = false; sched(); });
      dz.addEventListener('focusin', function () { hold = true; sched(); }); dz.addEventListener('focusout', function () { hold = false; sched(); });
      dz.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
      var sx = 0; dz.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true }); dz.addEventListener('touchend', function (e) { var d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); });
      document.addEventListener('visibilitychange', function () { hold = document.hidden; sched(); });
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { hold = !es[0].isIntersecting; sched(); }).observe(dz);
      show(0);
    }
    /* ---- ficha do clube ---- */
    var cb = $('clBox');
    if (cb) {
      var yr = '2000', cap = '', tot = 0;
      try { yr = DB.timeline[0].year; DB.timeline.forEach(function (t) { var m = /(\d+)\s*mil lugares/i.exec(t.text || t.desc || ''); if (m) cap = m[1] + ' mil lugares'; }); tot = DB.trophies.reduce(function (n, t) { return n + (parseInt(t.count, 10) || 0); }, 0); } catch (e) {}
      var card = function (k, v, d) { return '<div class="cl-c"><small>' + k + '</small>' + v + (d ? '<p>' + d + '</p>' : '') + '</div>'; };
      cb.innerHTML = '<div class="cl-grid">' + card('Fundação', '<b>' + esc(yr) + '</b>', 'Nasce no Vale do Jequitinhonha') + card('Cidade', '<b>Santa Clara — MG</b>', 'Terror do Vale') + card('Estádio', '<b>Vale de Santa Clara</b>', 'A Toca do Lobo' + (cap ? ' • ' + cap : '')) +
        card('Mascote', '<b>Lobo-guará</b>', 'Símbolo do clube') + card('Torcida', '<b>A Matilha</b>', 'E a Torcida Independente SC') + card('Cores', '<div class="cl-sw"><i style="background:var(--club-primary)"></i><i style="background:#fff"></i><i style="background:var(--club-brown)"></i></div>', 'Azul-escuro, branco e marrom') +
        card('Modelo', '<b>SAF</b>', 'Sociedade Anônima do Futebol desde 2024') + (tot ? card('Títulos', '<b>' + tot + '</b>', 'Profissional, base e regionais') : '') + card('Competição', '<b>Mineiro Módulo II</b>', 'Campeonato Mineiro') + '</div>' +
        '<div class="cl-links"><a class="btn-primary" href="#memorial">História e troféus</a><a class="btn-outline" href="#diretoria">Diretoria</a><a class="btn-outline" href="#estadio">Estádio</a><a class="btn-outline" href="#torcidas">Torcidas</a></div>';
    }
    /* ---- faixa de patrocinadores + rodapé ---- */
    var ft = document.querySelector('footer.site-footer');
    if (ft) {
      var sp = []; try { sp = DB.sponsors.slice(); } catch (e) {}
      if (sp.length) {
        var ini = function (n) { return n.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z ]/g, '').split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase() || '★'; };
        var one = sp.map(function (x) { var ext = /^https?:/.test(x.url || ''); return '<a class="spx-i" href="' + (ext ? esc(x.url) : '#patrocinadores') + '"' + (ext ? ' target="_blank" rel="noopener sponsored"' : '') + '><span class="jg-crest"><b>' + esc(ini(x.name)) + '</b>' + (x.logo ? '<img src="' + esc(x.logo) + '" alt="" loading="lazy" onerror="this.remove()">' : '') + '</span><span>' + esc(x.name) + (x.tier ? '<small>' + esc(x.tier) + '</small>' : '') + '</span></a>'; }).join('');
        var band = document.createElement('div'); band.className = 'spx'; band.innerHTML = '<div class="spx-h">Patrocinadores e parceiros</div><div class="spx-m">' + one + one + '</div>'; ft.parentNode.insertBefore(band, ft);
      }
      var C = E.CONTATO || {}, R = E.REDES || {}, soc = [['instagram', '📸 Instagram'], ['youtube', '▶️ YouTube'], ['x', '✖ X'], ['tiktok', '🎵 TikTok'], ['facebook', '👍 Facebook'], ['canalWhatsapp', '💬 Canal no WhatsApp']].filter(function (k) { return /^https?:/.test(R[k[0]] || ''); })
        .map(function (k) { return '<a href="' + esc(R[k[0]]) + '" target="_blank" rel="noopener">' + k[1] + '</a>'; });
      if (C.whatsapp) soc.push('<a href="https://wa.me/' + String(C.whatsapp).replace(/\D/g, '') + '" target="_blank" rel="noopener">📱 WhatsApp do clube</a>'); if (C.email) soc.push('<a href="mailto:' + esc(C.email) + '">✉️ ' + esc(C.email) + '</a>');
      var fx = document.createElement('div'); fx.className = 'container';
      fx.innerHTML = '<div class="ft-x"><div><strong>Fale com o clube</strong><div class="ft-l"><button type="button" data-t="fal">✉️ Fale conosco</button><button type="button" data-t="pen">🐺 Seja um Lobo</button><button type="button" data-t="ret">📊 Retrospecto</button><a href="#patrocinadores">⭐ Seja parceiro</a></div></div>' + (soc.length ? '<div><strong>Siga o Santa Clara</strong><div class="ft-s">' + soc.join('') + '</div></div>' : '') + '</div>';
      [].forEach.call(fx.querySelectorAll('button[data-t]'), function (b) { b.onclick = function () { ctOpen(b.dataset.t); }; });
      fx.className = ''; var fb = ft.querySelector('.footer-bottom'); if (fb && fb.parentNode) fb.parentNode.insertBefore(fx, fb); else { fx.className = 'container'; ft.appendChild(fx); }
    }
  } catch (e) { console.warn('clube-v18', e); }
})();
