// Deutsche Erklärungen für die häufigsten axe-Regeln in Onlineshops.
// titel = verständlicher Befund, wirkung = wen es betrifft, fix = was zu tun ist, wcag = Erfolgskriterium
export const REGELN = {
  'image-alt': {
    titel: 'Bilder ohne Alternativtext',
    wirkung: 'Blinde Menschen erfahren mit dem Screenreader nicht, was ein Produktbild zeigt.',
    fix: 'Jedem inhaltlichen Bild ein aussagekräftiges alt-Attribut geben; rein dekorative Bilder mit alt="" markieren.',
    wcag: '1.1.1',
  },
  'input-image-alt': {
    titel: 'Bild-Schaltflächen ohne Alternativtext',
    wirkung: 'Screenreader können nicht sagen, was die Schaltfläche tut.',
    fix: 'Ein alt-Attribut mit der Funktion ergänzen, z. B. alt="Suchen".',
    wcag: '1.1.1',
  },
  'role-img-alt': {
    titel: 'Grafiken (role="img") ohne Textalternative',
    wirkung: 'Icons und Grafiken bleiben für Screenreader stumm.',
    fix: 'aria-label oder aria-labelledby ergänzen.',
    wcag: '1.1.1',
  },
  'svg-img-alt': {
    titel: 'SVG-Grafiken ohne Textalternative',
    wirkung: 'Icons (z. B. Warenkorb, Suche) sind für Screenreader nicht verständlich.',
    fix: '<title> im SVG oder aria-label ergänzen; dekorative SVGs mit aria-hidden="true" ausblenden.',
    wcag: '1.1.1',
  },
  'color-contrast': {
    titel: 'Zu geringer Farbkontrast',
    wirkung: 'Menschen mit Sehschwäche und alle bei Sonnenlicht können Texte schlecht lesen.',
    fix: 'Kontrast auf mindestens 4,5:1 (große Schrift 3:1) anheben, meist durch dunklere Textfarbe.',
    wcag: '1.4.3',
  },
  'link-name': {
    titel: 'Links ohne erkennbaren Namen',
    wirkung: 'Screenreader lesen nur „Link“ vor; das Ziel ist unklar (oft Icon-Links zu Social Media oder Warenkorb).',
    fix: 'Sichtbaren Text oder aria-label ergänzen, z. B. aria-label="Warenkorb".',
    wcag: '2.4.4 / 4.1.2',
  },
  'button-name': {
    titel: 'Schaltflächen ohne erkennbaren Namen',
    wirkung: 'Screenreader können die Funktion nicht nennen, z. B. bei „In den Warenkorb“ als reines Icon.',
    fix: 'Sichtbaren Text oder aria-label ergänzen.',
    wcag: '4.1.2',
  },
  label: {
    titel: 'Formularfelder ohne Beschriftung',
    wirkung: 'Im Checkout weiß ein Screenreader-Nutzer nicht, was in das Feld gehört.',
    fix: 'Jedem Feld ein <label for="…"> zuordnen; Platzhaltertext allein reicht nicht.',
    wcag: '1.3.1 / 4.1.2',
  },
  'select-name': {
    titel: 'Auswahllisten ohne Beschriftung',
    wirkung: 'Größen- oder Variantenauswahl ist für Screenreader unklar.',
    fix: 'Ein <label> oder aria-label ergänzen.',
    wcag: '4.1.2',
  },
  'autocomplete-valid': {
    titel: 'Ungültige autocomplete-Angaben',
    wirkung: 'Browser können Adressdaten im Checkout nicht automatisch ausfüllen; das erschwert die Eingabe für viele.',
    fix: 'Gültige Werte wie autocomplete="given-name", "postal-code", "email" verwenden.',
    wcag: '1.3.5',
  },
  'html-has-lang': {
    titel: 'Sprache der Seite nicht angegeben',
    wirkung: 'Screenreader lesen deutschen Text mit falscher Aussprache vor.',
    fix: '<html lang="de"> setzen.',
    wcag: '3.1.1',
  },
  'html-lang-valid': {
    titel: 'Ungültige Sprachangabe',
    wirkung: 'Screenreader wählen die falsche Sprache.',
    fix: 'Gültigen Sprachcode wie lang="de" verwenden.',
    wcag: '3.1.1',
  },
  'document-title': {
    titel: 'Seitentitel fehlt',
    wirkung: 'Nutzer erkennen in Tabs und Screenreadern nicht, auf welcher Seite sie sind.',
    fix: 'Einen eindeutigen <title> je Seite setzen.',
    wcag: '2.4.2',
  },
  'heading-order': {
    titel: 'Überschriften-Reihenfolge springt',
    wirkung: 'Screenreader-Nutzer navigieren über Überschriften; Sprünge (H1 → H4) verwirren.',
    fix: 'Überschriften logisch staffeln (H1, H2, H3) statt nach Optik auszuwählen.',
    wcag: '1.3.1',
  },
  list: {
    titel: 'Fehlerhafte Listenstruktur',
    wirkung: 'Screenreader können Anzahl und Zusammenhang der Einträge nicht ansagen.',
    fix: '<ul>/<ol> dürfen direkt nur <li> enthalten.',
    wcag: '1.3.1',
  },
  listitem: {
    titel: 'Listeneinträge außerhalb einer Liste',
    wirkung: 'Menüstrukturen werden falsch vorgelesen.',
    fix: '<li> immer in <ul> oder <ol> einbetten.',
    wcag: '1.3.1',
  },
  'aria-allowed-attr': {
    titel: 'Unzulässige ARIA-Attribute',
    wirkung: 'Hilfstechnologien erhalten widersprüchliche Informationen.',
    fix: 'Nur die für die jeweilige Rolle erlaubten ARIA-Attribute verwenden.',
    wcag: '4.1.2',
  },
  'aria-required-attr': {
    titel: 'Pflicht-ARIA-Attribute fehlen',
    wirkung: 'Bedienelemente wie Schieberegler oder Aufklapper melden ihren Zustand nicht.',
    fix: 'Fehlende Attribute ergänzen, z. B. aria-expanded oder aria-valuenow.',
    wcag: '4.1.2',
  },
  'aria-hidden-focus': {
    titel: 'Fokussierbare Elemente in ausgeblendeten Bereichen',
    wirkung: 'Tastaturnutzer landen auf Elementen, die der Screenreader verschweigt.',
    fix: 'Elemente in aria-hidden-Bereichen mit tabindex="-1" oder inert aus der Tab-Reihenfolge nehmen.',
    wcag: '4.1.2',
  },
  'duplicate-id-aria': {
    titel: 'Doppelte IDs bei verknüpften Elementen',
    wirkung: 'Beschriftungen werden dem falschen Feld zugeordnet.',
    fix: 'IDs eindeutig vergeben.',
    wcag: '4.1.2',
  },
  'frame-title': {
    titel: 'Eingebettete Frames ohne Titel',
    wirkung: 'Zahlungs- oder Video-Frames sind für Screenreader namenlos.',
    fix: 'title-Attribut am <iframe> ergänzen, z. B. title="Kreditkartenzahlung".',
    wcag: '4.1.2',
  },
  'meta-viewport': {
    titel: 'Zoomen ist gesperrt',
    wirkung: 'Menschen mit Sehschwäche können auf dem Handy nicht vergrößern.',
    fix: 'user-scalable=no und maximum-scale=1 aus dem viewport-Meta-Tag entfernen.',
    wcag: '1.4.4',
  },
  'nested-interactive': {
    titel: 'Verschachtelte Bedienelemente',
    wirkung: 'Ein Link in einem Button o. Ä. ist per Tastatur und Screenreader nicht sauber bedienbar.',
    fix: 'Bedienelemente nicht ineinander verschachteln.',
    wcag: '4.1.2',
  },
  'scrollable-region-focusable': {
    titel: 'Scrollbereiche nicht per Tastatur erreichbar',
    wirkung: 'Tastaturnutzer können z. B. Produktkarussells nicht durchblättern.',
    fix: 'Dem Bereich tabindex="0" und eine Beschriftung geben.',
    wcag: '2.1.1',
  },
  'link-in-text-block': {
    titel: 'Links nur durch Farbe erkennbar',
    wirkung: 'Farbenblinde Menschen erkennen Links im Fließtext nicht.',
    fix: 'Links zusätzlich unterstreichen.',
    wcag: '1.4.1',
  },
};

export const PRIORITAET = {
  critical: { stufe: 'Hoch', rang: 0 },
  serious: { stufe: 'Hoch', rang: 1 },
  moderate: { stufe: 'Mittel', rang: 2 },
  minor: { stufe: 'Niedrig', rang: 3 },
};
