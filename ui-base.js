/* Santa Clara EC — js/ui-base.js
   Acessibilidade de modais e imagens, aviso de conexão e preenchimento do topo, faixa de status e calendário.
   Carregado como script clássico, na ordem do index.html (não reordene). */

/* =====================================================================
   v5: acessibilidade de modais, imagens e aviso de conexão (só acréscimos)
   ===================================================================== */
(function () {
  const FOC = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
  let lastFocus = null;
  const overlays = () => [].slice.call(document.querySelectorAll('.modal-overlay'));
  const openOne = () => overlays().filter(m => m.classList.contains('active')).pop();
  function sync() {
    const m = openOne();
    document.body.style.overflow = m ? 'hidden' : '';
    if (m) {
      if (!lastFocus) lastFocus = document.activeElement;
      if (!m.contains(document.activeElement)) { const f = m.querySelector(FOC); if (f) f.focus({ preventScroll: true }); }
    } else if (lastFocus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} lastFocus = null; }
  }
  document.addEventListener('DOMContentLoaded', () => {
    try {
      const mo = new MutationObserver(sync);
      overlays().forEach(m => { m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); mo.observe(m, { attributes: true, attributeFilter: ['class'] }); });
      const tk = document.querySelector('.header-actions .btn-primary'); if (tk) tk.setAttribute('aria-label', 'Comprar ingressos');
      document.querySelectorAll('.btn-icon[title]').forEach(b => { if (!b.getAttribute('aria-label')) b.setAttribute('aria-label', b.title); });
    } catch (e) { console.error('v5 modais', e); }
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const m = openOne(); if (!m) return;
    const f = [].slice.call(m.querySelectorAll(FOC)).filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === a || !m.contains(document.activeElement))) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  });
  /* imagens criadas por JS também carregam sob demanda */
  new MutationObserver(ms => ms.forEach(r => r.addedNodes.forEach(n => {
    if (n.nodeType !== 1) return;
    (n.tagName === 'IMG' ? [n] : [].slice.call(n.querySelectorAll ? n.querySelectorAll('img') : [])).forEach(i => { if (!i.hasAttribute('loading') && !i.classList.contains('club-crest-img')) { i.loading = 'lazy'; i.decoding = 'async'; } });
  }))).observe(document.documentElement, { childList: true, subtree: true });
  /* conexão: o site guarda tudo no navegador, mas o QR e as imagens precisam de rede */
  window.addEventListener('offline', () => { if (window.socToast) socToast('Você está sem internet. Imagens e QR Codes podem não carregar.'); });
  window.addEventListener('online', () => { if (window.socToast) socToast('Conexão restabelecida.'); });
})();

/* v6: imagens do imgur tentam outras extensões e, se falhar, mostram a sigla */
function v6Img(el) {
  const ex = ['png', 'jpg', 'jpeg', 'webp', 'gif'], id = el.dataset.id, cur = +(el.dataset.try || 0) + 1;
  if (cur < ex.length) { el.dataset.try = cur; el.src = 'https://i.imgur.com/' + id + '.' + ex[cur]; return; }
  el.onerror = null; const p = el.parentElement;
  if (p && p.classList.contains('v6-plate')) { const b = document.createElement('span'); b.className = 'v6-fb'; b.textContent = (el.alt.match(/\(([^)]+)\)/) || [, 'SC'])[1].replace(/\./g, '').slice(0, 4); p.replaceChild(b, el); } else { el.style.display = 'none'; }
}

