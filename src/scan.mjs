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

// Läuft per Tab durch die Seite und prüft, ob der Fokus sichtbar ist (WCAG 2.4.7).
async function pruefeTastatur(page) {
  const schritte = [];
  await page.locator('body').click({ position: { x: 1, y: 1 } }).catch(() => {});
  for (let i = 0; i < TAB_SCHRITTE; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      // Markierung erkennt, wann die Tab-Reihenfolge wieder von vorn beginnt.
      if (el.dataset.bfsgTab) return { wiederholt: true };
      el.dataset.bfsgTab = '1';
      const fokus = getComputedStyle(el);
      const sichtbar =
        (fokus.outlineStyle !== 'none' && parseFloat(fokus.outlineWidth) > 0) ||
        fokus.boxShadow !== 'none';
      const name = (el.getAttribute('aria-label') || el.innerText || el.getAttribute('alt') || el.getAttribute('placeholder') || el.value || '')
        .trim().slice(0, 60);
      const selektor = el.id ? `#${el.id}` : el.tagName.toLowerCase() + (el.className && typeof el.className === 'string'
        ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '')
        + (el.getAttribute('href') ? `[href="${el.getAttribute('href').slice(0, 60)}"]` : '');
      return { selektor, name, fokusSichtbar: sichtbar };
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
async function pruefeReflow(browser, url) {
  const ctx = await browser.newContext({ viewport: { width: 320, height: 800 } });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    const breiten = await page.evaluate(() => ({
      inhalt: document.documentElement.scrollWidth,
      fenster: window.innerWidth,
    }));
    return { horizontalesScrollen: breiten.inhalt > breiten.fenster + 2, ...breiten };
  } finally {
    await ctx.close();
  }
}

async function scanneSeite(browser, seite, ordner) {
  const ctx = await browser.newContext({ locale: 'de-DE', viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  const ergebnis = { name: seite.name, url: seite.url };
  try {
    await page.goto(seite.url, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(1500);
    const axe = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    ergebnis.verstoesse = axe.violations.map((v) => ({
      regel: v.id,
      auswirkung: v.impact,
      beschreibung: v.help,
      hilfeUrl: v.helpUrl,
      tags: v.tags,
      anzahl: v.nodes.length,
      beispiele: v.nodes.slice(0, 5).map((n) => ({ selektor: n.target.join(' '), html: n.html.slice(0, 300) })),
    }));
    ergebnis.manuellZuPruefen = axe.incomplete.length;
    ergebnis.bestanden = axe.passes.length;
    ergebnis.tastatur = await pruefeTastatur(page);
    const datei = `${slug(seite.name)}.png`;
    await page.screenshot({ path: path.join(ordner, datei) });
    ergebnis.screenshot = datei;
    ergebnis.reflow = await pruefeReflow(browser, seite.url);
  } catch (err) {
    ergebnis.fehler = String(err.message || err).split('\n')[0];
  } finally {
    await ctx.close();
  }
  return ergebnis;
}

const konfig = ladeKonfig(process.argv.slice(2));
const datum = new Date().toISOString().slice(0, 10);
const ordner = path.join('ergebnisse', `${slug(konfig.kunde)}-${datum}`);
fs.mkdirSync(ordner, { recursive: true });

const browser = await chromium.launch();
const seiten = [];
for (const seite of konfig.seiten) {
  console.log(`Scanne ${seite.name}: ${seite.url}`);
  seiten.push(await scanneSeite(browser, seite, ordner));
}
await browser.close();

const scan = { kunde: konfig.kunde, datum, werkzeug: 'axe-core 4.11 + eigene Tastatur-/Reflow-Prüfung', seiten };
fs.writeFileSync(path.join(ordner, 'scan.json'), JSON.stringify(scan, null, 2));
console.log(`Fertig: ${path.join(ordner, 'scan.json')}`);
