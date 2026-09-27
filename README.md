# Informatica Facile

Sito per giocare online con gli amici o contro il computer: **briscola, scopa, scopone scientifico, rubamazzo, scala 40** (carte francesi), **tris**, **forza 4**, **battaglia navale**, **dama**, **scacchi**, **impiccato**, **sasso carta forbice**, **indovina il numero**, **blackjack**, **baccarat**, **higher or lower**, **texas hold'em**, **poker a 5 carte**, **UNO**, **campo minato**, **chi è l'impostore**, **coccodrillo**, **Block Blast**, **la Peppa Tencia**, **Fast West**, **Wordle**, **Guess the angle**, **Sudoku**, **Snake**, **Tetris Battle**, **Air Hockey**, **Pompa il pallone**, **Interruttori**, **Caselle e bombe**, **Scava il tesoro**, **Numeri coperti**, **Dubito**, **Nascondino**, **La mappa nascosta**, **Tasti in ordine**, **Oggetti sulla mensola**, **The Mind**, **Flip 7**, **Cirulla**, **Solitario Klondike**, **Allegro chirurgo**, **Human Benchmark 1v1**, **Risiko**, **Disegna e indovina**, **Putt Party 2D**, **Palloncini in fuga**, **Il gatto e i topi**, **Il ladro di colori**, **Bumper Balls**, **Trova le differenze**, **Fuga dai fantasmi**, **Monete in salita**, **Caselle colorate**, **Pioggia di monete**, **Paintball**, **Salta e corri** e **Massi dalla montagna** (e il **Ghost Tris** dentro al tris).

Made by chry_pala. Altri giochi arriveranno uno alla volta.

## Provarlo sul tuo computer

