// PAINTBALL: sparatutto visto dall'alto. Ti muovi con la tastiera (o il joystick) e spari palline di vernice verso il
// mouse (o dove tocchi il campo). Chi viene colpito si sporca e riparte da un angolo. Vince chi fa più centri.
const { Arena, casuale } = require('./arena');
const W = 1000, H = 620, R = 16, V = 215, V_PALLA = 640, VITA_PALLA = 1.3, RICARICA = 0.35, DURATA = 75, RINASCITA = 1.5, PROTEZIONE = 1.2;
const CAMPI = [
  [[200, 140, 70, 70], [730, 140, 70, 70], [200, 410, 70, 70], [730, 410, 70, 70], [440, 250, 120, 120], [80, 290, 40, 40], [880, 290, 40, 40]],
  [[300, 80, 40, 180], [660, 360, 40, 180], [470, 280, 60, 60], [140, 450, 160, 36], [700, 130, 160, 36]],
  [[240, 280, 520, 34], [140, 100, 34, 140], [826, 380, 34, 140], [480, 90, 40, 90], [480, 440, 40, 90]],
];
const ANGOLI = [[50, 50], [W - 50, H - 50], [W - 50, 50], [50, H - 50], [W / 2, 40], [W / 2, H - 40], [40, H / 2], [W - 40, H / 2]];

const dentroRett = (x, y, [rx, ry, w, h], m = 0) => x > rx - m && x < rx + w + m && y > ry - m && y < ry + h + m;
function spingi(e, blocchi) {
  e.x = Math.max(R, Math.min(W - R, e.x)); e.y = Math.max(R, Math.min(H - R, e.y));
  for (const [x, y, w, h] of blocchi) {
    const cx = Math.max(x, Math.min(x + w, e.x)), cy = Math.max(y, Math.min(y + h, e.y)), dx = e.x - cx, dy = e.y - cy, d = Math.hypot(dx, dy);
    if (d < R && d > 0.001) { e.x = cx + (dx / d) * R; e.y = cy + (dy / d) * R; }
  }
}
// si vede in linea retta da a a b senza blocchi in mezzo?
function libera(a, b, blocchi) {
  const passi = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 12);
  for (let k = 1; k < passi; k++) { const x = a.x + ((b.x - a.x) * k) / passi, y = a.y + ((b.y - a.y) * k) / passi; if (blocchi.some((r) => dentroRett(x, y, r, 3))) return false; }
  return true;
}

