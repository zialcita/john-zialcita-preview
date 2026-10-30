(function () {
  var SRC = "https://www.loanfactory.com/sdk.js?owner=jzialcita@yourmortgageteam.net";
  var started = false;
  var ready = false;
  var waiters = [];

  function tidy(root) {
    if (!root) return;
    root.querySelectorAll("img").forEach(function (img) {
      var src = img.getAttribute("src") || "";
      if (src.indexOf("googleusercontent.com") === -1) return;
      img.setAttribute("width", "100");
      img.setAttribute("height", "100");
      img.style.width = "100px";
      img.style.height = "100px";
      img.style.aspectRatio = "1 / 1";
      img.style.objectFit = "contain";
    });
    root.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(function (heading) {
      if (heading.getAttribute("role") !== "presentation") heading.setAttribute("role", "presentation");
    });
    root.querySelectorAll('[role="tablist"] > li').forEach(function (item) {
      item.setAttribute("role", "presentation");
    });
    var tabs = root.querySelectorAll('[role="tab"]');
    var selectedTab = null;
    tabs.forEach(function (tab) {
      var selected = tab.classList.contains("active") || (tab.parentElement && tab.parentElement.classList.contains("active"));
      if (selected) selectedTab = tab;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
    });
    if (!selectedTab && tabs.length) tabs[0].setAttribute("aria-selected", "true");
    root.querySelectorAll('[role="form"]').forEach(function (form) {
      if (!form.getAttribute("aria-label")) form.setAttribute("aria-label", "Mortgage pricing form");
    });
  }

  function watch(root) {
    if (!root || root.dataset.tidy) return;
    root.dataset.tidy = "1";
    var ticks = 0;
    var timer = setInterval(function () {
      ticks += 1;
      tidy(root);
      if (ticks > 8) clearInterval(timer);
    }, 500);
    tidy(root);
  }

  function finish() {
    ready = true;
    var root = document.getElementById("lf-mount");
    if (root) watch(root);
    waiters.splice(0).forEach(function (fn) { fn(); });
  }

  function loadSdk(done) {
    if (done) waiters.push(done);
    if (ready) { finish(); return; }
    if (started) return;
    started = true;
    var script = document.createElement("script");
    script.src = SRC;
    script.async = true;
    script.onload = function () {
      var tries = 0;
      var timer = setInterval(function () {
        tries += 1;
        if (window.LoanFactory && typeof window.LoanFactory.init === "function") {
          clearInterval(timer);
          window.LoanFactory.init();
          finish();
        } else if (tries > 50) {
          clearInterval(timer);
          finish();
        }
      }, 100);
    };
    script.onerror = function () {
      document.querySelectorAll(".widget-wrap").forEach(function (wrap) { wrap.classList.add("widget-failed"); });
      finish();
    };
    document.head.appendChild(script);
  }

  var inlineHost = document.getElementById("quote-inline");
  var modal = document.getElementById("quote-modal");
  var modalSlot = document.getElementById("quote-modal-slot");

  function mount() {
    return document.getElementById("lf-mount");
  }

  function park(open) {
    var node = mount();
    if (!node) return;
    if (open && modalSlot && node.parentNode !== modalSlot) modalSlot.appendChild(node);
    if (!open && inlineHost && node.parentNode !== inlineHost) inlineHost.insertBefore(node, inlineHost.firstChild);
  }

  function openQuote(event) {
    if (event) event.preventDefault();
    park(true);
    if (modal) {
      modal.hidden = false;
      modal.classList.add("open");
      document.body.classList.add("quote-open");
      var close = modal.querySelector(".quote-modal-close");
      if (close) close.focus();
    }
    loadSdk();
  }

  function closeQuote() {
    if (!modal) return;
    modal.hidden = true;
    modal.classList.remove("open");
    document.body.classList.remove("quote-open");
    park(false);
  }

  document.addEventListener("click", function (event) {
    var opener = event.target.closest && event.target.closest("a[data-quote-popup]");
    if (opener) { openQuote(event); return; }
    if (event.target.closest && event.target.closest("[data-close-quote]")) closeQuote();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeQuote();
  });
  if (modal) modal.addEventListener("click", function (event) {
    if (event.target === modal) closeQuote();
  });

  var seen = inlineHost && document.getElementById("lf-mount");
  if (seen && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        var start = function () { loadSdk(); };
        if (document.readyState === "complete") start();
        else window.addEventListener("load", start, { once: true });
      });
    }, { rootMargin: "160px" });
    observer.observe(seen);
  }

  document.querySelectorAll("[data-map-src]").forEach(function (frame) {
    var loadMap = function () {
      if (!frame.getAttribute("src")) frame.setAttribute("src", frame.getAttribute("data-map-src"));
    };
    if (!("IntersectionObserver" in window)) { loadMap(); return; }
    var mapObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        mapObserver.disconnect();
        loadMap();
      });
    }, { rootMargin: "200px" });
    mapObserver.observe(frame);
  });
})();
