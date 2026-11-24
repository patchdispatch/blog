// Patch Dispatch: search and filters, all in the browser. Reads /index.json, builds rows with
// textContent only (no innerHTML), so nothing from the data can run as code.
(function () {
  "use strict";
  var form = document.querySelector(".finder");
  var list = document.getElementById("results");
  var count = document.getElementById("count");
  var none = document.getElementById("no-results");
  var pager = document.getElementById("pager");
  var PER_PAGE = 10, page = 1;
  if (!form || !list) return;

  var fields = { q: form.q, eco: form.eco, sev: form.sev, sort: form.sort };
  var params = new URLSearchParams(location.search);
  Object.keys(fields).forEach(function (k) { if (params.get(k)) fields[k].value = params.get(k); });
  page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);

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
    if (p.updated) meta.appendChild(el("span", "updated-label", "Updated " +
      new Date(p.updated + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })));
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

    var pages = Math.max(1, Math.ceil(hits.length / PER_PAGE));
    if (page > pages) page = pages;
    list.replaceChildren.apply(list, hits.slice((page - 1) * PER_PAGE, page * PER_PAGE).map(row));
    drawPager(pages);
    none.hidden = hits.length > 0;
    count.textContent = hits.length + (hits.length === 1 ? " dispatch" : " dispatches") +
      (words.length || eco || sev ? " match" : "");

    var q = new URLSearchParams();
    Object.keys(fields).forEach(function (k) { if (fields[k].value && !(k === "sort" && fields[k].value === "new")) q.set(k, fields[k].value); });
    if (page > 1) q.set("page", page);
    history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : ""));
  }

  function drawPager(pages) {
    if (!pager) return;
    pager.replaceChildren();
    pager.hidden = pages < 2;
    function btn(label, target, current) {
      var b = el("button", current ? "current" : "", label);
      b.type = "button";
      if (current) b.setAttribute("aria-current", "page");
      if (target < 1 || target > pages) b.disabled = true;
      b.addEventListener("click", function () { page = target; render(); list.scrollIntoView({ block: "start" }); });
      return b;
    }
    pager.appendChild(btn("Previous", page - 1));
    for (var i = 1; i <= pages; i++) {
      if (pages > 7 && i > 2 && i < pages - 1 && Math.abs(i - page) > 1) {
        if (!pager.lastChild || pager.lastChild.className !== "gap") pager.appendChild(el("span", "gap", "…"));
        continue;
      }
      pager.appendChild(btn(String(i), i, i === page));
    }
    pager.appendChild(btn("Next", page + 1));
  }

  var top = document.getElementById("site-q");
  if (top) { top.value = fields.q.value; top.form.addEventListener("submit", function (e) { e.preventDefault(); fields.q.value = top.value; render(); fields.q.focus(); }); }
  form.addEventListener("input", function () { page = 1; if (top) top.value = fields.q.value; render(); });
  form.addEventListener("submit", function (e) { e.preventDefault(); render(); });
})();
