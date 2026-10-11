/* Santa Clara EC — js/extras.js
   Acréscimos: revelação ao rolar, validação, barra de progresso, busca, pagamentos, palpite, quiz, Matilha Play e outros.
   Carregado como script clássico, na ordem do index.html (não reordene). */

(function(){try{if(!('IntersectionObserver' in window))return;
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08});
document.querySelectorAll('section .container > *').forEach(function(el){el.classList.add('rv');io.observe(el)});
var bar=document.createElement('div');bar.style.cssText='position:fixed;top:0;left:0;height:3px;width:0;z-index:99999;background:linear-gradient(90deg,var(--club-accent),var(--club-gold));transition:width .1s';
addEventListener('scroll',function(){var h=document.documentElement;bar.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%'},{passive:true});
}catch(e){}})();

(function(){try{var b=document.createElement('button');b.id='btt';b.type='button';b.setAttribute('aria-label','Voltar ao topo');b.textContent='↑';b.onclick=function(){scrollTo({top:0,behavior:'smooth'})};document.body.appendChild(b);
addEventListener('scroll',function(){b.classList.toggle('on',scrollY>600)},{passive:true});}catch(e){}})();

function renderValidacao(){var h=document.getElementById('valPosts');if(!h||typeof SECTOR_DATA==='undefined')return;
h.innerHTML=Object.entries(SECTOR_DATA).map(function(e){var x=e[1];return '<div class="val-post" style="--c:'+x.color+'"><span style="font-size:1.6rem">'+(x.emoji||'')+'</span><h4><span class="val-dot"></span>Posto '+x.name+'</h4><p>Cor do posto: <strong style="color:'+x.color+'">'+x.name.replace(/^Setor\s*/i,'')+'</strong></p><p>Depois da validação: <strong>'+x.gate+'</strong></p></div>'}).join('')}
function renderTicketValidation(s,hash){var b=document.getElementById('ticketValidation');if(!b)return;
b.innerHTML='<div class="tk-val" id="tkVal" style="--c:'+s.color+'"><strong class="h">⚠ Valide antes de entrar</strong>Vá ao <b>Posto de Validação '+s.name+'</b> (cor '+s.name.replace(/^Setor\s*/i,'')+'), faça a <b>biometria</b> e retire a pulseira. Sem isso a catraca não libera.<br><span style="color:var(--club-muted)">Cada ingresso tem seu próprio QR Code e precisa ser validado individualmente, pela pessoa que vai usá-lo.</span></div>'}
function simulateBiometric(hash){var o=document.createElement('div');o.className='bio-ov';o.innerHTML='<div class="bio-box"><div class="bio-scan">🧑</div><b>Leitura biométrica...</b><p style="font-size:.8rem;opacity:.8;margin-top:6px">Mantenha o rosto no centro</p></div>';document.body.appendChild(o);
setTimeout(function(){o.querySelector('.bio-box').innerHTML='<div style="font-size:3.4rem">✅</div><b>Identidade confirmada</b><p style="font-size:.8rem;opacity:.8;margin-top:6px">Pulseira liberada. Siga para o portão.</p>';
var c=document.querySelector('.qr-card[data-qr="'+hash+'"]');if(c){c.classList.add('ok');c.querySelector('.qr-st').textContent='✓ Validado — pulseira liberada';var bt=c.querySelector('button');if(bt)bt.remove()}
try{var t=userSession.tickets.filter(function(x){return x.hash===hash})[0];if(t){t.validated=true;setStored('scec_user',userSession)}}catch(e){}
setTimeout(function(){o.remove()},1500)},2600)}
function socRenderDoacao(root){var K='scec_doacoes',base=168430,meta=250000,add=0;try{add=+localStorage.getItem(K)||0}catch(e){}
var tot=base+add,pct=Math.min(100,tot/meta*100),val=50;
function fm(v){return 'R$ '+Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}
var d=document.createElement('div');d.className='doa-wrap';d.id='doaWrap';
d.innerHTML='<h3>🐺 Doe para o Santa Clara</h3><p style="color:var(--club-muted);font-size:.88rem">Sua doação ajuda a base, o estádio e os projetos sociais do clube. Qualquer valor faz diferença.</p><div class="doa-bar"><i style="width:'+pct+'%"></i></div><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;font-size:.8rem"><span id="doaTot"><b>'+fm(tot)+'</b> arrecadados</span><span style="color:var(--club-muted)">Meta: '+fm(meta)+' • Reforma da Toca do Lobo</span></div>'
+'<div class="doa-grid">'+[20,50,100,250].map(function(v){return '<button type="button" class="doa-opt'+(v===50?' on':'')+'" data-v="'+v+'">R$ '+v+'<small>'+(v===20?'uma bola nova':v===50?'kit de treino':v===100?'material da base':'equipamento médico')+'</small></button>'}).join('')+'</div>'
+'<div class="doa-form"><input id="doaCustom" type="number" min="5" step="1" placeholder="Outro valor (R$)"><select id="doaDest" aria-label="Destino da doação"><option>Onde mais precisa</option><option>Categorias de base</option><option>Reforma do estádio</option><option>Projetos sociais</option></select><input id="doaName" placeholder="Seu nome (opcional)"><input id="doaMsg" placeholder="Mensagem para o clube (opcional)"></div>'
+'<label style="display:flex;gap:8px;align-items:center;font-size:.8rem;margin:12px 0"><input type="checkbox" id="doaAnon"> Doar de forma anônima</label>'
+'<button type="button" class="btn-primary" id="doaBtn" style="width:100%;justify-content:center;padding:14px">❤ Fazer doação</button><div id="doaOk" style="margin-top:12px;font-size:.84rem"></div>';
root.appendChild(d);
d.querySelectorAll('.doa-opt').forEach(function(b){b.onclick=function(){d.querySelectorAll('.doa-opt').forEach(function(x){x.classList.remove('on')});b.classList.add('on');val=+b.dataset.v;d.querySelector('#doaCustom').value=''}});
d.querySelector('#doaCustom').oninput=function(){if(this.value){d.querySelectorAll('.doa-opt').forEach(function(x){x.classList.remove('on')});val=+this.value}};
d.querySelector('#doaBtn').onclick=function(){var v=Math.floor(val);if(!(v>=5)){d.querySelector('#doaOk').textContent='Informe um valor de pelo menos R$ 5.';return}
add+=v;try{localStorage.setItem(K,String(add))}catch(e){}
var nm=d.querySelector('#doaAnon').checked?'Torcedor anônimo':(d.querySelector('#doaName').value||'Torcedor');
try{if(typeof userSession!=='undefined'&&userSession.points!==undefined){userSession.points+=v;setStored('scec_user',userSession)}}catch(e){}
tot=base+add;d.querySelector('.doa-bar i').style.width=Math.min(100,tot/meta*100)+'%';d.querySelector('#doaTot').innerHTML='<b>'+fm(tot)+'</b> arrecadados';
d.querySelector('#doaOk').innerHTML='🐺 Obrigado, <b>'+nm.replace(/</g,'&lt;')+'</b>! Doação de <b>'+fm(v)+'</b> para <b>'+d.querySelector('#doaDest').value+'</b> registrada (+'+v+' pontos SCEC). Simulação: nenhuma cobrança real foi feita.'}}
try{renderValidacao()}catch(e){}

