// IL GATTO E I TOPI: stanza vista dall'alto con i mobili; il gatto segue il mouse, i topi vanno con la tastiera.
(() => {
  const { COLORI, lerp } = window.Arena;
  function topo(g, x, y, colore, nome, io, fermo, scudo) {
    g.save(); g.translate(x, y); g.globalAlpha = fermo ? 0.45 : 1;
    g.strokeStyle = '#c98f9a'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-12, 4); g.quadraticCurveTo(-26, 10, -24, -8); g.stroke();
    g.fillStyle = '#9aa1ab'; g.beginPath(); g.ellipse(0, 0, 15, 11, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#c3c8cf'; g.beginPath(); g.arc(8, -9, 6, 0, Math.PI * 2); g.arc(8, 9, 6, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#f2a3b3'; g.beginPath(); g.arc(8, -9, 3, 0, Math.PI * 2); g.arc(8, 9, 3, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#222'; g.beginPath(); g.arc(13, -3, 1.8, 0, Math.PI * 2); g.arc(13, 3, 1.8, 0, Math.PI * 2); g.fill();
    g.fillStyle = colore; g.fillRect(2, -11, 3, 22);
    if (io) { g.strokeStyle = '#fff'; g.lineWidth = 2.5; g.beginPath(); g.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2); g.stroke(); }
    if (scudo) { g.strokeStyle = 'rgba(120,200,255,.8)'; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 22, 0, Math.PI * 2); g.stroke(); }
    g.restore();
    g.fillStyle = '#fff'; g.font = '600 12px system-ui'; g.textAlign = 'center'; g.strokeStyle = 'rgba(0,0,0,.6)'; g.lineWidth = 3; g.strokeText(nome, x, y - 20); g.fillText(nome, x, y - 20);
  }
  function gatto(g, x, y, colore, nome, io) {
    g.save(); g.translate(x, y);
    g.fillStyle = '#e8923a'; g.beginPath(); g.arc(0, 0, 24, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.moveTo(-20, -12); g.lineTo(-16, -32); g.lineTo(-4, -20); g.fill(); g.beginPath(); g.moveTo(20, -12); g.lineTo(16, -32); g.lineTo(4, -20); g.fill();
    g.strokeStyle = '#b8641c'; g.lineWidth = 3; for (const k of [-10, 0, 10]) { g.beginPath(); g.moveTo(k, -22); g.lineTo(k, -14); g.stroke(); }
    g.fillStyle = '#fff'; g.beginPath(); g.ellipse(-8, -2, 6, 7, 0, 0, Math.PI * 2); g.ellipse(8, -2, 6, 7, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#1b5e20'; g.beginPath(); g.ellipse(-8, -1, 2.5, 5, 0, 0, Math.PI * 2); g.ellipse(8, -1, 2.5, 5, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#f48fb1'; g.beginPath(); g.moveTo(-3, 6); g.lineTo(3, 6); g.lineTo(0, 9); g.fill();
    g.strokeStyle = '#fff'; g.lineWidth = 1.2; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * 6, 9); g.lineTo(s * 26, 6); g.moveTo(s * 6, 11); g.lineTo(s * 26, 14); g.stroke(); }
    g.strokeStyle = colore; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 25, 0.4, Math.PI - 0.4); g.stroke();
    if (io) { g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 28, 0, Math.PI * 2); g.stroke(); }
    g.restore();
    g.fillStyle = '#fff'; g.font = '700 13px system-ui'; g.textAlign = 'center'; g.strokeStyle = 'rgba(0,0,0,.6)'; g.lineWidth = 3; g.strokeText(nome, x, y - 38); g.fillText(nome, x, y - 38);
  }
  const eGatto = (ctx) => { const s = ctx.partita.stato.s; return s && s.g === ctx.mio; };
  const tavolo = window.Arena.tavolo({
    id: 'gattotopi',
    mouse: 'bersaglio',
    clicAzione: false,
    obiettivo: 'formaggi 1 · prese 3',
    ruolo: (p, s, ctx) => (s.s.g === ctx.mio ? 'sei il GATTO 🐱' : `sei un TOPO 🐭 · il gatto è ${ctx.nome(s.s.g)}`),
    sottotitolo: (p, ctx) => (eGatto(ctx) ? 'sei il gatto 🐱' : 'sei un topo 🐭'),
    istruzioni: (ctx) => (eGatto(ctx) ? 'Sei il gatto: muovi il mouse (o il dito sul campo) e il gatto lo segue. Prendi i topi: 3 punti!' : 'Sei un topo: WASD o frecce (sul telefono il joystick). Prendi i formaggi e non farti acchiappare!'),
    statoGioco: (ctx, s) => (s.s.g === ctx.mio ? 'Acchiappa i topi!' : 'Scappa e mangia!'),
    hud: (ctx, s) => `<span>⏱️ ${s.s.resta} s</span><span>🐱 ${ctx.partita && s.s.g === ctx.mio ? 'tu' : ctx.nome(s.s.g)}</span><span>🧀 ${s.s.fo.length} in giro</span>`,
    fineRound: (p, s, ctx) => `Punti totali: ${p.punti[ctx.mio]}`,
    disegna(g, p, s, prima, u, ctx) {
      const W = p.W, H = p.H;
      g.fillStyle = '#c8955e'; g.fillRect(0, 0, W, H);
      g.strokeStyle = 'rgba(90,55,25,.25)'; g.lineWidth = 2;
      for (let y = 0; y < H; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); for (let x = (y / 40) % 2 ? 0 : 90; x < W; x += 180) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 40); g.stroke(); } }
      // tane agli angoli
      g.fillStyle = '#3a2414'; for (const [x, y] of [[40, 40], [W - 40, 40], [40, H - 40], [W - 40, H - 40]]) { g.beginPath(); g.arc(x, y, 24, Math.PI, 0); g.lineTo(x + 24, y + 12); g.lineTo(x - 24, y + 12); g.fill(); }
      for (const [x, y, w, h] of s.s.mob || []) {
        g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x + 5, y + 6, w, h);
        g.fillStyle = '#7b4a26'; g.fillRect(x, y, w, h); g.fillStyle = '#9a6536'; g.fillRect(x + 5, y + 5, w - 10, h - 10);
      }
      for (const f of s.s.fo) { g.fillStyle = '#f6c431'; g.beginPath(); g.moveTo(f.x - 13, f.y + 9); g.lineTo(f.x + 13, f.y + 9); g.lineTo(f.x + 11, f.y - 9); g.closePath(); g.fill(); g.strokeStyle = '#c8961a'; g.lineWidth = 2; g.stroke(); g.fillStyle = '#e0a91c'; g.beginPath(); g.arc(f.x + 4, f.y + 2, 2.5, 0, Math.PI * 2); g.arc(f.x - 3, f.y + 5, 2, 0, Math.PI * 2); g.fill(); }
      const ee = lerp(prima && prima.s.e, s.s.e, u);
      ee.forEach((e, i) => { if (i !== s.s.g) topo(g, e.x, e.y, COLORI[i % COLORI.length], i === ctx.mio ? 'Tu' : ctx.nome(i).slice(0, 10), i === ctx.mio, e.f, e.sc); });
      const c = ee[s.s.g]; if (c) gatto(g, c.x, c.y, COLORI[s.s.g % COLORI.length], s.s.g === ctx.mio ? 'Tu' : ctx.nome(s.s.g).slice(0, 10), s.s.g === ctx.mio);
    },
  });
  Object.assign(window.Tavoli, { gattotopi: tavolo });
})();
