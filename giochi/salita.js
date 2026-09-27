// DUE GIOCHI A SCORRIMENTO VERTICALE (lo schermo sale da solo e non si vede cosa c'è sopra finché non arriva):
// - FUGA DAI FANTASMI: dal basso salgono i fantasmi; chi resta indietro viene preso. Sopravvive chi dura di più.
// - MONETE IN SALITA: un percorso di lunghezza fissa pieno di monete e ostacoli; chi resta indietro è fuori,
//   chi arriva al traguardo prende un bonus in base all'ordine d'arrivo.
const { Arena, casuale } = require('./arena');
const W = 1000, H = 620, R = 15, V = 300;
const LUNGHEZZA = 6000; // monete in salita: lunghezza del percorso

function spingiFuori(e, ostacoli) {
  for (const o of ostacoli) {
    if (o.tipo === 'masso') {
      const dx = e.x - o.x, dy = e.y - o.y, d = Math.hypot(dx, dy), m = o.r + R;
      if (d < m && d > 0.001) { e.x = o.x + (dx / d) * m; e.y = o.y + (dy / d) * m; }
    } else {
      const cx = Math.max(o.x, Math.min(o.x + o.w, e.x)), cy = Math.max(o.y, Math.min(o.y + o.h, e.y));
      const dx = e.x - cx, dy = e.y - cy, d = Math.hypot(dx, dy);
      if (d < R) {
        if (d > 0.001) { e.x = cx + (dx / d) * R; e.y = cy + (dy / d) * R; } else e.y = o.y + o.h + R;
      }
    }
  }
}