class Paintball extends Arena {
  constructor(o) { super(o, { id: 'paintball', round: 2 }); this.W = W; this.H = H; this.avvia(); }
  iniziaRound() {
    this.blocchi = CAMPI[(this.round - 1) % CAMPI.length];
    this.palle = []; this.macchie = []; this.nP = 0;
    this.e = Array.from({ length: this.n }, (_, i) => ({ id: i, x: ANGOLI[i % 8][0], y: ANGOLI[i % 8][1], ricarica: 0, morto: 0, prot: PROTEZIONE, centri: 0, salto: 0, ax: W / 2, ay: H / 2 }));
    this.mente = {}; this.colpi = [];
  }
  spara(p) {
    const e = this.e[p], i = this.inp[p];
    if (e.ricarica > 0 || e.morto > 0) return;
    const tx = i.mx ?? e.ax, ty = i.my ?? e.ay;
    const d = Math.hypot(tx - e.x, ty - e.y) || 1;
    this.palle.push({ id: ++this.nP, x: e.x + ((tx - e.x) / d) * (R + 4), y: e.y + ((ty - e.y) / d) * (R + 4), vx: ((tx - e.x) / d) * V_PALLA, vy: ((ty - e.y) / d) * V_PALLA, da: p, t: 0 });
    e.ricarica = RICARICA;
    this.colpi.push(p);
  }
  passo(dt) {
    for (let p = 0; p < this.n; p++) {
      const e = this.e[p], i = this.inp[p];
      e.ricarica = Math.max(0, e.ricarica - dt); e.prot = Math.max(0, e.prot - dt);
      if (i.mx !== null) { e.ax = i.mx; e.ay = i.my; }
      if (e.morto > 0) {
        e.morto -= dt; this.nuoviTocchi(p);
        if (e.morto <= 0) {
          // si riparte dall'angolo più lontano dagli altri
          const a = ANGOLI.slice(0, 4).reduce((m, q) => { const d = Math.min(...this.e.filter((o, k) => k !== p && o.morto <= 0).map((o) => Math.hypot(o.x - q[0], o.y - q[1])), 9999); return d > m.d ? { d, q } : m; }, { d: -1, q: ANGOLI[0] }).q;
          e.x = a[0]; e.y = a[1]; e.prot = PROTEZIONE; e.salto++; this.cambiato = true;
        }
        continue;
      }
      e.x += i.x * V * dt; e.y += i.y * V * dt;
      spingi(e, this.blocchi);
      if (this.nuoviTocchi(p) || i.a) this.spara(p);
    }
    for (const b of this.palle) {
      b.t += dt; b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.t > VITA_PALLA || b.x < 0 || b.y < 0 || b.x > W || b.y > H || this.blocchi.some((r) => dentroRett(b.x, b.y, r))) { b.fine = true; this.macchie.push({ x: Math.round(b.x), y: Math.round(b.y), c: b.da, r: 8 }); continue; }
      for (let q = 0; q < this.n; q++) {
        const e = this.e[q];
        if (q === b.da || e.morto > 0 || e.prot > 0) continue;
        if (Math.hypot(e.x - b.x, e.y - b.y) < R + 5) {
          b.fine = true; e.morto = RINASCITA; this.punti[b.da]++; this.e[b.da].centri++;
          this.macchie.push({ x: Math.round(e.x), y: Math.round(e.y), c: b.da, r: 22 });
          this.cambiato = true;
          this.annuncia(b.da, 'colpisce @! 🎯', 'hai colpito @! 🎯', false, { bersaglio: q, testoTe: 'ti ha colpito! 🎨' });
          break;
        }
      }
    }
    this.palle = this.palle.filter((b) => !b.fine);
    if (this.macchie.length > 160) this.macchie.splice(0, this.macchie.length - 160);
    return this.tempoRound >= DURATA;
  }
  fineRound() {}
  pensa(p, liv) {
    const e = this.e[p];
    if (e.morto > 0) return {};
    const m = this.mente[p] || (this.mente[p] = { fino: 0, x: 0, y: 0, mx: W / 2, my: H / 2, lato: 1 });
    const ora = this.tempoRound;
    if (ora < m.fino) return { x: m.x, y: m.y, mx: m.mx, my: m.my };
    m.fino = ora + { facile: 0.35, medio: 0.18, difficile: 0.08 }[liv];
    // bersaglio: il più vicino, meglio se si vede
    let bers = null, vb = Infinity;
    for (let q = 0; q < this.n; q++) { if (q === p || this.e[q].morto > 0) continue; const o = this.e[q]; const v = Math.hypot(o.x - e.x, o.y - e.y) + (libera(e, o, this.blocchi) ? 0 : 300); if (v < vb) { vb = v; bers = q; } }
    if (bers === null) { m.x = 0; m.y = 0; return {}; }
    const o = this.e[bers], io = this.inp[bers];
    const d = Math.hypot(o.x - e.x, o.y - e.y), vede = libera(e, o, this.blocchi);
    // mira: il difficile anticipa il movimento; tutti sbagliano un po'
    const t = d / V_PALLA, ant = liv === 'difficile' ? 1 : liv === 'medio' ? 0.5 : 0;
    const err = { facile: 70, medio: 30, difficile: 10 }[liv];
    m.mx = o.x + io.x * V * t * ant + casuale(-err, err); m.my = o.y + io.y * V * t * ant + casuale(-err, err);
    // movimento: avvicinarsi se lontano, allontanarsi se vicino, spostarsi di lato; ogni tanto si cambia lato
    const dist = { facile: 200, medio: 260, difficile: 300 }[liv];
    const ux = (o.x - e.x) / (d || 1), uy = (o.y - e.y) / (d || 1);
    if (Math.random() < 0.04) m.lato = -m.lato;
    let mx = 0, my = 0;
    if (!vede) { mx = ux; my = uy; mx += -uy * 0.8 * m.lato; my += ux * 0.8 * m.lato; } else {
      const avanti = d > dist ? 1 : d < dist - 80 ? -1 : 0;
      mx = ux * avanti - uy * m.lato * (liv === 'facile' ? 0.3 : 0.9); my = uy * avanti + ux * m.lato * (liv === 'facile' ? 0.3 : 0.9);
    }
    // il difficile schiva le palle in arrivo
    if (liv === 'difficile') for (const b of this.palle) { if (b.da === p) continue; const rx = e.x - b.x, ry = e.y - b.y, vv = Math.hypot(b.vx, b.vy), proiez = (rx * b.vx + ry * b.vy) / vv; if (proiez > 0 && proiez < 180) { const lat = Math.abs(rx * b.vy - ry * b.vx) / vv; if (lat < R + 12) { mx += -b.vy / vv * 1.5 * m.lato; my += b.vx / vv * 1.5 * m.lato; } } }
    const l = Math.hypot(mx, my) || 1; m.x = mx / l; m.y = my / l;
    const spara = vede && Math.random() < { facile: 0.35, medio: 0.7, difficile: 0.95 }[liv];
    return { x: m.x, y: m.y, mx: m.mx, my: m.my, tocco: spara };
  }
  statoTick() {
    return {
      bl: this.blocchi, resta: Math.max(0, Math.round(DURATA - this.tempoRound)),
      e: this.e.map((e) => ({ id: e.id, x: Math.round(e.x), y: Math.round(e.y), m: e.morto > 0 ? 1 : 0, pr: e.prot > 0 ? 1 : 0, ax: Math.round(e.ax), ay: Math.round(e.ay), salto: e.salto })),
      pa: this.palle.map((b) => ({ id: b.id, x: Math.round(b.x), y: Math.round(b.y), c: b.da })), mc: this.macchie.slice(-40),
    };
  }
}

