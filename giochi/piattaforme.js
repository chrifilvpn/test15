// SALTA E CORRI: corsa a piattaforme vista di lato. Il percorso alterna tratti in orizzontale (buche, gradini) e tratti
// in verticale (pareti da scalare saltando di piattaforma in piattaforma, scalinate in discesa). Ci sono potenziamenti:
// 🍄 doppio salto e ⚡ turbo. Chi cade in una buca riparte dall'ultimo punto sicuro. Vince chi arriva primo alla bandiera.
const { Arena, casuale } = require('./arena');
const T = 40, RIGHE = 24, W = 1000, H = 620;
const LARG = 24, ALT = 34, V = 250, GRAV = 1900, SALTO = 760, POT_T = 8;

function costruisci() {
  const segmenti = ['piano', 'salita', 'piano', 'discesa', 'piano', 'salita', 'piano', 'discesa', 'piano'];
  const colonne = []; // per colonna: righe solide (Set)
  const tappe = []; // punti che il computer segue, in ordine
  const controlli = []; // punti di ripartenza
  const pot = [];
  let g = 19, c = 0;
  const pieno = (col, da) => { colonne[col] = colonne[col] || new Set(); for (let r = da; r < RIGHE; r++) colonne[col].add(r); };
  const blocco = (col, r) => { colonne[col] = colonne[col] || new Set(); colonne[col].add(r); };
  const vuoto = (col) => { colonne[col] = colonne[col] || new Set(); };
  for (const s of segmenti) {
    controlli.push({ x: c * T + T * 1.5, y: g * T - ALT });
    if (s === 'piano') {
      const lung = Math.floor(casuale(22, 30));
      let k = 0, dopoBuca = 0;
      while (k < lung) {
        const qui = c + k;
        if (k > 3 && k < lung - 4 && dopoBuca === 0 && Math.random() < 0.16) {
          const buca = Math.random() < 0.5 ? 2 : 3;
          for (let j = 0; j < buca; j++) vuoto(qui + j);
          k += buca; dopoBuca = 3; continue;
        }
        pieno(qui, g);
        if (dopoBuca > 0) dopoBuca--;
        else if (k > 3 && k < lung - 3 && Math.random() < 0.12) { const h = Math.random() < 0.5 ? 1 : 2; for (let r = 1; r <= h; r++) blocco(qui, g - r); tappe.push({ x: qui * T + T / 2, y: (g - h) * T - ALT / 2 }); }
        else tappe.push({ x: qui * T + T / 2, y: g * T - ALT / 2 });
        if (k % 13 === 7) pot.push({ id: pot.length + 1, x: qui * T + T / 2, y: (g - 2.5) * T, t: Math.random() < 0.5 ? 'molla' : 'turbo' });
        k++;
      }
      c += lung;
    } else if (s === 'salita') {
      // un pozzo largo 9 colonne con 4 piattaforme sfalsate, poi la parete: in cima si continua più in alto
      for (let j = 0; j < 9; j++) pieno(c + j, g);
      tappe.push({ x: (c + 4) * T, y: g * T - ALT / 2 });
      for (let k = 1; k <= 4; k++) {
        const r = g - k * 3, x0 = c + (k % 2 ? 1 : 6); // l'ultima piattaforma tocca la parete: si passa in cima camminando
        for (let j = 0; j < 3; j++) blocco(x0 + j, r);
        tappe.push({ x: (x0 + 1) * T + T / 2, y: r * T - ALT / 2 });
      }
      g -= 12;
      c += 9;
    } else {
      // scalinata in discesa: 4 gradini di 3 righe
      for (let k = 0; k < 4; k++) { for (let j = 0; j < 3; j++) { pieno(c + j, g + k * 3); } tappe.push({ x: (c + 1) * T + T / 2, y: (g + k * 3) * T - ALT / 2 }); c += 3; }
      g += 12;
    }
  }
  // ultimo tratto e traguardo
  for (let j = 0; j < 8; j++) { pieno(c + j, g); tappe.push({ x: (c + j) * T + T / 2, y: g * T - ALT / 2 }); }
  const traguardo = { x: (c + 5) * T, y: g * T };
  c += 8;
  const cols = c;
  const griglia = Array.from({ length: RIGHE }, (_, r) => Array.from({ length: cols }, (_, k) => (colonne[k] && colonne[k].has(r) ? '1' : '0')).join(''));
  return { griglia, cols, tappe, controlli, pot, traguardo };
}

