// Automatischer Barrierefreiheits-Scan (WCAG 2.1 AA) für die Seiten eines Kaufprozesses.
// Aufruf:  node src/scan.mjs <konfig.json>          (siehe vorlagen/shop-konfig.json)
//          node src/scan.mjs <url> [<url> ...]      (Schnelltest ohne Konfig)
// Ergebnis: ergebnisse/<slug>-<datum>/scan.json + Screenshots
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const TAB_SCHRITTE = 40;

function ladeKonfig(args) {
  if (args.length === 1 && args[0].endsWith('.json')) {
    return JSON.parse(fs.readFileSync(args[0], 'utf8'));
  }
  if (args.length === 0) {
    console.error('Aufruf: node src/scan.mjs <konfig.json> | <url> [<url> ...]');
    process.exit(1);
  }
  return {
    kunde: new URL(args[0]).hostname,
    seiten: args.map((url, i) => ({ name: `Seite ${i + 1}`, url })),
  };
}

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Häufige Beschriftungen von Cookie-Bannern und Länder-/Sprachdialogen. Ergänzbar per Konfig ("klicken").
const STANDARD_KLICKS = [
  'Alle akzeptieren', 'Alles akzeptieren', 'Akzeptieren', 'Alle Cookies akzeptieren', 'Ich stimme zu',
  'Zustimmen', 'Einverstanden', 'Accept all', 'Accept', 'Auswahl bestätigen', 'OK',
];

// Schließt Cookie-Banner und Dialoge, damit Scan und Tastaturtest die eigentliche Seite sehen.
async function schliesseOverlays(page, zusatz = []) {
  const geklickt = [];
  for (const text of [...zusatz, ...STANDARD_KLICKS]) {
    const knopf = page.getByRole('button', { name: text, exact: true }).first();
    if (await knopf.isVisible({ timeout: 300 }).catch(() => false)) {
      await knopf.click({ timeout: 3000 }).then(() => geklickt.push(text)).catch(() => {});
      await page.waitForTimeout(800);
    }
  }
  await page.keyboard.press('Escape');
  return geklickt;
}

function axeErgebnis(axe) {
  return {
    verstoesse: axe.violations.map((v) => ({
      regel: v.id,
      auswirkung: v.impact,
      beschreibung: v.help,
      hilfeUrl: v.helpUrl,
      tags: v.tags,
      anzahl: v.nodes.length,
      beispiele: v.nodes.slice(0, 5).map((n) => ({ selektor: n.target.join(' '), html: n.html.slice(0, 300) })),
    })),
    manuellZuPruefen: axe.incomplete.length,
    bestanden: axe.passes.length,
  };
}

// Läuft per Tab durch die Seite und prüft, ob der Fokus sichtbar ist (WCAG 2.4.7).
// Sichtbar heißt: Fokus-Stil unterscheidet sich vom Zustand ohne Fokus (Rahmen, Schatten, Farbe, Unterstreichung).
async function pruefeTastatur(page) {
  const schritte = [];
  await page.evaluate(() => document.activeElement?.blur());
  for (let i = 0; i < TAB_SCHRITTE; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      let el = document.activeElement;
      while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
      if (!el || el === document.body) return null;
      // Markierung erkennt, wann die Tab-Reihenfolge wieder von vorn beginnt.
      if (el.dataset.bfsgTab) return { wiederholt: true };
      el.dataset.bfsgTab = '1';
      const merkmale = (e) => {
        const s = getComputedStyle(e);
        return [s.outlineStyle, s.outlineWidth, s.outlineColor, s.boxShadow, s.backgroundColor,
          s.borderColor, s.color, s.textDecorationLine].join('|');
      };
      const mitFokus = merkmale(el);
      const outline = getComputedStyle(el);
      const hatRahmen = outline.outlineStyle !== 'none' && parseFloat(outline.outlineWidth) > 0;
      el.blur();
      const ohneFokus = merkmale(el);
      el.focus({ preventScroll: true });
      const name = (el.getAttribute('aria-label') || el.innerText || el.getAttribute('alt') || el.getAttribute('placeholder') || el.value || '')
        .trim().slice(0, 60);
      const selektor = el.id ? `#${el.id}` : el.tagName.toLowerCase() + (el.className && typeof el.className === 'string'
        ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '')
        + (el.getAttribute('href') ? `[href="${el.getAttribute('href').slice(0, 60)}"]` : '');
      return { selektor, name, fokusSichtbar: hatRahmen || mitFokus !== ohneFokus };
    });
    if (!info) continue;
    if (info.wiederholt) break;
    schritte.push(info);
  }
  return {
    erreichbareElemente: schritte.length,
    ohneSichtbarenFokus: schritte.filter((s) => !s.fokusSichtbar),
  };
}

