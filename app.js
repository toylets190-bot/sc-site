/* Santa Clara EC — js/app.js
   Aplicação principal: sócio, contas, ingressos, loja, notificações e área do sócio.
   Carregado como script clássico, na ordem do index.html (não reordene). */

/* =====================================================================
   SÓCIO, CONTAS E ÁREA DO SÓCIO
   Tudo roda no navegador (localStorage). Site fictício: sem servidor.
   ===================================================================== */
const SOC_PLANS = {
  lobo: { key:'lobo', name:'Sócio Lobo', ico:'🐺', color:'#5b6377', badge:'Ingresso na Matilha', price:24.90, ticketDisc:0.20, ticketMax:2, storeDisc:0.05, mult:1, presale:'lobo',
    perks:['20% de desconto em até 2 ingressos por jogo, em qualquer setor','Carteirinha virtual oficial com QR Code','Pré-venda com prioridade 3','Direito a voto nas pesquisas do clube','5% de desconto na Loja Oficial'] },
  terror: { key:'terror', name:'Sócio Terror', ico:'⚡', color:'#3b82c4', badge:'Mais popular', price:54.90, ticketDisc:0.50, ticketMax:2, storeDisc:0.10, mult:1.5, presale:'terror', feat:true,
    perks:['50% de desconto em até 2 ingressos por jogo','Pré-venda com prioridade 2 (clássico do vale)','10% de desconto na Loja Oficial','Tour anual na Toca do Lobo, com agendamento','Carteirinha com QR Code exclusivo','Pontos SCEC x1,5 em cada compra'] },
  vale: { key:'vale', name:'Sócio Vale', ico:'👑', color:'#a0622e', badge:'Exclusivo', price:109.90, ticketFree:1, extraDisc:0.25, extraMax:3, storeDisc:0.20, mult:2, presale:'vale',
    perks:['1 ingresso gratuito por jogo, em qualquer setor, inclusive o camarote','Camarote com vaga exclusiva e tour pelos bastidores 2h antes','Até 3 acompanhantes com 25% de desconto','Pré-venda com prioridade máxima','20% de desconto na Loja Oficial e pontos SCEC x2','Camisa oficial autografada por ano e encontro com o elenco 1x ao ano'] }
};
const SOC_BY_NAME = Object.fromEntries(Object.values(SOC_PLANS).map(p => [p.name, p]));
const SOC_PRESALE = { name:'Clássico do Vale', when:'25 de outubro • 16:00', open:{ vale:'2026-09-29T00:00', terror:'2026-09-30T10:00', lobo:'2026-10-01T10:00', publico:'2026-10-02T10:00' } };
const SOC_MEET = ['14 de novembro de 2026', '20 de fevereiro de 2027'];
const SOC_REWARDS = [
  { id:'loja10', t:'Cupom de R$ 10 na Loja', cost:300, coupon:10 },
  { id:'loja25', t:'Cupom de R$ 25 na Loja', cost:700, coupon:25 },
  { id:'vale-verde', t:'Vale-ingresso: 1 entrada no Setor Verde', cost:500, ticket:'VERDE' }
];
let socCycle = 'mensal', ACC = {}, socPending = null, socUseCoupon = true;
try { ACC = JSON.parse(localStorage.getItem('scec_accounts') || '{}') || {}; } catch (e) { ACC = {}; }

const $s = id => document.getElementById(id);
const socMoney = v => 'R$ ' + (Math.round(v * 100) / 100).toFixed(2).replace('.', ',');
const socEsc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const isLogged = () => !!(userSession && !userSession.guest);
const socPlan = () => (isLogged() && !socSuspended()) ? (SOC_BY_NAME[userSession.plan] || null) : null;
function socPersist() { try { localStorage.setItem('scec_accounts', JSON.stringify(ACC)); } catch (e) {} }
function socSave() {
  if (isLogged()) socPersist();
  else { try { localStorage.setItem('scec_guest', JSON.stringify({ cart: userSession.cart || [] })); } catch (e) {} }
}
const _origSetStored = window.setStored;
window.setStored = function (k, v) { if (k === 'scec_user') socSave(); else _origSetStored(k, v); };