/* Título do e-ticket sempre igual ao próximo jogo */
document.addEventListener('DOMContentLoaded', function () { try { var h = document.getElementById('eTicketTitle'); if (h && typeof VAJ_MATCH !== 'undefined') h.textContent = VAJ_MATCH.title; } catch (e) {} });

/* DIAGNÓSTICO: abra o console (F12) e digite  diagnosticoSite()  para ver o que ainda falta preencher */
window.diagnosticoSite = function () {
  var E = window.EDITAR || {}, R = {}, padrao = /pinimg\.com\/474x\/54\/f4\/b5/, foto = function (u) { return !u || padrao.test(u); }, stock = function (u) { return /unsplash\.com/.test(u || ''); };
  R.jogos_passados_sem_placar = (E.PENDENCIAS_RESULTADO || []).map(function (g) { return g.rodada + 'ª rodada — ' + g.adv + ' (' + g.data + ')'; });
  R.jogadores_sem_foto = (E.ELENCO || []).filter(function (p) { return foto(p.img); }).map(function (p) { return '#' + p.num + ' ' + p.name; });
  R.trofeus_sem_foto = (E.TROFEUS || []).filter(function (t) { return !t.img; }).map(function (t) { return t.name; });
  R.noticias_com_foto_generica = (E.NOTICIAS || []).filter(function (n) { return !n.image || stock(n.image); }).map(function (n) { return n.title; });
  R.produtos_com_foto_generica = (typeof DB !== 'undefined' ? DB.products : []).filter(function (x) { return !x.img || stock(x.img); }).map(function (x) { return x.name; });
  R.portoes_sem_foto = (typeof DB !== 'undefined' ? DB.gates : []).filter(function (g) { return !g.img; }).map(function (g) { return g.name; });
  R.diretoria_sem_foto = (E.DIRETORIA || []).filter(function (x) { return !x.photo; }).map(function (x) { return x.name; });
  R.comissao_sem_foto = (E.COMISSAO_TECNICA || []).filter(function (x) { return !x.photo; }).map(function (x) { return x.name; });
  R.escudos_faltando = (typeof DB !== 'undefined' ? DB.standings : []).filter(function (t) { return !(window.TEAM_LOGOS || {})[t.name] && !t.logo; }).map(function (t) { return t.name; });
  R.patrocinadores_sem_link = (E.PATROCINADORES || []).filter(function (x) { return !x.url; }).map(function (x) { return x.name; });
  Object.keys(R).forEach(function (k) { console.log('%c' + k + ' (' + R[k].length + ')', 'font-weight:bold;color:#c9a84c', R[k]); });
  return R;
};

(function(){try{
var bar=document.createElement('div');bar.id='vpProgress';document.body.appendChild(bar);
var top=document.createElement('button');top.id='vpTop';top.type='button';top.setAttribute('aria-label','Voltar ao topo');top.textContent='↑';top.onclick=function(){window.scrollTo({top:0,behavior:'smooth'})};
function f(){var h=document.documentElement,m=h.scrollHeight-h.clientHeight;bar.style.width=(m>0?h.scrollTop/m*100:0)+'%';top.classList.toggle('show',h.scrollTop>700)}
addEventListener('scroll',f,{passive:true});f();
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('main > section, body > section').forEach(function(el,i){if(i<2)return;el.classList.add('vp-rev');io.observe(el)});
setTimeout(function(){document.querySelectorAll('.vp-rev:not(.in)').forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight)el.classList.add('in')})},1200);}
}catch(e){}})();