// Prüft Umbruch bei 320 px Breite ohne horizontales Scrollen (WCAG 1.4.10).
async function pruefeReflow(handy, url) {
  const page = await handy.newPage();
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(1000);
    const breiten = await page.evaluate(() => ({
      inhalt: document.documentElement.scrollWidth,
      fenster: window.innerWidth,
    }));
    return { horizontalesScrollen: breiten.inhalt > breiten.fenster + 2, ...breiten };
  } finally {
    await page.close();
  }
}

async function scanneSeite(ctx, handy, seite, ordner, zusatzKlicks) {
  const page = await ctx.newPage();
  const ergebnis = { name: seite.name, url: seite.url };
  try {
    await page.goto(seite.url, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(1500);
    ergebnis.geschlosseneDialoge = await schliesseOverlays(page, zusatzKlicks);
    Object.assign(ergebnis, axeErgebnis(await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()));
    // Frisch laden, damit der Tab-Test oben auf der Seite beginnt und nicht bei einem geschlossenen Dialog.
    await page.reload({ waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(1500);
    ergebnis.tastatur = await pruefeTastatur(page);
    const datei = `${slug(seite.name)}.png`;
    await page.screenshot({ path: path.join(ordner, datei) });
    ergebnis.screenshot = datei;
    ergebnis.reflow = await pruefeReflow(handy, seite.url);
  } catch (err) {
    ergebnis.fehler = String(err.message || err).split('\n')[0];
  } finally {
    await page.close();
  }
  return ergebnis;
}

// Erster Aufruf mit Cookie-Banner/Dialogen: Diese sind Teil des Shops und werden separat geprüft.
async function scanneEinstieg(ctx, handy, url, ordner, zusatzKlicks) {
  const page = await ctx.newPage();
  const ergebnis = { name: 'Erster Aufruf (Cookie-Banner, Dialoge)', url, nurAxe: true };
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(2500);
    Object.assign(ergebnis, axeErgebnis(await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()));
    await page.screenshot({ path: path.join(ordner, 'erster-aufruf.png') });
    ergebnis.screenshot = 'erster-aufruf.png';
    ergebnis.geschlosseneDialoge = await schliesseOverlays(page, zusatzKlicks);
    // Zustimmung auch für die Handy-Ansicht übernehmen.
    await handy.addCookies(await ctx.cookies());
  } catch (err) {
    ergebnis.fehler = String(err.message || err).split('\n')[0];
  } finally {
    await page.close();
  }
  return ergebnis;
}

const konfig = ladeKonfig(process.argv.slice(2));
const datum = new Date().toISOString().slice(0, 10);
const ordner = path.join('ergebnisse', `${slug(konfig.kunde)}-${datum}`);
fs.mkdirSync(ordner, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'de-DE', viewport: { width: 1366, height: 900 } });
const handy = await browser.newContext({ locale: 'de-DE', viewport: { width: 320, height: 800 } });
const zusatzKlicks = konfig.klicken ?? [];
console.log(`Erster Aufruf: ${konfig.seiten[0].url}`);
const seiten = [await scanneEinstieg(ctx, handy, konfig.seiten[0].url, ordner, zusatzKlicks)];
for (const seite of konfig.seiten) {
  console.log(`Scanne ${seite.name}: ${seite.url}`);
  seiten.push(await scanneSeite(ctx, handy, seite, ordner, zusatzKlicks));
}
await browser.close();

// Beim ersten Aufruf nur behalten, was nicht auch auf der Startseite ohne Dialoge auftritt.
const [einstieg, start] = seiten;
if (einstieg.verstoesse && start.verstoesse) {
  const bekannt = new Set(start.verstoesse.flatMap((v) => v.beispiele.map((b) => `${v.regel} ${b.selektor}`)));
  einstieg.verstoesse = einstieg.verstoesse
    .map((v) => {
      const neu = v.beispiele.filter((b) => !bekannt.has(`${v.regel} ${b.selektor}`));
      return { ...v, beispiele: neu, anzahl: Math.round((v.anzahl * neu.length) / Math.max(v.beispiele.length, 1)) };
    })
    .filter((v) => v.beispiele.length > 0);
}

const scan = { kunde: konfig.kunde, datum, werkzeug: 'axe-core 4.11 + eigene Tastatur-/Reflow-Prüfung', seiten };
fs.writeFileSync(path.join(ordner, 'scan.json'), JSON.stringify(scan, null, 2));
console.log(`Fertig: ${path.join(ordner, 'scan.json')}`);
