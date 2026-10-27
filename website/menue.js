// Burger-Menü für schmale Bildschirme, Tageszähler seit Inkrafttreten des BFSG und Paketauswahl.
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

  // Paketauswahl: Klick auf ein Paket setzt den Rahmen und übernimmt das Paket in die Kontakt-E-Mail.
  var raster = document.querySelector('#pakete .raster');
  var mail = document.querySelector('[data-kontakt-mail]');
  var hinweis = document.querySelector('[data-paket-hinweis]');
  if (raster && mail) {
    var pakete = raster.querySelectorAll('[data-paket]');
    var mailBasis = mail.getAttribute('href');
    raster.classList.add('waehlbar');

    var waehle = function (karte) {
      var name = karte.getAttribute('data-paket');
      pakete.forEach(function (k) {
        var an = k === karte;
        k.classList.toggle('gewaehlt', an);
        var knopf = k.querySelector('.knopf');
        if (knopf) {
          knopf.classList.toggle('knopf-sonne', an);
          knopf.classList.toggle('knopf-neben', !an);
        }
      });
      mail.setAttribute('href', mailBasis.replace(/subject=[^&]*/, 'subject=' + encodeURIComponent('Anfrage ' + name)));
      if (hinweis) {
        hinweis.textContent = 'Ihre Auswahl: ' + name + '. Wir nehmen das Paket in den Betreff Ihrer E-Mail auf.';
        hinweis.hidden = false;
      }
    };

    pakete.forEach(function (karte) {
      karte.addEventListener('click', function () { waehle(karte); });
    });
  }
})();