(function(){try{
var $=function(q){return document.querySelector(q)};
/* ticker */
var tr=$('#vpTrack');if(tr){var t=['🐺 Santa Clara EC — Orgulho do Vale','🎟 Ingressos à venda para os jogos em casa','🏆 Sala de troféus atualizada','⚽ Mineiro Módulo II em andamento','📣 Venha fazer parte da Matilha'];
var h=t.map(function(x){return '<span>'+x+'</span>'}).join('');tr.innerHTML=h+h}
/* linha do tempo a partir dos troféus */
try{var by={};DB.trophies.forEach(function(x){String(x.year).split(',').forEach(function(y){y=y.trim();if(/^\d{4}$/.test(y))(by[y]=by[y]||[]).push(x.name)})});
var ys=Object.keys(by).sort().reverse(),tl=$('#vpTl');
if(tl){if(!ys.length)$('#conquistas-tempo .vp-tl-wrap').style.display='none';else tl.innerHTML=ys.map(function(y){return '<div class="vp-tl-item"><div class="vp-tl-year">'+y+'</div><div class="vp-tl-card">'+by[y].join('<br>')+'</div></div>'}).join('')}}catch(e){}
/* contadores */
function count(el){var raw=el.textContent.trim();if(!/^\d{1,6}$/.test(raw))return;var n=+raw,st=performance.now();(function f(now){var p=Math.min((now-st)/1400,1);el.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(st)}
var nb=$('#numeros');if(nb&&'IntersectionObserver' in window){var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){nb.querySelectorAll('*').forEach(function(e){if(!e.children.length)count(e)});o.disconnect()}},{threshold:.3});o.observe(nb)}
/* confete */
function confetti(from){var c=document.createElement('canvas');c.id='vpConf';c.width=innerWidth;c.height=innerHeight;document.body.appendChild(c);var x=c.getContext('2d'),r=from.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,cols=['#d4af37','#3b82c4','#fff3b0','#f5f6fa','#7a4a2a'],P=[];
for(var i=0;i<90;i++)P.push({x:cx,y:cy,vx:(Math.random()-.5)*12,vy:Math.random()*-12-3,s:4+Math.random()*6,c:cols[i%5],a:Math.random()*6,va:(Math.random()-.5)*.4});
var st=performance.now();(function f(now){x.clearRect(0,0,c.width,c.height);P.forEach(function(p){p.vy+=.3;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);x.restore()});if(now-st<2200)requestAnimationFrame(f);else c.remove()})(st)}
/* lightbox de troféus */
var lb=document.createElement('figure');lb.id='vpLb';lb.innerHTML='<img alt=""><figcaption></figcaption>';document.body.appendChild(lb);
lb.onclick=function(){lb.classList.remove('on')};addEventListener('keydown',function(e){if(e.key==='Escape')lb.classList.remove('on')});
document.addEventListener('click',function(e){var st=e.target.closest&&e.target.closest('.tr-stage');if(!st)return;var im=st.querySelector('img');if(!im)return;lb.querySelector('img').src=im.src;lb.querySelector('figcaption').textContent=im.alt;lb.classList.add('on');confetti(st)});
/* botão ingressos */
if($('#ingressos')){var a=document.createElement('a');a.id='vpCta';a.href='#ingressos';a.innerHTML='🎟 Ingressos';document.body.appendChild(a)}
}catch(e){console.warn(e)}})();

