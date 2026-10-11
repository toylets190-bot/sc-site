/* Santa Clara EC — js/meu-jogo.js
   Escolha o jogo: libera tudo em jogos em casa e, em jogos fora, bloqueia o que é da Toca do Lobo e abre o estádio do mandante.
   Carregado como script clássico, na ordem do index.html (não reordene). */

/* Escolha o jogo: em casa libera tudo; fora de casa bloqueia o que é da Toca do Lobo e abre o estádio do mandante. */
(function () {
  var E = window.EDITAR || {}, P = E.PROXIMO_JOGO || {}, $ = function (i) { return document.getElementById(i); }, ME = 'Santa Clara EC', MELOGO = 'https://i.imgur.com/HWoq88J.png';
  var LOCK = ['ingressos', 'estadio', 'vou-ao-jogo', 'guia-acesso', 'validacao', 'transmissao']; /* tire um id daqui para ele nunca bloquear */
  var NOME = { ingressos: 'Ingressos', estadio: 'Setores', 'vou-ao-jogo': 'Vou ao Jogo', 'guia-acesso': 'Guia de Acesso', validacao: 'Validação', transmissao: 'Transmissão' };
  var ML = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'], DS = ['dom','seg','ter','qua','qui','sex','sáb'];
  var pad = function (n) { return String(n).padStart(2, '0'); }, hm = function (d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  var G = [], sel = 0;
  function msg(id, a) { return ({
    ingressos: 'O estádio é do ' + a + ', então o Santa Clara não vende ingresso para este jogo. O ingresso do setor visitante é vendido pelo clube mandante.',
    estadio: 'Os setores da Toca do Lobo valem só para jogos em casa. Em ' + a + ', quem define o setor da torcida visitante é o mandante.',
    'vou-ao-jogo': 'O plano de chegada, portões e esplanada é o da Toca do Lobo. Para este jogo, confira as informações do estádio do mandante.',
    'guia-acesso': 'O guia de acesso descreve a entrada da Toca do Lobo e só vale para jogos em casa.',
    validacao: 'O posto de validação e a biometria ficam na Toca do Lobo e só valem para jogos em casa.',
    transmissao: 'A central de transmissão fica liberada nos jogos do Santa Clara em casa.' })[id]; }
  function build() {
    var now = Date.now(), saved = null; try { saved = localStorage.getItem('scec_jogo_sel'); } catch (e) {}
    G = [P].concat(E.CALENDARIO || []).filter(function (g) { return g && g.data; }).map(function (g) {
      var d = new Date(g.data), adv = g.adversario || g.adv, casa = g.emCasa !== false, title = casa ? ME + ' × ' + adv : adv + ' × ' + ME, comp = g.competicao || P.competicao || 'Mineiro Módulo II';
      return { adv: adv, casa: casa, rod: g.rodada, iso: g.data, t: d.getTime(), title: title, day: DS[d.getDay()], hour: hm(d), label: d.getDate() + ' ' + ML[d.getMonth()].slice(0, 3),
        vaj: { title: title, comp: 'Campeonato ' + comp + ' — ' + g.rodada + 'ª Rodada', date: g.data, dateLabel: d.getDate() + ' de ' + ML[d.getMonth()] + ' • ' + hm(d), gates: hm(new Date(d.getTime() - 150 * 60000)) } };
    }).filter(function (g) { return g.t > now; }).sort(function (a, b) { return a.t - b.t; });
    var k = G.findIndex(function (g) { return g.iso === saved; }); sel = k > -1 ? k : 0;
  }
  function crest(n) {
    var u = n === ME ? MELOGO : (window.TEAM_LOGOS || {})[n], ini = n.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\b(EC|FC|SC|AC|Atl\.?|Esporte|Clube)\b/gi, '').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'ADV';
    return '<span class="jg-crest"><b>' + ini + '</b>' + (u ? '<img src="' + u + '" alt="" loading="lazy" onerror="this.remove()">' : '') + '</span>';
  }
  function when(g) { var n = Math.ceil((g.t - Date.now()) / 864e5); return n <= 1 ? 'amanhã ou hoje' : 'em ' + n + ' dias'; }
  function rail() {
    $('jgRail').innerHTML = G.length ? '<div class="jg-rail">' + G.map(function (g, i) {
      return '<button type="button" class="jg-card ' + (g.casa ? 'home' : 'away') + (i === sel ? ' on' : '') + '" data-i="' + i + '" aria-pressed="' + (i === sel) + '"><div class="jg-top"><span class="jg-badge">' + (g.casa ? '🏟️ Em casa' : '🚌 Fora de casa') + '</span><span class="jg-rod">' + g.rod + 'ª rodada</span></div>' +
        '<div class="jg-vs">' + crest(g.casa ? ME : g.adv) + '<i>×</i>' + crest(g.casa ? g.adv : ME) + '</div><b class="jg-name">' + g.title + '</b><span class="jg-when">' + g.day + ', ' + g.label + ' • ' + g.hour + ' • ' + when(g) + '</span>' +
        '<span class="jg-foot">' + (g.casa ? 'Ingressos e estádio liberados' : 'Sem ingresso • estádio do mandante') + '</span>' + (i === sel ? '<em class="jg-check">✓ Seu jogo</em>' : '') + '</button>';
    }).join('') + '</div>' : '<p class="jg-note" style="text-align:center;color:var(--club-muted)">Nenhum jogo futuro cadastrado ainda.</p>';
    Array.prototype.forEach.call($('jgRail').querySelectorAll('.jg-card'), function (b) { b.onclick = function () { pick(+b.dataset.i); }; });
  }
  function status() {
    var g = G[sel], h = $('jgStatus'); if (!g) { h.innerHTML = ''; return; }
    h.innerHTML = '<div class="jg-status"><div class="jg-sh">' + crest(g.casa ? ME : g.adv) + crest(g.casa ? g.adv : ME) + '<div><h3>' + g.title + '</h3><small>' + g.day + ', ' + g.label + ' • ' + g.hour + ' • ' + g.rod + 'ª rodada</small></div><span class="jg-mode ' + (g.casa ? 'home' : 'away') + '">' + (g.casa ? 'Jogo em casa • tudo liberado' : 'Jogo fora de casa • modo visitante') + '</span></div><div class="jg-chips">' +
      LOCK.map(function (id) { var l = !g.casa; return '<a class="jg-chip ' + (l ? 'lock' : '') + '" href="#' + id + '">' + (l ? '🔒 ' : '✅ ') + NOME[id] + '</a>'; }).join('') +
      (g.casa ? '' : '<a class="jg-chip go" href="#estadio-visitante">🏟️ Estádio do mandante</a>') + '</div></div>';
  }
  function lock() {
    var g = G[sel], away = g && !g.casa;
    LOCK.forEach(function (id) {
      var s = $(id); if (!s) return; var c = s.querySelector(':scope>.container') || s, p = c.querySelector(':scope>.lk-panel');
      if (!away) { if (p) p.remove(); s.classList.remove('lk-on'); return; }
      s.classList.add('lk-on'); if (!p) { p = document.createElement('div'); p.className = 'lk-panel'; c.insertBefore(p, c.firstChild); }
      var hasHome = G.some(function (x) { return x.casa; });
      p.innerHTML = '<div class="lk-ico">🔒</div><div class="lk-title" role="heading" aria-level="3">' + NOME[id] + ' — só em jogos em casa</div><p>' + msg(id, g.adv) + '</p><div class="lk-btns"><a class="btn-primary" href="#estadio-visitante">🏟️ Estádio do mandante</a>' + (hasHome ? '<button type="button" class="btn-outline" data-jghome="1">🎟️ Ver jogos em casa</button>' : '') + '<a class="btn-outline" href="#escolha-jogo">Trocar jogo</a></div>';
    });
  }
  function visitor() {
    var g = G[sel], s = $('estadio-visitante'); if (!g || g.casa) { s.hidden = true; return; } s.hidden = false;
    var D = Object.assign({ estadio: '', cidade: '', endereco: '', capacidade: '', setor: '', contato: '', obs: '' }, (E.ESTADIOS_ADVERSARIOS || {})[g.adv] || {}), nome = D.estadio || 'Estádio do ' + g.adv, tbd = 'A confirmar com o ' + g.adv + '.';
    var card = function (t, b) { return '<div class="ev-card"><h4>' + t + '</h4>' + b + '</div>'; };
    $('evBox').innerHTML = '<div class="section-header"><div class="section-title"><span class="section-pretitle">Jogo fora de casa</span><h2 class="section-main-title">Estádio do mandante</h2></div></div>' +
      '<div class="ev-hero">' + crest(g.adv) + '<div><small>Você vai visitar</small><h2>' + nome + '</h2><p>' + (D.cidade ? D.cidade + ' • ' : '') + g.title + ' • ' + g.day + ', ' + g.label + ' às ' + g.hour + '</p></div><div class="ev-acts"><button type="button" class="btn-primary" onclick="evCal()">📅 Salvar no calendário</button><button type="button" class="btn-outline" onclick="evShare()">Compartilhar</button></div></div>' +
      '<div class="ev-grid">' + card('📍 Local', '<p>' + (D.endereco || tbd) + '</p>') + card('🎟️ Ingressos', '<p>Vendidos pelo ' + g.adv + '. O Santa Clara não vende ingresso de jogos fora de casa.</p>') +
      card('🟡 Torcida visitante', '<p>' + (D.setor || 'O setor é definido pelo mandante. Confirme no canal oficial do ' + g.adv + '.') + '</p>') +
      (D.capacidade ? card('👥 Capacidade', '<p>' + D.capacidade + '</p>') : '') + (D.contato ? card('📞 Contato do mandante', '<p>' + D.contato + '</p>') : '') + (D.obs ? card('⚠️ Aviso', '<p>' + D.obs + '</p>') : '') +
      card('🧳 Antes de viajar', '<ul><li>Leve documento oficial com foto.</li><li>Confirme horário e portões com o mandante.</li><li>Siga as regras de acesso do estádio.</li><li>Combine a viagem com antecedência.</li></ul>') + '</div>' +
      '<p class="ev-note">As informações do estádio são fornecidas pelo clube mandante. Confirme tudo no canal oficial do ' + g.adv + ' antes de viajar.</p>';
  }
  function tkbar() {
    var g = G[sel], h = $('tkMatchPicker'); if (!h) return;
    h.innerHTML = g && g.casa ? '<div class="tk-bar">' + crest(ME) + crest(g.adv) + '<div><small>Ingresso para</small><b>' + g.title + '</b><span>' + g.day + ', ' + g.label + ' • ' + g.hour + ' • Estádio Vale de Santa Clara</span></div><a class="btn-outline" href="#escolha-jogo">Trocar jogo</a></div>' : '';
  }
  function apply() {
    var g = G[sel]; window.__jogoSel = g || null; window.__tkMatch = g && g.casa ? { title: g.title, label: g.label + ' • ' + g.hour } : null;
    rail(); status(); lock(); visitor(); tkbar();
    try { if (typeof renderVouAoJogo === 'function') renderVouAoJogo(); } catch (e) {} try { if (window.renderBroadcast) window.renderBroadcast(); } catch (e) {}
  }
  function pick(i) { sel = i; try { localStorage.setItem('scec_jogo_sel', G[i].iso); } catch (e) {} apply(); }
  window.evCal = function () {
    var g = G[sel], f = function (x) { return x.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; };
    var t = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SCEC//Fora//PT', 'BEGIN:VEVENT', 'UID:scec-fora-' + g.t + '@scec', 'DTSTAMP:' + f(new Date()), 'DTSTART:' + f(new Date(g.t)), 'DTEND:' + f(new Date(g.t + 72e5)), 'SUMMARY:' + g.title, 'LOCATION:Estádio do ' + g.adv, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([t], { type: 'text/calendar' })); a.download = 'jogo-fora-santa-clara.ics'; document.body.appendChild(a); a.click(); a.remove();
  };
  window.evShare = function () { var g = G[sel]; window.open('https://wa.me/?text=' + encodeURIComponent('🐺 ' + g.title + '\n📅 ' + g.day + ', ' + g.label + ' • ' + g.hour + '\nJogo fora de casa. Bora, Matilha!'), '_blank'); };
  window.jgPick = function (iso) { var i = G.findIndex(function (g) { return g.iso === iso; }); if (i > -1) pick(i); };
  window.tkPickByDate = function (iso) { var i = G.findIndex(function (g) { return g.iso === iso; }); if (i > -1) pick(i); var s = $('ingressos'); if (s) s.scrollIntoView({ behavior: 'smooth' }); };
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-jghome]'); if (!b) return; var i = G.findIndex(function (g) { return g.casa; }); if (i > -1) { pick(i); var s = $('ingressos'); if (s) s.scrollIntoView({ behavior: 'smooth' }); } });
  var _c = window.handleTicketCheckout;
  window.handleTicketCheckout = function (e) { if (!window.__tkMatch) { if (e && e.preventDefault) e.preventDefault(); alert('Escolha um jogo em casa para comprar ingresso.'); return; } return _c.apply(this, arguments); };
  build(); apply(); window.addEventListener('load', apply);
})();
