// PALLONCINI IN FUGA: ognuno ha un palloncino che sale da solo (il cielo scorre verso il basso). Il vento lo spinge
// piano verso sinistra; con un solo tasto gli dai una spinta verso destra. Bisogna evitare gli spuntoni che arrivano
// dall'alto e i bordi (anche loro pungono). Chi resta in aria più a lungo vince il round.
const { Arena, casuale } = require('./arena');
const W = 1000, H = 620, Y_PALLONE = 480, R_PALLONE = 20;
const VENTO = 240, SPINTA = 210, ATTRITO = 1.4, DURATA = 90;

class Palloncini extends Arena {
  constructor(o) { super(o, { id: 'palloncini', round: 3 }); this.W = W; this.H = H; this.avvia(); }
  iniziaRound() {
    this.spuntoni = [];
    this.nSp = 0;
    this.velocita = 130;
    this.prossimo = 0.4;
    this.popTempo = new Array(this.n).fill(null);
    this.ordine = [];
    this.pal = Array.from({ length: this.n }, (_, i) => ({ id: i, x: W / 2 + (i - (this.n - 1) / 2) * 36, vx: 0, vivo: true }));
    this.pensiero = new Array(this.n).fill(null);
  }
  passo(dt) {
    this.velocita = 130 + this.tempoRound * 5; // il cielo corre sempre di più
    // nuovi spuntoni
    this.prossimo -= dt;
    if (this.prossimo <= 0) {
      const r = casuale(14, 26);
      this.spuntoni.push({ id: ++this.nSp, x: casuale(50, W - 50), y: -r, r, vx: Math.random() < 0.3 ? casuale(-60, 60) : 0, giro: casuale(-2, 2) });
      this.prossimo = Math.max(0.22, 0.85 - this.tempoRound * 0.008) * casuale(0.6, 1.3);
    }
    for (const s of this.spuntoni) { s.y += this.velocita * dt; s.x += s.vx * dt; if (s.x < s.r || s.x > W - s.r) s.vx = -s.vx; }
    this.spuntoni = this.spuntoni.filter((s) => s.y < H + 40);
    // palloncini
    for (let p = 0; p < this.n; p++) {
      const b = this.pal[p];
      if (!b.vivo) continue;
      const k = this.nuoviTocchi(p);
      if (k) b.vx += SPINTA * Math.min(k, 3);
      b.vx -= VENTO * dt;
      b.vx *= Math.exp(-ATTRITO * dt);
      b.x += b.vx * dt;
      const tocca = b.x < 22 + R_PALLONE - 6 || b.x > W - 22 - R_PALLONE + 6 || this.spuntoni.some((s) => Math.hypot(s.x - b.x, s.y - Y_PALLONE) < s.r + R_PALLONE - 3);
      if (tocca) {
        b.vivo = false;
        this.popTempo[p] = this.tempoRound;
        this.ordine.push(p);
        this.cambiato = true;
        this.annuncia(p, 'è scoppiato! 💥', 'sei scoppiato! 💥');
      }
    }
    const vivi = this.pal.filter((b) => b.vivo).length;
    return vivi === 0 || (this.n > 1 && vivi === 1 && this.tempoRound > 1 && this.ordine.length === this.n - 1 && this.ultimoSolo()) || this.tempoRound >= DURATA;
  }
  // in più giocatori il round finisce quando ne resta uno solo (ma solo dopo che è rimasto in aria altri 3 secondi, per il gusto)
  ultimoSolo() { this._solo = this._solo || this.tempoRound; return this.tempoRound - this._solo > 3; }
  fineRound() {
    this._solo = null;
    for (let p = 0; p < this.n; p++) {
      const t = this.popTempo[p] ?? this.tempoRound;
      this.punti[p] += Math.round(t);
    }
    const vivi = this.pal.map((b, p) => (b.vivo ? p : -1)).filter((p) => p >= 0);
    if (vivi.length === 1 && this.n > 1) { this.punti[vivi[0]] += 10; this.annuncia(vivi[0], 'è l\'ultimo in aria: +10 🎈', 'sei l\'ultimo in aria: +10 🎈', true); }
  }
  // il computer guarda gli spuntoni che arriveranno all'altezza del palloncino e sceglie dove stare
  pensa(p, liv) {
    const b = this.pal[p];
    if (!b.vivo) return {};
    const avanti = { facile: 0.7, medio: 1.2, difficile: 1.8 }[liv];
    let pens = this.pensiero[p];
    const ora = this.tempoRound;
    if (!pens || ora >= pens.fino) {
      // costo di ogni posizione: spuntoni che passeranno di lì presto, e bordi
      let meglio = b.x, costo = Infinity;
      for (let x = 70; x <= W - 70; x += 20) {
        let c = Math.abs(x - b.x) * 0.004 + (x < 150 || x > W - 150 ? 0.6 : 0);
        for (const s of this.spuntoni) {
          const t = (Y_PALLONE - s.y) / this.velocita;
          if (t < -0.3 || t > avanti) continue;
          const sx = s.x + s.vx * Math.max(0, t);
          const d = Math.abs(sx - x) - s.r - R_PALLONE;
          if (d < 45) c += (45 - d) / 20 + (t < 0.5 ? 2 : 0);
        }
        if (c < costo) { costo = c; meglio = x; }
      }
      pens = this.pensiero[p] = { obiettivo: meglio + casuale(-1, 1) * { facile: 50, medio: 18, difficile: 4 }[liv], fino: ora + { facile: 0.45, medio: 0.25, difficile: 0.1 }[liv] };
    }
    // si spinge quando si scivolerebbe a sinistra dell'obiettivo
    // velocità voluta: verso l'obiettivo, senza esagerare; se si va troppo a sinistra si spinge
    const voluta = Math.max(-160, Math.min(160, (pens.obiettivo - b.x) * 2.2));
    const tocco = b.vx < voluta - 60 && Math.random() < { facile: 0.25, medio: 0.5, difficile: 0.85 }[liv];
    return { tocco };
  }
  statoTick() {
    return { v: Math.round(this.velocita), b: this.pal.map((b) => ({ id: b.id, x: Math.round(b.x), y: Y_PALLONE, vivo: b.vivo })), sp: this.spuntoni.map((s) => ({ id: s.id, x: Math.round(s.x), y: Math.round(s.y), r: Math.round(s.r), g: s.giro })) };
  }
}

