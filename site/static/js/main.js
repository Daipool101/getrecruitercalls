// GetShortlisted — tiny progressive-enhancement script (no libraries): menu, scroll effects, plans, lead form.
(function () {
  "use strict";

  var MAX_FILE = 1900000; // keep in sync with src/worker.js (D1 row limit is 2 MB)
  var FILE_OK = /\.(pdf|docx?)$/i;

  // ---------------- Mobile navigation ----------------
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var closeNav = function () { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); };
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeNav(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { closeNav(); toggle.focus(); } });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("open") && !nav.contains(e.target) && !toggle.contains(e.target)) closeNav();
    });
  }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var smallScreen = window.matchMedia && window.matchMedia("(max-width: 760px)").matches;

  // ---------------- Header shadow (class only — no size change, so nothing jumps while scrolling) ----------------
  var header = document.querySelector(".site-header");
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      if (header) header.classList.toggle("scrolled", (window.scrollY || window.pageYOffset) > 8);
    });
  }, { passive: true });

  // ---------------- Sticky mobile CTA ----------------
  // Shown only when no hero, no lead form and no footer is on screen — so it never pops in and out
  // while the visitor moves between the hero and the form.
  var sticky = document.querySelector("[data-sticky-cta]");
  if (sticky && "IntersectionObserver" in window) {
    var watched = document.querySelectorAll(".hero, .page-hero, [data-lead-form], .site-footer");
    var visible = new Set();
    var stickyIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) visible.add(en.target); else visible.delete(en.target); });
      sticky.classList.toggle("show", visible.size === 0);
    }, { rootMargin: "0px 0px -15% 0px" });
    Array.prototype.forEach.call(watched, function (el) { stickyIo.observe(el); });
  }

  // ---------------- Scroll reveal (desktop only; phones get instant, smooth scrolling) ----------------
  if (!reduceMotion && !smallScreen && "IntersectionObserver" in window) {
    var groups = [".section-head", ".steps > li", ".grid > *", ".svc", ".plan", ".faq-item", ".included > *", ".problems > li",
      ".chips", ".cta-inner > *", ".prose > *", ".tldr"];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add("in");
        io.unobserve(el);
        setTimeout(function () { el.removeAttribute("data-reveal"); el.classList.remove("in"); el.style.removeProperty("--d"); }, 1300);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    Array.prototype.forEach.call(document.querySelectorAll(groups.join(",")), function (el) {
      if (el.closest(".hero, #get-started, .lead-form") || el.hasAttribute("data-reveal")) return;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
      var i = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.setAttribute("data-reveal", "");
      el.style.setProperty("--d", Math.min(i, 5) * 80 + "ms");
      io.observe(el);
    });
  }

  // ---------------- UTM + plan pre-selection ----------------
  var params = new URLSearchParams(location.search);
  ["utm_source", "utm_medium", "utm_campaign"].forEach(function (k) {
    try { if (params.get(k)) sessionStorage.setItem(k, params.get(k).slice(0, 100)); } catch (e) {}
  });

  var forms = document.querySelectorAll("[data-lead-form]");
  function selectPlan(plan) {
    Array.prototype.forEach.call(forms, function (f) {
      if (f.elements.plan && Array.prototype.some.call(f.elements.plan.options, function (o) { return o.value === plan; })) f.elements.plan.value = plan;
    });
  }
  if (params.get("plan")) selectPlan(params.get("plan"));
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-plan]");
    if (a) selectPlan(a.getAttribute("data-plan"));
  });

  if (params.get("error") === "1") {
    var first = document.querySelector("[data-lead-form] .form-status");
    if (first) { first.textContent = "Something was missing or invalid. Please check the form and try again."; first.className = "form-status err"; }
  }

  // ---------------- Lead form ----------------
  Array.prototype.forEach.call(forms, function (form) {
    var el = form.elements;
    el.source_page.value = location.pathname;
    ["utm_source", "utm_medium", "utm_campaign"].forEach(function (k) {
      try { el[k].value = sessionStorage.getItem(k) || ""; } catch (e) {}
    });

    var status = form.querySelector(".form-status");
    var button = form.querySelector('button[type="submit"]');
    var fileInput = el.resume;
    var fileLabel = form.querySelector(".file-name");

    function setError(msg, field) {
      status.textContent = msg;
      status.className = "form-status err";
      if (field) { field.setAttribute("aria-invalid", "true"); try { field.focus({ preventScroll: false }); } catch (x) { field.focus(); } }
      return false;
    }

    function checkFile() {
      var f = fileInput && fileInput.files && fileInput.files[0];
      if (!f) { if (fileLabel) fileLabel.textContent = ""; form.classList.remove("has-file"); return null; }
      if (fileLabel) fileLabel.textContent = f.name + " · " + Math.max(1, Math.round(f.size / 1024)) + " KB";
      form.classList.add("has-file");
      if (!FILE_OK.test(f.name)) return "Please upload your resume as PDF or Word (.pdf, .doc, .docx).";
      if (f.size > MAX_FILE) return "Your resume file is larger than 2 MB. Please upload a smaller PDF.";
      return "";
    }
    if (fileInput) fileInput.addEventListener("change", function () {
      fileInput.removeAttribute("aria-invalid");
      var err = checkFile();
      if (err) setError(err, fileInput); else if (status.classList.contains("err")) { status.textContent = ""; status.className = "form-status"; }
    });

    form.addEventListener("input", function (e) {
      if (e.target.hasAttribute("aria-invalid")) e.target.removeAttribute("aria-invalid");
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      Array.prototype.forEach.call(form.querySelectorAll("[aria-invalid]"), function (n) { n.removeAttribute("aria-invalid"); });

      var phoneDigits = el.phone.value.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "").replace(/^0(?=\d{10}$)/, "");
      var login = el.naukri_login.value.trim();
      var fileErr = checkFile();

      if (el.name.value.trim().length < 2) return setError("Please enter your full name.", el.name);
      if (!/^[6-9]\d{9}$/.test(phoneDigits)) return setError("Please enter a valid 10-digit mobile number.", el.phone);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.email.value.trim())) return setError("Please enter a valid email address.", el.email);
      if (fileErr) return setError(fileErr, fileInput);
      if (!login && fileErr === null) return setError("Please upload your resume or enter your Naukri login email / mobile.", fileInput);
      if (login && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(login) && !/^(\+?91)?[6-9]\d{9}$/.test(login.replace(/[\s-]/g, "")))
        return setError("Naukri login should be the email or mobile number you use on Naukri.", el.naukri_login);
      if (!el.experience.value) return setError("Please select your experience.", el.experience);

      button.disabled = true;
      var label = button.innerHTML;
      button.textContent = fileErr === "" ? "Uploading…" : "Sending…";
      status.textContent = "";
      status.className = "form-status";

      fetch(form.action, { method: "POST", headers: { "Accept": "application/json" }, body: new FormData(form) })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (res) {
          if (res && res.ok) {
            try { if (window.gtag) window.gtag("event", "generate_lead"); } catch (x) {}
            form.innerHTML =
              '<div class="form-success"><div class="big"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6L20.1 8.4 18.7 7z" fill="#0F3D3A"/></svg></div>' +
              '<h2 class="form-title">Done! We’ve got your details.</h2>' +
              '<p class="form-sub">We’ll message you on WhatsApp within 24 hours to confirm your plan. Keep your phone handy.</p>' +
              '<p class="form-sub" style="margin-top:14px"><a class="btn btn-wa btn-sm" href="/api/whatsapp?from=thanks" rel="nofollow">Chat on WhatsApp now</a></p></div>';
            form.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
          } else {
            button.disabled = false; button.innerHTML = label;
            if (window.turnstile) try { window.turnstile.reset(); } catch (x) {}
            setError((res && res.error) || "Something went wrong. Please try again.");
          }
        })
        .catch(function () {
          button.disabled = false; button.innerHTML = label;
          setError("Network error. Please check your internet and try again.");
        });
    });
  });
})();
