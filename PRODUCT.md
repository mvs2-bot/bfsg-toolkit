# Product

<!-- impeccable:product-schema 1 -->

> Abgeleitet aus Repo, Webseitentext und Projektnotizen (2026-10-28), nicht per Interview bestätigt. Annahmen sind markiert.

## Platform

web

## Stack

Statische HTML/CSS-Seite ohne Framework in `website/`, ausgeliefert als Cloudflare Worker mit statischen Assets. Keine Cookies, kein Tracking, keine externen Schriften oder Skripte. Schriften liegen selbst gehostet in `website/schrift/`.

## Users

Inhaber und Verantwortliche kleiner bis mittlerer Onlineshops in Deutschland (B2C, ab 10 Beschäftigten oder über 2 Mio. € Umsatz, also vom BFSG erfasst). Typische Systeme: Shopify, Shopware, WooCommerce. Sie haben vom Barrierefreiheitsstärkungsgesetz gehört, sind verunsichert (Abmahnungen, Marktüberwachung) und suchen jemanden, der das konkret und zum Festpreis klärt. Annahme: meist keine Entwickler, oft mit Agentur.

## Product Purpose

bfsg-checkup.de prüft den Kaufprozess eines Onlineshops (Startseite bis Checkout) nach WCAG 2.1 AA: automatischer Scan plus Prüfung von Hand mit Tastatur und Screenreader. Ergebnis ist ein verständlicher PDF-Bericht mit priorisierten Befunden; auf Wunsch die Umsetzung im Theme und eine Erklärung zur Barrierefreiheit. Erfolg: Shopbetreiber fordert den kostenlosen Erst-Befund per E-Mail an.

## Positioning

Echte Prüfung und Behebung im Code statt Overlay-Plugin. Festpreise statt Stundensätze. Bericht in verständlichem Deutsch, jeder Befund mit Problem, Ort, Dringlichkeit und Lösung.

## Operating Context

Erstkontakt per E-Mail (mailto kontakt@bfsg-checkup.de), kostenloser Erst-Befund mit drei Befunden innerhalb von 2 Werktagen. Bericht als PDF. Einzelunternehmer (Stefan, Straubing), Kleinunternehmerregelung.

## Capabilities and Constraints

- Pakete: Quick-Check 390 € einmalig, Fix-Paket ab 1.500 €, Monitoring ab 49 €/Monat.
- Keine Rechtsberatung, nur technische Prüfung; der Hinweis muss sichtbar bleiben.
- Hinweis "Bald verfügbar" (Elemente mit `data-bald`) bleibt bis zur Gewerbeanmeldung.
- Die Seite selbst muss barrierefrei sein: eigener Scan (`src/scan.mjs`) muss 0 Befunde liefern.

## Brand Commitments

Name und Domain bfsg-checkup.de. Logo-Idee Lupe mit Haken. Sprache: Sie-Form, sachlich, ohne Werbesprech.

## Evidence on Hand

Beispielbericht für einen absichtlich fehlerhaften Demo-Shop (`website/beispielbericht.pdf`). Keine Kundenstimmen, keine Referenzkunden, keine Zahlen zu geprüften Shops: nichts davon erfinden.

## Product Principles

1. Zeigen statt behaupten: echte Befunde und Berichtsauszüge sind der Beweis.
2. Klarheit vor Fachjargon: WCAG-Nummern nur als Beleg, nie als Hauptaussage.
3. Festpreis und klarer Umfang nehmen die Angst.
4. Die Seite ist selbst das Musterbeispiel für Barrierefreiheit.

## Accessibility & Inclusion

WCAG 2.1 AA ist Pflicht für die eigene Seite: Kontraste, Tastaturbedienung, Fokus sichtbar, reduzierte Bewegung respektieren, Zoom bis 200 %.