function socToast(msg) {
  const t = $s('socToast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(socToast._t); socToast._t = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ---------- Sessão ---------- */
function socGuest() {
  let cart = []; try { cart = (JSON.parse(localStorage.getItem('scec_guest') || '{}').cart) || []; } catch (e) {}
  return { guest:true, name:'Visitante', plan:null, code:'', points:0, tickets:[], cart };
}
function socNormalize(a) {
  a.points = a.points || 0; a.tickets = a.tickets || []; a.cart = a.cart || []; a.coupons = a.coupons || [];
  a.benefits = a.benefits || {}; a.invoices = a.invoices || []; a.log = a.log || []; a.presales = a.presales || []; a.saved = a.saved || 0; a.plan = a.plan || null;
  return a;
}
function socSessionEmail() {
  try {
    const raw = localStorage.getItem('scec_session') || sessionStorage.getItem('scec_session');
    const s = JSON.parse(raw || 'null');
    if (s && s.exp > Date.now() && ACC[s.email]) return s.email;
  } catch (e) {}
  return null;
}
function socLoad() {
  const em = socSessionEmail();
  if (em) userSession = socNormalize(ACC[em]); else userSession = socGuest();
  socRefreshUI();
}
function socStartSession(email, remember) {
  const s = JSON.stringify({ email, exp: Date.now() + (remember ? 30 : 1) * 86400000 });
  try { localStorage.removeItem('scec_session'); sessionStorage.removeItem('scec_session'); (remember ? localStorage : sessionStorage).setItem('scec_session', s); } catch (e) {}
}
function socLogout() {
  try { localStorage.removeItem('scec_session'); sessionStorage.removeItem('scec_session'); } catch (e) {}
  closeModal('memberAreaModal'); userSession = socGuest(); socRefreshUI(); socToast('Você saiu da sua conta. Até o próximo jogo!');
}
function socRefreshUI() {
  const b = $s('fanAreaBtn');
  if (b) b.innerHTML = isLogged() ? '<svg class="icon"><use href="#i-shield"></use></svg> ' + String(userSession.name.split(' ')[0]).replace(/[<>&]/g, '') : '<svg class="icon"><use href="#i-user"></use></svg> Entrar';
  const mm = document.querySelector('#mobileMenu button.btn-primary');
  if (mm) mm.innerHTML = isLogged() ? '<svg class="icon"><use href="#i-shield"></use></svg> Área do Sócio' : '<svg class="icon"><use href="#i-user"></use></svg> Entrar';
  const bn = $s('ticketBuyerName'); if (bn && isLogged() && !bn.value) bn.value = userSession.name;
  try { updateFanBadges(); } catch (e) {}
  socRenderSocio();
  try { renderStore(); } catch (e) {}
  if (typeof updateTicketSummary === 'function') try { updateTicketSummary(); } catch (e) {}
}

/* ---------- Hash de senha (PBKDF2 quando disponível) ---------- */
async function socHash(pass, salt) {
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name:'PBKDF2', salt:enc.encode(salt), iterations:120000, hash:'SHA-256' }, key, 256);
    return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    let h = 5381; const s = salt + pass;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return 'x' + (h >>> 0).toString(16);
  }
}
const socSalt = () => Array.from(crypto.getRandomValues ? crypto.getRandomValues(new Uint8Array(12)) : Array.from({ length:12 }, () => Math.floor(Math.random() * 256))).map(b => b.toString(16).padStart(2, '0')).join('');
function socStrength(p) {
  let s = 0; if (p.length >= 8) s++; if (p.length >= 12) s++; if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++; if (/\d/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
  if (/^(12345678|senha123|password|qwerty12|santaclara)/i.test(p)) s = Math.min(s, 1);
  return Math.min(4, s);
}
function socPassOk(p) { return p.length >= 8 && /[A-Za-z]/.test(p) && /\d/.test(p); }
function socMeter(p) {
  const s = socStrength(p), bar = $s('authMeterBar');
  bar.style.width = (p ? (s + 1) * 20 : 0) + '%';
  bar.style.background = ['#e5675f', '#e5675f', '#c9a84c', '#5bb974', '#2e9e4f'][s];
  $s('authMeterTxt').textContent = p ? ['Muito fraca', 'Fraca', 'Média', 'Boa', 'Forte'][s] + (socPassOk(p) ? '' : ' — use 8+ caracteres com letras e números') : 'Mínimo 8 caracteres, com letras e números.';
}
function socTogglePass(id, btn) { const i = $s(id); i.type = i.type === 'password' ? 'text' : 'password'; btn.textContent = i.type === 'password' ? '👁' : '🙈'; }
const socDigits = t => String(t || '').replace(/\W/g, '').toLowerCase();
const socEmailOk = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
function socLocks() { try { return JSON.parse(localStorage.getItem('scec_lock') || '{}'); } catch (e) { return {}; } }

/* ---------- Telas de autenticação ---------- */
function socOpenAuth(tab, opts) {
  opts = opts || {}; socPending = opts.then || null;
  const n = $s('authNotice'); n.style.display = opts.notice ? 'block' : 'none'; n.textContent = opts.notice || '';
  socAuthTab(tab || 'login'); openModal('authModal');
  setTimeout(() => { const f = $s(tab === 'register' ? 'authRegName' : 'authLoginEmail'); if (f) f.focus(); }, 60);
}
function socAuthTab(t) {
  ['login', 'register', 'recover'].forEach(k => { $s('auth' + k[0].toUpperCase() + k.slice(1)).style.display = k === t ? 'block' : 'none'; });
  $s('authTabLogin').classList.toggle('on', t === 'login'); $s('authTabRegister').classList.toggle('on', t === 'register');
  ['authLoginErr', 'authRegErr', 'authRecErr'].forEach(i => $s(i).textContent = '');
}
function socAfterAuth(msg) {
  closeModal('authModal'); socLoad(); socToast(msg);
  const cb = socPending; socPending = null; if (cb) setTimeout(cb, 250);
}
async function socLogin(e) {
  e.preventDefault();
  const email = $s('authLoginEmail').value.trim().toLowerCase(), pass = $s('authLoginPass').value, err = $s('authLoginErr');
  if (!socEmailOk(email) || !pass) { err.textContent = 'Informe e-mail e senha.'; return; }
  const L = socLocks(), l = L[email] || { n:0, until:0 };
  if (l.until > Date.now()) { err.textContent = `Muitas tentativas. Tente de novo em ${Math.ceil((l.until - Date.now()) / 1000)}s.`; return; }
  const a = ACC[email];
  const ok = a && (await socHash(pass, a.salt)) === a.hash;
  if (!ok) {
    l.n = (l.n || 0) + 1; if (l.n >= 5) { l.until = Date.now() + 60000; l.n = 0; }
    L[email] = l; try { localStorage.setItem('scec_lock', JSON.stringify(L)); } catch (x) {}
    err.textContent = l.until > Date.now() ? 'Conta bloqueada por 60s após várias tentativas.' : 'E-mail ou senha incorretos.'; return;
  }
  delete L[email]; try { localStorage.setItem('scec_lock', JSON.stringify(L)); } catch (x) {}
  a.lastLogin = new Date().toISOString(); socPersist();
  socStartSession(email, $s('authRemember').checked); $s('authLoginPass').value = '';
  socAfterAuth(`Bem-vindo de volta, ${a.name.split(' ')[0]}!`);
}
async function socRegister(e) {
  e.preventDefault();
  const name = $s('authRegName').value.trim().replace(/\s+/g, ' '), email = $s('authRegEmail').value.trim().toLowerCase(), doc = $s('authRegDoc').value.trim();
  const p1 = $s('authRegPass').value, p2 = $s('authRegPass2').value, err = $s('authRegErr');
  if (name.split(' ').length < 2 || name.length < 5) { err.textContent = 'Informe nome e sobrenome.'; return; }
  if (!socEmailOk(email)) { err.textContent = 'E-mail inválido.'; return; }
  if (socDigits(doc).length < 5) { err.textContent = 'Informe um CPF ou documento (mín. 5 caracteres).'; return; }
  if (!socPassOk(p1)) { err.textContent = 'A senha precisa de 8+ caracteres, com letras e números.'; return; }
  if (p1 !== p2) { err.textContent = 'As senhas não coincidem.'; return; }
  if (!$s('authTerms').checked) { err.textContent = 'Aceite os termos para continuar.'; return; }
  if (ACC[email]) { err.textContent = 'Já existe uma conta com este e-mail. Tente entrar.'; return; }
  const salt = socSalt();
  ACC[email] = socNormalize({ name, email, docMasked: (() => { const d = socDigits(doc); return d.length === 11 ? '•••.•••.•••-' + d.slice(-2) : '••••' + d.slice(-3); })(), docHash: await socHash(socDigits(doc), salt + 'doc'), salt, hash: await socHash(p1, salt),
    code: 'SCEC-2026-' + String(1000 + Math.floor(Math.random() * 9000)), points:100, created: new Date().toISOString() });
  ACC[email].log = [{ t:'Conta criada (+100 pontos de boas-vindas)', at:new Date().toISOString() }];
  socPersist(); socStartSession(email, true);
  ['authRegPass', 'authRegPass2'].forEach(i => $s(i).value = '');
  socAfterAuth('Conta criada! Você ganhou 100 pontos SCEC.');
}
async function socRecover(e) {
  e.preventDefault();
  const email = $s('authRecEmail').value.trim().toLowerCase(), doc = $s('authRecDoc').value, np = $s('authRecPass').value, err = $s('authRecErr'), a = ACC[email];
  if (!socPassOk(np)) { err.textContent = 'A nova senha precisa de 8+ caracteres, com letras e números.'; return; }
  if (!a || (await socHash(socDigits(doc), a.salt + 'doc')) !== a.docHash) { err.textContent = 'Os dados não conferem.'; return; }
  a.salt = socSalt(); a.docHash = await socHash(socDigits(doc), a.salt + 'doc'); a.hash = await socHash(np, a.salt); socPersist();
  $s('authRecPass').value = ''; $s('authLoginEmail').value = email; socAuthTab('login'); socToast('Senha redefinida. Faça login com a nova senha.');
}


/* ---------- Benefícios efetivos: ingressos ---------- */
function socQuote(plan, sectorKey, qty) {
  const p = SECTOR_DATA[sectorKey].price, sub = p * qty, lines = [];
  let total = sub;
  if (plan && plan.ticketFree) {
    const free = Math.min(plan.ticketFree, qty), extra = Math.min(plan.extraMax, Math.max(0, qty - free)), full = qty - free - extra;
    total = extra * p * (1 - plan.extraDisc) + full * p;
    lines.push(`${free} × ingresso gratuito (${plan.name})`);
    if (extra) lines.push(`${extra} × ${Math.round(plan.extraDisc * 100)}% off (acompanhantes)`);
  } else if (plan) {
    const d = Math.min(plan.ticketMax, qty);
    total = d * p * (1 - plan.ticketDisc) + (qty - d) * p;
    lines.push(`${d} × ${Math.round(plan.ticketDisc * 100)}% off (${plan.name})`);
  }
  total = Math.round(total * 100) / 100;
  return { subtotal:sub, total, saved:Math.round((sub - total) * 100) / 100, lines };
}
window.updateTicketSummary = function () {
  const s = SECTOR_DATA[chosenTicketSector], pl = socPlan(), q = socQuote(pl, chosenTicketSector, ticketQty);
  $s('selectedSectorLabel').textContent = `${s.emoji} ${s.name}`;
  $s('totalTicketPrice').textContent = brl(q.total);
  const sub = $s('ticketTotalDetail');
  if (sub) sub.textContent = `${ticketQty} × ${brl(s.price)} • ${SECTOR_ACCESS[chosenTicketSector].gate}` + (SECTOR_TAGS[chosenTicketSector] ? ' • ' + SECTOR_TAGS[chosenTicketSector] : '');
  let note = $s('ticketMemberNote');
  if (!note && sub) { note = document.createElement('div'); note.id = 'ticketMemberNote'; sub.after(note); }
  if (note) {
    note.style.cssText = 'margin-top:10px;padding:9px 12px;border-radius:8px;font-size:0.78rem;';
    if (pl) { note.style.background = 'rgba(46,158,79,.14)'; note.style.border = '1px solid #2e9e4f'; note.innerHTML = `💚 <strong>Benefício ${pl.name} aplicado</strong>: ${q.lines.join(' + ')}. ${q.saved > 0 ? 'Você economiza <strong>' + brl(q.saved) + '</strong>.' : ''}`; }
    else { note.style.background = 'rgba(201,168,76,.12)'; note.style.border = '1px solid var(--club-gold)'; note.innerHTML = `🐺 ${isLogged() ? 'Você ainda não é sócio.' : 'Faça login para emitir seu ingresso.'} <a href="#socio" style="color:var(--club-gold);font-weight:800;">Seja sócio e pague até 50% menos ou nada →</a>`; }
  }
  const pn = $s('ticketSectorPerkNote');
  if (s.perk) { pn.style.display = 'block'; pn.textContent = s.perk; } else pn.style.display = 'none';
};
const _origTicketCheckout = window.handleTicketCheckout;
window.handleTicketCheckout = function (e) {
  e.preventDefault();
  if (!isLogged()) {
    socOpenAuth('login', { notice:'Entre ou crie sua conta para emitir o ingresso e usar seus benefícios.', then: () => { const f = $s('ticketOrderForm'); if (f && f.requestSubmit) f.requestSubmit(); } });
    return;
  }
  const pl = socPlan(), q = socQuote(pl, chosenTicketSector, ticketQty), n0 = userSession.tickets.length;
  _origTicketCheckout(e);
  const t = userSession.tickets[n0];
  if (t) {
    t.paid = q.total; t.saved = q.saved; t.plan = pl ? pl.name : null;
    if (pl && pl.mult > 1) userSession.points += Math.round(50 * ticketQty * (pl.mult - 1));
    userSession.saved = (userSession.saved || 0) + q.saved;
    socLog(`Ingresso emitido: ${t.sectorName} (${t.quantity}x, ${socMoney(q.total)})`); socSave(); socToast(pl ? `Ingresso emitido. Economia de ${brl(q.saved)} com o ${pl.name}!` : 'Ingresso emitido e salvo na sua conta.');
  }
};

/* ---------- Benefícios efetivos: loja ---------- */
function socCartQuote() {
  const sub = userSession.cart.reduce((n, i) => n + i.price * (i.qty || 1), 0), pl = socPlan();
  const disc = pl ? Math.round(sub * pl.storeDisc * 100) / 100 : 0;
  const cp = isLogged() ? (userSession.coupons || []).find(c => !c.used) : null;
  const cpv = cp && socUseCoupon ? Math.min(cp.value, sub - disc) : 0;
  return { sub, disc, cp, cpv, total:Math.max(0, sub - disc - cpv), pl };
}
window.renderCartModal = function () {
  const cont = $s('cartItemsContainer');
  if (!userSession.cart.length) { cont.innerHTML = '<p style="color:var(--club-muted); font-size:0.9rem;">Sua sacola está vazia.</p>'; $s('cartTotalPrice').textContent = 'R$ 0,00'; return; }
  const q = socCartQuote();
  cont.innerHTML = userSession.cart.map((item, idx) => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--club-dark); padding:10px; border-radius:var(--radius-sm);">
      <div><strong style="font-size:0.85rem;">${socEsc(item.name)}</strong><div style="color:var(--club-gold); font-size:0.8rem;">${socMoney(item.price)}</div></div>
      <button onclick="removeFromCart(${idx})" style="background:none; border:none; color:var(--club-accent); font-size:0.8rem; cursor:pointer;">Remover</button>
    </div>`).join('') + `<div class="cart-sum">
      <div><span>Subtotal</span><span>${socMoney(q.sub)}</span></div>
      ${q.pl ? `<div class="ok"><span>${q.pl.name} (${Math.round(q.pl.storeDisc * 100)}% off)</span><span>− ${socMoney(q.disc)}</span></div>` : `<div><span style="color:var(--club-muted)">${isLogged() ? 'Sócios têm de 5% a 20% de desconto na loja.' : 'Entre na sua conta para usar benefícios.'}</span><span></span></div>`}
      ${q.cp ? `<label style="display:flex;gap:6px;align-items:center;cursor:pointer;"><input type="checkbox" ${socUseCoupon ? 'checked' : ''} onchange="socUseCoupon=this.checked;renderCartModal()"> Usar cupom de ${socMoney(q.cp.value)}${q.cpv ? ' (− ' + socMoney(q.cpv) + ')' : ''}</label>` : ''}
    </div>`;
  $s('cartTotalPrice').textContent = socMoney(q.total);
};
const _origStoreCheckout = window.handleStoreCheckout;
window.handleStoreCheckout = function () {
  if (!userSession.cart.length) return alert('Seu carrinho está vazio.');
  if (!isLogged()) { closeModal('cartModal'); socOpenAuth('login', { notice:'Entre para finalizar o pedido e usar seus descontos de sócio.', then: () => { renderCartModal(); openModal('cartModal'); } }); return; }
  const q = socCartQuote();
  if (q.cp && q.cpv) q.cp.used = true;
  userSession.saved = (userSession.saved || 0) + q.disc + q.cpv;
  const mult = q.pl ? q.pl.mult : 1;
  _origStoreCheckout();
  if (mult > 1) userSession.points += Math.round(150 * (mult - 1));
  socLog(`Pedido da loja: ${socMoney(q.total)}`); socSave(); socToast(`Pedido feito! Total ${socMoney(q.total)}${q.disc + q.cpv > 0 ? ' — você economizou ' + socMoney(q.disc + q.cpv) : ''}.`);
};

/* ---------- Adesão ao plano ---------- */
window.openMembershipJoinModal = function (planName) {
  const pl = SOC_BY_NAME[planName]; if (!pl) return;
  if (!isLogged()) { socOpenAuth('register', { notice:`Crie sua conta gratuita para aderir ao ${pl.name}.`, then: () => openMembershipJoinModal(planName) }); return; }
  const same = userSession.plan === pl.name, val = socCycle === 'anual' ? pl.price * 10 : pl.price;
  document.querySelector('#membershipModal .modal-card').innerHTML = `
    <button class="modal-close" aria-label="Fechar" onclick="closeModal('membershipModal')" aria-label="Fechar">✕</button>
    <h3 style="font-family:var(--font-display); font-size:1.6rem; text-transform:uppercase;">${pl.ico} ${same ? 'Você já é ' : 'Adesão: '}${pl.name}</h3>
    <ul class="soc-perks" style="--pc:${pl.color};margin:14px 0;">${pl.perks.map(p => `<li>${p}</li>`).join('')}</ul>
    <div class="soc-toggle"><button type="button" class="${socCycle === 'mensal' ? 'on' : ''}" onclick="socCycle='mensal';openMembershipJoinModal('${pl.name}')">Mensal</button><button type="button" class="${socCycle === 'anual' ? 'on' : ''}" onclick="socCycle='anual';openMembershipJoinModal('${pl.name}')">Anual (−2 meses)</button></div>
    <div class="form-group"><label>Forma de pagamento (simulada)</label><select id="joinPay" class="form-control"><option>Pix</option><option>Cartão de crédito</option><option>Boleto</option></select></div>
    <p style="font-size:0.75rem;color:var(--club-muted);margin-bottom:12px;">Site fictício: nenhum pagamento real é feito nem dado financeiro é guardado. Total: <strong style="color:var(--club-gold)">${socMoney(val)}</strong> ${socCycle === 'anual' ? '/ ano' : '/ mês'}.</p>
    <button type="button" class="btn-primary" style="width:100%;justify-content:center;padding:12px;${same ? 'opacity:.5;' : ''}" ${same ? 'disabled' : ''} onclick="socConfirmJoin('${pl.key}')">${same ? 'Plano atual' : (userSession.plan ? 'Trocar para ' : 'Confirmar adesão ao ') + pl.name}</button>`;
  openModal('membershipModal');
};
window.handleJoinMembership = function (e) { if (e) e.preventDefault(); };
function socConfirmJoin(key) {
  const pl = SOC_PLANS[key], first = !userSession.plan;
  const pay = ($s('joinPay') || {}).value || 'Pix';
  userSession.plan = pl.name; userSession.planSince = new Date().toISOString(); userSession.cycle = socCycle;
  if (first) userSession.points += 500;
  socStartBilling(pl, pay); socLog(first ? `Adesão ao ${pl.name} (+500 pontos)` : `Plano alterado para ${pl.name}`);
  socSave(); closeModal('membershipModal'); socRefreshUI();
  socToast(first ? `Bem-vindo à Matilha! ${pl.name} ativo (+500 pontos).` : `Plano alterado para ${pl.name}.`);
  socOpenArea('painel');
}
window.openFanAreaModal = function () { socOpenArea('painel'); };


/* ---------- Seção pública "Seja Sócio" ---------- */
function socRenderSocio() {
  const root = $s('socioRoot'); if (!root) return;
  const cur = socPlan(), anual = socCycle === 'anual';
  const rows = [
    ['Desconto em ingressos', '20% (até 2)', '50% (até 2)', '1 grátis + 25% (até 3)'],
    ['Camarote com vaga e tour 2h antes', '—', '—', '✔'],
    ['Pré-venda', 'Prioridade 3', 'Prioridade 2', 'Prioridade máxima'],
    ['Desconto na loja', '5%', '10%', '20%'],
    ['Pontos SCEC por compra', 'x1', 'x1,5', 'x2'],
    ['Tour anual na Toca do Lobo', '—', '✔', '✔'],
    ['Camisa autografada e encontro com o elenco', '—', '—', '✔'],
    ['Voto nas pesquisas do clube', '✔', '✔', '✔']
  ];
  root.innerHTML = `
    ${isLogged() ? `<div class="soc-banner"><div>${cur ? `${cur.ico} Você é <strong>${cur.name}</strong>. Seus benefícios já valem no site.` : `👋 Olá, <strong>${socEsc(userSession.name.split(' ')[0])}</strong>! Escolha um plano para ativar seus benefícios.`}</div><button class="btn-primary" onclick="socOpenArea('painel')">Abrir Área do Sócio</button></div>`
      : `<div class="soc-banner"><div>🔐 Já é da Matilha? Entre para ver seus benefícios e ingressos.</div><div style="display:flex;gap:8px;"><button class="btn-outline" onclick="socOpenAuth('login')">Entrar</button><button class="btn-primary" onclick="socOpenAuth('register')">Criar conta grátis</button></div></div>`}
    <div class="soc-stats">
      <div class="soc-stat"><b>12.480</b><span>Sócios na Matilha</span></div>
      <div class="soc-stat"><b>até 100%</b><span>de desconto em ingressos</span></div>
      <div class="soc-stat"><b>x2</b><span>pontos por compra</span></div>
      <div class="soc-stat"><b>1 ano</b><span>de tour, pré-venda e voto</span></div>
    </div>
    <div style="text-align:center;"><div class="soc-toggle" role="group" aria-label="Ciclo de cobrança"><button type="button" class="${anual ? '' : 'on'}" onclick="socCycle='mensal';socRenderSocio()">Mensal</button><button type="button" class="${anual ? 'on' : ''}" onclick="socCycle='anual';socRenderSocio()">Anual • 2 meses grátis</button></div></div>
    <div class="soc-plans">${Object.values(SOC_PLANS).map(p => `
      <div class="soc-plan${p.feat ? ' feat' : ''}" style="--pc:${p.color}">
        <span class="soc-ribbon">${p.badge}</span>
        <div><div class="ico">${p.ico}</div><h3>${p.name}</h3>
        <div class="soc-price">${socMoney(anual ? p.price * 10 : p.price)} <small>/${anual ? 'ano' : 'mês'}</small></div>
        <div class="soc-save">${anual ? 'Economia de ' + socMoney(p.price * 2) + ' por ano' : '&nbsp;'}</div>
        <ul class="soc-perks" style="margin-top:14px;">${p.perks.map(x => `<li>${x}</li>`).join('')}</ul></div>
        <div>${cur && cur.key === p.key ? '<div class="cur">✔ SEU PLANO ATUAL</div>' : ''}
        <button class="${p.feat ? 'btn-primary' : 'btn-outline'}" style="width:100%;justify-content:center;margin-top:8px;" onclick="openMembershipJoinModal('${p.name}')">${cur && cur.key === p.key ? 'Ver meus benefícios' : (cur ? 'Trocar para ' : 'Aderir ao ') + p.name.replace('Sócio ', '')}</button></div>
      </div>`).join('')}</div>
    <div class="soc-block"><h3>Compare os planos</h3><div class="soc-table-wrap"><table class="soc-table"><thead><tr><th>Benefício</th><th>Lobo</th><th>Terror</th><th>Vale</th></tr></thead><tbody>
      ${rows.map(r => `<tr><td>${r[0]}</td>${r.slice(1).map(c => `<td class="${c === '—' ? 'n' : 'y'}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>
    <div class="soc-block"><h3>Quanto você economiza?</h3><div class="soc-calc">
      <div class="soc-calc-row"><label>Jogos por mês: <strong id="calcGamesLbl">2</strong> <input type="range" id="calcGames" min="1" max="4" value="2" oninput="socCalc()"></label>
        <label>Setor: <select id="calcSector" onchange="socCalc()">${Object.entries(SECTOR_DATA).map(([k, s]) => `<option value="${k}"${k === 'CAMAROTE' ? ' selected' : ''}>${s.emoji} ${s.name.split(' — ')[0]}</option>`).join('')}</select></label>
        <label>Acompanhantes por jogo: <select id="calcComp" onchange="socCalc()"><option>0</option><option>1</option><option>2</option><option>3</option></select></label></div>
      <div class="soc-res" id="calcRes"></div>
      <div style="font-size:0.72rem;color:var(--club-muted);">Custo mensal = mensalidade + ingressos. Não inclui o desconto na loja nem os pontos SCEC.</div></div></div>`;
  socCalc();
  try { socRenderDoacao(root); } catch (err) {}
}
function socCalc() {
  const g = +$s('calcGames').value, sec = $s('calcSector').value, qty = 1 + +$s('calcComp').value;
  $s('calcGamesLbl').textContent = g;
  const opts = [{ n:'Sem plano', c:socQuote(null, sec, qty).total * g }].concat(Object.values(SOC_PLANS).map(p => ({ n:p.name, c:p.price + socQuote(p, sec, qty).total * g })));
  const best = Math.min.apply(null, opts.map(o => o.c));
  $s('calcRes').innerHTML = opts.map(o => `<div class="${o.c === best ? 'best' : ''}">${o.n}<b>${socMoney(o.c)}</b>${o.c === best ? 'menor custo' : '/ mês'}</div>`).join('');
}

/* ---------- Área do Sócio ---------- */
let maTab = 'painel';
function socOpenArea(tab) {
  if (!isLogged()) { socOpenAuth('login', { notice:'Entre na sua conta para acessar a Área do Sócio.', then: () => socOpenArea(tab) }); return; }
  maTab = tab || maTab; socRenderArea(); openModal('memberAreaModal');
}
function maPresaleStatus(key) {
  const t = new Date(SOC_PRESALE.open[key]).getTime(), now = Date.now();
  if (now >= t) return { open:true, txt:'Aberta agora' };
  const h = Math.ceil((t - now) / 3600000); return { open:false, txt: h > 47 ? `Abre em ${Math.ceil(h / 24)} dias` : `Abre em ${h}h` };
}
function maBeneficios() {
  const pl = socPlan(), u = userSession, b = u.benefits, out = [];
  if (!pl) return `<div class="ma-item"><strong>Você ainda não tem um plano</strong><p>Escolha um plano para liberar descontos, pré-venda, tour e mais.</p><button class="btn-primary" onclick="closeModal('memberAreaModal');goSection('socio')">Ver planos</button></div>`;
  const auto = (ico, t, d) => `<div class="ma-item" style="--pc:${pl.color}"><div class="top"><strong>${ico} ${t}</strong><span class="ma-tag">Ativo</span></div><p>${d}</p></div>`;
  out.push('<div class="ma-h">Aplicados automaticamente</div><div class="ma-list">');
  out.push(auto('🎟️', 'Desconto em ingressos', pl.ticketFree ? '1 ingresso gratuito por jogo e 25% off para até 3 acompanhantes. Aplicado no valor da compra.' : `${Math.round(pl.ticketDisc * 100)}% off em até ${pl.ticketMax} ingressos por jogo. Aplicado no valor da compra.`));
  out.push(auto('🛍️', 'Desconto na Loja Oficial', `${Math.round(pl.storeDisc * 100)}% off na sacola, mais cupons de pontos.`));
  out.push(auto('⭐', 'Pontos SCEC x' + String(pl.mult).replace('.', ','), 'Ganhe mais pontos em cada ingresso e pedido da loja.'));
  if (pl.key === 'vale') out.push(auto('🧭', 'Camarote com tour', 'Ingresso do camarote inclui vaga exclusiva e tour pelos bastidores 2h antes da partida.'));
  out.push('</div><div class="ma-h">Para você usar</div><div class="ma-list">');
  const ps = maPresaleStatus(pl.presale), done = u.presales.find(x => x.event === SOC_PRESALE.name);
  out.push(`<div class="ma-item" style="--pc:${pl.color}"><div class="top"><strong>🚀 Pré-venda: ${SOC_PRESALE.name}</strong><span class="ma-tag ${ps.open ? '' : 'lock'}">${ps.txt}</span></div><p>${SOC_PRESALE.when}. Sócios compram antes do público geral (abertura ao público: 2 de outubro, 10:00).</p>
    ${done ? `<span class="ma-tag">Reservado • ${done.sector} • ${done.hash}</span>` : ps.open ? `<select id="psSector">${Object.entries(SECTOR_DATA).map(([k, s]) => `<option value="${k}">${s.emoji} ${s.name.split(' — ')[0]} (${socMoney(socQuote(pl, k, 1).total)})</option>`).join('')}</select><button class="btn-primary" onclick="maReservePresale()">Reservar ingresso</button>` : ''}</div>`);
  if (pl.key === 'terror' || pl.key === 'vale') {
    const tr = b.tour; out.push(`<div class="ma-item" style="--pc:${pl.color}"><div class="top"><strong>🧭 Tour anual na Toca do Lobo</strong><span class="ma-tag ${tr ? 'warn' : ''}">${tr ? 'Agendado' : '1 por ano'}</span></div><p>Conheça vestiários, túnel e gramado com guia do clube.</p>
      ${tr ? `<span>${new Date(tr.date + 'T12:00').toLocaleDateString('pt-BR')} às ${tr.time}</span>` : `<input type="date" id="tourDate" min="${new Date().toISOString().slice(0, 10)}"><select id="tourTime">${ESPLANADA_DATA.tourHorarios.map(h => `<option>${h}</option>`).join('')}</select><button class="btn-outline" onclick="maBook('tour')">Agendar</button>`}</div>`);
  }
  if (pl.key === 'vale') {
    const sh = b.shirt, mt = b.meet;
    out.push(`<div class="ma-item" style="--pc:${pl.color}"><div class="top"><strong>👕 Camisa oficial autografada</strong><span class="ma-tag ${sh ? 'warn' : ''}">${sh ? 'Solicitada' : '1 por ano'}</span></div><p>${sh ? 'Pedido feito em ' + new Date(sh.at).toLocaleDateString('pt-BR') + '. Retirada na Central do Torcedor em até 30 dias.' : 'Solicite sua camisa do ano para retirada na Central do Torcedor.'}</p>${sh ? '' : '<button class="btn-outline" onclick="maBook(\'shirt\')">Solicitar camisa</button>'}</div>`);
    out.push(`<div class="ma-item" style="--pc:${pl.color}"><div class="top"><strong>🤝 Encontro com o elenco</strong><span class="ma-tag ${mt ? 'warn' : ''}">${mt ? 'Reservado' : '1 por ano'}</span></div><p>${mt ? 'Sua vaga: ' + mt.slot : 'Escolha a data do encontro deste ano.'}</p>${mt ? '' : `<select id="meetSlot">${SOC_MEET.map(s => `<option>${s}</option>`).join('')}</select><button class="btn-outline" onclick="maBook('meet')">Reservar vaga</button>`}</div>`);
  }
  const vk = new Date().toISOString().slice(0, 7), voted = u.benefits.vote && u.benefits.vote.month === vk;
  out.push(`<div class="ma-item" style="--pc:${pl.color}"><div class="top"><strong>🗳️ Votação: craque do mês</strong><span class="ma-tag ${voted ? 'warn' : ''}">${voted ? 'Voto registrado' : 'Aberta'}</span></div><p>Só sócios votam. Um voto por mês.</p>${maPoll(voted)}</div></div>`);
  return out.join('');
}
function maPollData() {
  let d = {}; try { d = JSON.parse(localStorage.getItem('scec_poll') || '{}'); } catch (e) {}
  return d;
}
function maPoll(voted) {
  const opts = DB.players.slice(0, 5), d = maPollData(), tot = opts.reduce((n, p, i) => n + (d[p.name] || 0) + 8 + i * 3, 0);
  return opts.map((p, i) => { const v = (d[p.name] || 0) + 8 + i * 3, pc = Math.round(100 * v / tot);
    return voted ? `<div style="font-size:0.78rem;">${socEsc(p.name)} <span style="color:var(--club-muted)">${pc}%</span><div class="ma-bar"><i style="width:${pc}%"></i></div></div>` : `<button class="btn-outline" style="margin:0 6px 6px 0;" onclick="maVote(${i})">${socEsc(p.name)}</button>`; }).join('');
}
function maVote(i) {
  const p = DB.players[i], d = maPollData(); d[p.name] = (d[p.name] || 0) + 1;
  try { localStorage.setItem('scec_poll', JSON.stringify(d)); } catch (e) {}
  userSession.benefits.vote = { month:new Date().toISOString().slice(0, 7), pick:p.name }; userSession.points += 20; socLog('Voto: craque do mês'); socSave(); socRenderArea(); socToast(`Voto em ${p.name} registrado (+20 pontos).`);
}
function maBook(kind) {
  const b = userSession.benefits;
  if (kind === 'tour') { const d = $s('tourDate').value; if (!d) return socToast('Escolha uma data para o tour.'); b.tour = { date:d, time:$s('tourTime').value }; }
  if (kind === 'shirt') b.shirt = { at:new Date().toISOString() };
  if (kind === 'meet') b.meet = { slot:$s('meetSlot').value };
  socLog('Benefício registrado: ' + kind); socSave(); socRenderArea(); socToast('Benefício registrado com sucesso!');
}
function maReservePresale() {
  const pl = socPlan(), k = $s('psSector').value, q = socQuote(pl, k, 1), s = SECTOR_DATA[k], hash = 'SCEC-' + Math.random().toString(36).slice(2, 9).toUpperCase() + '-PRE';
  userSession.tickets.push({ name:userSession.name, sector:k, sectorName:`${s.emoji} ${s.name}`, gate:s.gate, quantity:1, hash, date:new Date().toLocaleDateString('pt-BR'), match:SOC_PRESALE.name + ' (pré-venda)', paid:q.total, saved:q.saved, plan:pl.name });
  userSession.presales.push({ event:SOC_PRESALE.name, sector:s.name.split(' — ')[0], hash });
  userSession.points += Math.round(50 * pl.mult); userSession.saved = (userSession.saved || 0) + q.saved; socLog(`Reserva na pré-venda: ${s.name.split(' — ')[0]}`); socSave(); socRenderArea(); socToast(`Reserva confirmada por ${socMoney(q.total)}!`);
}
function maIngressos() {
  const t = userSession.tickets;
  if (!t.length) return `<div class="ma-item"><strong>Nenhum ingresso ainda</strong><p>Seus ingressos e QR Codes aparecem aqui, com o desconto de sócio já aplicado.</p><button class="btn-primary" onclick="closeModal('memberAreaModal');goSection('ingressos')">Comprar ingresso</button></div>`;
  return '<div class="ma-list">' + t.map((x, i) => `<div class="ma-item"><div class="top"><strong>${socEsc(x.match)}</strong><span class="ma-tag">${x.quantity || 1}x</span></div>
    <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;"><div class="ma-qr" id="tkQr${i}" style="background:#fff;padding:5px;border-radius:6px;"></div>
    <div><p style="margin:0;">${socEsc(x.sectorName || 'Setor')} • ${socEsc(x.gate || '')}<br>Emitido em ${socEsc(x.date || '')}${x.paid != null ? '<br>Pago: <strong>' + socMoney(x.paid) + '</strong>' + (x.saved > 0 ? ' <span style="color:#2e9e4f">(economia ' + socMoney(x.saved) + ')</span>' : '') : ''}</p><small style="font-family:monospace;color:var(--club-gold)">${socEsc(x.hash)}</small></div></div></div>`).join('') + '</div>';
}
function maPontos() {
  const u = userSession, pl = socPlan(), nxt = u.points >= 2000 ? null : (u.points >= 500 ? 2000 : 500);
  return `<div class="ma-item"><div class="top"><strong>⭐ ${u.points} pontos SCEC</strong><span class="ma-tag ${pl ? '' : 'lock'}">${pl ? 'x' + String(pl.mult).replace('.', ',') + ' de bônus' : 'sem bônus de plano'}</span></div>
    ${nxt ? `<div class="ma-bar"><i style="width:${Math.min(100, Math.round(100 * u.points / nxt))}%"></i></div><p>Faltam ${nxt - u.points} pontos para o próximo nível.</p>` : '<p>Você é Alfa da Matilha!</p>'}</div>
    <div class="ma-h">Troque seus pontos</div><div class="ma-list">${SOC_REWARDS.map(r => `<div class="ma-item"><div class="top"><strong>${r.t}</strong><span class="ma-tag ${u.points >= r.cost ? '' : 'lock'}">${r.cost} pts</span></div>
      <button class="btn-outline" ${u.points >= r.cost ? '' : 'disabled style="opacity:.5"'} onclick="maRedeem('${r.id}')">Resgatar</button></div>`).join('')}</div>
    ${(u.coupons || []).length ? '<div class="ma-h">Seus cupons</div>' + u.coupons.map(c => `<div class="ma-item"><strong>${socMoney(c.value)} na loja</strong> <span class="ma-tag ${c.used ? 'lock' : ''}">${c.used ? 'usado' : 'disponível — aplicado na sacola'}</span></div>`).join('') : ''}`;
}
function maRedeem(id) {
  const r = SOC_REWARDS.find(x => x.id === id), u = userSession;
  if (!r || u.points < r.cost) return socToast('Pontos insuficientes.');
  u.points -= r.cost;
  if (r.coupon) u.coupons.push({ value:r.coupon, used:false, at:new Date().toISOString() });
  if (r.ticket) { const s = SECTOR_DATA[r.ticket]; u.tickets.push({ name:u.name, sector:r.ticket, sectorName:`${s.emoji} ${s.name}`, gate:s.gate, quantity:1, hash:'SCEC-' + Math.random().toString(36).slice(2, 9).toUpperCase() + '-VALE', date:new Date().toLocaleDateString('pt-BR'), match:VAJ_MATCH.title + ' (vale-ingresso)', paid:0, saved:0 }); }
  socLog('Resgate: ' + r.t); socSave(); socRenderArea(); socToast('Resgate feito! ' + (r.coupon ? 'O cupom já vale na sua sacola.' : 'Veja o ingresso na aba Ingressos.'));
}
/* ---------- Inicialização ---------- */
document.addEventListener('DOMContentLoaded', () => {
  socLoad();
  const b = $s('fanAreaBtn'); if (b) b.onclick = () => (isLogged() ? socOpenArea('painel') : socOpenAuth('login'));
  try { updateTicketSummary(); } catch (e) {}
});


/* ---------- Loja: filtros, tamanhos, quantidade, preço de sócio ---------- */
let storeCat = 'Todos', storeSort = 'rel', storeQuery = '';
const STORE_FREE_SHIP = 300;
window.renderStore = function () {
  const cats = ['Todos'].concat(Array.from(new Set(DB.products.map(p => p.cat))));
  const tb = $s('storeToolbar');
  if (tb && !tb.dataset.ok) {
    tb.dataset.ok = '1'; tb.className = 'store-bar';
    tb.innerHTML = `<input type="search" id="storeSearch" placeholder="Buscar produto..." aria-label="Buscar produto" oninput="storeQuery=this.value;renderStore()">
      <div id="storeChips" style="display:flex;gap:6px;flex-wrap:wrap;"></div>
      <select id="storeSortSel" aria-label="Ordenar" onchange="storeSort=this.value;renderStore()"><option value="rel">Relevância</option><option value="asc">Menor preço</option><option value="desc">Maior preço</option></select>`;
  }
  const ch = $s('storeChips'); if (ch) ch.innerHTML = cats.map(c => `<button type="button" class="store-chip${c === storeCat ? ' on' : ''}" onclick="storeCat='${c}';renderStore()">${c}</button>`).join('');
  let list = DB.products.filter(p => (storeCat === 'Todos' || p.cat === storeCat) && p.name.toLowerCase().includes(storeQuery.toLowerCase().trim()));
  if (storeSort === 'asc') list = list.slice().sort((a, b) => a.price - b.price);
  if (storeSort === 'desc') list = list.slice().sort((a, b) => b.price - a.price);
  const pl = socPlan();
  $s('storeContainer').innerHTML = list.length ? list.map(p => {
    const thumb = p.img ? `<img src="${p.img}" alt="${socEsc(p.name)}" loading="lazy" ${p.imgur ? `data-id="${p.imgur}" data-tried="0" ` : ''}data-emoji="${p.emoji || '🐺'}" onerror="storeImgFail(this)">` : `<span class="product-emoji">${p.emoji || '🐺'}</span>`;
    const price = pl
      ? `<div class="product-price"><span class="product-old">${socMoney(p.price)}</span>${socMoney(p.price * (1 - pl.storeDisc))}</div><div class="product-member">✔ Preço ${pl.name} (−${Math.round(pl.storeDisc * 100)}%)</div>`
      : `<div class="product-price">${socMoney(p.price)}</div><div class="product-member tease">Sócio Vale paga ${socMoney(p.price * 0.8)}</div>`;
    const sizes = p.sizes ? `<div class="size-row" role="radiogroup" aria-label="Tamanho">${p.sizes.map((z, i) => `<label><input type="radio" name="sz${p.id}" value="${z}" ${i === 1 ? 'checked' : ''}><span>${z}</span></label>`).join('')}</div>` : '';
    return `<div class="product-card">${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      <div class="product-thumb">${thumb}</div>
      <div class="product-details"><div class="product-name">${socEsc(p.name)}</div>${price}${sizes}
        <button class="btn-primary" style="margin-top:12px; justify-content:center; width:100%;" onclick="addToCart(${p.id})">Adicionar à sacola</button></div></div>`;
  }).join('') : '<p style="color:var(--club-muted)">Nenhum produto encontrado.</p>';
};
function storeImgFail(img) {
  const exts = ['jpeg', 'png', 'webp', 'gif'], n = parseInt(img.dataset.tried || '0', 10);
  if (img.dataset.id && n < exts.length) { img.dataset.tried = n + 1; img.src = `https://i.imgur.com/${img.dataset.id}.${exts[n]}`; return; }
  img.outerHTML = `<span class="product-emoji">${img.dataset.emoji || '🐺'}</span>`;
}
window.addToCart = function (id) {
  const p = DB.products.find(x => x.id === id); if (!p) return;
  const r = document.querySelector(`input[name="sz${id}"]:checked`), size = r ? r.value : null;
  const line = userSession.cart.find(i => i.id === id && (i.size || null) === size);
  if (line) line.qty = (line.qty || 1) + 1;
  else userSession.cart.push({ id:p.id, name:p.name, price:p.price, img:p.img, size, qty:1 });
  setStored('scec_user', userSession); updateFanBadges();
  socToast(`${p.name}${size ? ' (' + size + ')' : ''} adicionado à sacola.`);
};
function socCartQty(idx, d) {
  const it = userSession.cart[idx]; if (!it) return;
  it.qty = (it.qty || 1) + d;
  if (it.qty < 1) userSession.cart.splice(idx, 1);
  setStored('scec_user', userSession); renderCartModal(); updateFanBadges();
}
const _origBadges = window.updateFanBadges;
window.updateFanBadges = function () {
  _origBadges();
  const b = $s('cartCountBadge'); if (b) b.textContent = userSession.cart.reduce((n, i) => n + (i.qty || 1), 0);
};
window.renderCartModal = function () {
  const cont = $s('cartItemsContainer');
  if (!userSession.cart.length) { cont.innerHTML = '<p style="color:var(--club-muted); font-size:0.9rem;">Sua sacola está vazia.</p>'; $s('cartTotalPrice').textContent = 'R$ 0,00'; return; }
  const q = socCartQuote(), left = Math.max(0, STORE_FREE_SHIP - q.total);
  cont.innerHTML = userSession.cart.map((item, idx) => `
    <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; background:var(--club-dark); padding:10px; border-radius:var(--radius-sm);">
      <div><strong style="font-size:0.85rem;">${socEsc(item.name)}${item.size ? ' • ' + item.size : ''}</strong>
        <div style="color:var(--club-gold); font-size:0.8rem;">${socMoney(item.price * (item.qty || 1))}</div>
        <div class="cart-qty"><button type="button" onclick="socCartQty(${idx},-1)" aria-label="Diminuir">−</button><span>${item.qty || 1}</span><button type="button" onclick="socCartQty(${idx},1)" aria-label="Aumentar">+</button></div></div>
      <button onclick="removeFromCart(${idx})" style="background:none; border:none; color:var(--club-accent); font-size:0.8rem; cursor:pointer;">Remover</button>
    </div>`).join('') + `<div class="cart-sum">
      <div><span>Subtotal</span><span>${socMoney(q.sub)}</span></div>
      ${q.pl ? `<div class="ok"><span>${q.pl.name} (${Math.round(q.pl.storeDisc * 100)}% off)</span><span>− ${socMoney(q.disc)}</span></div>` : `<div><span style="color:var(--club-muted)">${isLogged() ? 'Sócios têm de 5% a 20% de desconto na loja.' : 'Entre na sua conta para usar benefícios.'}</span><span></span></div>`}
      ${q.cp ? `<label style="display:flex;gap:6px;align-items:center;cursor:pointer;"><input type="checkbox" ${socUseCoupon ? 'checked' : ''} onchange="socUseCoupon=this.checked;renderCartModal()"> Usar cupom de ${socMoney(q.cp.value)}${q.cpv ? ' (− ' + socMoney(q.cpv) + ')' : ''}</label>` : ''}
      <div class="ship-bar">${left ? `🚚 Faltam <strong>${socMoney(left)}</strong> para frete grátis` : '🚚 <strong style="color:#2e9e4f">Você ganhou frete grátis!</strong>'}<div class="ma-bar"><i style="width:${Math.min(100, Math.round(100 * q.total / STORE_FREE_SHIP))}%"></i></div></div>
    </div>`;
  $s('cartTotalPrice').textContent = socMoney(q.total);
};
document.addEventListener('DOMContentLoaded', () => { try { renderStore(); updateFanBadges(); } catch (e) {} });

/* =====================================================================
   ÁREA DO SÓCIO v2: carteirinha real, financeiro, perfil, atividade
   ===================================================================== */
const MA_TABS = [['painel', '🏠 Início'], ['beneficios', '🎁 Benefícios'], ['ingressos', '🎟️ Ingressos'], ['financeiro', '💳 Financeiro'], ['pontos', '⭐ Pontos'], ['perfil', '👤 Perfil']];
const DAY = 86400000, GRACE = 5;
let maPayId = null, maReceiptId = null, maFlip = false;
const socFmt = d => new Date(d).toLocaleDateString('pt-BR');
function socLog(t) { const u = userSession; u.log = u.log || []; u.log.unshift({ t, at:new Date().toISOString() }); u.log = u.log.slice(0, 40); }

/* ---------- Faturas (mensalidades) ---------- */
function socPlanStep() { return userSession.cycle === 'anual' ? 365 : 30; }
function socStartBilling(pl, method) {
  const u = userSession, val = u.cycle === 'anual' ? pl.price * 10 : pl.price, now = new Date().toISOString();
  u.invoices = (u.invoices || []).map(i => i.status === 'aberta' ? Object.assign(i, { status:'cancelada' }) : i);
  u.payMethod = method || u.payMethod || 'Pix';
  u.invoices.push({ id:'FAT-' + Math.random().toString(36).slice(2, 8).toUpperCase(), plan:pl.name, value:val, due:now, status:'paga', paidAt:now, method:u.payMethod, ref:new Date().toLocaleDateString('pt-BR', { month:'2-digit', year:'numeric' }) });
  socNextInvoice();
}
function socNextInvoice() {
  const u = userSession, pl = SOC_BY_NAME[u.plan]; if (!pl) return;
  if (u.invoices.some(i => i.status === 'aberta')) return;
  const last = u.invoices.filter(i => i.status === 'paga' && i.plan === pl.name).pop(); if (!last) return;
  const due = new Date(new Date(last.due).getTime() + socPlanStep() * DAY);
  u.invoices.push({ id:'FAT-' + Math.random().toString(36).slice(2, 8).toUpperCase(), plan:pl.name, value:u.cycle === 'anual' ? pl.price * 10 : pl.price, due:due.toISOString(), status:'aberta', method:u.payMethod, ref:due.toLocaleDateString('pt-BR', { month:'2-digit', year:'numeric' }) });
}
const socOpenInvoice = () => (userSession.invoices || []).find(i => i.status === 'aberta');
function socInvState(i) {
  if (i.status === 'paga') return ['Paga', ''];
  if (i.status === 'cancelada') return ['Cancelada', 'lock'];
  const late = (Date.now() - new Date(i.due).getTime()) / DAY;
  if (late > GRACE) return ['Vencida', 'bad']; if (late > 0) return ['Em atraso', 'bad'];
  const left = Math.ceil(-late); return [left <= 7 ? `Vence em ${left}d` : 'A vencer', 'warn'];
}
function socSuspended() { const u = userSession; return !!(u && u.plan && (u.invoices || []).some(i => i.status === 'aberta' && (Date.now() - new Date(i.due).getTime()) / DAY > GRACE)); }

/* ---------- Carteirinha ---------- */
function socInitials(n) { return n.split(' ').filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase(); }
function socBarcode(code) {
  let x = 0, bars = '';
  for (const ch of code + code) { const c = ch.charCodeAt(0); [1 + (c % 3), 1 + ((c >> 2) % 2), 1 + ((c >> 3) % 3)].forEach((w, i) => { if (i % 2 === 0) bars += `<rect x="${x}" y="0" width="${w}" height="34" fill="#111"/>`; x += w + 1; }); }
  return `<svg viewBox="0 0 ${x} 34" preserveAspectRatio="none" style="width:100%;height:34px;background:#fff;border-radius:3px;padding:2px 4px">${bars}</svg>`;
}
function maCardHtml() {
  const u = userSession, base = SOC_BY_NAME[u.plan], pl = base, sus = socSuspended(), inv = socOpenInvoice();
  const color = pl ? pl.color : '#3a4560', since = u.planSince ? new Date(u.planSince).toLocaleDateString('pt-BR', { month:'2-digit', year:'numeric' }) : '—';
  const valid = inv ? new Date(new Date(inv.due).getTime() + GRACE * DAY).toLocaleDateString('pt-BR', { month:'2-digit', year:'2-digit' }) : '—';
  const photo = u.photo ? `<img src="${u.photo}" alt="Foto do sócio" style="width:100%;height:100%;object-fit:cover" loading="lazy" decoding="async">` : `<span style="font-family:var(--font-display);font-size:1.6rem">${socInitials(u.name)}</span>`;
  const st = !pl ? 'SEM PLANO' : sus ? 'SUSPENSO' : 'ATIVO';
  return `<div class="mc${maFlip ? ' flip' : ''}" id="maCard" style="--pc:${color}" onclick="maFlip=!maFlip;this.classList.toggle('flip')" role="button" aria-label="Virar carteirinha" tabindex="0">
    <div class="mc-in">
      <div class="mc-f mc-front"><div class="mc-holo"></div>
        <div style="display:flex;align-items:center;gap:8px;"><img src="https://i.imgur.com/HWoq88J.png" alt="" style="width:30px;height:34px;object-fit:contain" onerror="this.style.display='none'" loading="lazy" decoding="async"><div><div style="font-size:0.58rem;letter-spacing:.14em;opacity:.8">SANTA CLARA ESPORTE CLUBE</div><div style="font-family:var(--font-display);font-size:1.15rem;text-transform:uppercase;line-height:1">${pl ? pl.ico + ' ' + pl.name : 'Torcedor Cadastrado'}</div></div></div>
        <div style="display:flex;gap:12px;margin-top:12px;align-items:center;"><div class="mc-photo">${photo}</div>
          <div style="min-width:0"><div style="font-size:0.55rem;opacity:.7;text-transform:uppercase">Nome</div><div style="font-weight:800;font-size:0.9rem;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${socEsc(u.name)}</div>
          <div style="display:flex;gap:14px;margin-top:6px;font-size:0.72rem"><div><div style="font-size:0.5rem;opacity:.7">Nº SÓCIO</div><b style="font-family:monospace">${u.code}</b></div><div><div style="font-size:0.5rem;opacity:.7">DESDE</div><b>${since}</b></div><div><div style="font-size:0.5rem;opacity:.7">VALIDADE</div><b>${valid}</b></div></div></div></div>
        <span class="mc-st ${sus || !pl ? 'off' : ''}">${st}</span><span style="position:absolute;left:16px;bottom:12px;font-size:0.55rem;opacity:.6">Toque para virar</span></div>
      <div class="mc-f mc-back"><div style="height:30px;background:#000;margin:-16px -16px 10px"></div>
        <div style="display:flex;gap:12px;align-items:center;"><div class="ma-qr" id="maQr"></div><div style="font-size:0.62rem;line-height:1.5;opacity:.9">Documento pessoal e intransferível. Apresente com documento de identidade com foto nos portões e na Central do Torcedor. Dúvidas: atendimento ao torcedor na esplanada da Toca do Lobo.</div></div>
        <div style="margin-top:10px">${socBarcode(u.code)}</div><div style="text-align:center;font-family:monospace;font-size:0.7rem;margin-top:3px;letter-spacing:.2em">${u.code}</div></div>
    </div></div>`;
}
function maPhotoPick(inp) {
  const f = inp.files && inp.files[0]; if (!f) return;
  if (!/^image\//.test(f.type)) return socToast('Escolha um arquivo de imagem.');
  const r = new FileReader();
  r.onload = () => { const im = new Image(); im.onload = () => {
    const c = document.createElement('canvas'); c.width = 240; c.height = 300; const x = c.getContext('2d'), k = Math.max(240 / im.width, 300 / im.height);
    x.drawImage(im, (240 - im.width * k) / 2, (300 - im.height * k) / 2, im.width * k, im.height * k);
    userSession.photo = c.toDataURL('image/jpeg', 0.82); socLog('Foto da carteirinha atualizada'); socSave(); socRenderArea(); socToast('Foto atualizada!'); };
    im.onerror = () => socToast('Não foi possível ler a imagem.'); im.src = r.result; };
  r.readAsDataURL(f);
}
/* Modo catraca: QR grande com código que renova a cada 30s */
let gateTimer = null;
function maGateMode() {
  if (socSuspended()) return socToast('Carteirinha suspensa: regularize sua fatura.');
  let g = $s('gateMode');
  if (!g) { g = document.createElement('div'); g.id = 'gateMode'; g.className = 'gate-mode'; document.body.appendChild(g); }
  g.style.display = 'flex';
  const draw = () => {
    const u = userSession, slot = Math.floor(Date.now() / 30000), tok = ((slot * 2654435761) >>> 0).toString(36).toUpperCase().slice(-5), left = 30 - Math.floor((Date.now() / 1000) % 30);
    g.innerHTML = `<button class="gate-x" onclick="maGateClose()" aria-label="Fechar">✕</button><div style="font-weight:800;letter-spacing:.1em;font-size:0.8rem">MODO CATRACA</div><div id="gateQr" style="margin:18px 0"></div><div style="font-family:var(--font-display);font-size:1.5rem;text-transform:uppercase">${socEsc(u.name)}</div><div>${(SOC_BY_NAME[u.plan] || {}).name || 'Torcedor'} • ${u.code}</div><div style="margin-top:14px;font-family:monospace;font-size:1.1rem">${tok}</div><div style="font-size:0.8rem;color:#555;margin-top:4px">Código renova em ${left}s • aumente o brilho da tela</div>`;
    new QRCode($s('gateQr'), { text:`${u.code}|${tok}`, width:min(260), height:min(260) });
  };
  function min(n) { return Math.min(n, window.innerWidth - 80); }
  draw(); clearInterval(gateTimer); gateTimer = setInterval(draw, 1000 * 5);
}
function maGateClose() { clearInterval(gateTimer); const g = $s('gateMode'); if (g) g.style.display = 'none'; }

/* ---------- Abas ---------- */
window.socRenderArea = function () {
  $s('maTabs').innerHTML = MA_TABS.map(t => `<button type="button" class="${t[0] === maTab ? 'on' : ''}" onclick="maTab='${t[0]}';maPayId=null;maReceiptId=null;socRenderArea()">${t[1]}</button>`).join('');
  if (userSession.plan) { socNextInvoice(); }
  $s('maBody').innerHTML = { painel:maPainel, beneficios:maBeneficios, ingressos:maIngressos, financeiro:maFinanceiro, pontos:maPontos, perfil:maPerfil }[maTab]();
  if (maTab === 'painel') { const q = $s('maQr'); if (q) { q.innerHTML = ''; new QRCode(q, { text:userSession.code, width:70, height:70 }); } }
  if (maTab === 'ingressos') userSession.tickets.forEach((t, i) => { const q = $s('tkQr' + i); if (q && !q.innerHTML) new QRCode(q, { text:t.hash, width:96, height:96 }); });
  if (maTab === 'financeiro' && maPayId) { const q = $s('pixQr'); if (q) { q.innerHTML = ''; new QRCode(q, { text:maPixCode(maPayId), width:150, height:150 }); } }
};
function maPainel() {
  const u = userSession, pl = SOC_BY_NAME[u.plan], h = new Date().getHours(), inv = socOpenInvoice(), sus = socSuspended();
  const lvl = u.points >= 2000 ? 'Alfa da Matilha' : u.points >= 500 ? 'Lobo de Elite' : 'Filhote';
  let alert = '';
  if (sus) alert = `<div class="ma-alert bad"><strong>⛔ Benefícios suspensos</strong><br>Sua fatura de ${inv.ref} está vencida. Regularize para reativar descontos, carteirinha e pré-venda.<br><button class="btn-primary" style="margin-top:8px" onclick="maTab='financeiro';maPayId='${inv.id}';socRenderArea()">Regularizar agora</button></div>`;
  else if (inv) { const s = socInvState(inv); if (s[1] !== '') alert = `<div class="ma-alert"><strong>💳 Próxima cobrança: ${socMoney(inv.value)}</strong> • vence em ${socFmt(inv.due)} (${s[0].toLowerCase()})<br><button class="btn-outline" style="margin-top:8px" onclick="maTab='financeiro';socRenderArea()">Ver fatura</button></div>`; }
  const ticketNext = u.tickets.find(t => (t.match || '').includes(vajAdv()));
  const log = (u.log || []).slice(0, 5);
  return `<div style="margin-bottom:14px"><div style="font-size:0.8rem;color:var(--club-muted)">${h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'},</div><div style="font-family:var(--font-display);font-size:1.5rem;text-transform:uppercase">${socEsc(u.name.split(' ')[0])} <span class="ma-tag ${sus || !pl ? 'lock' : ''}" style="vertical-align:middle">${pl ? (sus ? 'Suspenso' : 'Sócio ativo') : 'Sem plano'}</span></div></div>
    ${alert}${maCardHtml()}
    <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:14px 0">
      <button class="btn-primary" onclick="maGateMode()">📲 Modo catraca</button>
      <label class="btn-outline" style="cursor:pointer">📷 ${u.photo ? 'Trocar' : 'Adicionar'} foto<input type="file" accept="image/*" hidden onchange="maPhotoPick(this)"></label></div>
    <div class="ma-kpis"><div class="ma-kpi"><b>${u.points}</b>Pontos SCEC</div><div class="ma-kpi"><b>${u.tickets.length}</b>Ingressos</div><div class="ma-kpi"><b>${socMoney(u.saved || 0)}</b>Economizado</div><div class="ma-kpi"><b style="font-size:1rem">${lvl}</b>Nível</div></div>
    ${pl ? '' : `<div class="ma-item"><strong>Ative seus benefícios</strong><p>Com um plano você paga menos (ou nada) nos ingressos, ganha desconto na loja, pré-venda e muito mais.</p><button class="btn-primary" onclick="closeModal('memberAreaModal');goSection('socio')">Ver planos de sócio</button></div>`}
    <div class="ma-item"><div class="top"><strong>⚽ ${VAJ_MATCH.title}</strong><span class="ma-tag warn">${VAJ_MATCH.dateLabel}</span></div><p>${ticketNext ? '✅ Você tem ingresso: ' + socEsc(ticketNext.sectorName) + '. Portões abrem às ' + VAJ_MATCH.gates + '.' : 'Você ainda não tem ingresso para este jogo. Portões abrem às ' + VAJ_MATCH.gates + '.'}</p>
      <button class="btn-outline" onclick="closeModal('memberAreaModal');goSection('ingressos')">${ticketNext ? 'Comprar mais' : 'Comprar ingresso'}</button> <button class="btn-outline" onclick="closeModal('memberAreaModal');goSection('vou-ao-jogo')">Plano do dia de jogo</button></div>
    <div class="ma-h">Atividade recente</div>${log.length ? '<div class="ma-list">' + log.map(l => `<div class="ma-item" style="padding:9px 12px"><div class="top"><span>${socEsc(l.t)}</span><small style="color:var(--club-muted)">${new Date(l.at).toLocaleDateString('pt-BR')} ${new Date(l.at).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })}</small></div></div>`).join('') + '</div>' : '<p style="color:var(--club-muted);font-size:0.82rem">Suas compras, pagamentos e resgates aparecem aqui.</p>'}`;
}

/* ---------- Financeiro ---------- */
function maPixCode(id) { return `00020126580014BR.GOV.BCB.PIX0136scec-fake-${id.toLowerCase()}5204000053039865802BR5913SANTA CLARA EC6009JEQUITINH62070503***6304TEST`; }
function maFinanceiro() {
  const u = userSession, pl = SOC_BY_NAME[u.plan], inv = (u.invoices || []).slice().reverse();
  if (!pl && !inv.length) return `<div class="ma-item"><strong>Sem cobranças</strong><p>Quando você aderir a um plano, suas faturas aparecem aqui.</p><button class="btn-primary" onclick="closeModal('memberAreaModal');goSection('socio')">Ver planos</button></div>`;
  const cur = pl ? `<div class="ma-item" style="--pc:${pl.color}"><div class="top"><strong>${pl.ico} ${pl.name}</strong><span class="ma-tag ${socSuspended() ? 'bad' : ''}">${socSuspended() ? 'Suspenso' : 'Em dia'}</span></div>
      <p>${socMoney(u.cycle === 'anual' ? pl.price * 10 : pl.price)} / ${u.cycle === 'anual' ? 'ano' : 'mês'} • Forma de pagamento: <strong>${socEsc(u.payMethod || 'Pix')}</strong></p>
      <select id="payChange"><option ${u.payMethod === 'Pix' ? 'selected' : ''}>Pix</option><option ${u.payMethod === 'Cartão de crédito' ? 'selected' : ''}>Cartão de crédito</option><option ${u.payMethod === 'Boleto' ? 'selected' : ''}>Boleto</option></select><button class="btn-outline" onclick="maSetPay()">Alterar forma</button></div>` : '';
  let panel = '';
  if (maPayId) { const i = (u.invoices || []).find(x => x.id === maPayId); if (i && i.status === 'aberta') panel = `<div class="ma-item"><div class="top"><strong>Pagar fatura ${i.ref}</strong><span class="ma-tag">${socMoney(i.value)}</span></div>
      <p>Pix simulado: aponte a câmera do banco para o QR ou copie o código. Nenhum valor real é cobrado.</p><div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center"><div class="ma-qr" id="pixQr"></div><div style="flex:1;min-width:180px"><code style="font-size:0.62rem;word-break:break-all;display:block;margin-bottom:8px">${maPixCode(i.id)}</code>
      <button class="btn-outline" onclick="navigator.clipboard&&navigator.clipboard.writeText('${maPixCode(i.id)}').then(function(){socToast('Código Pix copiado.')},function(){socToast('Não deu para copiar. Selecione e copie o código manualmente.')})">Copiar código</button> <button class="btn-primary" onclick="maPay('${i.id}')">Simular pagamento</button></div></div></div>`; }
  let rec = '';
  if (maReceiptId) { const i = (u.invoices || []).find(x => x.id === maReceiptId); if (i) rec = `<div class="ma-item" style="border-left-color:#2e9e4f"><div class="top"><strong>🧾 Comprovante ${i.id}</strong><button class="auth-link" onclick="maReceiptId=null;socRenderArea()">fechar</button></div>
      <p style="margin:6px 0">${socEsc(i.plan)} • referência ${i.ref}<br>Valor: <strong>${socMoney(i.value)}</strong><br>Pago em ${socFmt(i.paidAt)} via ${socEsc(i.method || 'Pix')}<br>Sócio: ${socEsc(u.name)} (${u.code})<br><small style="color:var(--club-muted)">Documento simulado, sem valor fiscal.</small></p></div>`; }
  return `${cur}${panel}${rec}<div class="ma-h">Faturas</div><div class="ma-list">${inv.map(i => { const s = socInvState(i);
    return `<div class="ma-item"><div class="top"><strong>${i.ref} • ${socMoney(i.value)}</strong><span class="ma-tag ${s[1]}">${s[0]}</span></div><p style="margin:2px 0 6px">${socEsc(i.plan)} • vencimento ${socFmt(i.due)}${i.paidAt ? ' • pago em ' + socFmt(i.paidAt) : ''}</p>
      ${i.status === 'aberta' ? `<button class="btn-primary" onclick="maPayId='${i.id}';socRenderArea()">Pagar</button>` : i.status === 'paga' ? `<button class="btn-outline" onclick="maReceiptId='${i.id}';socRenderArea()">Comprovante</button>` : ''}</div>`; }).join('')}</div>`;
}
function maSetPay() { userSession.payMethod = $s('payChange').value; const o = socOpenInvoice(); if (o) o.method = userSession.payMethod; socLog('Forma de pagamento alterada para ' + userSession.payMethod); socSave(); socRenderArea(); socToast('Forma de pagamento atualizada.'); }
function maPay(id) {
  const u = userSession, i = u.invoices.find(x => x.id === id); if (!i) return;
  const early = Date.now() <= new Date(i.due).getTime();
  i.status = 'paga'; i.paidAt = new Date().toISOString(); i.method = 'Pix'; maPayId = null; maReceiptId = i.id;
  if (early) u.points += 50; socNextInvoice(); socLog(`Fatura ${i.ref} paga (${socMoney(i.value)})`); socSave(); socRefreshUI(); socRenderArea();
  socToast(early ? 'Pagamento confirmado! +50 pontos por pagar em dia.' : 'Pagamento confirmado. Benefícios reativados.');
}

/* ---------- Perfil ---------- */
function socProfilePct() { const u = userSession; return Math.round(100 * [u.photo, u.phone, u.birth, u.city, u.name, u.email].filter(Boolean).length / 6); }
function maPerfil() {
  const u = userSession, pl = SOC_BY_NAME[u.plan], pct = socProfilePct(), pf = u.prefs || { jogos:true, ofertas:true, prevenda:true };
  return `<div class="ma-item"><div class="top"><strong>Perfil ${pct}% completo</strong><span class="ma-tag ${pct === 100 ? '' : 'warn'}">${u.profileBonus ? 'bônus recebido' : '+50 pontos ao completar'}</span></div><div class="ma-bar"><i style="width:${pct}%"></i></div></div>
    <div class="ma-h">Dados cadastrais</div><div class="ma-item">
      <div class="form-group"><label>Nome completo</label><input id="pfName" class="form-control" value="${socEsc(u.name)}"></div>
      <div class="form-group"><label>E-mail</label><input class="form-control" value="${socEsc(u.email)}" disabled></div>
      <div class="form-group"><label>CPF / documento</label><input class="form-control" value="${socEsc(u.docMasked || '••••••')}" disabled></div>
      <div class="form-group"><label>Telefone (WhatsApp)</label><input id="pfPhone" class="form-control" inputmode="tel" placeholder="(38) 99999-0000" value="${socEsc(u.phone || '')}" oninput="this.value=socMaskPhone(this.value)"></div>
      <div class="form-group"><label>Data de nascimento</label><input type="date" id="pfBirth" class="form-control" max="${new Date().toISOString().slice(0, 10)}" value="${socEsc(u.birth || '')}"></div>
      <div class="form-group"><label>Cidade / UF</label><input id="pfCity" class="form-control" placeholder="Ex.: Januária / MG" value="${socEsc(u.city || '')}"></div>
      <div class="auth-err" id="pfErr"></div><button class="btn-primary" onclick="maSaveProfile()">Salvar dados</button></div>
    <div class="ma-h">Preferências de comunicação</div><div class="ma-item" style="display:grid;gap:8px">
      ${[['jogos', 'Avisos de jogos e escalações'], ['ofertas', 'Ofertas da loja e do sócio'], ['prevenda', 'Abertura de pré-venda']].map(([k, t]) => `<label style="display:flex;gap:8px;cursor:pointer"><input type="checkbox" ${pf[k] ? 'checked' : ''} onchange="maPref('${k}',this.checked)"> ${t}</label>`).join('')}</div>
    <div class="ma-h">Segurança</div><div class="ma-item"><div class="form-group"><label>Senha atual</label><input type="password" id="cfOld" class="form-control" autocomplete="current-password"></div><div class="form-group"><label>Nova senha</label><input type="password" id="cfNew" class="form-control" autocomplete="new-password"></div><div class="auth-err" id="cfErr"></div><button class="btn-outline" onclick="maChangePass()">Atualizar senha</button>
      <p style="font-size:0.72rem;color:var(--club-muted);margin-top:10px">Último acesso: ${u.lastLogin ? new Date(u.lastLogin).toLocaleString('pt-BR') : 'agora'}</p></div>
    <div class="ma-h">Plano</div><div class="ma-item"><p style="margin:0 0 8px">${pl ? pl.ico + ' ' + pl.name + ' • desde ' + socFmt(u.planSince) : 'Você não tem plano ativo.'}</p><button class="btn-outline" onclick="closeModal('memberAreaModal');goSection('socio')">${pl ? 'Trocar de plano' : 'Ver planos'}</button> ${pl ? '<button class="btn-outline" onclick="maCancelPlan()">Cancelar plano</button>' : ''}</div>
    <div class="ma-h">Conta</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn-primary" onclick="socLogout()">Sair da conta</button><button class="btn-outline" style="border-color:#e5675f;color:#e5675f" onclick="maDelete()">Excluir minha conta</button></div>`;
}
function socMaskPhone(v) { const d = v.replace(/\D/g, '').slice(0, 11); return d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, d.length > 10 ? 7 : 6)}-${d.slice(d.length > 10 ? 7 : 6)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d; }
function maPref(k, v) { userSession.prefs = Object.assign({ jogos:true, ofertas:true, prevenda:true }, userSession.prefs, { [k]:v }); socSave(); }
function maSaveProfile() {
  const u = userSession, n = $s('pfName').value.trim().replace(/\s+/g, ' '), ph = $s('pfPhone').value.trim(), b = $s('pfBirth').value, c = $s('pfCity').value.trim(), err = $s('pfErr');
  if (n.split(' ').length < 2) { err.textContent = 'Informe nome e sobrenome.'; return; }
  if (ph && ph.replace(/\D/g, '').length < 10) { err.textContent = 'Telefone incompleto.'; return; }
  if (b && new Date(b) > new Date()) { err.textContent = 'Data de nascimento inválida.'; return; }
  u.name = n; u.phone = ph; u.birth = b; u.city = c;
  if (socProfilePct() === 100 && !u.profileBonus) { u.profileBonus = true; u.points += 50; socToast('Perfil completo! +50 pontos SCEC.'); } else socToast('Dados salvos.');
  socLog('Dados cadastrais atualizados'); socSave(); socRefreshUI(); socRenderArea();
}
async function maChangePass() {
  const o = $s('cfOld').value, n = $s('cfNew').value, err = $s('cfErr');
  if ((await socHash(o, userSession.salt)) !== userSession.hash) { err.textContent = 'Senha atual incorreta.'; return; }
  if (!socPassOk(n)) { err.textContent = 'A nova senha precisa de 8+ caracteres, com letras e números.'; return; }
  userSession.hash = await socHash(n, userSession.salt); socLog('Senha alterada'); socSave(); $s('cfOld').value = $s('cfNew').value = ''; err.textContent = ''; socToast('Senha atualizada.');
}
function maCancelPlan() {
  if (!confirm('Cancelar seu plano? Descontos e carteirinha de sócio deixam de valer agora. Faturas em aberto serão canceladas.')) return;
  const nm = userSession.plan; userSession.plan = null; userSession.invoices.forEach(i => { if (i.status === 'aberta') i.status = 'cancelada'; });
  socLog(nm + ' cancelado'); socSave(); socRefreshUI(); socRenderArea(); socToast('Plano cancelado.');
}
function maDelete() {
  if (!confirm('Excluir sua conta e todos os dados (ingressos, pontos, faturas)? Isso não pode ser desfeito.')) return;
  delete ACC[userSession.email]; socPersist(); socLogout(); socToast('Conta excluída.');
}


/* ---------- Transmissão: próxima partida, contagem e lembretes ---------- */
const BC_EXTRA = {
  'SportiNet': { chips:['⭐ Transmissão principal', '📺 Vídeo', 'TV 1'], off:-30, note:'Pré-jogo 30 min antes' },
  'SuperSports': { chips:['📺 Vídeo', 'TV 2', 'Alternativa'], off:-30, note:'Pré-jogo 30 min antes' },
  'Pop 96': { chips:['⭐ Recomendada', '🎧 Alta qualidade', '📊 Resultado no site'], off:-60, note:'Pré-jogo 1h antes' },
  'Rádio Oficial do Estádio': { chips:['📡 Acesso a 3 rádios', '🔉 Qualidade menor', 'Sinal oficial'], off:-60, note:'Pré-jogo 1h antes' }
};
const BC_FAQ = [
  ['Qual TV é a principal?', 'A SportiNet é a TV 1, com a transmissão principal do jogo. A SuperSports é a TV 2, a segunda opção.'],
  ['Qual rádio escolher?', 'A Pop 96 tem áudio em alta qualidade e mostra o resultado no próprio site. A Rádio Oficial do Estádio dá acesso a 3 rádios, mas com qualidade mais baixa.'],
  ['O que é a Rádio Oficial do Estádio?', 'É a emissora da Toca do Lobo. Ela distribui o sinal para muitas rádios, por isso um mesmo som chega por várias emissoras.'],
  ['Estou sem TV, e agora?', 'Ouça pela Pop 96 e acompanhe o resultado no site da rádio.'],
  ['Prefiro ir ao estádio.', 'Ótimo! Veja os ingressos e o plano do dia de jogo nas seções Ingressos e Vou ao Jogo.']
];
function bcGet() { try { return JSON.parse(localStorage.getItem('scec_bc_remind') || '{}'); } catch (e) { return {}; } }
function bcState() {
  const k = new Date(VAJ_HOME().date).getTime(), now = Date.now();
  if (now >= k && now <= k + 115 * 60000) return 'live';
  return now > k ? 'done' : 'soon';
}
function bcCountdown() {
  const diff = Math.max(0, new Date(VAJ_HOME().date).getTime() - Date.now());
  return [['dias', Math.floor(diff / 86400000)], ['horas', Math.floor(diff % 86400000 / 3600000)], ['min', Math.floor(diff % 3600000 / 60000)]];
}
function bcHeroHtml() {
  const st = bcState(), M = VAJ_HOME(), ch = DB.broadcast;
  const label = st === 'live' ? 'Ao vivo agora' : st === 'done' ? 'Partida encerrada' : 'Próxima transmissão';
  const rows = [['Pré', 'Pré-jogo ao vivo', -60], ['Jogo', 'Bola rolando', 0], ['Pós', 'Pós-jogo e resumo da partida', 105]].map(r => `<div><b>${fmtMatchTime('16:00', r[2])}</b><span>${r[1]}</span></div>`).join('');
  return `<div><span class="bc-live ${st === 'live' ? 'on' : ''}">${label}</span>
      <h3 style="font-family:var(--font-display);font-size:1.8rem;text-transform:uppercase;margin:12px 0 4px">${M.title}</h3>
      <div style="color:var(--club-muted);font-size:0.85rem">${M.comp} • 📅 ${M.dateLabel}</div>
      <div style="font-size:0.8rem;margin-top:8px">📺 <strong>SportiNet</strong> (TV 1) • <strong>SuperSports</strong> (TV 2) • 🎧 <strong>Pop 96</strong></div>
      ${st === 'soon' ? `<div class="bc-count" id="bcCount">${bcCountdown().map(c => `<div><b>${String(c[1]).padStart(2, '0')}</b><span>${c[0]}</span></div>`).join('')}</div>` : '<div style="height:14px"></div>'}
      <div style="display:flex;flex-wrap:wrap;gap:8px"><button class="btn-primary" onclick="bcRemind('geral')">🔔 Me lembrar do jogo</button><button class="btn-outline" onclick="bcShare()">💬 Chamar a Matilha</button></div></div>
    <div class="bc-sched"><strong style="font-size:0.72rem;text-transform:uppercase;letter-spacing:.08em;color:var(--club-muted)">Programação do dia</strong>${rows}</div>`;
}
window.renderBroadcast = function () {
  const rem = bcGet(), st = bcState(), k = new Date(VAJ_HOME().date).getTime();
  $s('broadcastHero').innerHTML = `<div class="bc-hero">${bcHeroHtml()}</div>`;
  $s('broadcastList').innerHTML = DB.broadcast.map(b => {
    const x = BC_EXTRA[b.name] || { chips:['🆓 Grátis'], off:0, note:'' }, at = new Date(k + x.off * 60000), on = !!rem[b.name];
    const live = st === 'live' && k + x.off * 60000 <= Date.now();
    return `<div class="sponsor-card">
      <div class="sponsor-header">${b.imgur ? `<img loading="lazy" decoding="async" src="${b.logo}" alt="${b.name}" class="sponsor-logo" data-id="${b.imgur}" data-tried="0" data-emoji="${b.icon}" onerror="bcLogoFail(this)" loading="lazy" decoding="async">` : `<span class="sponsor-logo-placeholder" style="font-size:1.7rem">${b.icon}</span>`}<div><div class="sponsor-tier">${b.tier}</div><div class="sponsor-name">${b.name}</div></div></div>
      <p class="sponsor-desc">${b.desc}</p>
      <div class="bc-chips">${x.chips.map(c => `<span class="sector-tag" style="--sector-color:var(--club-accent)">${c}</span>`).join('')}</div>
      <div style="font-size:0.8rem;margin-bottom:10px">${live ? '<strong style="color:#e5675f">🔴 No ar agora</strong>' : `⏰ Começa às <strong>${at.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })}</strong> • ${x.note}`}</div>
      <button class="${on ? 'btn-primary' : 'btn-outline'}" style="width:100%;justify-content:center" onclick="bcRemind('${b.name.replace(/'/g, "\\'")}')">${on ? '🔔 Lembrete ativo' : '🔔 Lembrar desta transmissão'}</button></div>`;
  }).join('');
  $s('broadcastFaq').innerHTML = BC_FAQ.map(([q, r]) => `<details><summary>${q}</summary><p>${r}</p></details>`).join('');
};
function bcLogoFail(img) {
  const exts = ['jpeg', 'png', 'webp', 'gif'], n = parseInt(img.dataset.tried || '0', 10);
  if (n < exts.length) { img.dataset.tried = n + 1; img.src = `https://i.imgur.com/${img.dataset.id}.${exts[n]}`; return; }
  img.outerHTML = `<span class="sponsor-logo-placeholder" style="font-size:1.7rem">${img.dataset.emoji}</span>`;
}
function bcRemind(name) {
  const rem = bcGet(), x = BC_EXTRA[name] || { off:-30 };
  rem[name] = true; try { localStorage.setItem('scec_bc_remind', JSON.stringify(rem)); } catch (e) {}
  const start = new Date(new Date(VAJ_HOME().date).getTime() + x.off * 60000), end = new Date(new Date(VAJ_HOME().date).getTime() + 115 * 60000);
  const f = d => d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + 'T' + String(d.getHours()).padStart(2, '0') + String(d.getMinutes()).padStart(2, '0') + '00';
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SCEC//Transmissao//PT', 'BEGIN:VEVENT', 'UID:scec-tv-' + start.getTime() + '@scec', 'DTSTAMP:' + f(new Date()), 'DTSTART:' + f(start), 'DTEND:' + f(end),
    'SUMMARY:' + VAJ_HOME().title + (name === 'geral' ? '' : ' — ' + name), 'DESCRIPTION:' + VAJ_HOME().comp + '. Assista na SportiNet (TV 1) ou SuperSports (TV 2) e ouça a Pop 96.', 'BEGIN:VALARM', 'TRIGGER:-PT15M', 'ACTION:DISPLAY', 'DESCRIPTION:O jogo do Santa Clara já vai começar!', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const l = document.createElement('a'); l.href = URL.createObjectURL(new Blob([ics], { type:'text/calendar' })); l.download = 'transmissao-scec.ics';
  document.body.appendChild(l); l.click(); l.remove();
  socToast('Lembrete salvo no seu calendário, com alerta 15 min antes.'); renderBroadcast();
}
function bcShare() { window.open('https://wa.me/?text=' + encodeURIComponent(`🐺 ${VAJ_HOME().title}\n${VAJ_HOME().comp}\n📅 ${VAJ_HOME().dateLabel}\nAssista na SportiNet (TV 1) ou SuperSports (TV 2) e ouça a Pop 96. Bora, Matilha!`), '_blank'); }
document.addEventListener('DOMContentLoaded', () => {
  try { renderBroadcast(); } catch (e) {}
  setInterval(() => { const c = $s('bcCount'); if (c && bcState() === 'soon') c.innerHTML = bcCountdown().map(x => `<div><b>${String(x[1]).padStart(2, '0')}</b><span>${x[0]}</span></div>`).join(''); else if (bcState() !== 'soon') { try { renderBroadcast(); } catch (e) {} } }, 30000);
});

