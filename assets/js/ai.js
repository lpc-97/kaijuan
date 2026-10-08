/* 开卷备考 · AI 助教
 * 两种用法：
 *   1. 网页版（免费、无需 Key）：复制提示词，打开 DeepSeek / Kimi / 通义千问 / 智谱清言 / 豆包 / 元宝 网页粘贴
 *   2. API 直连（自备 Key）：浏览器直接请求国内大模型的 OpenAI 兼容接口，流式输出
 * Key 只保存在本机 localStorage，不经过任何第三方服务器。
 */
(function () {
  'use strict';
  var KJ = window.KJ;
  var esc = KJ.esc;
  var sessions = {};

  function providers() { return KJ.C.ai; }
  function apiProviders() { return KJ.C.ai.filter(function (p) { return p.api; }); }
  function provider(id) {
    var list = providers();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function settings() {
    return KJ.store.get('ai', { mode: 'web', provider: 'deepseek', keys: {}, models: {} });
  }
  function saveSettings(s) { KJ.store.set('ai', s); }

  function systemPrompt(exam) {
    var lines = ['你是「开卷备考」网站的 AI 助教，帮助中国考生备考。'];
    if (exam) {
      lines.push('考生正在备考「' + exam.name + '」。');
      lines.push('组织机构：' + exam.org + '。');
      lines.push('考试简介：' + exam.summary);
      if (exam.facts && exam.facts.length) lines.push('考试要点：' + exam.facts.join('；') + '。');
      lines.push('官方网站：' + exam.official.map(function (o) { return o.label + ' ' + o.url; }).join('；') + '。');
    }
    lines.push('回答要求：');
    lines.push('1. 使用简体中文，条理清晰，必要时分点。');
    lines.push('2. 涉及报名时间、费用、合格分数线等政策信息时，提醒考生以官方网站当年公告为准，不要编造具体日期或数字。');
    lines.push('3. 出题时一次只出一道，等考生作答后再判断对错并讲解。');
    lines.push('4. 讲解知识点时说明依据（教材、法条或公式）；不确定时明确说明不确定。');
    lines.push('5. 推荐学习资源时只推荐中国大陆可以直接访问的网站。');
    return lines.join('\n');
  }

  function quickPrompts(exam) {
    var name = exam ? exam.name : '我要参加的考试（请在这里填写考试名称）';
    var date = exam ? (KJ.store.get('dates', {})[exam.id] || '') : '';
    var days = KJ.daysUntil(date);
    var dayText = days != null && days > 0 ? days + ' 天' : '大约 90 天';
    return [
      { t: '出题考我', d: '一次一题，答完再讲解', p: '请围绕「' + name + '」的核心考点出 5 道单项选择题。一次只出一道，等我回答后再告诉我对错并详细讲解，然后出下一道。' },
      { t: '制定学习计划', d: '按基础、强化、冲刺分阶段', p: '我正在备考「' + name + '」，距离考试还有' + dayText + '，每天大约能学习 2 小时。请按基础、强化、冲刺三个阶段帮我制定学习计划，列出每个阶段的重点内容和每周安排。' },
      { t: '通俗讲解', d: '把难点讲明白，再举个例子', p: '请用通俗易懂的方式给我讲解「' + name + '」中的这个知识点，并举一个例子：\n【在这里填写知识点】' },
      { t: '情景练习', d: '案例题，先答后评', p: '请给我出一道「' + name + '」的情景分析或案例题。先只给题目，等我作答后再点评，并给出参考答案和评分要点。' }
    ];
  }

  function questionPrompt(exam, q) {
    var opts = q.options.map(function (o, i) { return 'ABCD'.charAt(i) + '. ' + o; }).join('\n');
    return '我在练习「' + exam.name + '」时遇到这道题：\n' + q.q + (q.code ? '\n' + q.code : '') + '\n' + opts +
      '\n参考答案：' + 'ABCD'.charAt(q.answer) + '. ' + q.options[q.answer] +
      '\n网站解析：' + q.explain +
      '\n\n请进一步讲解这道题涉及的知识点，说明其他选项错在哪里，再给我出一道同类变式题（先不要给答案）。';
  }

  /* 极简 Markdown：先转义，再处理代码块、行内代码、粗体、标题 */
  function md(text) {
    var parts = String(text).split(/```/);
    return parts.map(function (seg, i) {
      if (i % 2 === 1) {
        var body = seg.replace(/^[a-zA-Z0-9_+-]*\n/, '');
        return '<pre><code>' + esc(body) + '</code></pre>';
      }
      return esc(seg)
        .replace(/`([^`\n]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>')
        .replace(/^#{1,6}\s*(.+)$/gm, '<b>$1</b>')
        .replace(/\n/g, '<br>');
    }).join('');
  }

  function errorText(status, body) {
    var map = {
      400: '请求参数有误，请检查模型名称是否正确',
      401: 'API Key 无效或已过期，请重新填写',
      402: '账户余额不足，请到服务商控制台充值',
      403: '没有权限调用该模型，请检查 Key 与模型名称',
      404: '模型或接口不存在，请检查模型名称',
      429: '请求过于频繁或额度已用完，请稍后再试'
    };
    var detail = '';
    try { var j = JSON.parse(body); detail = (j.error && (j.error.message || j.error.code)) || j.message || ''; } catch (e) { detail = ''; }
    return (map[status] || ('服务返回错误（HTTP ' + status + '）')) + (detail ? '：' + detail : '');
  }

  /* 流式调用 OpenAI 兼容接口 */
  function streamChat(p, key, model, messages, onDelta, signal) {
    return fetch(p.api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model: model, messages: messages, stream: true, temperature: 0.7 }),
      signal: signal
    }).then(function (res) {
      if (!res.ok) return res.text().then(function (t) { throw new Error(errorText(res.status, t)); });
      if (!res.body || !res.body.getReader) {
        return res.text().then(function (t) { parseChunk(t + '\n'); });
      }
      var reader = res.body.getReader();
      var decoder = new TextDecoder('utf-8');
      var buf = '';
      function parseChunk(chunk) {
        buf += chunk;
        var lines = buf.split('\n');
        buf = lines.pop();
        lines.forEach(function (line) {
          line = line.trim();
          if (line.indexOf('data:') !== 0) return;
          var data = line.slice(5).trim();
          if (!data || data === '[DONE]') return;
          try {
            var j = JSON.parse(data);
            var d = j.choices && j.choices[0] && j.choices[0].delta;
            if (d && d.content) onDelta(d.content);
          } catch (e) { /* 忽略不完整的行 */ }
        });
      }
      function pump() {
        return reader.read().then(function (r) {
          if (r.done) { parseChunk('\n'); return; }
          parseChunk(decoder.decode(r.value, { stream: true }));
          return pump();
        });
      }
      return pump();
    });
  }

  /* ── 界面 ── */
  function mount(root, exam) {
    var key = exam ? exam.id : '_';
    var sess = sessions[key] || (sessions[key] = { messages: [] });
    var s = settings();
    var controller = null;

    function render() {
      s = settings();
      var qp = quickPrompts(exam);
      var html = '<div class="ai-shell"><div>';
      html += '<div class="ai-quick">' + qp.map(function (x, i) {
        return '<button type="button" data-q="' + i + '"><b>' + esc(x.t) + '</b><span>' + esc(x.d) + '</span></button>';
      }).join('') + '</div>';

      if (s.mode === 'api') {
        html += '<div class="card"><div class="ai-log" id="aiLog">';
        if (!sess.messages.length) html += '<div class="msg bot">你好，我是 AI 助教。' + (exam ? '我们来一起准备「' + esc(exam.short) + '」。' : '') + '点上面的快捷按钮，或者直接提问。</div>';
        sess.messages.forEach(function (m) {
          html += '<div class="msg ' + (m.role === 'user' ? 'user' : 'bot') + '">' + (m.role === 'user' ? esc(m.content) : md(m.content)) + '</div>';
        });
        html += '</div>';
      } else {
        html += '<div class="card">';
      }
      html += '<div class="ai-input"><textarea id="aiText" placeholder="输入你的问题，或点击上方快捷按钮生成提示词" aria-label="提问内容"></textarea></div>';
      html += '<div class="qactions">';
      if (s.mode === 'api') {
        html += '<button class="btn btn-primary" type="button" id="aiSend">发送</button>' +
          '<button class="btn btn-ghost btn-sm" type="button" id="aiStop" hidden>停止生成</button>' +
          '<span class="spacer"></span><button class="btn btn-ghost btn-sm" type="button" id="aiClear">清空对话</button>';
      } else {
        html += '<span class="muted small">复制提示词并打开：</span><div class="web-ai">' + providers().map(function (p) {
          return '<button class="btn btn-sm" type="button" data-web="' + p.id + '">' + esc(p.name) + '</button>';
        }).join('') + '</div>';
      }
      html += '</div></div>';
      if (s.mode !== 'api') {
        html += '<p class="note" style="margin-top:12px">网页版无需注册本站账号，也不需要 API Key：点按钮后提示词会复制到剪贴板，在打开的 AI 网页里按 Ctrl+V（手机长按粘贴）即可。以上均为国内可直接访问的服务。</p>';
      }
      html += '</div>';

      /* 设置 */
      html += '<aside class="side-sticky"><div class="card"><h3>使用方式</h3>' +
        '<div class="mode-switch seg" role="group" aria-label="使用方式">' +
        '<button type="button" data-mode="web" aria-pressed="' + (s.mode !== 'api') + '">网页版（免费）</button>' +
        '<button type="button" data-mode="api" aria-pressed="' + (s.mode === 'api') + '">API 直连</button></div>';
      if (s.mode === 'api') {
        var p = provider(s.provider) || apiProviders()[0];
        html += '<div class="field"><label for="aiProv">服务商</label><select id="aiProv">' + apiProviders().map(function (x) {
          return '<option value="' + x.id + '"' + (x.id === p.id ? ' selected' : '') + '>' + esc(x.name) + '</option>';
        }).join('') + '</select></div>' +
          '<div class="field"><label for="aiKey">API Key</label><input id="aiKey" type="password" autocomplete="off" placeholder="sk-..." value="' + esc((s.keys || {})[p.id] || '') + '"></div>' +
          '<div class="field"><label for="aiModel">模型名称</label><input id="aiModel" type="text" value="' + esc((s.models || {})[p.id] || p.model) + '"></div>' +
          '<p class="small muted">还没有 Key？' + KJ.ext(p.keyUrl, '去 ' + esc(p.name) + ' 开放平台创建 ↗') + '。Key 只保存在本机浏览器，请求从你的浏览器直接发往服务商；公用电脑上用完请清空。</p>' +
          '<button class="btn btn-sm btn-ghost" type="button" id="aiForget">清除已保存的 Key</button>';
      } else {
        html += '<p class="small muted">推荐：不想注册任何平台就用网页版；想在本站内直接对话，可切换到 API 直连，填入 DeepSeek、Kimi、通义千问或智谱的 API Key。</p>';
      }
      html += '</div></aside></div>';
      root.innerHTML = html;
      bind();
      var log = document.getElementById('aiLog');
      if (log) log.scrollTop = log.scrollHeight;
      if (KJ.pendingPrompt) {
        document.getElementById('aiText').value = KJ.pendingPrompt;
        KJ.pendingPrompt = null;
      }
    }

    function bind() {
      var text = document.getElementById('aiText');
      KJ.$$('[data-q]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          text.value = quickPrompts(exam)[Number(b.getAttribute('data-q'))].p;
          text.focus();
        });
      });
      KJ.$$('[data-mode]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          var keep = text.value;
          s.mode = b.getAttribute('data-mode');
          saveSettings(s);
          render();
          document.getElementById('aiText').value = keep;
        });
      });
      KJ.$$('[data-web]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          var p = provider(b.getAttribute('data-web'));
          var prompt = text.value.trim();
          var full = prompt ? (exam ? '【背景】' + systemPrompt(exam).replace(/\n/g, ' ') + '\n\n' : '') + prompt : '';
          /* 先同步打开窗口，避免被浏览器拦截弹窗 */
          window.open(p.web, '_blank', 'noopener');
          if (full) {
            KJ.copy(full).then(function (ok) {
              KJ.toast(ok ? '提示词已复制，在 ' + p.name + ' 里粘贴即可' : '复制失败，请手动复制输入框内容');
            });
          } else {
            KJ.toast('已打开 ' + p.name + '，可先点上方快捷按钮生成提示词');
          }
        });
      });
      var prov = document.getElementById('aiProv');
      if (prov) prov.addEventListener('change', function () { s.provider = prov.value; saveSettings(s); var keep = text.value; render(); document.getElementById('aiText').value = keep; });
      var keyEl = document.getElementById('aiKey');
      if (keyEl) keyEl.addEventListener('change', function () { s.keys = s.keys || {}; s.keys[currentProvider().id] = keyEl.value.trim(); saveSettings(s); KJ.toast('Key 已保存在本机'); });
      var modelEl = document.getElementById('aiModel');
      if (modelEl) modelEl.addEventListener('change', function () { s.models = s.models || {}; s.models[currentProvider().id] = modelEl.value.trim(); saveSettings(s); });
      var forget = document.getElementById('aiForget');
      if (forget) forget.addEventListener('click', function () { s.keys = {}; saveSettings(s); render(); KJ.toast('已清除所有保存的 Key'); });
      var send = document.getElementById('aiSend');
      if (send) send.addEventListener('click', ask);
      if (text) text.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); if (send) ask(); }
      });
      var stop = document.getElementById('aiStop');
      if (stop) stop.addEventListener('click', function () { if (controller) controller.abort(); });
      var clear = document.getElementById('aiClear');
      if (clear) clear.addEventListener('click', function () { sess.messages = []; render(); });
    }

    function currentProvider() { return provider(s.provider) || apiProviders()[0]; }

    function ask() {
      var text = document.getElementById('aiText');
      var q = text.value.trim();
      if (!q) { text.focus(); return; }
      var p = currentProvider();
      var keyVal = (document.getElementById('aiKey').value || '').trim();
      var model = (document.getElementById('aiModel').value || p.model).trim();
      if (!keyVal) { KJ.toast('请先在右侧填写 ' + p.name + ' 的 API Key'); document.getElementById('aiKey').focus(); return; }
      s.keys = s.keys || {}; s.keys[p.id] = keyVal; saveSettings(s);

      sess.messages.push({ role: 'user', content: q });
      text.value = '';
      var log = document.getElementById('aiLog');
      var welcome = log.querySelector('.msg.bot:only-child');
      if (welcome && sess.messages.length === 1) welcome.remove();
      log.insertAdjacentHTML('beforeend', '<div class="msg user">' + esc(q) + '</div><div class="msg bot" id="aiLive">正在思考…</div>');
      log.scrollTop = log.scrollHeight;
      var live = document.getElementById('aiLive');
      var sendBtn = document.getElementById('aiSend');
      var stopBtn = document.getElementById('aiStop');
      sendBtn.disabled = true;
      stopBtn.hidden = false;
      var answer = '';
      controller = window.AbortController ? new AbortController() : null;
      var msgs = [{ role: 'system', content: systemPrompt(exam) }].concat(sess.messages.slice(-20));
      streamChat(p, keyVal, model, msgs, function (delta) {
        answer += delta;
        live.innerHTML = md(answer);
        if (log.scrollHeight - log.scrollTop - log.clientHeight < 120) log.scrollTop = log.scrollHeight;
      }, controller && controller.signal).then(function () {
        if (!answer) throw new Error('服务没有返回内容，请检查模型名称');
        sess.messages.push({ role: 'assistant', content: answer });
      }).catch(function (e) {
        if (e.name === 'AbortError') {
          if (answer) sess.messages.push({ role: 'assistant', content: answer + '\n（已停止）' });
          live.insertAdjacentHTML('beforeend', '<br><span class="muted small">（已停止）</span>');
          return;
        }
        sess.messages.pop();
        live.className = 'msg err';
        live.textContent = e.message && e.message.indexOf('Failed to fetch') < 0 && e.name !== 'TypeError'
          ? e.message
          : '网络请求失败：请检查网络连接和 Key 是否正确。若刚切换服务商，请确认模型名称属于该服务商。';
      }).then(function () {
        live.removeAttribute('id');
        sendBtn.disabled = false;
        stopBtn.hidden = true;
        controller = null;
      });
    }

    render();
    return function destroy() { if (controller) controller.abort(); };
  }

  KJ.AI = { mount: mount, questionPrompt: questionPrompt, quickPrompts: quickPrompts, systemPrompt: systemPrompt };
})();
