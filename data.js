/* Santa Clara EC — js/data.js
   Banco de dados em memória (DB) montado a partir de EDITAR e renderização das seções principais.
   Carregado como script clássico, na ordem do index.html (não reordene). */

    /* =========================================================
       1. BANCO DE DADOS EM MEMÓRIA
       ========================================================= */
    const DB = {
      news: (window.EDITAR && EDITAR.NOTICIAS) || [],

      // Para usar escudos reais: preencha "logo" com a URL da imagem do time
      // (ex: logo: 'https://exemplo.com/democrata-gv.png'). Enquanto vazio,
      // o site mostra um brasão provisório com as iniciais do clube.
      standings: [
        { pos: 1, name: 'Democrata GV',      logo: '', form: ['V', 'V', 'E', 'V', 'D'], j: 7, v: 5, sg: 12, pts: 16 },
        { pos: 2, name: 'Santa Clara EC',     logo: '', form: ['V', 'V', 'V', 'E', 'V'], j: 7, v: 6, sg: 11, pts: 19 },
        { pos: 3, name: 'Atl. Araçuaí',      logo: '', form: ['D', 'V', 'E', 'V', 'V'], j: 7, v: 4, sg:  6, pts: 13 },
        { pos: 4, name: 'Uberlândia EC',      logo: '', form: ['E', 'V', 'D', 'V', 'E'], j: 7, v: 4, sg:  4, pts: 13 },
        { pos: 5, name: 'Ipatinga FC',        logo: '', form: ['D', 'E', 'V', 'D', 'V'], j: 7, v: 3, sg:  2, pts: 10 },
        { pos: 6, name: 'EC Montes Claros',   logo: '', form: ['V', 'D', 'D', 'E', 'D'], j: 7, v: 3, sg: -1, pts:  9 },
        { pos: 7, name: 'Pouso Alegre FC',    logo: '', form: ['D', 'D', 'E', 'D', 'V'], j: 7, v: 2, sg: -5, pts:  7 },
        { pos: 8, name: 'Diamantina EC',      logo: '', form: ['E', 'D', 'D', 'V', 'D'], j: 7, v: 2, sg: -7, pts:  7 },
        { pos: 9, name: 'Muriaé Sport',       logo: '', form: ['D', 'D', 'D', 'E', 'D'], j: 7, v: 1, sg:-11, pts:  4 },
        { pos:10, name: 'Teófilo Otoni FC',   logo: '', form: ['D', 'D', 'D', 'D', 'D'], j: 7, v: 0, sg:-11, pts:  0 }
      ],

      results: [
        { scec: 2, opp: 0, oppName: 'Diamantina EC',    oppLogo: '', round: '7ª Rodada',  comp: 'Mineiro Módulo II' },
        { scec: 3, opp: 1, oppName: 'Teófilo Otoni FC', oppLogo: '', round: '6ª Rodada',  comp: 'Mineiro Módulo II' },
        { scec: 1, opp: 1, oppName: 'Democrata GV',     oppLogo: '', round: '5ª Rodada',  comp: 'Mineiro Módulo II' },
        { scec: 2, opp: 0, oppName: 'Muriaé Sport',     oppLogo: '', round: '4ª Rodada',  comp: 'Mineiro Módulo II' },
        { scec: 4, opp: 0, oppName: 'Ipatinga FC',      oppLogo: '', round: '3ª Rodada',  comp: 'Mineiro Módulo II' }
      ],

      // Para usar fotos reais dos jogadores: preencha "img" com a URL da foto
      // de cada atleta (ou use o Painel de Personalização no site). Vazio = foto padrão.
      players: (window.EDITAR && EDITAR.ELENCO) || [],

      products: [
        { id: 1,  cat: 'Mantos',     badge: 'Mais vendido', sizes: ['P','M','G','GG'], name: 'Manto Titular 2026 — Azul-Escuro',   price: 279.90, imgur: 'OxIaNAn', img: 'https://i.imgur.com/OxIaNAn.jpg' },
        { id: 2,  cat: 'Mantos',     sizes: ['P','M','G','GG'], name: 'Manto Reserva 2026 — Branco',        price: 279.90, imgur: 'R5cyUwa', img: 'https://i.imgur.com/R5cyUwa.jpg' },
        { id: 3,  cat: 'Mantos',     badge: 'Novo', sizes: ['P','M','G','GG'], name: 'Terceiro Uniforme — Marrom do Vale',  price: 299.90, imgur: 'CcS17si', img: 'https://i.imgur.com/CcS17si.jpg' },
        { id: 7,  cat: 'Mantos',     sizes: ['P','M','G','GG'], emoji: '👕', name: 'Camisa de Treino 2026 — Cinza', price: 179.90, imgur: '66xL9HP', img: 'https://i.imgur.com/66xL9HP.jpg' },
        { id: 11, cat: 'Mantos',     sizes: ['P','M','G','GG'], emoji: '🧥', name: 'Agasalho de Viagem Matilha', price: 349.90, imgur: 'XtGCK3r', img: 'https://i.imgur.com/XtGCK3r.jpg' },
        { id: 4,  cat: 'Torcida',    name: 'Boné Aba Curva SCEC Azul',           price: 89.90,  img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=400&auto=format&fit=crop' },
        { id: 5,  cat: 'Torcida',    name: 'Cachecol Oficial Toca do Lobo',      price: 69.90,  img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400&auto=format&fit=crop' },
        { id: 8,  cat: 'Torcida',    emoji: '🚩', name: 'Bandeira Oficial 1,5 m — Matilha', price: 79.90, imgur: 'PVIh9Ut', img: 'https://i.imgur.com/PVIh9Ut.jpg' },
        { id: 12, cat: 'Torcida',    badge: 'Combo', emoji: '🎁', name: 'Combo Boné + Cachecol', price: 139.90, imgur: '5QHJBV3', img: 'https://i.imgur.com/5QHJBV3.jpg' },
        { id: 6,  cat: 'Acessórios', name: 'Caneca Térmica Lobo-Guará',          price: 64.90,  img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&auto=format&fit=crop' },
        { id: 9,  cat: 'Acessórios', emoji: '🎒', name: 'Mochila Toca do Lobo', price: 149.90, imgur: 'j3bpnqg', img: 'https://i.imgur.com/j3bpnqg.jpg' },
        { id: 10, cat: 'Acessórios', emoji: '🔑', name: 'Chaveiro Lobo-Guará', price: 24.90, imgur: '2fTFt2G', img: 'https://i.imgur.com/2fTFt2G.jpg' }
      ],

      timeline: (window.EDITAR && EDITAR.HISTORIA) || [],

      trophies: (window.EDITAR && EDITAR.TROFEUS) || [],

      // Diretoria, comissão técnica e nota sobre a SAF — pensados para transmitir
      // transparência a torcedores e investidores. Fotos: preencha "photo" com a URL.
      safInfo: 'O Santa Clara Esporte Clube opera sob o modelo de SAF (Sociedade Anônima do Futebol) desde 2024, com capital aberto a investidores e gestão profissionalizada separada da associação civil — garantindo transparência financeira e mais atratividade para novos aportes.',

      board: (window.EDITAR && EDITAR.DIRETORIA) || [],

      technicalStaff: (window.EDITAR && EDITAR.COMISSAO_TECNICA) || [],

      // Portões de acesso ao estádio. Para usar fotos reais, preencha "img"
      // com a URL de cada portão (ou placa/entrada correspondente).
      gates: [
        { name: 'Portão B — Setor Verde',      sector: 'VERDE',      desc: 'Entrada final da torcida popular pelo Túnel do Lobo.', img: '' },
        { name: 'Portão A — Setor Roxo',       sector: 'ROXO',       desc: 'Acesso intermediário, arquibancada lateral.',         img: '' },
        { name: 'Portão D — Setor Azul',       sector: 'AZUL',       desc: 'Arquibancada principal, visão frontal do campo.',     img: '' },
        { name: 'Portão C — Visitante',        sector: 'VISITANTE', desc: 'Acesso separado e controlado da torcida visitante.',  img: '' },
        { name: 'Portão VIP — Camarotes',      sector: 'CAMAROTE',  desc: 'Entrada exclusiva para camarotes e área VIP.',        img: '' }
      ],

      // Ranking fictício de cartões da temporada.
      cardsRanking: [
        { name: 'César Marrom',   yellow: 9, red: 1 },
        { name: 'Marcelo Pedra',  yellow: 7, red: 0 },
        { name: 'Kleber Vale',    yellow: 6, red: 0 },
        { name: 'Bruno Arêdes',   yellow: 5, red: 1 },
        { name: 'Rodrigo Lobo',   yellow: 4, red: 0 }
      ],

      // Parceiros de transmissão. Para usar logos reais, preencha "logo".
      broadcast: [
        { name: 'SportiNet', tier: 'TV 1 • Transmissão principal', icon: '📺', logo: 'https://i.imgur.com/iNm5UJX.jpg', imgur: 'iNm5UJX',
          desc: 'A TV principal da partida do Santa Clara, com a transmissão completa do jogo.' },
        { name: 'SuperSports', tier: 'TV 2 • Segunda opção', icon: '📺', logo: 'https://i.imgur.com/oQe6kWN.jpg', imgur: 'oQe6kWN',
          desc: 'A segunda TV para acompanhar o jogo, uma alternativa ao canal principal.' },
        { name: 'Pop 96', tier: 'Rádio 1 • Alta qualidade', icon: '🎧', logo: 'https://i.imgur.com/wyXT764.png', imgur: 'wyXT764',
          desc: 'Rádio para acompanhar o jogo: áudio em alta qualidade e o resultado da partida no próprio site da rádio.' },
        { name: 'Rádio Oficial do Estádio', tier: 'Rádio 2 • Sinal oficial', icon: '📻', logo: 'https://i.imgur.com/y3kAvxl.png', imgur: 'y3kAvxl',
          desc: 'A emissora oficial da Toca do Lobo distribui o sinal para várias rádios e dá acesso a 3 emissoras, mas com qualidade de áudio mais baixa.' }
      ],

      // Explicação do formato de disputa do Módulo II.
      regulation: [
        { title: 'Fase de Grupos',   desc: 'As equipes são divididas em grupos e jogam entre si em turno único ou returno, somando pontos por vitória (3), empate (1) e derrota (0).' },
        { title: 'Fase Final',       desc: 'Os primeiros colocados de cada grupo avançam a uma fase eliminatória (quartas, semifinal e final) para decidir o campeão do Módulo II.' },
        { title: 'Acesso ao Módulo I', desc: 'O campeão — e, em alguns formatos, o vice — garante o acesso à elite do Campeonato Mineiro na temporada seguinte.' },
        { title: 'Critérios de Desempate', desc: 'Em caso de igualdade em pontos, valem nesta ordem: número de vitórias, saldo de gols, gols marcados e confronto direto.' }
      ],

      notifications: [
        { text: '🎟 Novo lote de ingressos para o Clássico do Vale disponível!', time: 'Há 15 min' },
        { text: '🐺 Seus 200 pontos de fidelidade foram creditados.',             time: 'Há 3 horas' },
        { text: '👕 Terceiro Uniforme Marrom disponível com frete grátis.',       time: 'Ontem'      }
      ],

      // Para usar logos reais dos patrocinadores: preencha "logo" com a URL
      // da imagem. Enquanto vazio, o site mostra um ícone provisório.
      sponsors: [
        { tier: 'Patrocinador Master', name: 'Banco ValeMais', logo: 'https://i.imgur.com/UAxJFpo.png', icon: 'BV',
          desc: 'Financia obras de reforma do Estádio Vale de Santa Clara e mantém o vínculo como patrocinador master até 2028.',
          url: '' },
        { tier: 'Patrocinador Oficial', name: 'JequiLog', logo: 'https://i.imgur.com/0f6av2d.png', icon: 'JL',
          desc: 'Parceira de logística do clube: transporte de material esportivo e apoio nas viagens pelo Vale do Jequitinhonha.',
          url: '' },
        { tier: 'Patrocinador Oficial', name: 'MinasNet', logo: 'https://i.imgur.com/HJRKlQy.png', icon: 'MN',
          desc: 'Provedora oficial de internet do clube, do estádio e das transmissões dos jogos.',
          url: '' },
        { tier: 'Patrocinador Oficial', name: 'Sertão Energia', logo: 'https://i.imgur.com/KSgVhz6.png', icon: 'SE',
          desc: 'Fornece energia ao Estádio Vale de Santa Clara e apoia projetos da base.',
          url: '' }
      ]
    };

    /* =========================================================
       APLICA A ÁREA DE EDIÇÃO (não precisa mexer aqui)
       ========================================================= */
    (function aplicarEdicao() {
      const E = window.EDITAR; if (!E) return;
      const J = (E.JOGOS || []).slice().sort((a, b) => a.rodada - b.rodada);
      if (J.length) {
        DB.results = J.slice().reverse().map(g => ({ scec: g.gols, opp: g.golsAdv, oppName: g.adv, oppLogo: '', round: g.rodada + 'ª Rodada', comp: g.comp || 'Mineiro Módulo II' }));
      }
      const old = {}; DB.standings.forEach(t => { old[t.name] = t.logo || ''; });
      const rows = (E.TABELA || []).map(t => Object.assign({ logo: old[t.name] || '' }, t));
      if (J.length) {
        let v = 0, e = 0, sg = 0; const form = [];
        J.forEach(g => { const d = g.gols - g.golsAdv; sg += d; if (d > 0) { v++; form.push('V'); } else if (d === 0) { e++; form.push('E'); } else form.push('D'); });
        rows.push({ name: 'Santa Clara EC', logo: old['Santa Clara EC'] || '', form: form.slice(-5), j: J.length, v: v, sg: sg, pts: v * 3 + e });
      }
      if (rows.length) {
        rows.sort((a, b) => b.pts - a.pts || b.sg - a.sg || b.v - a.v || a.name.localeCompare(b.name, 'pt-BR'));
        rows.forEach((t, i) => { t.pos = i + 1; });
        DB.standings = rows;
      }
      if (E.PATROCINADORES && E.PATROCINADORES.length) DB.sponsors = E.PATROCINADORES;
    })();

    /* =========================================================
       2. SESSÃO / LOCALSTORAGE
       ========================================================= */
    function getStored(key, def) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch(e) { return def; }
    }
    function setStored(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
    }
    let userSession = getStored('scec_user', {
      name: 'Torcedor Lobo',
      plan: 'Sócio Terror',
      code: 'SCEC-2026-0001',
      points: 1250,
      tickets: [],
      cart: []
    });

    /* =========================================================
       3. CONTADOR REGRESSIVO
       ========================================================= */
    function initCountdown() {
      const target = new Date((window.EDITAR && EDITAR.PROXIMO_JOGO && EDITAR.PROXIMO_JOGO.data) || Date.now() + 8 * 86400000);
      function tick() {
        const diff = target - Date.now();
        if (diff < 0) { ['cdDays','cdHours','cdMinutes','cdSeconds'].forEach(i => { const el = document.getElementById(i); if (el) el.textContent = '00'; }); return; }
        document.getElementById('cdDays').textContent    = String(Math.floor(diff/86400000)).padStart(2,'0');
        document.getElementById('cdHours').textContent   = String(Math.floor((diff%86400000)/3600000)).padStart(2,'0');
        document.getElementById('cdMinutes').textContent = String(Math.floor((diff%3600000)/60000)).padStart(2,'0');
        document.getElementById('cdSeconds').textContent = String(Math.floor((diff%60000)/1000)).padStart(2,'0');
      }
      setInterval(tick, 1000); tick();
    }

    /* =========================================================
       4. RENDERIZADORES
       ========================================================= */
    function renderNews(filter = 'TODAS') {
      const items = filter === 'TODAS' ? DB.news : DB.news.filter(n => n.category === filter);
      if (!items.length) {
        document.getElementById('mainFeaturedNews').innerHTML = '<p style="padding:24px;color:var(--club-muted)">Nenhuma notícia nesta categoria ainda.</p>';
        document.getElementById('sideNewsList').innerHTML = '';
        return;
      }
      const feat = items[0];
      document.getElementById('mainFeaturedNews').innerHTML = `
        <div class="news-thumb-wrapper">
          <img src="${feat.image}" alt="${feat.title}" loading="lazy" decoding="async">
          <span class="news-tag">${feat.category}</span>
        </div>
        <div class="news-body">
          <div>
            <div class="news-date">${feat.date}</div>
            <h3 class="news-title">${feat.title}</h3>
            <p class="news-excerpt">${feat.excerpt}</p>
          </div>
          <span style="color:var(--club-accent); font-size:0.75rem; font-weight:800; text-transform:uppercase;">Ler Matéria Completa →</span>
        </div>
      `;
      document.getElementById('sideNewsList').innerHTML = items.slice(1).map((n, i) => `
        <div class="news-card-small" onclick="openNewsDetail(${n.id - 1})">
          <img src="${n.image}" alt="${n.title}" loading="lazy" decoding="async">
          <div class="news-card-small-body">
            <span style="font-size:0.65rem; color:var(--club-accent); font-weight:800; text-transform:uppercase;">${n.category}</span>
            <div class="news-card-small-title">${n.title}</div>
            <span style="font-size:0.65rem; color:var(--club-muted); margin-top:4px;">${n.date}</span>
          </div>
        </div>
      `).join('');
    }

    function filterNews(cat, btn) {
      document.querySelectorAll('#newsFilters button').forEach(b => b.classList.remove('active'));
      (btn || document.querySelector('#newsFilters button')).classList.add('active');
      renderNews(cat);
    }

    let CLUB_CREST_URL = 'https://i.imgur.com/HWoq88J.png';

    function normalizeCrestUrl(url) {
      url = (url || '').trim();
      if (!url) return { src: '', base: '', exts: '' };
      const m = url.match(/^https?:\/\/(?:www\.)?imgur\.com\/(?:a\/)?([a-zA-Z0-9]+)\/?$/);
      if (m) return { src: `https://i.imgur.com/${m[1]}.png`, base: `https://i.imgur.com/${m[1]}`, exts: 'jpg,jpeg,webp,gif' };
      return { src: url, base: '', exts: '' };
    }

    function applyClubCrestToDOM() {
      const parsed = normalizeCrestUrl(CLUB_CREST_URL);
      document.querySelectorAll('.club-crest-img').forEach(img => {
        if (!parsed.src) {
          img.style.display = 'none';
          if (img.nextElementSibling) img.nextElementSibling.style.display = 'flex';
          return;
        }
        img.dataset.baseUrl = parsed.base;
        img.dataset.fallbackExts = parsed.exts;
        img.style.display = '';
        if (img.nextElementSibling) img.nextElementSibling.style.display = 'none';
        img.src = parsed.src;
      });
    }

    function clubCrestFallback(img) {
      const exts = (img.dataset.fallbackExts || '').split(',').filter(Boolean);
      const base = img.dataset.baseUrl;
      if (exts.length && base) {
        const nextExt = exts.shift();
        img.dataset.fallbackExts = exts.join(',');
        img.src = `${base}.${nextExt}`;
      } else {
        img.style.display = 'none';
        if (img.nextElementSibling) img.nextElementSibling.style.display = 'flex';
      }
    }

    function teamInitials(name) {
      return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
    }

    function crestFail(img) {
      const sz = +img.dataset.size || 26, sp = document.createElement('span');
      sp.className = 'team-crest-placeholder'; sp.style.cssText = `width:${sz}px;height:${sz}px;font-size:${Math.round(sz * 0.38)}px;`; sp.textContent = img.dataset.ini || '?';
      img.replaceWith(sp);
    }
    function crestBadge(name, logoUrl, size) {
      size = size || 26;
      const initials = teamInitials(name);
      if (!logoUrl && window.TEAM_LOGOS) logoUrl = window.TEAM_LOGOS[name] || '';
      const fallback = `<span class="team-crest-placeholder" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.38)}px;">${initials}</span>`;
      if (logoUrl) {
        return `<img src="${logoUrl}" alt="Escudo ${name}" class="team-crest" style="width:${size}px;height:${size}px;" data-ini="${initials}" data-size="${size}" onerror="crestExt(this)" loading="lazy" decoding="async">`;
      }
      return fallback;
    }

    function renderStandings() {
      const maxPts = Math.max(...DB.standings.map(s => s.pts));
      document.getElementById('standingsBody').innerHTML = DB.standings.map(s => {
        const isSCEC = s.name.includes('Santa Clara');
        const pct = maxPts ? Math.max(6, Math.round((s.pts / maxPts) * 100)) : 0;
        const barColor = isSCEC ? 'linear-gradient(90deg, var(--club-gold), #e8c976)' : 'linear-gradient(90deg, var(--club-primary), var(--club-accent))';
        return `
          <tr class="${isSCEC ? 'highlight-scec' : ''}">
            <td style="font-weight:700;"><span class="pos-chip pos-${s.pos}">${s.pos}</span></td>
            <td><div class="team-name-cell">${crestBadge(s.name, s.logo, 26)}<strong>${s.name}</strong></div></td>
            <td style="text-align:center;">${s.j}</td>
            <td style="text-align:center;">${s.v}</td>
            <td style="text-align:center;">${s.sg}</td>
            <td style="text-align:center;"><div class="form-strip">${(s.form || []).map(f => `<span class="form-dot ${f}">${f}</span>`).join('')}</div></td>
            <td style="text-align:right;">
              <div class="pts-cell">
                <span class="pts-value" style="color:${isSCEC ? 'var(--club-gold)' : 'inherit'}">${s.pts}</span>
                <div class="pts-bar-track"><div class="pts-bar-fill" style="width:${pct}%; background:${barColor};"></div></div>
              </div>
            </td>
          </tr>`;
      }).join('');
    }

    function renderResults() {
      document.getElementById('resultsList').innerHTML = DB.results.map(r => `
        <div class="result-item-card ${r.scec > r.opp ? 'res-v' : r.scec === r.opp ? 'res-e' : 'res-d'}">
          <div class="result-teams">
            <div class="result-row">
              <span style="display:flex; align-items:center; gap:8px;">${crestBadge('Santa Clara EC', '', 22)} Santa Clara EC</span>
              <span class="result-score">${r.scec}</span>
            </div>
            <div class="result-row">
              <span style="display:flex; align-items:center; gap:8px; color:var(--club-muted);">${crestBadge(r.oppName, r.oppLogo, 22)} ${r.oppName}</span>
              <span class="result-score" style="color:var(--club-muted);">${r.opp}</span>
            </div>
          </div>
          <div class="result-meta">
            <div>${r.comp}</div>
            <div style="color:var(--club-gold); font-weight:700;">${r.round}</div>
          </div>
        </div>
      `).join('');
    }

    function renderSquad(filter = 'TODOS') {
      const list = filter === 'TODOS' ? DB.players : DB.players.filter(p => p.pos === filter);
      const defaultPhoto = 'https://i.pinimg.com/474x/54/f4/b5/54f4b55a59ff9ddf2a2655c7f35e4356.jpg';
      document.getElementById('squadContainer').innerHTML = list.map(p => `
        <div class="player-card" onclick="openPlayerDetail(${p.id})">
          <div class="player-card-photo">
            <span class="player-badge-num">#${p.num}</span>
            <img src="${p.img || defaultPhoto}" alt="${p.name}" onerror="playerImgFail(this)" loading="lazy" decoding="async">
          </div>
          <div class="player-card-info">
            <span class="player-card-pos">${p.pos}</span>
            <div class="player-card-name">${p.name}</div>
            <span style="font-size:0.75rem; color:var(--club-muted);">${p.nick}</span>
          </div>
        </div>
      `).join('');
    }

    function filterSquad(pos, btn) {
      document.querySelectorAll('#squadFilters button').forEach(b => b.classList.remove('active'));
      (btn || document.querySelector('#squadFilters button')).classList.add('active');
      renderSquad(pos);
    }

    /* =========================================================
       5. INGRESSOS
       ========================================================= */
    let chosenTicketSector = 'VERDE';
    let ticketQty = 1;

    function initSeats() {
      renderTicketSectors();
    }

    const SECTOR_TAGS = { VERDE: '💚 Menor preço', ROXO: '♿ Setor de cadeirantes', AZUL: '', VISITANTE: '🚌 Torcida visitante', CAMAROTE: '🧭 Tour 2h antes' };
    const brl = v => 'R$ ' + Number(v).toFixed(2).replace('.', ',');
    function sectorCompareTable() {
      return `<details class="sector-compare"><summary>📊 Comparar todos os setores</summary><div class="sc-scroll"><table><thead><tr><th>Setor</th><th>Preço</th><th>Portão</th><th>Acesso</th><th>Destaque</th></tr></thead><tbody>${Object.entries(SECTOR_DATA).map(([k, x]) => `<tr class="${k === chosenTicketSector ? 'sc-active' : ''}"><td>${x.emoji} ${x.name.split(' — ')[0]}</td><td><strong>${brl(x.price)}</strong></td><td>${SECTOR_ACCESS[k].gate}</td><td>${SECTOR_ACCESS[k].via}</td><td>${SECTOR_TAGS[k] || 'Acesso geral'}</td></tr>`).join('')}</tbody></table></div></details>`;
    }
    function renderTicketSectors() {
      const grid = document.getElementById('ticketSectorsGrid');
      grid.innerHTML = Object.entries(SECTOR_DATA).map(([key, s]) => `
        <button type="button" class="ticket-sector-card ${key === chosenTicketSector ? 'active' : ''}" style="--sector-color:${s.color};" data-sector="${key}" onclick="selectTicketSector('${key}')">
          <span class="ticket-sector-emoji">${s.emoji}</span>
          <span class="ticket-sector-name">${s.name}</span>
          <span class="ticket-sector-price">${brl(s.price)}</span>
          ${SECTOR_TAGS[key] ? `<span class="sector-tag">${SECTOR_TAGS[key]}</span>` : ''}
          ${s.perk ? `<span class="ticket-sector-perk">${s.perk}</span>` : ''}
        </button>
      `).join('');
      document.getElementById('ticketCompare').innerHTML = sectorCompareTable();
      updateTicketSummary();
    }

    function selectTicketSector(key) {
      chosenTicketSector = key;
      document.querySelectorAll('.ticket-sector-card').forEach(b => b.classList.toggle('active', b.dataset.sector === key));
      document.getElementById('ticketCompare').innerHTML = sectorCompareTable();
      updateTicketSummary();
    }

    function changeTicketQty(delta) {
      ticketQty = Math.min(10, Math.max(1, ticketQty + delta));
      document.getElementById('ticketQtyDisplay').textContent = ticketQty;
      updateTicketSummary();
    }

    function updateTicketSummary() {
      const s = SECTOR_DATA[chosenTicketSector];
      document.getElementById('selectedSectorLabel').textContent = `${s.emoji} ${s.name}`;
      document.getElementById('totalTicketPrice').textContent = brl(s.price * ticketQty);
      const sub = document.getElementById('ticketTotalDetail'); if (sub) sub.textContent = `${ticketQty} × ${brl(s.price)} • ${SECTOR_ACCESS[chosenTicketSector].gate}` + (SECTOR_TAGS[chosenTicketSector] ? ' • ' + SECTOR_TAGS[chosenTicketSector] : '');
      const perkNote = document.getElementById('ticketSectorPerkNote');
      if (s.perk) { perkNote.style.display = 'block'; perkNote.textContent = s.perk; }
      else { perkNote.style.display = 'none'; }
    }

    function handleTicketCheckout(e) {
      e.preventDefault();
      const name = document.getElementById('ticketBuyerName').value;
      const s = SECTOR_DATA[chosenTicketSector];
      const hash = `SCEC-${Math.random().toString(36).substring(2, 9).toUpperCase()}-2026`;
      const hashes = [hash];
      for (let k = 1; k < ticketQty; k++) hashes.push(`SCEC-${Math.random().toString(36).substring(2, 9).toUpperCase()}-2026`);
      hashes.forEach(h => userSession.tickets.push({
        name, sector: chosenTicketSector, sectorName: `${s.emoji} ${s.name}`, gate: s.gate,
        quantity: 1, hash: h, date: new Date().toLocaleDateString('pt-BR'), match: (window.__tkMatch && window.__tkMatch.title) || VAJ_MATCH.title
      }));
      userSession.points += 50 * ticketQty;
      setStored('scec_user', userSession);
      document.getElementById('ticketOwnerName').textContent = name;
      { const _h = document.getElementById('eTicketTitle'); if (_h && window.__tkMatch) _h.textContent = window.__tkMatch.title + ' • ' + window.__tkMatch.label; }
      document.getElementById('ticketSectorLabel').textContent = `${s.emoji} ${s.name}`;
      document.getElementById('ticketQtyLabel').textContent = `${ticketQty} ${ticketQty > 1 ? 'ingressos' : 'ingresso'}`;
      document.getElementById('ticketGateLabel').textContent = s.gate;
      const perkRow = document.getElementById('ticketPerkRow');
      if (s.perk) { perkRow.style.display = 'block'; document.getElementById('ticketPerkText').textContent = s.perk; }
      else { perkRow.style.display = 'none'; }
      document.getElementById('ticketAuthHash').textContent = hashes.length > 1 ? `${hashes.length} códigos únicos (um por ingresso)` : hash;
      try { renderTicketValidation(s, hash); } catch (err) {}
      const qrW = document.getElementById('ticketQrWrapper');
      qrW.innerHTML = '';
      qrW.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:18px 0;width:100%';
      hashes.forEach((h, idx) => {
        const card = document.createElement('div'); card.className = 'qr-card'; card.setAttribute('data-qr', h);
        card.innerHTML = `<b>Ingresso ${idx + 1} de ${hashes.length}</b><div class="qr-box"></div><code>${h}</code><span class="qr-st">Aguardando validação</span><button type="button" class="btn-outline" onclick="simulateBiometric('${h}')">Validar este ingresso</button>`;
        qrW.appendChild(card); new QRCode(card.querySelector('.qr-box'), { text: h, width: 130, height: 130 });
      });
      document.getElementById('issuedTicketContainer').style.display = 'block';
      document.getElementById('issuedTicketContainer').scrollIntoView({ behavior: 'smooth' });
      updateFanBadges();
      alert('Ingresso emitido! IMPORTANTE: antes de entrar no estádio, vá ao Posto de Validação da cor do seu setor para fazer a validação biométrica.');
    }

    /* =========================================================
       6. LOJA & CARRINHO
       ========================================================= */
    function renderStore() {
      document.getElementById('storeContainer').innerHTML = DB.products.map(p => `
        <div class="product-card">
          <div class="product-thumb"><img src="${p.img}" alt="${p.name}" loading="lazy" decoding="async"></div>
          <div class="product-details">
            <div class="product-name">${p.name}</div>
            <div class="product-price">R$ ${p.price.toFixed(2)}</div>
            <button class="btn-primary" style="margin-top:12px; justify-content:center;" onclick="addToCart(${p.id})">Adicionar à Sacola</button>
          </div>
        </div>
      `).join('');
    }

    function addToCart(id) {
      const p = DB.products.find(x => x.id === id);
      userSession.cart.push(p);
      setStored('scec_user', userSession);
      updateFanBadges();
      alert(`${p.name} adicionado ao carrinho!`);
    }

    function renderCartModal() {
      const cont = document.getElementById('cartItemsContainer');
      if (!userSession.cart.length) {
        cont.innerHTML = '<p style="color:var(--club-muted); font-size:0.9rem;">Sua sacola está vazia.</p>';
        document.getElementById('cartTotalPrice').textContent = 'R$ 0,00';
        return;
      }
      let total = 0;
      cont.innerHTML = userSession.cart.map((item, idx) => {
        total += item.price;
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; background:var(--club-dark); padding:10px; border-radius:var(--radius-sm);">
            <div>
              <strong style="font-size:0.85rem;">${item.name}</strong>
              <div style="color:var(--club-gold); font-size:0.8rem;">R$ ${item.price.toFixed(2)}</div>
            </div>
            <button onclick="removeFromCart(${idx})" style="background:none; border:none; color:var(--club-accent); font-size:0.8rem; cursor:pointer;">Remover</button>
          </div>`;
      }).join('');
      document.getElementById('cartTotalPrice').textContent = `R$ ${total.toFixed(2)}`;
    }

    function removeFromCart(idx) {
      userSession.cart.splice(idx, 1);
      setStored('scec_user', userSession);
      renderCartModal();
      updateFanBadges();
    }

    function handleStoreCheckout() {
      if (!userSession.cart.length) return alert('Seu carrinho está vazio.');
      userSession.cart = [];
      userSession.points += 150;
      setStored('scec_user', userSession);
      closeModal('cartModal');
      updateFanBadges();
      alert('Pedido fictício realizado! Pontos SCEC creditados. A Matilha agradece!');
    }

    /* =========================================================
       7. HISTÓRIA & COMUNIDADE
       ========================================================= */
    function renderHistoryAndTrophies() {
      document.getElementById('timelineList').innerHTML = DB.timeline.map(t => `
        <div class="timeline-node">
          <div class="timeline-year">${t.year}</div>
          <strong style="font-size:0.95rem; display:block; margin:6px 0;">${t.title}</strong>
          <p style="color:var(--club-muted); font-size:0.8rem;">${t.desc}</p>
        </div>
      `).join('');

      const tl = document.getElementById('trophiesList');
      const total = DB.trophies.reduce((n, t) => n + (parseInt(t.count, 10) || 0), 0);
      let tt = document.getElementById('trophyTotal');
      if (!tt) { tt = document.createElement('div'); tt.id = 'trophyTotal'; tt.className = 'trophy-total'; tl.parentNode.insertBefore(tt, tl); }
      tt.innerHTML = total ? `<b>${total}</b><span>títulos e conquistas na história do Santa Clara</span>` : '';
      const cats=[...new Set(DB.trophies.map(t=>t.cat||'Outros'))];
      const card=t=>`<div class="tr-card"><div class="tr-stage">${t.img?`<img loading="lazy" decoding="async" src="${t.img}" alt="${t.name}" referrerpolicy="no-referrer" onerror="trophyFail(this)">`:`<div class="trophy-medal"><svg class="icon" aria-hidden="true"><use href="#i-trophy"></use></svg></div>`}<span class="tr-badge">${t.count}</span></div><div class="tr-body"><strong>${t.name}</strong><div class="tr-years">${String(t.year).split(',').map(y=>`<span>${y.trim()}</span>`).join('')}</div></div></div>`;
      const draw=f=>{tl.className='';tl.innerHTML=cats.filter(c=>f==='Todos'||f===c).map(c=>{const L=DB.trophies.filter(t=>(t.cat||'Outros')===c);const n=L.reduce((a,t)=>a+(parseInt(t.count,10)||0),0);return `<div class="tr-group"><h5>${c}<small>${n} título${n>1?'s':''}</small></h5><div class="tr-grid">${L.map(card).join('')}</div></div>`}).join('');
        document.querySelectorAll('.tr-chip').forEach(x=>x.classList.toggle('on',x.dataset.c===f));};
      let fl=document.getElementById('trFilters');
      if(!fl){fl=document.createElement('div');fl.id='trFilters';fl.className='tr-filters';tl.parentNode.insertBefore(fl,tl);}
      fl.innerHTML=['Todos',...cats].map(c=>`<button type="button" class="tr-chip" data-c="${c}">${c}</button>`).join('');
      fl.onclick=e=>{const b=e.target.closest('.tr-chip');if(b)draw(b.dataset.c)};
      draw('Todos');
    }

    function renderBoardAndStaff() {
      const card = m => `
        <div class="staff-card">
          ${m.photo ? `<img loading="lazy" decoding="async" class="staff-photo" src="${m.photo}" alt="${m.name}" data-ini="${staffInitials(m.name)}" onerror="staffPhotoFail(this)">` : `<div class="staff-photo-placeholder staff-mono" style="--h:${staffHue(m.name)}">${staffInitials(m.name)}</div>`}
          <div class="staff-name">${m.name}</div>
          <div class="staff-role">${m.role}</div>
          ${m.bio ? `<div class="staff-bio">${m.bio}</div>` : ''}
        </div>`;
      document.getElementById('boardList').innerHTML = DB.board.map(card).join('');
      document.getElementById('staffList').innerHTML = DB.technicalStaff.map(card).join('');
      document.getElementById('safInfoText').textContent = DB.safInfo;
    }

    function staffInitials(n) {
      const p = String(n || '').replace(/["“”]/g, '').split(/\s+/).filter(w => w.length > 2 || /^[A-ZÀ-Ú]/.test(w));
      return ((p[0] || '?')[0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
    }
    function staffHue(n) { let h = 0; String(n || '').split('').forEach(c => { h = (h * 31 + c.charCodeAt(0)) % 360; }); return h; }
    function staffPhotoFail(img) {
      const d = document.createElement('div'); d.className = 'staff-photo-placeholder staff-mono';
      d.style.setProperty('--h', staffHue(img.alt)); d.textContent = img.dataset.ini || '?'; img.replaceWith(d);
    }
    function renderGates() {
      document.getElementById('gatesList').innerHTML = DB.gates.map(g => {
        const s = SECTOR_DATA[g.sector];
        const color = s ? s.color : 'var(--club-accent)';
        return `
        <div class="gate-card" style="--sector-color:${color};">
          ${g.img ? `<img loading="lazy" decoding="async" class="gate-photo" src="${g.img}" alt="${g.name}" onerror="this.outerHTML='<div class=\\'gate-photo-placeholder\\'>${s ? s.emoji : '🚪'}</div>';">` : `<div class="gate-photo-placeholder">${s ? s.emoji : '🚪'}</div>`}
          <div>
            <div class="gate-name">${g.name}</div>
            <div class="gate-desc">${g.desc}</div>
          </div>
        </div>`;
      }).join('');
    }

    function renderStatsPanels() {
      const topScorers = [...DB.players].sort((a, b) => b.goals - a.goals).slice(0, 5);
      const maxG = Math.max(1, ...topScorers.map(p => p.goals || 0));
      document.getElementById('statsTopScorers').innerHTML = topScorers.map((p, i) => `
        <div class="stats-row ${i === 0 ? 'lead' : ''}" style="--w:${Math.round((p.goals || 0) / maxG * 100)}%"><span class="stats-rank">${i + 1}º</span><span class="stats-name">${p.name}</span><span class="stats-value">${p.goals} gols</span></div>
      `).join('');

      const maxC = Math.max(1, ...DB.cardsRanking.map(c => (c.yellow || 0) + (c.red || 0) * 2));
      document.getElementById('statsCards').innerHTML = DB.cardsRanking.map((c, i) => `
        <div class="stats-row ${i === 0 ? 'lead' : ''}" style="--w:${Math.round(((c.yellow || 0) + (c.red || 0) * 2) / maxC * 100)}%"><span class="stats-rank">${i + 1}º</span><span class="stats-name">${c.name}</span><span class="stats-value"><span class="card-chip yellow"></span>${c.yellow} ${c.red ? `<span class="card-chip red"></span>${c.red}` : ''}</span></div>
      `).join('');
    }

    function renderBroadcast() {
      document.getElementById('broadcastList').innerHTML = DB.broadcast.map(b => `
        <div class="sponsor-card">
          <div class="sponsor-header">
            ${b.logo
              ? `<img loading="lazy" decoding="async" src="${b.logo}" alt="${b.name}" class="sponsor-logo" onerror="this.outerHTML='<span class=\\'sponsor-logo-placeholder\\'>${b.icon}</span>';">`
              : `<span class="sponsor-logo-placeholder"><svg class="icon" style="width:1.4em;height:1.4em;"><use href="#i-image"></use></svg></span>`}
            <div>
              <div class="sponsor-tier">${b.tier}</div>
              <div class="sponsor-name">${b.name}</div>
            </div>
          </div>
          <p class="sponsor-desc">${b.desc}</p>
        </div>
      `).join('');
    }

    function renderRegulation() {
      const goal = r => /acesso|acesse|m[óo]dulo i\b|promo/i.test(r.title);
      document.getElementById('regulationList').innerHTML = `
        <div class="reg-points" aria-label="Sistema de pontos">
          <span><b>3</b> vitória</span><span><b>1</b> empate</span><span><b>0</b> derrota</span>
        </div>` + DB.regulation.map((r, i) => `
        <div class="regulation-item${goal(r) ? ' goal' : ''}">
          <div class="regulation-num">${String(i + 1).padStart(2, '0')}</div>
          <div class="reg-body"><strong>${r.title}</strong><span>${r.desc}</span></div>
        </div>
      `).join('');
    }

    /* =========================================================
       GUIA DE ACESSO AO ESTÁDIO
       ========================================================= */
    const GUIDE_SERVICES = ['Bilheteria', 'Central de Validação', 'Alimentação', 'Bebidas', 'Banheiros', 'Loja do Santa Clara', 'Informações'];
    const GUIDE_PARKING = [
      { img: 'JcqkMPo', cap: 'Vista superior do estacionamento.' },
      { img: 'KmPhRmu', cap: 'Entrada do estacionamento com identificação do clube.' },
      { img: 'vJgzTAP', cap: 'Vista de drone do estacionamento.' },
      { img: 'J2eBMhJ', cap: 'Saída do estádio.' }
    ];
    const GUIDE_PREMIUM = [{ img: 'hIVlRqh', cap: 'Torcedores da área premium acompanham a movimentação pré-jogo, perto da chegada dos jogadores.' }];
    const GUIDE_SECURITY = [{ img: 'Zolqa5m', cap: 'Postos de atendimento médico, base policial e apoio ao torcedor na esplanada.' }];
    const GUIDE_SECTORS = {
      VERDE: { label: 'Setor Verde', color: '#2e9e4f', final: 'Você chegou ao Setor Verde!', steps: [
        { img: 'FLZEaoB', title: 'Entrada da Esplanada', text: 'Entrada da esplanada do Setor Verde.' },
        { img: 'iUmgtaQ', title: 'Caminho até o Setor', text: 'Caminho até o Setor Verde.' },
        { img: '3C3rr7M', title: 'Para Onde Ir', text: 'Vista aérea indicando o caminho até o Setor Verde.' },
        { img: 'm9bP6DY', title: 'Chegando pelo Estacionamento', text: 'Torcedores que chegam pelo estacionamento devem seguir por este caminho até o acesso do Setor Verde.' },
        { img: '4GIyza2', title: 'Catracas', text: 'Apresente seu ingresso e passe pela catraca.' },
        { img: 'RlFs9By', title: '🐺 Túnel do Lobo', text: 'Entrada do Túnel do Lobo.' },
        { img: 'KdTVTck', title: 'Revista e Segurança', text: 'Centro de revista e detector de metais.' },
        { img: '9GQLqTH', title: 'Escadaria', text: 'Escadaria de acesso à arquibancada.' },
        { img: 'RRc15yZ', title: 'Visão do Setor', text: 'Visão do Setor Verde.' },
        { img: 'aO6GzGP', title: 'Chegando à Arquibancada', text: 'Vista da escadaria pelo interior do estádio.' }
      ]},
      ROXO: { label: 'Setor Roxo', color: '#8b5cc7', final: 'Bem-vindo ao Setor Roxo.', steps: [
        { img: '5j2IloL', title: 'Caminho até o Setor', text: 'Caminho da esplanada até o setor.' },
        { img: '11yt0Cr', title: 'Portão de Acesso', text: 'Portão de acesso à esplanada.' },
        { img: 'WGRNzzX', title: 'Para Onde Ir', text: 'Vista aérea indicando o caminho.' },
        { img: 'P8ibpae', title: 'Entrada do Setor', text: 'Entrada do Setor Roxo.' },
        { img: 'N1Nu5RS', title: 'Catracas', text: 'Apresente seu ingresso e passe pela catraca.' },
        { img: 'Unso0re', title: 'Primeira Visão', text: 'Primeira visão do estádio.' },
        { img: 'XooREH0', title: 'Vista do Campo', text: 'Vista do campo a partir do Setor Roxo.' }
      ]},
      AZUL: { label: 'Setor Azul', color: '#3b82c4', final: 'Você chegou ao Setor Azul.', steps: [
        { img: '04b56sp', title: 'Para Onde Ir', text: 'Vista aérea indicando o caminho.' },
        { img: 'hkEqMb2', title: 'Aproximando do Setor', text: 'Vista mais próxima do caminho.' },
        { img: 'zwFV4o0', title: 'Entrada do Setor', text: 'Entrada do Setor Azul.' },
        { img: 'EZgFBjh', title: 'Catracas', text: 'Apresente seu ingresso e passe pela catraca.' },
        { img: 'TO91Mxg', title: 'Primeira Visão', text: 'Primeira visão do estádio.' },
        { img: 'F4tk1Se', title: 'Vista do Campo', text: 'Vista do campo a partir do Setor Azul.' },
        { img: 'gTtN76u', title: 'Área de Acesso', text: 'Vista superior da área de acesso.' }
      ]},
      AMARELO: { label: 'Setor Amarelo', color: '#d4b23c', final: 'Você chegou ao Setor Amarelo.', steps: [
        { img: 'e8Ha3o4', title: 'Acesso Visto da Rua', text: 'Acesso à esplanada visto da rua.' },
        { img: '0oyrbjB', title: 'Portão de Acesso', text: 'Portão de acesso à esplanada.' },
        { img: 'BluSrC2', title: 'Acesso ao Estádio', text: 'Vista do acesso ao estádio.' },
        { img: 'NlQI8HH', title: 'Catracas', text: 'Apresente seu ingresso e passe pela catraca.' },
        { img: 'JJx3Rve', title: 'Primeira Visão', text: 'Primeira visão do estádio.' },
        { img: 'SvKkFcz', title: 'Vista do Campo', text: 'Vista do campo a partir do Setor Amarelo.' },
        { img: 'W7CxIzE', title: 'Para Onde Ir', text: 'Vista superior da área para onde o torcedor deve ir.' }
      ]},
      CAMAROTE: { label: 'Camarote / Área Premium', color: '#a0622e', final: 'Bem-vindo à experiência Camarote.', steps: [
        { img: 'HADYdZh', title: 'Acesso pelo Estacionamento', text: 'Acesso ao camarote pelo estacionamento.' },
        { img: 'nv6NPEi', title: 'Estacionamento Exclusivo', text: 'Estacionamento exclusivo do camarote.' },
        { img: 'CuYs8Yi', title: 'Túnel e Catracas', text: 'Túnel do estacionamento até as catracas do camarote.' },
        { img: '4uTQGm2', title: 'Escadaria / Corredor', text: 'Escadaria e corredor de acesso.' },
        { img: 'tx5ochE', title: 'Entrada do Setor Premium', text: 'Entrada do setor premium.' },
        { img: '82U6Cyy', title: 'Cadeiras', text: 'Cadeiras do camarote.' },
        { img: 'AMJDcF8', title: 'Vista do Campo', text: 'Vista do campo a partir do camarote.' }
      ]}
    };
    let guideCurrentSector = null, guideCurrentStep = 0;

    function imgurFallback(img) {
      const exts = ['jpeg', 'png', 'webp', 'gif'];
      const n = parseInt(img.dataset.tried || '0', 10);
      if (n < exts.length) {
        img.dataset.tried = n + 1;
        img.src = `https://i.imgur.com/${img.dataset.id}.${exts[n]}`;
      } else {
        const cap = img.dataset.cap || 'Foto indisponível no momento';
        const wrap = img.closest('.guide-photo-wrap, .guide-photo-card');
        if (wrap) wrap.innerHTML = `<div class="guide-photo-placeholder"><svg class="icon" style="width:2em;height:2em;"><use href="#i-image"></use></svg><span>${cap}</span></div>`;
      }
    }

    /* Esplanada: status ao vivo, serviços com ícones e tour com próximo horário em destaque */
    function renderEsplanada() {
      const host = document.getElementById('vajEsplanada'); if (!host) return;
      const D = (window.EDITAR && EDITAR.ESPLANADA) || {};
      const toMin = t => { const p = String(t || '').split(':'); return (+p[0]) * 60 + (+p[1] || 0); };
      const now = new Date(), nowMin = now.getHours() * 60 + now.getMinutes();
      const open = toMin(D.abre || '08:00'), close = toMin(D.fecha || '21:00');
      const isOpen = nowMin >= open && nowMin < close;
      const status = isOpen ? `Aberta agora • fecha às ${D.fecha}` : (nowMin < open ? `Fechada • abre às ${D.abre}` : `Fechada • abre amanhã às ${D.abre}`);
      const ico = n => `<svg class="icon" aria-hidden="true"><use href="#i-${String(n || 'pin').replace(/[^a-z-]/g, '')}"></use></svg>`;
      const safe = t => String(t == null ? '' : t).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
      const tours = D.tourHorarios || [];
      const next = tours.find(t => toMin(t) > nowMin);
      host.className = 'esp-wrap';
      host.innerHTML = `
        <div class="esp-head">
          <div><span class="esp-kicker">${safe(D.dias || 'Todos os dias')}</span><strong class="esp-hours">${safe(D.abre)} às ${safe(D.fecha)}</strong></div>
          <span class="esp-status ${isOpen ? 'on' : 'off'}">${ico('clock')} ${status}</span>
        </div>
        <div class="esp-services">${(D.servicos || []).map(x => `<div class="esp-svc">${ico(x.icone)}<div><b>${safe(x.nome)}</b><span>${safe(x.desc)}</span></div></div>`).join('')}</div>
        <div class="esp-tour">
          <div class="esp-tour-head"><strong>Tour Toca do Lobo</strong><span>${next ? 'Próximo tour hoje: ' + next : 'Sem mais tours hoje'}</span></div>
          <div class="esp-times">${tours.map(t => `<span class="${t === next ? 'next' : (toMin(t) <= nowMin ? 'past' : '')}">${safe(t)}</span>`).join('')}</div>
          <p>Nos dias de jogo, horários reduzidos ou suspensos. <strong>Camarote:</strong> tour pelos bastidores 2h antes das partidas, com vestiários e mais.</p>
          <div class="esp-areas">${(D.tourAreas || []).map(a => `<span>${safe(a)}</span>`).join('')}</div>
        </div>`;
    }

    function guideImg(id, cap) {
      const safe = cap.replace(/"/g, '&quot;');
      const js = cap.replace(/'/g, "\\'");
      return `<img src="https://i.imgur.com/${id}.jpg" data-id="${id}" data-tried="0" data-cap="${safe}" onerror="imgurFallback(this)" loading="lazy" alt="${safe}" onclick="openLightbox('https://i.imgur.com/${id}.jpg','${js}')">`;
    }

    function renderGuideStatic() {
      document.getElementById('guideServiceGrid').innerHTML = GUIDE_SERVICES.map(s => `
        <div class="guide-service-card"><svg class="icon" style="width:1.6em;height:1.6em;color:var(--club-accent);"><use href="#i-pin"></use></svg>${s}</div>
      `).join('');
      document.getElementById('guideParkingGrid').innerHTML = GUIDE_PARKING.map(p => `<figure class="guide-photo-card">${guideImg(p.img, p.cap)}<figcaption>${p.cap}</figcaption></figure>`).join('');
      document.getElementById('guidePremiumGrid').innerHTML = GUIDE_PREMIUM.map(p => `<figure class="guide-photo-card">${guideImg(p.img, p.cap)}<figcaption>${p.cap}</figcaption></figure>`).join('');
      document.getElementById('guideSecurityGrid').innerHTML = GUIDE_SECURITY.map(p => `<figure class="guide-photo-card">${guideImg(p.img, p.cap)}<figcaption>${p.cap}</figcaption></figure>`).join('');
      document.getElementById('guideSectorGrid').innerHTML = Object.entries(GUIDE_SECTORS).map(([key, sec]) => `
        <div class="guide-sector-card" style="--sc-color:${sec.color};" onclick="openGuideSector('${key}')">
          <div class="guide-sector-dot"></div>
          <strong>${sec.label}</strong>
          <span>${sec.steps.length} passos</span>
        </div>
      `).join('');
    }

    function openGuideSector(key) {
      guideCurrentSector = key;
      guideCurrentStep = 0;
      renderGuideStep();
      openModal('guideStepperModal');
    }

    function backToSectorSelect() {
      closeModal('guideStepperModal');
      document.getElementById('guia-acesso').scrollIntoView({ behavior: 'smooth' });
    }

    function renderGuideStep() {
      const sec = GUIDE_SECTORS[guideCurrentSector];
      const step = sec.steps[guideCurrentStep];
      const isLast = guideCurrentStep === sec.steps.length - 1;
      document.getElementById('guideBreadcrumbSector').textContent = sec.label;
      document.getElementById('guideProgress').innerHTML = sec.steps.map((_, i) => `<span class="${i <= guideCurrentStep ? 'done' : ''}"></span>`).join('');
      document.getElementById('guidePhotoWrap').innerHTML = guideImg(step.img, step.title);
      document.getElementById('guideStepTitle').textContent = `Passo ${guideCurrentStep + 1} de ${sec.steps.length} — ${step.title}`;
      document.getElementById('guideStepText').textContent = isLast ? `${step.text} ${sec.final}` : step.text;
      document.getElementById('guidePrevBtn').disabled = guideCurrentStep === 0;
      document.getElementById('guideNextBtn').textContent = isLast ? 'Concluir ✓' : 'Próximo ›';
    }

    function nextGuideStep() {
      const sec = GUIDE_SECTORS[guideCurrentSector];
      if (guideCurrentStep < sec.steps.length - 1) { guideCurrentStep++; renderGuideStep(); }
      else { backToSectorSelect(); }
    }

    function prevGuideStep() {
      if (guideCurrentStep > 0) { guideCurrentStep--; renderGuideStep(); }
    }

    function openLightbox(src, caption) {
      document.getElementById('lightboxImg').src = src;
      document.getElementById('lightboxCaption').textContent = caption || '';
      openModal('lightboxModal');
    }

    function renderSocialProjects() {
      const projects = [
        { title: 'Futebol nas Vilas do Vale', meta: 'R$ 18.000', arrecadado: '78%', desc: 'Aulas e materiais esportivos para 120 crianças das comunidades do Vale do Jequitinhonha.' },
        { title: 'Campanha do Agasalho — A Matilha Aquece', meta: '1.800 Peças', arrecadado: '89%', desc: 'Arrecadação de agasalhos para famílias do Vale durante o período de seca.' }
      ];
      document.getElementById('socialCampaignsList').innerHTML = projects.map(p => `
        <div style="background:var(--club-card); border:1px solid var(--club-border); border-radius:var(--radius-md); padding:24px;">
          <span class="news-tag" style="background:var(--club-brown); position:static; display:inline-block; margin-bottom:10px;">Projeto Social</span>
          <h4 style="font-size:1.1rem; margin-bottom:8px;">${p.title}</h4>
          <p style="color:var(--club-muted); font-size:0.85rem; margin-bottom:16px;">${p.desc}</p>
          <div class="stat-bar-label"><span>Meta Atingida</span><span>${p.arrecadado}</span></div>
          <div class="bar-track" style="margin:6px 0 16px;"><div class="bar-fill" style="width:${p.arrecadado};"></div></div>
          <button class="btn-outline" style="width:100%;" onclick="alert('Inscrição de voluntário registrada! A Matilha agradece.')">Quero Ser Voluntário</button>
        </div>
      `).join('');
    }

    function renderSponsors() {
      document.getElementById('sponsorsList').innerHTML = DB.sponsors.map((s, i) => `
        <div class="sponsor-card${/master/i.test(s.tier) ? ' master' : ''}">
          <div class="sponsor-header">
            ${s.logo
              ? `<img loading="lazy" decoding="async" src="${s.logo}" alt="Logo ${s.name}" class="sponsor-logo" data-base="${s.logo.replace(/\.(png|jpe?g|webp|gif)$/i, '')}" data-exts="jpg,jpeg,webp,gif" data-ini="${s.icon || ''}" onerror="sponsorLogoFail(this)">`
              : `<span class="sponsor-logo-placeholder">${s.icon || ''}</span>`}
            <div>
              <div class="sponsor-tier">${s.tier}</div>
              <div class="sponsor-name">${s.name}</div>
            </div>
          </div>
          <p class="sponsor-desc">${s.desc}</p>
          ${s.url ? `<a class="sponsor-link" href="${s.url}" target="_blank" rel="noopener noreferrer">Visitar Site ↗</a>` : ''}
        </div>
      `).join('') + `
        <div class="sponsor-card sponsor-cta">
          <strong>Sua marca no Terror do Vale</strong>
          <p class="sponsor-desc">Apoie o clube, fale com a Matilha e apareça nos jogos, nas transmissões e no site oficial.</p>
          <a class="sponsor-link" href="#comunidade">Quero ser parceiro</a>
        </div>`;
    }

    /* =========================================================
       PAINEL DE PERSONALIZAÇÃO (preços, escudos, fotos)
       ========================================================= */
    const SITE_SETTINGS_KEY = 'scec_custom_settings';

    function loadSiteSettings() {
      const s = getStored(SITE_SETTINGS_KEY, {});
      if (s.sectorPrices) Object.keys(s.sectorPrices).forEach(k => { if (SECTOR_DATA[k]) SECTOR_DATA[k].price = Number(s.sectorPrices[k]) || SECTOR_DATA[k].price; });
      if (s.clubCrestUrl !== undefined) CLUB_CREST_URL = s.clubCrestUrl;
      if (s.teamLogos) {
        DB.standings.forEach(t => { if (s.teamLogos[t.name] !== undefined) t.logo = s.teamLogos[t.name]; });
        DB.results.forEach(r => { if (s.teamLogos[r.oppName] !== undefined) r.oppLogo = s.teamLogos[r.oppName]; });
      }
      if (s.playerPhotos) DB.players.forEach(p => { if (s.playerPhotos[p.id] !== undefined) p.img = s.playerPhotos[p.id]; });
    }

    function renderAdminPrecosTab() {
      return Object.entries(SECTOR_DATA).map(([key, s]) => `
        <div class="form-group admin-price-row">
          <label>${s.emoji} ${s.name}</label>
          <div class="admin-price-input-wrap">
            <span>R$</span>
            <input type="number" min="0" step="0.01" class="form-control admin-price-input" data-sector="${key}" value="${s.price}">
          </div>
        </div>
      `).join('');
    }

    function renderAdminEscudoTab() {
      return `
        <div class="form-group">
          <label>URL do escudo do Santa Clara EC</label>
          <input type="text" id="adminClubCrestInput" class="form-control" placeholder="https://i.imgur.com/XXXXX.png" value="${CLUB_CREST_URL || ''}">
        </div>
        <p style="font-size:0.78rem; color:var(--club-muted);">Aceita um link direto de imagem (terminado em .png, .jpg etc.) ou um link comum do Imgur (ex.: https://imgur.com/XXXXX) — o site tenta converter sozinho. Deixe em branco para usar o brasão de texto "SCEC".</p>
      `;
    }

    function renderAdminTimesTab() {
      return DB.standings.map(t => `
        <div class="form-group admin-team-row">
          ${crestBadge(t.name, t.logo, 36)}
          <div>
            <label>${t.name}</label>
            <input type="text" class="form-control admin-team-logo-input" data-team="${t.name}" placeholder="URL do escudo" value="${t.logo || ''}">
          </div>
        </div>
      `).join('');
    }

    function renderAdminJogadoresTab() {
      const defaultPhoto = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=100&auto=format&fit=crop';
      return DB.players.map(p => `
        <div class="form-group admin-team-row">
          <img class="admin-crest-preview" src="${p.img || defaultPhoto}" alt="${p.name}" onerror="this.src='${defaultPhoto}'" loading="lazy" decoding="async">
          <div>
            <label>#${p.num} ${p.name}</label>
            <input type="text" class="form-control admin-player-photo-input" data-player="${p.id}" placeholder="URL da foto" value="${p.img || ''}">
          </div>
        </div>
      `).join('');
    }

    function openAdminPanel() {
      document.getElementById('adminTabPrecos').innerHTML = renderAdminPrecosTab();
      document.getElementById('adminTabEscudo').innerHTML = renderAdminEscudoTab();
      document.getElementById('adminTabTimes').innerHTML = renderAdminTimesTab();
      document.getElementById('adminTabJogadores').innerHTML = renderAdminJogadoresTab();
      openModal('adminModal');
    }

    function showAdminTab(tab, btn) {
      document.querySelectorAll('#adminTabs .admin-sidebar-btn').forEach(b => b.classList.remove('active'));
      (btn || document.querySelector('#adminTabs .admin-sidebar-btn')).classList.add('active');
      document.querySelectorAll('.admin-tab-panel').forEach(p => p.style.display = 'none');
      document.getElementById('adminTab' + tab).style.display = 'block';
    }

    function applySiteSettings(s) {
      Object.keys(s.sectorPrices || {}).forEach(k => { if (SECTOR_DATA[k]) SECTOR_DATA[k].price = s.sectorPrices[k]; });
      CLUB_CREST_URL = s.clubCrestUrl !== undefined ? s.clubCrestUrl : CLUB_CREST_URL;
      Object.keys(s.teamLogos || {}).forEach(name => {
        const logo = s.teamLogos[name];
        const st = DB.standings.find(t => t.name === name);
        if (st) st.logo = logo;
        DB.results.forEach(r => { if (r.oppName === name) r.oppLogo = logo; });
      });
      Object.keys(s.playerPhotos || {}).forEach(id => {
        const p = DB.players.find(x => x.id === Number(id));
        if (p) p.img = s.playerPhotos[id];
      });

      applyClubCrestToDOM();
      renderStandings();
      renderResults();
      renderSquad();
      renderTicketSectors();
    }

    function saveSiteSettings() {
      const sectorPrices = {};
      document.querySelectorAll('.admin-price-input').forEach(inp => { sectorPrices[inp.dataset.sector] = parseFloat(inp.value) || 0; });

      const _crestEl = document.getElementById('adminClubCrestInput'); const clubCrestUrl = _crestEl ? (_crestEl.value || '').trim() : '';

      const teamLogos = {};
      document.querySelectorAll('.admin-team-logo-input').forEach(inp => { teamLogos[inp.dataset.team] = inp.value.trim(); });

      const playerPhotos = {};
      document.querySelectorAll('.admin-player-photo-input').forEach(inp => { playerPhotos[inp.dataset.player] = inp.value.trim(); });

      const settings = { sectorPrices, clubCrestUrl, teamLogos, playerPhotos };
      setStored(SITE_SETTINGS_KEY, settings);
      applySiteSettings(settings);
      closeModal('adminModal');
      showAdminToast('✅ Alterações salvas com sucesso!');
    }

    function showAdminToast(msg) {
      const t = document.getElementById('adminToast');
      t.textContent = msg;
      t.classList.add('show');
      clearTimeout(t._timer);
      t._timer = setTimeout(() => t.classList.remove('show'), 3200);
    }

    function resetSiteSettings() {
      if (!confirm('Restaurar preços, escudos e fotos para os valores padrão do site?')) return;
      localStorage.removeItem(SITE_SETTINGS_KEY);
      location.reload();
    }

    /* =========================================================
       8. MODAIS, BUSCA, MAS CLUBE & ESTÁDIO
       ========================================================= */
    var _modalOpener = null;
    function openModal(id) {
      const m = document.getElementById(id); if (!m) return;
      _modalOpener = document.activeElement;
      m.classList.add('active'); m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
      document.body.style.overflow = 'hidden';
      const f = m.querySelector('input,textarea,button.modal-close'); if (f) setTimeout(() => f.focus({ preventScroll: true }), 50);
    }
    function closeModal(id) {
      const m = document.getElementById(id); if (!m) return;
      m.classList.remove('active');
      if (!document.querySelector('.modal-overlay.active')) {
        document.body.style.overflow = '';
        if (_modalOpener && _modalOpener.focus) { try { _modalOpener.focus({ preventScroll: true }); } catch (e) {} }
      }
    }

    const SECTOR_DATA = {
      VERDE:     { emoji: '🟢', color: '#2e9e4f', name: 'Setor Verde — Terror do Vale',   desc: 'O coração da Matilha. O setor pode ser alcançado pela esplanada ou pelo estacionamento destinado aos setores Verde e Roxo. A entrada final da torcida popular ocorre pelo Túnel do Lobo. Bandeirões, cânticos e a maior barulheira da Toca.', price: 20,  gate: 'Portão B — Setor Verde' },
      ROXO:      { emoji: '🟣', color: '#8b5cc7', name: 'Setor Roxo — Intermediário',      desc: 'Posição privilegiada com excelente visibilidade. A alternativa ideal entre o setor popular e as áreas premium. Este é também o setor de cadeirantes: com acessibilidade completa e entrada separada pelo estacionamento.', price: 45,  gate: 'Portão A — Setor Roxo' },
      AZUL:      { emoji: '🔵', color: '#3b82c4', name: 'Setor Azul — Acesso Portão D',    desc: 'Arquibancada principal do estádio com acesso pelo Portão D. Boa visão lateral do campo.', price: 55,  gate: 'Portão D — Setor Azul' },
      VISITANTE: { emoji: '🟡', color: '#d4b23c', name: 'Setor Amarelo — Visitante',       desc: 'Setor exclusivo da torcida visitante. Acesso separado pelo Portão C. Totalmente controlado.', price: 45,  gate: 'Portão C — Visitante' },
      CAMAROTE:  { emoji: '🟤', color: '#a0622e', name: 'Camarotes Premium',               desc: 'Nível máximo de conforto, com serviço exclusivo para empresas, parceiros e convidados. Quem adquire o camarote ganha uma vaga garantida no estacionamento exclusivo do estádio e pode fazer um tour pelos bastidores da Toca do Lobo 2 horas antes das partidas, conhecendo os vestiários, o túnel dos jogadores e mais.', price: 150, gate: 'Portão VIP — Camarotes', perk: 'Vaga exclusiva inclusa + tour pelos bastidores 2h antes da partida' }
    };

    let currentStadiumSector = 'VERDE';

    function showSectorInfo(sector) {
      currentStadiumSector = sector;
      document.querySelectorAll('.sector-btn').forEach(b => b.classList.toggle('active', (b.getAttribute('onclick') || '').includes("'" + sector + "'")));
      const s = SECTOR_DATA[sector], acc = SECTOR_ACCESS[sector];
      const title = document.getElementById('sectorNameTitle');
      title.textContent = `${s.emoji} ${s.name}`;
      title.style.color = s.color;
      document.getElementById('sectorDescText').textContent = s.desc;
      document.getElementById('sectorPriceLabel').textContent = brl(s.price);
      const chips = [`🚪 ${acc.gate}`, `🅿️ ${acc.via}`, SECTOR_TAGS[sector]].filter(Boolean);
      document.getElementById('sectorChips').innerHTML = chips.map(c => `<span class="sector-tag" style="--sector-color:${s.color}">${c}</span>`).join('');
    }

    function goSection(id) { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
    const NC = 'Não cadastrado';
    const nc = v => (v === undefined || v === null || v === '') ? NC : v;
    const PLAYER_FIELDS = {
      'Identificação': [['apelido','Apelido'],['subpos','Subposição'],['nasc','Nascimento'],['cidade','Cidade natal'],['nacionalidade','Nacionalidade'],['altura','Altura'],['peso','Peso'],['pe','Pé dominante']],
      'Temporada': [['titular','Titularidades'],['reserva','Reservas'],['minutos','Minutos'],['assist','Assistências'],['final','Finalizações'],['finalAlvo','No alvo'],['passes','Passes'],['passesOk','Passes certos'],['cruz','Cruzamentos'],['desarmes','Desarmes'],['inter','Interceptações'],['faltas','Faltas'],['amarelos','Amarelos'],['vermelhos','Vermelhos'],['penaltis','Pênaltis'],['contra','Gols contra']],
      'Contrato': [['chegada','Chegada'],['fim','Fim do contrato'],['situacao','Situação'],['salario','Salário'],['bonus','Bônus'],['multa','Multa'],['empresario','Empresário'],['mercado','Valor de mercado']],
      'História': [['clubes','Clubes anteriores'],['jogosClube','Jogos por clube'],['golsClube','Gols por clube'],['titulos','Títulos'],['premios','Prêmios'],['jogosScec','Jogos pelo SCEC'],['golsScec','Gols pelo SCEC'],['assistScec','Assistências pelo SCEC']]
    };
    function playerField(p, k) {
      if (k === 'apelido') return p.nick;
      if (k === 'jogosScec') return p.games;
      if (k === 'golsScec') return p.goals;
      return p.extra && p.extra[k];
    }
    function showPlayerTab(id, tab) {
      const p = DB.players.find(x => x.id === id);
      document.querySelectorAll('#pTabs button').forEach(b => b.classList.toggle('active', b.dataset.t === tab));
      let rows = tab === 'Perfil'
        ? [['Idade', p.age + ' anos'], ['Partidas', p.games], ['Gols', p.goals], ['Características', nc(p.extra && p.extra.caract)], ['Estilo de jogo', nc(p.extra && p.extra.estilo)], ['Curiosidade', nc(p.extra && p.extra.curiosidade)]]
        : PLAYER_FIELDS[tab].map(([k, l]) => [l, nc(playerField(p, k))]);
      document.getElementById('pTabBody').innerHTML = rows.map(([l, v]) => `<div>${l}: <strong${v === NC ? ' style="opacity:.55;font-weight:500"' : ''}>${v}</strong></div>`).join('');
    }
    function openPlayerDetail(id) {
      const p = DB.players.find(x => x.id === id);
      const defaultPhoto = 'https://i.pinimg.com/474x/54/f4/b5/54f4b55a59ff9ddf2a2655c7f35e4356.jpg';
      const tabs = ['Perfil', ...Object.keys(PLAYER_FIELDS)];
      document.getElementById('genericModalContent').innerHTML = `
        <span class="news-tag" style="background:var(--club-gold); color:black; position:static; display:inline-block; margin-bottom:12px;">Atleta Oficial</span>
        <div style="display:flex; gap:14px; align-items:center;">
          <img src="${p.img || defaultPhoto}" alt="${p.name}" onerror="playerImgFail(this)" style="width:96px;height:96px;object-fit:cover;border-radius:var(--radius-sm);" loading="lazy" decoding="async">
          <div><h3 style="font-family:var(--font-display); font-size:1.8rem; margin:0;">${p.name} #${p.num}</h3>
          <p style="color:var(--club-accent); font-weight:800; font-size:0.85rem; margin:4px 0 0;">${p.pos} • "${p.nick}"</p></div>
        </div>
        <p style="margin:14px 0; font-size:0.9rem; color:var(--club-muted);">${p.bio}</p>
        <div id="pTabs" role="tablist" style="display:flex; flex-wrap:wrap; gap:6px;">${tabs.map(t => `<button type="button" role="tab" data-t="${t}" class="tab-btn" onclick="showPlayerTab(${p.id}, '${t}')">${t}</button>`).join('')}</div>
        <div id="pTabBody" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.85rem; margin-top:14px;"></div>
        <div style="margin-top:14px; display:flex; gap:8px; flex-wrap:wrap;"><button type="button" class="btn-outline" onclick="closeModal('genericDetailModal'); goSection('estatisticas')">📊 Ver estatísticas</button></div>
      `;
      openModal('genericDetailModal');
      showPlayerTab(p.id, 'Perfil');
    }

    /* COMO CHEGAR — fluxo por setor (dados de acesso definidos no projeto) */
    const SECTOR_ACCESS = {
      VERDE:     { gate: 'Portão B', via: 'Estacionamento (compartilhado com Roxo) ou pedestres', end: 'Entrada final pelo Túnel do Lobo' },
      ROXO:      { gate: 'Portão A', via: 'Estacionamento (compartilhado com Verde) ou pedestres', end: 'Portão A • Setor de cadeirantes: acessibilidade e entrada separada pelo estacionamento' },
      AZUL:      { gate: 'Portão D', via: 'Acesso de pedestres', end: 'Portão D' },
      VISITANTE: { gate: 'Portão C', via: 'Acesso de pedestres, fluxo separado', end: 'Portão C' },
      CAMAROTE:  { gate: 'Portão VIP', via: 'Estacionamento exclusivo (vaga inclusa)', end: 'Portão VIP • Tour pelos bastidores 2h antes da partida' }
    };
    function openComoChegar(key) {
      const a = SECTOR_ACCESS[key], sec = SECTOR_DATA[key];
      if (!a || !sec) return;
      const steps = ['CHEGADA', a.via.toUpperCase(), 'ESPLANADA', a.gate.toUpperCase(), 'VALIDAÇÃO', 'CATRACA', 'SETOR'];
      document.getElementById('genericModalContent').innerHTML = `
        <span class="news-tag" style="position:static; display:inline-block; margin-bottom:12px;">Como chegar</span>
        <h3 style="font-family:var(--font-display); font-size:1.6rem; margin:6px 0;">${sec.emoji} ${sec.name}</h3>
        <p style="font-size:0.85rem; color:var(--club-muted);">${a.end}. Capacidade: ${NC}.</p>
        <ol style="list-style:none; padding:0; margin:16px 0; display:grid; gap:6px;">${steps.map((t, i) => `<li style="padding:10px 12px; border-left:3px solid ${sec.color}; background:rgba(26,58,107,0.2); border-radius:var(--radius-sm); font-weight:700; font-size:0.8rem;">${i + 1}. ${t}${i < steps.length - 1 ? ' ↓' : ''}</li>`).join('')}</ol>
        <button type="button" class="btn-outline" onclick="closeModal('genericDetailModal'); goSection('guia-acesso')">📍 Ver guia de acesso completo</button>`;
      openModal('genericDetailModal');
    }

    function openNewsDetail(idx) {
      const n = DB.news[idx];
      document.getElementById('genericModalContent').innerHTML = `
        <span class="news-tag" style="position:static; display:inline-block; margin-bottom:12px;">${n.category}</span>
        <h3 style="font-family:var(--font-display); font-size:1.8rem; margin:10px 0;">${n.title}</h3>
        <p style="color:var(--club-muted); font-size:0.75rem; margin-bottom:14px;">${n.date} • Assessoria de Imprensa SCEC</p>
        <img src="${n.image}" alt="${n.title}" style="width:100%; height:220px; object-fit:cover; border-radius:var(--radius-sm); margin-bottom:14px;" loading="lazy" decoding="async">
        <p style="font-size:0.9rem; line-height:1.6;">${n.content}</p>
      `;
      openModal('genericDetailModal');
    }

    function openMatchReportModal() {
      document.getElementById('genericModalContent').innerHTML = `
        <span class="news-tag" style="position:static; display:inline-block; margin-bottom:12px;">Guia da Partida</span>
        <h3 style="font-family:var(--font-display); font-size:1.8rem; margin:10px 0;">${VAJ_MATCH.title}</h3>
        <p style="font-size:0.85rem; color:var(--club-muted);">${((window.EDITAR && EDITAR.PROXIMO_JOGO && EDITAR.PROXIMO_JOGO.local) || 'Estádio Vale de Santa Clara (Toca do Lobo)')}${(window.EDITAR && EDITAR.PROXIMO_JOGO && EDITAR.PROXIMO_JOGO.emCasa === false) ? '' : ' • Portões abrem às ' + VAJ_MATCH.gates + '.'}</p>
        <div style="margin-top:16px; font-size:0.85rem; line-height:1.8;">
          <p><strong>Competição:</strong> ${VAJ_MATCH.comp}</p>
          <p><strong>Data:</strong> ${(() => { const d = new Date(VAJ_MATCH.date); return isNaN(d) ? VAJ_MATCH.dateLabel : d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ' — ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); })()}</p>
          <p><strong>Arbitragem:</strong> ${(window.EDITAR && EDITAR.PROXIMO_JOGO && EDITAR.PROXIMO_JOGO.arbitragem) || 'A confirmar pela FMF'}</p>
          <p><strong>Escalação provável:</strong> ${(window.EDITAR && EDITAR.PROXIMO_JOGO && EDITAR.PROXIMO_JOGO.escalacao) || 'Diego Firmeza; Leandro Caatinga, Marcelo Pedra, Thiago Cerrado, Bruno Arêdes; Kleber Vale, César Marrom, Jonas Travessão; Eder Cunha, Rafael Veloz e Matheus Jequi.'}</p>
          <p><strong>Patrocinador master:</strong> Banco ValeMais</p>
        </div>
        <div style="margin-top:20px; padding:14px; background:rgba(26,58,107,0.2); border-left:3px solid var(--club-accent); border-radius:var(--radius-sm);">
          ${/Ara[cç]ua/i.test(VAJ_MATCH.title) ? `<strong>🐺 CLÁSSICO DO VALE</strong>
          <p style="font-size:0.8rem; color:var(--club-muted); margin-top:4px;">A maior rivalidade do Jequitinhonha. Santa Clara e Atlético de Araçuaí: a disputa simbólica pelo posto de grande força futebolística regional.</p>` : `<strong>🐺 RUMO AO ACESSO</strong>
          <p style="font-size:0.8rem; color:var(--club-muted); margin-top:4px;">Cada rodada conta no Módulo II. Vá à Toca do Lobo e empurre a Matilha até a vitória.</p>`}
        </div>
      `;
      openModal('genericDetailModal');
    }

    function openFanAreaModal() {
      document.getElementById('walletPlanName').textContent  = userSession.plan;
      document.getElementById('walletUserName').textContent  = userSession.name;
      document.getElementById('walletUserCode').textContent  = userSession.code;
      document.getElementById('fanPointsBadge').textContent  = `${userSession.points} PONTOS SCEC`;

      const qr = document.getElementById('walletQr');
      qr.innerHTML = '';
      new QRCode(qr, { text: userSession.code, width: 60, height: 60 });

      const tl = document.getElementById('userPurchasedTickets');
      tl.innerHTML = userSession.tickets.length
        ? userSession.tickets.map(t => `
            <div style="background:var(--club-dark); padding:10px; border-left:3px solid var(--club-accent);">
              <strong>${t.match}</strong><br>
              <span style="color:var(--club-muted); font-size:0.8rem;">${t.quantity || 1}x — ${t.sectorName || 'Setor Popular'} (geral) — ${t.hash}</span>
            </div>`)
            .join('')
        : '<span style="color:var(--club-muted);">Nenhum ingresso emitido ainda.</span>';

      openModal('fanAreaModal');
    }

    function openMembershipJoinModal(planName, price) {
      document.getElementById('joinPlanTitle').textContent = `Adesão: ${planName}`;
      openModal('membershipModal');
    }

    function handleJoinMembership(e) {
      e.preventDefault();
      const name = document.getElementById('memberJoinName').value;
      userSession.name = name;
      userSession.plan = document.getElementById('joinPlanTitle').textContent.replace('Adesão: ', '');
      userSession.points += 500;
      setStored('scec_user', userSession);
      closeModal('membershipModal');
      openFanAreaModal();
      updateFanBadges();
      alert('Bem-vindo à Matilha! Sua carteirinha oficial está pronta.');
    }

    function executeSearch(query) {
      const q = query.toLowerCase().trim();
      const div = document.getElementById('searchResults');
      if (!q) { div.innerHTML = ''; return; }
      const pM = DB.players.filter(p => p.name.toLowerCase().includes(q) || p.nick.toLowerCase().includes(q));
      const nM = DB.news.filter(n => n.title.toLowerCase().includes(q));
      let html = '';
      pM.forEach(p => { html += `<div style="padding:8px; background:var(--club-dark); border-radius:4px; font-size:0.85rem;">Atleta: <strong>${p.name}</strong> (${p.pos})</div>`; });
      nM.forEach(n => { html += `<div style="padding:8px; background:var(--club-dark); border-radius:4px; font-size:0.85rem;">Notícia: <strong>${n.title}</strong></div>`; });
      div.innerHTML = html || '<span style="color:var(--club-muted); font-size:0.85rem;">Nenhum resultado encontrado.</span>';
    }

    function updateFanBadges() {
      document.getElementById('cartCountBadge').textContent = userSession.cart.length;
    }

    function toggleMobileMenu() {
      document.getElementById('mobileMenu').classList.toggle('open');
    }

    /* =========================================================
       9. EVENT LISTENERS & INICIALIZAÇÃO
       ========================================================= */
    window.addEventListener('scroll', () => {
      document.getElementById('mainHeader').classList.toggle('scrolled', window.scrollY > 50);
    });

    document.getElementById('mobileMenuBtn').onclick = toggleMobileMenu;
    document.getElementById('searchTriggerBtn').onclick = () => { openModal('searchModal'); document.getElementById('globalSearchInput').focus(); };
    document.getElementById('cartTriggerBtn').onclick = () => { renderCartModal(); openModal('cartModal'); };
    document.getElementById('fanAreaBtn').onclick = openFanAreaModal;
    document.getElementById('notificationsTriggerBtn').onclick = () => { document.getElementById('notificationsDrawer').classList.toggle('active'); };
    document.getElementById('themeToggleBtn').onclick = () => {
      const html = document.documentElement;
      html.setAttribute('data-theme', html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    };

    window.addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); openModal('searchModal'); document.getElementById('globalSearchInput').focus(); }
      if (e.key === 'Escape') { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active')); document.body.style.overflow = ''; document.getElementById('notificationsDrawer').classList.remove('active'); }
      // Acesso oculto ao Painel de Personalização — não há botão visível no site público
      if (e.ctrlKey && e.altKey && (e.key === 'p' || e.key === 'P')) { e.preventDefault(); openAdminPanel(); }
    });

    /* =========================================================
       VOU AO JOGO — esplanada, cronograma, validação, plano por setor
       ========================================================= */
    const ESPLANADA_DATA = {
      horario: 'Todos os dias — 08:00 às 21:00',
      itens: ['🎟️ Bilheteria física','🛍️ Loja oficial','🍔 Restaurantes e lanchonetes','☕ Cafeteria','🚻 Banheiros','🪑 Áreas de convivência','📸 Espaços para fotos','🐺 Elementos históricos do Santa Clara','🏟️ Vista externa do estádio','🧑‍💼 Atendimento ao torcedor'],
      tourHorarios: ['10:00','12:00','14:00','16:00','18:00'],
      tourAreas: ['Vestiário do Santa Clara','Túnel dos jogadores','Banco de reservas','Área técnica','Sala de imprensa','Museu/história do clube','Arquibancadas','Campo (quando permitido)','Camarotes','Área VIP','Sala de troféus','Bastidores da operação']
    };
    const MATCHDAY_TIMELINE = [
      { off: -180, icon: '🟡', t: 'Esplanada entra em modo de jogo', d: 'Bares e alimentação ativados, banheiros preparados, segurança nos postos, bilheterias em operação de jogo.' },
      { off: -150, icon: '🚪', t: 'Abertura dos portões', d: 'Portões abertos 2h30 antes da partida.' },
      { off: -150, icon: '♿', t: 'Entrada de cadeirantes', d: 'Entrada separada e acessível pelo estacionamento, direto ao Setor Roxo.', only: 'ROXO' },
      { off: -120, icon: '🧭', t: 'Tour exclusivo do Camarote', d: 'Bastidores da Toca do Lobo: vestiários, túnel dos jogadores e mais. Saída pela Área VIP.', only: 'CAMAROTE' },
      { off: -120, icon: '🎟️', t: 'Fluxo principal de torcedores', d: 'Pico de validação e entrada. Chegue antes para evitar filas.' },
      { off: -45,  icon: '⚽', t: 'Aquecimento', d: 'Times entram para o aquecimento.' },
      { off: -10,  icon: '🏟️', t: 'Entrada dos times', d: 'Últimos minutos antes da bola rolar. Ocupe seu lugar!' },
      { off: 0,    icon: '⚽', t: 'INÍCIO DA PARTIDA', d: 'Bola rolando na Toca do Lobo.' }
    ];
    const VALIDATION_DATA = {
      compra: ['Site', 'Aplicativo', 'Bilheteria', 'Loja oficial'],
      checks: ['O ingresso existe', 'É deste jogo', 'Ainda não foi utilizado', 'Está válido', 'Setor correspondente'],
      results: [
        { ok: true,  t: '✅ INGRESSO VALIDADO', d: 'Siga para o portão do seu setor. Boa partida, torcedor! 🐺' },
        { ok: false, t: '❌ INGRESSO JÁ UTILIZADO', d: 'Procure o atendimento ao torcedor.' },
        { ok: false, t: '⚠️ ACESSO INCORRETO', d: 'Seu ingresso é válido para outro setor. Siga para o portão indicado.' }
      ],
      passos: ['Chegue pela esplanada', 'Localize a validação', 'Apresente seu QR Code', 'Aguarde a confirmação', 'Siga para o portão indicado', 'Passe pela catraca', 'Procure seu setor']
    };
    const VAJ_CHECKLIST = ['🎟️ Ingresso com QR Code (celular carregado ou impresso)', '🪪 Documento com foto', '🕒 Chegar pelo menos 1h30 antes da partida', '🚗 Definir onde estacionar conforme o setor', '🧴 Levar apenas itens permitidos (passam pela revista)', '🐺 Camisa e bandeira da Matilha'];
    const _PJ = (window.EDITAR && EDITAR.PROXIMO_JOGO) || {};
    const VAJ_MATCH = { title: 'Santa Clara EC × ' + (_PJ.adversario || 'Atl. Araçuaí'), comp: 'Campeonato ' + (_PJ.competicao || 'Mineiro Módulo II') + ' — ' + (_PJ.rodada || 8) + 'ª Rodada', date: _PJ.data || '2026-10-04T16:00:00', dateLabel: _PJ.rotulo || '4 de outubro • 16:00', gates: _PJ.portoes || '13:30' };
    function VAJ_HOME() { return (window.__jogoSel && window.__jogoSel.vaj) || VAJ_MATCH; }
    function vajAdv() { return (VAJ_MATCH.title.split('×')[1] || '').trim(); }
    function vajSigla() { return String((window.EDITAR && EDITAR.PROXIMO_JOGO && EDITAR.PROXIMO_JOGO.sigla) || vajAdv().slice(0, 3)).toUpperCase(); }
    function vajToggleCheck(i) { const d = getStored('scec_vaj_check', {}) || {}; d[i] = !d[i]; setStored('scec_vaj_check', d); renderVouAoJogo(); }
    const VAJ_FAQ = [
      ['Posso escolher meu assento?', 'Não. O ingresso é de acesso geral por setor: sente onde quiser dentro da área escolhida.'],
      ['Preciso imprimir o ingresso?', 'Não. O QR Code no celular basta. Se preferir, pode levar impresso.'],
      ['E se meu ingresso for de outro setor?', 'A validação avisa "Acesso incorreto" e indica o portão certo. Siga para ele.'],
      ['Como funciona para cadeirantes?', 'O Setor Roxo tem acessibilidade completa e entrada separada pelo estacionamento.'],
      ['O camarote tem tour?', 'Sim. Quem está no camarote pode fazer o tour pelos bastidores 2h antes da partida, com vestiários e mais.'],
      ['Posso entrar depois do início do jogo?', 'Pode, mas a fila e a revista continuam. Chegar cedo facilita encontrar um bom lugar.'],
      ['Onde resolvo problemas com o ingresso?', 'Na Central de Validação ou no atendimento ao torcedor, na esplanada.']
    ];
    function vajPast(off) {
      const t0 = new Date(VAJ_HOME().date).getTime(), now = Date.now(), t = t0 + off * 60000;
      if (now < t0 - 4 * 3600000 || now > t0 + 3 * 3600000) return '';
      return now > t ? ' vt-past' : (now > t - 30 * 60000 ? ' vt-now' : '');
    }
    const VAJ_RULES = {
      ok: ['Ingresso com QR Code e documento com foto', 'Bandeiras de pano, sem mastro rígido', 'Bolsas pequenas (passam pela revista)', 'Capa de chuva e protetor solar', 'Camisas e cachecóis do clube'],
      bad: ['Fogos de artifício e sinalizadores', 'Garrafas de vidro e latas', 'Objetos cortantes ou pontiagudos', 'Mastros rígidos e drones', 'Cartazes ofensivos ou discriminatórios']
    };
    let vajArrive = 90;
    const VAJ_ARRIVE_OPTS = [
      { min: 150, l: '🟢 Bem cedo', d: 'Portões acabam de abrir. Sem filas e com tempo para a esplanada.' },
      { min: 90,  l: '🟡 Tranquilo', d: 'Boa margem. Algum fluxo na validação, mas dá tempo de sobra.' },
      { min: 45,  l: '🔴 Em cima da hora', d: 'Pico de fila na revista e na catraca. Risco de perder o início.' }
    ];
    function vajSetArrive(m) { vajArrive = m; renderVouAoJogo(); }
    function vajPlanText() {
      const s = SECTOR_DATA[vajSector], a = SECTOR_ACCESS[vajSector], t = m => fmtMatchTime('16:00', -m);
      return `Plano de jogo SCEC — ${VAJ_HOME().title} (${VAJ_HOME().dateLabel})\nSetor: ${s.name}\nPortão: ${a.gate}\nChegada: ${t(vajArrive)} (portões abrem às ${VAJ_HOME().gates})\nIngresso: R$ ${Number(s.price).toFixed(2).replace('.', ',')}`;
    }
    function vajCopyPlan() {
      const txt = vajPlanText();
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => alert('Plano copiado!')).catch(() => prompt('Copie seu plano:', txt));
    }
    function vajWhatsapp() { window.open('https://wa.me/?text=' + encodeURIComponent(vajPlanText()), '_blank'); }
    function vajAddCalendar() {
      const d = new Date(VAJ_HOME().date), st = new Date(d.getTime() - vajArrive * 60000), en = new Date(d.getTime() + 2 * 3600000);
      const f = x => x.getFullYear() + String(x.getMonth() + 1).padStart(2, '0') + String(x.getDate()).padStart(2, '0') + 'T' + String(x.getHours()).padStart(2, '0') + String(x.getMinutes()).padStart(2, '0') + '00';
      const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SCEC//Vou ao Jogo//PT', 'BEGIN:VEVENT', 'UID:scec-' + d.getTime() + '@scec', 'DTSTAMP:' + f(new Date()), 'DTSTART:' + f(st), 'DTEND:' + f(en), 'SUMMARY:' + VAJ_HOME().title + ' na Toca do Lobo', 'LOCATION:Estádio Vale de Santa Clara (Toca do Lobo)', 'DESCRIPTION:' + vajPlanText().replace(/\n/g, '\\n'), 'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:Hora de sair para a Toca do Lobo!', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      const l = document.createElement('a');
      l.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
      l.download = 'jogo-scec.ics';
      document.body.appendChild(l); l.click(); l.remove();
    }
    /* Serviços por setor: só o que já está definido; o resto fica "Não cadastrado" */
    const SECTOR_PLAN = {
      VERDE:     { park: 'Estacionamento compartilhado com o Roxo, ou a pé pela esplanada', extra: 'Entrada final pelo Túnel do Lobo' },
      ROXO:      { park: 'Estacionamento compartilhado com o Verde, ou a pé pela esplanada', extra: 'Setor de cadeirantes, com entrada separada pelo estacionamento' },
      AZUL:      { park: 'Acesso de pedestres', extra: null },
      VISITANTE: { park: 'Acesso de pedestres, fluxo separado', extra: 'Fluxo controlado e separado' },
      CAMAROTE:  { park: 'Estacionamento exclusivo (vaga inclusa)', extra: 'Área VIP • Tour 2h antes da partida' }
    };
    let vajSector = 'VERDE';
    function fmtMatchTime(base, off) {
      const [h, m] = base.split(':').map(Number), tot = h * 60 + m + off;
      return String(Math.floor(tot / 60)).padStart(2, '0') + ':' + String(tot % 60).padStart(2, '0');
    }
    function renderVouAoJogo() {
      const sec = SECTOR_DATA[vajSector], col = sec.color;
      const card = (h, b, cls) => `<div class="vaj-card ${cls || ''}" style="--c:${col}"><strong>${h}</strong><div class="vc-body">${b}</div></div>`;
      const fmt = v => 'R$ ' + Number(v).toFixed(2).replace('.', ',');
      /* Resumo da partida + contagem */
      const M = VAJ_HOME(), diff = new Date(M.date) - new Date(), days = Math.floor(diff / 86400000), hrs = Math.floor((diff % 86400000) / 3600000);
      const count = diff > 0 ? (days > 0 ? `Faltam ${days} dia${days > 1 ? 's' : ''} e ${hrs}h` : `Faltam ${hrs}h`) : 'Dia de jogo!';
      document.getElementById('vajSummary').innerHTML = `
        <div class="vs-item"><small>Próximo jogo em casa</small><strong>${M.title}</strong></div>
        <div class="vs-item"><small>${M.comp}</small><strong>📅 ${M.dateLabel}</strong></div>
        <div class="vs-item"><small>Abertura dos portões</small><strong>🚪 ${M.gates}</strong></div>
        <div class="vs-item vs-count"><small>Contagem</small><strong>⏳ ${count}</strong></div>`;
      document.getElementById('vajTabs').innerHTML = Object.keys(SECTOR_PLAN).map(k => `<button type="button" role="tab" aria-selected="${k === vajSector}" class="tab-btn${k === vajSector ? ' active' : ''}" style="${k === vajSector ? 'background:' + SECTOR_DATA[k].color + ';border-color:' + SECTOR_DATA[k].color + ';' : ''}" onclick="vajSector='${k}';renderVouAoJogo()">${SECTOR_DATA[k].emoji} ${k === 'VISITANTE' ? 'Visitante' : k[0] + k.slice(1).toLowerCase()}</button>`).join('');
      const p = SECTOR_PLAN[vajSector], a = SECTOR_ACCESS[vajSector];
      const acess = vajSector === 'ROXO' ? 'Setor de cadeirantes: acessibilidade completa e entrada separada pelo estacionamento.' : 'O setor de cadeirantes é o Roxo, com entrada separada pelo estacionamento.';
      const trail = ['Chegada', 'Esplanada', 'Validação', a.gate, 'Catraca', sec.name.split(' — ')[0]];
      document.getElementById('vajPlan').innerHTML = [
        card('📍 Onde estacionar', p.park),
        card('🎟️ Onde validar', 'Área de validação na esplanada, antes do portão.'),
        card('🚪 Qual portão usar', a.gate + (p.extra ? '<br>' + p.extra : '')),
        card('🚶 Caminho até o setor', '<div class="vaj-steps">' + trail.map((t, i) => `<span>${t}</span>${i < trail.length - 1 ? '→' : ''}`).join('') + '</div>'),
        card('🚻 Banheiros próximos', 'Banheiros na esplanada e nas áreas internas de cada setor.'),
        card('🍔 Alimentação próxima', 'Restaurantes, lanchonetes e cafeteria na esplanada.'),
        card('♿ Acesso acessível', acess, vajSector === 'ROXO' ? 'vc-ok' : ''),
        card('💰 Ingresso', ((userSession.tickets || []).filter(t => t.sector === vajSector).reduce((n, t) => n + t.quantity, 0) ? '<span style="color:#2e9e4f;font-weight:700">✅ Você já tem ingresso para este setor</span><br>' : '') + `<strong style="font-size:1.2rem;color:var(--club-gold)">${fmt(sec.price)}</strong>${sec.perk ? '<br>' + sec.perk : ''}<br><button type="button" class="btn-outline" style="margin-top:6px" onclick="selectTicketSector('${vajSector}');goSection('ingressos')">Comprar</button> <button type="button" class="btn-outline" style="margin-top:6px" onclick="openComoChegar('${vajSector}')">Como chegar</button>`)
      ].join('');
      renderEsplanada();
      const base = '16:00';
      document.getElementById('vajTimeline').innerHTML = MATCHDAY_TIMELINE.filter(x => !x.only || x.only === vajSector).map(x => `<div class="vaj-time${x.off === 0 ? ' vt-kick' : ''}${x.only ? ' vt-extra' : ''}${vajPast(x.off)}" style="--c:${col}"><strong>${fmtMatchTime(base, x.off)}</strong><span>${x.icon} <strong>${x.t}</strong> — <span style="color:var(--club-muted)">${x.d}</span></span></div>`).join('') + '<p style="font-size:0.75rem;color:var(--club-muted);">Exemplo com jogo às 16:00 (próximo jogo do SCEC). Itens destacados valem para o setor escolhido.</p>';
      const done = getStored('scec_vaj_check', {}) || {};
      document.getElementById('vajChecklist').innerHTML = VAJ_CHECKLIST.map((t, i) => `<label class="vaj-check${done[i] ? ' done' : ''}"><input type="checkbox" ${done[i] ? 'checked' : ''} onchange="vajToggleCheck(${i})"><span>${t}</span></label>`).join('');
      const opt = VAJ_ARRIVE_OPTS.find(o => o.min === vajArrive) || VAJ_ARRIVE_OPTS[1];
      document.getElementById('vajPlanner').innerHTML = `<strong>⏱️ A que horas devo chegar?</strong><div class="vp-opts">${VAJ_ARRIVE_OPTS.map(o => `<button type="button" class="tab-btn${o.min === vajArrive ? ' active' : ''}" onclick="vajSetArrive(${o.min})">${o.l}</button>`).join('')}</div><div class="vp-res">Chegue às <b>${fmtMatchTime(base, -vajArrive)}</b> — ${opt.d}${vajSector === 'CAMAROTE' ? '<br>🧭 Para o tour do camarote, chegue até <strong>' + fmtMatchTime(base, -125) + '</strong>.' : ''}</div>`;
      const G = (typeof GUIDE_SECTORS !== 'undefined' && GUIDE_SECTORS[vajSector]) ? GUIDE_SECTORS[vajSector].steps.slice(0, 6) : [];
      document.getElementById('vajPhotos').innerHTML = G.length ? G.map((st, i) => `<figure>${guideImg(st.img, st.text)}<figcaption><strong>${i + 1}. ${st.title}</strong>${st.text}</figcaption></figure>`).join('') : '<p style="color:var(--club-muted);font-size:0.85rem">Fotos do caminho em breve.</p>';
      const nDone = VAJ_CHECKLIST.filter((_, i) => done[i]).length;
      document.getElementById('vajProgress').innerHTML = `<i style="width:${Math.round(100 * nDone / VAJ_CHECKLIST.length)}%"></i>`;
      document.getElementById('vajFaq').innerHTML = VAJ_FAQ.map(([q, r]) => `<details><summary>${q}</summary><p>${r}</p></details>`).join('');
      document.getElementById('vajRules').innerHTML = card('✅ Pode levar', VAJ_RULES.ok.join('<br>'), 'vc-ok') + card('🚫 Não pode levar', VAJ_RULES.bad.join('<br>'), 'vc-bad');
      document.getElementById('vajServices').innerHTML = card('🩺 Atendimento médico', 'Posto de atendimento médico na esplanada, com equipe em dias de jogo.') + card('🛡️ Segurança', 'Base policial e seguranças nos portões, na esplanada e nas arquibancadas.') + card('🧑‍💼 Atendimento ao torcedor', 'Dúvidas, ingresso com problema ou objeto perdido: procure a Central na esplanada.') + (typeof GUIDE_SECURITY !== 'undefined' ? `<figure style="margin:0" class="vaj-photos">${GUIDE_SECURITY.map(x => `<figure style="flex:1 1 100%;margin:0">${guideImg(x.img, x.cap)}<figcaption>${x.cap}</figcaption></figure>`).join('')}</figure>` : '');
      const V = VALIDATION_DATA;
      document.getElementById('vajValid').innerHTML =
        card('1. Compra', V.compra.join(' · ') + '<br>QR Code individual por ingresso.') +
        card('2. Validação verifica', V.checks.join('<br>')) +
        V.results.map((r, i) => card(r.t, r.d, i === 0 ? 'vc-ok' : (i === 1 ? 'vc-bad' : 'vc-warn'))).join('') +
        card('Como entrar no estádio', V.passos.map((x, i) => (i + 1) + '. ' + x).join('<br>'));
    }

    document.addEventListener('DOMContentLoaded', () => {
      try { showSectorInfo('VERDE'); } catch (e) {}
      loadSiteSettings();
      applyClubCrestToDOM();
      // Acesso oculto alternativo: abrir a página com #admin no final da URL
      if (window.location.hash === '#admin') openAdminPanel();
      initCountdown();
      renderNews();
      renderStandings();
      renderResults();
      renderSquad();
      initSeats();
      renderStore();
      renderHistoryAndTrophies();
      renderBoardAndStaff();
      renderGates();
      renderStatsPanels();
      renderBroadcast();
      renderRegulation();
      renderGuideStatic();
      renderVouAoJogo();
      renderSocialProjects();
      renderSponsors();
      updateFanBadges();
      document.getElementById('notificationsList').innerHTML = DB.notifications.map(n => `
        <div style="border-bottom:1px solid var(--club-border); padding-bottom:6px;">
          <div>${n.text}</div>
          <span style="font-size:0.65rem; color:var(--club-muted);">${n.time}</span>
        </div>
      `).join('');
    });
  