/* ---------- Extras: elenco, comunidade, navegação e hero ---------- */
let squadPos = 'TODOS', squadQ = '', squadSort = 'num';
window.renderSquad = function (filter) {
  if (typeof filter === 'string') squadPos = filter;
  const box = $s('squadContainer');
  if (!$s('squadTools')) box.insertAdjacentHTML('beforebegin', `<div class="squad-tools" id="squadTools"><input type="search" id="squadSearch" placeholder="Buscar por nome, apelido ou número..." aria-label="Buscar jogador" oninput="squadQ=this.value;renderSquad()"><select aria-label="Ordenar" onchange="squadSort=this.value;renderSquad()"><option value="num">Ordenar por número</option><option value="name">Ordenar por nome</option></select><small id="squadCount"></small></div>`);
  const q = squadQ.toLowerCase().trim().replace(/^#/, '');
  let list = DB.players.filter(p => (squadPos === 'TODOS' || p.pos === squadPos) && (!q || (p.name + ' ' + p.nick + ' ' + p.num).toLowerCase().includes(q)));
  list = list.slice().sort((a, b) => squadSort === 'name' ? a.name.localeCompare(b.name, 'pt-BR') : a.num - b.num);
  $s('squadCount').textContent = list.length + (list.length === 1 ? ' jogador' : ' jogadores');
  const def = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=350&auto=format&fit=crop';
  box.innerHTML = list.length ? list.map(p => `
    <div class="player-card" onclick="openPlayerDetail(${p.id})">
      <div class="player-card-photo"><span class="player-badge-num">#${p.num}</span><img src="${p.img || window.PLAYER_SIL}" alt="${socEsc(p.name)}" loading="lazy" onerror="playerImgFail(this)"></div>
      <div class="player-card-info"><span class="player-card-pos">${p.pos}</span><div class="player-card-name">${socEsc(p.name)}</div><span style="font-size:0.75rem; color:var(--club-muted);">${socEsc(p.nick)}</span></div>
    </div>`).join('') : '<p style="color:var(--club-muted)">Nenhum jogador encontrado.</p>';
};
const COMM_VOLS = [34, 52];
window.renderSocialProjects = function () {
  const projects = [
    { title: 'Futebol nas Vilas do Vale', meta: 'R$ 18.000', arrecadado: '78%', desc: 'Aulas e materiais esportivos para 120 crianças das comunidades do Vale do Jequitinhonha.' },
    { title: 'Campanha do Agasalho — A Matilha Aquece', meta: '1.800 Peças', arrecadado: '89%', desc: 'Arrecadação de agasalhos para famílias do Vale durante o período de seca.' }
  ];
  const mine = isLogged() ? (userSession.campaigns || []) : [];
  const root = $s('socialCampaignsList');
  if (!$s('commImpact')) root.insertAdjacentHTML('beforebegin', '<div id="commImpact"></div>');
  $s('commImpact').innerHTML = `<div class="comm-impact">🤝 ${isLogged() ? `<span>Você participa de <b>${mine.length}</b> ${mine.length === 1 ? 'campanha' : 'campanhas'}. Cada inscrição vale <b>+30</b> pontos SCEC.</span>` : '<span>Entre na sua conta para se inscrever como voluntário e ganhar <b>+30</b> pontos SCEC por campanha.</span>'}</div>`;
  root.innerHTML = projects.map((p, i) => {
    const joined = mine.includes(p.title);
    return `<div class="comm-card"><span class="news-tag" style="background:var(--club-brown); position:static; display:inline-block; margin-bottom:10px; align-self:flex-start;">Projeto Social</span>
      <h4 style="font-size:1.1rem; margin-bottom:8px;">${p.title}</h4>
      <p style="color:var(--club-muted); font-size:0.85rem;">${p.desc}</p>
      <div class="vols">👥 ${COMM_VOLS[i] + (joined ? 1 : 0)} voluntários • meta ${p.meta}</div>
      <div class="stat-bar-label"><span>Meta Atingida</span><span>${p.arrecadado}</span></div>
      <div class="bar-track" style="margin:6px 0 16px;"><div class="bar-fill" style="width:${p.arrecadado};"></div></div>
      ${joined ? '<div class="done">✅ Você é voluntário desta campanha</div>' : `<button class="btn-outline" style="width:100%;" onclick="commJoin(${i})">Quero ser voluntário</button>`}</div>`;
  }).join('');
};
function commJoin(i) {
  const names = ['Futebol nas Vilas do Vale', 'Campanha do Agasalho — A Matilha Aquece'];
  if (!isLogged()) { socOpenAuth('login', { notice:'Entre ou crie sua conta para se inscrever como voluntário.', then: () => commJoin(i) }); return; }
  const u = userSession; u.campaigns = u.campaigns || [];
  if (u.campaigns.includes(names[i])) return;
  u.campaigns.push(names[i]); u.points += 30; socLog('Voluntário: ' + names[i] + ' (+30 pontos)'); socSave();
  renderSocialProjects(); socToast('Inscrição registrada! A Matilha agradece. +30 pontos SCEC.');
}
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    try { renderSquad(); renderSocialProjects(); } catch (e) {}
    const bar = document.createElement('div'); bar.id = 'scrollBar';
    const top = document.createElement('button'); top.id = 'toTop'; top.setAttribute('aria-label', 'Voltar ao topo'); top.textContent = '↑'; top.onclick = () => window.scrollTo({ top:0, behavior:'smooth' });
    const nav = document.createElement('nav'); nav.id = 'mobileNav'; nav.setAttribute('aria-label', 'Atalhos');
    nav.innerHTML = '<button onclick="goSection(\'ingressos\')"><span><svg class="icon"><use href="#i-ticket"></use></svg></span>Ingressos</button><button onclick="goSection(\'vou-ao-jogo\')"><span><svg class="icon"><use href="#i-ball"></use></svg></span>Jogo</button><button onclick="goSection(\'transmissao\')"><span><svg class="icon"><use href="#i-tv"></use></svg></span>Assistir</button><button onclick="isLogged()?socOpenArea(\'painel\'):goSection(\'socio\')"><span><svg class="icon"><use href="#i-shield"></use></svg></span>Sócio</button>';
    document.body.appendChild(nav);
    let tick = false;
    window.addEventListener('scroll', () => { if (tick) return; tick = true; requestAnimationFrame(() => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.width = (h > 0 ? 100 * scrollY / h : 0) + '%'; top.classList.toggle('show', scrollY > 700); tick = false; }); }, { passive:true });
    const act = document.querySelector('.hero-match .hero-actions');
    if (act && !document.getElementById('heroQuick')) {
      act.insertAdjacentHTML('afterend', '<div class="hero-quick" id="heroQuick"></div>'); heroQuick();
    }
  });
  window.heroQuick = function () {
    const q = document.getElementById('heroQuick'); if (!q) return;
    const has = isLogged() && userSession.tickets.some(t => (t.match || '').includes(vajAdv()));
    q.innerHTML = `<button onclick="goSection('transmissao')"><svg class="icon"><use href="#i-tv"></use></svg> SportiNet • SuperSports</button><button onclick="goSection('transmissao')"><svg class="icon"><use href="#i-phones"></use></svg> Pop 96</button><button onclick="goSection('vou-ao-jogo')"><svg class="icon"><use href="#i-ball"></use></svg> Plano do dia de jogo</button>${has ? '<button onclick="socOpenArea(\'ingressos\')" style="border-color:#2e9e4f">✅ Você tem ingresso</button>' : ''}`;
  };
})();
const _refreshUI0 = window.socRefreshUI;
window.socRefreshUI = function () { _refreshUI0(); try { renderSocialProjects(); heroQuick(); } catch (e) {} };