class Salita extends Arena {
  constructor(o, modo) {
    super(o, { id: modo, round: 3 });
    this.modo = modo;
    this.W = W; this.H = H;
    this.avvia();
  }
  iniziaRound() {
    this.cam = 0; // y del bordo alto dello schermo nel mondo (sale: diventa sempre più negativo)
    this.ostacoli = []; this.monete = []; this.nO = 0;
    this.generato = H - 260;
    this.e = Array.from({ length: this.n }, (_, i) => ({ id: i, x: W / 2 + (i - (this.n - 1) / 2) * 60, y: H * 0.6, fuori: false, arrivo: null, monete: 0, fuoriT: null }));
    this.arrivi = [];
    this.mente = {};
    this.genera();
  }
  // nuove file di ostacoli sopra lo schermo
  genera() {
    const fino = this.cam - 700;
    while (this.generato > fino) {
      const y = this.generato;
      if (this.modo === 'monete' && y < -LUNGHEZZA - 200) break;
      const tipo = Math.random() < 0.5 ? 'massi' : 'muro';
      if (tipo === 'muro') {
        // un muro con uno o due varchi
        const varchi = Math.random() < 0.5 ? 1 : 2, larg = casuale(140, 190);
        const pos = Array.from({ length: varchi }, (_, k) => casuale(80 + k * (W / varchi), (k + 1) * (W / varchi) - 80 - larg));
        let x = 0;
        for (const v of pos.sort((a, b) => a - b)) { if (v - x > 10) this.ostacoli.push({ id: ++this.nO, tipo: 'muro', x, y, w: v - x, h: 26 }); x = v + larg; }
        if (W - x > 10) this.ostacoli.push({ id: ++this.nO, tipo: 'muro', x, y, w: W - x, h: 26 });
        if (this.modo === 'monete') for (const v of pos) for (let k = 0; k < 3; k++) this.monete.push({ id: ++this.nO, x: v + larg / 2, y: y - 50 - k * 34 });
      } else {
        const quanti = 2 + Math.floor(Math.random() * 3);
        for (let k = 0; k < quanti; k++) this.ostacoli.push({ id: ++this.nO, tipo: 'masso', x: casuale(60, W - 60), y: y + casuale(-40, 40), r: casuale(24, 42) });
        if (this.modo === 'monete') for (let k = 0; k < 4; k++) { const x = casuale(60, W - 60), yy = y - casuale(40, 110); if (this.ostacoli.every((o) => o.tipo !== 'masso' || Math.hypot(o.x - x, o.y - yy) > o.r + 20)) this.monete.push({ id: ++this.nO, x, y: yy }); }
      }
      this.generato -= casuale(150, 210);
    }
    // si butta via quello che è ormai sotto lo schermo
    this.ostacoli = this.ostacoli.filter((o) => o.y < this.cam + H + 100);
    this.monete = this.monete.filter((m) => m.y < this.cam + H + 60);
  }
  velocita() { return this.modo === 'fuga' ? 55 + this.tempoRound * 3.2 : 85 + this.tempoRound * 1.2; }
  passo(dt) {
    const fineP = -LUNGHEZZA;
    if (!(this.modo === 'monete' && this.cam <= fineP - 40)) this.cam -= this.velocita() * dt;
    this.genera();
    for (let p = 0; p < this.n; p++) {
      const e = this.e[p];
      if (e.fuori || e.arrivo !== null) continue;
      const i = this.inp[p];
      e.x = Math.max(R, Math.min(W - R, e.x + i.x * V * dt));
      e.y += i.y * V * dt;
      spingiFuori(e, this.ostacoli);
      e.x = Math.max(R, Math.min(W - R, e.x));
      if (e.y < this.cam + R + 4) e.y = this.cam + R + 4; // non si va oltre il bordo alto (non si vede cosa c'è)
      // monete
      if (this.modo === 'monete') {
        for (const m of this.monete) if (!m.presa && Math.hypot(m.x - e.x, m.y - e.y) < R + 12) { m.presa = true; e.monete++; this.punti[p]++; }
        if (e.y <= fineP) { e.arrivo = this.tempoRound; this.arrivi.push(p); const bonus = [30, 20, 10][this.arrivi.length - 1] || 5; this.punti[p] += bonus; this.cambiato = true; this.annuncia(p, `arriva in cima! +${bonus} 🏁`, `sei arrivato in cima! +${bonus} 🏁`); }
      }
      // troppo in basso: presi dai fantasmi / rimasti indietro
      if (e.y > this.cam + H - 22) {
        e.fuori = true; e.fuoriT = this.tempoRound; this.cambiato = true;
        this.annuncia(p, this.modo === 'fuga' ? 'è stato preso dai fantasmi! 👻' : 'è rimasto indietro ed è fuori!', this.modo === 'fuga' ? 'ti hanno preso i fantasmi! 👻' : 'sei rimasto indietro: fuori!');
      }
    }
    this.monete = this.monete.filter((m) => !m.presa);
    const inGara = this.e.filter((e) => !e.fuori && e.arrivo === null).length;
    if (this.modo === 'fuga') return inGara === 0 || (this.n > 1 && inGara === 1 && this.e.filter((e) => e.fuori).length === this.n - 1 && this.soloDa(3)) || this.tempoRound > 150;
    return inGara === 0 || this.tempoRound > 180;
  }
  soloDa(s) { this._solo = this._solo || this.tempoRound; return this.tempoRound - this._solo > s; }
  fineRound() {
    this._solo = null;
    if (this.modo === 'fuga') {
      this.e.forEach((e, p) => { this.punti[p] += Math.round(e.fuoriT ?? this.tempoRound); });
      const vivi = this.e.map((e, p) => (e.fuori ? -1 : p)).filter((p) => p >= 0);
      if (vivi.length === 1 && this.n > 1) { this.punti[vivi[0]] += 10; this.annuncia(vivi[0], 'è l\'ultimo a scappare: +10 🏃', 'sei l\'ultimo rimasto: +10 🏃', true); }
    }
  }
  // il computer guarda gli ostacoli sopra di sé e punta al varco o alla moneta migliore
  pensa(p, liv) {
    const e = this.e[p];
    if (e.fuori || e.arrivo !== null) return {};
    const m = this.mente[p] || (this.mente[p] = { fino: 0, x: 0, y: 0 });
    if (this.tempoRound < m.fino) return { x: m.x, y: m.y };
    m.fino = this.tempoRound + { facile: 0.35, medio: 0.15, difficile: 0.1 }[liv];
    if (liv === 'difficile') { const d = this.percorso(e); if (d) { m.x = d.x; m.y = d.y; return d; } }
    const vista = { facile: 140, medio: 220, difficile: 480 }[liv];
    // cerca una x libera appena sopra (campionando), preferendo monete e restando in alto sullo schermo
    let meglio = e.x, vm = -Infinity;
    for (let x = 30; x <= W - 30; x += 20) {
      let v = -Math.abs(x - e.x) * 0.006;
      for (const o of this.ostacoli) {
        if (o.y > e.y + 30 || o.y < e.y - vista) continue;
        const blocca = o.tipo === 'masso' ? Math.abs(o.x - x) < o.r + R + 8 : x > o.x - R - 6 && x < o.x + o.w + R + 6;
        if (blocca) v -= 3 * (1 - (e.y - o.y) / (vista + 40));
      }
      if (this.modo === 'monete' && liv !== 'facile') for (const c of this.monete) if (c.y < e.y && c.y > e.y - vista && Math.abs(c.x - x) < 25) v += 0.6;
      if (v > vm) { vm = v; meglio = x; }
    }
    const dx = meglio - e.x;
    const altezzaVoluta = this.cam + H * { facile: 0.55, medio: 0.45, difficile: 0.22 }[liv];
    const dy = altezzaVoluta - e.y;
    // davanti c'è qualcosa proprio sopra? allora prima di lato
    const sopra = this.ostacoli.some((o) => (o.tipo === 'masso' ? Math.abs(o.x - e.x) < o.r + R && o.y < e.y && o.y > e.y - o.r - 30 : e.x > o.x - R && e.x < o.x + o.w + R && o.y + o.h < e.y + 2 && o.y + o.h > e.y - 40));
    let x = Math.abs(dx) > 8 ? Math.sign(dx) : 0, y = sopra ? 0.3 : Math.max(-1, Math.min(1, dy / 60));
    const err = { facile: 0.5, medio: 0.18, difficile: 0.04 }[liv];
    x += casuale(-err, err); y += casuale(-err, err);
    const l = Math.hypot(x, y) || 1; m.x = l > 1 ? x / l : x; m.y = l > 1 ? y / l : y;
    return { x: m.x, y: m.y };
  }
  // il difficile cerca davvero una strada: griglia di caselle da 20 px su quello che si vede, e la visita in ampiezza
  // trova la casella libera più in alto raggiungibile (con le monete che valgono un po' di strada)
  percorso(e) {
    const C = 20, cols = W / C, righe = Math.ceil(H / C), top = this.cam;
    const libero = new Uint8Array(cols * righe).fill(1);
    for (const o of this.ostacoli) {
      if (o.y > top + H + 60 || o.y < top - 60) continue;
      // solo le caselle intorno all'ostacolo
      const x0 = (o.tipo === 'masso' ? o.x - o.r : o.x) - R - C, x1 = (o.tipo === 'masso' ? o.x + o.r : o.x + o.w) + R + C;
      const y0 = (o.tipo === 'masso' ? o.y - o.r : o.y) - R - C, y1 = (o.tipo === 'masso' ? o.y + o.r : o.y + o.h) + R + C;
      const cMin = Math.max(0, Math.floor(x0 / C)), cMax = Math.min(cols - 1, Math.floor(x1 / C));
      const rMin = Math.max(0, Math.floor((y0 - top) / C)), rMax = Math.min(righe - 1, Math.floor((y1 - top) / C));
      for (let r = rMin; r <= rMax; r++) for (let c = cMin; c <= cMax; c++) {
        const x = c * C + C / 2, y = top + r * C + C / 2;
        const d = o.tipo === 'masso' ? Math.hypot(x - o.x, y - o.y) - o.r : Math.hypot(x - Math.max(o.x, Math.min(o.x + o.w, x)), y - Math.max(o.y, Math.min(o.y + o.h, y)));
        if (d < R + 3) libero[r * cols + c] = 0;
      }
    }
    const c0 = Math.max(0, Math.min(cols - 1, Math.floor(e.x / C))), r0 = Math.max(0, Math.min(righe - 1, Math.floor((e.y - top) / C)));
    const conMonete = this.modo === 'monete' ? new Set(this.monete.map((m) => Math.floor((m.y - top) / C) * cols + Math.floor(m.x / C))) : null;
    const prec = new Int32Array(cols * righe).fill(-1), inizio = r0 * cols + c0;
    prec[inizio] = inizio;
    const coda = [inizio];
    let meglio = inizio, vm = -Infinity;
    for (let q = 0; q < coda.length; q++) {
      const k = coda[q], r = Math.floor(k / cols), c = k % cols;
      let v = -r * 3 - Math.abs(c - c0) * 0.05;
      if (conMonete && conMonete.has(k)) v += 4;
      if (r < 3) v -= 6; // non attaccati al bordo in alto
      if (v > vm) { vm = v; meglio = k; }
      for (const [dr, dc] of [[-1, 0], [0, -1], [0, 1], [1, 0]]) {
        const rr = r + dr, cc = c + dc; if (rr < 0 || cc < 0 || rr >= righe || cc >= cols) continue;
        const kk = rr * cols + cc; if (prec[kk] !== -1 || !libero[kk]) continue;
        prec[kk] = k; coda.push(kk);
      }
    }
    // si risale il cammino fino a un passo di qualche casella avanti
    let k = meglio; const cam = [];
    while (k !== inizio && cam.length < 400) { cam.push(k); k = prec[k]; }
    if (!cam.length) return null;
    const passo = cam[Math.max(0, cam.length - 3)];
    const tx = (passo % cols) * C + C / 2, ty = top + Math.floor(passo / cols) * C + C / 2;
    const dx = tx - e.x, dy = ty - e.y, l = Math.hypot(dx, dy) || 1;
    return l < 4 ? { x: 0, y: 0 } : { x: dx / l, y: dy / l };
  }

