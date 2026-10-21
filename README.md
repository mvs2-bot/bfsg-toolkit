# BFSG-Toolkit

Werkzeuge für den BFSG-Check von Onlineshops: automatischer Scan nach WCAG 2.1 AA, manuelle Prüf-Checkliste und ein Kundenbericht als HTML und PDF.

## Einrichtung (einmalig)

Voraussetzung: [Node.js](https://nodejs.org) ab Version 20.

```bash
npm install
npx playwright install chromium
```

## Ablauf pro Shop

1. **Konfig anlegen:** `vorlagen/shop-konfig.json` kopieren (z. B. nach `kunden/<shop>.json`) und die Seiten des Kaufprozesses eintragen: Startseite, Kategorie, Produkt, Suche, Warenkorb, Kontakt. Checkout-Seiten brauchen meist einen gefüllten Warenkorb und werden manuell geprüft.
2. **Scannen:** `node src/scan.mjs kunden/<shop>.json`
   Ergebnis landet in `ergebnisse/<shop>-<datum>/` (scan.json + Screenshots).
   Für einen Schnelltest ohne Konfig: `node src/scan.mjs https://www.shop.de/`
3. **Manuell prüfen:** `vorlagen/manuell.json` in den Ergebnisordner kopieren und die Punkte aus [CHECKLISTE.md](CHECKLISTE.md) abarbeiten (`ok`, `mangel`, `offen`, `na`).
4. **Bericht erzeugen:** `node src/report.mjs ergebnisse/<shop>-<datum>`
   Erzeugt `bericht.html` und `bericht.pdf` für den Kunden.

## Was automatisch geprüft wird

- Alle axe-core-Regeln für WCAG 2.0/2.1 A und AA (Alt-Texte, Kontraste, Beschriftungen, ARIA, Sprache, Titel usw.)
- Tastatur: bis zu 40 Tab-Schritte, ob der Fokus sichtbar ist (WCAG 2.4.7)
- Reflow: kein seitliches Scrollen bei 320 px Breite (WCAG 1.4.10)

Automatische Tests finden nur einen Teil der Barrieren. Die manuelle Checkliste ist deshalb Pflicht, bevor ein Bericht an Kunden geht.

## Test

`npm test` scannt einen absichtlich fehlerhaften Demo-Shop (`test/demo-shop/`) und erzeugt einen Beispielbericht.

## Regeln

- Keine Kundendaten, Zugangsdaten oder Ergebnisordner ins Repository (`ergebnisse/` ist in `.gitignore`).
- Der Bericht ist eine technische Prüfung, keine Rechtsberatung.
- Deutsche Texte zu den Befunden pflegen wir in `src/regeln-de.mjs`.