Serve [Node.js](https://nodejs.org) versione 18 o più recente.

```
npm install
npm start
```

Poi apri http://localhost:3000. Per provare con più giocatori apri il sito in due finestre diverse (una normale e una in incognito).

## Aggiornare il sito su Render

Il sito che hai già su Render si aggiorna da solo quando cambi i file su GitHub.

1. Apri il repository su GitHub (`chry137/briscola-online`).
2. Cancella i vecchi file: entra in ogni cartella e file e usa il cestino, oppure crea un repository nuovo e collegalo a Render come la prima volta.
3. Premi **Add file → Upload files** e carica **il contenuto** della cartella `informatica-facile`. Non caricare `node_modules`.
   **Attenzione: GitHub accetta al massimo 100 file per volta** trascinandoli nella pagina, e i file in più li scarta senza dirlo. Il progetto ora ha più di 100 file, quindi caricalo in due volte, con due commit:
   - prima volta: la cartella `giochi` e tutti i file sciolti (`server.js`, `package.json`, `package-lock.json`, `README.md`, `verifica.js`, `elenco-file.txt`, `esecuzione.js`, `censura.js`) → **Commit changes**;
   - seconda volta: le cartelle `public` e `test` → **Commit changes**.
   In alternativa usa GitHub Desktop o `git push`, che non hanno questo limite.
4. Dopo l'ultimo commit Render Render ridistribuisce il sito da solo in un paio di minuti. Se non parte, su Render premi **Manual Deploy → Deploy latest commit**.

Le impostazioni su Render restano uguali: Build `npm install`, Start `npm start`.

`npm start` controlla prima che ci siano tutti i file del progetto (`verifica.js`, con l'elenco in `elenco-file.txt`). Se ne manca qualcuno, nel log di Render compare l'elenco dei file mancanti: basta caricarli e rifare il deploy. Se aggiungi o togli file, aggiorna l'elenco con `node verifica.js --aggiorna` (`npm test` ti avvisa se te ne dimentichi).

Ricorda che col piano gratuito il sito si addormenta dopo 15 minuti senza visite e al primo accesso ci mette circa un minuto a svegliarsi.

## Come si gioca

- **Contro il computer**: scegli il gioco, quanti giocatori e il livello (facile, medio, difficile), poi "Gioca adesso".
- **Con gli amici**: "Apri un tavolo", manda il link o il codice di 4 lettere. Chi apre il tavolo può riempire i posti vuoti col computer, cambiare gioco e avviare la partita.
- **Chat**: il messaggio appare come nuvoletta sopra il giocatore che l'ha scritto.
- **Esci**: a partita in corso il tuo posto passa al computer, così gli altri finiscono la partita. Un altro amico può entrare col codice e prendere quel posto.
- Se qualcuno perde la connessione, dopo 25 secondi il computer gioca per lui finché non torna.
- **Il nome**: all'apertura del sito compare subito la finestra di benvenuto che chiede il nome; poi si va ai giochi. Il nome si sceglie una volta sola e non si cambia (resta salvato nel browser). Chi arriva con il link di un tavolo, appena sceglie il nome si siede.
- **Ammiragliato (amministratore)**: chi scrive in chat (del tavolo o globale) il comando segreto apre a sinistra il pannello con chi è online (nome, dove si trova, da quanto) e può **esiliare** qualcuno: tutti quelli sul sito vedono la scena dell'esilio (il nome parte su una barca al tramonto, arriva la tempesta, la barca affonda e il nome scende in fondo al mare), poi l'esiliato esce dal sito e non può rientrare per 10 minuti, 1 ora, 1 giorno o 1 settimana (per browser; a scelta anche per indirizzo, ma a scuola vale per tutta la classe). Dal pannello si può anche concedere la grazia. Il comando non è scritto nel codice: in `admin.js` c'è solo la sua impronta SHA-256; per cambiarlo si mette su Render la variabile d'ambiente `ADMIN_COMANDO` con il comando nuovo (deve iniziare con `!`). Il comando sbagliato è un normale messaggio di chat.
- **🚪 Torna al tavolo**: in alto durante la partita. Chi lo preme esce dalla partita (al suo posto gioca il computer, o il posto resta vuoto nei giochi solo tra persone) e aspetta nella sala; gli altri vedono "X è uscito dalla partita". A partita finita riprende il suo posto. Se era l'unica persona in partita, la partita si chiude.
- **Termina**: in alto durante la partita. Propone di chiudere la partita: votano le persone al tavolo (i computer no) e con la maggioranza dei sì si torna in sala; la votazione scade dopo 30 secondi.
- **!restart** in chat: propone di ricominciare la partita da capo (stesso gioco, stesse opzioni, stessi giocatori), sempre a maggioranza, per quando qualcosa è andato storto.
- A fine partita **🏠 Torna alla lobby** c'è per tutti (non solo per chi ha aperto il tavolo), anche nella barra che resta dopo aver chiuso i risultati.
- **🌍 Chat globale**: una chat per tutto il sito, che si apre dalla home (in basso a sinistra) e da ogni tavolo (in alto). Tiene gli ultimi 60 messaggi; ha la censura e un limite anti-spam.
- Nei giochi da 40 carte (scopa, scopone, rubamazzo, Cirulla) il pulsante "Ordina per seme / per valore" cambia l'ordine della mano, e il browser se lo ricorda.
- La home mette i giochi in file da 5-6 sugli schermi larghi e 2 per riga sul telefono.

## Modalità studio (Boss Key)

Funziona in tutto il sito, anche dentro le partite e nelle pagine che verranno aggiunte.

- **Esc** apre subito una pagina di dispense scolastiche (Sistemi e Reti, TPSIT, Informatica) con codice, terminali, schemi di rete e notifiche.
- Per tornare esattamente dove eri: `/` oppure `\`, oppure scrivi **gioca** (maiuscolo o minuscolo).
- La partita non si chiude: resti collegato al tavolo e trovi tutto com'era (turno, punteggio, carte, pezzi, timer).
- La scheda del browser mostra "Dispense di Informatica" con un'icona da documento, e l'indirizzo diventa `/dispense`. Non si aggiungono voci alla cronologia. Se ricarichi la pagina mentre "studi", riparti dalle dispense e con `/` torni alla partita.
- Se premi Esc mentre succede qualcosa (una mossa, un'animazione), per un attimo compare un finto "Caricamento…" prima delle dispense.
- **Finestra grigia**: se esci dalla finestra (cambio scheda, Alt+Tab) per più di 25 secondi, al ritorno trovi le dispense. Si attiva, si spegne e si cambiano i secondi nella home, sotto "Modalità studio".
- **!prof**: scritto in chat apre le dispense a tutti i giocatori del tavolo. C'è anche il pulsante 🚨 tra i messaggi rapidi.

## Comandi della chat

Si scrivono nella chat del tavolo e non compaiono come messaggi normali. L'elenco è anche in fondo alle regole di ogni gioco.

- **!prof**: apre la pagina delle dispense a tutti i giocatori del tavolo (Boss Key per tutti).
- **!comandi**: mostra in chat l'elenco dei comandi.
- **!ricarica**: ti ridà 1000 fiche, ma **solo quando le hai finite** (0 fiche). Ogni giocatore parte con 1000 fiche a tavolo; servirà nei giochi con le fiche (blackjack, poker, baccarat, higher or lower).
- Quando resti senza fiche compare in chat il consiglio di scrivere **!ricarica** (una volta) e sopra i messaggi rapidi c'è il pulsante per farlo subito.
- C'è anche un comando segreto che non compare in nessun elenco: si scopre giocando. Funziona sia al tavolo sia nella chat globale (anche dalla home): dalla chat globale lo vedono tutti quelli sul sito.
- **!prof nella chat globale** (anche dalla home) manda sulle dispense tutto il sito, al massimo una volta ogni 30 secondi; al tavolo vale per chi è al tavolo.
- In chat (anche quella globale) e nei nomi "vigano", "viganò", "viagano" e "viaganò" (con maiuscole, accenti, spazi o punti in mezzo, 0 al posto della o) diventano asterischi.
- Mentre le dispense sono aperte i suoni del sito sono spenti.
- Nei giochi a turni la partita va avanti: se tocca a te e sei sulle dispense, dopo 25 secondi il computer fa una mossa al tuo posto. Nei giochi di collaborazione la partita si mette in pausa per tutti finché non torni.

## Le carte

Carte francesi: cuori, quadri, fiori, picche.

- **Scopa, scopone, briscola, rubamazzo** usano 40 carte: dall'asso al 7 più fante, donna e re (che valgono 8, 9 e 10). È il modo normale di usare il mazzo francese per questi giochi. I quadri fanno da denari: il settebello è il 7 di quadri.
- **Scala 40** usa due mazzi completi da 52 carte più 4 jolly.

## Regole implementate

**Scopa e scopone scientifico**: presa della carta uguale obbligatoria prima delle somme; presa obbligatoria se possibile; scelta tra più prese; scopa che non vale all'ultima giocata della smazzata; rimescolata se escono 3 o 4 re in tavola; carte rimaste a chi ha preso per ultimo; punti per carte, quadri, settebello, primiera (serve almeno una carta per seme) e scope; pareggio = punto non assegnato; si vince a 11, 16 o 21 con un solo vincitore. Opzione asso piglia tutto. In 4 si gioca a coppie. Nello scopone 10 carte a testa e tavola vuota.

**Briscola**: da 2 a 4 (in 3 si toglie il 2 di cuori, in 4 a coppie), 120 punti totali.

**Rubamazzo**: prendi la carta uguale in tavola o rubi il mazzetto dell'avversario se la cima ha lo stesso valore; vince chi ha più carte.

**Scala 40**: 13 carte; pesca dal mazzo o dagli scarti; apertura con almeno 40 punti; la carta presa dagli scarti va usata subito (si può rimettere se non hai ancora calato nulla); un solo jolly per combinazione; tris e poker con semi diversi; scale con l'asso sotto il 2 o sopra il re; nel turno in cui apri attacchi solo ai tuoi giochi; scambio del jolly con la carta vera dopo aver aperto; si chiude con l'ultimo scarto; penalità pari alle carte in mano (jolly 25, asso 11, figure 10) e 100 a chi non ha aperto; eliminazione a 101 o 201.

**Tris**: classico 3×3, 4×4 con quattro in fila, oppure Ultimate Tris (9 tris dentro uno grande: la casella che scegli decide il riquadro dove gioca l'avversario; se tutti i riquadri si chiudono senza una fila vince chi ne ha di più). Computer facile, medio e difficile; il difficile è quasi imbattibile ma ogni tanto sbaglia.

**Forza 4**: griglia classica 7×6, chi inizia ha le pedine rosse; vince chi mette quattro in fila; griglia piena = pareggio. Il computer difficile calcola da 9 a oltre 15 mosse in avanti.

**Battaglia navale**: da 2 a 4 giocatori, tutti contro tutti, griglia 10×10. Flotta italiana (4-3-3-2-2-2-1-1-1-1) o classica (5-4-3-3-2), da scegliere prima di iniziare. Le navi non si toccano, nemmeno in diagonale. Tutti schierano insieme (a mano con anteprima e tasto R per ruotare, oppure "Casuale"); poi a turno un colpo nella griglia di un avversario, e il turno passa anche se colpisci. Attorno alle navi affondate l'acqua viene segnata da sola. Vince l'ultimo con navi a galla. Il computer difficile spara dove una nave ha più probabilità di trovarsi.

**Dama** (all'italiana): 8×8, 12 pedine, muove prima il Bianco. La pedina muove e cattura solo in avanti e non cattura la dama; la dama muove di una casella in ogni direzione. Presa obbligatoria con le priorità italiane: più pezzi, poi con la dama, poi più dame, poi quella che incontra prima una dama. La pedina che arriva in fondo diventa dama e la mossa finisce. Patta dopo 40 mosse a testa senza catture né mosse di pedina. Si può abbandonare.

**Scacchi**: regole complete, con arrocco, en passant, promozione a scelta, scacco matto, stallo, patta per ripetizione tripla, 50 mosse o materiale insufficiente, patta d'accordo e abbandono. Orologio facoltativo (3+2, 5, 10, 15+10), che parte dopo la prima mossa del Bianco; se ti cade la bandierina ma l'avversario non può dare matto, è patta. Il generatore di mosse è verificato con i conteggi "perft" di riferimento.

**Impiccato** (solo tra persone, da 2 a 8): a ogni giro uno sceglie la parola (3-20 lettere, accenti e maiuscole non contano) e gli altri indovinano a turno. Lettera giusta: +1 punto per ogni volta che compare e continui tu; lettera sbagliata: un pezzo dell'omino e il turno passa. Parola intera giusta: bonus di 5 punti; sbagliata: un errore. Chi completa la parola prende 3 punti; se l'omino viene impiccato (6, 8 o 10 errori), 5 punti vanno a chi l'ha scelta. Una o due parole a testa. Chi è assente salta il turno.

**Sasso carta forbice** (in 2): scelta segreta, poi rivelazione animata. Al meglio di 3 o di 5; pari si rigioca. Variante con lucertola e Spock. Il computer non vede la tua scelta; il difficile studia le tue abitudini.

**Indovina il numero** (da 1 a 8): massimo casuale tra 50 e 1000 (o tra 1000 e 100000), visibile a tutti; a turno si prova e il computer dice più alto o più basso. Vince chi lo indovina; da soli contano i tentativi.

**Fine partita**: quando qualcuno vince la schermata dei risultati si apre da sola dopo 2,5 secondi, così si vede come si è vinto (la combinazione vincente brilla e il resto si spegne); una barretta in basso permette di aprirla subito. Gli annunci grandi compaiono in alto e non coprono più il tavolo.

**Carta appena pescata**: nei giochi di carte (scala 40, briscola…) la carta che hai appena pescato ha un bordo azzurro e l'etichetta "nuova", finché non la giochi o ne peschi un'altra.

**Giochi con le fiche** (blackjack, baccarat, higher or lower): 1000 fiche a testa, nessun minimo né massimo, tutti puntano insieme; dopo la prima puntata gli altri hanno 20 secondi, poi chi non ha puntato salta la mano. Senza fiche non si gioca finché non scrivi `!ricarica` (o premi il pulsante che compare). I computer si ricaricano da soli. Chi è sulle dispense o disconnesso salta la mano (il computer non punta mai al posto tuo).

**Blackjack** (da 1 a 6 contro il banco): 6 mazzi, banco che sta su tutti i 17, blackjack 3:2, niente assicurazione né resa, raddoppio anche dopo lo split, split fino a 4 mani (assi divisi: una carta sola), controllo del blackjack del banco. 30 secondi per decidere, poi si sta. I computer seguono la strategia di base.

**Baccarat** (Punto Banco, da 1 a 8): 8 mazzi, regole ufficiali della terza carta, Punto 1:1, Banco 1:1 meno 5%, Pareggio 8:1 (col pareggio Punto e Banco restituiti). Carte scoperte una alla volta e storico delle ultime mani.

**Higher or Lower** (da 1 a 8): un mazzo da 52, asso alto, carta uguale restituita; la vincita dipende dalla probabilità calcolata sulle carte rimaste (il banco trattiene il 4%).

**Texas Hold'em** (da 2 a 8) e **Poker a 5 carte con cambio** (da 2 a 6): no-limit, **senza bui né puntate obbligatorie** (puntata minima 5), mazziere che gira, piatti laterali per gli all-in, piatto diviso a parità. Nel 5 carte non serve la coppia per aprire; si cambiano da 0 a 5 carte. Le carte vincenti si illuminano. 30 secondi per decidere. I computer stimano la probabilità di vincere simulando centinaia di mani.

**UNO** (da 2 a 10): una mano sola; +2 su +2 o +4, +4 solo su +4 (penalità sommate); 0 e 7 senza effetti; se non puoi giocare peschi finché trovi una carta giocabile e la giochi; più carte uguali insieme; UNO dimenticato = 2 carte. Carte disegnate apposta.

**Campo minato** (da 1 a 8, solo persone): griglia condivisa in tempo reale, clic sinistro scopre e destro mette la bandierina, primo clic sicuro, cronometro, cursori degli altri con il nome. 5 difficoltà: Facile 10×10/15, Normale 18×14/45, Difficile 30×16/110, Estremo 45×24/260, Impossibile 60×32/480. Collaborazione (una mina e perdete tutti; classifica dei tempi) o Sfida (+1 per casella, −15 per mina). Si mette in pausa per tutti quando qualcuno apre le dispense.

**Chi è l'impostore** (da 3 a 10, solo persone): tutti hanno la stessa parola tranne l'impostore; 2 o 3 giri di indizi a turno (compaiono anche in chat), voto segreto, pareggio = un altro giro; l'impostore scoperto può ancora vincere indovinando la parola; rivelazione finale animata. Dizionario in `giochi/parole-impostore.js` (10 categorie).

**Coccodrillo** (da 2 a 8, con computer): 13 denti, uno a caso fa chiudere la bocca; chi viene morso è eliminato, l'ultimo vince. Variante con un "passo" a testa.

**Block Blast** (da 1 a 6, con computer): griglia 8×8, tre pezzi da trascinare, righe e colonne piene si cancellano, combo. Da soli (classifica), collaborazione (una griglia, un pezzo a testa, pausa con le dispense) o sfida (una griglia a testa, stessi pezzi per tutti; vince chi fa più punti o chi resiste di più).

**La Peppa Tencia** (da 2 a 6, con computer): 24 animali disegnati e la Peppa, gatta nera diabolica con il bordo rosso visibile solo a chi la ha. Mazzo da 20 coppie in due fino a 34 in sei; si parte con 4 carte, si pesca dal mazzo e, quando è finito, dalle mani degli avversari; ogni coppia vale 1 punto, si finisce quando le coppie sono tutte fatte e chi ha la Peppa perde 3 punti. Carte che volano quando peschi, animazione volutamente brutta quando peschi la Peppa.

**Fast West** (da 2 a 10, solo persone): 14 pistoleri segreti, carte bersaglio con direzione ed evento, 8 carte azione scelte in segreto e risolte insieme, duelli, tifo degli eliminati, "vince il west" se cadono tutti. Scelte fatte: le 8 carte sono le 7 azioni con 2 Ricariche; la Ricarica riprende gli scarti precedenti e poi va negli scarti; "incrociata" = si mira a chiunque; il Baro cambia arma nei secondi in cui le carte sono scoperte.

**Wordle** (da 1 a 8, con computer): parole italiane da 4 a 8 lettere (o a caso), 6 tentativi; nello scontro tutti cercano la stessa parola senza vedere le lettere degli altri.

**Guess the angle** (da 1 a 8, con computer): stima i gradi dell'angolo disegnato, oppure costruisci l'angolo richiesto; 5 o 10 round, punti in base all'errore.

**Sudoku** (da 1 a 6, solo persone): schema generato con una sola soluzione, 4 difficoltà, appunti personali, errori segnati o nascosti; in collaborazione tutti sulla stessa griglia con i cursori degli altri.

**Giochi in tempo reale**: il server fa girare un ciclo a tick per ogni tavolo (`tick(ora)`, `tickMs`, `vistaTick(posto)` nella partita; i comandi arrivano con l'evento `input`). Si fermano per tutti quando qualcuno apre le dispense; i giochi a turni invece vanno avanti.

**Snake** (da 1 a 8, con computer): tutti nella stessa arena, si muore toccando muri, sé stessi o gli altri; mele e 4 power-up (mela d'oro, scudo, fantasma, turbo); vince l'ultimo, da soli è una maratona a punti.

**Tetris Battle** (da 1 a 8, con computer): stessi pezzi per tutti, hold, pezzo fantasma, velocità che cresce ogni 10 righe, niente righe spazzatura; vince chi resiste, da soli è una maratona a punti. Pulsanti sullo schermo per il telefono.

**Air Hockey** (2 o 4, con computer): 1 contro 1 o 2 contro 2, a 7 gol (o 5 o 10). Fisica sul server a 50 tick al secondo; nel browser la propria racchetta segue subito il puntatore e il disco viene previsto tra un tick e l'altro. Chi gioca in alto vede il tavolo capovolto.

**Esecuzione pubblica (67)**: chi scrive in chat "67", "sessantasette" o "sessanta sette" (maiuscole, accenti e punteggiatura non contano; 167 o 670 no) fa partire l'esecuzione pubblica. Al posto del messaggio compare un avviso in chat, il tavolo si ferma per tutti per 7 secondi (mosse, computer, turni e giochi in tempo reale) e a tutti parte un'animazione a schermo intero: il nome viene lanciato nel cratere di un vulcano, con esplosione di lava. Chi è sulle dispense non la vede. Tra un'esecuzione e l'altra servono 12 secondi. Il riconoscimento è in `esecuzione.js`, l'animazione in `public/js/esecuzione.js`.

**Scopa 15**: nella scopa si sceglie la modalità; con la carta giocata si prendono le carte che insieme fanno 15.

**UNO**: si pesca una carta alla volta; i +2 e +4 non sono obbligatori (un +2/+4 pescato si può tenere, e con solo +2/+4 giocabili si può pescare); il pulsante UNO! è sempre in basso a destra.

**Fine partita e riepiloghi**: il riepilogo di fine smazzata resta finché qualcuno preme Continua; a fine partita chi ha aperto il tavolo può fare la rivincita o scegliere subito un altro gioco con gli stessi giocatori.

**Ghost Tris** (opzione del tris, 3×3 e 4×4): al massimo 3 segni a testa (4 nel 4×4); il segno in più fa sparire il più vecchio, che prima trema mezzo trasparente. Dopo 100 segni senza file è pareggio. Il computer difficile tiene conto dei segni che spariranno.

**Pompa il pallone** (da 2 a 8, con computer): un pallone per round, uguale per tutti; a turno pompi (+1 nel piatto del round) o incassi ed esci dal round. Lo scoppio arriva a un numero di pompate segreto tra 1 e 20 (o 12, 30): chi lo fa scoppiare perde il piatto. 3, 5 o 8 round.

**Interruttori** (da 2 a 8, con computer): da 5 a 20 interruttori (si sceglie prima), uno è la bomba; a turno se ne accende uno, chi salta è eliminato e arriva un pannello nuovo. L'ultimo vince. Variante con un passo a pannello.

**Caselle e bombe** (da 2 a 6, con computer): griglia senza numeri (6×6 con 8 bombe, o 5×5, 7×7); nel tuo turno scopri caselle finché vuoi (+1 a casella sicura) e ti fermi per incassare; la bomba ti fa perdere il piatto del turno. Finisce quando le caselle sicure sono finite.

**Scava il tesoro** (da 1 a 6, con computer): griglia 5×5, 10 scavi, monete (1), gemme (5), bombe (−2 scavi); dove non c'è niente compare quanti tesori ci sono intorno. Sfida con una griglia a testa uguale per tutti (anche da soli) oppure una griglia condivisa a turni.

**Numeri coperti** (da 2 a 6, con computer): 4, 5, 6 o 8 numeri da 1 a 9 da indovinare in ordine; se indovini continui, se sbagli passa il turno; i tentativi sbagliati restano scritti. Numeri tutti diversi o con ripetizioni.

**Dubito** (da 2 a 8, con computer): due mazzi da 52; si parte dagli assi e si sale di uno; da 1 a 4 carte coperte dichiarando il numero; gli altri hanno 7 secondi per dire DUBITO: chi mentiva (o chi ha dubitato a torto) prende il mucchio. Vince chi finisce le carte.

**Nascondino** (da 2 a 6, con computer): griglia 7×7; il cacciatore parte dal centro e si muove di 1 o 2 caselle in linea retta; chi si nasconde sceglie la casella all'inizio e poi a ogni round può spostarsi di una casella o restare fermo (tutti scelgono insieme, in segreto). La torcia: preso chi finisce sulla casella del cacciatore o su una accanto, o chi si incrocia con lui; il preso diventa cacciatore. Chi è nascosto vede i cacciatori solo quando sono a 2 caselle o meno. Indizi per i cacciatori: fruscio (nascosti a 2 caselle o meno), impronte delle caselle appena lasciate e ogni 3 round la bussola verso il nascosto più vicino. 1 punto a round a chi resta nascosto, 4 per ogni presa; 10, 8 o 14 round. Il difficile da cacciatore prevede dove scapperanno i nascosti.

**La mappa nascosta** (da 1 a 6, con computer): griglia 5×5 con nemici fermi e nascosti, numeri come nel campo minato sulle caselle dove passi; 6 mosse per arrivare all'uscita; tutti sulla stessa mappa insieme, ognuno vede solo quello che ha scoperto; 1, 3 o 5 mappe.

**Tasti in ordine** (da 1 a 8, con computer, tempo reale): la stessa sequenza di lettere per tutti da battere in ordine; errore = +1 secondo; vince il tempo totale più basso; tastiera sullo schermo per il telefono.

**Oggetti sulla mensola** (da 1 a 8, con computer): memoria in due versioni: rimettere gli oggetti nell'ordine giusto su uno scaffale a più ripiani (da 5 oggetti su un ripiano fino a 15 su tre; 22 oggetti disegnati) oppure scoprire cosa è cambiato (un oggetto sostituito o due scambiati).

**The Mind** (da 2 a 4, collaborazione, tempo reale): se finiscono le vite il livello ricomincia da capo (con le vite e le stelle di inizio livello), all'infinito: per smettere Termina o Torna al tavolo. carte da 1 a 100; al livello N ognuno ha N carte e tutti insieme, senza turni e senza parlare, le mettono giù in ordine crescente. 12 livelli in 2, 10 in 3, 8 in 4. Si parte con tante vite quanti i giocatori e una stella ninja; premi ai livelli 2, 5, 8 (stella) e 3, 6, 9 (vita). Carta giocata troppo presto = una vita in meno e le carte più basse si scartano scoperte; dopo ogni errore e prima di ogni livello tutti premono "Pronto". Stella ninja a voto (basta un no per annullarla): ognuno scarta la sua carta più bassa. Il computer è un compagno di squadra senza livelli (aspetta in base alla distanza tra la sua carta e l'ultima giocata; si sceglie quanto conta veloce). Spazio o Invio giocano la carta più bassa. Si ferma per tutti con le dispense.

**Flip 7** (da 2 a 8, con computer): regole ufficiali, mazzo da 94 (numeri da 0 a 12 in tante copie quanto il numero, +2…+10, x2, 3 Congela, 3 Pesca tre, 3 Seconda possibilità). Una carta scoperta a testa, poi a turno pesca o stai; doppione = 0 nel round; 7 numeri diversi = Flip 7, +15 e fine round. Azioni con scelta del bersaglio (anche sé stessi), azioni pescate durante un Pesca tre risolte dopo, Seconda possibilità regalata se ne hai già una. Il mazzo non si rimescola tra un round e l'altro; sotto il tuo nome la probabilità di sballare con la prossima carta. Si vince a 200 (o 100, 300). Riepilogo del round che aspetta "Continua". Il difficile calcola il valore atteso della prossima carta.

**Cirulla** (da 2 a 4, in 4 a coppie, con computer): prese uguali, a somma e da 15 (libera scelta, presa obbligatoria); asso piglia tutto con scopa (con un asso in tavola prende quello o fa 15); quindici o trenta in tavola all'inizio = una o due scope al mazziere; due assi in tavola = si ridà; bàrsega (somma sotto 10, 3 scope) e decino (tre uguali, 10 scope) accusati da soli a inizio turno, con la mano che resta scoperta e un messaggio in chat; 7 di cuori matta per accusi e quindici iniziale (tiene il valore dichiarato finché non viene presa); carte, quadri, settebello, primiera, Grande (5), Piccola (3 + scala), capotto; si vince a 51 (o 31, 101). Carte in ordine e numerino del valore sulle figure come nella scopa; sulla matta una M dorata.

**Solitario Klondike** (da 1 a 6, solo persone): pesca 1 con giri illimitati del tallone; carte trascinate col mouse o col dito, oppure tocco sulla carta e poi sulla destinazione; doppio clic sulla base; "Finisci" quando tutto è scoperto. In gara tutti hanno la stessa distribuzione e vince il primo che finisce; se si arrendono tutti (o scade il tempo scelto: 10, 20, 30 minuti) vince chi ha più carte sulle basi. In alto la barra di avanzamento degli altri. Da soli si ferma con le dispense e c'è la classifica dei tempi migliori (in memoria).

**Allegro chirurgo** (da 1 a 8, con computer, tempo reale): percorso uguale per tutti e diverso a ogni round (serpentone, labirinto, spirale, zig-zag); il gioco segue solo il pezzo di percorso dove sei (dove due giri passano vicini non si salta sull'altro); il cerchio del VIA e la bandiera sono zone sicure; da seguire tenendo premuto il mouse o il dito dal VIA alla bandiera; se tocchi il bordo, esci o lasci andare ricominci da zero. 6 difficoltà (Facile, Normale, Difficile, Esperto, Impossibile, Impossibile estremo, dove il corridoio si stringe e si allarga). Il browser controlla i bordi punto per punto, il server ricontrolla la posizione e rifiuta i salti. Punti per ordine d'arrivo (il primo ne prende quanti sono i giocatori), 20 secondi agli altri dopo il primo; 1, 3 o 5 percorsi. Si ferma per tutti con le dispense.

**Human Benchmark 1v1** (in 2, o da soli per allenarsi; con computer, tempo reale): tempo di reazione (media di 5), memoria di sequenza (griglia 3×3), memoria di numeri, clic su 20 bersagli, memoria visiva (3 errori = una vita, 3 vite). Stessi dati per tutti e due, stessa prova nello stesso momento; il browser misura i tempi e il server controlla le risposte e rifiuta i tempi impossibili. Al meglio di 5 (chi arriva a 3), spareggi al tempo di reazione. Ordine delle prove fisso o a caso. Chi resta fermo 45 secondi chiude la prova. Con le dispense si ferma per tutti e il tentativo in corso si rifà.

**Risiko** (da 2 a 6, con computer): si gioca sulla **mappa del mondo come nel tabellone vero**: le coste vere di continenti e isole (Gran Bretagna e Irlanda, Islanda, Giappone, Indonesia, Nuova Zelanda, Caraibi, Mediterraneo, grandi laghi, Caspio…) divise nei 42 territori con percorsi SVG a confini condivisi; ogni territorio ha il colore semitrasparente del suo continente (Nord America giallo, Sud America rosso mattone, Europa blu, Africa marrone, Asia verde, Oceania viola) su un mare chiaro con meridiani, paralleli e rosa dei venti; chi possiede un territorio si vede dal gettone delle armate, del colore del giocatore, come le armate del gioco vero; confini spessi tra i continenti e rotte sul mare tratteggiate, con gli 83 confini del Risiko classico (6 continenti: Asia +7, Nord America ed Europa +5, Africa +3, Sud America e Oceania +2). I percorsi sono stati generati una volta sola: coste vere semplificate a mano, divise nei territori, rasterizzate a mezzo grado, con i confini estratti come archi condivisi, semplificati e arrotondati (così i territori vicini combaciano) e stanno in giochi/risiko-mappa.js insieme alle regole della mappa. In alternativa una mappa inventata di 24 territori (a esagoni) per partite corte. Armate iniziali come nel Risiko (40/35/30/25/20; sulla mappa piccola 26/22/19/16/14), schieramento tutti insieme, rinforzi (territori/3, minimo 3, bonus continenti, tris con +2 sui territori delle carte, obbligo con 5 carte), attacchi 3 contro 2 con parità alla difesa (anche "fino in fondo"), conquista con scelta delle armate, uno spostamento tra confinanti, carta se hai conquistato, carte all'eliminatore. Conquista del mondo o missioni segrete classiche; dopo 150 giri vince chi ha più territori. Il difficile calcola le probabilità esatte delle battaglie; il computer aspetta meno tra una mossa e l'altra (`velocitaBot`).

**Disegna e indovina** (da 2 a 8, solo persone, tempo reale): chi disegna sceglie tra 3 parole (15 secondi, poi a caso) e ha 80 secondi (o 60, 120); lavagna con 12 colori, 4 spessori, gomma, annulla, cancella tutto. Gli altri scrivono in chat (anche dal riquadro accanto alla lavagna): maiuscole, accenti e punteggiatura non contano; la risposta giusta non si mostra (compare "ha indovinato!"), chi sbaglia di una lettera riceve un avviso solo per lui ("ci sei quasi"). Chi disegna e chi ha già indovinato non possono scrivere la parola. Trattini con una lettera svelata a metà e a tre quarti del tempo. Punti: da 50 a 300 in base al tempo, +50 al primo; 60 a chi disegna per ogni persona che indovina. 1, 2 o 3 giri. Circa 290 parole in giochi/disegna-parole.js.

**Putt Party 2D** (da 1 a 8, solo persone, tempo reale): 9 buche disegnate in giochi/putt-buche.js (usato anche dal browser) con difficoltà da una a cinque stelle — rettilineo, curva a L, respingenti, trappola di sabbia, ponte sull'acqua, zig-zag, mulino a vento, porte mobili, labirinto — giocate a ogni partita in ordine casuale. Tutti tirano insieme con la propria pallina (le palline non si toccano); si tira come con una fionda (premi, trascina all'indietro, lascia). Fisica sul server: rimbalzi sui muri, respingenti che rilanciano, sabbia che frena, acqua = si torna indietro con un colpo di penalità, mulini e blocchi che si muovono; troppo forte sulla buca ci passa sopra. Nessun limite di colpi; ogni buca dura al massimo 3 minuti (chi non è in buca prende 3 colpi in più). Tabellino con il par; vince chi fa meno colpi.

**Giochi d'azione** (tempo reale, con computer a 3 livelli, si fermano con le dispense; tutti sullo stesso motore `giochi/arena.js` + `public/js/giochi/arena.js`, con tastiera, mouse, joystick e pulsante sullo schermo del telefono):
- **Palloncini in fuga** (1-8): un tasto solo, il vento spinge a sinistra, spuntoni e bordi che pungono; punti = secondi in aria, +10 all'ultimo.
- **Il gatto e i topi** (2-6): il gatto segue il mouse (o il dito), i topi vanno con la tastiera; formaggi 1 punto, presa 3; ognuno fa il gatto una volta.
- **Il ladro di colori** (1-8): la scia (larga) colora il pavimento, anche sopra gli altri; 30 secondi; punti = caselle/10.
- **Bumper Balls** (2-8): palle che scivolano e si urtano su un'arena che si restringe; chi cade è fuori.
- **Fuga dai fantasmi** e **Monete in salita** (1-8, `giochi/salita.js`): scorrimento verticale, non vedi cosa c'è sopra; nella fuga i fantasmi salgono dal basso, nella salita il percorso è lungo 6000 px con monete e bonus d'arrivo. Il difficile cerca la strada con una visita in ampiezza su una griglia.
- **Caselle colorate** (1-8): esce un colore, le altre caselle spariscono; pugni che stordiscono; sempre meno tempo e meno caselle giuste.
- **Pioggia di monete** (1-8): arena rotonda, monete, potenziamenti (velocità, calamita, scudo), lo scatto fa cadere un terzo delle monete a chi viene travolto.
- **Paintball** (2-8): sparatutto dall'alto, mira col mouse (o toccando il campo), muretti come ripari, 75 secondi.
- **Salta e corri** (1-8): corsa a piattaforme vista di lato con tratti orizzontali, pareti da scalare e scalinate; doppio salto e turbo; telecamera che segue il proprio omino.
- **Massi dalla montagna** (2-8): uno in cima tira i massi, gli altri salgono schivando; colpiti = storditi e indietro; ognuno tira una volta.

**Trova le differenze** (1-8, con computer): quattro disegni SVG per pochi secondi, uno con una differenza (colore, oggetto in meno o in più, spostato, più grande, girato); poi si sceglie quale era; punti per velocità.

**Briscola**: sulle carte che valgono punti c'è il numerino dei punti (asso 11, tre 10, re 4, donna 3, fante 2).

**Filtri nella home**: sopra l'elenco dei giochi si cerca per nome (anche "scopa 15" o "quindici"), si sceglie il numero di giocatori e si filtra tra giochi col computer e giochi solo tra persone. I filtri di giocatori e tipo restano salvati.

**Carte in ordine**: nella scopa, nello scopone e nel rubamazzo la mano (e nella scopa anche la tavola) è ordinata per valore; nella briscola per seme con la briscola in fondo; in UNO per colore; nel poker dalla più alta. Nella scopa e nello scopone le figure hanno un numerino in alto a destra con il loro valore (fante 8, donna 9, re 10).

**Air Hockey più solido**: la fisica fa passi più piccoli (il disco non passa più attraverso la racchetta), il disco schiacciato contro la sponda non accelera più, la velocità massima è sempre rispettata; la propria racchetta nel browser si muove alla stessa velocità di quella del server; il computer non si butta più sul disco nell'angolo e, se lo sta bloccando, si allontana.

**Dispense**: classe 5ªB, date di lezioni e scadenze calcolate da oggi (una settimana dopo l'altra), pagine in inglese (ICT English, Grammar).

Varianti non incluse: napola e accuse nello scopone, scala 40 con 5 o 6 giocatori, rientro dopo l'eliminazione.

## Difese del sito

Tutto in `sicurezza.js`, senza librerie in più:

- **Intestazioni di sicurezza** su ogni pagina: il sito non si può mettere dentro una pagina altrui (niente clickjacking), gli script si caricano solo dal sito stesso (Content-Security-Policy), niente "sniffing" dei tipi di file, niente referrer, niente accesso a fotocamera, microfono e posizione; su Render anche HSTS (solo https).
- **Dati ripuliti**: tutto quello che arriva dal browser passa da `pulisciDato` (via le chiavi `__proto__`/`constructor`, stringhe e liste tagliate, profondità massima). I nomi perdono i caratteri che potrebbero diventare HTML. Un gioco esiste solo se è davvero nell'elenco.
- **Limiti**: ogni messaggio dal browser al massimo 100 kB; per ogni connessione un numero massimo di eventi al secondo (la chat 5 di fila e poi uno al secondo, i tentativi di entrare in un tavolo pochi al minuto per non indovinare i codici); chi esagera di continuo viene disconnesso. Per indirizzo: al massimo 150 connessioni, 60 tavoli aperti e 6000 richieste al minuto (limiti larghi apposta: a scuola tutta la classe esce su internet con lo stesso indirizzo). Al massimo 1000 tavoli in tutto.
- **Niente crash**: un errore dentro un evento viene scritto nel log e basta; un errore imprevisto non spegne il sito per tutti.
- `npm test` prova le difese (dati avvelenati, raffiche, errori, intestazioni).

Limiti che restano: le classifiche e i tavoli stanno in memoria (se Render riavvia il server si perdono); chi conosce il codice di un tavolo può entrarci (è così che si invitano gli amici); contro attacchi enormi da tante macchine diverse serve la protezione di Render o di un servizio come Cloudflare.

## File del progetto

```
server.js            tavoli, giocatori, computer, chat e comandi (!prof)
giochi/              regole di ogni gioco e i giocatori automatici
  carte.js           mazzi francesi
  briscola.js  scopa.js  rubamazzo.js  scala40.js  tris.js  forza4.js  battaglia.js
  navale-regole.js   schieramento della battaglia navale (usato anche dal browser)
  dama.js  scacchi.js  impiccato.js  morra.js (sasso carta forbice)  numero.js
  casino.js          base comune dei giochi con le fiche (puntate, tempo, ricarica)
  blackjack.js  baccarat.js  higherlower.js
  poker-motore.js    valutazione delle mani, puntate, piatti laterali
  texas.js  poker5.js  uno.js  campo.js (campo minato)
  impostore.js (+ parole-impostore.js)  coccodrillo.js  blockblast.js  peppa.js  fastwest.js
  wordle.js  angolo.js (guess the angle)  sudoku.js
  snake.js  tetris.js  airhockey.js   giochi in tempo reale
  pallone.js  interruttori.js  casellebombe.js  tesoro.js  coperti.js  dubito.js
  nascondino.js  mappa.js  tasti.js (tempo reale)  mensola.js
  mind.js (The Mind)  flip7.js  cirulla.js  solitario.js (Klondike)
  chirurgo.js (Allegro chirurgo, tempo reale)  benchmark.js (Human Benchmark 1v1)  risiko.js + risiko-mappa.js
  disegna.js (+ disegna-parole.js)  putt.js + putt-buche.js (tempo reale)
  scala-regole.js    combinazioni di scala 40 (usate anche dal browser)
public/              la pagina del sito
  index.html  style.css
  boss.css           stile della pagina delle dispense
  js/boss.js         Boss Key: Esc, ritorno, titolo, favicon, cronologia, finestra grigia
  js/boss-pagina.js  contenuto delle dispense
  js/tavoli-tabellone.js  i giochi senza carte (tris, forza 4, battaglia navale, dama, scacchi…)
  js/carte.js        disegno delle carte
  js/tavoli.js       il tavolo di ogni gioco
  js/app.js          ingresso, sala d'attesa, chat, partita
  js/giochi/         il tavolo dei giochi nuovi (un file per gioco) e comuni.js
  nuovi.css          stile dei giochi nuovi
test/simula.js       controlli delle regole e migliaia di partite tra computer
test/nuovi.js        controlli dei giochi nuovi
esecuzione.js        riconosce il "67" in chat (esecuzione pubblica)
censura.js           censura in chat e nei nomi "vigano/viganò" (e "viagano") in ogni forma
verifica.js          all'avvio controlla che ci siano tutti i file (elenco in elenco-file.txt)
sicurezza.js         difese: intestazioni, limiti, pulizia dei dati, niente crash
admin.js             riconosce il comando segreto dell'amministratore (solo l'impronta)
```

Per rilanciare i controlli: `npm test`.

## Da fare più avanti

- **Mini IA in chat con Gemini** (da decidere insieme): si chiama scrivendo `!nome domanda` e risponde in chat. La chiave va messa su Render come variabile d'ambiente `GEMINI_API_KEY` (mai nel codice né in chat). Manca da scegliere il nome dell'IA.

Non fare per ora: **Ponte fragile**. Limiti noti: le classifiche sono in memoria; i giochi in tempo reale non sono ancora stati provati su Render né su telefoni veri.

## Come aggiungere un gioco

1. In `giochi/` un file con `meta` (nome, giocatori, opzioni, regole), `crea` e `bot`, registrato in `giochi/index.js`.
2. Nel browser, il suo disegno in `public/js/tavoli.js` (carte) o `public/js/tavoli-tabellone.js` (tabelloni, con `libero: true`).
3. Se tutti agiscono nello stesso momento (come lo schieramento della battaglia navale), la partita tiene `turno = null` ed espone `attesi()`: il server fa agire da solo il computer e chi è assente.
4. Con un orologio, la partita espone `scadenza()` e `controllaTempo()` e il server chiude la partita da solo allo scadere.
5. Un gioco con le fiche estende `Casino` (giochi/casino.js), ha `fiche: true` e `saltaAssenti: true` in `meta`, e il server tiene il saldo di ogni giocatore al tavolo.
6. Un gioco solo tra persone ha `soloPersone: true` in `meta`: niente computer, e chi manca salta il turno (`salta`, `esce`, `rientra`).
7. Le regole vanno scritte in `meta.regole`: in fondo compaiono da sole i comandi della chat e i tasti della modalità studio. Un nuovo comando si aggiunge in `COMANDI` e `AIUTO_COMANDI` in `server.js`.
8. Una partita può scrivere in chat a nome di un giocatore riempiendo `chatDa` ({ posto, testo }), e può decidere da sé se fermarsi con le dispense con la proprietà `pausaBoss`.
9. Il Boss Key vale da solo anche per il nuovo gioco. Se è un gioco di collaborazione, `pausaBoss: true` in `meta` lo mette in pausa quando qualcuno apre le dispense.
10. Un gioco di collaborazione in cui il computer è un compagno di squadra (come The Mind) ha `senzaLivelli: true` in `meta`: nella home e nella sala il computer si aggiunge senza scegliere facile, medio o difficile.
11. Una partita può leggere la chat con `leggiChat(posto, testo)`: restituisce `{ nascondi }` (il messaggio non si mostra), `{ privato: '…' }` (avviso solo a chi l'ha scritto, evento socket `avvisoPrivato`) e/o `{ cambiato }`. Può scrivere messaggi di sistema con `chatSistema` (stringhe; `@N` diventa il nome del posto N). Esempio: Disegna e indovina.
12. `velocitaBot` nella partita (es. 0.55 in Risiko) fa aspettare meno il computer tra una mossa e l'altra. File condivisi tra server e browser (come risiko-mappa.js e putt-buche.js) vanno serviti con una riga `app.get('/js/…')` in server.js.
13. I giochi con le fiche possono esporre `ficheInGioco(posto)`: se ci sono fiche ancora in gioco nella mano, il consiglio di !ricarica non compare.
15. Un gioco d'azione in tempo reale si fa estendendo `Arena` (giochi/arena.js): basta scrivere `iniziaRound`, `passo(dt)` (restituisce true a fine round), `pensa(p, livello)` per il computer, `fineRound` e `statoTick`. Nel browser `Arena.tavolo({ id, disegna, istruzioni, hud, … })` pensa a canvas, comandi, interpolazione e conto alla rovescia.
14. **Nessuna cartella deve superare i 100 file** (GitHub ne carica al massimo 100 per volta dal browser). Quando `giochi/` arriva a 100 file, i giochi nuovi vanno in `giochi2/` (poi `giochi3/` e così via): in `giochi/index.js` si registrano con `require('../giochi2/nome')`. Lo stesso vale per `public/js/giochi/` → `public/js/giochi2/` (con lo `<script>` in index.html che punta alla nuova cartella). Ogni cartella si carica su GitHub con un commit a parte. `npm test` controlla che nessuna cartella superi i 100 file.
