/* Santa Clara EC — js/institucional.js
   Transparência (documentos e conduta) e Eventos e Espaços (orçamento e reserva).
   Carregado como script clássico, na ordem do index.html (não reordene). */

(function () {
  try {
    var E = window.EDITAR || {}, $ = function (i) { return document.getElementById(i); }, X = window.__ct; if (!X) return;
    var esc = X.esc, Y = new Date().getFullYear();
    /* ---------- transparência ---------- */
    var tb = $('trBox');
    if (tb) {
      var docs = (E.DOCUMENTOS || []).length ? E.DOCUMENTOS : [{ titulo: 'Estatuto social', tipo: 'Estatuto', desc: 'Regras de funcionamento do clube' }, { titulo: 'Atas de assembleia', tipo: 'Ata', desc: 'Decisões registradas' }, { titulo: 'Balanço e demonstrações financeiras', tipo: 'Balanço', desc: 'Prestação de contas' }, { titulo: 'Regulamento do campeonato', tipo: 'Regulamento', desc: 'Mineiro Módulo II', url: '#regulamento' }, { titulo: 'Política de privacidade (LGPD)', tipo: 'Outro', desc: 'Como seus dados são tratados' }];
      var ico = { Estatuto: '📜', Ata: '📝', 'Balanço': '📊', Regulamento: '📘', Outro: '📄' }, tipos = ['Todos'].concat(docs.map(function (d) { return d.tipo || 'Outro'; }).filter(function (v, i, a) { return a.indexOf(v) === i; })), fil = 'Todos';
      var rules = (E.CONDUTA || []).length ? E.CONDUTA : ['Respeito acima de tudo: ofensas, racismo, homofobia e qualquer discriminação não são toleradas, no estádio e no mural.', 'O ingresso é pessoal: valide o QR code no posto do seu setor antes de entrar.', 'Siga as orientações da equipe de segurança e de organização.', 'Em jogos fora de casa, valem as regras do clube mandante.', 'Cuide da Toca do Lobo: preserve o patrimônio e mantenha o setor limpo.'];
      var C = E.CONTATO || {};
      var draw = function () {
        var l = docs.filter(function (d) { return fil === 'Todos' || (d.tipo || 'Outro') === fil; });
        $('trDocs').innerHTML = l.map(function (d, i) { var ext = /^https?:/.test(d.url || ''), int = /^#/.test(d.url || '');
          return '<div class="tr-doc"><div class="tr-ico">' + (ico[d.tipo] || '📄') + '</div><div><b>' + esc(d.titulo) + '</b><small>' + esc(d.desc || '') + (d.ano ? (d.desc ? ' • ' : '') + d.ano : '') + '</small></div>' +
            (d.url ? '<a class="btn-primary" href="' + esc(d.url) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + (int ? 'Ver' : 'Abrir') + '</a>' : '<button type="button" class="btn-outline" data-t="' + esc(d.titulo) + '">Solicitar</button>') + '</div>'; }).join('') || '<p class="ct-note">Nenhum documento nesta categoria.</p>';
        [].forEach.call($('trDocs').querySelectorAll('button[data-t]'), function (b) { b.onclick = function () { ctOpen('fal', { ass: 'Transparência e documentos', msg: 'Olá! Gostaria de receber o documento: ' + b.dataset.t + '.' }); }; });
        [].forEach.call($('trChips').children, function (c) { c.classList.toggle('on', c.dataset.f === fil); });
      };
      tb.innerHTML = '<div class="tr-grid"><div class="ct-card"><h3 style="font-family:var(--font-display);font-size:1.4rem">📑 Documentos oficiais</h3><div class="tr-chips" id="trChips">' + tipos.map(function (t) { return '<button type="button" data-f="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div><div id="trDocs"></div><p class="ct-note" style="margin-top:10px">Documentos sem link podem ser solicitados ao clube: você recebe um protocolo.</p></div>' +
        '<div style="display:grid;gap:18px;align-content:start"><div class="ct-card"><h3 style="font-family:var(--font-display);font-size:1.4rem">🤝 Conduta do torcedor</h3><ol class="tr-rules">' + rules.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ol></div>' +
        '<div class="ct-card tr-side"><div><h4>Ouvidoria</h4><p class="ct-note">Reclamações, denúncias e sugestões chegam direto à gestão do clube.</p></div><div class="ct-btns" style="margin-top:0"><button type="button" class="btn-primary" id="trOuv">Abrir protocolo</button><a class="btn-outline" href="#diretoria">Ver diretoria</a></div><p class="ct-note">Modelo de gestão: SAF desde 2024.' + (C.email ? ' Contato: ' + esc(C.email) : '') + '</p></div></div></div>';
      [].forEach.call($('trChips').children, function (c) { c.onclick = function () { fil = c.dataset.f; draw(); }; });
      $('trOuv').onclick = function () { ctOpen('fal', { ass: 'Reclamação (ouvidoria)' }); }; draw();
    }
    /* ---------- eventos e espaços ---------- */
    var eb = $('esBox');
    if (eb) {
      var sp = (E.ESPACOS || []).length ? E.ESPACOS : [{ emoji: '🏟️', nome: 'Estádio Vale de Santa Clara', desc: 'A Toca do Lobo, com 25 mil lugares. Para eventos corporativos, institucionais e gravações.' }, { emoji: '🥂', nome: 'Camarote', desc: 'Hospitalidade em dia de jogo para clientes e equipes, com vaga no estacionamento exclusivo.' }, { emoji: '🧭', nome: 'Visita guiada', desc: 'Conheça os vestiários e o túnel da Toca do Lobo com a sua turma, escola ou empresa.' }];
      var tipos2 = ['Evento corporativo', 'Confraternização', 'Aniversário', 'Gravação ou ensaio fotográfico', 'Visita escolar ou em grupo', 'Outro'], F = X.field, d1 = new Date(Date.now() + 864e5), min = d1.getFullYear() + '-' + String(d1.getMonth() + 1).padStart(2, '0') + '-' + String(d1.getDate()).padStart(2, '0');
      var opt = function (a) { return a.map(function (x) { return '<option>' + esc(x) + '</option>'; }).join(''); };
      eb.innerHTML = '<div class="es-cards">' + sp.map(function (x, i) { return '<div class="es-c"><div class="es-e">' + esc(x.emoji || '🎪') + '</div><h3>' + esc(x.nome) + '</h3><p>' + esc(x.desc || '') + '</p><button type="button" class="btn-outline" data-i="' + i + '">Solicitar orçamento</button></div>'; }).join('') + '</div>' +
        '<div class="ct-split"><div class="ct-card"><h3 style="font-family:var(--font-display);font-size:1.4rem;margin-bottom:6px">Solicite orçamento ou reserva</h3><p class="ct-note" style="margin-bottom:14px">Conte o que você precisa. O clube analisa a disponibilidade e responde pelo contato informado.</p><form class="ct-form" id="esF" novalidate>' +
        F('eEsp', 'Espaço', '<select id="eEsp"><option value="">Selecione</option>' + opt(sp.map(function (x) { return x.nome; })) + '</select>') + F('eTipo', 'Tipo de evento', '<select id="eTipo"><option value="">Selecione</option>' + opt(tipos2) + '</select>') +
        F('eData', 'Data desejada', '<input id="eData" type="date" min="' + min + '">', 'Escolha uma data futura') + F('ePes', 'Número de pessoas', '<input id="ePes" type="number" min="1" max="50000" inputmode="numeric">', 'Informe de 1 a 50000') +
        F('eNome', 'Nome ou empresa', '<input id="eNome" autocomplete="name">') + F('eTel', 'WhatsApp', '<input id="eTel" type="tel" inputmode="tel" autocomplete="tel">', 'Informe DDD e número, ou um e-mail válido') + '<div class="full">' + F('eMail', 'E-mail (opcional se informou WhatsApp)', '<input id="eMail" type="email" autocomplete="email">', 'Informe um e-mail válido') + '</div>' +
        '<div class="full">' + F('eObs', 'Detalhes (opcional)', '<textarea id="eObs" style="min-height:80px"></textarea>') + '</div><div class="full"><button type="submit" class="btn-primary">Enviar solicitação</button></div></form></div>' +
        '<div class="ct-card" id="esSide"><h4 style="margin-bottom:6px">Como funciona</h4><ol class="es-steps"><li>Você envia a solicitação e recebe um protocolo.</li><li>O clube confere a agenda e a disponibilidade.</li><li>Você recebe retorno pelo contato informado, com valores e orientações.</li></ol><p class="ct-note" style="margin-top:10px">Torcedor também pode trocar pontos da Matilha por uma visita guiada, na loja de recompensas.</p></div></div>';
      [].forEach.call(eb.querySelectorAll('.es-c button'), function (b) { b.onclick = function () { $('eEsp').value = sp[+b.dataset.i].nome; $('esF').scrollIntoView({ behavior: 'smooth', block: 'center' }); $('eTipo').focus({ preventScroll: true }); }; });
      $('esF').onsubmit = function (e) {
        e.preventDefault(); var okMail = function (v) { return /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v.trim()); }, telOk = function () { return $('eTel').value.replace(/\D/g, '').length >= 10; };
        var ok = X.check(null, [['eEsp', function (v) { return !!v; }], ['eTipo', function (v) { return !!v; }], ['eData', function (v) { return v && v >= min; }], ['ePes', function (v) { return +v >= 1 && +v <= 50000; }], ['eNome', function (v) { return v.trim().length >= 3; }], ['eTel', function (v) { return telOk() || okMail($('eMail').value); }], ['eMail', function (v) { return !v.trim() || okMail(v); }]]);
        if (!ok) return;
        var d = { n: X.proto('ESP'), esp: $('eEsp').value, tipo: $('eTipo').value, data: $('eData').value, pes: $('ePes').value, nome: $('eNome').value.trim(), tel: $('eTel').value.trim(), mail: $('eMail').value.trim(), obs: $('eObs').value.trim(), em: new Date().toISOString() };
        var l = X.ls('scec_espacos'); l.push(d); X.ls('scec_espacos', l.slice(-20));
        var txt = 'Solicitação ' + d.n + ' — Eventos e Espaços\nEspaço: ' + d.esp + '\nTipo: ' + d.tipo + '\nData: ' + d.data.split('-').reverse().join('/') + '\nPessoas: ' + d.pes + '\nNome: ' + d.nome + (d.tel ? '\nWhatsApp: ' + d.tel : '') + (d.mail ? '\nE-mail: ' + d.mail : '') + (d.obs ? '\n\n' + d.obs : '');
        $('esSide').className = 'ct-card ct-ok'; $('esSide').innerHTML = '<h4>✅ Solicitação registrada</h4><div class="ct-proto">' + d.n + '</div><p class="ct-note">Guarde o protocolo. O clube retorna pelo contato informado.</p>' + X.send(txt, 'Solicitação ' + d.n);
        $('esF').reset(); $('esSide').scrollIntoView({ behavior: 'smooth', block: 'center' });
      };
    }
  } catch (e) { console.warn('institucional', e); }
})();
