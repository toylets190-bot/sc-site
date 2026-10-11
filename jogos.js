/* Santa Clara EC — js/jogos.js
   Central de jogos: gera JOGOS, PROXIMO_JOGO e CALENDARIO a partir de EDITAR.PARTIDAS e promove o próximo jogo quando o atual já passou.
   Carregado como script clássico, na ordem do index.html (não reordene). */

/* Central de jogos: gera JOGOS, PROXIMO_JOGO e CALENDARIO a partir de EDITAR.PARTIDAS */
(function () {
  try {
    const E = window.EDITAR; if (!E || !Array.isArray(E.PARTIDAS) || !E.PARTIDAS.length) return;
    const D = Object.assign({ comp: 'Mineiro Módulo II', local: '', hora: '16:00' }, E.PARTIDAS_PADRAO || {});
    const pad = n => String(n).padStart(2, '0');
    const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    const iso = g => !g.data ? '' : (String(g.data).indexOf('T') > -1 ? g.data : g.data + 'T' + String(g.hora || D.hora).slice(0, 5) + ':00');
    const L = E.PARTIDAS.map(g => Object.assign({}, g, { iso: iso(g) })).map(g => Object.assign(g, { t: Date.parse(g.iso) }));
    L.sort((a, b) => (isNaN(a.t) || isNaN(b.t)) ? (a.rodada - b.rodada) : (a.t - b.t));
    const feito = g => typeof g.gols === 'number' && typeof g.golsAdv === 'number';
    const jogados = L.filter(feito), pend = L.filter(g => !feito(g));
    E.JOGOS = jogados.map(g => ({ rodada: g.rodada, adv: g.adv, gols: g.gols, golsAdv: g.golsAdv, emCasa: g.emCasa !== false, data: String(g.iso).slice(0, 10), comp: g.comp || D.comp }));
    const sigla = a => a.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\b(EC|FC|SC|AC|Atl\.?|Esporte|Clube)\b/gi, '').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'ADV';
    if (pend.length) {
      const g = pend[0], d = new Date(g.iso), casa = g.emCasa !== false, gate = new Date(d.getTime() - 150 * 60000);
      E.PROXIMO_JOGO = Object.assign({}, E.PROXIMO_JOGO || {}, {
        adversario: g.adv, sigla: g.sigla || sigla(g.adv), competicao: g.comp || D.comp, rodada: g.rodada,
        local: g.local || (casa ? D.local : 'Fora de casa — estádio do ' + g.adv), data: g.iso, emCasa: casa,
        rotulo: isNaN(d) ? '' : d.getDate() + ' de ' + meses[d.getMonth()] + ' • ' + pad(d.getHours()) + ':' + pad(d.getMinutes()),
        portoes: g.portoes || (isNaN(d) ? '' : pad(gate.getHours()) + ':' + pad(gate.getMinutes())),
        arbitragem: g.arbitragem || '', escalacao: g.escalacao || ''
      });
      E.CALENDARIO = pend.slice(1).map(x => ({ rodada: x.rodada, adv: x.adv, emCasa: x.emCasa !== false, data: x.iso }));
    }
    E.PENDENCIAS_RESULTADO = pend.filter(g => g.t + 3 * 3600e3 < Date.now()).map(g => ({ rodada: g.rodada, adv: g.adv, data: String(g.iso).slice(0, 10) }));
    if (E.PENDENCIAS_RESULTADO.length) console.warn('Jogos já passados sem placar em PARTIDAS:', E.PENDENCIAS_RESULTADO);
  } catch (e) { console.error('Central de jogos', e); }
})();

/* v9: se o jogo de PROXIMO_JOGO já passou, promove sozinho o próximo do CALENDARIO (evita "hoje" e contagem zerada) */
(function () {
  try {
    const E = window.EDITAR, P = E && E.PROXIMO_JOGO, C = E && E.CALENDARIO;
    if (!P || !C || !C.length) return;
    const now = Date.now(), t0 = Date.parse(P.data);
    if (!(t0 + 3 * 3600e3 < now)) return;
    const idx = C.findIndex(g => Date.parse(g.data) > now); if (idx < 0) return;
    const g = C[idx], d = new Date(g.data), pad = n => String(n).padStart(2, '0');
    const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    const sigla = g.adv.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\b(EC|FC|SC|AC|Atl\.?|Esporte|Clube)\b/gi, '').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'ADV';
    const gate = new Date(d.getTime() - 150 * 60000);
    E.PROXIMO_JOGO = Object.assign({}, P, {
      adversario: g.adv, sigla: sigla, rodada: g.rodada, data: g.data, emCasa: g.emCasa,
      local: g.emCasa ? P.local : 'Fora de casa — estádio do ' + g.adv,
      rotulo: d.getDate() + ' de ' + meses[d.getMonth()] + ' • ' + pad(d.getHours()) + ':' + pad(d.getMinutes()),
      portoes: pad(gate.getHours()) + ':' + pad(gate.getMinutes())
    });
    E.CALENDARIO = C.filter((x, k) => k !== idx);
  } catch (e) { console.error('v9 próximo jogo', e); }
})();

    /* Se a ÁREA DE EDIÇÃO tiver erro de digitação (vírgula, aspas ou chave faltando), mostra um aviso em vez de quebrar em silêncio */
    if (!window.EDITAR) {
      window.EDITAR = {};
      window.addEventListener('DOMContentLoaded', function () {
        var d = document.createElement('div');
        d.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:99999;background:#b91c1c;color:#fff;padding:10px 14px;font:600 14px/1.4 system-ui,sans-serif;text-align:center';
        d.textContent = 'Erro na ÁREA DE EDIÇÃO do código: falta uma vírgula, aspas ou chave. Revise a última linha que você editou.';
        document.body.appendChild(d);
      });
    }
  
