// Patch Dispatch: Google Analytics only after explicit consent.
// Nothing from Google is requested until the visitor clicks "Accept".
(function () {
  "use strict";
  var me = document.currentScript;
  var GA_ID = me && me.getAttribute("data-ga-id");
  var KEY = "pd_consent";
  var box = document.getElementById("consent");
  if (!GA_ID || !box) return;

  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var loaded = false;
  function loadGA() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied"
    });
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  }

  function clearGACookies() {
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (name === "_ga" || name.indexOf("_ga_") === 0) {
        var host = location.hostname, parts = host.split(".");
        [host, "." + host, "." + parts.slice(-2).join(".")].forEach(function (d) {
          document.cookie = name + "=; Max-Age=0; path=/; domain=" + d;
        });
        document.cookie = name + "=; Max-Age=0; path=/";
      }
    });
  }

  function decide(v) {
    var before = stored();
    store(v);
    box.hidden = true;
    if (v === "granted") { loadGA(); }
    else if (before === "granted") { clearGACookies(); location.reload(); }
  }

  box.querySelectorAll("[data-consent]").forEach(function (b) {
    b.addEventListener("click", function () { decide(b.getAttribute("data-consent")); });
  });
  document.querySelectorAll("[data-consent-settings]").forEach(function (b) {
    b.hidden = false;
    b.addEventListener("click", function () { box.hidden = false; box.querySelector("[data-consent=denied]").focus(); });
  });

  var choice = stored();
  if (choice === "granted") loadGA();
  else if (choice !== "denied") box.hidden = false;
})();
