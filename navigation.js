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
  document.querySelectorAll('.nav a[href]').forEach(function (link) {
    var url = new URL(link.href, location.href);
    if (url.pathname === location.pathname && !url.hash) link.setAttribute('aria-current', 'page');
  });
  document.querySelectorAll('form.enquiry[data-form-type="quote"]').forEach(function (form) {
    var materialNames = ['material', 'supply_format', 'quantity', 'quantity_unit', 'postcode', 'vehicle'];
    var steps = [document.createElement('fieldset'), document.createElement('fieldset')];
    steps.forEach(function (step, i) {
      step.className = 'quote-step';
      var legend = document.createElement('legend');
      legend.textContent = i ? 'Your contact and project details' : 'Your material and delivery';
      step.appendChild(legend);
      form.insertBefore(step, form.querySelector('label'));
    });
    Array.from(form.querySelectorAll(':scope > label')).forEach(function (label) {
      var input = label.querySelector('[name]');
      steps[materialNames.includes(input.name) ? 0 : 1].appendChild(label);
    });
    var progress = document.createElement('p');
    progress.className = 'form-progress full'; progress.setAttribute('role', 'status');
    form.prepend(progress);
    var next = document.createElement('button'); next.type = 'button'; next.className = 'button full'; next.textContent = 'Continue to contact details';
    steps[0].appendChild(next);
    var back = document.createElement('button'); back.type = 'button'; back.className = 'form-back'; back.textContent = 'Back to material details';
    steps[1].insertBefore(back, steps[1].children[1]);
    var documentHelp = form.querySelector('.document-help');
    if (documentHelp) steps[1].appendChild(documentHelp);
    var submit = form.querySelector('[type="submit"]');
    var stepIndex = 0;
    function show(index, focus) {
      stepIndex = index;
      steps.forEach(function (step, i) { step.hidden = i !== index; });
      submit.hidden = index === 0;
      progress.textContent = 'Step ' + (index + 1) + ' of 2';
      if (focus) steps[index].querySelector('input,select,textarea').focus();
    }
    function advance() {
      var invalid = Array.from(steps[0].querySelectorAll('input,select,textarea')).find(function (input) { return !input.checkValidity(); });
      if (invalid) { invalid.reportValidity(); return; }
      show(1, true);
    }
    next.addEventListener('click', advance);
    back.addEventListener('click', function () { show(0, true); });
    form.addEventListener('submit', function (event) {
      if (stepIndex === 0) { event.preventDefault(); event.stopImmediatePropagation(); advance(); }
    }, true);
    form.addEventListener('invalid', function (event) {
      var index = steps.findIndex(function (step) { return step.contains(event.target); });
      if (index >= 0) show(index, false);
    }, true);
    form.addEventListener('reset', function () { show(0, false); });
    var format = form.querySelector('[name="supply_format"]');
    var vehicle = form.querySelector('[name="vehicle"]');
    var unit = form.querySelector('[name="quantity_unit"]');
    function filterMethods() {
      Array.from(vehicle.options).forEach(function (option) {
        var bag = /Bulk bags/.test(option.value), loose = /tipper|Grab delivery/.test(option.value);
        option.hidden = option.disabled = (format.value === 'Loose' && bag) || (format.value === 'Bagged' && loose);
      });
      if (vehicle.selectedOptions[0].disabled) vehicle.value = '';
      Array.from(unit.options).forEach(function (option) {
        option.hidden = option.disabled = format.value === 'Loose' && option.value === 'Bulk bags';
      });
      if (format.value === 'Bagged') unit.value = 'Bulk bags';
      else if (format.value === 'Loose' && unit.value === 'Bulk bags') unit.value = 'Tonnes';
    }
    format.addEventListener('change', filterMethods);
    form.addEventListener('reset', function () { setTimeout(filterMethods, 0); });
    show(0, false);
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