/* =====================================================================
   EXTRAS (apenas acréscimos): números, Matilha Play, depoimentos,
   parceiros, newsletter, confete, barra de jogo e polimento
   ===================================================================== */
const exLS = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } };
const exSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const exRand = n => Math.floor(Math.random() * n);

/* --- Barra do próximo jogo --- */
function exAnnounce() {
  const el = $s('exAnn'); if (!el) return;
  if (sessionStorage.getItem('scec_ann_off')) { el.style.display = 'none'; return; }
  const diff = new Date(VAJ_MATCH.date) - Date.now(), d = Math.floor(diff / 86400000), h = Math.floor(diff % 86400000 / 3600000);
  const _aw = window.EDITAR && EDITAR.PROXIMO_JOGO && EDITAR.PROXIMO_JOGO.emCasa === false, _ttl = _aw ? VAJ_MATCH.title.split(' × ').reverse().join(' × ') : VAJ_MATCH.title;
  const when = diff <= 0 ? (_aw ? 'hoje, fora de casa' : 'hoje, na Toca do Lobo') : d > 0 ? `faltam ${d} dia${d > 1 ? 's' : ''}` : `faltam ${h}h`;
  el.innerHTML = `<span><svg class="icon"><use href="#i-ball"></use></svg> Próximo jogo: <strong>${_ttl}</strong> • ${VAJ_MATCH.dateLabel} • ${when}</span><a href="#ingressos">${_aw ? 'Ingressos (jogos em casa)' : 'Ingressos'}</a>${_aw ? '<a href="#estadio-visitante">Estádio do mandante</a>' : '<a href="#transmissao">Onde assistir</a>'}<a href="#matilha-play">Matilha Play</a><a href="#monte-seu-11">Monte seu 11</a><button type="button" aria-label="Fechar aviso" onclick="sessionStorage.setItem('scec_ann_off','1');this.parentNode.style.display='none'">✕</button>`;
}

