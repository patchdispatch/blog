// Patch Dispatch: search and filters, all in the browser. Reads /index.json, builds rows with
// textContent only (no innerHTML), so nothing from the data can run as code.
(function () {
  "use strict";
  var form = document.querySelector(".finder");
  var list = document.getElementById("results");
  var count = document.getElementById("count");
  var none = document.getElementById("no-results");
  if (!form || !list) return;

  var fields = { q: form.q, eco: form.eco, sev: form.sev, sort: form.sort };
  var params = new URLSearchParams(location.search);
  Object.keys(fields).forEach(function (k) { if (params.get(k)) fields[k].value = params.get(k); });

  var posts = [];
  fetch(form.getAttribute("action").replace(/posts\/$/, "") + "index.json")
    .then(function (r) { return r.json(); })
    .then(function (data) { posts = data; render(); })
    .catch(function () { /* the static list stays visible */ });

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function row(p) {
    var li = el("li", "dispatch sev-" + p.severity);
    var a = el("a"); a.href = p.url;
    var score = el("span", "score", String(p.cvss));
    score.setAttribute("aria-label", "CVSS " + p.cvss + ", " + p.severity + " severity");
    var meta = el("span", "meta");
    meta.appendChild(el("span", "", p.ecosystem));
    var t = el("time", "", new Date(p.date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }));
    t.setAttribute("datetime", p.date);
    meta.appendChild(t);
    if (p.exploited) meta.appendChild(el("span", "exploited", "Exploited in the wild"));
    a.appendChild(score); a.appendChild(el("span", "title", p.title)); a.appendChild(meta);
    li.appendChild(a);
    return li;
  }

  function render() {
    var words = fields.q.value.toLowerCase().split(/\s+/).filter(Boolean);
    var eco = fields.eco.value, sev = fields.sev.value;
    var hits = posts.filter(function (p) {
      if (eco && p.ecosystem !== eco) return false;
      if (sev && p.severity !== sev) return false;
      var hay = [p.title, p.cve, p.ecosystem, p.summary].concat(p.tags || []).join(" ").toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) !== -1; });
    });
    if (fields.sort.value === "cvss") hits.sort(function (a, b) { return (b.cvss || 0) - (a.cvss || 0); });

    list.replaceChildren.apply(list, hits.map(row));
    none.hidden = hits.length > 0;
    count.textContent = hits.length + (hits.length === 1 ? " dispatch" : " dispatches") +
      (words.length || eco || sev ? " match" : "");

    var q = new URLSearchParams();
    Object.keys(fields).forEach(function (k) { if (fields[k].value && !(k === "sort" && fields[k].value === "new")) q.set(k, fields[k].value); });
    history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : ""));
  }

  var top = document.getElementById("site-q");
  if (top) { top.value = fields.q.value; top.form.addEventListener("submit", function (e) { e.preventDefault(); fields.q.value = top.value; render(); fields.q.focus(); }); }
  form.addEventListener("input", function () { if (top) top.value = fields.q.value; render(); });
  form.addEventListener("submit", function (e) { e.preventDefault(); render(); });
})();
