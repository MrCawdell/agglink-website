(function () {
  var dialog = document.getElementById('quote-dialog');
  if (dialog) {
    document.querySelectorAll('a[href="#quote"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        if (!dialog.open) dialog.showModal();
      });
    });
    function openQuoteFromHash() { if (location.hash === '#quote' && !dialog.open) dialog.showModal(); }
    openQuoteFromHash();
    window.addEventListener('hashchange', openQuoteFromHash);
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

(function () {
  var search = document.getElementById('material-search');
  if (!search) return;
  var cards = Array.from(document.querySelectorAll('[data-material]'));
  var groups = Array.from(document.querySelectorAll('.material-group'));
  var count = document.getElementById('material-count');
  function filter() {
    var words = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    var total = 0;
    cards.forEach(function(card) {
      var match = words.every(function(word) { return card.textContent.toLowerCase().includes(word); });
      card.hidden = !match;
      if (match) total++;
    });
    groups.forEach(function(group) { group.hidden = !Array.from(group.querySelectorAll('[data-material]')).some(function(card) { return !card.hidden; }); });
    count.textContent = total + (total === 1 ? ' material found' : ' materials found');
    document.getElementById('material-empty').hidden = total > 0;
  }
  search.addEventListener('input', filter);
  document.querySelectorAll('.category-jumps a').forEach(function(link) {
    link.addEventListener('click', function() { search.value = ''; filter(); });
  });
  filter();
})();