class Piattaforme extends Arena {
  constructor(o) { super(o, { id: 'piattaforme', round: 2 }); this.W = W; this.H = H; this.avvia(); }
  solido(x, y) { const c = Math.floor(x / T), r = Math.floor(y / T); if (c < 0) return true; if (r < 0 || r >= RIGHE || c >= this.liv.cols) return false; return this.liv.griglia[r][c] === '1'; }
  iniziaRound() {
    this.liv = costruisci();
    this.presi = new Set();
    const c0 = this.liv.controlli[0];
    this.e = Array.from({ length: this.n }, (_, i) => ({ id: i, x: c0.x + i * 6, y: c0.y, vx: 0, vy: 0, aTerra: false, salti: 0, pot: null, potT: 0, arrivo: null, cade: 0, ctrl: 0, salto: 0, dir: 1 }));
    this.arrivi = []; this.mente = {};
  }
  muovi(e, dt) {
    // orizzontale
    e.x += e.vx * dt;
    const bordiY = [e.y - ALT / 2 + 2, e.y, e.y + ALT / 2 - 2];
    if (e.vx > 0 && bordiY.some((y) => this.solido(e.x + LARG / 2, y))) e.x = Math.floor((e.x + LARG / 2) / T) * T - LARG / 2 - 0.01;
    if (e.vx < 0 && bordiY.some((y) => this.solido(e.x - LARG / 2, y))) e.x = Math.floor((e.x - LARG / 2) / T + 1) * T + LARG / 2 + 0.01;
    // verticale
    e.vy += GRAV * dt; e.y += e.vy * dt;
    const bordiX = [e.x - LARG / 2 + 2, e.x + LARG / 2 - 2];
    e.aTerra = false;
    if (e.vy > 0 && bordiX.some((x) => this.solido(x, e.y + ALT / 2))) { e.y = Math.floor((e.y + ALT / 2) / T) * T - ALT / 2; e.vy = 0; e.aTerra = true; }
    if (e.vy < 0 && bordiX.some((x) => this.solido(x, e.y - ALT / 2))) { e.y = Math.floor((e.y - ALT / 2) / T + 1) * T + ALT / 2; e.vy = 0; }
  }
  passo(dt) {
    for (let p = 0; p < this.n; p++) {
      const e = this.e[p], i = this.inp[p];
      if (e.arrivo !== null) continue;
      if (e.cade > 0) { e.cade -= dt; this.nuoviTocchi(p); if (e.cade <= 0) { const c = this.liv.controlli[e.ctrl]; e.x = c.x; e.y = c.y; e.vx = 0; e.vy = 0; e.salto++; } continue; }
      if (e.potT > 0) { e.potT -= dt; if (e.potT <= 0) e.pot = null; }
      const vel = V * (e.pot === 'turbo' ? 1.45 : 1);
      e.vx = i.x * vel; if (i.x) e.dir = Math.sign(i.x);
      if (e.aTerra) e.salti = e.pot === 'molla' ? 2 : 1;
      const tocchi = this.nuoviTocchi(p) + (i.y < -0.5 && !e.suSu ? 1 : 0);
      e.suSu = i.y < -0.5;
      if (tocchi && e.salti > 0) { e.vy = -SALTO; e.salti--; e.aTerra = false; }
      this.muovi(e, dt);
      // punti di ripartenza raggiunti
      while (e.ctrl + 1 < this.liv.controlli.length && e.x > this.liv.controlli[e.ctrl + 1].x - T) e.ctrl++;
      // potenziamenti
      for (const q of this.liv.pot) if (!this.presi.has(q.id) && Math.abs(q.x - e.x) < 26 && Math.abs(q.y - e.y) < 30) { this.presi.add(q.id); e.pot = q.t; e.potT = POT_T; this.cambiato = true; this.annuncia(p, q.t === 'molla' ? 'prende il doppio salto 🍄' : 'prende il turbo ⚡', q.t === 'molla' ? 'doppio salto! 🍄' : 'turbo! ⚡'); }
      // buca
      if (e.y > RIGHE * T + 60) { e.cade = 1; this.cambiato = true; }
      // traguardo
      if (e.x >= this.liv.traguardo.x) {
        e.arrivo = this.tempoRound; this.arrivi.push(p); this.cambiato = true;
        const pt = Math.max(1, this.n + 2 - this.arrivi.length * 2);
        this.punti[p] += pt;
        this.annuncia(p, `arriva ${this.arrivi.length}° alla bandiera! +${pt} 🏁`, `arrivi ${this.arrivi.length}°! +${pt} 🏁`, this.arrivi.length === 1);
      }
    }
    return this.e.every((e) => e.arrivo !== null) || (this.arrivi.length && this.tempoRound - this.e[this.arrivi[0]].arrivo > 25) || this.tempoRound > 180;
  }
  fineRound() {}
  // il computer segue le "tappe" del percorso: corre verso la prossima e salta quando serve
  pensa(p, liv) {
    const e = this.e[p];
    if (e.arrivo !== null || e.cade > 0) return {};
    const m = this.mente[p] || (this.mente[p] = { k: 0, fino: 0, pensa: 0, salto: -1, meglio: 0, fermo: 0 });
    const tappe = this.liv.tappe;
    // dopo una caduta si riparte dalla prima tappa dopo il punto di ripartenza
    if (m.salto !== e.salto) { m.salto = e.salto; const cx = this.liv.controlli[e.ctrl].x; m.k = Math.max(0, tappe.findIndex((q) => q.x >= cx - T)); }
    // si passa alla tappa dopo quando si è arrivati sopra quella attuale, oppure quando è ormai alle spalle e non più in alto
    while (m.k < tappe.length - 1 && ((Math.abs(tappe[m.k].x - e.x) < 18 && Math.abs(tappe[m.k].y - e.y) < 30 && e.aTerra) || (tappe[m.k].x < e.x - 12 && tappe[m.k].y >= e.y - 10 && e.aTerra))) m.k++;
    const t = tappe[Math.min(m.k, tappe.length - 1)];
    const dx = t.x - e.x, dy = t.y - e.y;
    const lento = { facile: 0.8, medio: 0.92, difficile: 1 }[liv];
    let x = Math.abs(dx) > 6 ? Math.sign(dx) * lento : 0;
    // davanti c'è un muro o una buca? oppure la tappa è più in alto? allora salto
    const dir = Math.sign(dx) || e.dir;
    const muro = this.solido(e.x + dir * (LARG / 2 + 8), e.y) || this.solido(e.x + dir * (LARG / 2 + 8), e.y - T * 0.6);
    const buca = !this.solido(e.x + dir * (LARG / 2 + 24), e.y + ALT / 2 + 8) && !this.solido(e.x + dir * (LARG / 2 + 24), e.y + ALT / 2 + T + 8);
    // una piattaforma sospesa più in alto (sotto è vuoto): per i gradini appoggiati a terra basta saltare davanti al muro
    const piuSu = dy < -T * 0.6 && !this.solido(t.x, t.y + ALT / 2 + T + 4);
    let tocco = false;
    // una piattaforma più in alto: da sotto si batte la testa, quindi prima ci si allontana di lato, poi si salta verso di lei
    // in aria verso una piattaforma: finché i piedi sono sotto il suo bordo si sale dritti, poi ci si sposta sopra
    if (!e.aTerra && dy < -4 && Math.abs(dx) < T * 3.2 && !this.solido(t.x, t.y + ALT / 2 + T + 4)) {
      return { x: e.y + ALT / 2 > t.y + ALT / 2 - 4 ? 0 : Math.sign(dx) };
    }
    if (piuSu && e.aTerra) {
      if (Math.abs(dx) < T * 2.2) x = -(Math.sign(dx) || 1);
      else {
        x = Math.sign(dx);
        // si salta quando si è abbastanza vicini, oppure sul bordo della piattaforma su cui si sta
        const bordo = !this.solido(e.x + x * (LARG / 2 + 24), e.y + ALT / 2 + 8);
        if ((Math.abs(dx) <= T * 3.2 || bordo) && this.tempoRound >= m.pensa) { m.pensa = this.tempoRound + { facile: 0.12, medio: 0.06, difficile: 0.03 }[liv]; if (Math.random() < { facile: 0.7, medio: 0.92, difficile: 1 }[liv]) tocco = true; }
      }
      return { x, tocco };
    }
    if (this.tempoRound >= m.pensa) {
      m.pensa = this.tempoRound + { facile: 0.12, medio: 0.06, difficile: 0.03 }[liv];
      if (e.aTerra && (muro || buca) && Math.random() < { facile: 0.7, medio: 0.92, difficile: 1 }[liv]) tocco = true;
      // il doppio salto quando si sta scendendo verso una buca
      if (!e.aTerra && e.salti > 0 && e.vy > 100 && buca && liv !== 'facile') tocco = true;
    }
    return { x, tocco };
  }
  statoTick() {
    return {
      e: this.e.map((e) => ({ id: e.id, x: Math.round(e.x), y: Math.round(e.y), d: e.dir, a: e.arrivo !== null ? 1 : 0, c: e.cade > 0 ? 1 : 0, p: e.pot, t: e.aTerra ? 1 : 0, salto: e.salto })),
      presi: [...this.presi], arr: this.arrivi,
    };
  }
  vistaExtra() { return { griglia: this.liv.griglia, cols: this.liv.cols, T, pot: this.liv.pot, traguardo: this.liv.traguardo, righe: RIGHE }; }
}