(function(){try{
var $=function(q){return document.querySelector(q)};
/* calendário .ics + compartilhar */
var ha=$('.hero-actions');
if(ha){
 function ics(){var d=new Date((window.EDITAR&&EDITAR.PROXIMO_JOGO&&EDITAR.PROXIMO_JOGO.data)||Date.now()+8*864e5),e=new Date(d.getTime()+108e5);
  var f=function(x){return x.toISOString().replace(/[-:]|\.\d{3}/g,'')},tn=document.querySelectorAll('.team-name'),
  ti=(tn[0]?tn[0].textContent.trim():'Santa Clara EC')+' x '+(tn[1]?tn[1].textContent.trim():'Adversário'),
  ci=$('.competition-info'),st=$('.stadium-info');
  var t=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Santa Clara EC//PT','BEGIN:VEVENT','UID:'+Date.now()+'@santaclaraec','DTSTAMP:'+f(new Date()),'DTSTART:'+f(d),'DTEND:'+f(e),'SUMMARY:'+ti,'DESCRIPTION:'+(ci?ci.textContent.trim():''),'LOCATION:'+(st?st.textContent.trim():''),'BEGIN:VALARM','TRIGGER:-PT2H','ACTION:DISPLAY','DESCRIPTION:Jogo em 2 horas','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/calendar'}));a.download='jogo-santa-clara.ics';document.body.appendChild(a);a.click();a.remove()}
 var b1=document.createElement('button');b1.type='button';b1.className='btn btn-outline';b1.textContent='📅 Adicionar ao calendário';b1.onclick=ics;
 var b2=document.createElement('button');b2.type='button';b2.className='btn btn-outline';b2.textContent='📲 Compartilhar';
 b2.onclick=function(){var d={title:document.title,text:'Bora, Matilha! 🐺 Confira o Santa Clara EC',url:location.href};if(navigator.share)navigator.share(d).catch(function(){});else window.open('https://wa.me/?text='+encodeURIComponent(d.text+' '+d.url),'_blank','noopener')};
 ha.appendChild(b1);ha.appendChild(b2);ha.style.flexWrap='wrap'}
/* busca / paleta de comandos */
var secs=[];document.querySelectorAll('main section[id]').forEach(function(sc){var h=sc.querySelector('h2,h3');var pre=sc.querySelector('.section-pretitle');if(h)secs.push({id:sc.id,t:h.textContent.trim().replace(/\s+/g,' '),k:pre?pre.textContent.trim():''})});
secs.unshift({id:'__pay',t:'🧾 Meus pagamentos (comprovantes)',k:'Ação'});var pal=document.createElement('div');pal.id='vpPal';pal.innerHTML='<div class="vp-pal-box"><input type="text" placeholder="Buscar no site: elenco, ingressos, tabela…" aria-label="Buscar"><div class="vp-pal-list"></div><div class="vp-pal-hint">↑ ↓ navegar · Enter abrir · Esc fechar · atalho: Ctrl+K ou /</div></div>';document.body.appendChild(pal);
var inp=pal.querySelector('input'),ls=pal.querySelector('.vp-pal-list'),ix=0,cur=[];
function norm(x){return x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function draw(){var q=norm(inp.value);cur=secs.filter(function(x){return !q||norm(x.t+' '+x.k).indexOf(q)>-1});if(ix>=cur.length)ix=0;
 ls.innerHTML=cur.length?cur.map(function(x,i){return '<button data-i="'+i+'" class="'+(i===ix?'act':'')+'">'+x.t+'<small>'+x.k+'</small></button>'}).join(''):'<div style="padding:18px;color:var(--club-muted)">Nada encontrado.</div>'}
function go(i){var x=cur[i];if(!x)return;pal.classList.remove('on');if(x.id==='__pay'){window.vpReceipts();return}var el=document.getElementById(x.id);if(el)el.scrollIntoView({behavior:'smooth'})}
function open(){pal.classList.add('on');inp.value='';ix=0;draw();setTimeout(function(){inp.focus()},30)}
inp.oninput=function(){ix=0;draw()};
ls.onclick=function(e){var b=e.target.closest('button');if(b)go(+b.dataset.i)};
pal.onclick=function(e){if(e.target===pal)pal.classList.remove('on')};
inp.onkeydown=function(e){if(e.key==='ArrowDown'){ix=Math.min(ix+1,cur.length-1);draw();e.preventDefault()}else if(e.key==='ArrowUp'){ix=Math.max(ix-1,0);draw();e.preventDefault()}else if(e.key==='Enter')go(ix)};
addEventListener('keydown',function(e){var t=(e.target.tagName||'').toLowerCase(),typing=t==='input'||t==='textarea'||e.target.isContentEditable;
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();try{openModal('searchModal');document.getElementById('globalSearchInput').focus()}catch(x){open()}}else if(e.key==='Escape')pal.classList.remove('on')});
var sb=document.createElement('button');sb.id='vpSearchBtn';sb.type='button';sb.setAttribute('aria-label','Buscar no site');sb.textContent='🔍';sb.onclick=open;
}catch(e){console.warn(e)}})();

(function(){try{
var $=function(q){return document.querySelector(q)};
/* camisa */
var cv=$('#vpJc');if(cv){var cx=cv.getContext('2d'),K=0,kits=[{b:'#1a3a6b',s:'#3b82c4',t:'#f5f6fa',c:'#d4af37'},{b:'#f5f6fa',s:'#1a3a6b',t:'#1a3a6b',c:'#d4af37'},{b:'#111827',s:'#d4af37',t:'#d4af37',c:'#f5f6fa'}];
 function shirt(){var k=kits[K],nm=($('#vpJn').value||'').toUpperCase(),nu=String($('#vpJm').value||'').slice(0,2);cx.clearRect(0,0,600,700);
  cx.save();cx.shadowColor='rgba(0,0,0,.45)';cx.shadowBlur=30;cx.shadowOffsetY=14;
  cx.beginPath();cx.moveTo(210,40);cx.quadraticCurveTo(300,95,390,40);cx.lineTo(560,130);cx.lineTo(500,270);cx.lineTo(430,240);cx.lineTo(430,660);cx.lineTo(170,660);cx.lineTo(170,240);cx.lineTo(100,270);cx.lineTo(40,130);cx.closePath();cx.fillStyle=k.b;cx.fill();cx.restore();
  cx.fillStyle=k.s;cx.beginPath();cx.moveTo(40,130);cx.lineTo(210,40);cx.lineTo(225,75);cx.lineTo(100,270);cx.closePath();cx.fill();
  cx.beginPath();cx.moveTo(560,130);cx.lineTo(390,40);cx.lineTo(375,75);cx.lineTo(500,270);cx.closePath();cx.fill();
  cx.strokeStyle=k.c;cx.lineWidth=10;cx.beginPath();cx.moveTo(210,40);cx.quadraticCurveTo(300,95,390,40);cx.stroke();
  cx.fillStyle=k.s;cx.globalAlpha=.25;for(var i=0;i<6;i++)cx.fillRect(170,330+i*55,260,16);cx.globalAlpha=1;
  cx.textAlign='center';cx.fillStyle=k.t;cx.font='900 38px Arial Black,Impact,sans-serif';
  var f=36;do{cx.font='900 '+f+'px Arial Black,Impact,sans-serif';f-=2}while(cx.measureText(nm).width>240&&f>14);cx.fillText(nm,300,190);
  cx.font='900 230px Arial Black,Impact,sans-serif';cx.fillText(nu,300,430);
  cx.font='700 22px Arial,sans-serif';cx.fillStyle=k.c;cx.fillText('SANTA CLARA EC',300,620)}
 ['#vpJn','#vpJm'].forEach(function(q){$(q).oninput=shirt});
 $('#vpJk').onclick=function(e){var b=e.target.closest('button');if(!b)return;K=+b.dataset.k;this.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b)});shirt()};
 $('#vpJd').onclick=function(){cv.toBlob(function(bl){var a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download='camisa-santa-clara.png';document.body.appendChild(a);a.click();a.remove()})};shirt()}
}catch(e){console.warn(e)}})();