module.exports = {
  meta: {
    id: 'palloncini',
    nome: 'Palloncini in fuga',
    tipo: 'tabellone',
    tempoReale: true,
    pausaBoss: true,
    giocatori: [1, 2, 3, 4, 5, 6, 7, 8],
    descrizione: 'Un tasto solo: spingi il tuo palloncino contro il vento ed evita gli spuntoni. Chi resta in aria più a lungo vince.',
    alias: ['palloncino', 'balloon', 'un tasto', 'spuntoni'],
    opzioni: [{ id: 'round', nome: 'Round', valori: [3, 1, 5], etichette: ['3 round', '1 round', '5 round'], predefinito: 3 }],
    regole: [
      'Ognuno ha un palloncino che sale da solo: il cielo scorre verso il basso, sempre più veloce. I palloncini non si toccano tra loro.',
      'Il vento spinge sempre il palloncino verso sinistra. Con un solo tasto (spazio, Invio, un clic o il pulsante sullo schermo) gli dai una spinta verso destra: tocchi leggeri per stare fermo, tanti tocchi per andare a destra.',
      'Evita gli spuntoni che arrivano dall\'alto (alcuni si spostano di lato) e i bordi, che pungono anche loro: al primo tocco il palloncino scoppia.',
      'Punti: un punto per ogni secondo passato in aria; l\'ultimo che resta in aria prende 10 punti in più (il round finisce 3 secondi dopo che è rimasto da solo, o dopo 90 secondi). Dopo 3 round (o 1, o 5) vince chi ha più punti.',
      'Il gioco è in tempo reale: si ferma per tutti quando qualcuno apre le dispense.',
      'Il computer facile guarda poco avanti e reagisce tardi, il medio abbastanza, il difficile vede gli spuntoni da lontano e si piazza al sicuro.',
    ],
  },
  crea: (o) => new Palloncini(o),
  bot: () => ({}),
  _test: { Palloncini, Y_PALLONE },
};