/* --- Confete --- */
function exConfetti() {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cols = ['#c9a84c', '#3b82c4', '#ffffff', '#2e9e4f', '#d64545'];
  for (let i = 0; i < 70; i++) {
    const c = document.createElement('i'); c.className = 'ex-conf';
    c.style.cssText = `left:${Math.random() * 100}vw;background:${cols[exRand(cols.length)]};animation-duration:${1.8 + Math.random() * 1.8}s;animation-delay:${Math.random() * 0.4}s;transform:rotate(${exRand(360)}deg)`;
    document.body.appendChild(c); setTimeout(() => c.remove(), 4200);
  }
}

/* --- Números do clube (contagem animada) --- */
function exNumbersInit() {
  const T = DB.standings.find(t => t.name.includes('Santa Clara')) || { v: 0 };
  const items = [[new Date().getFullYear() - 2000, 'Anos de história'], [DB.players.length, 'Jogadores no elenco'], [DB.players.reduce((n, p) => n + (p.goals || 0), 0), 'Gols do elenco'], [T.v, 'Vitórias na temporada'], [(window.EDITAR && EDITAR.SOCIOS) || 12480, 'Sócios na Matilha']];
  const host = $s('exNumbers'); if (!host) return;
  host.innerHTML = items.map(([n, l]) => `<div class="ex-num"><b data-to="${n}">0</b><span>${l}</span></div>`).join('');
  const run = el => { const to = +el.dataset.to, t0 = performance.now(); const f = t => { const k = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString('pt-BR'); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); };
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { run(x.target); io.unobserve(x.target); } }), { threshold:.4 }); host.querySelectorAll('b').forEach(b => io.observe(b)); }
  else host.querySelectorAll('b').forEach(run);
}

