/* 开卷备考 · 核心工具：数据访问、本地存储、题库加载、搜索 */
(function () {
  'use strict';

  var C = window.KJ_CATALOG;
  var KJ = (window.KJ = window.KJ || {});

  /* ── DOM 与字符串 ── */
  KJ.$ = function (sel, root) { return (root || document).querySelector(sel); };
  KJ.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  KJ.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  KJ.fmt = function (n) { return Number(n).toLocaleString('zh-CN'); };
  KJ.ext = function (url, text, cls) {
    return '<a class="' + (cls || '') + '" href="' + KJ.esc(url) + '" target="_blank" rel="noopener noreferrer">' + text + '</a>';
  };

  var toastTimer = null;
  KJ.toast = function (msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  };

  KJ.copy = function (text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallback(); });
    }
    return Promise.resolve(fallback());
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    }
  };

  KJ.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };

  /* ── 本地存储（隐私模式下可能不可用，全部 try/catch） ── */
  var mem = {};
  KJ.store = {
    get: function (key, dflt) {
      try {
        var v = localStorage.getItem('kj.' + key);
        return v == null ? (key in mem ? mem[key] : dflt) : JSON.parse(v);
      } catch (e) { return key in mem ? mem[key] : dflt; }
    },
    set: function (key, val) {
      mem[key] = val;
      try { localStorage.setItem('kj.' + key, JSON.stringify(val)); } catch (e) { /* 仅内存保存 */ }
    }
  };

  /* ── 目录数据 ── */
  var examById = {};
  var catById = {};
  C.exams.forEach(function (e) { examById[e.id] = e; });
  C.categories.forEach(function (c) { catById[c.id] = c; });
  KJ.C = C;
  KJ.exam = function (id) { return examById[id] || null; };
  KJ.cat = function (id) { return catById[id] || null; };
  KJ.examsIn = function (catId) { return C.exams.filter(function (e) { return e.cat === catId; }); };
  KJ.family = function (exam) {
    return C.exams.filter(function (e) { return e.family === exam.family && e.id !== exam.id; });
  };
  KJ.groupByFamily = function (list) {
    var order = [];
    var map = {};
    list.forEach(function (e) {
      if (!map[e.family]) { map[e.family] = []; order.push(e.family); }
      map[e.family].push(e);
    });
    return order.map(function (f) { return { family: f, exams: map[f] }; });
  };

  /* ── 题库加载：动态插入 <script>，file:// 下也能用 ── */
  window.KJ_QB = window.KJ_QB || {};
  var pending = {};
  KJ.loadBank = function (id) {
    if (window.KJ_QB[id]) return Promise.resolve(window.KJ_QB[id]);
    var exam = examById[id];
    if (!exam || !exam.bank) return Promise.resolve(null);
    if (pending[id]) return pending[id];
    pending[id] = new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = 'data/questions/' + id + '.js';
      s.async = true;
      s.onload = function () { resolve(window.KJ_QB[id] || null); };
      s.onerror = function () { delete pending[id]; resolve(null); };
      document.head.appendChild(s);
    });
    return pending[id];
  };
  KJ.bankIds = function () { return C.exams.filter(function (e) { return e.bank; }).map(function (e) { return e.id; }); };
  KJ.loadAllBanks = function () {
    return Promise.all(KJ.bankIds().map(KJ.loadBank)).then(function (list) {
      return list.filter(Boolean);
    });
  };

  /* ── 练习进度 ──
   * progress[examId][qid] = { ok: 最近一次是否答对, n: 作答次数, r: 答对次数, t: 时间戳 }
   */
  KJ.progress = {
    all: function () { return KJ.store.get('progress', {}); },
    of: function (examId) { return KJ.store.get('progress', {})[examId] || {}; },
    record: function (examId, qid, ok) {
      var all = KJ.store.get('progress', {});
      var p = all[examId] || (all[examId] = {});
      var r = p[qid] || { n: 0, r: 0 };
      r.n += 1;
      if (ok) r.r += 1;
      r.ok = ok;
      r.t = Date.now();
      p[qid] = r;
      KJ.store.set('progress', all);
    },
    master: function (examId, qid) {
      var all = KJ.store.get('progress', {});
      if (all[examId] && all[examId][qid]) {
        all[examId][qid].ok = true;
        all[examId][qid].mastered = true;
        KJ.store.set('progress', all);
      }
    },
    reset: function (examId) {
      var all = KJ.store.get('progress', {});
      delete all[examId];
      KJ.store.set('progress', all);
    },
    summary: function (examId, bank) {
      var p = KJ.progress.of(examId);
      var done = 0, right = 0, wrong = 0;
      var topics = {};
      (bank ? bank.questions : []).forEach(function (q) {
        var t = topics[q.topic] || (topics[q.topic] = { total: 0, done: 0, right: 0 });
        t.total++;
        var r = p[q.id];
        if (r) {
          done++; t.done++;
          if (r.ok) { right++; t.right++; } else { wrong++; }
        }
      });
      return { done: done, right: right, wrong: wrong, topics: topics };
    },
    wrongIds: function (examId) {
      var p = KJ.progress.of(examId);
      return Object.keys(p).filter(function (k) { return p[k].ok === false; });
    },
    wrongCount: function () {
      var all = KJ.store.get('progress', {});
      var n = 0;
      Object.keys(all).forEach(function (e) {
        Object.keys(all[e]).forEach(function (q) { if (all[e][q].ok === false) n++; });
      });
      return n;
    }
  };

  /* ── 搜索：名称 / 简称 / 拼音缩写 / 机构 / 分类 ── */
  function norm(s) { return String(s || '').toLowerCase().replace(/[\s·（）()\-—_/、，,]+/g, ''); }
  var index = C.exams.map(function (e) {
    var cat = catById[e.cat];
    return {
      exam: e,
      name: norm(e.name),
      short: norm(e.short),
      aliases: (e.aliases || []).map(norm),
      family: norm(e.family),
      rest: norm([e.org, e.summary, e.kw, cat && cat.name, cat && cat.desc].join(' '))
    };
  });
  KJ.search = function (q) {
    var k = norm(q);
    if (!k) return [];
    var res = [];
    index.forEach(function (it) {
      var s = 0;
      if (it.short === k || it.aliases.indexOf(k) >= 0) s = 100;
      else if (it.short.indexOf(k) === 0 || it.name.indexOf(k) === 0) s = 80;
      else if (it.aliases.some(function (a) { return a.indexOf(k) === 0; })) s = 70;
      else if (it.short.indexOf(k) >= 0 || it.name.indexOf(k) >= 0) s = 60;
      else if (it.family.indexOf(k) >= 0) s = 50;
      else if (it.rest.indexOf(k) >= 0) s = 30;
      if (s) res.push({ exam: it.exam, score: s + (it.exam.bank ? 5 : 0) + (it.exam.hot ? 3 : 0) });
    });
    res.sort(function (a, b) { return b.score - a.score; });
    return res.map(function (r) { return r.exam; });
  };

  /* ── 资源链接 ── */
  KJ.platform = function (id) {
    for (var i = 0; i < C.platforms.length; i++) if (C.platforms[i].id === id) return C.platforms[i];
    return null;
  };
  KJ.searchUrl = function (platformId, q) {
    var p = KJ.platform(platformId);
    if (!p || !p.search) return p ? p.home : '#';
    return p.search.replace('{q}', encodeURIComponent(q));
  };

  /* ── 倒计时 ── */
  KJ.daysUntil = function (dateStr) {
    if (!dateStr) return null;
    var parts = dateStr.split('-').map(Number);
    var target = new Date(parts[0], parts[1] - 1, parts[2]);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((target - today) / 86400000);
  };
})();