module.exports = {
  meta: {
    id: 'paintball',
    nome: 'Paintball',
    tipo: 'tabellone',
    tempoReale: true,
    pausaBoss: true,
    giocatori: [2, 3, 4, 5, 6, 7, 8],
    descrizione: 'Sparatutto visto dall\'alto con le palline di vernice: muoviti, mira col mouse, ripariti dietro i muretti e fai centro!',
    alias: ['paintball', 'sparatutto', 'shooter', 'vernice', 'spara', 'top down'],
    opzioni: [{ id: 'round', nome: 'Round', valori: [2, 1, 3], etichette: ['2 round', '1 round', '3 round'], predefinito: 2 }],
    regole: [
      'Ti muovi con WASD o le frecce e miri con il mouse: clicca (o premi spazio, o tieni premuto) per sparare una pallina di vernice. Sul telefono: joystick per muoverti e tocca il campo dove vuoi sparare.',
      'Le palline si fermano sui muretti, che servono da riparo. Tra un colpo e l\'altro c\'è un attimo di ricarica.',
      'Chi viene colpito si sporca di vernice e riparte dopo un secondo e mezzo dall\'angolo più lontano dagli avversari, protetto per poco più di un secondo. Ogni centro vale un punto.',
      'Un round dura 75 secondi e a ogni round cambia il campo. Dopo 2 round (o 1, o 3) vince chi ha fatto più centri.',
      'Il gioco è in tempo reale: si ferma per tutti quando qualcuno apre le dispense.',
      'Il computer facile mira male e si muove poco; il medio si sposta di lato e mira bene; il difficile anticipa dove andrai, schiva le palline e non sbaglia quasi mai.',
    ],
  },
  crea: (o) => new Paintball(o),
  bot: () => ({}),
  _test: { Paintball },
};
