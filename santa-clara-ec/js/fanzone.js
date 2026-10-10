/* Santa Clara EC — js/fanzone.js
   Acessibilidade, Mural da Matilha, Álbum de figurinhas e Simulador da Tabela (tudo salvo só no navegador).
   Carregado como script clássico, na ordem do index.html (não reordene). */

/* v8: acessibilidade, Mural da Matilha e Álbum de figurinhas (tudo salvo só no navegador) */
(function () {
  const LS = (k, v) => { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } };
  const $ = id => document.getElementById(id), say = m => (window.socToast ? socToast(m) : null);
  /* ---- acessibilidade ---- */
  const A = Object.assign({ f: 100, hc: false, rm: false }, LS('scec_a11y') || {});
  function applyA() { const h = document.documentElement; h.style.fontSize = A.f + '%'; h.classList.toggle('a11y-hc', A.hc); h.classList.toggle('a11y-rm', A.rm); LS('scec_a11y', A); }
  applyA();
  const fab = document.createElement('button'); fab.className = 'a11y-fab'; fab.textContent = 'Aa'; fab.setAttribute('aria-label', 'Opções de acessibilidade'); fab.setAttribute('aria-expanded', 'false');
  const pan = document.createElement('div'); pan.className = 'a11y-panel'; pan.setAttribute('role', 'group'); pan.setAttribute('aria-label', 'Acessibilidade');
  pan.innerHTML = '<strong>Acessibilidade</strong><button data-a="m">A− Diminuir texto</button><button data-a="p">A+ Aumentar texto</button><button data-a="hc" aria-pressed="false">◐ Alto contraste</button><button data-a="rm" aria-pressed="false">⏸ Reduzir animações</button><button data-a="r">↺ Restaurar</button>';
  document.body.append(fab, pan);
  const sync = () => { pan.querySelector('[data-a=hc]').setAttribute('aria-pressed', A.hc); pan.querySelector('[data-a=rm]').setAttribute('aria-pressed', A.rm); }; sync();
  fab.onclick = () => { const o = pan.classList.toggle('open'); fab.setAttribute('aria-expanded', o); };
  pan.onclick = e => { const a = e.target.dataset && e.target.dataset.a; if (!a) return;
    if (a === 'm') A.f = Math.max(85, A.f - 10); if (a === 'p') A.f = Math.min(140, A.f + 10); if (a === 'hc') A.hc = !A.hc; if (a === 'rm') A.rm = !A.rm; if (a === 'r') { A.f = 100; A.hc = false; A.rm = false; } applyA(); sync(); };
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && pan.classList.contains('open')) { pan.classList.remove('open'); fab.focus(); } });
  /* ---- Mural ---- */
  const BAD = /(^|[^a-z])(put[ao]s?|porra|caralh\w*|merd\w*|viad\w*|bicha|macac\w*|nazi\w*|estupr\w*|vagabund\w*|arrombad\w*|fdp|otari\w*|retardad\w*|imbecil\w*|idiot\w*|lixo|mat(ar|em|aria)\b|morr(a|am|er)\b|sinalizador\w*|bomba)/i;
  const norm = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[01345@$]/g, c => ({ 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', '@': 'a', '$': 's' }[c])).replace(/[^a-z ]/g, ' ');
  let M = LS('scec_mural') || [{ n: 'Matilha', t: 'Vai, Santa Clara! A Toca do Lobo está pronta para o próximo jogo! 🐺', l: 12, h: 0 }];
  const save = () => LS('scec_mural', M.slice(0, 40));
  function drawM() { const ul = $('fzList'); ul.innerHTML = '';
    M.forEach((m, i) => { if (m.h) return; const li = document.createElement('li'), b = document.createElement('b'), p = document.createElement('p'), d = document.createElement('div');
      b.textContent = m.n || 'Torcedor'; p.textContent = m.t; d.className = 'fz-act';
      const lk = document.createElement('button'); lk.textContent = '🐺 ' + m.l; lk.setAttribute('aria-label', 'Curtir mensagem'); lk.onclick = () => { m.l++; save(); drawM(); };
      const rp = document.createElement('button'); rp.textContent = 'Denunciar'; rp.onclick = () => { m.h = 1; save(); drawM(); say('Obrigado. A mensagem foi ocultada.'); };
      d.append(lk, rp); li.append(b, p, d); ul.append(li); }); }
  $('fzMsg').addEventListener('input', () => $('fzCount').textContent = $('fzMsg').value.length + '/140');
  $('fzPost').onclick = () => { const t = $('fzMsg').value.trim().replace(/\s+/g, ' '), n = $('fzName').value.trim();
    if (t.length < 3) return say('Escreva uma mensagem um pouco maior.');
    if (BAD.test(norm(t)) || BAD.test(norm(n))) return say('Mensagem não publicada: vamos manter o respeito na arquibancada.');
    if (/https?:|www\./i.test(t)) return say('Links não são permitidos no mural.');
    M.unshift({ n: n.slice(0, 24), t: t.slice(0, 140), l: 0, h: 0 }); save(); $('fzMsg').value = ''; $('fzCount').textContent = '0/140'; drawM(); say('Recado publicado no mural! 🐺'); };
  drawM();
  /* ---- Álbum ---- */
  const squad = () => ((window.EDITAR && EDITAR.ELENCO) || []).filter(p => p && p.name);
  const rar = p => (p.id * 7 + (p.num || 0)) % 10 === 0 ? 'lend' : (p.id + (p.num || 0)) % 3 === 0 ? 'rara' : '';
  let AL = LS('scec_album') || { d: '', o: {} };
  const today = () => new Date().toLocaleDateString('sv-SE');
  const card = (p, n) => { const e = document.createElement('div'); e.className = 'fz-st ' + rar(p);
    e.innerHTML = '<span class="n"></span><b></b><small></small>' + (n > 1 ? '<span class="x2">×' + n + '</span>' : ''); e.querySelector('.n').textContent = p.num; e.querySelector('b').textContent = p.nick || p.name; e.querySelector('small').textContent = p.pos || ''; e.title = p.name; return e; };
  function drawA() { const S = squad(), box = $('fzAlbum'); box.innerHTML = ''; let have = 0;
    S.forEach(p => { const n = AL.o[p.id] || 0; if (n) { have++; box.append(card(p, n)); } else { const e = document.createElement('div'); e.className = 'fz-st off'; e.innerHTML = '<span class="n">?</span><small>#' + (p.num || '') + '</small>'; box.append(e); } });
    $('fzProg').textContent = have + '/' + S.length + (S.length && have === S.length ? ' 🏆' : ''); const b = $('fzOpen'); const done = AL.d === today(); b.disabled = done || !S.length; b.textContent = done ? 'Volte amanhã para um novo pacote' : 'Abrir pacote do dia'; }
  function draw1(S) { const r = Math.random(), want = r < .06 ? 'lend' : r < .32 ? 'rara' : ''; const pool = S.filter(p => rar(p) === want); const L = pool.length ? pool : S; return L[Math.floor(Math.random() * L.length)]; }
  $('fzOpen').onclick = () => { const S = squad(); if (!S.length || AL.d === today()) return; const pk = $('fzPack'); pk.innerHTML = '';
    for (let i = 0; i < 3; i++) { const p = draw1(S); AL.o[p.id] = (AL.o[p.id] || 0) + 1; const c = card(p, 0); c.style.animationDelay = i * .25 + 's'; pk.append(c); }
    AL.d = today(); LS('scec_album', AL); drawA(); say('Pacote aberto! Confira suas figurinhas. 🃏'); };
  drawA();
})();

