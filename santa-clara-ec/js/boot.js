/* Santa Clara EC — js/boot.js
   Carregado no <head>: plano B do QRCode, escudos dos clubes (TEAM_LOGOS) e tratadores de imagem que falha.
   Carregado como script clássico, na ordem do index.html (não reordene). */

    /* Plano B se a CDN principal falhar; depois, um substituto que mostra o código em texto */
    if (!window.QRCode) { (function () { var sc = document.createElement('script'); sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'; sc.async = true; document.head.appendChild(sc); })(); }
  

    if (!window.QRCode) {
      window.QRCode = function (el, o) {
        o = typeof o === 'string' ? { text: o } : (o || {});
        const w = o.width || 96, d = document.createElement('div');
        d.setAttribute('role', 'img'); d.setAttribute('aria-label', 'Código do ingresso (QR indisponível offline)');
        d.style.cssText = 'width:' + w + 'px;min-height:' + Math.min(w, 96) + 'px;display:flex;align-items:center;justify-content:center;text-align:center;padding:4px;border:2px dashed #1a3a6b;color:#1a3a6b;background:#fff;font:700 ' + (w > 120 ? 11 : 8) + 'px monospace;word-break:break-all;line-height:1.2';
        d.textContent = String(o.text || '');
        el.appendChild(d);
      };
      window.QRCode.CorrectLevel = { L: 1, M: 0, Q: 3, H: 2 };
    }
  

    /* Escudos dos clubes (usados na tabela, nos resultados e no próximo jogo). Para trocar, edite só o link. */
    window.TEAM_LOGOS = {
      'Democrata GV':     'https://upload.wikimedia.org/wikipedia/commons/e/e2/Esporte_Clube_Democrata_logo.svg',
      'Santa Clara EC':   'https://i.imgur.com/uqaYGvA.png',
      'Atl. Araçuaí':     'https://i.imgur.com/FpIomzt.png',
      'Uberlândia EC':    'https://federacaopr.com.br/wp-content/uploads/2023/12/Uberlandia.webp',
      'Ipatinga FC':      'https://upload.wikimedia.org/wikipedia/pt/9/95/IpatingaFC.png',
      'EC Montes Claros': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/ESCUDO_MCEC.png',
      'Pouso Alegre FC':  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRImjP9o3RJeZrCfA05_UddJv_2V73zJqvz9HsbHxjrMg&s=10',
      'Diamantina EC':    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScFyn19l74HfDqXOh14r869vgNR2cA-2NYWaAuq53Q1T7rX1bBqV_H7YQ&s=10',
      'Muriaé Sport':     'https://upload.wikimedia.org/wikipedia/pt/7/7a/Nacional_de_Muria%C3%A9.svg',
      'Teófilo Otoni FC': 'https://upload.wikimedia.org/wikipedia/commons/a/aa/America_FC_%28TO-MG%29.svg'
    };
  

    /* Disponível antes do corpo carregar: imagens que falham cedo chamam estes handlers */
    window.clubCrestFallback = function (img) {
      var exts = (img.dataset.fallbackExts || '').split(',').filter(Boolean), base = img.dataset.baseUrl;
      if (exts.length && base) { img.dataset.fallbackExts = exts.slice(1).join(','); img.src = base + '.' + exts[0]; }
      else { img.style.display = 'none'; if (img.nextElementSibling) img.nextElementSibling.style.display = 'flex'; }
    };
    window.crestExt = function (img) {
      var m = /^(https:\/\/i\.imgur\.com\/\w+)\.(png|jpg|jpeg|webp|gif)$/i.exec(img.src);
      if (m) { var l = ['png','jpg','webp','gif'].filter(function (e) { return e !== m[2].toLowerCase() && (img.dataset.tried || '').indexOf(e) < 0; });
        if (l.length) { img.dataset.tried = (img.dataset.tried || '') + m[2].toLowerCase() + ','; img.src = m[1] + '.' + l[0]; return; } }
      window.crestFail(img);
    };
    window.PLAYER_SIL = 'data:image/svg+xml,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 380'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#1d4378'/><stop offset='1' stop-color='#08101e'/></linearGradient></defs><rect width='300' height='380' fill='url(#g)'/><circle cx='150' cy='140' r='52' fill='#5b9bd9' opacity='.6'/><path d='M40 380c0-82 48-132 110-132s110 50 110 132z' fill='#5b9bd9' opacity='.5'/><text x='150' y='345' text-anchor='middle' font-family='Arial' font-weight='800' font-size='20' fill='#c9a84c'>SCEC</text></svg>");
    window.playerImgFail = function (img) { img.onerror = null; img.src = window.PLAYER_SIL; };
    window.trophyFail = function (img) {
      var m = /^(https:\/\/i\.imgur\.com\/\w+)\.(png|jpg|webp|gif)$/i.exec(img.src), t = (img.dataset.t || '');
      if (m) { var l = ['png','jpg','webp','gif'].filter(function (e) { return t.indexOf(e) < 0 && e !== m[2].toLowerCase(); });
        if (l.length) { img.dataset.t = t + m[2].toLowerCase() + ','; img.src = m[1] + '.' + l[0]; return; } }
      var d = document.createElement('div'); d.className = 'trophy-medal'; img.replaceWith(d);
    };
    window.crestFail = function (img) {
      var sz = +img.dataset.size || 26, sp = document.createElement('span');
      sp.className = 'team-crest-placeholder'; sp.style.cssText = 'width:' + sz + 'px;height:' + sz + 'px;font-size:' + Math.round(sz * 0.38) + 'px;';
      sp.textContent = img.dataset.ini || '?'; img.replaceWith(sp);
    };
  

    /* Imagem que não carrega (sem internet, link quebrado): mostra um quadro do clube em vez do ícone quebrado + texto alternativo */
    (function () {
      var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#1a3a6b'/><stop offset='1' stop-color='#0b1830'/></linearGradient></defs><rect width='800' height='450' fill='url(#g)'/><circle cx='400' cy='190' r='86' fill='none' stroke='#c9a84c' stroke-width='4' opacity='.55'/><text x='400' y='208' text-anchor='middle' font-family='Arial Black,Arial,sans-serif' font-weight='900' font-size='60' fill='#c9a84c'>SCEC</text><text x='400' y='330' text-anchor='middle' font-family='Arial,sans-serif' font-size='22' letter-spacing='7' fill='#ffffff' opacity='.55'>SANTA CLARA ESPORTE CLUBE</text></svg>";
      var uri = 'data:image/svg+xml,' + encodeURIComponent(svg);
      document.addEventListener('error', function (e) {
        var img = e.target;
        if (!img || img.tagName !== 'IMG' || img.dataset.fb || img.hasAttribute('onerror') || /^data:/.test(img.src)) return;
        img.dataset.fb = '1'; img.removeAttribute('srcset'); img.src = uri;
      }, true);
    })();
  

    /* Logo de patrocinador: tenta outras extensões do Imgur e, por fim, mostra as iniciais */
    window.sponsorLogoFail = function (img) {
      var exts = (img.dataset.exts || '').split(',').filter(Boolean), base = img.dataset.base;
      if (exts.length && base) { img.dataset.exts = exts.slice(1).join(','); img.src = base + '.' + exts[0]; return; }
      var sp = document.createElement('span'); sp.className = 'sponsor-logo-placeholder'; sp.textContent = img.dataset.ini || '?'; img.replaceWith(sp);
    };
  
