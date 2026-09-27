// FUGA DAI FANTASMI e MONETE IN SALITA: stesso disegno a scorrimento verticale (lo schermo segue la "camera").
(() => {
  const { COLORI, lerp, omino } = window.Arena;
  function masso(g, x, y, r) {
    g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(x + 4, y + r * 0.5, r, r * 0.55, 0, 0, Math.PI * 2); g.fill();
    const gr = g.createRadialGradient(x - r * 0.4, y - r * 0.4, 2, x, y, r); gr.addColorStop(0, '#b8b2a7'); gr.addColorStop(1, '#6b655c');
    g.fillStyle = gr; g.beginPath(); g.moveTo(x + r, y); for (let k = 1; k <= 9; k++) { const a = (k / 9) * Math.PI * 2, rr = r * (0.88 + ((k * 37) % 10) / 60); g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.fill();
  }
  function muro(g, x, y, w, h, notte) {
    g.fillStyle = notte ? '#3d3a4a' : '#9a7b56'; g.fillRect(x, y, w, h);
    g.strokeStyle = notte ? '#252330' : '#6d5438'; g.lineWidth = 2;
    for (let xx = x; xx < x + w; xx += 34) { g.strokeRect(xx, y, 34, h / 2); g.strokeRect(xx + 17, y + h / 2, 34, h / 2); }
  }
  function fantasma(g, x, y, t) {
    g.save(); g.translate(x, y + Math.sin(t * 3 + x) * 6);
    g.fillStyle = 'rgba(235,240,255,.9)'; g.beginPath(); g.arc(0, 0, 28, Math.PI, 0);
    for (let k = 0; k <= 4; k++) g.lineTo(28 - k * 14, 30 + (k % 2 ? -8 : 0));
    g.closePath(); g.fill();
    g.fillStyle = '#222'; g.beginPath(); g.ellipse(-9, -4, 5, 8, 0, 0, Math.PI * 2); g.ellipse(9, -4, 5, 8, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(0, 12, 6, 8, 0, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  function disegna(modo) {
    return (g, p, s, prima, u, ctx) => {
      const W = p.W, H = p.H, notte = modo === 'fuga';
      const cam = prima ? prima.s.cam + (s.s.cam - prima.s.cam) * u : s.s.cam;
      const sfondo = g.createLinearGradient(0, 0, 0, H);
      if (notte) { sfondo.addColorStop(0, '#12122a'); sfondo.addColorStop(1, '#2d2150'); } else { sfondo.addColorStop(0, '#9bd08a'); sfondo.addColorStop(1, '#7cbc6b'); }
      g.fillStyle = sfondo; g.fillRect(0, 0, W, H);
      // sentiero / erba che scorre
      g.fillStyle = notte ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.12)';
      for (let y = -((cam % 80) + 80) % 80; y < H; y += 80) for (let x = ((y + cam) / 80) % 2 ? 40 : 0; x < W; x += 160) g.fillRect(x, y, 60, 6);
      g.save(); g.translate(0, -cam);
      if (s.s.fine !== null && s.s.fine > cam - 40 && s.s.fine < cam + H + 40) {
        for (let x = 0; x < W; x += 20) for (let k = 0; k < 2; k++) { g.fillStyle = (x / 20 + k) % 2 ? '#111' : '#fff'; g.fillRect(x, s.s.fine - 20 + k * 10, 20, 10); }
        g.fillStyle = '#fff'; g.font = '700 22px system-ui'; g.textAlign = 'center'; g.fillText('🏁 TRAGUARDO', W / 2, s.s.fine - 30);
      }
      for (const o of s.s.o) { if (o.t === 0) masso(g, o.x, o.y, o.r); else muro(g, o.x, o.y, o.w, o.h, notte); }
      for (const m of s.s.mo) { g.fillStyle = '#f6c431'; g.beginPath(); g.arc(m.x, m.y, 10, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#b8860b'; g.lineWidth = 2; g.stroke(); g.fillStyle = '#b8860b'; g.font = '700 11px system-ui'; g.textAlign = 'center'; g.fillText('€', m.x, m.y + 4); }
      const ee = lerp(prima && prima.s.e, s.s.e, u);
      ee.forEach((e, i) => { if (!e.f && !e.a) omino(g, e.x, e.y, 15, COLORI[i % COLORI.length], i === ctx.mio ? 'Tu' : ctx.nome(i).slice(0, 10), { io: i === ctx.mio, alfa: i === ctx.mio ? 1 : 0.8 }); });
      g.restore();
      // il fondo: i fantasmi (o la nebbia di chi resta indietro)
      const fondo = g.createLinearGradient(0, H - 90, 0, H); fondo.addColorStop(0, notte ? 'rgba(180,190,255,0)' : 'rgba(40,30,20,0)'); fondo.addColorStop(1, notte ? 'rgba(180,190,255,.55)' : 'rgba(40,30,20,.6)');
      g.fillStyle = fondo; g.fillRect(0, H - 90, W, 90);
      if (notte) for (let k = 0; k < 9; k++) fantasma(g, 60 + k * 110, H - 18, s.t + k);
      else { g.fillStyle = 'rgba(200,40,30,.8)'; g.fillRect(0, H - 6, W, 6); }
    };
  }
  const base = (modo) => ({
    id: modo,
    obiettivo: modo === 'fuga' ? 'secondi di fuga' : 'monete e arrivi',
    istruzioni: () => (modo === 'fuga' ? 'WASD o frecce (sul telefono il joystick): sali e scappa! Chi tocca il fondo viene preso dai fantasmi.' : 'WASD o frecce (sul telefono il joystick): raccogli le monete e arriva in cima. Chi resta indietro è fuori.'),
    statoGioco: (ctx, s) => { const e = s.s.e[ctx.mio]; return !e ? '' : e.f ? 'Sei fuori: guarda gli altri' : e.a ? 'Sei arrivato!' : modo === 'fuga' ? 'Scappa!' : 'Sali!'; },
    hud: (ctx, s) => (modo === 'fuga' ? `<span>⏱️ ${Math.floor(s.t)} s</span><span>🏃 in fuga: ${s.s.e.filter((e) => !e.f).length}</span>`
      : `<span>🪙 ${s.s.e[ctx.mio] ? s.s.e[ctx.mio].m : 0} monete</span><span class="sa-barra"><i style="width:${Math.round(s.s.prog * 100)}%"></i></span><span>${Math.round(s.s.prog * 100)}%</span>`),
    fineRound: (p, s, ctx) => `Punti totali: ${p.punti[ctx.mio]}`,
    disegna: disegna(modo),
    dopoTick(ctx, d, prima) {
      const a = prima && prima.s.e[ctx.mio], b = d.s.e[ctx.mio];
      if (a && b && b.m > a.m) window.Nuovi.suono([[880, 0.04], [1175, 0.06]], { volume: 0.04 });
      if (a && b && !a.f && b.f) window.Nuovi.suono([[300, 0.1], [150, 0.3]], { volume: 0.08 });
    },
  });
  Object.assign(window.Tavoli, { fuga: window.Arena.tavolo(base('fuga')), monete: window.Arena.tavolo(base('monete')) });
})();
