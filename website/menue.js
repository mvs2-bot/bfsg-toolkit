// Burger-Menü für schmale Bildschirme und Tageszähler seit Inkrafttreten des BFSG.
// Ohne Skript bleibt die Navigation einfach sichtbar.
(function () {
  var kopf = document.querySelector('.kopf');
  var knopf = kopf && kopf.querySelector('.burger');
  var menue = kopf && kopf.querySelector('.navi');
  if (knopf && menue) {
    kopf.classList.add('mit-burger');
    knopf.hidden = false;

    var setze = function (offen) {
      kopf.classList.toggle('offen', offen);
      knopf.setAttribute('aria-expanded', String(offen));
    };

    knopf.addEventListener('click', function () {
      setze(knopf.getAttribute('aria-expanded') !== 'true');
    });
    menue.addEventListener('click', function (e) {
      if (e.target.closest('a')) setze(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && kopf.classList.contains('offen')) {
        setze(false);
        knopf.focus();
      }
    });
  }

  var tage = document.querySelector('[data-bfsg-tage]');
  if (tage) {
    var heute = new Date();
    var start = Date.UTC(2025, 5, 28);
    var jetzt = Date.UTC(heute.getFullYear(), heute.getMonth(), heute.getDate());
    var anzahl = Math.floor((jetzt - start) / 86400000);
    if (anzahl > 0) {
      tage.querySelector('strong').textContent = anzahl.toLocaleString('de-DE') + ' Tage';
      tage.querySelector('span').textContent = 'ist das BFSG in Kraft';
    }
  }
})();
