// GetRecruiterCalls — tiny progressive-enhancement script (no libraries).
(function () {
  "use strict";

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  // Remember UTM params for the session so they get attached to the lead.
  var params = new URLSearchParams(location.search);
  ["utm_source", "utm_medium", "utm_campaign"].forEach(function (k) {
    try { if (params.get(k)) sessionStorage.setItem(k, params.get(k).slice(0, 100)); } catch (e) {}
  });

  // Show error banner when the no-JS fallback redirected back with ?error=1
  if (params.get("error") === "1") {
    var first = document.querySelector("[data-lead-form] .form-status");
    if (first) { first.textContent = "Something was missing or invalid. Please check the form and try again."; first.className = "form-status err"; }
  }

  var forms = document.querySelectorAll("[data-lead-form]");
  Array.prototype.forEach.call(forms, function (form) {
    form.elements.source_page.value = location.pathname;
    ["utm_source", "utm_medium", "utm_campaign"].forEach(function (k) {
      try { form.elements[k].value = sessionStorage.getItem(k) || ""; } catch (e) {}
    });

    var status = form.querySelector(".form-status");
    var button = form.querySelector('button[type="submit"]');

    function setError(msg, field) {
      status.textContent = msg;
      status.className = "form-status err";
      if (field) { field.setAttribute("aria-invalid", "true"); field.focus(); }
    }

    form.addEventListener("input", function (e) {
      if (e.target.hasAttribute("aria-invalid")) e.target.removeAttribute("aria-invalid");
    });

    function isUrl(v) { return /^https?:\/\/\S+\.\S+/i.test(v); }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var el = form.elements;
      Array.prototype.forEach.call(form.querySelectorAll("[aria-invalid]"), function (n) { n.removeAttribute("aria-invalid"); });

      var phoneDigits = el.phone.value.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "").replace(/^0(?=\d{10}$)/, "");
      // Help users who paste links without https://
      ["naukri_url", "resume_url"].forEach(function (k) {
        var v = el[k].value.trim();
        if (v && !/^https?:\/\//i.test(v) && /\./.test(v)) el[k].value = "https://" + v;
      });

      if (el.name.value.trim().length < 2) return setError("Please enter your full name.", el.name);
      if (!/^[6-9]\d{9}$/.test(phoneDigits)) return setError("Please enter a valid 10-digit mobile number.", el.phone);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.email.value.trim())) return setError("Please enter a valid email address.", el.email);
      var nk = el.naukri_url.value.trim(), rs = el.resume_url.value.trim();
      if (!nk && !rs) return setError("Please share your Naukri profile link or resume link.", el.naukri_url);
      if (nk && !isUrl(nk)) return setError("Please paste a valid Naukri profile link.", el.naukri_url);
      if (rs && !isUrl(rs)) return setError("Please paste a valid resume link.", el.resume_url);
      if (!el.experience.value) return setError("Please select your experience.", el.experience);

      button.disabled = true;
      var label = button.innerHTML;
      button.textContent = "Sending…";
      status.textContent = "";
      status.className = "form-status";

      fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
      })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (res) {
          if (res && res.ok) {
            try { if (window.gtag) window.gtag("event", "generate_lead"); } catch (x) {}
            form.innerHTML =
              '<div class="form-success"><div class="big"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6L20.1 8.4 18.7 7z" fill="#0F3D3A"/></svg></div>' +
              '<h2 class="form-title">Thank you! We got your details.</h2>' +
              '<p class="form-sub">We will review your profile and reach out on WhatsApp / email within 24 hours. Keep your phone handy.</p>' +
              '<p class="form-sub" style="margin-top:12px"><a href="/blog/not-getting-calls-from-naukri/">Meanwhile, read: 9 reasons you’re not getting calls →</a></p></div>';
            form.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            button.disabled = false; button.innerHTML = label;
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
