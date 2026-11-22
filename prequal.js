/* Pre-qualifying flow in front of the Loan Factory quote widget. Preview only. */
(function () {
  if (window.JZPrequal) return;
  var C = window.JZ_PREQUAL_CONFIG || {};
  var SRC_KEY = "jz_src";
  var SRC_TTL = 30 * 24 * 60 * 60 * 1000;

  var OPTIONS = {
    state: [
      { key: "CA", label: "California" },
      { key: "HI", label: "Hawaii" },
      { key: "other", label: "Another state" }
    ],
    goal: [
      { key: "purchase", label: "Buy a home" },
      { key: "refi_rate", label: "Refinance to lower my rate or payment" },
      { key: "refi_cashout", label: "Cash-out refinance (replace my first mortgage)" },
      { key: "heloc", label: "HELOC or second mortgage" },
      { key: "watching", label: "Just watching rates" }
    ],
    amount: [
      { key: "under_800k", label: "Under $800K" },
      { key: "800k_125m", label: "$800K to $1.25M" },
      { key: "125m_3m", label: "$1.25M to $3M" },
      { key: "over_3m", label: "Over $3M" }
    ],
    credit: [
      { key: "740_plus", label: "740+" },
      { key: "700_739", label: "700-739" },
      { key: "660_699", label: "660-699" },
      { key: "under_660", label: "Under 660" },
      { key: "not_sure", label: "Not sure" }
    ],
    timelinePurchase: [
      { key: "under_contract", label: "Under contract" },
      { key: "0_3mo", label: "0-3 months" },
      { key: "3_6mo", label: "3-6 months" },
      { key: "6plus", label: "6+ months or just looking" }
    ],
    timelineRefi: [
      { key: "ready_now", label: "Ready now" },
      { key: "rates_drop", label: "When rates drop" },
      { key: "not_sure", label: "Not sure" }
    ],
    occupancy: [
      { key: "primary", label: "Primary home" },
      { key: "second", label: "Second home" },
      { key: "investment", label: "Investment" }
    ],
    propertyType: [
      { key: "house", label: "House" },
      { key: "condo", label: "Condo" },
      { key: "condotel", label: "Condotel" },
      { key: "2_4_units", label: "2-4 units" }
    ]
  };

  function cfg() { return window.JZ_PREQUAL_CONFIG || C || {}; }

  function persistSource() {
    try {
      var q = new URLSearchParams(location.search);
      var keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"];
      var stored = {};
      var found = false;
      keys.forEach(function (k) {
        var v = q.get(k);
        if (v) { stored[k] = v; found = true; }
      });
      if (found) {
        stored.savedAt = Date.now();
        localStorage.setItem(SRC_KEY, JSON.stringify(stored));
      }
    } catch (e) {}
  }

  function getSource() {
    var out = {};
    try {
      var raw = localStorage.getItem(SRC_KEY);
      if (raw) {
        var o = JSON.parse(raw);
        if (o.savedAt && Date.now() - o.savedAt > SRC_TTL) localStorage.removeItem(SRC_KEY);
        else out = o;
      }
    } catch (e) {}
    try {
      var q = new URLSearchParams(location.search);
      ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"].forEach(function (k) {
        if (q.get(k)) out[k] = q.get(k);
      });
    } catch (e) {}
    delete out.savedAt;
    return out;
  }

  function entryFromPath() {
    var path = location.pathname || "";
    if (/check-rates/.test(path)) return "ad_lp";
    if (/rate-alert/.test(path)) return "rate_alert";
    if (/rates\.html/.test(path)) return "rates";
    if (/jumbo-refinance-hawaii/.test(path)) return "lp_hi";
    if (/jumbo-refinance-california/.test(path)) return "lp_ca";
    if (path === "/" || /(?:^|\/)index\.html$/.test(path)) return "hero";
    return "body";
  }

  function track(name, params) {
    params = params || {};
    if (window.jzTrack) window.jzTrack(name, params);
    else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: name }, params));
      if (typeof window.gtag === "function") window.gtag("event", name, params);
    }
  }

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "html") n.innerHTML = attrs.html;
      else if (k === "class") n.className = attrs[k];
      else if (k.indexOf("on") === 0 && typeof attrs[k] === "function") n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] === false || attrs[k] == null) return;
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function phoneLinks() {
    var c = cfg();
    var wrap = el("div", { class: "pq-reach", "aria-label": "Call or text John" });
    wrap.appendChild(el("a", { class: "btn", href: c.phoneHref || "tel:+14153857409", text: "Call " + (c.phone || "(415) 385-7409") }));
    wrap.appendChild(el("a", { class: "btn ghost", href: c.smsHref || "sms:+14153857409", text: "Text John" }));
    return wrap;
  }

  function limitsNote() {
    var c = cfg();
    var src = c.limitsSource || {};
    var p = el("p", { class: "pq-limits" });
    p.appendChild(document.createTextNode(
      "2026 jumbo threshold: a loan is jumbo when the amount is above the FHFA conforming limit for that county and unit count. The U.S. baseline one-unit limit is $832,750. The contiguous high-cost ceiling and the Hawaii statutory baseline are $1,249,125. Honolulu, Hawaii County and Kauai County are at $1,249,125; Maui and Kalawao counties are at $1,299,500. Source: "
    ));
    if (src.url) {
      p.appendChild(el("a", { href: src.url, rel: "noopener", target: "_blank", text: src.label || "FHFA 2026 conforming loan limits" }));
    } else {
      p.appendChild(document.createTextNode("FHFA 2026 conforming loan limits"));
    }
    p.appendChild(document.createTextNode(". Figures were checked October 30, 2026 and are listed on "));
    p.appendChild(el("a", { href: src.sitePage || "/loan-limits-hawaii-california.html", text: "the county loan limits page" }));
    p.appendChild(document.createTextNode(". 2027 FHFA limits were not verified for this preview."));
    return p;
  }

  function session() {
    return {
      answers: {},
      step: "state",
      history: [],
      started: false,
      entryPoint: "body",
      mode: "page",
      route: null,
      reason: "",
      segment: "",
      submitted: false
    };
  }

  function isPurchase(s) { return s.answers.goal === "purchase"; }
  function isRefi(s) { return s.answers.goal === "refi_rate" || s.answers.goal === "refi_cashout"; }

  function segmentOf(s) {
    var amount = s.answers.amount;
    var timeline = s.answers.timeline;
    if (isPurchase(s) && timeline === "6plus") return "nurture";
    if (amount === (cfg().loanSizeDqBand || "under_800k")) return "conforming";
    return "jumbo";
  }

  function purposeKey(s) {
    var g = s.answers.goal;
    if (g === "purchase") return "purchase";
    if (g === "refi_cashout") return "cashout_refi";
    if (g === "refi_rate") return "rate_refi";
    if (g === "watching") return "rate_alert";
    return g || "";
  }

  function stepsFor(s) {
    /* Contact is last on the qualified path. Rate Alert and DQ exit early. */
    return ["state", "goal", "amount", "credit", "timeline", "property", "contact"];
  }

  function stepIndex(name) {
    var all = ["state", "goal", "amount", "credit", "timeline", "property", "contact"];
    var i = all.indexOf(name);
    return i < 0 ? 0 : i + 1;
  }

  function creditIsDq(key) {
    if (!key || key === "not_sure") return false;
    return key === (cfg().creditCutoffBand || "under_660");
  }

  function amountIsUnder(key) {
    return key === (cfg().loanSizeDqBand || "under_800k");
  }

  function routeAfter(s, name, key) {
    if (name === "state" && key === "other") return { type: "dq", reason: "unlicensed_state" };
    if (name === "goal" && key === "heloc") return { type: "dq", reason: "heloc_second" };
    if (name === "goal" && key === "watching") return { type: "rate_alert" };
    if (name === "amount" && amountIsUnder(key) && cfg().underLimitPolicy === "disqualify") {
      return { type: "dq", reason: "loan_size" };
    }
    if (name === "credit" && creditIsDq(key)) return { type: "dq", reason: "credit" };
    if (name === "timeline" && isRefi(s) && key === "rates_drop") return { type: "rate_alert" };
    return { type: "continue" };
  }

  function consentHtml() {
    return 'By submitting this form, or by texting (415) 385-7409, you agree to the <a href="/privacy.html">Privacy Policy</a> and <a href="/sms-terms.html">SMS Terms</a>. Message frequency varies. Msg and data rates may apply. Reply STOP to opt out and HELP for help. Consent is not a condition of any loan.';
  }

  function formFields(s, kind) {
    var wrap = el("div", { class: "pq-contact" });
    if (kind === "rate_alert") {
      wrap.appendChild(field("current_rate", "Current interest rate", "text", "For example 6.75%"));
      wrap.appendChild(field("current_balance", "Current loan balance", "text", "Approximate is fine"));
      wrap.appendChild(field("home_value", "Estimated home value", "text", "Approximate is fine"));
      wrap.appendChild(field("current_lender", "Current lender (optional)", "text", ""));
      wrap.appendChild(field("target_rate", "Target rate or monthly savings", "text", "The point where a no-cost refinance would help"));
    }
    if (kind === "contact" || kind === "rate_alert" || kind === "stay_in_touch") {
      if (kind !== "stay_in_touch") wrap.appendChild(field("name", "Full name", "text", "", true));
      if (kind !== "stay_in_touch") wrap.appendChild(field("mobile", "Mobile number", "tel", "", true));
      wrap.appendChild(field("email", "Email", "email", "", true));
    }
    var hp = el("div", { class: "pq-hp", "aria-hidden": "true" });
    hp.appendChild(el("label", { for: "pq-company", text: "Company" }));
    hp.appendChild(el("input", { type: "text", name: "company", id: "pq-company", tabindex: "-1", autocomplete: "off" }));
    wrap.appendChild(hp);
    if (kind !== "stay_in_touch") {
      var consent = el("label", { class: "pq-consent" });
      consent.appendChild(el("input", { type: "checkbox", name: "consent", id: "pq-consent", required: "required" }));
      var txt = el("span");
      txt.innerHTML = consentHtml();
      consent.appendChild(txt);
      wrap.appendChild(consent);
    }
    return wrap;
  }

  function field(name, label, type, placeholder, required) {
    var id = "pq-" + name;
    var w = el("div", { class: "pq-field" });
    w.appendChild(el("label", { for: id, text: label }));
    var input = el("input", { type: type || "text", name: name, id: id, placeholder: placeholder || "" });
    if (required) input.setAttribute("aria-required", "true");
    w.appendChild(input);
    return w;
  }

  function optionList(name, items, current, onPick) {
    var group = el("div", { class: "pq-options", role: "group", "aria-label": name });
    items.forEach(function (item) {
      var btn = el("button", { type: "button", class: "pq-opt", "data-key": item.key, "aria-pressed": item.key === current ? "true" : "false", text: item.label });
      btn.addEventListener("click", function () { onPick(item.key); });
      group.appendChild(btn);
    });
    return group;
  }

  function App(root, opts) {
    this.root = root;
    this.state = session();
    this.state.entryPoint = (opts && opts.entryPoint) || root.getAttribute("data-entry") || entryFromPath();
    this.state.mode = (opts && opts.mode) || root.getAttribute("data-mode") || "page";
    this.state.startAt = (opts && opts.startAt) || null;
    persistSource();
    if (this.state.startAt === "rate_alert") {
      this.state.route = "rate_alert";
      this.state.step = "rate_alert";
    }
  }

  App.prototype.trackStart = function (answerKey, stepName) {
    if (this.state.started) return;
    this.state.started = true;
    track("prequal_start", { entry_point: this.state.entryPoint });
  };

  App.prototype.trackStep = function (name, key) {
    track("prequal_step", { step: stepIndex(name), step_name: name, answer_key: key });
  };

  App.prototype.choose = function (name, key) {
    this.trackStart(key, name);
    this.state.history.push({ step: this.state.step, answers: Object.assign({}, this.state.answers) });
    this.state.answers[name] = key;
    this.trackStep(name, key);
    var next = routeAfter(this.state, name, key);
    if (next.type === "dq") {
      this.state.route = "dq";
      this.state.reason = next.reason;
      this.state.step = "dq";
      track("prequal_disqualified", { reason: next.reason });
      this.render();
      return;
    }
    if (next.type === "rate_alert") {
      this.state.route = "rate_alert";
      this.state.step = "rate_alert";
      this.render();
      return;
    }
    var order = stepsFor(this.state);
    var i = order.indexOf(name);
    this.state.step = order[i + 1] || "contact";
    this.render();
  };

  App.prototype.back = function () {
    var prev = this.state.history.pop();
    if (!prev) return;
    this.state.step = prev.step;
    this.state.answers = prev.answers;
    this.state.route = null;
    this.state.reason = "";
    this.render();
  };

  App.prototype.showQualified = function () {
    this.state.route = "qualified";
    this.state.segment = segmentOf(this.state);
    this.state.step = "qualified";
    this.render();
    this.mountWidget();
  };

  App.prototype.mountWidget = function () {
    var inline = document.getElementById("quote-inline");
    var modal = this.state.mode === "modal";
    if (inline) {
      inline.classList.remove("pq-pending");
      inline.classList.add("pq-show-widget");
    }
    if (typeof window.jzShowQuoteWidget === "function") {
      window.jzShowQuoteWidget({
        modal: modal && !inline,
        leadInfoRequired: cfg().widgetLeadInfoRequired || "1",
        trigger: "prequal_qualified"
      });
    }
  };

  App.prototype.payload = function (kind, extra) {
    var s = this.state;
    var src = getSource();
    var data = {
      kind: kind,
      preview: !!cfg().previewStub,
      entry_point: s.entryPoint,
      state: s.answers.state || "",
      goal: s.answers.goal || "",
      purpose: purposeKey(s),
      loan_band: s.answers.amount || "",
      credit_band: s.answers.credit || "",
      timeline: s.answers.timeline || "",
      occupancy: s.answers.occupancy || "",
      property_type: s.answers.propertyType || "",
      segment: s.segment || segmentOf(s),
      reason: s.reason || "",
      source: src,
      path: location.pathname
    };
    if (extra) Object.keys(extra).forEach(function (k) { data[k] = extra[k]; });
    return data;
  };

  App.prototype.submitLead = function (kind, extra) {
    var self = this;
    var body = this.payload(kind, extra);
    if (body.company) {
      return Promise.resolve({ ok: true, stub: true, honeypot: true });
    }
    /* Never include a needless dump of this object in console. */
    var endpoint = cfg().leadEndpoint || "/api/prequal-lead";
    if (cfg().previewStub !== false) {
      return postOrStub(endpoint, body);
    }
    return postOrStub(endpoint, body);
  };

  function postOrStub(endpoint, body) {
    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(sanitize(body))
    }).then(function (res) {
      if (!res.ok) throw new Error("save_failed");
      return res.json().catch(function () { return { ok: true, stub: true }; });
    }).catch(function () {
      return { ok: true, stub: true, offline: true };
    });
  }

  function sanitize(body) {
    /* Send fields the stub may store later. Do not add SSN, income, or credit reports. */
    return body;
  }

  App.prototype.readForm = function (form) {
    var data = {};
    Array.prototype.forEach.call(form.querySelectorAll("input"), function (input) {
      if (input.type === "checkbox") data[input.name] = !!input.checked;
      else data[input.name] = (input.value || "").trim();
    });
    return data;
  };

  App.prototype.handleContact = function (ev) {
    ev.preventDefault();
    var form = ev.target;
    var err = form.querySelector(".pq-error");
    if (err) err.remove();
    var data = this.readForm(form);
    if (data.company) { this.state.submitted = true; this.showQualified(); return; }
    if (!data.name || !data.mobile || !data.email || !data.consent) {
      form.appendChild(el("p", { class: "pq-error", role: "alert", text: "Please enter your name, mobile number, email, and consent to continue." }));
      return;
    }
    var self = this;
    this.state.segment = segmentOf(this.state);
    this.submitLead("qualified", { name: data.name, mobile: data.mobile, email: data.email, consent: true }).then(function () {
      track("prequal_qualified", {
        purpose: purposeKey(self.state),
        state: self.state.answers.state || "",
        loan_band: self.state.answers.amount || "",
        credit_band: self.state.answers.credit || "",
        timeline: self.state.answers.timeline || "",
        segment: self.state.segment
      });
      self.state.submitted = true;
      self.showQualified();
    });
  };

  App.prototype.handleRateAlert = function (ev) {
    ev.preventDefault();
    var form = ev.target;
    var err = form.querySelector(".pq-error");
    if (err) err.remove();
    var data = this.readForm(form);
    if (data.company) { this.state.step = "rate_alert_done"; this.render(); return; }
    if (!data.name || !data.mobile || !data.email || !data.consent || !data.target_rate) {
      form.appendChild(el("p", { class: "pq-error", role: "alert", text: "Please enter your name, mobile number, email, a target rate or savings amount, and consent." }));
      return;
    }
    var self = this;
    this.submitLead("rate_alert", {
      name: data.name, mobile: data.mobile, email: data.email, consent: true,
      current_rate: data.current_rate, current_balance: data.current_balance,
      home_value: data.home_value, current_lender: data.current_lender, target_rate: data.target_rate
    }).then(function () {
      track("rate_alert_signup", {
        state: self.state.answers.state || "",
        loan_band: self.state.answers.amount || ""
      });
      self.state.step = "rate_alert_done";
      self.render();
    });
  };

  App.prototype.handleStayInTouch = function (ev) {
    ev.preventDefault();
    var form = ev.target;
    var data = this.readForm(form);
    if (!data.email) {
      form.appendChild(el("p", { class: "pq-error", role: "alert", text: "Please enter an email address, or use the call and text options below." }));
      return;
    }
    var self = this;
    this.submitLead("stay_in_touch", { email: data.email, reason: this.state.reason }).then(function () {
      self.state.step = "stay_in_touch_done";
      self.render();
    });
  };

  App.prototype.heading = function () {
    var map = {
      state: "Where is the property?",
      goal: "What do you want to do?",
      amount: "About how much do you need to borrow?",
      credit: "Your credit score, roughly?",
      timeline: isPurchase(this.state) ? "When do you want to move?" : "When do you want to refinance?",
      property: "What kind of property is it?",
      contact: "How can John reach you?",
      rate_alert: "Set a Rate Alert",
      rate_alert_done: "We have your Rate Alert request",
      dq: "Thanks for checking",
      qualified: "You're a fit",
      stay_in_touch_done: "Thanks. John can stay in touch."
    };
    return map[this.state.step] || "Check if you qualify";
  };

  App.prototype.render = function () {
    var root = this.root;
    var s = this.state;
    var self = this;
    root.innerHTML = "";
    var card = el("div", { class: "pq-card" });
    var live = el("p", { class: "pq-live", "aria-live": "polite", id: "pq-live", text: this.heading() });
    card.appendChild(live);
    if (cfg().previewStub !== false) {
      card.appendChild(el("p", { class: "pq-stub", text: "Preview draft. Submissions are not sent to John or saved in a live inbox. This page is not on johnzialcita.com." }));
    }
    card.appendChild(el("p", { class: "pq-kicker", text: "Check if you qualify" }));

    var questionSteps = ["state", "goal", "amount", "credit", "timeline", "property", "contact"];
    if (questionSteps.indexOf(s.step) !== -1) {
      var idx = stepIndex(s.step);
      var progress = el("div", { class: "pq-progress" });
      progress.appendChild(el("p", { class: "pq-progress-label", text: "Question " + idx + " of 7" }));
      var bar = el("div", { class: "pq-bar", "aria-hidden": "true" });
      bar.appendChild(el("span", { style: "width:" + Math.round((idx / 7) * 100) + "%" }));
      progress.appendChild(bar);
      card.appendChild(progress);
    }

    card.appendChild(el("h2", { class: "pq-title", id: "pq-title", text: this.heading() }));

    if (s.step === "state") {
      card.appendChild(el("p", { class: "pq-lead", text: "John is licensed only in California and Hawaii." }));
      card.appendChild(optionList("Property state", OPTIONS.state, s.answers.state, function (key) { self.choose("state", key); }));
    } else if (s.step === "goal") {
      card.appendChild(optionList("Goal", OPTIONS.goal, s.answers.goal, function (key) { self.choose("goal", key); }));
    } else if (s.step === "amount") {
      card.appendChild(el("p", { class: "pq-lead", text: "An approximate range is enough at this step." }));
      card.appendChild(optionList("Loan amount", OPTIONS.amount, s.answers.amount, function (key) { self.choose("amount", key); }));
      card.appendChild(limitsNote());
    } else if (s.step === "credit") {
      card.appendChild(optionList("Credit score", OPTIONS.credit, s.answers.credit, function (key) { self.choose("credit", key); }));
    } else if (s.step === "timeline") {
      var opts = isPurchase(s) ? OPTIONS.timelinePurchase : OPTIONS.timelineRefi;
      card.appendChild(optionList("Timeline", opts, s.answers.timeline, function (key) { self.choose("timeline", key); }));
    } else if (s.step === "property") {
      card.appendChild(el("p", { class: "pq-lead", text: "This helps John price the scenario. It does not approve or decline the request." }));
      var occ = el("fieldset", { class: "pq-fieldset" });
      occ.appendChild(el("legend", { class: "pq-legend", text: "How do you use it?" }));
      occ.appendChild(optionList("Property use", OPTIONS.occupancy, s.answers.occupancy, function (key) {
        s.answers.occupancy = key;
        self.updatePropertyContinue();
        Array.prototype.forEach.call(occ.querySelectorAll(".pq-opt"), function (b) {
          b.setAttribute("aria-pressed", b.getAttribute("data-key") === key ? "true" : "false");
        });
      }));
      card.appendChild(occ);
      var typ = el("fieldset", { class: "pq-fieldset" });
      typ.appendChild(el("legend", { class: "pq-legend", text: "Property type" }));
      typ.appendChild(optionList("Property type", OPTIONS.propertyType, s.answers.propertyType, function (key) {
        s.answers.propertyType = key;
        self.updatePropertyContinue();
        Array.prototype.forEach.call(typ.querySelectorAll(".pq-opt"), function (b) {
          b.setAttribute("aria-pressed", b.getAttribute("data-key") === key ? "true" : "false");
        });
      }));
      card.appendChild(typ);
      var nav = el("div", { class: "pq-nav" });
      if (s.history.length) nav.appendChild(el("button", { type: "button", class: "pq-back", text: "Back", onclick: function () { self.back(); } }));
      var next = el("button", { type: "button", class: "pq-next", id: "pq-property-next", text: "Continue" });
      next.disabled = !(s.answers.occupancy && s.answers.propertyType);
      next.addEventListener("click", function () {
        if (!s.answers.occupancy || !s.answers.propertyType) return;
        self.trackStart();
        self.state.history.push({ step: "property", answers: Object.assign({}, s.answers) });
        /* Property answers are two keys; record a combined step event without PII. */
        track("prequal_step", { step: 6, step_name: "property", answer_key: s.answers.occupancy + ":" + s.answers.propertyType });
        s.step = "contact";
        self.render();
      });
      nav.appendChild(next);
      card.appendChild(nav);
    } else if (s.step === "contact") {
      card.appendChild(el("p", { class: "pq-lead", text: "Contact details come last. John uses these to follow up on your scenario." }));
      var form = el("form", { novalidate: "novalidate" });
      form.appendChild(formFields(s, "contact"));
      var navc = el("div", { class: "pq-nav" });
      if (s.history.length) navc.appendChild(el("button", { type: "button", class: "pq-back", text: "Back", onclick: function () { self.back(); } }));
      navc.appendChild(el("button", { type: "submit", class: "pq-next", text: "See if you qualify" }));
      form.appendChild(navc);
      form.addEventListener("submit", function (e) { self.handleContact(e); });
      card.appendChild(form);
    } else if (s.step === "rate_alert") {
      card.appendChild(el("p", { class: "pq-lead", text: "John will set up a free Loan Factory Rate Alert for your exact loan and contact you when a no-cost refinance would save you money. No rate promises. Alerts are not a lock or an approval." }));
      var rform = el("form", { novalidate: "novalidate" });
      rform.appendChild(formFields(s, "rate_alert"));
      var navr = el("div", { class: "pq-nav" });
      if (s.history.length) navr.appendChild(el("button", { type: "button", class: "pq-back", text: "Back", onclick: function () { self.back(); } }));
      navr.appendChild(el("button", { type: "submit", class: "pq-next", text: "Request a Rate Alert" }));
      rform.appendChild(navr);
      rform.addEventListener("submit", function (e) { self.handleRateAlert(e); });
      card.appendChild(rform);
    } else if (s.step === "rate_alert_done") {
      card.appendChild(el("p", { class: "pq-lead", text: "On the live site, John would enter this scenario into Loan Factory's Rate Alert tool and reach out when the target makes sense. This preview did not send your details to him." }));
      card.appendChild(stubNote());
    } else if (s.step === "dq") {
      card.appendChild(this.dqCopy());
    } else if (s.step === "qualified") {
      var seg = s.segment;
      var lead = "See today's scenarios below, or book 15 minutes with John.";
      if (seg === "conforming") lead = "You can look at today's scenarios below.";
      if (seg === "nurture") lead = "You can look at today's scenarios below. There is no need to book a call until you are closer to a purchase.";
      card.appendChild(el("p", { class: "pq-lead", text: lead }));
      if (seg !== "conforming" && seg !== "nurture") {
        var book = el("a", { class: "btn", href: cfg().bookingUrl || "https://calendar.app.google/2VznYYZbBozjzgraA", target: "_blank", rel: "noopener", text: "Book a call" });
        card.appendChild(el("p", {}, [book]));
      }
      card.appendChild(stubNote());
    } else if (s.step === "stay_in_touch_done") {
      card.appendChild(el("p", { class: "pq-lead", text: "This preview did not send your email to John." }));
      card.appendChild(stubNote());
    }

    if (s.step !== "property" && s.step !== "contact" && s.step !== "rate_alert" && s.history.length && questionSteps.indexOf(s.step) !== -1) {
      var navb = el("div", { class: "pq-nav" });
      navb.appendChild(el("button", { type: "button", class: "pq-back", text: "Back", onclick: function () { self.back(); } }));
      card.appendChild(navb);
    }

    card.appendChild(phoneLinks());
    root.appendChild(card);
    var focus = root.querySelector("#pq-title") || root.querySelector(".pq-opt, .pq-next, h2");
    if (focus && typeof focus.focus === "function") {
      focus.setAttribute("tabindex", "-1");
      focus.focus();
    }
  };

  App.prototype.updatePropertyContinue = function () {
    var btn = this.root.querySelector("#pq-property-next");
    if (btn) btn.disabled = !(this.state.answers.occupancy && this.state.answers.propertyType);
  };

  App.prototype.dqCopy = function () {
    var self = this;
    var box = el("div");
    if (this.state.reason === "unlicensed_state") {
      box.appendChild(el("p", { class: "pq-lead", text: "Thanks. John is licensed only in California and Hawaii, so he cannot help with a property in another state." }));
      if (cfg().showOutOfStateLoanFactoryLink && cfg().outOfStateLoanFactoryUrl) {
        box.appendChild(el("p", {}, [
          el("a", { href: cfg().outOfStateLoanFactoryUrl, rel: "noopener", target: "_blank", text: "Find a Loan Factory loan officer in that state" })
        ]));
      }
    } else if (this.state.reason === "heloc_second") {
      box.appendChild(el("p", { class: "pq-lead", text: "John focuses on first mortgages (purchase, refinance and cash-out refinance). He does not offer HELOCs or second mortgages." }));
      var back = el("button", { type: "button", class: "pq-next", text: "If a cash-out refinance of your first mortgage might work, tap here" });
      back.addEventListener("click", function () { self.back(); });
      box.appendChild(el("p", {}, [back]));
    } else if (this.state.reason === "credit" || this.state.reason === "loan_size") {
      var msg = this.state.reason === "credit"
        ? "John typically works with stronger credit profiles for the loans he arranges. You can call or text him with questions, or leave an email if you want him to stay in touch."
        : "This loan amount may be below the jumbo scenarios John focuses on. You can call or text him with questions, or leave an email if you want him to stay in touch.";
      box.appendChild(el("p", { class: "pq-lead", text: msg }));
      var form = el("form", { novalidate: "novalidate" });
      form.appendChild(formFields(this.state, "stay_in_touch"));
      form.appendChild(el("div", { class: "pq-nav" }, [el("button", { type: "submit", class: "pq-next", text: "Save my email (preview only)" })]));
      form.addEventListener("submit", function (e) { self.handleStayInTouch(e); });
      box.appendChild(form);
    }
    if (this.state.history.length) {
      box.appendChild(el("div", { class: "pq-nav" }, [el("button", { type: "button", class: "pq-back", text: "Back", onclick: function () { self.back(); } })]));
    }
    return box;
  };

  function stubNote() {
    return el("p", { class: "pq-note", text: "Preview only: this was not emailed to John or added to a live lead tracker." });
  }

  function mount(root, opts) {
    if (!root) return null;
    var app = new App(root, opts || {});
    root.setAttribute("data-prequal", "1");
    if (root.id === "prequal-root") {
      var inline = document.getElementById("quote-inline");
      if (inline) inline.classList.add("pq-pending");
    }
    app.render();
    return app;
  }

  function openModal(entryPoint) {
    var modal = document.getElementById("quote-modal");
    if (!modal) {
      window.location.href = "/check-rates/";
      return;
    }
    var panel = modal.querySelector(".quote-modal-panel");
    if (panel) { panel.classList.add("pq-wide"); panel.classList.add("pq-prequal-open"); }
    var slot = document.getElementById("quote-modal-prequal") || document.getElementById("quote-modal-slot");
    var host = document.getElementById("quote-modal-prequal");
    if (!host) {
      host = el("div", { id: "quote-modal-prequal" });
      if (panel) panel.insertBefore(host, document.getElementById("quote-modal-slot"));
    }
    var title = document.getElementById("quote-modal-title");
    if (title) title.textContent = "Check if you qualify";
    host.hidden = false;
    var widgetSlot = document.getElementById("quote-modal-slot");
    if (widgetSlot) widgetSlot.hidden = true;
    modal.hidden = false;
    modal.classList.add("open");
    document.body.classList.add("quote-open");
    var app = mount(host, { mode: "modal", entryPoint: entryPoint || "body" });
    var origShow = app.showQualified.bind(app);
    app.showQualified = function () {
      host.hidden = true;
      if (widgetSlot) widgetSlot.hidden = false;
      if (panel) panel.classList.remove("pq-prequal-open");
      origShow();
    };
  }

  document.addEventListener("click", function (event) {
    var opener = event.target.closest && event.target.closest("a[data-quote-popup]");
    if (!opener) return;
    event.preventDefault();
    event.stopPropagation();
    var entry = opener.getAttribute("data-prequal-entry") || entryFromPath();
    if (opener.closest("header")) entry = "header";
    var hero = opener.closest(".phero, .hero, .cta-hero");
    if (hero && entry === "body") entry = "hero";
    openModal(entry);
  }, true);

  document.addEventListener("DOMContentLoaded", function () {
    persistSource();
    var root = document.getElementById("prequal-root");
    if (root) mount(root, { mode: root.getAttribute("data-mode") || "page", entryPoint: root.getAttribute("data-entry"), startAt: root.getAttribute("data-start") });
  });

  window.JZPrequal = { mount: mount, openModal: openModal, config: cfg };
})();
