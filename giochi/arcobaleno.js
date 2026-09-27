// CASELLE COLORATE: il pavimento è fatto di caselle di sei colori. Esce un colore: prima che finisca il tempo bisogna
// stare su una casella di quel colore, perché tutte le altre spariscono e chi ci è sopra cade. Ci si può dare
// pugni: chi è colpito viene spinto via e resta stordito per un attimo. L'ultimo che resta vince il round.
const { Arena, casuale } = require('./arena');
const W = 1000, H = 620, C = 100, COLS = 10, RIGHE = 6, OY = 10, R = 16, V = 250;
const NCOLORI = 6, NOMI = ['rosso', 'blu', 'verde', 'giallo', 'viola', 'arancione'];
const CADUTA = 1.6, PUGNO_R = 60, PUGNO_SPINTA = 110, STORDITO = 0.9, RICARICA = 1.1;

class Arcobaleno extends Arena {
  constructor(o) { super(o, { id: 'arcobaleno', round: 3 }); this.W = W; this.H = H; this.avvia(); }
  mescola() { this.caselle = Array.from({ length: COLS * RIGHE }, () => Math.floor(Math.random() * NCOLORI)); }
  iniziaRound() {
    this.mescola();
    this.ciclo = 0;
    this.e = Array.from({ length: this.n }, (_, i) => ({ id: i, x: 150 + (i % 4) * 230, y: OY + 150 + Math.floor(i / 4) * 300, fuori: false, stordito: 0, ricarica: 0, cade: 0, vx: 0, vy: 0 }));
    this.ordine = [];
    this.mente = {};
    this.pugni = [];
    this.nuovoCiclo();
  }
  nuovoCiclo() {
    this.ciclo++;
    this.mescola();
    this.colore = Math.floor(Math.random() * NCOLORI);
    // le caselle giuste diminuiscono turno dopo turno (da 12 fino a 3): sempre più spinte per stare sopra!
    const voluti = Math.max(3, 13 - this.ciclo);
    const giuste = () => this.caselle.map((c, k) => (c === this.colore ? k : -1)).filter((k) => k >= 0);
    let g = giuste();
    while (g.length > voluti) { const k = g[Math.floor(Math.random() * g.length)]; this.caselle[k] = (this.colore + 1 + Math.floor(Math.random() * (NCOLORI - 1))) % NCOLORI; g = giuste(); }
    while (g.length < voluti) { this.caselle[Math.floor(Math.random() * this.caselle.length)] = this.colore; g = giuste(); }
    this.fase2 = 'corri';
    this.timer = Math.max(1.3, 3.8 - this.ciclo * 0.22);
    this.timerTot = this.timer;
  }
  casellaDi(x, y) { const c = Math.floor(x / C), r = Math.floor((y - OY) / C); return c < 0 || r < 0 || c >= COLS || r >= RIGHE ? -1 : r * COLS + c; }
  passo(dt) {
    for (let p = 0; p < this.n; p++) {
      const e = this.e[p];
      if (e.fuori) { e.cade += dt; continue; }
      e.ricarica = Math.max(0, e.ricarica - dt);
      const i = this.inp[p];
      if (e.stordito > 0) { e.stordito -= dt; this.nuoviTocchi(p); }
      else {
        e.x += i.x * V * dt; e.y += i.y * V * dt;
        if (this.nuoviTocchi(p) && e.ricarica <= 0) this.pugno(p);
      }
      // la spinta del pugno si smorza
      e.x += e.vx * dt; e.y += e.vy * dt; const k = Math.exp(-6 * dt); e.vx *= k; e.vy *= k;
      e.x = Math.max(R, Math.min(W - R, e.x)); e.y = Math.max(OY + R, Math.min(OY + RIGHE * C - R, e.y));
    }
    this.timer -= dt;
    if (this.fase2 === 'corri' && this.timer <= 0) {
      this.fase2 = 'cade'; this.timer = CADUTA; this.cambiato = true;
      // chi non è su una casella del colore giusto cade
      for (let p = 0; p < this.n; p++) {
        const e = this.e[p];
        if (e.fuori) continue;
        const k = this.casellaDi(e.x, e.y);
        if (k < 0 || this.caselle[k] !== this.colore) { e.fuori = true; this.ordine.push(p); this.annuncia(p, 'cade nel vuoto! 😱', 'sei caduto nel vuoto! 😱'); }
      }
    } else if (this.fase2 === 'cade' && this.timer <= 0) {
      const vivi = this.e.filter((e) => !e.fuori).length;
      if (vivi <= (this.n === 1 ? 0 : 1)) return true;
      this.nuovoCiclo(); this.cambiato = true;
    }
    return this.tempoRound > 180;
  }
  pugno(p) {
    const e = this.e[p];
    e.ricarica = RICARICA;
    let bers = null, db = PUGNO_R;
    for (let q = 0; q < this.n; q++) { if (q === p || this.e[q].fuori) continue; const d = Math.hypot(this.e[q].x - e.x, this.e[q].y - e.y); if (d < db) { db = d; bers = q; } }
    this.pugni.push([Math.round(e.x), Math.round(e.y), bers === null ? 0 : 1]);
    if (bers === null) return;
    const b = this.e[bers], dx = b.x - e.x, dy = b.y - e.y, l = Math.hypot(dx, dy) || 1;
    b.vx = (dx / l) * PUGNO_SPINTA * 6; b.vy = (dy / l) * PUGNO_SPINTA * 6; b.stordito = STORDITO;
    this.annuncia(p, 'tira un pugno a @! 👊', 'pugno a @! 👊', false, { bersaglio: bers, testoTe: 'ti ha tirato un pugno! 💫' });
  }
  fineRound() {
    this.ordine.forEach((p, k) => { this.punti[p] += k; });
    const vivi = this.e.map((e, p) => (e.fuori ? -1 : p)).filter((p) => p >= 0);
    for (const p of vivi) this.punti[p] += this.ordine.length + 2;
    if (this.n === 1) this.punti[0] += this.ciclo - 1;
    if (vivi.length === 1 && this.n > 1) this.annuncia(vivi[0], 'è l\'ultimo in piedi! 🌈', 'sei l\'ultimo in piedi! 🌈', true);
  }
  pensa(p, liv) {
    const e = this.e[p];
    if (e.fuori || e.stordito > 0) return {};
    const m = this.mente[p] || (this.mente[p] = { ciclo: 0, bersaglio: null, dal: 0 });
    const ritardo = { facile: 0.7, medio: 0.35, difficile: 0.1 }[liv];
    if (m.ciclo !== this.ciclo) { m.ciclo = this.ciclo; m.dal = this.tempoRound; m.bersaglio = null; }
    if (this.fase2 !== 'corri' || this.tempoRound - m.dal < ritardo) return {};
    if (!m.bersaglio || this.caselle[m.bersaglio.k] !== this.colore) {
      let meglio = null, vm = Infinity;
      this.caselle.forEach((col, k) => {
        if (col !== this.colore) return;
        const x = (k % COLS) * C + C / 2, y = OY + Math.floor(k / COLS) * C + C / 2;
        let v = Math.hypot(x - e.x, y - e.y);
        if (liv !== 'facile') for (let q = 0; q < this.n; q++) if (q !== p && !this.e[q].fuori && Math.hypot(this.e[q].x - x, this.e[q].y - y) < 60) v += liv === 'difficile' ? 120 : 50;
        if (liv === 'facile') v += casuale(0, 200);
        if (v < vm) { vm = v; meglio = { k, x, y }; }
      });
      m.bersaglio = meglio;
    }
    if (!m.bersaglio) return {};
    const dx = m.bersaglio.x - e.x, dy = m.bersaglio.y - e.y, l = Math.hypot(dx, dy);
    // pugno: se qualcuno è vicino (il difficile quando manca poco, per buttarlo fuori dalla casella)
    let tocco = false;
    if (e.ricarica <= 0) for (let q = 0; q < this.n; q++) {
      if (q === p || this.e[q].fuori) continue;
      if (Math.hypot(this.e[q].x - e.x, this.e[q].y - e.y) < PUGNO_R - 8) {
        const quando = liv === 'difficile' ? this.timer < 0.8 : liv === 'medio' ? Math.random() < 0.08 : Math.random() < 0.03;
        if (quando) tocco = true;
      }
    }
    const lento = { facile: 0.8, medio: 0.95, difficile: 1 }[liv];
    return l < 12 ? { tocco } : { x: (dx / l) * lento, y: (dy / l) * lento, tocco };
  }
  statoTick() {
    const pugni = this.pugni; this.pugni = [];
    return {
      c: this.caselle, col: this.colore, f2: this.fase2, tm: Math.max(0, Math.round(this.timer * 10) / 10), tt: this.timerTot, ci: this.ciclo, pu: pugni,
      e: this.e.map((e) => ({ id: e.id, x: Math.round(e.x), y: Math.round(e.y), f: e.fuori ? Math.min(1, e.cade) : 0, st: e.stordito > 0 ? 1 : 0, ri: e.ricarica > 0 ? 1 : 0 })),
    };
  }
}

