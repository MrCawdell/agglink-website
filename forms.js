document.querySelectorAll('form.enquiry').forEach(function (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var status = form.querySelector('.status'), btn = form.querySelector('[type=submit]'), orig = btn.textContent;
    status.className = 'status'; status.textContent = '';
    if (!form.checkValidity()) { form.reportValidity(); return; }
    btn.disabled = true; btn.textContent = 'Sending…';
    var data = new FormData(form);
    data.set('_subject', form.dataset.subject + ' – ' + (data.get('material') || '') + ' – ' + location.pathname);
    data.set('_template', 'table'); data.set('_captcha', 'false'); data.set('page', location.href);
    try {
      var r = await fetch('https://formsubmit.co/ajax/hello@tipperlink.com', { method: 'POST', headers: { Accept: 'application/json' }, body: data });
      if (!r.ok) throw new Error('fail');
      status.textContent = 'Thank you. Your request has been sent to the AggLink team.'; status.classList.add('success');
      if (window.agglinkTrackLead) agglinkTrackLead(form);
      form.reset();
    } catch (err) {
      status.textContent = 'We could not send this form. Please email hello@tipperlink.com or call 01392 321840.'; status.classList.add('error');
    } finally { btn.disabled = false; btn.textContent = orig; }
  });
});