/* --- Palpite do jogo --- */
const exPalGet = () => isLogged() ? (userSession.palpite || null) : exLS('scec_palpite', null);
function exPalRender() {
  const el = $s('exPalpite'); if (!el) return;
  const M = VAJ_MATCH, p = exPalGet(), locked = Date.now() >= new Date(M.date).getTime();
  $s('exPalSub').textContent = `${M.title} • ${M.dateLabel}` + (isLogged() ? ' • +10 pontos pelo palpite' : ' • entre na conta para ganhar pontos');
  if (p || locked) {
    const base = [62, 23, 15], pick = p ? (p.a > p.b ? 0 : p.a === p.b ? 1 : 2) : -1, lbl = ['Vitória do Santa Clara', 'Empate', 'Vitória do ' + vajAdv()];
    el.innerHTML = `${p ? `<div class="ma-item" style="text-align:center"><div style="font-size:0.7rem;color:var(--club-muted);text-transform:uppercase">Seu palpite</div><div style="font-family:var(--font-display);font-size:2rem;color:var(--club-gold)">SCEC ${p.a} × ${p.b} ${vajSigla()}</div></div>` : '<p style="color:var(--club-muted)">Os palpites se encerraram no apito inicial.</p>'}
      <div class="ex-bars"><div style="font-size:0.68rem;color:var(--club-muted);text-transform:uppercase">Tendência da torcida (dados ilustrativos)</div>${base.map((v, i) => `<div>${lbl[i]}${pick === i ? ' ⭐' : ''} — <b>${v}%</b><i style="width:${v}%;${pick === i ? 'background:var(--club-gold)' : ''}"></i></div>`).join('')}</div>
      ${p && !locked ? '<button class="btn-outline" onclick="exPalReset()">Mudar palpite</button>' : ''}`;
    return;
  }
  el.innerHTML = `<div class="ex-score"><div class="t">Santa Clara</div><input type="number" id="palA" min="0" max="9" value="2" aria-label="Gols do Santa Clara"><b>×</b><input type="number" id="palB" min="0" max="9" value="0" aria-label="Gols do ${vajAdv()}"><div class="t">${vajAdv()}</div></div>
    <button class="btn-primary" style="justify-content:center" onclick="exPalSend()">Enviar palpite</button>`;
}
function exPalSend() {
  const a = Math.min(9, Math.max(0, parseInt($s('palA').value, 10) || 0)), b = Math.min(9, Math.max(0, parseInt($s('palB').value, 10) || 0)), p = { a, b, at:Date.now() };
  if (isLogged()) { const first = !userSession.palpite && !userSession.palpiteBonus; userSession.palpite = p; if (first) { userSession.palpiteBonus = true; userSession.points += 10; socLog(`Palpite enviado: SCEC ${a} × ${b} ATL (+10 pontos)`); } socSave(); }
  else exSet('scec_palpite', p);
  socToast(`Palpite registrado: ${a} × ${b}. Boa sorte, Matilha!`); exPalRender();
}
function exPalReset() { if (isLogged()) { delete userSession.palpite; socSave(); } else localStorage.removeItem('scec_palpite'); exPalRender(); }

/* --- Pênalti da Matilha --- */
const pen = { kick:0, goals:0, busy:false, hist:[] };
function penInit() {
  const g = $s('penGoal'); if (!g) return;
  g.innerHTML = Array.from({ length:6 }, (_, z) => `<button type="button" class="pen-z" data-z="${z}" aria-label="Chutar no canto ${z + 1}" style="left:${(z % 3) * 33.33}%;top:${Math.floor(z / 3) * 50}%" onclick="penShoot(${z})"></button>`).join('');
  penHud();
}
function penHud() {
  const best = exLS('scec_pen_best', 0);
  $s('penScore').textContent = pen.kick < 5 ? `Cobrança ${pen.kick + 1}/5 • Gols: ${pen.goals} • Recorde: ${best}/5` : `Fim! ${pen.goals}/5 • Recorde: ${best}/5`;
  $s('penDots').innerHTML = Array.from({ length:5 }, (_, i) => `<span class="${pen.hist[i] === 1 ? 'g' : pen.hist[i] === 0 ? 'm' : ''}"></span>`).join('');
}
const penPos = z => ({ x: 18 + (z % 3) * 32, y: 22 + Math.floor(z / 3) * 22 });
function penShoot(z) {
  if (pen.busy) return; pen.busy = true;
  const ball = $s('penBall'), k = $s('penKeeper'), msg = $s('penMsg'), col = z % 3, row = Math.floor(z / 3);
  document.querySelectorAll('.pen-z').forEach(b => b.disabled = true);
  const kc = exRand(3), kr = exRand(2), saved = kc === col && (kr === row || Math.random() < 0.5);
  const cx = c => 12 + 76 * ((c + 0.5) / 3), cy = r => 10 + 46 * ((r + 0.5) / 2);
  ball.style.left = cx(col) + '%'; ball.style.top = cy(row) + '%'; ball.style.fontSize = '1.1rem';
  k.style.left = cx(kc) + '%'; k.style.top = cy(kr) + '%'; k.style.transform = `translate(-50%,-50%) rotate(${(kc - 1) * 35}deg)`;
  setTimeout(() => {
    pen.hist.push(saved ? 0 : 1); if (!saved) pen.goals++; pen.kick++;
    msg.textContent = saved ? '🧤 Defendeu!' : '⚽ GOOOL!'; msg.style.color = saved ? '#e5675f' : '#7be09a';
    penHud();
    setTimeout(() => {
      msg.textContent = '';
      ball.style.left = '50%'; ball.style.top = '84%'; ball.style.fontSize = '1.7rem'; k.style.left = '50%'; k.style.top = '52%'; k.style.transform = 'translate(-50%,-50%)';
      if (pen.kick >= 5) return penEnd();
      pen.busy = false; document.querySelectorAll('.pen-z').forEach(b => b.disabled = false);
    }, 900);
  }, 520);
}
function penEnd() {
  const best = exLS('scec_pen_best', 0); if (pen.goals > best) exSet('scec_pen_best', pen.goals);
  let extra = '';
  if (pen.goals >= 4) { exConfetti(); const today = new Date().toDateString(); if (isLogged() && userSession.penDay !== today) { userSession.penDay = today; userSession.points += 10; socLog(`Pênalti da Matilha: ${pen.goals}/5 (+10 pontos)`); socSave(); extra = ' +10 pontos SCEC!'; } }
  $s('penMsg').innerHTML = ''; penHud();
  $s('penScore').insertAdjacentHTML('afterend', '');
  socToast(pen.goals >= 4 ? `Craque! ${pen.goals}/5 gols.${extra}` : `Você fez ${pen.goals}/5. Tente de novo!`);
  const g = $s('penGoal'); g.innerHTML = `<button type="button" class="btn-primary" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);justify-content:center" onclick="penReset()">🔁 Jogar de novo</button>`;
}
function penReset() { pen.kick = 0; pen.goals = 0; pen.busy = false; pen.hist = []; penInit(); }

/* --- Card do torcedor (canvas) --- */
let exCardColor = 0;
const EX_SHIRTS = [{ n:'Azul', c:'#1f4f8f', t:'#ffffff' }, { n:'Branca', c:'#f2f2f2', t:'#14233f' }, { n:'Marrom', c:'#7a4a26', t:'#ffffff' }];
function exCardDraw() {
  const c = $s('exCardCv'); if (!c) return; const x = c.getContext('2d'), W = 540, H = 720, sh = EX_SHIRTS[exCardColor];
  const name = ($s('exCardName').value || 'TORCEDOR').toUpperCase(), num = String(Math.min(99, Math.max(1, parseInt($s('exCardNum').value, 10) || 10)));
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b1830'); g.addColorStop(1, '#0a2a1c'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.05)'; x.fillRect(0, i * 90, W, 90); }
  x.strokeStyle = 'rgba(201,168,76,.9)'; x.lineWidth = 6; x.strokeRect(14, 14, W - 28, H - 28);
  x.fillStyle = '#c9a84c'; x.textAlign = 'center'; x.font = '700 26px sans-serif'; x.fillText('SANTA CLARA EC', W / 2, 74); x.font = '600 16px sans-serif'; x.fillStyle = '#9fb3d4'; x.fillText('MATILHA • TEMPORADA ' + new Date().getFullYear(), W / 2, 104);
  x.save(); x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = 24; x.shadowOffsetY = 12; x.fillStyle = sh.c;
  x.beginPath(); x.moveTo(190, 170); x.lineTo(120, 215); x.lineTo(70, 330); x.lineTo(130, 355); x.lineTo(170, 295); x.lineTo(170, 560); x.lineTo(370, 560); x.lineTo(370, 295); x.lineTo(410, 355); x.lineTo(470, 330); x.lineTo(420, 215); x.lineTo(350, 170); x.quadraticCurveTo(270, 230, 190, 170); x.closePath(); x.fill(); x.restore();
  x.strokeStyle = 'rgba(0,0,0,.25)'; x.lineWidth = 3; x.stroke();
  x.strokeStyle = '#c9a84c'; x.lineWidth = 8; x.beginPath(); x.moveTo(190, 170); x.quadraticCurveTo(270, 230, 350, 170); x.stroke();
  x.fillStyle = sh.t; x.font = '800 30px sans-serif'; x.fillText(name, W / 2, 285); x.font = '900 190px Impact, "Arial Black", sans-serif'; x.fillText(num, W / 2, 470);
  x.font = '700 18px sans-serif'; x.fillStyle = '#c9a84c'; x.fillText('SOU DA MATILHA 🐺', W / 2, 640); x.fillStyle = '#6f84a8'; x.font = '600 14px sans-serif'; x.fillText('Subestimado por muitos. Temido no Vale.', W / 2, 672);
}
function exCardDownload() {
  exCardDraw(); const a = document.createElement('a'); a.href = $s('exCardCv').toDataURL('image/png'); a.download = 'card-matilha.png';
  document.body.appendChild(a); a.click(); a.remove(); socToast('Card baixado! Poste e marque a Matilha 🐺');
}
function exCardInit() {
  const sw = $s('exSw'); if (!sw) return;
  sw.innerHTML = EX_SHIRTS.map((s, i) => `<button type="button" class="${i === exCardColor ? 'on' : ''}" style="background:${s.c}" aria-label="Camisa ${s.n}" onclick="exCardColor=${i};exCardInit()"></button>`).join('');
  if (isLogged() && !$s('exCardName').value) $s('exCardName').value = userSession.name.split(' ')[0];
  exCardDraw();
}

