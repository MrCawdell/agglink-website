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
      var text = (card.textContent + ' ' + (card.dataset.search || '')).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      var match = words.every(function(word) { return text.includes(word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')); });
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

(function () {
  document.querySelectorAll('.nav a[href]:not(.brand)').forEach(function (link) {
    var url = new URL(link.href, location.href);
    if (url.pathname === location.pathname && !url.hash) link.setAttribute('aria-current', 'page');
  });
  if (!document.querySelector('.hero:not(#top)')) return;
  var bar = document.createElement('nav');
  bar.className = 'mobile-enquiry'; bar.setAttribute('aria-label', 'Quick enquiry');
  bar.innerHTML = '<a href="tel:+441392321840">Call AggLink</a><a href="#quote">Get a quote</a>';
  document.body.appendChild(bar);
  var quote = document.querySelector('section#quote');
  var footer = document.querySelector('footer');
  var nearQuote = false, nearFooter = false;
  function update() { bar.hidden = scrollY < 300 || nearQuote || nearFooter || !!document.querySelector('.cookie-bar') || !!document.querySelector('dialog[open]'); }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) { if (entry.target === quote) nearQuote = entry.isIntersecting; if (entry.target === footer) nearFooter = entry.isIntersecting; });
    update();
  });
  if (quote) observer.observe(quote); if (footer) observer.observe(footer);
  window.addEventListener('scroll', update, { passive: true });
  new MutationObserver(update).observe(document.body, { childList: true });
  update();
})();
