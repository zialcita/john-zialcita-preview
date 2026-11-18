/* Site analytics for johnzialcita.com.
   Paste the real IDs here (one place). Leave '' to keep tracking off.
   GA4 property + GTM container belong to John's Google account (yourtrustedmortgagepro@gmail.com).
   Tracking only runs on the production hostnames (johnzialcita.com, www.johnzialcita.com) over https.
   Localhost, 127.0.0.1, ::1, file:, and *.vercel.app previews send nothing to GA4.
   Add ?jz_debug=1 to any URL to send that session's hits with debug_mode (GA4 DebugView). */
window.JZ_ANALYTICS = { GA_ID: 'G-9M3HLW882J', GTM_ID: '', HOSTS: ['johnzialcita.com', 'www.johnzialcita.com'] };
(function(){
  var C = window.JZ_ANALYTICS; window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); } window.gtag = window.gtag || gtag;
  var LIVE = location.protocol === 'https:' && C.HOSTS.indexOf(location.hostname) !== -1;
  var DEBUG = false;
  try {
    if (/[?&]jz_debug=1(&|$)/.test(location.search)) sessionStorage.setItem('jz_debug', '1');
    DEBUG = sessionStorage.getItem('jz_debug') === '1';
  } catch (e) {}
  if (LIVE && C.GTM_ID) {
    dataLayer.push({'gtm.start': Date.now(), event: 'gtm.js'});
    var g = document.createElement('script'); g.async = true; g.src = 'https://www.googletagmanager.com/gtm.js?id=' + C.GTM_ID; document.head.appendChild(g);
  }
  if (LIVE && C.GA_ID) {
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + C.GA_ID; document.head.appendChild(s);
    gtag('js', new Date());
    /* Default config keeps the full page URL, so utm_* query parameters reach GA4 untouched. */
    gtag('config', C.GA_ID, DEBUG ? {debug_mode: true} : {});
  }
  function track(name, params){
    params = params || {}; params.page_path = location.pathname;
    if (!LIVE) return;
    if (C.GA_ID) gtag('event', name, Object.assign({transport_type: 'beacon'}, DEBUG ? {debug_mode: true} : {}, params));
    dataLayer.push(Object.assign({event: name}, params));
    if (window.va) window.va('event', {name: name, data: params});
  }
  window.jzTrack = track;
  function where(el){
    if (el.closest('.stickybar')) return 'sticky_bar';
    if (el.closest('header')) return 'header';
    if (el.closest('footer')) return 'footer';
    if (el.closest('.rate-fallback')) return 'rates_fallback';
    return 'body';
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    var h = a.getAttribute('href') || '', label = (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
    if (h.indexOf('tel:') === 0) track('click_to_call', {link_text: label, cta_location: where(a)});
    else if (h.indexOf('sms:') === 0) track('click_to_text', {link_text: label, cta_location: where(a)});
    else if (h.indexOf('mailto:') === 0) track('click_email', {link_text: label, cta_location: where(a)});
    else if (/(^|\/)book\.html/.test(h)) track('book_click', {link_text: label, cta_location: where(a)});
    else if (h.indexOf('calendar.app.google') !== -1) {
      track('book_call_click', {link_url: a.href, link_text: label, cta_location: where(a),
        cta_style: a.classList.contains('pri') ? 'primary' : (a.classList.contains('ghost') ? 'ghost' : (a.classList.contains('btn') ? 'button' : 'link'))});
    }
    else if (a.hostname && a.hostname !== location.hostname) {
      track(/loanfactory\.com$/.test(a.hostname) ? 'rates_outbound_click' : 'outbound_click', {link_url: a.href, link_text: label});
    }
  }, true);
  document.addEventListener('submit', function(e){ track('form_submit', {form_id: e.target.id || e.target.name || ''}); }, true);

  /* rate_quote_start (inline): first time the rate tool on /rates.html scrolls into view, once per page view.
     The popup version is sent from quote.js openQuote(). */
  var inline = document.getElementById('quote-inline');
  if (inline && 'IntersectionObserver' in window) {
    var seen = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        seen.disconnect();
        track('rate_quote_start', {quote_trigger: 'inline_view', widget: 'lf_quote_small'});
      });
    }, {threshold: 0.25});
    seen.observe(inline);
  }

  /* rate_quote_submit: the Loan Factory widget's "Get Quote" button (#gwt-debug-submit inside #lf-mount).
     The widget does not post a lead on this site: Get Quote sends the visitor to Loan Factory's
     results page (www.yourtrustedmortgage.com/quote_result), and any contact form is completed there.
     So this records the quote request handoff only; generate_lead is not sent from this site. */
  var quoteSent = false;
  document.addEventListener('click', function(e){
    if (quoteSent || !e.target.closest) return;
    var btn = e.target.closest('#gwt-debug-submit'); if (!btn) return;
    var root = btn.closest('#lf-mount, [data-ui-widget="quote_small"]'); if (!root || btn.disabled) return;
    var ok = ['property_value', 'loan_amount', 'zip'].every(function(n){
      var f = root.querySelector('input[name="' + n + '"]'); return !f || (f.value || '').trim() !== '';
    });
    if (!ok) return;
    quoteSent = true;
    var tab = root.querySelector('[role="tab"][aria-selected="true"]');
    var purpose = root.querySelector('select[name="purpose"]');
    track('rate_quote_submit', {widget: 'lf_quote_small', quote_location: root.closest('#quote-modal') ? 'popup' : 'inline',
      quote_tab: tab ? (tab.textContent || '').trim().slice(0, 30) : '', loan_purpose: purpose ? purpose.value : '',
      quote_destination: 'yourtrustedmortgage.com'});
  }, true);

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
