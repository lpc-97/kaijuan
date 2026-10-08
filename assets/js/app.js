/* 开卷备考 · 路由与页面 */
(function () {
  'use strict';
  var KJ = window.KJ;
  var C = KJ.C;
  var esc = KJ.esc;
  var main = document.getElementById('main');
  var cleanup = null;
  var lastBase = '';

  /* ───────── 小组件 ───────── */
  function examCard(e, extra) {
    var cat = KJ.cat(e.cat);
    return '<a class="card card-link exam-card" href="#/e/' + e.id + '">' +
      '<h3>' + esc(e.short) + '</h3>' +
      '<div class="org">' + esc(e.name) + '</div>' +
      '<p class="summary">' + esc(e.summary) + '</p>' +
      '<div class="meta"><span class="badge">' + esc(cat.name) + '</span>' +
      (e.bank ? '<span class="badge badge-ok">练习题 · 闪卡</span>' : '<span class="badge">官方入口 · 免费资源</span>') +
      (extra || '') + '</div></a>';
  }

  function crumbs(list) {
    return '<nav class="breadcrumb" aria-label="面包屑">' + list.map(function (x, i) {
      var sep = i ? '<span aria-hidden="true">/</span>' : '';
      return sep + (x[1] ? '<a href="' + x[1] + '">' + esc(x[0]) + '</a>' : '<span>' + esc(x[0]) + '</span>');
    }).join('') + '</nav>';
  }

  function chip(url, text) {
    return '<a class="chip" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(text) + '<span class="ext">↗</span></a>';
  }

  function setTitle(t) { document.title = t ? t + ' · 开卷备考' : '开卷备考 · 免费备考，国内直连'; }

  /* ───────── 首页 ───────── */
  var PATHS = [
    { t: '升学深造', ids: ['kaoyan-math', 'kaoyan-politics', 'kaoyan-english', 'zsb'] },
    { t: '考公考编', ids: ['xingce', 'shenlun', 'shiye', 'junwen'] },
    { t: '当老师', ids: ['jiaozi', 'jiaozi-ms', 'putonghua'] },
    { t: '财会金融', ids: ['chuji-kuaiji', 'cpa', 'zhengquan', 'jijin'] },
    { t: '法律与医学', ids: ['fakao', 'yishi', 'hushi', 'yaoshi'] },
    { t: 'IT 与工程', ids: ['ncre-python', 'ruankao-sd', 'yijian', 'zaojia'] },
    { t: '语言能力', ids: ['cet4', 'cet6', 'ielts', 'jlpt'] },
    { t: '生活必备', ids: ['kemu1', 'kemu4', 'putonghua', 'daoyou'] }
  ];

  function viewHome() {
    setTitle('');
    var hot = C.exams.filter(function (e) { return e.hot; });
    var bankN = C.exams.filter(function (e) { return e.bank; }).length;
    var html = '<section class="hero"><div class="wrap">' +
      '<div class="eyebrow">免费 · 国内直连 · 无需注册</div>' +
      '<h1>任何考试，<em>免费</em>开卷备考</h1>' +
      '<p class="hero-lead">考研、考公、教资、四六级、CPA、法考、软考、驾考……这里汇集官方报名入口、国内免费课程、原创练习题、闪卡和 AI 助教。所有链接都能在中国大陆直接打开，不需要翻墙。</p>' +
      '<div class="hero-search" role="button" tabindex="0" id="heroSearch" aria-label="搜索考试">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m20 20-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      '<span class="ph">搜索考试，例如：考研、教资、kaoyan、CPA</span><span class="btn btn-primary btn-sm">搜索</span></div>' +
      '<div class="hero-hot"><span>热门：</span>' + hot.map(function (e) { return '<a class="chip" href="#/e/' + e.id + '">' + esc(e.short) + '</a>'; }).join('') + '</div>' +
      '<div class="stats">' +
      '<div class="stat"><b>' + C.exams.length + '</b><span>收录考试</span></div>' +
      '<div class="stat"><b>' + C.categories.length + '</b><span>考试领域</span></div>' +
      '<div class="stat"><b id="statQ">—</b><span>原创练习题（' + bankN + ' 个题库）</span></div>' +
      '<div class="stat"><b>' + C.platforms.length + '</b><span>国内免费资源平台</span></div>' +
      '</div></div></section>';

    html += '<section class="section-sm"><div class="wrap"><div class="section-head"><div><div class="eyebrow">按领域浏览</div><h2>找到你的考试</h2></div>' +
      '<a class="btn btn-sm" href="#/exams">全部 ' + C.exams.length + ' 个考试 →</a></div><div class="grid cat-grid">' +
      C.categories.map(function (c) {
        var list = KJ.examsIn(c.id);
        var b = list.filter(function (e) { return e.bank; }).length;
        return '<a class="card card-link cat-card" href="#/c/' + c.id + '"><span class="cat-glyph" aria-hidden="true">' + esc(c.glyph) + '</span><div>' +
          '<h3>' + esc(c.name) + '</h3><p>' + esc(c.desc) + '</p>' +
          '<span class="badge">' + list.length + ' 个考试</span> ' + (b ? '<span class="badge badge-ok">' + b + ' 个题库</span>' : '') + '</div></a>';
      }).join('') + '</div></div></section>';

    html += '<section class="section"><div class="wrap"><div class="section-head"><div><div class="eyebrow">热门备考路线</div><h2>按目标选考试</h2></div></div><div class="grid grid-4">' +
      PATHS.map(function (p) {
        return '<div class="card path-card"><h3>' + esc(p.t) + '</h3><div class="chips">' + p.ids.map(function (id) {
          var e = KJ.exam(id);
          return e ? '<a class="chip" href="#/e/' + e.id + '">' + esc(e.short) + '</a>' : '';
        }).join('') + '</div></div>';
      }).join('') + '</div></div></section>';

    html += '<section class="section-sm"><div class="wrap"><div class="section-head"><div><div class="eyebrow">四种学法</div><h2>选适合你的学习方式</h2></div></div><div class="grid grid-4">' +
      feature('练', '练习题', '原创模拟题，作答即出解析和依据；按模块统计正确率，错题自动进入错题本。', '#/practice') +
      feature('卡', '闪卡', '翻面记忆概念、公式和法条，标记“记住了”，只复习还不熟的。', '#/flashcards') +
      feature('课', '免费课程', '一键搜索 B站、中国大学MOOC、学堂在线、喜马拉雅上的公开课和音频。', '#/resources') +
      feature('问', 'AI 助教', '出题、讲解、做计划。支持 DeepSeek、Kimi、通义千问、智谱，网页版免费。', '#/ai') +
      '</div></div></section>';

    html += '<section class="section"><div class="wrap"><div class="section-head"><div><div class="eyebrow">为什么是开卷备考</div><h2>同样的学习方式，换成国内能打开的资源</h2></div>' +
      '<p>境外备考网站常把视频、播客、购书放在国内无法直连的平台上。开卷备考逐项换成了国内服务。</p></div>' +
      '<div class="table-scroll"><table class="compare"><thead><tr><th>学习环节</th><th>境外备考网站常用</th><th>开卷备考使用（国内直连）</th></tr></thead><tbody>' +
      row('视频课', 'YouTube', '哔哩哔哩、国家智慧教育平台') +
      row('系统课程', 'Coursera、Khan Academy', '中国大学MOOC、学堂在线') +
      row('音频 / 播客', 'Spotify、Apple Podcasts', '喜马拉雅') +
      row('教材与书评', 'Amazon', '京东图书、豆瓣读书') +
      row('AI 答疑', 'ChatGPT、Claude', 'DeepSeek、Kimi、通义千问、智谱清言、豆包、元宝') +
      row('网页字体与脚本', 'Google Fonts、境外 CDN', '系统字体，零外部依赖') +
      row('报名与政策', '美国各州考试机构', '中国教育考试网、中国人事考试网、研招网等官方入口') +
      '</tbody></table></div></div></section>';

    html += '<section class="section-sm"><div class="wrap" style="max-width:860px"><div class="eyebrow">常见问题</div><h2>你可能想问</h2><div class="faq">' +
      faq('真的免费吗？', '是的。练习题、闪卡、资源导航全部免费，也不需要注册。AI 助教的网页版使用各平台自己的免费服务；如果选择 API 直连，费用按服务商价格从你自己的账户扣除，本站不收取任何费用。') +
      faq('需要翻墙吗？', '不需要。本站不加载任何境外字体、脚本或统计代码；官方网站、哔哩哔哩、中国大学MOOC、学堂在线、喜马拉雅、DeepSeek 等所有外部链接都可以在中国大陆直接访问。') +
      faq('练习题是真题吗？', '不是。练习题全部为原创模拟题，覆盖常考知识点，每题附解析和依据（教材、法条或计算验证）。历年真题请通过官方渠道或正规出版物获取。') +
      faq('考试时间、报名费以哪里为准？', '以官方网站当年发布的公告为准。本站只整理考试科目、题型等相对稳定的信息，并在每个考试页面给出官方入口。') +
      faq('学习进度保存在哪里？', '保存在你当前浏览器的本地存储中，不会上传到任何服务器。更换设备或清除浏览器数据后，进度会丢失。') +
      faq('AI 助教的 API Key 安全吗？', 'Key 只保存在你的浏览器本地，对话请求从你的浏览器直接发给服务商，本站没有后端服务器，看不到你的 Key。在公用电脑上使用后，请点击“清除已保存的 Key”。') +
      '</div></div></section>';

    html += '<section class="section-sm"><div class="wrap"><div class="cta"><h2>现在就开始备考</h2><p>先选一个考试，看看官方入口和免费课程，再做几道练习题。</p>' +
      '<a class="btn" href="#/exams">浏览全部考试</a></div></div></section>';

    main.innerHTML = html;
    var hs = document.getElementById('heroSearch');
    hs.addEventListener('click', openSearch);
    hs.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSearch(); } });
    KJ.loadAllBanks().then(function (banks) {
      var n = banks.reduce(function (s, b) { return s + b.questions.length; }, 0);
      var el = document.getElementById('statQ');
      if (el) el.textContent = KJ.fmt(n);
    });

    function feature(g, t, d, href) {
      return '<a class="card card-link feature" href="' + href + '"><span class="feature-icon" aria-hidden="true">' + g + '</span><h3>' + t + '</h3><p>' + d + '</p></a>';
    }
    function row(a, b, c) { return '<tr><td><b>' + a + '</b></td><td class="muted">' + b + '</td><td>' + c + '</td></tr>'; }
    function faq(q, a) { return '<details><summary>' + q + '</summary><p>' + a + '</p></details>'; }
  }

  /* ───────── 全部考试 ───────── */
  function viewExams(params) {
    setTitle('全部考试');
    var only = params.get('bank') === '1';
    var html = '<div class="wrap">' + crumbs([['首页', '#/'], ['全部考试']]) +
      '<div class="page-head"><h1>全部考试</h1><p class="lead">共收录 ' + C.exams.length + ' 个考试，覆盖 ' + C.categories.length + ' 个领域。每个考试都有官方入口和国内免费资源；带“练习题”标记的考试提供原创题库与闪卡。</p></div>' +
      '<div class="filters"><a class="filter-btn" href="#/exams" aria-pressed="' + !only + '">全部</a><a class="filter-btn" href="#/exams?bank=1" aria-pressed="' + only + '">只看有练习题的</a></div>';
    C.categories.forEach(function (c) {
      var list = KJ.examsIn(c.id).filter(function (e) { return !only || e.bank; });
      if (!list.length) return;
      html += '<section class="family"><h2 style="font-size:22px;display:flex;align-items:center;gap:10px"><span class="cat-glyph" style="width:36px;height:36px;font-size:18px">' + esc(c.glyph) + '</span><a href="#/c/' + c.id + '" style="color:inherit">' + esc(c.name) + '</a></h2>' +
        '<div class="grid grid-3">' + list.map(function (e) { return examCard(e); }).join('') + '</div></section>';
    });
    html += '</div>';
    main.innerHTML = html;
  }

  /* ───────── 分类页 ───────── */
  function viewCategory(id) {
    var c = KJ.cat(id);
    if (!c) return viewNotFound();
    setTitle(c.name);
    var list = KJ.examsIn(id);
    var html = '<div class="wrap">' + crumbs([['首页', '#/'], ['全部考试', '#/exams'], [c.name]]) +
      '<div class="page-head" style="display:flex;gap:16px;align-items:flex-start"><span class="cat-glyph" aria-hidden="true">' + esc(c.glyph) + '</span><div>' +
      '<h1>' + esc(c.name) + '</h1><p class="lead">' + esc(c.desc) + '。共 ' + list.length + ' 个考试。</p></div></div>';
    KJ.groupByFamily(list).forEach(function (g) {
      html += '<div class="family"><h3 class="family-title">' + esc(g.family) + '</h3><div class="grid grid-3">' +
        g.exams.map(function (e) { return examCard(e); }).join('') + '</div></div>';
    });
    html += '<p class="note">各考试的报名时间、费用与合格标准以官方网站当年公告为准。</p></div>';
    main.innerHTML = html;
  }

  /* ───────── 考试详情 ───────── */
  var TABS = [['overview', '概览'], ['practice', '练习题'], ['cards', '闪卡'], ['resources', '免费资源'], ['ai', 'AI 助教']];

  function viewExam(id, tab, params) {
    var e = KJ.exam(id);
    if (!e) return viewNotFound();
    tab = tab || 'overview';
    var tabName = (TABS.filter(function (t) { return t[0] === tab; })[0] || TABS[0])[1];
    setTitle(e.short + (tab === 'overview' ? '' : ' ' + tabName));
    var c = KJ.cat(e.cat);
    var html = '<div class="wrap">' + crumbs([['首页', '#/'], [c.name, '#/c/' + c.id], [e.short]]) +
      '<header class="exam-hero"><h1>' + esc(e.name) + '</h1>' +
      '<div class="org">组织机构：' + esc(e.org) + '</div>' +
      '<div class="meta"><span class="badge">' + esc(c.name) + '</span><span class="badge">' + esc(e.family) + '</span>' +
      (e.bank ? '<span class="badge badge-ok" id="bankBadge">练习题 · 闪卡</span>' : '') + '<span class="badge badge-brand">国内直连</span></div>' +
      '<p class="muted" style="max-width:48em">' + esc(e.summary) + '</p></header>' +
      '<nav class="tabs" aria-label="考试页面">' + TABS.map(function (t) {
        return '<a href="#/e/' + e.id + (t[0] === 'overview' ? '' : '/' + t[0]) + '" class="' + (t[0] === tab ? 'active' : '') + '"' + (t[0] === tab ? ' aria-current="page"' : '') + '>' + t[1] + '</a>';
      }).join('') + '</nav><div id="tabBody"></div></div>';
    main.innerHTML = html;
    var body = document.getElementById('tabBody');

    if (tab === 'practice' || tab === 'cards') {
      if (!e.bank) { body.innerHTML = noBank(e, tab); return; }
      body.innerHTML = '<div class="card empty">正在加载题库…</div>';
      KJ.loadBank(e.id).then(function (bank) {
        if (!bank) { body.innerHTML = '<div class="card empty"><h3>题库加载失败</h3><p>请检查 data/questions/' + esc(e.id) + '.js 是否存在。</p></div>'; return; }
        if (location.hash.indexOf('#/e/' + e.id) !== 0) return;
        var comp = tab === 'practice' ? new KJ.Quiz(body, e, bank, params.get('mode') || 'seq') : new KJ.Flash(body, e, bank);
        cleanup = function () { comp.destroy(); };
      });
      return;
    }
    if (tab === 'resources') { body.innerHTML = resourcesFor(e); return; }
    if (tab === 'ai') { var d = KJ.AI.mount(body, e); cleanup = d; return; }
    overview(e, body);
  }

  function noBank(e, tab) {
    return '<div class="card empty"><h3>「' + esc(e.short) + '」的' + (tab === 'practice' ? '练习题' : '闪卡') + '正在建设中</h3>' +
      '<p>现在可以先让 AI 助教按考点出题，或者去看国内的免费课程。</p>' +
      '<div class="qactions" style="justify-content:center"><a class="btn btn-primary" href="#/e/' + e.id + '/ai" id="aiQuiz">让 AI 出题考我</a>' +
      '<a class="btn" href="#/e/' + e.id + '/resources">看免费课程</a></div></div>';
  }

  function overview(e, body) {
    var dates = KJ.store.get('dates', {});
    var date = dates[e.id] || '';
    var days = KJ.daysUntil(date);
    var fam = KJ.family(e);
    var html = '<div class="layout-side"><div>';
    html += '<section class="card" style="margin-bottom:16px"><h2 style="font-size:22px">要点速览</h2><ul class="facts">' +
      e.facts.map(function (f) { return '<li><span>' + esc(f) + '</span></li>'; }).join('') + '</ul>' +
      '<p class="note" style="margin:16px 0 0">以上为考试科目、题型等相对稳定的信息（整理于 ' + esc(C.updated) + '）。报名时间、费用与合格标准请以官方网站当年公告为准。</p></section>';

    html += '<section class="card" style="margin-bottom:16px"><h2 style="font-size:22px">推荐学习路线</h2><ol style="margin:0;padding-left:1.3em">' +
      '<li><b>读官方公告和大纲</b>：先确认报考条件、科目与时间。<a href="#" data-scroll="official">查看官方入口</a></li>' +
      '<li><b>系统学一遍</b>：在 <a href="#/e/' + e.id + '/resources">哔哩哔哩、中国大学MOOC、学堂在线</a> 找一门完整课程跟下来。</li>' +
      (e.bank
        ? '<li><b>做题巩固</b>：用 <a href="#/e/' + e.id + '/practice">练习题</a> 检验每个模块，错题会自动进入错题本。</li><li><b>碎片时间记忆</b>：用 <a href="#/e/' + e.id + '/cards">闪卡</a> 记概念、公式和法条。</li>'
        : '<li><b>做题巩固</b>：本站题库建设中，可以让 <a href="#/e/' + e.id + '/ai">AI 助教</a> 按考点出题，并配合正规出版的真题册。</li>') +
      '<li><b>答疑与计划</b>：卡住的地方问 <a href="#/e/' + e.id + '/ai">AI 助教</a>，并按倒计时调整进度。</li></ol>' +
      (e.bank ? '<div class="qactions"><a class="btn btn-primary" href="#/e/' + e.id + '/practice">开始练习</a><a class="btn" href="#/e/' + e.id + '/practice?mode=exam">模拟测验</a><a class="btn" href="#/e/' + e.id + '/cards">背闪卡</a></div>' : '') +
      '</section>';

    if (fam.length) {
      html += '<section><h2 style="font-size:22px;margin-top:8px">同类考试 · ' + esc(e.family) + '</h2><div class="grid grid-2">' +
        fam.map(function (x) { return examCard(x); }).join('') + '</div></section>';
    }
    html += '</div><aside class="side-sticky">';
    html += '<div class="card" id="official"><h3>官方入口</h3><div class="official-list">' + e.official.map(function (o) {
      return '<a class="official-link" href="' + esc(o.url) + '" target="_blank" rel="noopener noreferrer"><span>' + esc(o.label) + '<small>' + esc(o.url.replace(/^https?:\/\//, '')) + '</small></span><span class="arrow">↗</span></a>';
    }).join('') + '</div></div>';
    html += '<div class="card"><h3>考试倒计时</h3>' +
      (days != null ? (days >= 0 ? '<div class="countdown"><span>距离考试还有</span><b>' + days + '</b><span>天</span></div>' : '<div class="muted">考试日期已过，可以设置下一次的日期。</div>') : '<div class="muted small">设置你的考试日期（以准考证为准），首页和 AI 学习计划会用到它。</div>') +
      '<div class="date-row"><input type="date" id="examDate" value="' + esc(date) + '" aria-label="考试日期"><button class="btn btn-sm" type="button" id="saveDate">保存</button></div></div>';
    if (e.bank) html += '<div class="card" id="progressCard"><h3>我的进度</h3><div class="muted small">加载中…</div></div>';
    html += '</aside></div>';
    body.innerHTML = html;

    document.getElementById('saveDate').addEventListener('click', function () {
      var v = document.getElementById('examDate').value;
      var all = KJ.store.get('dates', {});
      if (v) all[e.id] = v; else delete all[e.id];
      KJ.store.set('dates', all);
      KJ.toast(v ? '考试日期已保存' : '已清除考试日期');
      overview(e, body);
    });
    var sc = body.querySelector('[data-scroll="official"]');
    if (sc) sc.addEventListener('click', function (ev) { ev.preventDefault(); document.getElementById('official').scrollIntoView({ behavior: 'smooth', block: 'center' }); });

    if (e.bank) {
      KJ.loadBank(e.id).then(function (bank) {
        var card = document.getElementById('progressCard');
        if (!bank || !card) return;
        var s = KJ.progress.summary(e.id, bank);
        var total = bank.questions.length;
        var badge = document.getElementById('bankBadge');
        if (badge) badge.textContent = total + ' 道练习题 · ' + bank.flashcards.length + ' 张闪卡';
        card.innerHTML = '<h3>我的进度</h3><div class="topic-row"><div class="top"><span>已做 ' + s.done + ' / ' + total + '</span><span>' +
          (s.done ? '正确率 ' + Math.round(s.right / s.done * 100) + '%' : '还没开始') + '</span></div><div class="bar"><i style="width:' + Math.round(s.done / total * 100) + '%"></i></div></div>' +
          (s.wrong ? '<a class="btn btn-sm" href="#/e/' + e.id + '/practice?mode=wrong">重做 ' + s.wrong + ' 道错题</a>' : '<a class="btn btn-sm btn-primary" href="#/e/' + e.id + '/practice">开始练习</a>');
      });
    }
  }

  function resourcesFor(e) {
    var kw = e.kw;
    var bili = [kw].concat(e.bili || []);
    var mooc = (e.mooc && e.mooc.length) ? e.mooc : [kw];
    var books = (e.books && e.books.length) ? e.books : [kw];
    function group(pid, title, words, suffix) {
      var p = KJ.platform(pid);
      return '<div class="card res-group"><div class="res-head"><h3>' + esc(p.name) + '</h3><span class="badge">' + esc(p.kind) + '</span><span class="desc">' + esc(title || p.desc) + '</span></div>' +
        '<div class="chips">' + words.map(function (w) { return chip(KJ.searchUrl(pid, w + (suffix || '')), w + (suffix || '')); }).join('') + '</div></div>';
    }
    var smart = KJ.platform('smartedu');
    var smartUrl = e.cat === 'xueli' && e.id === 'gaokao' ? 'https://basic.smartedu.cn' : smart.home;
    var html = '<p class="muted">点击关键词会在新标签页打开对应平台的搜索结果。以下平台均可在中国大陆直接访问。</p>' +
      group('bilibili', '名师公开课、真题精讲与经验分享', bili) +
      group('icourse163', '高校老师主讲的免费系统课程', mooc) +
      group('xuetangx', '清华大学等高校的在线课程', mooc) +
      '<div class="card res-group"><div class="res-head"><h3>' + esc(smart.name) + '</h3><span class="badge">' + esc(smart.kind) + '</span><span class="desc">' + esc(smart.desc) + '</span></div><div class="chips">' + chip(smartUrl, '打开' + smart.name) + '</div></div>' +
      group('ximalaya', '通勤路上听课、背诵', [kw]) +
      group('douban', '先看评分和书评，再决定买哪本', books) +
      group('jd', '教材、真题册（以官方指定教材为准）', books) +
      group('zhihu', '上岸经验与复习规划', [kw + ' 备考经验', kw + ' 复习规划']);
    return html;
  }

  /* ───────── 练习题 / 闪卡 总览 ───────── */
  function viewBankIndex(kind) {
    var isCards = kind === 'cards';
    setTitle(isCards ? '闪卡' : '练习题');
    var list = C.exams.filter(function (e) { return e.bank; });
    var html = '<div class="wrap">' + crumbs([['首页', '#/'], [isCards ? '闪卡' : '练习题']]) +
      '<div class="page-head"><h1>' + (isCards ? '闪卡' : '练习题') + '</h1><p class="lead">' +
      (isCards ? '翻面记忆概念、公式与法条。标记“记住了”的卡片会计入掌握进度。'
        : '全部为原创模拟题，作答后立即显示解析与依据。支持顺序、随机、错题重做和模拟测验四种模式，进度只保存在本机。') +
      '</p></div><div class="grid grid-3" id="bankGrid">' + list.map(function (e) {
        return '<a class="card card-link exam-card" href="#/e/' + e.id + '/' + (isCards ? 'cards' : 'practice') + '">' +
          '<h3>' + esc(e.short) + '</h3><div class="org">' + esc(KJ.cat(e.cat).name) + '</div>' +
          '<div class="meta" data-id="' + e.id + '"><span class="badge">加载中…</span></div></a>';
      }).join('') + '</div>' +
      '<p class="note" style="margin-top:20px">没有找到你的考试？题库正在逐步扩充。可以先到 <a href="#/exams">全部考试</a> 里找到它，用“AI 助教”按考点出题。</p></div>';
    main.innerHTML = html;
    KJ.loadAllBanks().then(function (banks) {
      banks.forEach(function (b) {
        var el = main.querySelector('.meta[data-id="' + b.examId + '"]');
        if (!el) return;
        if (isCards) {
          var known = (KJ.store.get('cards', {})[b.examId] || []).length;
          el.innerHTML = '<span class="badge badge-brand">' + b.flashcards.length + ' 张闪卡</span>' + (known ? '<span class="badge badge-ok">已掌握 ' + known + '</span>' : '');
        } else {
          var s = KJ.progress.summary(b.examId, b);
          el.innerHTML = '<span class="badge badge-brand">' + b.questions.length + ' 道题</span>' + Object.keys(s.topics).length + ' 个模块' +
            (s.done ? '<span class="badge badge-ok">已做 ' + s.done + '</span>' : '') + (s.wrong ? '<span class="badge badge-accent">错题 ' + s.wrong + '</span>' : '');
        }
      });
    });
  }

  /* ───────── 错题本 ───────── */
  function viewWrong() {
    setTitle('错题本');
    main.innerHTML = '<div class="wrap">' + crumbs([['首页', '#/'], ['错题本']]) +
      '<div class="page-head"><h1>错题本</h1><p class="lead">最近一次答错的题目会出现在这里。重新答对或点“我已掌握”后自动移出。</p></div><div id="wrongBody"><div class="card empty">加载中…</div></div></div>';
    KJ.loadAllBanks().then(function (banks) {
      var body = document.getElementById('wrongBody');
      if (!body) return;
      var html = '';
      var total = 0;
      banks.forEach(function (b) {
        var ids = KJ.progress.wrongIds(b.examId);
        if (!ids.length) return;
        var e = KJ.exam(b.examId);
        var qs = b.questions.filter(function (q) { return ids.indexOf(q.id) >= 0; });
        total += qs.length;
        html += '<section class="family"><div class="section-head" style="margin-bottom:12px"><h2 style="font-size:22px;margin:0">' + esc(e.short) + ' <span class="badge badge-accent">' + qs.length + ' 题</span></h2>' +
          '<a class="btn btn-sm btn-primary" href="#/e/' + e.id + '/practice?mode=wrong">重做这些错题</a></div>' +
          qs.map(function (q) {
            return '<div class="card wrong-item" style="margin-bottom:10px"><div class="qmeta"><span class="badge">' + esc(q.topic) + '</span></div>' +
              '<div class="q">' + esc(q.q) + '</div>' + (q.code ? '<pre class="qcode"><code>' + esc(q.code) + '</code></pre>' : '') +
              '<div class="a">正确答案：' + esc(q.options[q.answer]) + '</div><div class="a" style="margin-top:6px">' + esc(q.explain) + '</div>' +
              '<div class="qactions"><button class="btn btn-sm btn-ghost" type="button" data-master="' + esc(e.id) + '|' + esc(q.id) + '">我已掌握</button></div></div>';
          }).join('') + '</section>';
      });
      body.innerHTML = total ? html : '<div class="card empty"><h3>错题本是空的</h3><p>做练习时答错的题会自动收进来。</p><a class="btn btn-primary" href="#/practice">去做练习题</a></div>';
      KJ.$$('[data-master]', body).forEach(function (b) {
        b.addEventListener('click', function () {
          var parts = b.getAttribute('data-master').split('|');
          KJ.progress.master(parts[0], parts[1]);
          KJ.toast('已移出错题本');
          viewWrong();
        });
      });
    });
  }

  /* ───────── 免费资源 ───────── */
  function viewResources() {
    setTitle('免费资源');
    var officials = [
      ['中国教育考试网', 'https://www.neea.edu.cn', '四六级、计算机等级、教资、自考、雅思托福报名等'],
      ['中国人事考试网', 'http://www.cpta.com.cn', '一建、经济师、执业药师等专业技术人员资格考试'],
      ['中国研究生招生信息网', 'https://yz.chsi.com.cn', '考研报名、调剂与复试信息'],
      ['阳光高考', 'https://gaokao.chsi.com.cn', '高考与高校招生信息'],
      ['国家公务员局', 'http://www.scs.gov.cn', '中央机关公务员考试录用'],
      ['全国会计资格评价网', 'http://kzp.mof.gov.cn', '初级、中级、高级会计资格考试']
    ];
    var html = '<div class="wrap">' + crumbs([['首页', '#/'], ['免费资源']]) +
      '<div class="page-head"><h1>免费资源</h1><p class="lead">以下平台都可以在中国大陆直接访问。进入具体考试页面的“免费资源”标签，可以按考试关键词一键搜索。</p></div>' +
      '<h2 style="font-size:22px">学习平台</h2><div class="grid grid-3" style="margin-bottom:32px">' +
      C.platforms.map(function (p) {
        return '<a class="card card-link feature" href="' + esc(p.home) + '" target="_blank" rel="noopener noreferrer"><span class="badge badge-brand" style="align-self:flex-start">' + esc(p.kind) + '</span><h3>' + esc(p.name) + ' ↗</h3><p>' + esc(p.desc) + '</p></a>';
      }).join('') + '</div>' +
      '<h2 style="font-size:22px">官方查询</h2><div class="grid grid-3" style="margin-bottom:32px">' +
      officials.map(function (o) {
        return '<a class="card card-link feature" href="' + esc(o[1]) + '" target="_blank" rel="noopener noreferrer"><h3>' + esc(o[0]) + ' ↗</h3><p>' + esc(o[2]) + '</p></a>';
      }).join('') + '</div>' +
      '<h2 style="font-size:22px">AI 助教（国内可用）</h2><div class="grid grid-3">' +
      C.ai.map(function (a) {
        return '<a class="card card-link feature" href="' + esc(a.web) + '" target="_blank" rel="noopener noreferrer"><h3>' + esc(a.name) + ' ↗</h3><p>' + (a.api ? '网页版免费使用；也支持在本站用 API Key 直连对话。' : '网页版免费使用。') + '</p></a>';
      }).join('') + '</div></div>';
    main.innerHTML = html;
  }

  /* ───────── AI 助教页 ───────── */
  function viewAI(params) {
    setTitle('AI 助教');
    var id = params.get('exam') || '';
    var e = id ? KJ.exam(id) : null;
    var html = '<div class="wrap">' + crumbs([['首页', '#/'], ['AI 助教']]) +
      '<div class="page-head"><h1>AI 助教</h1><p class="lead">出题、讲解、做学习计划。使用国内大模型：网页版免费，或填入自己的 API Key 在本站直接对话。</p>' +
      '<div class="field" style="max-width:360px"><label for="aiExam">选择考试（让 AI 了解你的考试）</label><select id="aiExam"><option value="">不指定考试</option>' +
      C.categories.map(function (c) {
        return '<optgroup label="' + esc(c.name) + '">' + KJ.examsIn(c.id).map(function (x) {
          return '<option value="' + x.id + '"' + (e && e.id === x.id ? ' selected' : '') + '>' + esc(x.short) + '</option>';
        }).join('') + '</optgroup>';
      }).join('') + '</select></div></div><div id="aiBody"></div></div>';
    main.innerHTML = html;
    cleanup = KJ.AI.mount(document.getElementById('aiBody'), e);
    document.getElementById('aiExam').addEventListener('change', function () {
      location.hash = '#/ai' + (this.value ? '?exam=' + this.value : '');
    });
  }

  /* ───────── 关于 ───────── */
  function viewAbout() {
    setTitle('关于本站');
    main.innerHTML = '<div class="wrap" style="max-width:820px">' + crumbs([['首页', '#/'], ['关于本站']]) +
      '<div class="page-head"><h1>关于开卷备考</h1></div>' +
      '<div class="card"><h3>我们做什么</h3><p>开卷备考是一个免费的备考导航与练习网站：为国内常见考试整理官方入口、国内可直连的免费学习资源、原创练习题、闪卡和 AI 助教。网站本身是纯静态页面，不收集任何个人信息。</p>' +
      '<h3>内容来源与免责声明</h3><p>考试信息整理自各考试主办机构的官方网站，只收录考试科目、题型等相对稳定的内容；报名时间、费用与合格标准请以官方当年公告为准。练习题与闪卡为原创内容，不是历年真题，题目依据（教材、法条或计算验证）标注在每道题的解析下方。本站与任何考试主办机构无隶属关系。</p>' +
      '<h3>为什么不需要翻墙</h3><p>网站不加载 Google 字体、境外 CDN、境外统计或广告脚本，全部样式和脚本随站点一起部署；所有外部链接都指向中国大陆可以直接访问的网站，并经过直连检测（见项目中的 tools/linkcheck.js）。</p>' +
      '<h3>你的数据</h3><p>练习进度、错题、闪卡掌握情况、考试日期和 AI 设置都保存在你浏览器的 localStorage 中，不会上传。可以随时在浏览器设置中清除。</p>' +
      '<h3>发现错误？</h3><p>如果发现题目、解析或考试信息有误，欢迎反馈。纠错会优先处理。</p></div></div>';
  }

  function viewNotFound() {
    setTitle('页面不存在');
    main.innerHTML = '<div class="wrap"><div class="card empty" style="margin-top:40px"><h3>没有找到这个页面</h3><p>链接可能已经失效。</p><a class="btn btn-primary" href="#/">回到首页</a></div></div>';
  }

  /* ───────── 搜索面板 ───────── */
  var overlay = document.getElementById('searchOverlay');
  var input = document.getElementById('searchInput');
  var results = document.getElementById('searchResults');
  var active = 0;

  function openSearch() {
    overlay.hidden = false;
    input.value = '';
    renderResults();
    setTimeout(function () { input.focus(); }, 0);
  }
  function closeSearch() { overlay.hidden = true; }
  function renderResults() {
    var q = input.value.trim();
    var list = q ? KJ.search(q).slice(0, 8) : C.exams.filter(function (e) { return e.hot; });
    active = 0;
    if (!list.length) {
      results.innerHTML = '<div class="sr-empty">没有找到“' + esc(q) + '”。可以试试简称（如“教资”）、拼音（如“kaoyan”）或领域（如“会计”）。</div>';
      return;
    }
    results.innerHTML = (q ? '' : '<div class="sr-empty" style="padding:8px 12px;text-align:left">热门考试</div>') + list.map(function (e, i) {
      var c = KJ.cat(e.cat);
      return '<a class="sr-item' + (i === 0 ? ' active' : '') + '" role="option" href="#/e/' + e.id + '"><span class="g">' + esc(c.glyph) + '</span>' +
        '<span class="t"><b>' + esc(e.short) + '</b><small>' + esc(e.name) + ' · ' + esc(c.name) + '</small></span>' +
        (e.bank ? '<span class="badge badge-ok">练习题</span>' : '') + '</a>';
    }).join('');
  }
  function moveActive(d) {
    var items = KJ.$$('.sr-item', results);
    if (!items.length) return;
    items[active].classList.remove('active');
    active = (active + d + items.length) % items.length;
    items[active].classList.add('active');
    items[active].scrollIntoView({ block: 'nearest' });
  }
  input.addEventListener('input', renderResults);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); moveActive(-1); }
    if (e.key === 'Enter') {
      var it = KJ.$$('.sr-item', results)[active];
      if (it) { location.hash = it.getAttribute('href'); closeSearch(); }
    }
  });
  results.addEventListener('click', function (e) { if (e.target.closest('.sr-item')) closeSearch(); });
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
  document.getElementById('searchTrigger').addEventListener('click', openSearch);
  document.addEventListener('keydown', function (e) {
    var typing = e.target && /input|textarea|select/i.test(e.target.tagName);
    if (e.key === 'Escape' && !overlay.hidden) { closeSearch(); return; }
    if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) { e.preventDefault(); openSearch(); }
  });

  /* ───────── 顶栏 ───────── */
  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menuBtn');
  menuBtn.addEventListener('click', function () {
    var open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  document.getElementById('themeToggle').addEventListener('click', function () {
    var root = document.documentElement;
    var cur = root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('kj.theme', next); } catch (e) { /* 忽略 */ }
  });

  /* ───────── 路由 ───────── */
  function route() {
    if (cleanup) { try { cleanup(); } catch (e) { /* 忽略 */ } cleanup = null; }
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    var hash = location.hash.replace(/^#/, '') || '/';
    var qi = hash.indexOf('?');
    var path = qi >= 0 ? hash.slice(0, qi) : hash;
    var params = new URLSearchParams(qi >= 0 ? hash.slice(qi + 1) : '');
    var seg = path.split('/').filter(Boolean);
    var base = seg[0] || '';

    KJ.$$('[data-nav]', nav).forEach(function (a) {
      var on = a.getAttribute('data-nav') === base ||
        (base === 'c' && a.getAttribute('data-nav') === 'exams') ||
        (base === 'e' && a.getAttribute('data-nav') === 'exams');
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });

    var samePage = base === 'e' && lastBase === 'e/' + seg[1];
    lastBase = base === 'e' ? 'e/' + seg[1] : base;

    switch (base) {
      case '': viewHome(); break;
      case 'exams': viewExams(params); break;
      case 'c': viewCategory(seg[1]); break;
      case 'e': viewExam(seg[1], seg[2], params); break;
      case 'practice': viewBankIndex('practice'); break;
      case 'flashcards': viewBankIndex('cards'); break;
      case 'wrong': viewWrong(); break;
      case 'resources': viewResources(); break;
      case 'ai': viewAI(params); break;
      case 'about': viewAbout(); break;
      default: viewNotFound();
    }
    if (!samePage) window.scrollTo(0, 0);
    else {
      var tabs = KJ.$('.tabs', main);
      if (tabs && tabs.getBoundingClientRect().top < 0) tabs.scrollIntoView({ block: 'start' });
    }
  }

  window.addEventListener('hashchange', route);
  route();
})();