/* v10: Simulador da Tabela e barra de leitura (tudo no navegador) */
(function () {
  const $ = id => document.getElementById(id);
  const ord = n => n + 'º';
  /* ---- Simulador ---- */
  try {
    const E = window.EDITAR || {}, rows = (typeof DB !== 'undefined' && DB.standings) || [], me = rows.find(t => /santa clara/i.test(t.name));
    const games = [E.PROXIMO_JOGO].concat(E.CALENDARIO || []).filter(Boolean).map(g => ({ r: g.rodada, adv: g.adversario || g.adv }));
    const box = $('fzSimGames');
    if (me && games.length) {
      games.forEach((g, i) => { const l = document.createElement('label'), sp = document.createElement('span'), sel = document.createElement('select');
        sp.textContent = (g.r ? g.r + 'ª rodada: ' : '') + 'vs ' + g.adv; sel.dataset.i = i; sel.setAttribute('aria-label', 'Resultado contra ' + g.adv);
        [['3', 'Vitória'], ['1', 'Empate'], ['0', 'Derrota']].forEach(o => { const op = document.createElement('option'); op.value = o[0]; op.textContent = o[1]; sel.append(op); });
        l.append(sp, sel); box.append(l); });
      const calc = () => { const add = [].reduce.call(box.querySelectorAll('select'), (a, x) => a + (+x.value), 0), pts = me.pts + add;
        const acima = rows.filter(t => t !== me && t.pts > pts).length, iguais = rows.filter(t => t !== me && t.pts === pts).length, pos = acima + 1;
        const lider = rows.filter(t => t !== me).reduce((m, t) => Math.max(m, t.pts), 0);
        $('fzSimOut').innerHTML = '<strong></strong><span></span>';
        $('fzSimOut').querySelector('strong').textContent = pts + ' pontos • ' + (iguais ? 'a partir do ' : '') + ord(pos) + ' lugar';
        $('fzSimOut').querySelector('span').textContent = (add ? '+' + add + ' pontos' : 'Sem pontos novos') + ' em ' + games.length + ' jogos. ' + (pts > lider ? (add ? 'Seria a liderança isolada sobre as pontuações atuais! 🐺' : 'Continuaria na frente das pontuações atuais dos rivais.') : pts === lider ? 'Empataria em pontos com o líder atual.' : 'O líder atual tem ' + lider + ' pontos.') + (iguais ? ' Há empate em pontos; o saldo de gols decide.' : ''); };
      box.addEventListener('change', calc); calc();
    } else { $('fzSimOut').textContent = 'Simulador indisponível: sem dados da tabela.'; }
  } catch (e) { console.error('v10 simulador', e); }
  /* ---- Checklist ---- */
  /* ---- barra de leitura ---- */
  const bar = document.createElement('div'); bar.id = 'v10Prog'; bar.setAttribute('aria-hidden', 'true');
  const upd = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.width = (h > 0 ? Math.min(100, scrollY / h * 100) : 0) + '%'; };
  addEventListener('scroll', upd, { passive: true }); upd();
})();
