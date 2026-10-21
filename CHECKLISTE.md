# Manuelle Prüf-Checkliste (WCAG 2.1 AA)

Ergebnis je Punkt in `ergebnisse/<ordner>/manuell.json` eintragen: `ok`, `mangel`, `offen` oder `na`, bei Mängeln eine kurze Notiz.

Werkzeuge: Tastatur, NVDA (Windows, kostenlos) oder VoiceOver (Mac), Browser-Zoom.

| Nr. | Bereich | Prüfpunkt | So prüfst du | WCAG |
| --- | --- | --- | --- | --- |
| M01 | Gesamter Shop | Der komplette Kauf ist nur mit der Tastatur möglich (Tab, Shift+Tab, Enter, Leertaste, Pfeiltasten). | Maus weglegen; von der Startseite bis zur Bestellübersicht durchklicken. | 2.1.1 |
| M02 | Gesamter Shop | Der Tastaturfokus ist an jeder Stelle deutlich sichtbar. | Beim Durchtabben auf Rahmen/Hervorhebung achten, besonders in Menüs und im Checkout. | 2.4.7 |
| M03 | Gesamter Shop | Keine Tastaturfalle: Cookie-Banner, Pop-ups und Menüs lassen sich per Tastatur schließen (Esc). | Cookie-Banner, Newsletter-Pop-up, Mega-Menü und Warenkorb-Flyout öffnen und wieder verlassen. | 2.1.2 |
| M04 | Gesamter Shop | Es gibt einen „Zum Inhalt springen“-Link oder eine saubere Landmark-Struktur. | Erste Tab-Taste auf der Startseite drücken. | 2.4.1 |
| M05 | Gesamter Shop | Bei 200 % Zoom und auf 320 px Breite geht kein Inhalt verloren. | Browser-Zoom auf 200 % stellen bzw. Handyansicht prüfen. | 1.4.4 / 1.4.10 |
| M06 | Produktliste | Filter und Sortierung melden Änderungen (z. B. „24 Produkte gefunden“). | Mit NVDA (Windows) oder VoiceOver (Mac) einen Filter setzen und auf die Ansage achten. | 4.1.3 |
| M07 | Produktseite | Alt-Texte der Produktbilder beschreiben das Produkt sinnvoll (nicht nur Dateiname oder „Bild“). | Stichprobe von 10 Produkten; alt-Texte mit Screenreader oder Entwicklertools prüfen. | 1.1.1 |
| M08 | Produktseite | Varianten (Farbe, Größe) sind nicht nur über Farbe unterscheidbar und haben Namen. | Farbauswahl mit Screenreader ansteuern. | 1.4.1 |
| M09 | Produktseite | „In den Warenkorb“ meldet den Erfolg auch für Screenreader. | Produkt mit Screenreader in den Warenkorb legen. | 4.1.3 |
| M10 | Warenkorb | Mengenfelder und Entfernen-Buttons sind eindeutig beschriftet. | Mit Screenreader Menge ändern und Artikel entfernen. | 3.3.2 |
| M11 | Checkout | Fehlermeldungen im Formular sind als Text sichtbar, dem Feld zugeordnet und nennen die Lösung. | Formular leer absenden, ungültige PLZ und E-Mail eingeben. | 3.3.1 / 3.3.3 |
| M12 | Checkout | Pflichtfelder sind nicht nur durch Farbe oder * gekennzeichnet. | Beschriftungen der Pflichtfelder prüfen. | 3.3.2 |
| M13 | Checkout | Keine Zeitbegrenzung ohne Warnung oder Verlängerung (z. B. Sitzungsablauf). | Checkout 15 Minuten offen lassen und weitermachen. | 2.2.1 |
| M14 | Zahlung | Zahlungsarten und eingebettete Zahlungsformulare (PayPal, Kreditkarte) sind per Tastatur bedienbar und beschriftet. | Bis zur Zahlungsauswahl tabben; Kreditkartenfelder ausfüllen (ohne abzuschließen). | 4.1.2 |
| M15 | Rechtliches | Eine Barrierefreiheitserklärung (Informationen zur Dienstleistung) ist leicht auffindbar, z. B. im Footer. | Footer und Impressum durchsuchen. | BFSG Anlage 3 |
| M16 | Gesamter Shop | Videos haben Untertitel, Autoplay-Medien lassen sich stoppen. | Produkt- und Startseitenvideos prüfen. | 1.2.2 |
