# Website bfsg-checkup.de

Statische Landingpage ohne Build-Schritt, ohne Cookies, ohne Tracking und ohne externe Dateien (auch keine Google Fonts).

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite: Problem, Ablauf, Pakete, FAQ, Kontakt |
| `impressum.html`, `datenschutz.html` | Pflichtseiten, Platzhalter sind gelb markiert (`class="platzhalter"`) |
| `barrierefreiheit.html` | Erklärung zur Barrierefreiheit der eigenen Seite |
| `beispielbericht.pdf` | Bericht zum Demo-Shop aus `test/` (keine echten Kundendaten) |

## Lokal ansehen

```bash
python3 -m http.server 8790 -d website
```

## Eigene Seite prüfen

Vor jeder Änderung live mit unserem eigenen Scanner prüfen, Ergebnis muss ohne Befunde sein:

```bash
node src/scan.mjs http://localhost:8790/index.html http://localhost:8790/impressum.html \
  http://localhost:8790/datenschutz.html http://localhost:8790/barrierefreiheit.html
```

## Live schalten (Cloudflare Pages, kostenlos)

1. Konto auf dash.cloudflare.com anlegen.
2. Workers & Pages → Pages → mit GitHub verbinden → Repo `bfsg-toolkit` wählen.
   Framework: keins, Build-Befehl: leer, Ausgabeordner: `website`.
3. Domain `bfsg-checkup.de` in Cloudflare hinzufügen (Free-Plan) und bei INWX die Nameserver auf die beiden von Cloudflare genannten umstellen.
4. Im Pages-Projekt unter „Custom domains“ `bfsg-checkup.de` und `www.bfsg-checkup.de` eintragen.
5. E-Mail: Cloudflare Email Routing aktivieren und `kontakt@bfsg-checkup.de` an das eigene Postfach weiterleiten.

Danach geht jede Änderung auf `main` automatisch live.

## Vor dem Livegang

- Platzhalter in Impressum und Datenschutz ausfüllen.
- Datenschutzerklärung mit einem Generator (z. B. e-recht24) oder anwaltlich gegenprüfen.