/* --- Depoimentos e parceiros --- */
const EX_QUOTES = [
  ['Meu pai me levou na Toca do Lobo aos 8 anos. Hoje levo meu filho. O Santa Clara é família.', 'Dona Ivone • torcedora desde 2003'],
  ['Quando a Matilha canta, o time joga com um a mais. Não existe outro estádio assim no Vale.', 'Rogério • arquibancada Verde'],
  ['Ser sócio compensou no primeiro jogo. Entrei no camarote e ainda vi os vestiários por dentro.', 'Camila • Sócio Terror'],
  ['Moro longe, mas não perco jogo: Pop 96 no fone e resultado no site. Coração azul onde estiver.', 'Seu Valdomiro • torcedor de estrada']
];
let exQi = 0, exQt = null;
function exQuoteShow(i) {
  exQi = i; const q = EX_QUOTES[i];
  $s('exQuote').innerHTML = `<q>${q[0]}</q><cite>${q[1]}</cite>`;
  $s('exDots').innerHTML = EX_QUOTES.map((_, k) => `<button type="button" class="${k === i ? 'on' : ''}" aria-label="Depoimento ${k + 1}" onclick="exQuoteShow(${k});exQuoteTimer()"></button>`).join('');
}
function exQuoteTimer() { clearInterval(exQt); exQt = setInterval(() => exQuoteShow((exQi + 1) % EX_QUOTES.length), 7000); }
function exMarqueeInit() {
  const m = $s('exMarq'); if (!m) return;
  const row = DB.sponsors.map(s => `<span style="display:inline-flex;align-items:center;gap:10px">${s.logo ? `<img src="${s.logo}" alt="" style="height:26px;width:auto;background:#fff;border-radius:4px;padding:2px" onerror="this.remove()">` : ''}${s.name}</span>`).join('');
  m.innerHTML = row + row + row + row;
}

/* --- Newsletter no rodapé --- */
function exNewsletterInit() {
  const g = document.querySelector('.footer-grid'); if (!g || $s('exNl')) return;
  g.insertAdjacentHTML('beforebegin', `<div class="ex-nl" id="exNl"><div><strong style="font-family:var(--font-display);font-size:1.2rem;text-transform:uppercase">📬 Newsletter da Matilha</strong><div style="font-size:0.8rem;color:var(--club-muted)">Escalações, pré-venda e promoções da loja direto no seu e-mail.</div></div>
    <form onsubmit="exSubscribe(event)" novalidate><input type="email" id="exNlMail" placeholder="seu@email.com" aria-label="E-mail" autocomplete="email"><button class="btn-primary" type="submit">Assinar</button></form></div>`);
}
function exSubscribe(e) {
  e.preventDefault(); const m = $s('exNlMail').value.trim().toLowerCase();
  if (!socEmailOk(m)) return socToast('Digite um e-mail válido.');
  const list = exLS('scec_newsletter', []); if (list.includes(m)) return socToast('Este e-mail já está inscrito.');
  list.push(m); exSet('scec_newsletter', list);
  let bonus = '';
  if (isLogged() && !userSession.nlBonus) { userSession.nlBonus = true; userSession.points += 20; socLog('Newsletter assinada (+20 pontos)'); socSave(); bonus = ' +20 pontos SCEC!'; }
  $s('exNlMail').value = ''; socToast('Inscrição confirmada. Bem-vindo à Matilha!' + bonus);
}

/* --- Rolagem: progresso, voltar ao topo e entrada suave --- */
function exScrollInit() {
  const bar = $s('exProgress'), top = $s('exTop');
  const on = () => { const h = document.documentElement, p = h.scrollHeight - h.clientHeight; bar.style.width = (p > 0 ? 100 * h.scrollTop / p : 0) + '%'; top.classList.toggle('show', h.scrollTop > 700); };
  window.addEventListener('scroll', on, { passive:true }); on();
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold:0.06 });
    document.querySelectorAll('section[id]:not(.hero-match), .ex-testi').forEach(sec => { if (sec.getBoundingClientRect().top > window.innerHeight) { sec.classList.add('ex-reveal'); io.observe(sec); } });
  }
}

/* --- Confete nas conquistas --- */
const _exJoin = window.socConfirmJoin; if (_exJoin) window.socConfirmJoin = function (k) { _exJoin(k); exConfetti(); };
const _exTk = window.handleTicketCheckout;
window.handleTicketCheckout = function (e) { const n = isLogged() ? userSession.tickets.length : -1; _exTk(e); if (isLogged() && userSession.tickets.length > n && n >= 0) exConfetti(); };

document.addEventListener('DOMContentLoaded', () => {
  try { exAnnounce(); exNumbersInit(); exPalRender(); penInit(); exCardInit(); exQuoteShow(0); exQuoteTimer(); exMarqueeInit(); exNewsletterInit(); exScrollInit(); } catch (err) { console.error('extras', err); }
});
const _exRefresh = window.socRefreshUI; window.socRefreshUI = function () { _exRefresh(); try { exPalRender(); exCardInit(); } catch (e) {} };

/* --- Quiz da Matilha --- */
const EX_QUIZ = [
  ['Qual é o mascote do Santa Clara?', ['Lobo-guará', 'Onça-pintada', 'Tucano'], 0],
  ['Como é chamada a torcida do clube?', ['Legião', 'Matilha', 'Bando'], 1],
  ['Qual é o apelido do estádio?', ['Caldeirão', 'Fortaleza', 'Toca do Lobo'], 2],
  ['Quanto tempo antes da bola rolar os portões abrem?', ['2h30', '1h', '4h'], 0],
  ['Qual setor é o dos cadeirantes, com entrada separada pelo estacionamento?', ['Verde', 'Roxo', 'Azul', 'Visitante'], 1],
  ['Qual é a TV principal da transmissão do jogo?', ['SuperSports', 'Pop 96', 'SportiNet'], 2],
  ['Qual rádio tem áudio de alta qualidade e o resultado no próprio site?', ['Pop 96', 'Rádio Oficial do Estádio'], 0],
  ['O que o camarote oferece 2h antes das partidas?', ['Show ao vivo', 'Tour pelos bastidores', 'Churrasco'], 1]
];
const qz = { list:[], i:0, hits:0, lock:false };
function qzTrophyQs() {
  const Q = [], pool = []; for (let y = 2008; y <= 2026; y++) pool.push(String(y));
  try { DB.trophies.forEach(t => { const ys = String(t.year).split(',').map(x => x.trim()).filter(x => /^\d{4}$/.test(x)); if (!ys.length) return;
    const right = ys[Math.floor(Math.random() * ys.length)], opts = [right].concat(pool.filter(y => ys.indexOf(y) < 0).sort(() => Math.random() - 0.5).slice(0, 3)).sort(() => Math.random() - 0.5);
    Q.push(['Em que ano o clube conquistou: ' + t.name + '?', opts, opts.indexOf(right)]); }); } catch (e) {}
  return Q;
}
function qzStart() {
  const tq = qzTrophyQs().sort(() => Math.random() - 0.5).slice(0, 3);
  qz.list = EX_QUIZ.slice().sort(() => Math.random() - 0.5).slice(0, 6 - tq.length).concat(tq).sort(() => Math.random() - 0.5); qz.i = 0; qz.hits = 0; qz.lock = false; qzRender();
}
function qzRender() {
  const el = $s('exQuiz'); if (!el) return;
  if (qz.i >= qz.list.length) return qzEnd();
  const [q, opts] = qz.list[qz.i];
  el.innerHTML = `<div class="qz-bar"><i style="width:${100 * qz.i / qz.list.length}%"></i></div><div style="font-size:0.7rem;color:var(--club-muted);margin-top:6px">Pergunta ${qz.i + 1} de ${qz.list.length} • acertos: ${qz.hits}</div>
    <div class="qz-q">${q}</div>${opts.map((o, k) => `<button type="button" class="qz-opt" onclick="qzAnswer(${k})">${o}</button>`).join('')}`;
}
function qzAnswer(k) {
  if (qz.lock) return; qz.lock = true;
  const right = qz.list[qz.i][2], btns = document.querySelectorAll('#exQuiz .qz-opt');
  btns.forEach((b, n) => { b.disabled = true; if (n === right) b.classList.add('ok'); else if (n === k) b.classList.add('bad'); });
  if (k === right) qz.hits++;
  setTimeout(() => { qz.i++; qz.lock = false; qzRender(); }, 1000);
}
function qzEnd() {
  const n = qz.hits, tot = qz.list.length, lvl = n === tot ? 'Alfa da Matilha 👑' : n >= 4 ? 'Lobo de Elite 🐺' : 'Filhote da Matilha 🐾';
  const best = exLS('scec_quiz_best', 0); if (n > best) exSet('scec_quiz_best', n);
  let extra = '';
  if (n === tot) { exConfetti(); if (isLogged()) { userSession.quizPerfect = true; const today = new Date().toDateString(); if (userSession.quizDay !== today) { userSession.quizDay = today; userSession.points += 10; socLog('Quiz da Matilha: 6/6 (+10 pontos)'); socSave(); extra = '<div style="color:#2e9e4f;font-weight:800">+10 pontos SCEC!</div>'; } else socSave(); } }
  $s('exQuiz').innerHTML = `<div class="qz-end"><b>${n}/${tot}</b><div style="font-weight:800;margin:6px 0">${lvl}</div>${extra}<div style="font-size:0.75rem;color:var(--club-muted);margin:8px 0">Maior pontuação: ${Math.max(n, best)}/${tot}</div><button class="btn-primary" style="justify-content:center;width:100%" onclick="qzStart()">Jogar de novo</button></div>`;
}

/* --- Conquistas (nova aba da Área do Sócio) --- */
function exAchievements() {
  const u = userSession, l = (u.log || []).map(x => x.t).join('|');
  return [
    ['🐺', 'Da Matilha', 'Criou sua conta', true],
    ['👑', 'Sócio', 'Aderiu a um plano', !!u.plan],
    ['🎟️', 'Na arquibancada', 'Emitiu um ingresso', (u.tickets || []).length > 0],
    ['🎯', 'Palpiteiro', 'Enviou um palpite', !!u.palpiteBonus],
    ['⚽', 'Craque da marca', 'Fez 4+ gols no pênalti', !!u.penDay],
    ['🧠', 'Cabeça de lobo', 'Gabaritou o quiz', !!u.quizPerfect],
    ['🛍️', 'Fiel da loja', 'Fez um pedido na loja', /Pedido da loja/.test(l)],
    ['📷', 'Cara de sócio', 'Colocou foto na carteirinha', !!u.photo],
    ['✅', 'Perfil completo', 'Preencheu todos os dados', !!u.profileBonus],
    ['🗳️', 'Voz ativa', 'Votou no craque do mês', !!(u.benefits && u.benefits.vote)],
    ['📬', 'Bem informado', 'Assinou a newsletter', !!u.nlBonus],
    ['📋', 'Treinador', 'Escalou os 11 titulares', !!u.lineupDone],
    ['📍', 'Presença confirmada', 'Fez check-in de um ingresso', (u.presence || 0) > 0],
    ['⭐', 'Colecionador', 'Juntou 500 pontos', (u.points || 0) >= 500]
  ];
}
MA_TABS.splice(MA_TABS.length - 1, 0, ['conquistas', '🏅 Conquistas']);
const _exRA = window.socRenderArea;
window.socRenderArea = function () {
  if (maTab !== 'conquistas') return _exRA();
  $s('maTabs').innerHTML = MA_TABS.map(t => `<button type="button" class="${t[0] === maTab ? 'on' : ''}" onclick="maTab='${t[0]}';maPayId=null;maReceiptId=null;socRenderArea()">${t[1]}</button>`).join('');
  const a = exAchievements(), got = a.filter(x => x[3]).length;
  $s('maBody').innerHTML = `<div class="ma-item"><div class="top"><strong>🏅 ${got} de ${a.length} conquistas</strong><span class="ma-tag ${got === a.length ? '' : 'warn'}">${Math.round(100 * got / a.length)}%</span></div><div class="ma-bar"><i style="width:${100 * got / a.length}%"></i></div><p style="margin:0">Jogue, compre, vote e participe para desbloquear todas.</p></div>
    <div class="ma-h">Suas conquistas</div><div class="ach-grid">${a.map(x => `<div class="ach ${x[3] ? 'got' : 'lock'}"><span class="e">${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join('')}</div>
    <div class="ma-h">🏆 Ranking da Matilha</div>${exRankingHtml()}`;
};

/* --- Easter egg: código Konami --- */
(function () {
  const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']; let pos = 0;
  document.addEventListener('keydown', e => {
    if (/INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || '')) return;
    pos = (e.key === seq[pos] || e.key.toLowerCase() === seq[pos]) ? pos + 1 : (e.key === seq[0] ? 1 : 0);
    if (pos === seq.length) { pos = 0; exConfetti(); setTimeout(exConfetti, 700); setTimeout(exConfetti, 1400); let b = ''; if (isLogged() && !userSession.konami) { userSession.konami = true; userSession.points += 25; socLog('Segredo da Matilha descoberto (+25 pontos)'); socSave(); b = ' +25 pontos!'; } socToast('🐺 AUUUUU! Você descobriu o segredo da Matilha.' + b); }
  });
})();
document.addEventListener('DOMContentLoaded', () => { try { qzStart(); } catch (e) {} });

/* =====================================================================
   EXTRAS v3: Monte seu 11, embaixadinhas, enquete, ranking, privacidade
   ===================================================================== */
/* --- Monte seu 11 --- */
const LU_FORM = {
  '4-3-3': [['GOLEIRO', 1], ['DEFENSOR', 4], ['MEIO-CAMPISTA', 3], ['ATACANTE', 3]],
  '4-4-2': [['GOLEIRO', 1], ['DEFENSOR', 4], ['MEIO-CAMPISTA', 4], ['ATACANTE', 2]],
  '3-5-2': [['GOLEIRO', 1], ['DEFENSOR', 3], ['MEIO-CAMPISTA', 5], ['ATACANTE', 2]]
};
const LU_Y = { 'GOLEIRO':88, 'DEFENSOR':68, 'MEIO-CAMPISTA':45, 'ATACANTE':21 }, LU_SHORT = { 'GOLEIRO':'GOL', 'DEFENSOR':'DEF', 'MEIO-CAMPISTA':'MEI', 'ATACANTE':'ATA' };
let luForm = '4-3-3', luSlots = Array(11).fill(null), luPick = -1;
function luLayout() { const out = []; LU_FORM[luForm].forEach(([pos, n]) => { for (let i = 0; i < n; i++) out.push({ pos, x:(i + 1) / (n + 1) * 100, y:LU_Y[pos] }); }); return out; }
function luLoad() {
  const d = isLogged() ? userSession.lineup : exLS('scec_lineup', null);
  if (d && LU_FORM[d.form] && Array.isArray(d.slots) && d.slots.length === 11) { luForm = d.form; luSlots = d.slots; }
}
function luSave() { const d = { form:luForm, slots:luSlots }; if (isLogged()) { userSession.lineup = d; socSave(); } else exSet('scec_lineup', d); }
const luPlayer = id => DB.players.find(p => p.id === id);
function luRender() {
  const lay = luLayout(), pitch = $s('luPitch'); if (!pitch) return;
  pitch.querySelectorAll('.lu-slot').forEach(n => n.remove());
  pitch.insertAdjacentHTML('beforeend', lay.map((s, i) => { const p = luPlayer(luSlots[i]);
    return `<button type="button" class="lu-slot${p ? '' : ' empty'}" style="left:${s.x}%;top:${s.y}%" aria-label="${LU_SHORT[s.pos]}: ${p ? socEsc(p.name) : 'vazio'}" onclick="luOpen(${i})"><b>${p ? p.num : '+'}</b><span>${p ? socEsc(p.nick || p.name.split(' ')[0]) : LU_SHORT[s.pos]}</span></button>`; }).join(''));
  $s('luForms').innerHTML = Object.keys(LU_FORM).map(f => `<button type="button" class="store-chip${f === luForm ? ' on' : ''}" onclick="luSetForm('${f}')">${f}</button>`).join('');
  const filled = luSlots.filter(Boolean).length, ps = luSlots.map(luPlayer).filter(Boolean);
  $s('luInfo').innerHTML = `<div class="box"><strong>${filled}/11 escalados</strong> • formação ${luForm}${ps.length ? `<br>⚽ Gols somados: <b style="color:var(--club-gold)">${ps.reduce((n, p) => n + (p.goals || 0), 0)}</b> • 🏃 Jogos: <b style="color:var(--club-gold)">${ps.reduce((n, p) => n + (p.games || 0), 0)}</b> • 🎂 Média de idade: <b style="color:var(--club-gold)">${(ps.reduce((n, p) => n + (p.age || 0), 0) / ps.length).toFixed(1)}</b>` : ''}</div>`;
}
function luSetForm(f) { if (f === luForm) return; luForm = f; luSlots = Array(11).fill(null); luSave(); luRender(); }
function luOpen(i) {
  luPick = i; const pos = luLayout()[i].pos, used = luSlots.filter((x, k) => x && k !== i);
  $s('luTitle').textContent = 'Escalar: ' + pos.charAt(0) + pos.slice(1).toLowerCase();
  $s('luList').innerHTML = (luSlots[i] ? '<button type="button" onclick="luAssign(null)">❌ Remover jogador</button>' : '') + DB.players.filter(p => p.pos === pos).sort((a, b) => b.goals * 3 + b.games - (a.goals * 3 + a.games)).map(p => `<button type="button" ${used.includes(p.id) ? 'disabled' : ''} onclick="luAssign(${p.id})"><b style="font-family:var(--font-display);color:var(--club-gold);min-width:30px">#${p.num}</b><span style="flex:1"><strong>${socEsc(p.name)}</strong><br><small style="color:var(--club-muted)">${p.games} jogos • ${p.goals} gols • ${p.age} anos</small></span></button>`).join('');
  openModal('luModal');
}
function luAssign(id) {
  luSlots[luPick] = id; closeModal('luModal'); luSave(); luRender();
  if (luSlots.every(Boolean)) { socToast('Time completo! Boa, professor 📋'); if (isLogged() && !userSession.lineupDone) { userSession.lineupDone = true; userSession.points += 15; socLog('Escalação completa montada (+15 pontos)'); socSave(); } }
}
function luAuto() {
  const used = new Set(); luSlots = luLayout().map(s => { const c = DB.players.filter(p => p.pos === s.pos && !used.has(p.id)).sort((a, b) => b.goals * 3 + b.games - (a.goals * 3 + a.games))[0]; if (c) used.add(c.id); return c ? c.id : null; });
  luSave(); luRender(); socToast('Escalação automática montada!');
  if (luSlots.every(Boolean) && isLogged() && !userSession.lineupDone) { userSession.lineupDone = true; userSession.points += 15; socLog('Escalação completa montada (+15 pontos)'); socSave(); }
}
function luClear() { luSlots = Array(11).fill(null); luSave(); luRender(); }
function luText() { const lay = luLayout(); return `🐺 Meu 11 da Matilha (${luForm})\n` + LU_FORM[luForm].map(([pos, n]) => { const ids = lay.map((s, i) => s.pos === pos ? luSlots[i] : -1).filter(x => x !== -1); return `${LU_SHORT[pos]}: ` + ids.map(id => { const p = luPlayer(id); return p ? p.name.split(' ').slice(-1)[0] : '—'; }).join(', '); }).join('\n') + '\nMonte o seu em Santa Clara EC!'; }
function luCopy() { (navigator.clipboard ? navigator.clipboard.writeText(luText()) : Promise.reject()).then(() => socToast('Escalação copiada!')).catch(() => prompt('Copie sua escalação:', luText())); }
function luShare() { window.open('https://wa.me/?text=' + encodeURIComponent(luText()), '_blank'); }
function luDownload() {
  const c = document.createElement('canvas'); c.width = 600; c.height = 800; const x = c.getContext('2d');
  for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#1a6e43' : '#16603a'; x.fillRect(0, i * 100, 600, 100); }
  x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 3; x.strokeRect(16, 16, 568, 768); x.beginPath(); x.moveTo(16, 400); x.lineTo(584, 400); x.stroke(); x.beginPath(); x.arc(300, 400, 64, 0, 7); x.stroke(); x.strokeRect(150, 16, 300, 110); x.strokeRect(150, 674, 300, 110);
  x.fillStyle = 'rgba(0,0,0,.45)'; x.fillRect(0, 0, 600, 56); x.fillStyle = '#c9a84c'; x.font = '800 22px sans-serif'; x.textAlign = 'center'; x.fillText(`SANTA CLARA EC • MEU 11 • ${luForm}`, 300, 36);
  luLayout().forEach((s, i) => { const p = luPlayer(luSlots[i]), px = 16 + (s.x / 100) * 568, py = (s.y / 100) * 800;
    x.beginPath(); x.arc(px, py, 27, 0, 7); x.fillStyle = p ? '#1f4f8f' : 'rgba(0,0,0,.4)'; x.fill(); x.lineWidth = 3; x.strokeStyle = '#fff'; x.stroke();
    x.fillStyle = '#fff'; x.font = '900 22px sans-serif'; x.fillText(p ? p.num : '+', px, py + 8); x.font = '700 14px sans-serif'; x.fillText(p ? (p.nick || p.name.split(' ')[0]).slice(0, 12) : LU_SHORT[s.pos], px, py + 46); });
  const a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = 'meu-11-matilha.png'; document.body.appendChild(a); a.click(); a.remove(); socToast('Imagem da escalação baixada!');
}

