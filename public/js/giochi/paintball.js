// PAINTBALL: campo d'erba visto dall'alto, muretti, palline e macchie di vernice.
(() => {
  const { COLORI, lerp, omino } = window.Arena;
  const tavolo = window.Arena.tavolo({
    id: 'paintball',
    mouse: 'mira',
    nomeAzione: '🎯 Spara',
    obiettivo: 'centri',
    suonoAzione: [[700, 0.02], [300, 0.04]],
    istruzioni: () => 'WASD o frecce per muoverti, mira col mouse e clicca per sparare (sul telefono: joystick e tocca il campo dove vuoi sparare).',
    statoGioco: (ctx, s) => { const e = s.s.e[ctx.mio]; return e && e.m ? 'Colpito! Riparti…' : 'Fai centro!'; },
    hud: (ctx, s) => `<span>⏱️ ${s.s.resta} s</span><span>🎯 ${ctx.partita.punti[ctx.mio]}</span>`,
    fineRound: (p, s, ctx) => `Centri totali: ${p.punti[ctx.mio]}`,
    disegna(g, p, s, prima, u, ctx) {
      const W = p.W, H = p.H;
      g.fillStyle = '#5d9b4a'; g.fillRect(0, 0, W, H);
      g.fillStyle = 'rgba(255,255,255,.05)'; for (let x = 0; x < W; x += 80) g.fillRect(x, 0, 40, H);
      for (const k of s.s.mc) { g.fillStyle = COLORI[k.c % COLORI.length]; g.globalAlpha = 0.75; g.beginPath(); for (let j = 0; j < 9; j++) { const a = (j / 9) * Math.PI * 2, r = k.r * (0.7 + ((j * 7 + k.x) % 5) / 10); g.lineTo(k.x + Math.cos(a) * r, k.y + Math.sin(a) * r); } g.fill(); g.globalAlpha = 1; }
      for (const [x, y, w, h] of s.s.bl) { g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(x + 5, y + 6, w, h); g.fillStyle = '#8d8f99'; g.fillRect(x, y, w, h); g.fillStyle = '#a9abb5'; g.fillRect(x, y, w, 6); g.strokeStyle = '#5e606b'; g.lineWidth = 2; g.strokeRect(x, y, w, h); }
      for (const b of lerp(prima && prima.s.pa, s.s.pa, u)) { g.fillStyle = COLORI[b.c % COLORI.length]; g.beginPath(); g.arc(b.x, b.y, 6, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 1.5; g.stroke(); }
      const ee = lerp(prima && prima.s.e, s.s.e, u);
      ee.forEach((e, i) => {
        if (e.m) return;
        // la canna del fucile verso dove mira
        const d = Math.hypot(e.ax - e.x, e.ay - e.y) || 1;
        g.strokeStyle = '#333'; g.lineWidth = 6; g.beginPath(); g.moveTo(e.x, e.y); g.lineTo(e.x + ((e.ax - e.x) / d) * 26, e.y + ((e.ay - e.y) / d) * 26); g.stroke();
        omino(g, e.x, e.y, 16, COLORI[i % COLORI.length], i === ctx.mio ? 'Tu' : ctx.nome(i).slice(0, 10), { io: i === ctx.mio, alfa: e.pr ? 0.55 : 1 });
      });
      // il mirino
      const mio = ee[ctx.mio];
      if (mio && !mio.m && !window.Arena.touch()) { g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 2; g.beginPath(); g.arc(mio.ax, mio.ay, 10, 0, Math.PI * 2); g.moveTo(mio.ax - 15, mio.ay); g.lineTo(mio.ax + 15, mio.ay); g.moveTo(mio.ax, mio.ay - 15); g.lineTo(mio.ax, mio.ay + 15); g.stroke(); }
    },
    dopoTick(ctx, d, prima) { const a = prima && prima.s.e[ctx.mio], b = d.s.e[ctx.mio]; if (a && b && !a.m && b.m) window.Nuovi.suono([[200, 0.1], [120, 0.2]], { volume: 0.08 }); },
  });
  Object.assign(window.Tavoli, { paintball: tavolo });
})();
