// CASELLE COLORATE: pavimento a caselle, il colore da raggiungere in alto con la barra del tempo.
(() => {
  const { COLORI, lerp, omino } = window.Arena;
  const COL = ['#e8453c', '#2f7fd8', '#2e9d57', '#f2c230', '#8e55c9', '#f08a24'];
  const NOMI = ['ROSSO', 'BLU', 'VERDE', 'GIALLO', 'VIOLA', 'ARANCIONE'];
  let colpi = [];
  const tavolo = window.Arena.tavolo({
    id: 'arcobaleno',
    nomeAzione: '👊 Pugno',
    obiettivo: 'punti',
    istruzioni: () => 'WASD o frecce (sul telefono il joystick): corri sul colore giusto! Spazio (o 👊): pugno a chi ti sta vicino.',
    statoGioco: (ctx, s) => { const e = s.s.e[ctx.mio]; return e && e.f ? 'Caduto: guarda gli altri' : `Vai sul ${NOMI[s.s.col].toLowerCase()}!`; },
    hud: (ctx, s) => `<span class="ab-colore" style="background:${COL[s.s.col]}">${NOMI[s.s.col]}</span><span>turno ${s.s.ci}</span><span>🧍 in piedi: ${s.s.e.filter((e) => !e.f).length}</span>`,
    fineRound: (p, s, ctx) => `Punti totali: ${p.punti[ctx.mio]}`,
    dopoTick(ctx, d, prima) {
      for (const [x, y, colpito] of d.s.pu) { colpi.push({ x, y, t: performance.now() }); window.Nuovi.suono(colpito ? [[160, 0.08]] : [[400, 0.03]], { tipo: 'square', volume: 0.06 }); }
      if (prima && prima.s.f2 === 'corri' && d.s.f2 === 'cade') window.Nuovi.suono([[300, 0.08], [150, 0.25]], { volume: 0.06 });
    },
    disegna(g, p, s, prima, u, ctx) {
      const W = p.W, H = p.H, C = 100, OY = 10;
      g.fillStyle = '#0d1420'; g.fillRect(0, 0, W, H);
      for (let k = 0; k < 40; k++) { g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect((k * 97) % W, (k * 53) % H, 2, 2); }
      const cade = s.s.f2 === 'cade';
      s.s.c.forEach((col, k) => {
        const x = (k % 10) * C, y = OY + Math.floor(k / 10) * C;
        if (cade && col !== s.s.col) return;
        g.fillStyle = COL[col]; g.fillRect(x + 3, y + 3, C - 6, C - 6);
        g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x + 3, y + 3, C - 6, 12);
        g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(x + 3, y + C - 13, C - 6, 10);
        if (!cade && col === s.s.col) { g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 3; g.strokeRect(x + 6, y + 6, C - 12, C - 12); }
      });
      const ee = lerp(prima && prima.s.e, s.s.e, u);
      ee.forEach((e, i) => {
        if (e.f >= 1) return;
        const sc = e.f ? 1 - e.f * 0.8 : 1;
        omino(g, e.x, e.y + (e.f ? e.f * 30 : 0), 16 * sc, COLORI[i % COLORI.length], e.f ? '' : i === ctx.mio ? 'Tu' : ctx.nome(i).slice(0, 10), { io: i === ctx.mio, stordito: e.st, alfa: e.f ? 1 - e.f : 1 });
      });
      const ora = performance.now();
      colpi = colpi.filter((k) => ora - k.t < 300);
      for (const k of colpi) { const a = (ora - k.t) / 300; g.strokeStyle = `rgba(255,255,255,${1 - a})`; g.lineWidth = 4; g.beginPath(); g.arc(k.x, k.y, 20 + a * 45, 0, Math.PI * 2); g.stroke(); }
      // barra del tempo
      if (s.s.f2 === 'corri') { g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(0, H - 8, W, 8); g.fillStyle = COL[s.s.col]; g.fillRect(0, H - 8, W * (s.s.tm / s.s.tt), 8); }
    },
  });
  Object.assign(window.Tavoli, { arcobaleno: tavolo });
})();
