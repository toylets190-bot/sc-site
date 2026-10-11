/* Santa Clara EC — js/central.js
   Central do Torcedor: galeria, Seja um Lobo, retrospecto, Fale conosco e comparar jogadores. Exporta window.__ct (helpers de formulário).
   Carregado como script clássico, na ordem do index.html (não reordene). */

(function () {
  var E = window.EDITAR || {}, C = E.CONTATO || {}, $ = function (i) { return document.getElementById(i); }, cur = 'gal', Y = new Date().getFullYear(), PRE = null;
  var TABS = [['gal', '📸', 'Galeria'], ['pen', '🐺', 'Seja um Lobo'], ['ret', '📊', 'Retrospecto'], ['fal', '✉️', 'Fale conosco'], ['cmp', '⚖️', 'Comparar jogadores']];
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function ls(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || '[]'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return []; } }
  function proto(px) { return px + '-' + Y + '-' + String(Math.floor(1000 + Math.random() * 9000)); }
  function send(txt, subj) {
    var h = '';
    if (C.whatsapp) h += '<a class="btn-primary" target="_blank" rel="noopener" href="https://wa.me/' + String(C.whatsapp).replace(/\D/g, '') + '?text=' + encodeURIComponent(txt) + '">💬 Enviar por WhatsApp</a>';
    if (C.email) h += '<a class="btn-outline" href="mailto:' + esc(C.email) + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(txt) + '">✉️ Enviar por e-mail</a>';
    return h ? '<div class="ct-btns">' + h + '</div>' : '';
  }
  function field(id, label, input, err) { return '<div class="ct-f" id="f_' + id + '"><label for="' + id + '">' + label + '</label>' + input + '<div class="ct-err">' + (err || 'Campo obrigatório') + '</div></div>'; }
  function check(form, rules) { var ok = true; rules.forEach(function (r) { var el = $(r[0]), f = $('f_' + r[0]); if (!el || !f) return; var good = r[1](el.value, el); f.classList.toggle('bad', !good); if (!good) ok = false; }); return ok; }
  /* ---------- galeria ---------- */
  function photos() {
    if ((E.GALERIA || []).length) return E.GALERIA.map(function (x) { return { src: x.src, cap: x.legenda || x.cap || 'Santa Clara EC' }; });
    var bad = {}, out = [], seen = {}; Object.keys(window.TEAM_LOGOS || {}).forEach(function (k) { bad[window.TEAM_LOGOS[k]] = 1; });
    [].forEach.call(document.querySelectorAll('main img[src^="http"]'), function (i) {
      var u = i.currentSrc || i.src; if (!u || seen[u] || bad[u] || (i.complete && !i.naturalWidth) || i.closest('#central,#patrocinadores,.jg-crest,.ex-strip,.vp-ticker,[class*="crest"],[class*="logo"],[class*="sponsor"]')) return;
      seen[u] = 1; var t = i.closest('section'); t = t && t.querySelector('.section-main-title'); out.push({ src: u, cap: i.alt || (t ? t.textContent.trim() : 'Santa Clara EC') });
    });
    return out.slice(0, 18);
  }
  var LB = { l: [], i: 0 };
  function lbShow() { var o = $('ctLb'), g = LB.l[LB.i]; o.querySelector('img').src = g.src; o.querySelector('figcaption').textContent = g.cap + '  •  ' + (LB.i + 1) + '/' + LB.l.length; o.classList.add('on'); }
  function lbOpen(l, i) {
    var o = $('ctLb'); if (!o) {
      o = document.createElement('div'); o.id = 'ctLb'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', 'Galeria');
      o.innerHTML = '<button class="x" aria-label="Fechar">✕</button><button class="pv" aria-label="Anterior">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="nx" aria-label="Próxima">›</button>'; document.body.appendChild(o);
      var go = function (d) { LB.i = (LB.i + d + LB.l.length) % LB.l.length; lbShow(); };
      o.querySelector('.x').onclick = function () { o.classList.remove('on'); }; o.querySelector('.pv').onclick = function () { go(-1); }; o.querySelector('.nx').onclick = function () { go(1); };
      o.addEventListener('click', function (e) { if (e.target === o) o.classList.remove('on'); });
      document.addEventListener('keydown', function (e) { if (!o.classList.contains('on')) return; if (e.key === 'Escape') o.classList.remove('on'); if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); });
      var sx = 0; o.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true }); o.addEventListener('touchend', function (e) { var d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) go(d < 0 ? 1 : -1); });
    }
    LB.l = l; LB.i = i; lbShow();
  }
  function gal(p) {
    var l = photos();
    p.innerHTML = l.length ? '<div class="ct-gal">' + l.map(function (g, i) { return '<button type="button" class="ct-ph" data-i="' + i + '"><img loading="lazy" src="' + esc(g.src) + '" alt="' + esc(g.cap) + '"><span>' + esc(g.cap) + '</span></button>'; }).join('') + '</div>' : '<p class="ct-empty">A galeria está sendo montada. Volte em breve!</p>';
    [].forEach.call(p.querySelectorAll('.ct-ph'), function (b) { b.onclick = function () { lbOpen(l, +b.dataset.i); }; });
  }
  /* ---------- seja um lobo ---------- */
  function cat(y) { var a = Y - y; return a <= 11 ? 'Sub-11' : a <= 13 ? 'Sub-13' : a <= 15 ? 'Sub-15' : a <= 17 ? 'Sub-17' : a <= 20 ? 'Sub-20' : 'Profissional (avaliação)'; }
  function pen(p) {
    var opt = function (a) { return a.map(function (x) { return '<option value="' + x + '">' + x + '</option>'; }).join(''); };
    p.innerHTML = '<div class="ct-split"><div class="ct-card"><h3 style="font-family:var(--font-display);font-size:1.5rem;margin-bottom:6px">Seja um Lobo 🐺</h3><p class="ct-note" style="margin-bottom:14px">Faça sua pré-inscrição para as avaliações das categorias de base e do profissional. A categoria é sugerida pela data de nascimento.</p><form class="ct-form" id="penF" novalidate>' +
      field('pNome', 'Nome completo', '<input id="pNome" autocomplete="name">') + field('pNasc', 'Data de nascimento', '<input id="pNasc" type="date" max="' + Y + '-12-31">', 'Informe uma data válida') +
      field('pPos', 'Posição', '<select id="pPos"><option value="">Selecione</option>' + opt(['Goleiro', 'Zagueiro', 'Lateral', 'Volante', 'Meia', 'Atacante']) + '</select>') + field('pPe', 'Pé preferencial', '<select id="pPe">' + opt(['Destro', 'Canhoto', 'Ambidestro']) + '</select>') +
      field('pCid', 'Cidade', '<input id="pCid" autocomplete="address-level2">') + field('pTel', 'WhatsApp para contato', '<input id="pTel" type="tel" inputmode="tel" placeholder="(38) 90000-0000" autocomplete="tel">', 'Informe DDD e número') +
      '<div class="ct-f full" id="f_pResp" hidden><label for="pResp">Nome do responsável (menor de 18 anos)</label><input id="pResp"><div class="ct-err">Informe o responsável</div></div>' +
      '<div class="ct-f full" id="f_pCat"><div class="ct-note" id="pCat">Categoria sugerida aparece ao informar a data de nascimento.</div></div>' +
      '<label class="ct-chk full"><input type="checkbox" id="pOk"> <span>Autorizo o uso destes dados para contato sobre a avaliação. Para menores de 18 anos, declaro ser o responsável legal.</span></label><div class="ct-err full" id="pOkE" style="display:none;color:#f87171;font-size:.72rem">Confirme a autorização para continuar</div>' +
      '<div class="full"><button type="submit" class="btn-primary">Enviar pré-inscrição</button></div></form></div>' +
      '<div class="ct-card" id="penSide"><h4 style="margin-bottom:8px">Como funciona</h4><ul class="ct-note" style="padding-left:18px;line-height:1.8"><li>Você recebe um protocolo ao enviar.</li><li>O clube confirma data, horário e local pelo contato informado.</li><li>Leve documento com foto e roupa de treino.</li><li>Menores de 18 anos devem ir acompanhados do responsável.</li></ul><p class="ct-note" style="margin-top:12px">A pré-inscrição fica salva neste aparelho. Para o clube receber, use o botão de envio após o protocolo.</p></div></div>';
    var nasc = $('pNasc'), upd = function () { var y = nasc.value ? +nasc.value.slice(0, 4) : 0; $('pCat').innerHTML = y ? 'Categoria sugerida: <strong style="color:var(--club-gold)">' + cat(y) + '</strong>' : 'Categoria sugerida aparece ao informar a data de nascimento.'; $('f_pResp').hidden = !(y && Y - y < 18); };
    nasc.onchange = nasc.oninput = upd;
    $('penF').onsubmit = function (e) {
      e.preventDefault(); var y = nasc.value ? +nasc.value.slice(0, 4) : 0, menor = y && Y - y < 18;
      var ok = check(null, [['pNome', function (v) { return v.trim().split(/\s+/).length >= 2; }], ['pNasc', function (v) { return v && y >= 1960 && y <= Y; }], ['pPos', function (v) { return !!v; }], ['pCid', function (v) { return v.trim().length >= 2; }], ['pTel', function (v) { return v.replace(/\D/g, '').length >= 10; }], ['pResp', function (v) { return !menor || v.trim().length >= 3; }]]);
      var okc = $('pOk').checked; $('pOkE').style.display = okc ? 'none' : 'block'; if (!ok || !okc) return;
      var d = { n: proto('PEN'), nome: $('pNome').value.trim(), nasc: nasc.value, pos: $('pPos').value, pe: $('pPe').value, cid: $('pCid').value.trim(), tel: $('pTel').value.trim(), resp: $('pResp').value.trim(), cat: cat(y), em: new Date().toISOString() };
      var l = ls('scec_peneiras'); l.push(d); ls('scec_peneiras', l.slice(-20));
      var txt = 'Pré-inscrição ' + d.n + ' — Seja um Lobo\nNome: ' + d.nome + '\nNascimento: ' + d.nasc.split('-').reverse().join('/') + '\nCategoria: ' + d.cat + '\nPosição: ' + d.pos + ' (' + d.pe + ')\nCidade: ' + d.cid + '\nContato: ' + d.tel + (d.resp ? '\nResponsável: ' + d.resp : '');
      $('penSide').className = 'ct-card ct-ok'; $('penSide').innerHTML = '<h4>✅ Pré-inscrição registrada</h4><div class="ct-proto">' + d.n + '</div><p class="ct-note">Categoria sugerida: <strong>' + esc(d.cat) + '</strong>. Guarde o protocolo. O clube confirma data e local pelo contato informado.</p>' + send(txt, 'Pré-inscrição ' + d.n);
      $('penF').reset(); upd(); $('penSide').scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
  }
  /* ---------- retrospecto ---------- */
  function ret(p) {
    var P = E.PARTIDAS || [], now = new Date(); now.setHours(0, 0, 0, 0);
    var pl = P.filter(function (g) { return g.gols != null && g.golsAdv != null; }).sort(function (a, b) { return a.rodada - b.rodada; });
    if (!pl.length) { p.innerHTML = '<p class="ct-empty">Os resultados aparecem aqui assim que as partidas forem registradas.</p>'; return; }
    var by = {}, t = { c: [0, 0, 0], f: [0, 0, 0] }, gp = 0, gc = 0;
    pl.forEach(function (g) {
      var r = g.gols > g.golsAdv ? 0 : g.gols === g.golsAdv ? 1 : 2; t[g.emCasa ? 'c' : 'f'][r]++; gp += g.gols; gc += g.golsAdv;
      var o = by[g.adv] || (by[g.adv] = { adv: g.adv, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, seq: [], nx: null }); o.j++; o[['v', 'e', 'd'][r]]++; o.gp += g.gols; o.gc += g.golsAdv; o.seq.push(['v', 'e', 'd'][r]);
    });
    P.filter(function (g) { return g.gols == null && new Date(g.data + 'T12:00:00') >= now; }).sort(function (a, b) { return a.rodada - b.rodada; }).forEach(function (g) { var o = by[g.adv] || (by[g.adv] = { adv: g.adv, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, seq: [], nx: null }); if (!o.nx) o.nx = g; });
    var J = pl.length, V = t.c[0] + t.f[0], Em = t.c[1] + t.f[1], D = t.c[2] + t.f[2], ap = Math.round((V * 3 + Em) / (J * 3) * 100), sg = gp - gc;
    var st = function (b, s) { return '<div class="ct-stat"><b>' + b + '</b><small>' + s + '</small></div>'; };
    var rows = Object.keys(by).map(function (k) { return by[k]; }).sort(function (a, b) { return (a.nx ? 0 : 1) - (b.nx ? 0 : 1) || (a.nx && b.nx ? a.nx.rodada - b.nx.rodada : b.j - a.j); });
    var mes = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    p.innerHTML = '<div class="ct-stats">' + st(J, 'Jogos') + st(V + '-' + Em + '-' + D, 'V · E · D') + st(gp + ' × ' + gc, 'Gols (saldo ' + (sg > 0 ? '+' : '') + sg + ')') + st(ap + '%', 'Aproveitamento') + st(t.c.join('-'), 'Em casa V-E-D') + st(t.f.join('-'), 'Fora V-E-D') + '</div>' +
      '<div class="ct-tw"><table class="ct-t"><thead><tr><th>Adversário</th><th>J</th><th>V</th><th>E</th><th>D</th><th>Gols</th><th>Resultados</th><th>Próximo</th></tr></thead><tbody>' + rows.map(function (o) {
        var n = o.nx ? new Date(o.nx.data + 'T12:00:00') : null;
        return '<tr class="' + (o.nx ? 'ct-nx' : '') + '"><td><strong>' + esc(o.adv) + '</strong></td><td>' + o.j + '</td><td>' + o.v + '</td><td>' + o.e + '</td><td>' + o.d + '</td><td>' + o.gp + '-' + o.gc + '</td><td>' + (o.seq.map(function (s) { return '<span class="ct-r ' + s + '">' + s.toUpperCase() + '</span>'; }).join('') || '—') + '</td><td>' + (n ? n.getDate() + ' ' + mes[n.getMonth()] + (o.nx.emCasa ? ' • casa' : ' • fora') : '—') + '</td></tr>';
      }).join('') + '</tbody></table></div><p class="ct-note" style="margin-top:10px">Retrospecto da temporada atual no Mineiro Módulo II, calculado automaticamente com os resultados registrados.</p>';
  }
  /* ---------- fale conosco ---------- */
  function fal(p) {
    var h = ls('scec_atend').slice(-4).reverse();
    p.innerHTML = '<div class="ct-split"><div class="ct-card"><h3 style="font-family:var(--font-display);font-size:1.5rem;margin-bottom:6px">Fale com o clube ✉️</h3><p class="ct-note" style="margin-bottom:14px">Dúvidas, sugestões, elogios, reclamações, imprensa e parcerias. Você recebe um protocolo ao enviar.</p><form class="ct-form" id="falF" novalidate>' +
      field('aAss', 'Assunto', '<select id="aAss"><option value="">Selecione</option>' + ['Dúvida', 'Sugestão', 'Elogio', 'Reclamação (ouvidoria)', 'Imprensa', 'Parcerias e patrocínio', 'Sócio-torcedor', 'Ingressos', 'Transparência e documentos', 'Eventos e espaços'].map(function (x) { return '<option>' + x + '</option>'; }).join('') + '</select>') +
      field('aNome', 'Seu nome', '<input id="aNome" autocomplete="name">') + field('aMail', 'E-mail', '<input id="aMail" type="email" autocomplete="email">', 'Informe um e-mail válido') + field('aTel', 'WhatsApp (opcional)', '<input id="aTel" type="tel" inputmode="tel">') +
      '<div class="full">' + field('aMsg', 'Mensagem', '<textarea id="aMsg"></textarea>', 'Escreva pelo menos 10 caracteres') + '</div><div class="full"><button type="submit" class="btn-primary">Enviar mensagem</button></div></form></div>' +
      '<div class="ct-card" id="falSide"><h4 style="margin-bottom:8px">Seus últimos protocolos</h4>' + (h.length ? '<ul class="ct-hist">' + h.map(function (x) { return '<li><strong style="color:var(--club-gold)">' + esc(x.n) + '</strong><br>' + esc(x.ass) + ' • ' + new Date(x.em).toLocaleDateString('pt-BR') + '</li>'; }).join('') + '</ul>' : '<p class="ct-note">Nenhuma mensagem enviada neste aparelho ainda.</p>') + '</div></div>';
    if (PRE) { if (PRE.ass) $('aAss').value = PRE.ass; if (PRE.msg) $('aMsg').value = PRE.msg; PRE = null; }
    $('falF').onsubmit = function (e) {
      e.preventDefault();
      var ok = check(null, [['aAss', function (v) { return !!v; }], ['aNome', function (v) { return v.trim().length >= 3; }], ['aMail', function (v) { return /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v.trim()); }], ['aMsg', function (v) { return v.trim().length >= 10; }]]); if (!ok) return;
      var d = { n: proto('ATD'), ass: $('aAss').value, nome: $('aNome').value.trim(), mail: $('aMail').value.trim(), tel: $('aTel').value.trim(), msg: $('aMsg').value.trim(), em: new Date().toISOString() };
      var l = ls('scec_atend'); l.push(d); ls('scec_atend', l.slice(-20));
      var txt = 'Protocolo ' + d.n + '\nAssunto: ' + d.ass + '\nNome: ' + d.nome + '\nE-mail: ' + d.mail + (d.tel ? '\nWhatsApp: ' + d.tel : '') + '\n\n' + d.msg;
      $('falSide').className = 'ct-card ct-ok'; $('falSide').innerHTML = '<h4>✅ Mensagem registrada</h4><div class="ct-proto">' + d.n + '</div><p class="ct-note">Guarde o protocolo para acompanhar o atendimento.</p>' + send(txt, d.ass + ' — ' + d.n);
      $('falF').reset();
    };
  }
  /* ---------- comparar jogadores ---------- */
  var CP = { a: null, b: null };
  function cmp(p) {
    var L = []; try { L = DB.players.slice(); } catch (e) {}
    if (L.length < 2) { p.innerHTML = '<p class="ct-empty">O elenco ainda não foi cadastrado.</p>'; return; }
    L.sort(function (x, y) { return x.num - y.num; });
    var top = L.slice().sort(function (x, y) { return (y.goals || 0) - (x.goals || 0); });
    if (CP.a == null || !L.some(function (x) { return x.id === CP.a; })) { CP.a = top[0].id; CP.b = top[1].id; }
    var by = function (id) { return L.filter(function (x) { return x.id === id; })[0]; }, A = by(CP.a), B = by(CP.b);
    var opt = function (sel) { return L.map(function (x) { return '<option value="' + x.id + '"' + (x.id === sel ? ' selected' : '') + '>' + x.num + ' • ' + esc(x.name) + '</option>'; }).join(''); };
    var gpj = function (x) { return x.games ? +((x.goals || 0) / x.games).toFixed(2) : 0; };
    var rows = [['Jogos', A.games || 0, B.games || 0, 1], ['Gols', A.goals || 0, B.goals || 0, 1], ['Gols por jogo', gpj(A), gpj(B), 1], ['Idade', A.age || 0, B.age || 0, 0]];
    var card = function (x) { return '<div class="cp-card"><div class="cp-img">' + (x.img ? '<img src="' + esc(x.img) + '" alt="' + esc(x.nick || x.name) + '" onerror="this.remove()">' : '') + '<b>' + x.num + '</b></div><h4>' + esc(x.name) + '</h4><small>' + esc(x.nick ? x.nick + ' • ' : '') + esc(x.pos) + '</small></div>'; };
    var row = function (r) {
      var mx = Math.max(r[1], r[2], .0001), wa = r[3] && r[1] > r[2], wb = r[3] && r[2] > r[1];
      return '<div class="cp-row"><div class="cp-lab">' + r[0] + '</div><div class="cp-line"><em class="' + (wa ? 'w' : '') + '">' + r[1] + '</em><div class="cp-bar"><span><i class="' + (wa ? 'w' : '') + '" style="width:' + (r[1] / mx * 100) + '%"></i></span><span><i class="' + (wb ? 'w' : '') + '" style="width:' + (r[2] / mx * 100) + '%"></i></span></div><em class="' + (wb ? 'w' : '') + '">' + r[2] + '</em></div></div>';
    };
    var win = (A.goals || 0) === (B.goals || 0) ? 'Empate em gols' : 'Mais gols: <strong style="color:var(--club-gold)">' + esc(((A.goals || 0) > (B.goals || 0) ? A : B).nick || ((A.goals || 0) > (B.goals || 0) ? A : B).name) + '</strong>';
    p.innerHTML = '<div class="cp-top"><div class="ct-f"><label for="cpA">Jogador 1</label><select id="cpA">' + opt(CP.a) + '</select></div><button type="button" class="btn-outline" id="cpSw" aria-label="Trocar lados">⇄</button><div class="ct-f"><label for="cpB">Jogador 2</label><select id="cpB">' + opt(CP.b) + '</select></div><button type="button" class="btn-outline" id="cpRnd">🎲 Sortear</button></div>' +
      '<div class="cp-body">' + card(A) + '<div class="cp-stats">' + rows.map(row).join('') + '<p class="ct-note" style="text-align:center;margin-top:10px">' + win + '</p></div>' + card(B) + '</div><p class="ct-note" style="margin-top:12px;text-align:center">Dados do elenco profissional na temporada atual.</p>';
    $('cpA').onchange = function () { CP.a = +this.value; render(); }; $('cpB').onchange = function () { CP.b = +this.value; render(); };
    $('cpSw').onclick = function () { var t = CP.a; CP.a = CP.b; CP.b = t; render(); };
    $('cpRnd').onclick = function () { var x = L[Math.floor(Math.random() * L.length)], y; do { y = L[Math.floor(Math.random() * L.length)]; } while (y.id === x.id); CP.a = x.id; CP.b = y.id; render(); };
  }
  window.__ct = { field: field, check: check, proto: proto, send: send, ls: ls, esc: esc };
  function render() {
    $('ctTabs').innerHTML = TABS.map(function (t) { return '<button type="button" class="ct-tab" role="tab" data-t="' + t[0] + '" aria-selected="' + (t[0] === cur) + '">' + t[1] + ' ' + t[2] + '</button>'; }).join('');
    [].forEach.call($('ctTabs').querySelectorAll('.ct-tab'), function (b) { b.onclick = function () { cur = b.dataset.t; render(); }; });
    var p = $('ctPanel'); p.className = 'ct-panel'; ({ gal: gal, pen: pen, ret: ret, fal: fal, cmp: cmp })[cur](p);
  }
  window.ctOpen = function (t, pre) { cur = t; PRE = pre || null; render(); var s = $('central'); if (s) s.scrollIntoView({ behavior: 'smooth' }); };
  render(); window.addEventListener('load', function () { if (cur === 'gal') render(); });
})();
