/* Santa Clara EC — js/pwa.js
   Registra o service worker (site funciona offline depois da 1ª visita) e liga o botão "Instalar como app"
   ao aviso nativo de instalação quando o navegador oferece. */
(function () {
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; });
  window.addEventListener('appinstalled', function () { deferred = null; });
  window.addEventListener('load', function () {
    var original = window.exInstallOpen;
    window.exInstallOpen = function () {
      if (deferred) { deferred.prompt(); deferred.userChoice.finally(function () { deferred = null; }); }
      else if (original) original();
    };
  });
})();