module.exports = {
  meta: {
    id: 'arcobaleno',
    nome: 'Caselle colorate',
    tipo: 'tabellone',
    tempoReale: true,
    pausaBoss: true,
    giocatori: [1, 2, 3, 4, 5, 6, 7, 8],
    descrizione: 'Esce un colore: corri su una casella di quel colore prima che le altre spariscano. E si possono dare pugni!',
    alias: ['caselle', 'colori', 'pavimento', 'arcobaleno', 'pugni', 'mario party'],
    opzioni: [{ id: 'round', nome: 'Round', valori: [3, 1, 5], etichette: ['3 round', '1 round', '5 round'], predefinito: 3 }],
    regole: [
      'Il pavimento è fatto di caselle di sei colori. A ogni turno in alto compare un colore e parte il conto alla rovescia.',
      'Prima che il tempo finisca devi stare su una casella di quel colore: tutte le altre spariscono per un momento e chi ci è sopra cade ed è fuori per il resto del round. Poi le caselle cambiano colore e si ricomincia, ogni volta con meno tempo e meno caselle giuste (da 12 fino a 3).',
      'Ti muovi con WASD o le frecce (sul telefono col joystick). Con spazio (o il pulsante "Pugno") dai un pugno a chi ti sta vicino: viene spinto via e resta stordito per quasi un secondo. Dopo un pugno bisogna aspettare un attimo per darne un altro.',
      'Punti del round: uno per ogni giocatore caduto prima di te; chi resta in piedi fino alla fine prende 2 punti in più. Dopo 3 round (o 1, o 5) vince chi ha più punti. Da soli conta quanti turni resisti.',
      'Il gioco è in tempo reale: si ferma per tutti quando qualcuno apre le dispense.',
      'Il computer facile parte tardi e non sceglie bene la casella; il medio va alla casella giusta più vicina; il difficile parte subito, sceglie una casella libera e tira pugni proprio quando manca poco.',
    ],
  },
  crea: (o) => new Arcobaleno(o),
  bot: () => ({}),
  _test: { Arcobaleno },
};