/* Preenche topo, faixa de status e calendário a partir da ÁREA DE EDIÇÃO */
(function () {
  var E = window.EDITAR; if (!E || typeof DB === 'undefined') return;
  var P = E.PROXIMO_JOGO || {}, $ = function (q, r) { return (r || document).querySelector(q); };
  var meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  function curto(d) { var x = new Date(d); return isNaN(x) ? '' : x.getDate() + ' ' + meses[x.getMonth()]; }
  function hora(d) { var x = new Date(d); return isNaN(x) ? '' : String(x.getHours()).padStart(2, '0') + ':' + String(x.getMinutes()).padStart(2, '0'); }
  function aplicar() {
    var cards = document.querySelectorAll('.team-card');
    if (cards.length > 1 && P.adversario) {
      var n = $('.team-name', cards[1]), c = $('.crest-opponent', cards[1]);
      if (n) n.textContent = P.adversario; if (c) c.textContent = P.sigla || P.adversario.slice(0, 3).toUpperCase();
      var lg = window.TEAM_LOGOS && window.TEAM_LOGOS[P.adversario]; if (c && lg) { c.textContent = ''; c.classList.add('has-img'); var im = document.createElement('img'); im.src = lg; im.alt = 'Escudo ' + P.adversario; im.onerror = function () { c.classList.remove('has-img'); im.remove(); c.textContent = P.sigla || P.adversario.slice(0, 3).toUpperCase(); }; c.appendChild(im); }
      var me = $('.crest-scec', cards[0]), mlg = window.TEAM_LOGOS && window.TEAM_LOGOS['Santa Clara EC']; if (me && mlg && !me.querySelector('img')) { var wolf = me.textContent; me.textContent = ''; me.classList.add('has-img'); var mi = document.createElement('img'); mi.src = mlg; mi.alt = 'Escudo Santa Clara EC'; mi.onerror = function () { me.classList.remove('has-img'); mi.remove(); me.textContent = wolf; }; me.appendChild(mi); }
      var l0 = $('.team-label', cards[0]), l1 = $('.team-label', cards[1]);
      if (l0) l0.textContent = P.emCasa === false ? 'Visitante' : 'Mandante'; if (l1) l1.textContent = P.emCasa === false ? 'Mandante' : 'Visitante';
    }
    var bd = $('.match-board'), away = P.emCasa === false;
    if (bd) bd.classList.toggle('away', away);
    var badge = $('.hero-badge-live'); if (badge && badge.lastChild && badge.lastChild.nodeType === 3) badge.lastChild.textContent = away ? ' Próximo Confronto Oficial • Jogo fora de casa' : ' Próximo Confronto Oficial • Ingressos Liberados';
    var hb = $('.hero-actions .btn-primary'); if (hb && away) { hb.textContent = 'Estádio do mandante'; hb.setAttribute('onclick', "document.getElementById('estadio-visitante').scrollIntoView({behavior:'smooth'})"); }
    var ci = $('.competition-info'), si = $('.stadium-info');
    if (ci) ci.textContent = (P.competicao || '') + ' • ' + (P.rodada || '') + 'ª Rodada';
    if (si) si.textContent = (P.local || '') + ' • ' + curto(P.data) + ' • ' + hora(P.data);
    var v = document.querySelectorAll('.status-item .status-val');
    var t = DB.standings.find(function (x) { return x.name.indexOf('Santa Clara') > -1; });
    var u = (E.JOGOS || []).slice().sort(function (a, b) { return b.rodada - a.rodada; })[0];
    if (v.length >= 5) {
      v[0].textContent = curto(P.data).toUpperCase() + ' • ' + hora(P.data);
      if (u) v[1].textContent = 'SCEC ' + u.gols + ' × ' + u.golsAdv + ' ' + u.adv.replace(/\s(EC|FC|GV|Sport)$/i, '');
      v[2].textContent = (P.rodada || '') + 'ª Rodada';
      if (t) { v[3].textContent = t.pos + 'º Lugar'; v[4].textContent = t.pts + ' Pts'; }
    }
    var host = document.getElementById('calendarList');
    if (host && (E.CALENDARIO || []).length) {
      host.innerHTML = '<div class="cal-title">Próximos jogos</div>' + E.CALENDARIO.map(function (g) {
        return '<div class="cal-item"><span>' + g.rodada + 'ª Rodada • ' + curto(g.data) + ' • ' + hora(g.data) + '</span><b>' + (g.emCasa === false ? g.adv + ' × Santa Clara EC' : 'Santa Clara EC × ' + g.adv) + '</b><span>' + (g.emCasa === false ? 'Fora de casa • estádio do mandante • sem ingresso' : 'Estádio Vale de Santa Clara') + (g.emCasa === false ? '' : '<button type="button" class="cal-buy" onclick="tkPickByDate(\'' + g.data + '\')">🎟️ Comprar ingresso</button>') + '</span></div>';
      }).join('');
    }
  }
  aplicar(); window.addEventListener('load', aplicar);
})();
