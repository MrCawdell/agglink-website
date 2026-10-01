(function () {
  var dialog = document.getElementById('quote-dialog');
  if (dialog) {
    document.querySelectorAll('a[href="#quote"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        if (!dialog.open) dialog.showModal();
      });
    });
    var close = dialog.querySelector('.dialog-close');
    close.addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close();
    });
  }
  var menu = document.querySelector('.mobile-menu');
  if (menu) {
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { menu.open = false; });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.open) {
        menu.open = false;
        menu.querySelector('summary').focus();
      }
    });
    document.addEventListener('click', function (event) {
      if (menu.open && !menu.contains(event.target)) menu.open = false;
    });
  }
  var video = document.getElementById('hero-video');
  if (video) {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    function updateVideo() {
      if (reduced.matches || document.hidden) video.pause();
      else video.play().catch(function () {});
    }
    updateVideo();
    document.addEventListener('visibilitychange', updateVideo);
    reduced.addEventListener('change', updateVideo);
  }
})();
