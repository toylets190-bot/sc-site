/* Santa Clara EC — js/calendario.js
   Baixar o calendário completo dos próximos jogos (.ics) com lembretes.
   Carregado como script clássico, na ordem do index.html (não reordene). */

(function () {
  try {
    var E = window.EDITAR || {}, PD = E.PARTIDAS_PADRAO || {};
    var utc = function (d) { return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; }, tx = function (t) { return String(t).replace(/[,;]/g, '\\$&'); };
    function upcoming() { var now = new Date(); return (E.PARTIDAS || []).filter(function (g) { return g.gols == null && new Date(g.data + 'T23:59:00-03:00') >= now; }); }
    window.calAll = function () {
      var L = upcoming(); if (!L.length) return;
      var ev = L.map(function (g) {
        var st = new Date(g.data + 'T' + (g.hora || PD.hora || '16:00') + ':00-03:00'), t = g.emCasa ? 'Santa Clara EC × ' + g.adv : g.adv + ' × Santa Clara EC';
        return ['BEGIN:VEVENT', 'UID:scec-' + g.data + '-r' + g.rodada + '@santaclara', 'DTSTAMP:' + utc(new Date()), 'DTSTART:' + utc(st), 'DTEND:' + utc(new Date(st.getTime() + 72e5)), 'SUMMARY:' + tx(t),
          'LOCATION:' + tx(g.emCasa ? (PD.local || 'Estádio Vale de Santa Clara') : 'Estádio do ' + g.adv + ' (mandante)'), 'DESCRIPTION:' + tx((PD.comp || 'Mineiro Módulo II') + ' • ' + g.rodada + 'ª rodada' + (g.emCasa ? '' : ' • jogo fora de casa')),
          'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Amanhã: ' + tx(t), 'END:VALARM', 'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:Daqui a 2 horas: ' + tx(t), 'END:VALARM', 'END:VEVENT'].join('\r\n');
      });
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Santa Clara EC//Calendario//PT\r\nCALSCALE:GREGORIAN\r\n' + ev.join('\r\n') + '\r\nEND:VCALENDAR'], { type: 'text/calendar' }));
      a.download = 'santa-clara-proximos-jogos.ics'; document.body.appendChild(a); a.click(); a.remove();
      if (window.socToast) socToast('Calendário com ' + L.length + ' jogos baixado! 📅');
    };
    var host = document.getElementById('jogos'), n = upcoming().length;
    if (host && host.parentNode && n && !document.querySelector('.cal-tools')) {
      var bar = document.createElement('div'); bar.className = 'cal-tools';
      bar.innerHTML = '<span>📅 Salve os <strong>' + n + ' próximos jogos</strong> no seu calendário, com lembrete 1 dia e 2 horas antes.</span><button type="button" class="btn-primary" onclick="calAll()">Baixar calendário (.ics)</button>';
      host.insertBefore(bar, host.firstChild); new MutationObserver(function () { if (!host.contains(bar)) host.insertBefore(bar, host.firstChild); }).observe(host, { childList: true });
    }
  } catch (e) { console.warn('v16', e); }
})();
