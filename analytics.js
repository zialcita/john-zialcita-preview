/* Site analytics for johnzialcita.com.
   Paste the real IDs here (one place). Leave '' to keep tracking off.
   GA4 property + GTM container belong to John's Google account (yourtrustedmortgagepro@gmail.com).
   Tracking only runs on the production hostnames (johnzialcita.com, www.johnzialcita.com) over https.
   Localhost, 127.0.0.1, ::1, file:, and *.vercel.app previews send nothing to GA4.
   Add ?jz_debug=1 to any URL to send that session's hits with debug_mode (GA4 DebugView).
   Meta Pixel (PIXEL_ID, "John Zialcita's Official Pixel") uses the same production-host filter.
   For local testing only: http://localhost/...?jz_pixel_test=1 turns the Meta Pixel on (GA4 stays off). */
window.JZ_ANALYTICS = { GA_ID: 'G-9M3HLW882J', GTM_ID: '', PIXEL_ID: '1235275005272091', HOSTS: ['johnzialcita.com', 'www.johnzialcita.com'] };
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
  /* Meta Pixel: base code + PageView, then the site events below mapped to Meta events.
     No 'Lead' is sent: leads are completed on Loan Factory's site, not here. */
  var PIXEL_TEST = false;
  try { PIXEL_TEST = !LIVE && /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && /[?&]jz_pixel_test=1(&|$)/.test(location.search); } catch (e) {}
  var PIXEL_ON = !!C.PIXEL_ID && (LIVE || PIXEL_TEST);
  function eid(n){ return n + '.' + Date.now() + '.' + Math.random().toString(36).slice(2, 10); }
  if (PIXEL_ON) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', C.PIXEL_ID);
    window.fbq('track', 'PageView', {}, {eventID: eid('PageView')});
  }
  var META = {
    book_call_click: ['track', 'Schedule'],
    rate_quote_start: ['trackCustom', 'RateQuoteStart'],
    rate_quote_submit: ['trackCustom', 'RateQuoteSubmit'],
    click_to_call: ['track', 'Contact', 'phone'],
    click_to_text: ['track', 'Contact', 'sms'],
    click_email: ['track', 'Contact', 'email']
  };
  function metaTrack(name, params){
    var m = META[name]; if (!PIXEL_ON || !m || !window.fbq) return;
    var data = {content_name: name, page_path: params.page_path};
    if (params.cta_location) data.cta_location = params.cta_location;
    if (params.quote_trigger) data.quote_trigger = params.quote_trigger;
    if (params.quote_location) data.quote_location = params.quote_location;
    if (m[2]) data.contact_method = m[2];
    try { window.fbq(m[0], m[1], data, {eventID: eid(m[1])}); } catch (e) {}
  }
  function track(name, params){
    params = params || {}; params.page_path = location.pathname;
    metaTrack(name, params);
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
      function widgetHeight(w){
        var h = 0; Array.prototype.forEach.call(w.children, function(c){ if (!c.classList.contains('fine') && !c.classList.contains('rate-fallback')) h += c.offsetHeight; });
        return h;
      }
      document.querySelectorAll('.widget-wrap').forEach(function(w){
        if (widgetHeight(w) < 80) {
          w.classList.add('widget-failed');
          /* Only count it when the visitor can see that rate tool (skip the closed popup slot on every page),
             and only if the widget still has not rendered a few seconds later (it can be slow on first open). */
          setTimeout(function(){
            var lf = w.querySelector('#lf-mount');
            var rendered = lf && lf.querySelector('[role="form"], #gwt-debug-submit');
            if (w.offsetParent !== null && !rendered) track('rates_widget_fallback', {widget_slot: w.id || ''});
          }, 4000);
        }
      });
    }, 6000);
  });
})();
