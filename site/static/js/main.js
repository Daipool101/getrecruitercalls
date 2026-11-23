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
      document.documentElement.classList.toggle("sticky-on", visible.size === 0); // lifts the WhatsApp bubble above the bar
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
            try {
              if (window.gtag) {
                var planSel = el.plan && el.plan.value;
                var price = planSel === "done-for-you" ? 8999 : 5999;
                window.gtag("event", "generate_lead", { currency: "INR", value: price, plan: planSel || "makeover", lead_source: res.source || "organic", form_page: location.pathname });
              }
            } catch (x) {}
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

// ---------------- Refer & Earn ----------------
// ?ref=AKASH on any page is remembered for 30 days and pre-fills "Referred by" on every lead form.
(function () {
  "use strict";
  var KEY = "gs_ref", DAYS = 30, CODE_RE = /^[A-Za-z]{2,12}\d{0,3}$/;
  function save(code) { try { localStorage.setItem(KEY, JSON.stringify({ c: code, t: Date.now() })); } catch (e) {} }
  function load() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || "null");
      if (v && v.c && Date.now() - v.t < DAYS * 864e5) return v.c;
    } catch (e) {}
    return "";
  }
  function lookup(code, cb) {
    fetch("/api/ref?code=" + encodeURIComponent(code), { headers: { Accept: "application/json" } })
      .then(function (r) { return r.ok ? r.json() : { ok: false }; })
      .then(cb)
      .catch(function () { cb({ ok: false }); });
  }

  var params = new URLSearchParams(location.search);
  var fromUrl = (params.get("ref") || "").trim();
  if (CODE_RE.test(fromUrl)) save(fromUrl.toUpperCase());
  var stored = load();

  Array.prototype.forEach.call(document.querySelectorAll("[data-ref-input]"), function (input) {
    var status = input.parentNode.querySelector("[data-ref-status]");
    var initial = status ? status.textContent : "";
    function show(msg, cls) { if (status) { status.textContent = msg; status.className = "hint" + (cls ? " " + cls : ""); } }
    function check() {
      var v = input.value.trim();
      if (!v) return show(initial);
      if (!CODE_RE.test(v)) return show("Thanks — we’ll match this name with our partners.", "warn");
      lookup(v, function (j) {
        if (input.value.trim() !== v) return;
        if (j && j.ok) show("✓ Referred by " + j.first_name + " (code " + j.code + ")", "ok");
        else show("We couldn’t find this code — we’ll match it by name.", "warn");
      });
    }
    if (stored && !input.value) { input.value = stored; check(); }
    input.addEventListener("change", check);
    input.addEventListener("blur", check);
  });

  // Partner sign-up form on /refer/
  var form = document.querySelector("[data-ref-form]");
  var done = document.querySelector("[data-ref-done]");
  if (!form || !done) return;
  var el = form.elements;
  var status = form.querySelector(".form-status");
  var button = form.querySelector('button[type="submit"]');
  var same = form.querySelector("[data-upi-same]");
  var upiField = form.querySelector("[data-upi-field]");
  function syncUpi() { upiField.hidden = same.checked; }
  same.addEventListener("change", syncUpi);
  syncUpi();

  function mobile(v) { var d = String(v || "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "").replace(/^0(?=\d{10}$)/, ""); return /^[6-9]\d{9}$/.test(d) ? d : ""; }
  function setError(msg, field) {
    status.textContent = msg; status.className = "form-status err";
    if (field) { field.setAttribute("aria-invalid", "true"); field.focus(); }
    return false;
  }
  form.addEventListener("input", function (e) { if (e.target.hasAttribute("aria-invalid")) e.target.removeAttribute("aria-invalid"); });

  function showDone(res) {
    var link = res.link || (location.origin + "/?ref=" + res.code);
    form.hidden = true;
    done.hidden = false;
    done.querySelector("[data-ref-code]").textContent = res.code;
    done.querySelector("[data-ref-hello]").textContent = (res.name ? res.name.split(" ")[0] + ", your" : "Your") + " referral code";
    done.querySelector("[data-ref-link]").value = link;
    var msg = "Not getting calls from Naukri? GetShortlisted fixes your Naukri profile & resume so recruiters call you. Use my referral code " + res.code + ": " + link;
    done.querySelector("[data-ref-share]").href = "https://wa.me/?text=" + encodeURIComponent(msg);
    done.querySelector("[data-ref-existing]").hidden = !res.existing;
    renderStats(res.stats);
    try { done.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (x) {}
  }

  function inr(n) { return "₹" + Number(n || 0).toLocaleString("en-IN"); }
  function renderStats(st) {
    var dash = done.querySelector("[data-ref-dash]");
    if (!st) { dash.hidden = true; return; }
    dash.hidden = false;
    ["referred", "paid_clients"].forEach(function (k) { dash.querySelector('[data-stat="' + k + '"]').textContent = st[k] || 0; });
    ["earned_inr", "paid_out_inr"].forEach(function (k) { dash.querySelector('[data-stat="' + k + '"]').textContent = inr(st[k]); });
    var due = dash.querySelector("[data-stat-due]");
    due.hidden = !(st.due_inr > 0);
    due.textContent = st.due_inr > 0 ? inr(st.due_inr) + " is on its way to your Google Pay." : "";
    var rows = dash.querySelector("[data-ref-rows]");
    rows.textContent = "";
    (st.recent || []).forEach(function (r) {
      var tr = document.createElement("tr");
      [r.date, r.friend, r.status, inr(r.amount_inr)].forEach(function (v) { var td = document.createElement("td"); td.textContent = v; tr.appendChild(td); });
      rows.appendChild(tr);
    });
    var has = (st.recent || []).length > 0;
    dash.querySelector("[data-ref-table-wrap]").hidden = !has;
    dash.querySelector("[data-ref-empty]").hidden = has;
  }

  // "Already a partner? Check my referrals"
  var check = document.querySelector("[data-ref-check]");
  var openBtn = document.querySelector("[data-ref-check-open]");
  if (check && openBtn) {
    var toggle = function (showCheck) {
      check.hidden = !showCheck; form.hidden = showCheck; openBtn.parentNode.hidden = showCheck;
      if (showCheck) check.elements.phone.focus();
    };
    openBtn.addEventListener("click", function () { toggle(true); });
    check.querySelector("[data-ref-check-close]").addEventListener("click", function () { toggle(false); });
    check.addEventListener("submit", function (e) {
      e.preventDefault();
      var st = check.querySelector(".form-status");
      if (!mobile(check.elements.phone.value) || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(check.elements.email.value.trim())) {
        st.textContent = "Enter the mobile number and email you joined with."; st.className = "form-status err"; return;
      }
      var b = check.querySelector('button[type="submit"]'); b.disabled = true;
      st.textContent = "Loading…"; st.className = "form-status";
      fetch(check.action, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(check) })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (res) {
          b.disabled = false;
          if (res && res.ok) { check.hidden = true; st.textContent = ""; showDone({ code: res.code, name: res.name, link: res.link, stats: res.stats }); }
          else { st.textContent = (res && res.error) || "Something went wrong. Please try again."; st.className = "form-status err"; }
        })
        .catch(function () { b.disabled = false; st.textContent = "Network error. Please try again."; st.className = "form-status err"; });
    });
  }

  var copyBtn = done.querySelector("[data-ref-copy]");
  copyBtn.addEventListener("click", function () {
    var box = done.querySelector("[data-ref-link]");
    function ok() { copyBtn.textContent = "Copied"; setTimeout(function () { copyBtn.textContent = "Copy"; }, 1800); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(box.value).then(ok, function () { box.select(); document.execCommand("copy"); ok(); });
    else { box.select(); document.execCommand("copy"); ok(); }
  });

  // No-JS fallback lands on /refer/?code=AKASH
  if (params.get("code") && CODE_RE.test(params.get("code"))) showDone({ code: params.get("code").toUpperCase() });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    Array.prototype.forEach.call(form.querySelectorAll("[aria-invalid]"), function (n) { n.removeAttribute("aria-invalid"); });
    if (el.name.value.trim().length < 2) return setError("Please enter your full name.", el.name);
    if (!mobile(el.phone.value)) return setError("Please enter a valid 10-digit mobile number.", el.phone);
    if (!same.checked && !mobile(el.upi_phone.value)) return setError("Please enter the 10-digit number linked to your Google Pay / UPI.", el.upi_phone);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.email.value.trim())) return setError("Please enter a valid email address.", el.email);

    button.disabled = true;
    var label = button.innerHTML;
    button.textContent = "Creating your code…";
    status.textContent = ""; status.className = "form-status";
    fetch(form.action, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (res) {
        button.disabled = false; button.innerHTML = label;
        if (res && res.ok && res.code) { showDone(res); try { if (window.gtag && !res.existing) window.gtag("event", "sign_up", { method: "referral_partner" }); } catch (x) {} }
        else { if (window.turnstile) try { window.turnstile.reset(); } catch (x) {} setError((res && res.error) || "Something went wrong. Please try again."); }
      })
      .catch(function () { button.disabled = false; button.innerHTML = label; setError("Network error. Please check your internet and try again."); });
  });
})();