module.exports = {
  meta: {
    id: 'piattaforme',
    nome: 'Salta e corri',
    tipo: 'tabellone',
    tempoReale: true,
    pausaBoss: true,
    giocatori: [1, 2, 3, 4, 5, 6, 7, 8],
    descrizione: 'Corsa a piattaforme: salta le buche, scala le pareti, prendi i potenziamenti e arriva primo alla bandiera.',
    alias: ['platform', 'piattaforme', 'salta', 'corri', 'mario', 'runner', 'corsa'],
    opzioni: [{ id: 'round', nome: 'Round', valori: [2, 1, 3], etichette: ['2 corse', '1 corsa', '3 corse'], predefinito: 2 }],
    regole: [
      'Una corsa a piattaforme vista di lato: si parte tutti insieme e vince chi arriva prima alla bandiera. Gli altri li vedi un po\' trasparenti: non ci si scontra.',
      'Ti muovi con A e D (o le frecce) e salti con spazio, W o freccia su (sul telefono: joystick e pulsante "Salta").',
      'Il percorso cambia a ogni corsa e alterna tratti in orizzontale, con buche e gradini, e tratti in verticale: pareti da scalare saltando da una piattaforma all\'altra e scalinate in discesa.',
      'Potenziamenti (durano 8 secondi): 🍄 doppio salto (puoi saltare di nuovo in aria) e ⚡ turbo (corri più veloce).',
      'Se cadi in una buca riparti dall\'ultimo punto sicuro che hai passato.',
      'Punti: chi arriva primo prende i punti più alti, poi via via meno. Dopo che è arrivato il primo, gli altri hanno ancora 25 secondi. Dopo 2 corse (o 1, o 3) vince chi ha più punti.',
      'Il gioco è in tempo reale: si ferma per tutti quando qualcuno apre le dispense.',
      'Il computer facile corre più piano e a volte salta tardi; il medio corre bene; il difficile salta sempre al momento giusto e usa il doppio salto per salvarsi.',
    ],
  },
  crea: (o) => new Piattaforme(o),
  bot: () => ({}),
  _test: { costruisci, Piattaforme },
};
