/* AggLink tracking. Website leads are imported from GA4 into Ads account
   848-056-7784 (conversion 7811114045). Do not also fire a native Ads lead. */
var AGG_CFG = {
  GA4_ID: 'G-BW6SJEDNEM'
};
(function () {
  var ready = AGG_CFG.GA4_ID.indexOf('XXXX') === -1;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  // Consent Mode v2: everything denied until the visitor chooses.
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', true);
  var saved = null;
  try { saved = localStorage.getItem('agg_consent'); } catch (e) {}
  if (saved === 'granted') grant();
  function grant() {
    gtag('consent', 'update', {
      ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted'
    });
  }
  if (ready) {
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + AGG_CFG.GA4_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', AGG_CFG.GA4_ID);
  }
  // Called by forms after a successful send.
  window.agglinkTrackLead = function (form) {
    var stage = form.querySelector('[name="enquiry_stage"]');
    gtag('event', 'generate_lead', {
      form_id: form.id || 'form',
      form_type: form.dataset.formType || 'quote',
      product: form.dataset.product || 'General enquiry',
      enquiry_stage: stage ? stage.value : '',
      page_path: location.pathname
    });
  };
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"],a[href^="mailto:"]');
    if (!a) return;
    if (a.getAttribute('href').indexOf('tel:') === 0) { gtag('event', 'phone_click', { page_path: location.pathname }); }
    else gtag('event', 'email_click', { page_path: location.pathname });
  });
  // Cookie banner (equal-weight accept / reject, as ICO expects).
  function banner(force) {
    if ((saved && !force) || document.querySelector('.cookie-bar')) return;
    var b = document.createElement('div');
    b.className = 'cookie-bar'; b.setAttribute('role', 'region'); b.setAttribute('aria-label', 'Cookie choice');
    b.innerHTML = '<p>We use cookies to measure enquiries from our adverts. <a href="/privacy/">Privacy and cookies</a></p>' +
      '<div><button type="button" data-c="denied">Reject</button><button type="button" data-c="granted">Accept</button></div>';
    var st = document.createElement('style');
    st.textContent = '.cookie-bar{position:fixed;left:16px;right:16px;bottom:16px;z-index:50;max-width:620px;margin:auto;background:#202522;color:#f4f1eb;padding:16px 18px;display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap;font:400 14px/1.5 Poppins,Arial,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.25)}.cookie-bar p{margin:0;flex:1 1 260px}.cookie-bar a{text-decoration:underline}.cookie-bar div{display:flex;gap:8px}.cookie-bar button{font:700 13px Poppins,Arial,sans-serif;padding:10px 18px;border:2px solid #f4f1eb;background:transparent;color:#f4f1eb;cursor:pointer}.cookie-bar button:hover{background:#b65d34;border-color:#b65d34}';
    document.head.appendChild(st);
    b.addEventListener('click', function (e) {
      var c = e.target.getAttribute && e.target.getAttribute('data-c');
      if (!c) return;
      try { localStorage.setItem('agg_consent', c); } catch (err) {}
      saved = c;
      if (c === 'granted') grant();
      else gtag('consent', 'update', {
        ad_storage: 'denied', ad_user_data: 'denied',
        ad_personalization: 'denied', analytics_storage: 'denied'
      });
      b.remove();
    });
    document.body.appendChild(b);
  }
  document.addEventListener('click', function (event) {
    if (event.target.closest && event.target.closest('[data-cookie-settings]')) banner(true);
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { banner(false); }); else banner(false);
})();
