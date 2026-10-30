/* Site analytics for johnzialcita.com.
   Paste the real IDs here (one place). Leave '' to keep tracking off.
   GA4 property + GTM container belong to John's Google account (yourtrustedmortgagepro@gmail.com). */
window.JZ_ANALYTICS = { GA_ID: '', GTM_ID: '' };
(function(){
  var C = window.JZ_ANALYTICS; window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); } window.gtag = window.gtag || gtag;
  if (C.GTM_ID) {
    dataLayer.push({'gtm.start': Date.now(), event: 'gtm.js'});
    var g = document.createElement('script'); g.async = true; g.src = 'https://www.googletagmanager.com/gtm.js?id=' + C.GTM_ID; document.head.appendChild(g);
  }
  if (C.GA_ID) {
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + C.GA_ID; document.head.appendChild(s);
    gtag('js', new Date()); gtag('config', C.GA_ID);
  }
  function track(name, params){
    params = params || {}; params.page_path = location.pathname;
    if (C.GA_ID) gtag('event', name, params);
    dataLayer.push(Object.assign({event: name}, params));
    if (window.va) window.va('event', {name: name, data: params});
  }
  window.jzTrack = track;
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    var h = a.getAttribute('href') || '', label = (a.textContent || '').trim().slice(0, 60);
    if (h.indexOf('tel:') === 0) track('click_to_call', {link_text: label});
    else if (h.indexOf('sms:') === 0) track('click_to_text', {link_text: label});
    else if (h.indexOf('mailto:') === 0) track('click_email', {link_text: label});
    else if (/(^|\/)book\.html/.test(h)) track('book_click', {link_text: label});
    else if (a.hostname && a.hostname !== location.hostname) {
      track(/loanfactory\.com$/.test(a.hostname) ? 'rates_outbound_click' : 'outbound_click', {link_url: a.href, link_text: label});
    }
  }, true);
  document.addEventListener('submit', function(e){ track('form_submit', {form_id: e.target.id || e.target.name || ''}); }, true);
  /* Loan Factory rate widget: if it hasn't rendered (it is CORS-blocked off loanfactory.com), show a fallback. */
  window.addEventListener('load', function(){
    setTimeout(function(){
      document.querySelectorAll('.widget-wrap').forEach(function(w){
        var h = 0; Array.prototype.forEach.call(w.children, function(c){ if (!c.classList.contains('fine') && !c.classList.contains('rate-fallback')) h += c.offsetHeight; });
        if (h < 80) { w.classList.add('widget-failed'); track('rates_widget_fallback'); }
      });
    }, 6000);
  });
})();
