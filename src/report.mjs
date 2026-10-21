// Erzeugt aus scan.json (und optional manuell.json) einen Kundenbericht als HTML und PDF.
// Aufruf: node src/report.mjs ergebnisse/<ordner>
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { REGELN, PRIORITAET } from './regeln-de.mjs';
import { CHECKLISTE } from './checkliste.mjs';

const ordner = process.argv[2];
if (!ordner) {
  console.error('Aufruf: node src/report.mjs ergebnisse/<ordner>');
  process.exit(1);
}
const scan = JSON.parse(fs.readFileSync(path.join(ordner, 'scan.json'), 'utf8'));
const manuellDatei = path.join(ordner, 'manuell.json');
const manuell = fs.existsSync(manuellDatei) ? JSON.parse(fs.readFileSync(manuellDatei, 'utf8')) : {};

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const wcagAusTags = (tags) => tags.filter((t) => /^wcag\d{3,}$/.test(t)).map((t) => t.slice(4).split('').join('.')).join(', ');

// Befunde über alle Seiten nach Regel zusammenfassen.
const befunde = new Map();
for (const seite of scan.seiten) {
  for (const v of seite.verstoesse ?? []) {
    const b = befunde.get(v.regel) ?? { ...v, anzahl: 0, seiten: [], beispiele: [] };
    b.anzahl += v.anzahl;
    b.seiten.push(seite.name);
    b.beispiele.push(...v.beispiele.map((x) => ({ ...x, seite: seite.name })));
    befunde.set(v.regel, b);
  }
}
const liste = [...befunde.values()]
  .map((b) => ({
    ...b,
    prio: PRIORITAET[b.auswirkung] ?? PRIORITAET.minor,
    text: REGELN[b.regel] ?? { titel: b.beschreibung, wirkung: '', fix: `Siehe ${b.hilfeUrl}`, wcag: wcagAusTags(b.tags) },
  }))
  .sort((a, b) => a.prio.rang - b.prio.rang || b.anzahl - a.anzahl);

const zaehle = (stufe) => liste.filter((b) => b.prio.stufe === stufe).length;
const fokusProbleme = scan.seiten.flatMap((s) => (s.tastatur?.ohneSichtbarenFokus ?? []).map((f) => ({ ...f, seite: s.name })));
const reflowProbleme = scan.seiten.filter((s) => s.reflow?.horizontalesScrollen);
const fehlerSeiten = scan.seiten.filter((s) => s.fehler);
const offeneManuell = CHECKLISTE.filter((p) => !manuell[p.id] || manuell[p.id].status === 'offen').length;

const gesamt = zaehle('Hoch') > 0 || fokusProbleme.length > 0 ? 'rot' : zaehle('Mittel') > 0 || reflowProbleme.length > 0 ? 'gelb' : 'gruen';
const gesamtText = {
  rot: 'Es gibt schwerwiegende Barrieren im Kaufprozess. Wir empfehlen, diese zeitnah zu beheben.',
  gelb: 'Es gibt keine automatisch erkannten schweren Barrieren, aber mehrere Punkte mit mittlerer Priorität.',
  gruen: 'Der automatische Test hat keine Verstöße gefunden. Die manuelle Prüfung bleibt trotzdem notwendig.',
}[gesamt];

const statusText = { ok: 'Erfüllt', mangel: 'Mangel', offen: 'Noch offen', na: 'Nicht zutreffend' };

