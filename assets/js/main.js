/* Syntrix Systems Inc. — interactions. Vanilla JS, no dependencies. */
(function () {
  "use strict";
  var SITE = window.SITE || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js");

  /* Header: scrolled state + mobile menu */
  var header = $(".site-header");
  var toggle = $(".nav__toggle");
  var links = $(".nav__links");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
    var tt = $(".to-top"); if (tt) tt.classList.toggle("is-visible", window.scrollY > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  function setMenu(open) {
    if (!toggle || !links) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    links.classList.toggle("is-open", open);
  }
  if (toggle) {
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    $$("a", links).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* Scroll reveal */
  var revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el, i) {
      var sib = el.parentElement ? $$("[data-reveal]", el.parentElement).indexOf(el) : 0;
      if (sib > 0 && !el.style.getPropertyValue("--d")) el.style.setProperty("--d", Math.min(sib, 5) * 80 + "ms");
      io.observe(el);
    });
  } else { revealEls.forEach(function (el) { el.classList.add("is-in"); }); }

  /* Animated counters */
  function runCounter(el) {
    var end = parseFloat(el.getAttribute("data-count")), dur = 1600, start = null;
    if (reduced) { el.textContent = end; return; }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = $$("[data-count]");
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else { counters.forEach(function (c) { c.textContent = c.getAttribute("data-count"); }); }

  /* Portfolio filter */
  var filters = $$(".filter");
  if (filters.length) {
    var projects = $$(".project");
    var apply = function (cat) {
      filters.forEach(function (f) { var on = f.dataset.filter === cat; f.classList.toggle("is-active", on); f.setAttribute("aria-pressed", String(on)); });
      projects.forEach(function (p) { p.hidden = !(cat === "all" || p.dataset.category === cat); });
    };
    filters.forEach(function (f) { f.addEventListener("click", function () { apply(f.dataset.filter); }); });
    var h = (location.hash || "").replace("#", "");
    if (h && filters.some(function (f) { return f.dataset.filter === h; })) apply(h);
  }

  /* Contact details, WhatsApp links and social icons from config.js */
  var waBase = "https://wa.me/" + (SITE.whatsappNumber || "");
  $$("[data-whatsapp]").forEach(function (a) {
    a.href = waBase + "?text=" + encodeURIComponent(SITE.whatsappGreeting || "");
    a.target = "_blank"; a.rel = "noopener";
  });
  var labels = { facebook: "Facebook", instagram: "Instagram", linkedin: "LinkedIn", x: "X (Twitter)" };
  $$("[data-socials]").forEach(function (box) {
    var any = false;
    Object.keys(labels).forEach(function (k) {
      var url = SITE.social && SITE.social[k];
      if (!url) return; any = true;
      var a = document.createElement("a");
      a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; a.setAttribute("aria-label", labels[k]);
      a.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-' + k + '"></use></svg>';
      box.appendChild(a);
    });
    if (!any) {
      var p = document.createElement("p"); p.className = "note"; p.style.margin = "0";
      p.textContent = "Social profiles coming soon. For now, reach us on WhatsApp or email.";
      box.appendChild(p);
    }
  });

  /* Contact form */
  var form = $("#contact-form");
  if (form) {
    var status = $("#form-status");
    var qs = new URLSearchParams(location.search);
    if (qs.get("service") && form.service) { form.service.value = qs.get("service"); }

    var rules = {
      name: function (v) { return v.trim().length >= 2 || "Please enter your full name."; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Please enter a valid email address."; },
      phone: function (v) { return v.trim() === "" || /^[+()\d\s-]{7,20}$/.test(v.trim()) || "Please enter a valid phone number."; },
      service: function (v) { return v !== "" || "Please choose a service."; },
      message: function (v) { return v.trim().length >= 10 || "Please tell us a little about your project (10+ characters)."; }
    };
    function validate() {
      var ok = true;
      Object.keys(rules).forEach(function (n) {
        var f = form.elements[n], wrap = f.closest(".field"), res = rules[n](f.value);
        var msg = res === true ? "" : res;
        wrap.classList.toggle("invalid", !!msg); $(".error", wrap).textContent = msg;
        f.setAttribute("aria-invalid", msg ? "true" : "false");
        if (msg) ok = false;
      });
      return ok;
    }
    function composeText() {
      var d = new FormData(form);
      return "New enquiry from website\n\nName: " + d.get("name") + "\nEmail: " + d.get("email") +
        "\nPhone: " + (d.get("phone") || "-") + "\nService: " + d.get("service") + "\n\nMessage:\n" + d.get("message");
    }
    function show(type, msg) { status.className = "form-status is-" + type; status.textContent = msg; status.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" }); }

    form.addEventListener("input", function (e) {
      var n = e.target.name; if (rules[n] && e.target.closest(".field").classList.contains("invalid")) validate();
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.website && form.website.value) return;           // honeypot
      if (!validate()) { show("err", "Please fix the highlighted fields and try again."); return; }
      if (SITE.formEndpoint) {
        var btn = $("button[type=submit]", form); btn.disabled = true;
        fetch(SITE.formEndpoint, { method: "POST", headers: { "Accept": "application/json" }, body: new FormData(form) })
          .then(function (r) { if (!r.ok) throw new Error(); form.reset(); show("ok", "Thank you. Your message has been sent and we will reply within one business day."); })
          .catch(function () { show("err", "We could not send your message. Please email " + SITE.email + " or use WhatsApp."); })
          .then(function () { btn.disabled = false; });
      } else {
        var d = new FormData(form);
        location.href = "mailto:" + SITE.email + "?subject=" + encodeURIComponent("Project enquiry: " + d.get("service")) + "&body=" + encodeURIComponent(composeText());
        show("ok", "Your email app is opening with your message ready to send.");
      }
    });
    var wa = $("#form-whatsapp");
    if (wa) wa.addEventListener("click", function () {
      if (!validate()) { show("err", "Please complete the required fields first."); return; }
      window.open(waBase + "?text=" + encodeURIComponent(composeText()), "_blank", "noopener");
    });
  }

  /* Subtle 3D tilt on hero artwork (desktop pointers only) */
  var art = $(".hero__art");
  if (art && !reduced && window.matchMedia("(hover: hover)").matches) {
    art.addEventListener("mousemove", function (e) {
      var r = art.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      art.style.transform = "perspective(900px) rotateY(" + (x * 7) + "deg) rotateX(" + (-y * 7) + "deg)";
    });
    art.addEventListener("mouseleave", function () { art.style.transform = ""; });
  }

  /* Footer year, back to top */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  var tt = $(".to-top");
  if (tt) tt.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); });
})();
