/* Santa Clara EC — js/desempenho.js
   Seção "Desempenho": campanha do Santa Clara montada a partir de EDITAR.JOGOS (nada para editar aqui).
   Mostra forma recente, aproveitamento, gráfico de pontos, resultados e próximos jogos. Carregado antes de pwa.js. */
(function () {
  'use strict';
  var root = document.getElementById('desempenho'); if (!root) return;
  var E = window.EDITAR || {};
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var box = document.getElementById('dpBox'); if (!box) return;
  var J = (E.JOGOS || []).filter(function (g) { return g && typeof g.gols === 'number' && typeof g.golsAdv === 'number'; })
    .sort(function (a, b) { return a.rodada - b.rodada; });
  var MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  var dm = function (iso) { var d = new Date(String(iso).slice(0, 10) + 'T12:00:00'); return isNaN(d) ? '' : d.getDate() + ' ' + MES[d.getMonth()]; };
  var res = function (g) { return g.gols > g.golsAdv ? 'v' : g.gols < g.golsAdv ? 'd' : 'e'; };
  var LBL = { v: 'Vitória', e: 'Empate', d: 'Derrota' };

  if (!J.length) { box.innerHTML = '<p class="dp-empty">A campanha aparece aqui assim que o primeiro resultado for registrado.</p>'; return; }

  var v = 0, e = 0, d = 0, gp = 0, gc = 0, sg0 = 0, acc = [], pts = 0, best = 0, run = 0, casa = { p: 0, j: 0 }, fora = { p: 0, j: 0 }, big = J[0];
  J.forEach(function (g) {
    var r = res(g), p = r === 'v' ? 3 : r === 'e' ? 1 : 0;
    if (r === 'v') v++; else if (r === 'e') e++; else d++;
    gp += g.gols; gc += g.golsAdv; if (g.golsAdv === 0) sg0++;
    pts += p; acc.push(pts);
    run = r === 'd' ? 0 : run + 1; if (run > best) best = run;
    var o = g.emCasa ? casa : fora; o.p += p; o.j++;
    if (g.gols - g.golsAdv > big.gols - big.golsAdv) big = g;
  });
  var n = J.length, aprov = Math.round(pts / (n * 3) * 100), sg = gp - gc;
  var forma = J.slice(-5);
  var sc = function (o) { return o.j ? Math.round(o.p / (o.j * 3) * 100) : 0; };

  /* ---- cartões de números ---- */
  var cards = [
    ['Aproveitamento', aprov, '%', 'dp-hl'], ['Pontos', pts, '', ''], ['Gols pró', gp, '', ''], ['Gols contra', gc, '', ''],
    ['Saldo', sg, '', sg < 0 ? 'dp-neg' : ''], ['Jogos sem sofrer gol', sg0, '', '']
  ];
  var html = '<div class="dp-top">' +
    '<div class="dp-forma"><h3>Forma recente</h3><div class="dp-chips" role="list" aria-label="Últimos resultados">' +
    forma.map(function (g) { var r = res(g); return '<span role="listitem" class="dp-chip ' + r + '" title="' + esc(LBL[r] + ' • ' + (g.emCasa ? 'em casa' : 'fora') + ' • ' + g.adv + ' ' + g.gols + 'x' + g.golsAdv) + '"><b>' + r.toUpperCase() + '</b><small>' + g.gols + '-' + g.golsAdv + '</small></span>'; }).join('') +
    '</div><p class="dp-sub">' + v + 'V • ' + e + 'E • ' + d + 'D em ' + n + ' jogos' + (best >= 3 ? ' • melhor sequência invicta: <strong>' + best + '</strong>' : '') + '</p></div>' +
    '<div class="dp-split"><h3>Casa × Fora</h3>' +
    ['Em casa', 'Fora'].map(function (t, i) { var o = i ? fora : casa, p = sc(o); return '<div class="dp-bar"><span>' + t + '</span><div class="dp-track" role="img" aria-label="' + t + ': ' + p + '% de aproveitamento"><i style="--w:' + p + '%"></i></div><b>' + p + '%</b></div>'; }).join('') +
    '</div></div>' +
    '<div class="dp-grid">' + cards.map(function (c) { return '<div class="dp-card ' + c[3] + '"><b class="dp-num" data-to="' + c[1] + '" data-suf="' + c[2] + '">' + c[1] + c[2] + '</b><span>' + c[0] + '</span></div>'; }).join('') + '</div>';

  /* ---- gráfico: pontos acumulados x ritmo ideal ---- */
  var W = 640, H = 220, pl = 34, pr = 14, pt = 14, pb = 28, max = Math.max(n * 3, 3), X = function (i) { return n === 1 ? (pl + W - pr) / 2 : pl + i * (W - pl - pr) / (n - 1); }, Y = function (p) { return H - pb - p * (H - pt - pb) / max; };
  var line = acc.map(function (p, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(p).toFixed(1); }).join(' ');
  var area = line + ' L' + X(n - 1).toFixed(1) + ' ' + (H - pb) + ' L' + X(0).toFixed(1) + ' ' + (H - pb) + ' Z';
  var ideal = 'M' + X(0).toFixed(1) + ' ' + Y(3).toFixed(1) + ' L' + X(n - 1).toFixed(1) + ' ' + Y(n * 3).toFixed(1);
  var stepY = 3 * Math.max(1, Math.ceil(n / 4)), ticks = []; for (var tv = 0; tv <= max; tv += stepY) ticks.push(tv);
  var grid = ticks.map(function (p) { return '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + Y(p).toFixed(1) + '" y2="' + Y(p).toFixed(1) + '"/><text x="' + (pl - 6) + '" y="' + (Y(p) + 4).toFixed(1) + '" text-anchor="end">' + p + '</text>'; }).join('');
  var dots = acc.map(function (p, i) { return '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(p).toFixed(1) + '" r="4"><title>Rodada ' + J[i].rodada + ': ' + p + ' pontos</title></circle><text class="dp-x" x="' + X(i).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle">R' + J[i].rodada + '</text>'; }).join('');
  html += '<div class="dp-chart"><h3>Pontos acumulados <small>linha tracejada = ritmo perfeito (3 por jogo)</small></h3>' +
    '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Gráfico de pontos acumulados por rodada: ' + pts + ' pontos em ' + n + ' jogos"><defs><linearGradient id="dpG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--club-gold)" stop-opacity=".45"/><stop offset="1" stop-color="var(--club-gold)" stop-opacity="0"/></linearGradient></defs>' +
    '<g class="dp-grid-l">' + grid + '</g><path class="dp-ideal" d="' + ideal + '"/><path class="dp-area" d="' + area + '"/><path class="dp-line" d="' + line + '" pathLength="1"/><g class="dp-dots">' + dots + '</g></svg></div>';

  /* ---- resultados + pendentes + próximos ---- */
  var rows = J.slice().reverse().map(function (g) { var r = res(g); return '<li class="dp-row ' + r + '"><span class="dp-r">R' + g.rodada + '</span><span class="dp-adv"><b>' + esc(g.adv) + '</b><small>' + dm(g.data) + ' • ' + (g.emCasa ? 'em casa' : 'fora') + '</small></span><span class="dp-pl">' + g.gols + ' <i>×</i> ' + g.golsAdv + '</span><span class="dp-tag ' + r + '">' + LBL[r] + '</span></li>'; }).join('');
  var pend = (E.PENDENCIAS_RESULTADO || []).map(function (g) { return '<li class="dp-row pend"><span class="dp-r">R' + g.rodada + '</span><span class="dp-adv"><b>' + esc(g.adv) + '</b><small>' + dm(g.data) + '</small></span><span class="dp-pl">—</span><span class="dp-tag pend">Resultado a confirmar</span></li>'; }).join('');
  var P = E.PROXIMO_JOGO, nx = [];
  if (P && P.adversario) nx.push({ r: P.rodada, adv: P.adversario, d: P.data, c: P.emCasa });
  (E.CALENDARIO || []).slice(0, 2).forEach(function (g) { nx.push({ r: g.rodada, adv: g.adv, d: g.data, c: g.emCasa }); });
  var prox = nx.map(function (g) { return '<li class="dp-next"><span class="dp-r">R' + g.r + '</span><b>' + esc(g.adv) + '</b><small>' + dm(g.d) + ' • ' + (g.c ? 'em casa' : 'fora') + '</small></li>'; }).join('');
  html += '<div class="dp-cols"><div><h3>Resultados</h3><ul class="dp-list">' + pend + rows + '</ul></div>' + (prox ? '<div><h3>Próximos jogos</h3><ul class="dp-list dp-nx">' + prox + '</ul></div>' : '') + '</div>' +
    '<div class="dp-act"><button type="button" class="btn-outline" id="dpShare">📤 Compartilhar campanha</button></div>';
  box.innerHTML = html;

  /* ---- compartilhar ---- */
  var txt = '🐺 Santa Clara EC — campanha no ' + ((E.PARTIDAS_PADRAO && E.PARTIDAS_PADRAO.comp) || 'campeonato') + ': ' + pts + ' pts em ' + n + ' jogos (' + v + 'V ' + e + 'E ' + d + 'D), ' + aprov + '% de aproveitamento, saldo ' + (sg > 0 ? '+' : '') + sg + '. ' + location.href.split('#')[0] + '#desempenho';
  document.getElementById('dpShare').onclick = function () {
    var b = this, ok = function (m) { b.textContent = m; setTimeout(function () { b.textContent = '📤 Compartilhar campanha'; }, 2000); };
    if (navigator.share) { navigator.share({ title: 'Santa Clara EC', text: txt }).catch(function () {}); return; }
    (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { ok('✔ Copiado!'); }).catch(function () { window.prompt('Copie a campanha:', txt); });
  };

  /* ---- animação de números (respeita "reduzir movimento") ---- */
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  var nums = [].slice.call(box.querySelectorAll('.dp-num'));
  var run1 = function (el) {
    var to = +el.getAttribute('data-to'), suf = el.getAttribute('data-suf') || '', t0 = null;
    if (reduce || !isFinite(to)) { el.textContent = to + suf; return; }
    var step = function (t) { if (t0 === null) t0 = t; var k = Math.min(1, (t - t0) / 900), q = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * q) + suf; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { box.classList.add('dp-in'); nums.forEach(run1); io.disconnect(); } }); }, { threshold: .2 });
    io.observe(box);
  } else { box.classList.add('dp-in'); }
})();
