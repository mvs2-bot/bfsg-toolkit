# Design: Prüfzeichnung

Seit 2026-10-28. Die Seite sieht aus wie ein technisches Zeichenblatt: Tusche auf weißem Bogen, Rahmen mit Feldeinteilung, Schriftfeld, nummerierte Figuren. Barrieren werden wie Bauteile mit Nummer und Hinweislinie gekennzeichnet.

## Thema Studio (seit 2026-11-20)

Auf Stefans Wunsch mit dem Hallmark-Thema „Studio“ neu eingefärbt (Restyle, Layout unverändert): kühles Prüfpapier, blauschwarze Tinte, Hedvig Letters Serif für Überschriften, Geist für Text, ein Kadmium-Orange als einziges Signal. Orange füllt den Hauptknopf und zeichnet Konstruktion (Hinweislinien, Markierungen), nie Text.

## Farben (`website/style.css`, `:root`)

| Name | Wert | Rolle |
|---|---|---|
| `--color-paper` | `oklch(97.2% 0.006 215)` | Bogen |
| `--color-paper-2` | `oklch(94% 0.009 215)` | Tisch um den Bogen, Tabellenkopf |
| `--color-paper-hi` | `oklch(99% 0.004 215)` | gedruckte Stücke (Schriftfeld, Mailblock), Nebenknopf |
| `--color-ink` | `oklch(16% 0.032 250)` | Text, Linien |
| `--color-ink-2` | `oklch(34% 0.022 245)` | Nebentext |
| `--color-rule` | `oklch(84% 0.010 225)` | feine Trennlinien |
| `--color-accent` | `oklch(68% 0.172 50)` | Hauptknopf (Tinte auf Orange), Hinweislinien, Markierungen |
| `--color-focus` | `oklch(52% 0.15 48)` | Fokusrahmen |

Die alten Rollennamen (`--tusche`, `--graphit`, `--karmin` …) bleiben als Aliase auf diese Werte.

## Schrift

- Hedvig Letters Serif 400 (eine Strichstärke): Überschriften, Nummern, Paketnamen, Preise
- Geist 400/500: Fließtext, Beschriftungen, Knöpfe
- Selbst gehostet in `website/schrift/`, keine externen Quellen.

## Bausteine

- **Bogen und Rahmen**: `.bogen` > `.rahmen` umschließt jede Seite, Feldziffern 1 bis 6 und A bis E am Rand (ab 700 px ausgeblendet).
- **Blatt**: jeder Abschnitt ist ein `.blatt` mit Linie unten und „Blatt n von 5“ rechts.
- **Fig.**: Zeichnungen als Inline-SVG, Tusche-Linien, Schraffur als Füllung, Hinweislinien in Orange, Nummer in Tinte.
- **Befundliste**: Knöpfe mit `aria-pressed`, heben die Stelle in Fig. 1 hervor.
- **Schriftfeld**: Tabelle mit Rahmen für Fakten zum Prüfauftrag.
- **Stückliste**: Pakete als Tabelle, gewählte Zeile mit 2 px Rahmen und oranger Marke.
- **Knöpfe**: `.knopf` (gefüllt) und `.knopf-leer` (Rahmen), 2 px Radius, innere Haarlinie, gefüllt = Orange, mindestens 44 px hoch.

## Regeln

- Radius höchstens 3 px. Schatten nur für Papier (Bogen, Schriftfeld, Mailblock).
- Passermarken an gedruckten Stücken (Fig. 1, Schriftfeld, Mailblock), Punktraster nur in Kopf, Startblatt und Fuß.
- Nie orange Schrift, nie eine orange Fläche außer dem Hauptknopf.
- Keine Überzeilen über Überschriften.
- Nummern nur, wo sie etwas bedeuten (Befunde, Ablauf, Positionen).
- Eigener Scan (`src/scan.mjs`) muss auf allen Seiten 0 Befunde liefern.
