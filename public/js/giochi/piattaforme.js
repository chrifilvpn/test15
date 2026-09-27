// SALTA E CORRI: la telecamera segue il tuo omino; il livello (griglia di blocchi) arriva nello stato completo.
(() => {
  const { COLORI, lerp, omino } = window.Arena;
  let liv = null, chiave = null;
  const tavolo = window.Arena.tavolo({
    id: 'piattaforme',
    nomeAzione: '⤴️ Salta',
    obiettivo: 'punti',
    istruzioni: () => 'A e D (o le frecce) per correre, spazio o W per saltare (sul telefono joystick e ⤴️). Arriva primo alla bandiera!',
    statoGioco: (ctx, s) => { const e = s.s.e[ctx.mio]; return e && e.a ? 'Arrivato! 🏁' : e && e.c ? 'Caduto: riparti…' : 'Corri!'; },
    hud: (ctx, s) => {
      const tr = liv ? liv.traguardo.x : 1;
      return `<span class="sa-barra pf-gara">${s.s.e.map((e, i) => `<b style="left:${Math.min(100, (e.x / tr) * 100)}%;background:${COLORI[i % COLORI.length]}" title="${i === ctx.mio ? 'tu' : ''}"></b>`).join('')}</span>${s.s.e[ctx.mio] && s.s.e[ctx.mio].p ? `<span>${s.s.e[ctx.mio].p === 'molla' ? '🍄 doppio salto' : '⚡ turbo'}</span>` : ''}`;
    },
    fineRound: (p, s, ctx) => `Punti totali: ${p.punti[ctx.mio]}`,
    disegna(g, p, s, prima, u, ctx) {
      const ex = p.extra;
      if (ex && ex.griglia && chiave !== ex.griglia[20]) { liv = ex; chiave = ex.griglia[20]; }
      if (!liv) return;
      const W = p.W, H = p.H, T = liv.T;
      const ee = lerp(prima && prima.s.e, s.s.e, u);
      const io = ee[ctx.mio] || ee[0];
      const mondoW = liv.cols * T, mondoH = liv.righe * T;
      const camX = Math.max(0, Math.min(mondoW - W, io.x - W * 0.4)), camY = Math.max(0, Math.min(mondoH - H, io.y - H * 0.55));
      const cielo = g.createLinearGradient(0, 0, 0, H); cielo.addColorStop(0, '#7ec8f2'); cielo.addColorStop(1, '#d9f1ff');
      g.fillStyle = cielo; g.fillRect(0, 0, W, H);
      g.fillStyle = '#a7d98f'; for (let k = -1; k < 6; k++) { const x = k * 300 - (camX * 0.3) % 300; g.beginPath(); g.ellipse(x + 150, H - 20 - camY * 0.1, 220, 120, 0, Math.PI, 0); g.fill(); }
      g.save(); g.translate(-camX, -camY);
      const c0 = Math.floor(camX / T), c1 = Math.min(liv.cols - 1, Math.ceil((camX + W) / T));
      for (let r = 0; r < liv.righe; r++) for (let c = c0; c <= c1; c++) {
        if (liv.griglia[r][c] !== '1') continue;
        const erba = r === 0 || liv.griglia[r - 1][c] !== '1';
        g.fillStyle = '#8b5a2b'; g.fillRect(c * T, r * T, T, T);
        g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(c * T + 6, r * T + 14, 8, 6); g.fillRect(c * T + 24, r * T + 26, 6, 5);
        if (erba) { g.fillStyle = '#4caf50'; g.fillRect(c * T, r * T, T, 10); g.fillStyle = '#66bb6a'; g.fillRect(c * T, r * T, T, 4); }
      }
      g.font = '26px system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle';
      for (const q of liv.pot) if (!s.s.presi.includes(q.id)) g.fillText(q.t === 'molla' ? '🍄' : '⚡', q.x, q.y + Math.sin(s.t * 4 + q.id) * 4);
      g.textBaseline = 'alphabetic';
      const tr = liv.traguardo;
      g.fillStyle = '#ddd'; g.fillRect(tr.x, tr.y - 160, 6, 160);
      for (let k = 0; k < 4; k++) for (let j = 0; j < 3; j++) { g.fillStyle = (k + j) % 2 ? '#111' : '#fff'; g.fillRect(tr.x + 6 + k * 12, tr.y - 160 + j * 12, 12, 12); }
      ee.forEach((e, i) => {
        if (e.c) return;
        const alfa = i === ctx.mio ? 1 : 0.55;
        g.save(); g.globalAlpha = alfa;
        g.strokeStyle = '#333'; g.lineWidth = 4; const passo = e.t ? Math.sin(s.t * 18 + i) * 6 : 3;
        g.beginPath(); g.moveTo(e.x - 5, e.y + 8); g.lineTo(e.x - 5 + passo, e.y + 17); g.moveTo(e.x + 5, e.y + 8); g.lineTo(e.x + 5 - passo, e.y + 17); g.stroke();
        g.restore();
        omino(g, e.x, e.y - 2, 13, COLORI[i % COLORI.length], i === ctx.mio ? 'Tu' : ctx.nome(i).slice(0, 10), { io: i === ctx.mio, alfa });
      });
      g.restore();
    },
    dopoTick(ctx, d, prima) { const a = prima && prima.s.e[ctx.mio], b = d.s.e[ctx.mio]; if (a && b && !a.c && b.c) window.Nuovi.suono([[300, 0.1], [150, 0.25]], { volume: 0.07 }); if (a && b && !a.a && b.a) window.Nuovi.suono([[523, 0.1], [659, 0.1], [784, 0.2]], { volume: 0.08 }); },
    suonoAzione: [[660, 0.04], [880, 0.04]],
  });
  Object.assign(window.Tavoli, { piattaforme: tavolo });
})();