  statoTick() {
    const vis = (y) => y > this.cam - 60 && y < this.cam + H + 60;
    return {
      cam: Math.round(this.cam), fine: this.modo === 'monete' ? -LUNGHEZZA : null,
      e: this.e.map((e) => ({ id: e.id, x: Math.round(e.x), y: Math.round(e.y), f: e.fuori ? 1 : 0, a: e.arrivo !== null ? 1 : 0, m: e.monete })),
      o: this.ostacoli.filter((o) => vis(o.y)).map((o) => (o.tipo === 'masso' ? { id: o.id, t: 0, x: Math.round(o.x), y: Math.round(o.y), r: Math.round(o.r) } : { id: o.id, t: 1, x: Math.round(o.x), y: Math.round(o.y), w: Math.round(o.w), h: o.h })),
      mo: this.monete.filter((m) => vis(m.y)).map((m) => ({ id: m.id, x: Math.round(m.x), y: Math.round(m.y) })),
      prog: this.modo === 'monete' ? Math.min(1, -this.cam / LUNGHEZZA) : null,
    };
  }
}

const regoleComuni = [
  'Lo schermo sale da solo, sempre un po\' più veloce, e quello che c\'è sopra lo vedi solo quando arriva: massi e muri con dei varchi.',
  'Ti muovi con WASD o le frecce (sul telefono col joystick). Non puoi andare oltre il bordo in alto; se resti indietro e tocchi il bordo in basso sei fuori.',
];
module.exports = {
  fuga: {
    meta: {
      id: 'fuga', nome: 'Fuga dai fantasmi', tipo: 'tabellone', tempoReale: true, pausaBoss: true, giocatori: [1, 2, 3, 4, 5, 6, 7, 8],
      descrizione: 'Scappa verso l\'alto: dal basso salgono i fantasmi e non vedi cosa c\'è davanti finché lo schermo non scorre.',
      alias: ['fantasmi', 'fuga', 'scappa', 'scorrimento', 'sopravvivenza', 'mostri'],
      opzioni: [{ id: 'round', nome: 'Round', valori: [3, 1, 5], etichette: ['3 round', '1 round', '5 round'], predefinito: 3 }],
      regole: [...regoleComuni,
        'Dal basso salgono i fantasmi: chi resta indietro viene preso ed è fuori per il resto del round.',
        'Punti: un punto per ogni secondo in cui sei scappato; l\'ultimo rimasto prende 10 punti in più (il round finisce 3 secondi dopo che è rimasto solo). Dopo 3 round (o 1, o 5) vince chi ha più punti.',
        'Il gioco è in tempo reale: si ferma per tutti quando qualcuno apre le dispense.',
        'Il computer facile guarda poco avanti e resta basso; il medio trova i varchi per tempo; il difficile guarda lontano e sta sempre in alto.'],
    },
    crea: (o) => new Salita(o, 'fuga'), bot: () => ({}), _test: { Salita },
  },
  monete: {
    meta: {
      id: 'monete', nome: 'Monete in salita', tipo: 'tabellone', tempoReale: true, pausaBoss: true, giocatori: [1, 2, 3, 4, 5, 6, 7, 8],
      descrizione: 'Un percorso che sale, pieno di monete e ostacoli: raccogli più monete che puoi e arriva in cima. Chi resta indietro è fuori.',
      alias: ['monete', 'salita', 'corsa', 'scorrimento', 'coin'],
      opzioni: [{ id: 'round', nome: 'Round', valori: [3, 1, 5], etichette: ['3 round', '1 round', '5 round'], predefinito: 3 }],
      regole: [...regoleComuni,
        'Il percorso ha una lunghezza fissa (la barra mostra quanto manca) ed è pieno di monete, spesso proprio nei varchi dei muri: ogni moneta vale un punto.',
        'Chi arriva in cima prende un bonus: 30 punti il primo, 20 il secondo, 10 il terzo, 5 gli altri. Chi resta indietro è fuori, ma tiene le monete già prese.',
        'Dopo 3 round (o 1, o 5) vince chi ha più punti. Il gioco è in tempo reale: si ferma per tutti quando qualcuno apre le dispense.',
        'Il computer facile guarda poco avanti e non cerca le monete; il medio le cerca; il difficile guarda lontano, prende le monete e sta sempre davanti.'],
    },
    crea: (o) => new Salita(o, 'monete'), bot: () => ({}), _test: { Salita, LUNGHEZZA },
  },
};