(function(){try{
var ov=document.createElement('div');ov.id='vpPayOv';document.body.appendChild(ov);
var tm=null,S=null;
var brl=function(v){return 'R$ '+Number(v).toFixed(2).replace('.',',')};
var esc=function(x){return String(x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var rnd=function(n){var r='';for(var i=0;i<n;i++)r+=Math.floor(Math.random()*10);return r};
function close(){ov.classList.remove('on');clearInterval(tm);ov.innerHTML='';S=null}
function luhn(n){var s=0,d=false;for(var i=n.length-1;i>=0;i--){var x=+n[i];if(d){x*=2;if(x>9)x-=9}s+=x;d=!d}return s%10===0}
function cpfOk(c){c=c.replace(/\D/g,'');if(c.length!==11||/^(\d)\1+$/.test(c))return false;for(var t=9;t<11;t++){var s=0;for(var i=0;i<t;i++)s+=+c[i]*(t+1-i);if((s*10)%11%10!==+c[t])return false}return true}
function brand(n){if(/^(4011|4312|4389|4514|4576|5041|5066|5090|6277|6362|6363|650|6516|6550)/.test(n))return 'ELO';if(/^4/.test(n))return 'VISA';if(/^(5[1-5]|2[2-7])/.test(n))return 'MASTERCARD';if(/^3[47]/.test(n))return 'AMEX';return 'CARTÃO'}
var CP={MATILHA10:10,VALE5:5};
function sumHtml(){return '<div class="vpp-sum"><span>'+esc(S.desc)+(S.cp?'<br><small style="color:#22c55e">Cupom '+S.cp.c+' (−'+S.cp.p+'%)</small>':'')+'</span><b>'+(S.cp?'<s style="font-size:.8rem;color:var(--club-muted);font-weight:600">'+brl(S.base)+'</s> ':'')+brl(S.total)+'</b></div>'}
function applyCp(){var c=($('#vpCpI').value||'').trim().toUpperCase(),e=$('#vpCpE');if(!CP[c]){e.textContent='Cupom inválido.';return}S.cp={c:c,p:CP[c]};S.total=Math.round(S.base*(100-CP[c]))/100;
 var keep={};['vcn','vch','vcv','vcc','vcf'].forEach(function(i){var el=$('#'+i);if(el)keep[i]=el.value});view();Object.keys(keep).forEach(function(i){var el=$('#'+i);if(el){el.value=keep[i];if(el.oninput)el.oninput()}})}
function shell(inner,nocp){ov.innerHTML='<div class="vpp" role="dialog" aria-modal="true" aria-label="Pagamento"><div class="vpp-h"><div>🔒 Pagamento<small>Ambiente de simulação</small></div><button class="vpp-x" type="button" aria-label="Fechar">✕</button></div>'+sumHtml()+(nocp||S.cp?'':'<div class="vpp-cp"><input id="vpCpI" placeholder="Cupom (teste: MATILHA10)" maxlength="14" autocomplete="off"><button type="button" id="vpCpB">Aplicar</button></div><div class="vpp-err" id="vpCpE" style="padding:0 22px;margin:0"></div>')+inner+'</div>';ov.querySelector('.vpp-x').onclick=close;var cb=$('#vpCpB');if(cb)cb.onclick=applyCp}
function tabs(){return '<div class="vpp-tabs">'+[['pix','◈ Pix'],['card','💳 Cartão'],['boleto','▤ Boleto']].map(function(t){return '<button type="button" data-m="'+t[0]+'" class="'+(S.m===t[0]?'on':'')+'">'+t[1]+'</button>'}).join('')+'</div>'}
var NOTE='<div class="vpp-note">🔐 Simulação: nenhuma cobrança real é feita e nenhum dado de cartão é enviado ou guardado. Para cobrar de verdade é preciso integrar um gateway (Mercado Pago, Pagar.me, Stripe etc.) no servidor.</div>';
function view(){clearInterval(tm);var h;
 if(S.m==='pix'){var code='SCEC-SIMULACAO-'+S.id+'-'+Math.round(S.total*100);
  h='<div class="vpp-b vpp-pix"><div class="qr" id="vppQr"></div><div class="vpp-time">Expira em <span id="vppT">15:00</span></div><div class="vpp-code" id="vppC">'+code+'</div><button class="vpp-go alt" type="button" id="vppCp">Copiar código Pix</button><button class="vpp-go" type="button" id="vppPx">Simular pagamento no app do banco</button>'+NOTE+'</div>';
  shell(tabs()+h);S.code=code;try{new QRCode($('#vppQr'),{text:code,width:170,height:170})}catch(e){}
  var t=900;tm=setInterval(function(){t--;var el=$('#vppT');if(!el){clearInterval(tm);return}if(t<0){clearInterval(tm);el.textContent='expirado';return}el.textContent=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0')},1000);
  $('#vppCp').onclick=function(){var b=this;try{navigator.clipboard.writeText(code).catch(function(){})}catch(e){}b.textContent='✔ Código copiado!';setTimeout(function(){b.textContent='Copiar código Pix'},1800)};
  $('#vppPx').onclick=function(){proc(['Aguardando confirmação do banco…','Pagamento identificado','Emitindo comprovante…'],'Pix')}}
 else if(S.m==='card'){var o='';for(var n=1;n<=6;n++){if(n===1||S.total/n>=20)o+='<option value="'+n+'">'+n+'x de '+brl(S.total/n)+(n>1?' sem juros':' à vista')+'</option>'}
  h='<div class="vpp-b"><div class="vpp-card"><div class="br" id="vcB">CARTÃO</div><div class="nm" id="vcN">•••• •••• •••• ••••</div><div class="ft"><span id="vcH">NOME NO CARTÃO</span><span id="vcV">MM/AA</span></div></div>'+
  '<label>Número do cartão</label><input id="vcn" inputmode="numeric" autocomplete="off" placeholder="0000 0000 0000 0000" maxlength="19"><label>Nome impresso</label><input id="vch" autocomplete="off" placeholder="COMO NO CARTÃO" style="text-transform:uppercase"><div class="vpp-r"><div><label>Validade</label><input id="vcv" inputmode="numeric" placeholder="MM/AA" maxlength="5" autocomplete="off"></div><div><label>CVV</label><input id="vcc" inputmode="numeric" placeholder="000" maxlength="4" autocomplete="off"></div></div><label>CPF do titular</label><input id="vcf" inputmode="numeric" placeholder="000.000.000-00" maxlength="14" autocomplete="off"><label>Parcelas</label><select id="vcp">'+o+'</select><div class="vpp-err" id="vcE"></div><button class="vpp-go" type="button" id="vcGo">Pagar '+brl(S.total)+'</button><div class="vpp-note">Para testar use o cartão <b>4242 4242 4242 4242</b>, qualquer validade futura, CVV 123 e um CPF válido. Para simular recusa: <b>4000 0000 0000 0002</b>.</div></div>';
  shell(tabs()+h);var ni=$('#vcn'),hi=$('#vch'),vi=$('#vcv'),ci=$('#vcc'),fi=$('#vcf');
  ni.oninput=function(){var d=ni.value.replace(/\D/g,'').slice(0,16);ni.value=d.replace(/(\d{4})(?=\d)/g,'$1 ');var p=(d+'################').slice(0,16).replace(/#/g,'•');$('#vcN').textContent=p.replace(/(.{4})/g,'$1 ').trim();$('#vcB').textContent=brand(d)};
  hi.oninput=function(){$('#vcH').textContent=hi.value.toUpperCase()||'NOME NO CARTÃO'};
  vi.oninput=function(){var d=vi.value.replace(/\D/g,'').slice(0,4);vi.value=d.length>2?d.slice(0,2)+'/'+d.slice(2):d;$('#vcV').textContent=vi.value||'MM/AA'};
  ci.oninput=function(){ci.value=ci.value.replace(/\D/g,'')};
  fi.oninput=function(){var d=fi.value.replace(/\D/g,'').slice(0,11);fi.value=d.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})\.(\d{3})(\d)/,'$1.$2.$3').replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/,'$1.$2.$3-$4')};
  $('#vcGo').onclick=function(){var d=ni.value.replace(/\D/g,''),bad=[],now=new Date(),mm=+vi.value.slice(0,2),yy=2000+(+vi.value.slice(3,5));
   [ni,hi,vi,ci,fi].forEach(function(i){i.classList.remove('bad')});
   if(d.length<13||!luhn(d))bad.push([ni,'Número de cartão inválido.']);
   if(hi.value.trim().split(/\s+/).length<2)bad.push([hi,'Digite o nome completo como no cartão.']);
   if(!(mm>=1&&mm<=12)||new Date(yy,mm,0,23,59)<now)bad.push([vi,'Validade inválida ou vencida.']);
   if(ci.value.length<3)bad.push([ci,'CVV inválido.']);
   if(!cpfOk(fi.value))bad.push([fi,'CPF inválido.']);
   if(bad.length){bad.forEach(function(b){b[0].classList.add('bad')});$('#vcE').textContent=bad[0][1];bad[0][0].focus();return}
   var dec=d==='4000000000000002';S.last4=d.slice(-4);S.br=brand(d);S.par=$('#vcp').value;proc(dec?['Validando dados do cartão…','Consultando o banco emissor…']:['Validando dados do cartão…','Consultando o banco emissor…','Pagamento aprovado'],S.br+' final '+S.last4+' • '+S.par+'x',dec?'O banco emissor recusou a transação (código 51: limite insuficiente). Tente outro cartão ou pague com Pix.':0)}}
 else{var ld=('23790'+rnd(5)+' '+rnd(5)+'0 '+rnd(5)+'0'+rnd(1)+' '+rnd(5)+'0 '+rnd(1)+' '+rnd(14)),dv=new Date(Date.now()+3*864e5).toLocaleDateString('pt-BR');
  h='<div class="vpp-b"><label>Linha digitável</label><div class="vpp-code" id="vbC">'+ld+'</div><div class="vpp-r" style="margin-top:12px"><div><label>Vencimento</label><div style="font-weight:800">'+dv+'</div></div><div><label>Valor</label><div style="font-weight:800;color:var(--club-gold)">'+brl(S.total)+'</div></div></div><button class="vpp-go alt" type="button" id="vbCp">Copiar linha digitável</button><button class="vpp-go" type="button" id="vbPg">Simular compensação do boleto</button>'+NOTE+'</div>';
  shell(tabs()+h);
  $('#vbCp').onclick=function(){var b=this;try{navigator.clipboard.writeText(ld).catch(function(){})}catch(e){}b.textContent='✔ Copiado!';setTimeout(function(){b.textContent='Copiar linha digitável'},1800)};
  $('#vbPg').onclick=function(){proc(['Registrando boleto…','Aguardando compensação bancária…','Pagamento confirmado'],'Boleto')}}
 ov.querySelectorAll('.vpp-tabs button').forEach(function(b){b.onclick=function(){S.m=b.dataset.m;view()}})}
function proc(steps,label,fail){clearInterval(tm);var i=0;shell('<div class="vpp-load"><div class="vpp-spin"></div><b id="vppS">'+steps[0]+'</b><div style="color:var(--club-muted);font-size:.8rem;margin-top:8px">Não feche esta janela</div></div>',1);
 tm=setInterval(function(){i++;var el=$('#vppS');if(!el){clearInterval(tm);return}if(i>=steps.length){clearInterval(tm);fail?bad(fail):done(label);return}el.textContent=steps[i]},900)}
function done(label){var tx='TX'+rnd(10),au=rnd(6),dt=new Date().toLocaleString('pt-BR');
 shell('<div class="vpp-ok"><div class="vpp-ck">✔</div><h3 style="margin:0;font-family:var(--font-display);font-size:1.5rem">Pagamento aprovado!</h3><p style="color:var(--club-muted);margin:6px 0 0">Obrigado, Matilha! 🐺</p><div class="vpp-rc"><div><span>Pedido</span><b>'+esc(S.desc)+'</b></div><div><span>Valor</span><b>'+brl(S.total)+'</b></div><div><span>Forma</span><b>'+esc(label)+'</b></div><div><span>Transação</span><b>'+tx+'</b></div><div><span>Autorização</span><b>'+au+'</b></div><div><span>Data</span><b>'+dt+'</b></div></div><button class="vpp-go alt" type="button" id="vppPng">⬇ Baixar comprovante (PNG)</button><button class="vpp-go" type="button" id="vppOk">Continuar</button><div style="font-size:.7rem;color:var(--club-muted);margin-top:10px">Comprovante de simulação — sem valor fiscal.</div></div>',1);
 var rc={tx:tx,au:au,desc:S.desc,total:S.total,label:label,dt:dt};try{var L=JSON.parse(localStorage.getItem('vpReceipts')||'[]');L.unshift(rc);localStorage.setItem('vpReceipts',JSON.stringify(L.slice(0,30)))}catch(e){}$('#vppPng').onclick=function(){png(rc)};var f=S.ok;$('#vppOk').onclick=function(){close();if(f)f()}}
function bad(m){shell('<div class="vpp-ok"><div class="vpp-ck" style="background:linear-gradient(135deg,#ef4444,#b91c1c);box-shadow:0 0 0 10px rgba(239,68,68,.15)">✕</div><h3 style="margin:0;font-family:var(--font-display);font-size:1.5rem">Pagamento recusado</h3><p style="color:var(--club-muted)">'+m+'</p><button class="vpp-go" type="button" id="vppRt">Tentar outro método</button></div>',1);$('#vppRt').onclick=function(){view()}}
function png(r){var c=document.createElement('canvas');c.width=640;c.height=720;var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,640,720);x.fillStyle='#1a3a6b';x.fillRect(0,0,640,110);x.fillStyle='#fff';x.font='900 30px Arial';x.fillText('SANTA CLARA EC',32,52);x.font='600 16px Arial';x.fillText('Comprovante de pagamento (simulação)',32,82);
 x.fillStyle='#16a34a';x.font='900 26px Arial';x.fillText('Pagamento aprovado',32,170);
 [['Pedido',r.desc],['Valor',brl(r.total)],['Forma',r.label],['Transação',r.tx],['Autorização',r.au],['Data',r.dt]].forEach(function(w,i){var y=230+i*62;x.fillStyle='#6b7280';x.font='600 15px Arial';x.fillText(w[0].toUpperCase(),32,y);x.fillStyle='#111827';x.font='700 20px Arial';x.fillText(String(w[1]).slice(0,42),32,y+28);x.fillStyle='#e5e7eb';x.fillRect(32,y+40,576,1)});
 x.fillStyle='#9ca3af';x.font='13px Arial';x.fillText('Documento de demonstração, sem valor fiscal.',32,690);
 c.toBlob(function(b){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='comprovante-'+r.tx+'.png';document.body.appendChild(a);a.click();a.remove()})}
window.vpReceipts=function(){var L=[];try{L=JSON.parse(localStorage.getItem('vpReceipts')||'[]')}catch(e){}S={desc:'',total:0};ov.classList.add('on');
 ov.innerHTML='<div class="vpp"><div class="vpp-h"><div>🧾 Meus pagamentos<small>Comprovantes neste aparelho</small></div><button class="vpp-x" type="button" aria-label="Fechar">✕</button></div><div class="vpp-b">'+(L.length?L.map(function(r,i){return '<div class="vpp-rc" style="margin:0 0 12px"><div><span>'+esc(r.dt)+'</span><b>'+brl(r.total)+'</b></div><div><b>'+esc(r.desc)+'</b></div><div><span>'+esc(r.label)+' • '+r.tx+'</span><button type="button" data-i="'+i+'" style="background:none;border:0;color:var(--club-gold);font-weight:800;cursor:pointer">⬇ PNG</button></div></div>'}).join(''):'<p style="color:var(--club-muted);text-align:center">Nenhum pagamento ainda.</p>')+'</div></div>';
 ov.querySelector('.vpp-x').onclick=close;ov.querySelectorAll('[data-i]').forEach(function(b){b.onclick=function(){png(L[+b.dataset.i])}})};
window.vpPay=function(o){S={base:o.total,total:o.total,desc:o.desc,ok:o.onOk,id:rnd(8),m:o.method==='Cartão de crédito'||o.method==='card'?'card':o.method==='Boleto'||o.method==='boleto'?'boleto':'pix'};ov.classList.add('on');view()};
addEventListener('keydown',function(e){if(e.key==='Escape'&&ov.classList.contains('on'))close()});
function $(q){return ov.querySelector(q)}
/* conecta ingressos, loja e planos */
var _t=window.handleTicketCheckout;
if(_t)window.handleTicketCheckout=function(e){try{if(e&&e.preventDefault)e.preventDefault();if(window.__vpOk||!isLogged()){window.__vpOk=false;return _t.apply(this,arguments)}
 var q=socQuote(socPlan(),chosenTicketSector,ticketQty),a=arguments;if(!(q.total>0))return _t.apply(this,a);
 vpPay({total:q.total,desc:'Ingressos • '+ticketQty+'x '+(SECTOR_DATA[chosenTicketSector]||{}).name,onOk:function(){window.__vpOk=true;_t.apply(null,a)}})}catch(x){return _t.apply(this,arguments)}};
var _s=window.handleStoreCheckout;
if(_s)window.handleStoreCheckout=function(){try{if(window.__vpOk2||!userSession.cart.length||!isLogged()){window.__vpOk2=false;return _s.apply(this,arguments)}
 var q=socCartQuote();if(!(q.total>0))return _s();vpPay({total:q.total,desc:'Loja oficial • '+userSession.cart.length+' item(ns)',onOk:function(){window.__vpOk2=true;_s()}})}catch(x){return _s.apply(this,arguments)}};
var _j=window.socConfirmJoin;
if(_j)window.socConfirmJoin=function(key){try{var pl=SOC_PLANS[key],val=socCycle==='anual'?pl.price*10:pl.price,pm=(document.getElementById('joinPay')||{}).value||'Pix';
 if(!(val>0))return _j(key);vpPay({total:val,method:pm,desc:'Plano '+pl.name+' ('+socCycle+')',onOk:function(){_j(key)}})}catch(x){return _j(key)}};
}catch(e){console.warn(e)}})();

(function(){try{
var $=function(q){return document.querySelector(q)};
var nl=$('#vpNl');if(nl)nl.onsubmit=function(e){e.preventDefault();var v=nl.querySelector('input').value.trim();try{var L=JSON.parse(localStorage.getItem('vpNews')||'[]');if(L.indexOf(v)<0)L.push(v);localStorage.setItem('vpNews',JSON.stringify(L))}catch(x){}nl.innerHTML='<b style="color:#86efac">✔ Inscrição registrada! (demonstração: o e-mail fica salvo só neste navegador)</b>'};
var rb=$('#vpRcBtn');if(rb)rb.onclick=function(){window.vpReceipts&&window.vpReceipts()};

}catch(e){console.warn(e)}})();

(function(){try{
var $=function(q){return document.querySelector(q)},R=document.documentElement;
}catch(e){console.warn(e)}})();

(function(){try{
var mob=matchMedia('(max-width:700px)').matches;
function acc(){[['vou-ao-jogo','H3'],['guia-acesso','H4']].forEach(function(c){var sec=document.getElementById(c[0]);if(!sec||sec.dataset.vpacc)return;var tag=c[1],hs=[].slice.call(sec.querySelectorAll(tag));if(hs.length<3)return;sec.dataset.vpacc='1';var bl=[];
 hs.forEach(function(h,i){var it=[],n=h.nextElementSibling;while(n&&n.tagName!==tag&&!n.querySelector(tag)){it.push(n);n=n.nextElementSibling}
  if(!it.length)return;var body=document.createElement('div');body.className='vp-acc-body';h.parentNode.insertBefore(body,it[0]);it.forEach(function(x){body.appendChild(x)});
  h.classList.add('vp-acc-h');h.tabIndex=0;h.setAttribute('role','button');
  function set(o){h.setAttribute('aria-expanded',o?'true':'false');body.style.display=o?'':'none';h.classList.toggle('open',o)}
  set(!mob||i===0);
  h.onclick=function(){set(body.style.display==='none')};h.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();h.click()}};
  bl.push({h:h,set:set})});
 if(bl.length<3)return;
 var nav=document.createElement('div');nav.className='vp-chipnav';
 var all=document.createElement('button');all.type='button';all.className='all';all.textContent='Abrir tudo';var oa=false;
 all.onclick=function(){oa=!oa;bl.forEach(function(x){x.set(oa)});all.textContent=oa?'Recolher tudo':'Abrir tudo'};nav.appendChild(all);
 bl.forEach(function(b){var k=document.createElement('button');k.type='button';k.textContent=b.h.textContent.replace(/\s+/g,' ').trim();k.onclick=function(){bl.forEach(function(x){x.set(x===b)});b.h.scrollIntoView({behavior:'smooth',block:'start'})};nav.appendChild(k)});
 bl[0].h.parentNode.insertBefore(nav,bl[0].h)})}
function links(){document.querySelectorAll('main section[id] .section-main-title').forEach(function(t){if(t.querySelector('.vp-link'))return;var sec=t.closest('section[id]');var b=document.createElement('button');b.type='button';b.className='vp-link';b.title='Copiar link desta seção';b.setAttribute('aria-label','Copiar link desta seção');b.textContent='🔗';
 b.onclick=function(e){e.stopPropagation();var u=location.href.split('#')[0]+'#'+sec.id;try{navigator.clipboard.writeText(u).catch(function(){})}catch(x){}b.textContent='✔';setTimeout(function(){b.textContent='🔗'},1600)};t.appendChild(b)})}
function go(){acc();links()}
if(document.readyState==='complete')setTimeout(go,600);else addEventListener('load',function(){setTimeout(go,600)});
setTimeout(go,3500);
}catch(e){console.warn(e)}})();
