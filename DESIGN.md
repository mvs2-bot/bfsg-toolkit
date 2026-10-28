# Design: Prüfzeichnung

Seit 2026-10-28. Die Seite sieht aus wie ein technisches Zeichenblatt: Tusche auf weißem Bogen, Rahmen mit Feldeinteilung, Schriftfeld, nummerierte Figuren. Barrieren werden wie Bauteile mit Nummer und Hinweislinie gekennzeichnet.

## Farben (`website/style.css`, `:root`)

| Name | Wert | Rolle |
|---|---|---|
| `--tisch` | `#e4e7ec` | Hintergrund um den Bogen |
| `--bogen` | `#ffffff` | Seitenfläche |
| `--tusche` | `#14171d` | Text, Linien, Hauptknöpfe |
| `--graphit` | `#474d57` | Nebentext (8 : 1 auf Weiß) |
| `--linie` | `#8d949e` | Hilfslinien in Zeichnungen, nie für Text |
| `--haar` | `#c9ced5` | feine Trennlinien |
| `--karmin` | `#b0172f` | nur Befunde, Hinweislinien und Fokus |
| `--karmin-hell` | `#fbe9ec` | Hintergrund für gewählten Befund und Vermerke |

Karmin ist für das reserviert, was geprüft wird. Knöpfe sind schwarz oder schwarz umrandet, nie rot.

## Schrift

- Barlow Condensed 500/700: Überschriften, Beschriftungen, Nummern, Knöpfe
- Barlow 400/600: Fließtext
- Selbst gehostet in `website/schrift/`, keine externen Quellen.

## Bausteine

- **Bogen und Rahmen**: `.bogen` > `.rahmen` umschließt jede Seite, Feldziffern 1 bis 6 und A bis E am Rand (ab 700 px ausgeblendet).
- **Blatt**: jeder Abschnitt ist ein `.blatt` mit Linie unten und „Blatt n von 5“ rechts.
- **Fig.**: Zeichnungen als Inline-SVG, Tusche-Linien, Schraffur als Füllung, Hinweislinien in Karmin mit Nummer.
- **Befundliste**: Knöpfe mit `aria-pressed`, heben die Stelle in Fig. 1 hervor.
- **Schriftfeld**: Tabelle mit Rahmen für Fakten zum Prüfauftrag.
- **Stückliste**: Pakete als Tabelle, gewählte Zeile mit 4 px Rahmen.
- **Knöpfe**: `.knopf` (gefüllt) und `.knopf-leer` (Rahmen), eckig, mindestens 44 px hoch.

## Regeln

- Keine Rundungen, keine weichen Schatten außer unter dem Bogen.
- Keine Überzeilen über Überschriften.
- Nummern nur, wo sie etwas bedeuten (Befunde, Ablauf, Positionen).
- Eigener Scan (`src/scan.mjs`) muss auf allen Seiten 0 Befunde liefern.
