var WEB3FORMS_ACCESS_KEY = '482497ee-1e4c-46be-86a9-9f4f64d297d8';

document.querySelectorAll('form.enquiry').forEach(function (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var status = form.querySelector('.status'), btn = form.querySelector('[type=submit]'), orig = btn.textContent;
    if (btn.disabled) return;
    status.className = 'status'; status.textContent = '';
    if (!form.checkValidity()) { form.reportValidity(); return; }
    btn.disabled = true; btn.textContent = 'Sending…';
    var data = new FormData(form);
    data.set('access_key', WEB3FORMS_ACCESS_KEY);
    data.set('subject', form.dataset.subject + ' | ' + (data.get('material') || '') + ' | ' + location.pathname);
    data.set('from_name', 'AggLink website');
    data.set('page', location.href);
    try {
      var r = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { Accept: 'application/json' }, body: data });
      var result = await r.json();
      if (!r.ok || !result.success) throw new Error(result.message || 'Submission failed');
      status.textContent = 'Thank you. Your request has been sent to the AggLink team.'; status.classList.add('success');
      if (window.agglinkTrackLead) agglinkTrackLead(form);
      form.reset();
      status.focus();
    } catch (err) {
      status.textContent = 'We could not send this form. Please email hello@tipperlink.com or call 01392 321840.'; status.classList.add('error');
      status.focus();
    } finally { btn.disabled = false; btn.textContent = orig; }
  });
});
