/* 开卷备考 · 练习与闪卡组件 */
(function () {
  'use strict';
  var KJ = window.KJ;
  var esc = KJ.esc;
  var KEYS = ['A', 'B', 'C', 'D'];

  /* ───────────── 练习 ─────────────
   * 模式：seq 顺序练习 / random 随机练习 / wrong 错题重做 / exam 模拟测验（交卷后统一看解析）
   */
  function Quiz(root, exam, bank, mode) {
    this.root = root;
    this.exam = exam;
    this.bank = bank;
    this.mode = mode || 'seq';
    this.onKey = this.onKey.bind(this);
    document.addEventListener('keydown', this.onKey);
    this.start(this.mode);
  }

  Quiz.prototype.destroy = function () { document.removeEventListener('keydown', this.onKey); };

  Quiz.prototype.start = function (mode) {
    this.mode = mode;
    var qs = this.bank.questions;
    if (mode === 'random' || mode === 'exam') qs = KJ.shuffle(qs);
    if (mode === 'wrong') {
      var wrong = KJ.progress.wrongIds(this.exam.id);
      qs = qs.filter(function (q) { return wrong.indexOf(q.id) >= 0; });
    }
    this.list = qs.map(function (q) {
      /* 每道题独立打乱选项：order[显示位置] = 原选项下标 */
      return { q: q, order: KJ.shuffle([0, 1, 2, 3]), picked: null };
    });
    this.i = 0;
    this.submitted = false;
    this.render();
  };

  Quiz.prototype.current = function () { return this.list[this.i]; };

  Quiz.prototype.render = function () {
    var self = this;
    var modes = [['seq', '顺序练习'], ['random', '随机练习'], ['wrong', '错题重做'], ['exam', '模拟测验']];
    var wrongN = KJ.progress.wrongIds(this.exam.id).length;
    var html = '<div class="layout-side"><div>';
    html += '<div class="quiz-toolbar"><div class="seg" role="group" aria-label="练习模式">' +
      modes.map(function (m) {
        var label = m[1] + (m[0] === 'wrong' ? '（' + wrongN + '）' : '');
        return '<button type="button" data-mode="' + m[0] + '" aria-pressed="' + (self.mode === m[0]) + '">' + label + '</button>';
      }).join('') + '</div>';
    if (this.list.length) html += '<span class="quiz-progress">第 ' + (this.i + 1) + ' / ' + this.list.length + ' 题</span>';
    html += '</div>';

    if (!this.list.length) {
      html += '<div class="card empty"><h3>' + (this.mode === 'wrong' ? '错题已清空' : '暂无题目') + '</h3>' +
        '<p>' + (this.mode === 'wrong' ? '没有待重做的错题。先去做几道题吧。' : '') + '</p>' +
        '<button class="btn btn-primary" type="button" data-mode="seq">开始顺序练习</button></div>';
    } else if (this.mode === 'exam' && this.submitted) {
      html += this.renderResult();
    } else {
      html += this.renderQuestion();
    }
    html += '</div><aside class="side-sticky">' + this.renderSide() + '</aside></div>';
    this.root.innerHTML = html;

    KJ.$$('[data-mode]', this.root).forEach(function (b) {
      b.addEventListener('click', function () { self.start(b.getAttribute('data-mode')); });
    });
    KJ.$$('.opt', this.root).forEach(function (b) {
      b.addEventListener('click', function () { self.pick(Number(b.getAttribute('data-pos'))); });
    });
    var act = function (sel, fn) { var el = KJ.$(sel, self.root); if (el) el.addEventListener('click', fn); };
    act('[data-act="prev"]', function () { self.go(-1); });
    act('[data-act="next"]', function () { self.go(1); });
    act('[data-act="submit"]', function () { self.submit(); });
    act('[data-act="restart"]', function () { self.start(self.mode); });
    act('[data-act="reset"]', function () {
      if (window.confirm('确定清空「' + self.exam.short + '」的全部练习记录吗？')) {
        KJ.progress.reset(self.exam.id);
        self.start(self.mode === 'wrong' ? 'seq' : self.mode);
        KJ.toast('练习记录已清空');
      }
    });
    act('[data-act="master"]', function () {
      var cur = self.current();
      KJ.progress.master(self.exam.id, cur.q.id);
      KJ.toast('已标记为掌握，移出错题本');
      self.render();
    });
    act('[data-act="ask"]', function () {
      KJ.pendingPrompt = KJ.AI.questionPrompt(self.exam, self.current().q);
      location.hash = '#/e/' + self.exam.id + '/ai';
    });
  };

  Quiz.prototype.renderQuestion = function () {
    var cur = this.current();
    var q = cur.q;
    var reveal = cur.picked !== null && this.mode !== 'exam';
    var html = '<article class="card qcard" aria-live="polite">';
    html += '<div class="qmeta"><span class="badge badge-brand">' + esc(q.topic) + '</span>';
    var rec = KJ.progress.of(this.exam.id)[q.id];
    if (rec && rec.ok === false) html += '<span class="badge badge-accent">错题</span>';
    else if (rec && rec.ok) html += '<span class="badge badge-ok">做对过</span>';
    html += '</div>';
    html += '<div class="qtext">' + esc(q.q) + '</div>';
    if (q.code) html += '<pre class="qcode"><code>' + esc(q.code) + '</code></pre>';
    html += '<div class="options">';
    cur.order.forEach(function (orig, pos) {
      var cls = 'opt';
      if (reveal) {
        if (orig === q.answer) cls += ' correct';
        else if (pos === cur.picked) cls += ' wrong';
      } else if (cur.picked === pos) {
        cls += ' selected';
      }
      html += '<button type="button" class="' + cls + '" data-pos="' + pos + '"' + (reveal ? ' disabled' : '') + '>' +
        '<span class="key">' + KEYS[pos] + '</span><span>' + esc(q.options[orig]) + '</span></button>';
    });
    html += '</div>';

    if (reveal) {
      var ok = cur.order[cur.picked] === q.answer;
      var rightPos = cur.order.indexOf(q.answer);
      html += '<div class="explain"><div class="verdict ' + (ok ? 'ok' : 'bad') + '">' +
        (ok ? '回答正确' : '回答错误，正确答案是 ' + KEYS[rightPos]) + '</div>' +
        '<p>' + esc(q.explain) + '</p>' +
        (q.basis ? '<div class="basis">依据：' + esc(q.basis) + '</div>' : '') + '</div>';
    }

    html += '<div class="qactions">';
    html += '<button class="btn btn-sm" type="button" data-act="prev"' + (this.i === 0 ? ' disabled' : '') + '>上一题</button>';
    if (this.mode === 'exam') {
      var answered = this.list.filter(function (x) { return x.picked !== null; }).length;
      if (this.i < this.list.length - 1) html += '<button class="btn btn-sm btn-primary" type="button" data-act="next">下一题</button>';
      html += '<span class="spacer"></span><span class="hint-keys">已作答 ' + answered + ' / ' + this.list.length + '</span>';
      html += '<button class="btn btn-sm btn-accent" type="button" data-act="submit">交卷</button>';
    } else {
      if (this.i < this.list.length - 1) html += '<button class="btn btn-sm btn-primary" type="button" data-act="next">下一题</button>';
      else if (reveal) html += '<button class="btn btn-sm btn-primary" type="button" data-act="restart">再练一轮</button>';
      html += '<span class="spacer"></span>';
      if (reveal) {
        if (rec && rec.ok === false) html += '<button class="btn btn-sm btn-ghost" type="button" data-act="master">我已掌握</button>';
        html += '<button class="btn btn-sm btn-ghost" type="button" data-act="ask">问 AI 助教</button>';
      } else {
        html += '<span class="hint-keys hint-keys-kbd">快捷键：A–D / 1–4 作答，→ 下一题</span>';
      }
    }
    html += '</div></article>';
    return html;
  };

  Quiz.prototype.renderResult = function () {
    var right = 0;
    var topics = {};
    this.list.forEach(function (x) {
      var t = topics[x.q.topic] || (topics[x.q.topic] = { total: 0, right: 0 });
      t.total++;
      if (x.picked !== null && x.order[x.picked] === x.q.answer) { right++; t.right++; }
    });
    var pct = Math.round(right / this.list.length * 100);
    var html = '<div class="card result"><div class="muted">模拟测验得分</div><div class="score">' + pct + '</div>' +
      '<p>共 ' + this.list.length + ' 题，答对 ' + right + ' 题</p>' +
      '<button class="btn btn-primary" type="button" data-act="restart">再测一次</button></div>';
    html += '<h3 style="margin-top:24px">分模块得分</h3><div class="card">';
    Object.keys(topics).forEach(function (k) {
      var t = topics[k];
      var p = Math.round(t.right / t.total * 100);
      html += '<div class="topic-row"><div class="top"><span>' + esc(k) + '</span><span>' + t.right + ' / ' + t.total + '</span></div>' +
        '<div class="bar"><i style="width:' + p + '%"></i></div></div>';
    });
    html += '</div><h3 style="margin-top:24px">逐题解析</h3>';
    this.list.forEach(function (x, n) {
      var ok = x.picked !== null && x.order[x.picked] === x.q.answer;
      html += '<div class="card wrong-item" style="margin-bottom:10px"><div class="qmeta">' +
        '<span class="badge ' + (ok ? 'badge-ok' : 'badge-accent') + '">' + (ok ? '正确' : (x.picked === null ? '未作答' : '错误')) + '</span>' +
        '<span class="badge">' + esc(x.q.topic) + '</span></div>' +
        '<div class="q">' + (n + 1) + '. ' + esc(x.q.q) + '</div>' +
        (x.q.code ? '<pre class="qcode"><code>' + esc(x.q.code) + '</code></pre>' : '') +
        (x.picked !== null && !ok ? '<div class="a">你的答案：' + esc(x.q.options[x.order[x.picked]]) + '</div>' : '') +
        '<div class="a">正确答案：' + esc(x.q.options[x.q.answer]) + '</div>' +
        '<div class="a" style="margin-top:6px">' + esc(x.q.explain) + '</div></div>';
    });
    return html;
  };

  Quiz.prototype.renderSide = function () {
    var s = KJ.progress.summary(this.exam.id, this.bank);
    var total = this.bank.questions.length;
    var acc = s.done ? Math.round(s.right / s.done * 100) : 0;
    var html = '<div class="card"><h3>我的进度</h3>' +
      '<div class="topic-row"><div class="top"><span>已做 ' + s.done + ' / ' + total + ' 题</span><span>正确率 ' + (s.done ? acc + '%' : '—') + '</span></div>' +
      '<div class="bar"><i style="width:' + Math.round(s.done / total * 100) + '%"></i></div></div>';
    html += '<h4 style="margin:16px 0 10px;font-size:15px">分模块正确率</h4>';
    Object.keys(s.topics).forEach(function (k) {
      var t = s.topics[k];
      var p = t.done ? Math.round(t.right / t.done * 100) : 0;
      html += '<div class="topic-row"><div class="top"><span>' + esc(k) + '</span><span class="muted">' +
        (t.done ? p + '%（' + t.right + '/' + t.done + '）' : '未做') + '</span></div>' +
        '<div class="bar"><i style="width:' + p + '%"></i></div></div>';
    });
    html += '<button class="btn btn-sm btn-ghost" type="button" data-act="reset" style="margin-top:6px">清空练习记录</button></div>';
    html += '<p class="note">练习题为原创模拟题，用于巩固知识点，不代表真题难度与出题方向。进度只保存在本机浏览器。</p>';
    return html;
  };

  Quiz.prototype.pick = function (pos) {
    var cur = this.current();
    if (!cur) return;
    if (this.mode === 'exam') {
      if (this.submitted) return;
      cur.picked = pos;
      this.render();
      return;
    }
    if (cur.picked !== null) return;
    cur.picked = pos;
    KJ.progress.record(this.exam.id, cur.q.id, cur.order[pos] === cur.q.answer);
    this.render();
  };

  Quiz.prototype.go = function (d) {
    var n = this.i + d;
    if (n < 0 || n >= this.list.length) return;
    this.i = n;
    this.render();
    var top = KJ.$('.quiz-toolbar', this.root);
    if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView({ block: 'start' });
  };

  Quiz.prototype.submit = function () {
    var self = this;
    var left = this.list.filter(function (x) { return x.picked === null; }).length;
    if (left && !window.confirm('还有 ' + left + ' 题未作答，确定交卷吗？')) return;
    this.list.forEach(function (x) {
      if (x.picked !== null) KJ.progress.record(self.exam.id, x.q.id, x.order[x.picked] === x.q.answer);
    });
    this.submitted = true;
    this.render();
    window.scrollTo(0, 0);
  };

  Quiz.prototype.onKey = function (e) {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (!this.list.length || this.submitted) return;
    var k = e.key.toUpperCase();
    var pos = KEYS.indexOf(k);
    if (pos < 0 && /^[1-4]$/.test(k)) pos = Number(k) - 1;
    if (pos >= 0) { e.preventDefault(); this.pick(pos); return; }
    if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); this.go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); this.go(-1); }
  };

  /* ───────────── 闪卡 ───────────── */
  function Flash(root, exam, bank) {
    this.root = root;
    this.exam = exam;
    this.cards = bank.flashcards.map(function (c, i) { return { c: c, i: i }; });
    this.i = 0;
    this.flipped = false;
    this.onKey = this.onKey.bind(this);
    document.addEventListener('keydown', this.onKey);
    this.render();
  }
  Flash.prototype.destroy = function () { document.removeEventListener('keydown', this.onKey); };
  Flash.prototype.known = function () { return KJ.store.get('cards', {})[this.exam.id] || []; };
  Flash.prototype.mark = function (yes) {
    var all = KJ.store.get('cards', {});
    var k = all[this.exam.id] || [];
    var idx = this.cards[this.i].i;
    var at = k.indexOf(idx);
    if (yes && at < 0) k.push(idx);
    if (!yes && at >= 0) k.splice(at, 1);
    all[this.exam.id] = k;
    KJ.store.set('cards', all);
    this.go(1, true);
  };
  Flash.prototype.render = function () {
    var self = this;
    var cur = this.cards[this.i];
    var known = this.known();
    var html = '<div class="flash-wrap">' +
      '<div class="quiz-toolbar"><span class="badge badge-brand">已掌握 ' + known.length + ' / ' + this.cards.length + '</span>' +
      '<span class="quiz-progress">第 ' + (this.i + 1) + ' / ' + this.cards.length + ' 张</span></div>' +
      '<div class="flash' + (this.flipped ? ' flipped' : '') + '" role="button" tabindex="0" aria-label="点击翻面">' +
      '<div class="flash-inner">' +
      '<div class="flash-face flash-front"><span class="label">正面' + (known.indexOf(cur.i) >= 0 ? ' · 已掌握' : '') + '</span><div class="txt">' + esc(cur.c.front) + '</div>' +
      '<div class="muted small" style="margin-top:14px">点击卡片或按空格翻面</div></div>' +
      '<div class="flash-face flash-back"><span class="label">背面</span><div class="txt">' + esc(cur.c.back) + '</div></div>' +
      '</div></div>' +
      '<div class="flash-nav">' +
      '<button class="btn btn-sm" type="button" data-f="prev">← 上一张</button>' +
      '<button class="btn btn-sm" type="button" data-f="no">还不熟</button>' +
      '<button class="btn btn-sm btn-primary" type="button" data-f="yes">记住了</button>' +
      '<button class="btn btn-sm" type="button" data-f="next">下一张 →</button>' +
      '<button class="btn btn-sm btn-ghost" type="button" data-f="shuffle">打乱顺序</button>' +
      '</div></div>';
    this.root.innerHTML = html;
    var card = KJ.$('.flash', this.root);
    card.addEventListener('click', function () { self.flip(); });
    card.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); self.flip(); } });
    KJ.$$('[data-f]', this.root).forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-f');
        if (f === 'prev') self.go(-1);
        if (f === 'next') self.go(1);
        if (f === 'yes') self.mark(true);
        if (f === 'no') self.mark(false);
        if (f === 'shuffle') { self.cards = KJ.shuffle(self.cards); self.i = 0; self.flipped = false; self.render(); KJ.toast('已打乱顺序'); }
      });
    });
  };
  Flash.prototype.flip = function () {
    this.flipped = !this.flipped;
    var card = KJ.$('.flash', this.root);
    if (card) card.classList.toggle('flipped', this.flipped);
  };
  Flash.prototype.go = function (d, wrap) {
    var n = this.i + d;
    if (n >= this.cards.length) n = wrap ? 0 : this.cards.length - 1;
    if (n < 0) n = 0;
    this.i = n;
    this.flipped = false;
    this.render();
  };
  Flash.prototype.onKey = function (e) {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === ' ') { e.preventDefault(); this.flip(); }
    if (e.key === 'ArrowRight') this.go(1);
    if (e.key === 'ArrowLeft') this.go(-1);
  };

  KJ.Quiz = Quiz;
  KJ.Flash = Flash;
})();
