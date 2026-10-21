// Manuelle Prüfpunkte, die kein automatischer Scan abdeckt.
// Ergebnisse trägt der Prüfer in ergebnisse/<ordner>/manuell.json ein (Vorlage: vorlagen/manuell.json).
export const CHECKLISTE = [
  { id: 'M01', bereich: 'Gesamter Shop', wcag: '2.1.1', pruefung: 'Der komplette Kauf ist nur mit der Tastatur möglich (Tab, Shift+Tab, Enter, Leertaste, Pfeiltasten).', wie: 'Maus weglegen; von der Startseite bis zur Bestellübersicht durchklicken.' },
  { id: 'M02', bereich: 'Gesamter Shop', wcag: '2.4.7', pruefung: 'Der Tastaturfokus ist an jeder Stelle deutlich sichtbar.', wie: 'Beim Durchtabben auf Rahmen/Hervorhebung achten, besonders in Menüs und im Checkout.' },
  { id: 'M03', bereich: 'Gesamter Shop', wcag: '2.1.2', pruefung: 'Keine Tastaturfalle: Cookie-Banner, Pop-ups und Menüs lassen sich per Tastatur schließen (Esc).', wie: 'Cookie-Banner, Newsletter-Pop-up, Mega-Menü und Warenkorb-Flyout öffnen und wieder verlassen.' },
  { id: 'M04', bereich: 'Gesamter Shop', wcag: '2.4.1', pruefung: 'Es gibt einen „Zum Inhalt springen“-Link oder eine saubere Landmark-Struktur.', wie: 'Erste Tab-Taste auf der Startseite drücken.' },
  { id: 'M05', bereich: 'Gesamter Shop', wcag: '1.4.4 / 1.4.10', pruefung: 'Bei 200 % Zoom und auf 320 px Breite geht kein Inhalt verloren.', wie: 'Browser-Zoom auf 200 % stellen bzw. Handyansicht prüfen.' },
  { id: 'M06', bereich: 'Produktliste', wcag: '4.1.3', pruefung: 'Filter und Sortierung melden Änderungen (z. B. „24 Produkte gefunden“).', wie: 'Mit NVDA (Windows) oder VoiceOver (Mac) einen Filter setzen und auf die Ansage achten.' },
  { id: 'M07', bereich: 'Produktseite', wcag: '1.1.1', pruefung: 'Alt-Texte der Produktbilder beschreiben das Produkt sinnvoll (nicht nur Dateiname oder „Bild“).', wie: 'Stichprobe von 10 Produkten; alt-Texte mit Screenreader oder Entwicklertools prüfen.' },
  { id: 'M08', bereich: 'Produktseite', wcag: '1.4.1', pruefung: 'Varianten (Farbe, Größe) sind nicht nur über Farbe unterscheidbar und haben Namen.', wie: 'Farbauswahl mit Screenreader ansteuern.' },
  { id: 'M09', bereich: 'Produktseite', wcag: '4.1.3', pruefung: '„In den Warenkorb“ meldet den Erfolg auch für Screenreader.', wie: 'Produkt mit Screenreader in den Warenkorb legen.' },
  { id: 'M10', bereich: 'Warenkorb', wcag: '3.3.2', pruefung: 'Mengenfelder und Entfernen-Buttons sind eindeutig beschriftet.', wie: 'Mit Screenreader Menge ändern und Artikel entfernen.' },
  { id: 'M11', bereich: 'Checkout', wcag: '3.3.1 / 3.3.3', pruefung: 'Fehlermeldungen im Formular sind als Text sichtbar, dem Feld zugeordnet und nennen die Lösung.', wie: 'Formular leer absenden, ungültige PLZ und E-Mail eingeben.' },
  { id: 'M12', bereich: 'Checkout', wcag: '3.3.2', pruefung: 'Pflichtfelder sind nicht nur durch Farbe oder * gekennzeichnet.', wie: 'Beschriftungen der Pflichtfelder prüfen.' },
  { id: 'M13', bereich: 'Checkout', wcag: '2.2.1', pruefung: 'Keine Zeitbegrenzung ohne Warnung oder Verlängerung (z. B. Sitzungsablauf).', wie: 'Checkout 15 Minuten offen lassen und weitermachen.' },
  { id: 'M14', bereich: 'Zahlung', wcag: '4.1.2', pruefung: 'Zahlungsarten und eingebettete Zahlungsformulare (PayPal, Kreditkarte) sind per Tastatur bedienbar und beschriftet.', wie: 'Bis zur Zahlungsauswahl tabben; Kreditkartenfelder ausfüllen (ohne abzuschließen).' },
  { id: 'M15', bereich: 'Rechtliches', wcag: 'BFSG Anlage 3', pruefung: 'Eine Barrierefreiheitserklärung (Informationen zur Dienstleistung) ist leicht auffindbar, z. B. im Footer.', wie: 'Footer und Impressum durchsuchen.' },
  { id: 'M16', bereich: 'Gesamter Shop', wcag: '1.2.2', pruefung: 'Videos haben Untertitel, Autoplay-Medien lassen sich stoppen.', wie: 'Produkt- und Startseitenvideos prüfen.' },
];