/* --- Embaixadinhas --- */
const emb = { score:0, run:false, left:20, timer:null };
function embHit() {
  const b = $s('embBall');
  if (!emb.run && emb.left === 20) { emb.run = true; emb.timer = setInterval(() => { emb.left--; $s('embTime').textContent = emb.left + 's'; if (emb.left <= 0) embEnd(); }, 1000); $s('embMsg').textContent = ''; }
  if (!emb.run) return;
  emb.score++; $s('embScore').textContent = 'Toques: ' + emb.score;
  b.style.left = (12 + Math.random() * 76) + '%'; b.style.top = (14 + Math.random() * 62) + '%';
}
function embEnd() {
  clearInterval(emb.timer); emb.run = false; const best = exLS('scec_emb_best', 0); if (emb.score > best) exSet('scec_emb_best', emb.score);
  const top = emb.score >= 30; if (top) exConfetti();
  $s('embBall').style.display = 'none';
  $s('embMsg').innerHTML = `<div style="position:absolute;inset:0;display:flex;flex-direction:column;gap:8px;align-items:center;justify-content:center;background:rgba(5,8,15,.8);pointer-events:auto"><b style="font:900 2.4rem var(--font-display);color:var(--club-gold)">${emb.score}</b><span style="font-size:0.8rem;color:var(--club-white)">${top ? 'Pé de anjo! 👼' : 'Bom treino!'} • Recorde: ${Math.max(best, emb.score)}</span><button class="btn-primary" onclick="embReset()">Jogar de novo</button></div>`;
}
function embReset() { emb.score = 0; emb.left = 20; emb.run = false; $s('embScore').textContent = 'Toques: 0'; $s('embTime').textContent = '20s'; const b = $s('embBall'); b.style.display = ''; b.style.left = '50%'; b.style.top = '50%'; $s('embMsg').textContent = 'Clique na bola para começar'; }

/* --- Enquete da torcida --- */
const EX_ENQ = [['🟢 Setor Verde', 48], ['🟣 Setor Roxo', 22], ['🔵 Setor Azul', 35], ['🚌 Setor Visitante', 6], ['👑 Camarote', 19]];
function exEnqRender() {
  const el = $s('exEnquete'); if (!el) return;
  const mine = exLS('scec_enq_vote', -1), add = exLS('scec_enq_add', {}), vals = EX_ENQ.map((o, i) => o[1] + (add[i] || 0)), tot = vals.reduce((a, b) => a + b, 0);
  el.innerHTML = mine < 0 ? EX_ENQ.map((o, i) => `<button type="button" class="qz-opt" onclick="exEnqVote(${i})">${o[0]}</button>`).join('')
    : `<div class="ex-bars">${EX_ENQ.map((o, i) => { const pc = Math.round(100 * vals[i] / tot); return `<div>${o[0]}${mine === i ? ' ⭐' : ''} — <b>${pc}%</b><i style="width:${pc}%;${mine === i ? 'background:var(--club-gold)' : ''}"></i></div>`; }).join('')}<div style="color:var(--club-muted);font-size:0.68rem">${tot} votos (parte ilustrativa)</div></div>`;
}
function exEnqVote(i) { const add = exLS('scec_enq_add', {}); add[i] = (add[i] || 0) + 1; exSet('scec_enq_add', add); exSet('scec_enq_vote', i); socToast('Voto registrado!'); exEnqRender(); }

/* --- Ranking da Matilha (aba Conquistas) --- */
function exRankingHtml() {
  const seed = [['Rogério da Arquibancada', 2340], ['Camila Terror', 1980], ['Dona Ivone', 1620], ['Seu Valdomiro', 1105], ['Thiago Vale', 870], ['Lara Fiel', 640]];
  const me = userSession.email, list = seed.slice();
  Object.values(ACC).forEach(a => { if (a.email !== me) list.push([a.name, a.points || 0]); });
  list.push([userSession.name + ' (você)', userSession.points || 0, true]);
  list.sort((a, b) => b[1] - a[1]);
  const mine = list.findIndex(x => x[2]), medal = ['🥇', '🥈', '🥉'];
  const rows = list.slice(0, 8); if (mine >= 8) rows.push(list[mine]);
  return `<div style="display:grid;gap:6px">${rows.map(r => { const pos = list.indexOf(r); return `<div class="rk-row${r[2] ? ' me' : ''}"><span class="n">${medal[pos] || pos + 1}</span><span>${socEsc(r[0])}</span><span class="p">${r[1]} pts</span></div>`; }).join('')}</div>
    <p style="font-size:0.7rem;color:var(--club-muted);margin-top:8px">Ranking com contas deste navegador e torcedores de exemplo. Jogue, compre e vote para subir.</p>`;
}

/* --- Aviso de privacidade e compartilhar o site --- */
function exCookieOk() { exSet('scec_cookie_ok', 1); $s('exCookie').style.display = 'none'; }
function exShareSite() {
  const d = { title:'Santa Clara EC', text:'Conheça o site oficial do Santa Clara EC 🐺', url:location.href };
  if (navigator.share) navigator.share(d).catch(() => {}); else (navigator.clipboard ? navigator.clipboard.writeText(location.href) : Promise.reject()).then(() => socToast('Link do site copiado!')).catch(() => prompt('Copie o link:', location.href));
}
document.addEventListener('DOMContentLoaded', () => {
  try {
    luLoad(); luRender(); exEnqRender();
    if (!exLS('scec_cookie_ok', 0)) setTimeout(() => { $s('exCookie').style.display = 'block'; }, 1800);
    const nl = document.querySelector('#exNl form'); if (nl) nl.insertAdjacentHTML('afterend', '<button type="button" class="btn-outline" onclick="exShareSite()">↗ Compartilhar o site</button>');
  } catch (err) { console.error('extras v3', err); }
});
const _exRefresh2 = window.socRefreshUI; window.socRefreshUI = function () { _exRefresh2(); try { luLoad(); luRender(); } catch (e) {} };

/* =====================================================================
   EXTRAS v4: faixa de jogos, experiências, check-in, cadastro, app
   ===================================================================== */
/* --- Faixa de jogos (placar rápido sob o menu) --- */
function exStripInit() {
  const el = $s('exStrip'); if (!el) return;
  const crest = (n, logo) => crestBadge(n, logo, 22), me = 'https://i.imgur.com/HWoq88J.png', M = VAJ_MATCH;
  const next = `<a class="ex-m next" href="#ingressos" title="Comprar ingresso"><span class="tag N">Próximo jogo</span>
      <div class="row"><span>${crest('Santa Clara EC', me)} Santa Clara</span><span class="sc">×</span></div><div class="row"><span>${crest(vajAdv(), '')} ${vajAdv()}</span><span style="color:var(--club-gold);font-size:0.65rem">${M.dateLabel}</span></div></a>`;
  const rs = DB.results.map(r => { const k = r.scec > r.opp ? 'V' : r.scec === r.opp ? 'E' : 'D', nm = { V:'Vitória', E:'Empate', D:'Derrota' }[k];
    return `<a class="ex-m" href="#jogos"><span class="tag ${k}">${nm} • ${r.round}</span>
      <div class="row"><span>${crest('Santa Clara EC', me)} Santa Clara</span><span class="sc">${r.scec}</span></div><div class="row"><span>${crest(r.oppName, r.oppLogo)} ${socEsc(r.oppName)}</span><span class="sc" style="color:var(--club-muted)">${r.opp}</span></div></a>`; }).join('');
  el.innerHTML = `<div class="lbl">Jogos</div>${next}${rs}`;
}

/* --- Experiências exclusivas (resgate com pontos) --- */
SOC_REWARDS.push(
  { id:'exp-toca', t:'🧭 Visita guiada à Toca do Lobo (vestiários e túnel)', cost:1200, exp:true },
  { id:'exp-foto', t:'📸 Foto com o elenco após o treino', cost:1800, exp:true },
  { id:'exp-campo', t:'🏟️ Entrar em campo com os jogadores', cost:2500, exp:true },
  { id:'exp-camisa', t:'👕 Camisa autografada pelo elenco', cost:3000, exp:true }
);
const _exMr = window.maRedeem;
window.maRedeem = function (id) {
  const r = SOC_REWARDS.find(x => x.id === id), before = userSession.points;
  _exMr(id);
  if (r && r.exp && userSession.points < before) {
    (userSession.experiences = userSession.experiences || []).push({ t:r.t, code:'EXP-' + Math.random().toString(36).slice(2, 8).toUpperCase(), at:new Date().toISOString() });
    socLog('Experiência resgatada: ' + r.t); socSave(); exConfetti(); socRenderArea();
  }
};
const _exMp = window.maPontos;
window.maPontos = function () {
  const ex = userSession.experiences || [];
  return _exMp() + (ex.length ? '<div class="ma-h">🎫 Suas experiências</div><div class="ma-list">' + ex.map(e => `<div class="ma-item"><div class="top"><strong>${e.t}</strong><span class="ma-tag warn">a agendar</span></div><p style="margin:2px 0 0">Código <b style="font-family:monospace;color:var(--club-gold)">${e.code}</b> • resgatado em ${new Date(e.at).toLocaleDateString('pt-BR')}. Apresente o código na Central do Torcedor para agendar.</p></div>`).join('') + '</div>' : '');
};

/* --- Check-in de ingresso e fidelidade por presença --- */
const CK_LV = [['Estreante', 0], ['Torcedor fiel', 3], ['Cativo da Matilha', 6]];
function maCheckin(i) {
  const t = userSession.tickets[i]; if (!t || t.checkin) return;
  t.checkin = new Date().toISOString(); userSession.presence = (userSession.presence || 0) + 1; userSession.points += 20;
  socLog(`Check-in do ingresso ${t.sectorName || ''} (+20 pontos)`); socSave(); socRenderArea(); socToast('Check-in feito! +20 pontos. Bom jogo, Matilha 🐺');
}
window.maIngressos = function () {
  const u = userSession, t = u.tickets, pres = u.presence || 0, lv = CK_LV.filter(l => pres >= l[1]).length - 1, nx = CK_LV[lv + 1];
  const head = `<div class="ma-item"><div class="top"><strong>📍 Fidelidade: ${CK_LV[lv][0]}</strong><span class="ma-tag ${pres ? '' : 'lock'}">${pres} presença${pres === 1 ? '' : 's'}</span></div>
    <div class="ck-lvl">${CK_LV.map((l, k) => `<span class="${k <= lv ? 'on' : ''}">${l[0]}<br>${l[1]}+ jogos</span>`).join('')}</div><p style="margin:0">${nx ? `Faltam ${nx[1] - pres} presença${nx[1] - pres === 1 ? '' : 's'} para ${nx[0]}.` : 'Você é Cativo da Matilha!'} Cada check-in rende 20 pontos.</p></div>`;
  if (!t.length) return head + `<div class="ma-item"><strong>Nenhum ingresso ainda</strong><p>Seus ingressos e QR Codes aparecem aqui, com o desconto de sócio já aplicado.</p><button class="btn-primary" onclick="closeModal('memberAreaModal');goSection('ingressos')">Comprar ingresso</button></div>`;
  return head + '<div class="ma-list">' + t.map((x, i) => `<div class="ma-item"><div class="top"><strong>${socEsc(x.match)}</strong><span class="ma-tag">${x.quantity || 1}x</span></div>
    <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;"><div class="ma-qr" id="tkQr${i}" style="background:#fff;padding:5px;border-radius:6px;"></div>
    <div><p style="margin:0;">${socEsc(x.sectorName || 'Setor')} • ${socEsc(x.gate || '')}<br>Emitido em ${socEsc(x.date || '')}${x.paid != null ? '<br>Pago: <strong>' + socMoney(x.paid) + '</strong>' + (x.saved > 0 ? ' <span style="color:#2e9e4f">(economia ' + socMoney(x.saved) + ')</span>' : '') : ''}</p><small style="font-family:monospace;color:var(--club-gold)">${socEsc(x.hash)}</small><br>
    ${x.checkin ? `<span class="ma-tag">✔ Check-in feito em ${new Date(x.checkin).toLocaleDateString('pt-BR')}</span>` : `<button class="btn-outline" style="margin-top:6px" onclick="maCheckin(${i})">📍 Fazer check-in</button>`}</div></div></div>`).join('') + '</div>';
};

/* --- Cadastro do torcedor (Início da Área do Sócio) --- */
const _exMpn = window.maPainel;
window.maPainel = function () {
  const u = userSession, it = [['Nome completo', (u.name || '').split(' ').length > 1], ['Documento', !!u.docMasked], ['Telefone', !!u.phone], ['Foto', !!u.photo]], ok = it.filter(x => x[1]).length;
  return _exMpn() + `<div class="ma-h">Cadastro do torcedor</div><div class="ma-item"><div class="top"><strong>${ok === 4 ? '✅ Cadastro completo' : `Cadastro ${ok}/4`}</strong><span class="ma-tag ${ok === 4 ? '' : 'warn'}">${ok === 4 ? 'entrada rápida' : 'incompleto'}</span></div>
    <div class="cad-grid">${it.map(x => `<div class="${x[1] ? 'ok' : ''}">${x[1] ? '✔' : '○'} ${x[0]}</div>`).join('')}</div>
    <p style="margin:0 0 8px">Com o cadastro completo, a conferência na entrada do estádio é mais rápida.</p>${ok === 4 ? '' : `<button class="btn-outline" onclick="maTab='perfil';socRenderArea()">Completar cadastro</button>`}</div>`;
};

/* --- Instalar como app --- */
function exInstallOpen() {
  let m = $s('exInstall');
  if (!m) { m = document.createElement('div'); m.id = 'exInstall'; m.className = 'modal-overlay'; document.body.appendChild(m); }
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent), and = /android/i.test(navigator.userAgent);
  const steps = ios ? ['Abra este site no <b>Safari</b>.', 'Toque em <b>Compartilhar</b> (quadrado com seta).', 'Escolha <b>Adicionar à Tela de Início</b>.'] : and ? ['Abra este site no <b>Chrome</b>.', 'Toque nos <b>3 pontinhos</b> do canto.', 'Escolha <b>Adicionar à tela inicial</b> ou <b>Instalar app</b>.'] : ['No computador, use o Chrome ou o Edge.', 'Clique no ícone de <b>instalar</b> na barra de endereço (ou menu ⋮ → Instalar).', 'No celular, abra este link e adicione à tela inicial.'];
  m.innerHTML = `<div class="modal-card" style="max-width:420px"><button class="modal-close" aria-label="Fechar" onclick="closeModal('exInstall')" aria-label="Fechar">✕</button><h3 style="font-family:var(--font-display);text-transform:uppercase;font-size:1.5rem">📱 Santa Clara no seu celular</h3>
    <p style="color:var(--club-muted);font-size:0.85rem;margin:8px 0 14px">Deixe o site do clube na tela inicial e abra com um toque, como um app.</p>
    <ol style="display:grid;gap:10px;padding-left:20px;font-size:0.88rem;line-height:1.5">${steps.map(x => `<li>${x}</li>`).join('')}</ol><button class="btn-primary" style="width:100%;justify-content:center;margin-top:16px" onclick="closeModal('exInstall')">Entendi</button></div>`;
  openModal('exInstall');
}
document.addEventListener('DOMContentLoaded', () => {
  try {
    exStripInit();
    const nl = document.querySelector('#exNl form'); if (nl) nl.parentNode.insertAdjacentHTML('beforeend', '<button type="button" class="btn-outline" onclick="exInstallOpen()">📱 Instalar como app</button>');
  } catch (err) { console.error('extras v4', err); }
});