const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<title>Barrierefreiheits-Prüfbericht ${esc(scan.kunde)}</title>
<style>
  :root { --text:#1d1d1f; --muted:#5b5b66; --line:#d9d9e0; --rot:#b42318; --gelb:#9a6700; --gruen:#1a7f37; --akzent:#2f4fb5; }
  * { box-sizing: border-box; }
  body { font: 15px/1.55 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); background:#fff; margin: 0 auto; max-width: 900px; padding: 32px 24px; }
  h1 { font-size: 26px; margin: 0 0 4px; } h2 { font-size: 19px; margin: 32px 0 8px; border-bottom: 2px solid var(--line); padding-bottom: 4px; }
  h3 { font-size: 16px; margin: 20px 0 4px; }
  .meta { color: var(--muted); margin-bottom: 20px; }
  .ampel { border-left: 6px solid; padding: 12px 16px; background: #f6f6f9; }
  .ampel.rot { border-color: var(--rot); } .ampel.gelb { border-color: var(--gelb); } .ampel.gruen { border-color: var(--gruen); }
  .kacheln { display: flex; gap: 12px; flex-wrap: wrap; margin: 16px 0; }
  .kachel { flex: 1 1 140px; border: 1px solid var(--line); border-radius: 8px; padding: 10px 14px; }
  .kachel b { display: block; font-size: 24px; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 14px; }
  th, td { text-align: left; border-bottom: 1px solid var(--line); padding: 6px 8px; vertical-align: top; }
  th { background: #f6f6f9; }
  .p-Hoch { color: var(--rot); font-weight: 600; } .p-Mittel { color: var(--gelb); font-weight: 600; } .p-Niedrig { color: var(--muted); }
  .befund { border: 1px solid var(--line); border-radius: 8px; padding: 4px 16px 12px; margin: 12px 0; page-break-inside: avoid; }
  code { font-size: 12px; background: #f1f1f5; padding: 1px 4px; border-radius: 3px; word-break: break-all; }
  .hinweis { color: var(--muted); font-size: 13px; }
  @media print { body { padding: 0; } h2 { page-break-after: avoid; } }
</style></head><body>
<h1>Barrierefreiheits-Prüfbericht</h1>
<div class="meta">${esc(scan.kunde)} · Prüfdatum ${esc(scan.datum)} · Maßstab WCAG 2.1 Stufe AA (EN 301 549) · ${scan.seiten.length} Seiten des Kaufprozesses</div>

<div class="ampel ${gesamt}"><strong>Ergebnis:</strong> ${gesamtText}</div>
<div class="kacheln">
  <div class="kachel"><b class="p-Hoch">${zaehle('Hoch')}</b>Befunde hohe Priorität</div>
  <div class="kachel"><b class="p-Mittel">${zaehle('Mittel')}</b>Befunde mittlere Priorität</div>
  <div class="kachel"><b>${zaehle('Niedrig')}</b>Befunde niedrige Priorität</div>
  <div class="kachel"><b>${fokusProbleme.length}</b>Elemente ohne sichtbaren Tastaturfokus</div>
</div>

<h2>Geprüfte Seiten</h2>
<table><tr><th>Seite</th><th>Adresse</th><th>Verstöße (Stellen)</th><th>Handy-Ansicht 320 px</th></tr>
${scan.seiten.map((s) => `<tr><td>${esc(s.name)}</td><td><code>${esc(s.url)}</code></td><td>${s.fehler ? 'Nicht prüfbar: ' + esc(s.fehler) : (s.verstoesse ?? []).reduce((n, v) => n + v.anzahl, 0)}</td><td>${s.reflow ? (s.reflow.horizontalesScrollen ? 'Seitlich scrollen nötig' : 'In Ordnung') : '–'}</td></tr>`).join('')}
</table>

<h2>Befunde im Überblick</h2>
${liste.length === 0 ? '<p>Keine automatisch erkennbaren Verstöße.</p>' : `<table><tr><th>Priorität</th><th>Befund</th><th>Stellen</th><th>Seiten</th><th>WCAG</th></tr>
${liste.map((b) => `<tr><td class="p-${b.prio.stufe}">${b.prio.stufe}</td><td>${esc(b.text.titel)}</td><td>${b.anzahl}</td><td>${esc(b.seiten.join(', '))}</td><td>${esc(b.text.wcag)}</td></tr>`).join('')}
</table>`}

<h2>Befunde im Detail</h2>
${liste.map((b) => `<div class="befund">
  <h3><span class="p-${b.prio.stufe}">${b.prio.stufe}</span> · ${esc(b.text.titel)}</h3>
  ${b.text.wirkung ? `<p><strong>Auswirkung:</strong> ${esc(b.text.wirkung)}</p>` : ''}
  <p><strong>Lösung:</strong> ${esc(b.text.fix)}</p>
  <p class="hinweis">Beispiele (${b.anzahl} Stellen insgesamt):</p>
  <ul>${b.beispiele.slice(0, 4).map((x) => `<li>${esc(x.seite)}: <code>${esc(x.selektor)}</code></li>`).join('')}</ul>
</div>`).join('')}

<h2>Tastaturbedienung</h2>
${fokusProbleme.length === 0 ? '<p>Bei allen per Tab erreichten Elementen war ein Fokusrahmen erkennbar.</p>' : `<p>Bei diesen Elementen sieht man beim Navigieren mit der Tastatur nicht, wo man sich befindet (WCAG 2.4.7):</p>
<table><tr><th>Seite</th><th>Element</th><th>Text</th></tr>${fokusProbleme.slice(0, 15).map((f) => `<tr><td>${esc(f.seite)}</td><td><code>${esc(f.selektor)}</code></td><td>${esc(f.name)}</td></tr>`).join('')}</table>`}

<h2>Manuelle Prüfung</h2>
<p>${offeneManuell === 0 ? 'Alle manuellen Prüfpunkte wurden bearbeitet.' : `${offeneManuell} von ${CHECKLISTE.length} Prüfpunkten sind noch offen.`}</p>
<table><tr><th>Nr.</th><th>Bereich</th><th>Prüfpunkt</th><th>Ergebnis</th></tr>
${CHECKLISTE.map((p) => { const m = manuell[p.id] ?? { status: 'offen' }; return `<tr><td>${p.id}</td><td>${esc(p.bereich)}</td><td>${esc(p.pruefung)}${m.notiz ? `<br><span class="hinweis">${esc(m.notiz)}</span>` : ''}</td><td>${statusText[m.status] ?? esc(m.status)}</td></tr>`; }).join('')}
</table>

<h2>Hinweise zum Bericht</h2>
<p class="hinweis">Automatische Tests erkennen erfahrungsgemäß nur einen Teil aller Barrieren; deshalb ergänzt die manuelle Prüfung den Scan. Dieser Bericht ist eine technische Prüfung nach WCAG 2.1 AA und keine Rechtsberatung. Ob und in welchem Umfang das Barrierefreiheitsstärkungsgesetz (BFSG) auf Ihr Unternehmen anwendbar ist, klären Sie bitte mit einer Rechtsberatung.</p>
${fehlerSeiten.length ? `<p class="hinweis">Nicht prüfbar waren: ${esc(fehlerSeiten.map((s) => s.name).join(', '))}.</p>` : ''}
<p class="hinweis">Werkzeuge: ${esc(scan.werkzeug)}.</p>
</body></html>`;

const htmlDatei = path.join(ordner, 'bericht.html');
fs.writeFileSync(htmlDatei, html);
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + path.resolve(htmlDatei));
await page.pdf({ path: path.join(ordner, 'bericht.pdf'), format: 'A4', margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' }, printBackground: true });
await browser.close();
console.log(`Bericht: ${htmlDatei} und bericht.pdf`);
