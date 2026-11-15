/* app.js — интерфейс тренажёра «КодБот» */
(function () {
  'use strict';

  const STORAGE_KEY = 'kodobot_progress_v1';
  const SOUND_KEY = 'kodobot_sound';
  const $ = (s) => document.querySelector(s);
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const escapePy = (s) => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const norm = (s) => String(s).trim().replace(/\s+/g, ' ');
  const isMobile = () => window.matchMedia('(max-width:980px)').matches;

  /* ================= прогресс ================= */
  let progress = loadProgress();

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        return { done: p.done || {}, code: p.code || {} };
      }
    } catch (e) { /* ignore */ }
    return { done: {}, code: {} };
  }
  function saveProgress() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) { /* ignore */ }
  }
  function isDone(lid, idx) { return (progress.done[lid] || []).indexOf(idx) !== -1; }
  function markDone(lid, idx) {
    const arr = progress.done[lid] || (progress.done[lid] = []);
    if (arr.indexOf(idx) === -1) arr.push(idx);
    saveProgress();
  }

  /* ================= звук ================= */
  let audioCtx = null;
  let soundEnabled = localStorage.getItem(SOUND_KEY) === '1';

  function updateSoundBtn() {
    const b = $('#btnSound');
    if (b) { b.textContent = soundEnabled ? '🔊' : '🔇'; }
  }
  function beep(freq, dur, type) {
    if (!soundEnabled) return;
    dur = dur || 0.08; type = type || 'sine';
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = 0.06;
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch (e) { /* ignore */ }
  }
  const playClick = () => beep(880, 0.04, 'triangle');
  const playSuccess = () => { beep(660, 0.09); setTimeout(() => beep(880, 0.09), 90); };
  const playError = () => { beep(220, 0.14, 'square'); setTimeout(() => beep(170, 0.14, 'square'), 130); };
  const playJingle = () => {
    beep(660, 0.1);
    setTimeout(() => beep(880, 0.1), 110);
    setTimeout(() => beep(1100, 0.1), 220);
    setTimeout(() => beep(1320, 0.25), 330);
  };

  /* ================= тосты ================= */
  function showToast(text, emoji) {
    const c = $('#toastContainer');
    if (!c) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = '<span class="toast__emoji">' + (emoji || '✨') + '</span><span>' + escapeHtml(text) + '</span>';
    c.appendChild(t);
    requestAnimationFrame(() => t.classList.add('is-visible'));
    setTimeout(() => {
      t.classList.remove('is-visible');
      setTimeout(() => t.remove(), 350);
    }, 2600);
  }

  /* ================= конфетти ================= */
  function fireConfetti(count) {
    count = count || 40;
    const colors = ['#ffd93d', '#4ade80', '#ff6bcb', '#5eead4', '#a78bfa', '#fff'];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'confetti';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDelay = (Math.random() * 0.35) + 's';
      p.style.animationDuration = (1.2 + Math.random() * 0.9) + 's';
      p.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 2600);
    }
  }

  /* ================= библиотека команд ================= */
  const LIB_GROUPS = {
    msg: {
      title: '💬 Сообщения',
      hasTextInput: true,
      items: [
        { label: 'send("текст")', text: 'send("⟦⟧")' }
      ]
    },
    var: {
      title: '📦 Переменные',
      items: [
        { label: 'x = input()', text: '⟦answer⟧ = input()' },
        { label: 'x = "текст"', text: '⟦text⟧ = ""' },
        { label: 'x = 0', text: '⟦n⟧ = 0' }
      ]
    },
    cond: {
      title: '🔀 Условия',
      items: [
        { label: 'if / else', text: 'if ⟦answer == "Да"⟧:\n    send("")\nelse:\n    send("")' },
        { label: 'if / elif / else', text: 'if ⟦answer == "Да"⟧:\n    send("")\nelif answer == "Нет":\n    send("")\nelse:\n    send("")' }
      ]
    },
    loop: {
      title: '🔁 Циклы',
      items: [
        { label: 'for i in range(3)', text: 'for i in range(⟦3⟧):\n    send("")' },
        { label: 'while True', text: 'while True:\n    ⟦answer⟧ = input()\n    if answer == "стоп":\n        break' },
        { label: 'break', text: 'break' }
      ]
    },
    func: {
      title: '🧩 Функции',
      items: [
        { label: 'def имя():', text: 'def ⟦hello⟧():\n    send("")' },
        { label: 'def имя(x):', text: 'def ⟦greet⟧(name):\n    send("Привет, " + name + "!")' },
        { label: 'return', text: 'return ⟦"текст"⟧' }
      ]
    },
    math: {
      title: '🔢 Числа и текст',
      items: [
        { label: 'int()', text: 'int(⟦⟧)' },
        { label: 'len()', text: 'len(⟦⟧)' },
        { label: '==', text: ' == ' },
        { label: '!=', text: ' != ' },
        { label: '+', text: ' + ' },
        { label: 'and', text: ' and ' },
        { label: 'or', text: ' or ' }
      ]
    }
  };

  /* ================= состояние ================= */
  const state = { lessonId: null, taskIndex: 0 };
  const codeArea = $('#codeArea');
  const chatBody = $('#chatBody');
  const chatInput = $('#chatInput');
  const chatSendBtn = $('#chatSend');
  const resultBar = $('#resultBar');
  const saveIndicator = $('#saveIndicator');

  let currentRuntime = null;
  let pendingInput = null;
  let saveTimer = null;
  let indicatorTimer = null;
  let busy = false;
  let typingEl = null;

  /* ================= навигация ================= */
  function showScreen(name) {
    $('#screenLessons').classList.toggle('hidden', name !== 'lessons');
    $('#screenTrainer').classList.toggle('hidden', name !== 'trainer');
    window.scrollTo(0, 0);
  }

  function renderLessons() {
    const grid = $('#lessonsGrid');
    grid.innerHTML = '';
    LESSONS.forEach((l) => {
      const doneCount = (progress.done[l.id] || []).length;
      const card = document.createElement('button');
      card.className = 'lesson-card';
      card.style.setProperty('--card-color', l.color);
      card.innerHTML =
        '<div class="lesson-card__emoji">' + l.emoji + '</div>' +
        '<div class="lesson-card__title">Урок ' + l.id + '</div>' +
        '<div class="lesson-card__name">' + escapeHtml(l.title) + '</div>' +
        '<div class="lesson-card__tag">' + escapeHtml(l.tagline) + '</div>' +
        '<div class="lesson-card__bar"><i style="width:' + (doneCount * 10) + '%"></i></div>' +
        '<div class="lesson-card__meta">' + doneCount + ' / 10 заданий' +
        (doneCount === 10 ? ' · 🏆' : '') + '</div>';
      card.onclick = () => { playClick(); openLesson(l.id); };
      grid.appendChild(card);
    });
  }

  function openLesson(id) {
    state.lessonId = id;
    const done = progress.done[id] || [];
    let idx = 0;
    while (idx < 10 && done.indexOf(idx) !== -1) idx++;
    state.taskIndex = Math.min(idx, 9);
    showScreen('trainer');
    renderTask();
  }

  function currentLesson() { return LESSONS[state.lessonId - 1]; }
  function currentTask() { return currentLesson().tasks[state.taskIndex]; }

  /* ================= рендер задания ================= */
  function renderTask() {
    const lesson = currentLesson();
    const task = currentTask();

    $('#taskCounter').textContent = 'Задание ' + (state.taskIndex + 1) + ' из ' + lesson.tasks.length;
    $('#taskBody').innerHTML =
      '<h3>' + escapeHtml(task.title) + '</h3>' +
      '<div class="task-text">' + task.text + '</div>' +
      (task.hint ? '<details class="hint"><summary>💡 Подсказка</summary><div>' + task.hint + '</div></details>' : '');

    renderDots(lesson);
    renderLibrary(lesson);

    const key = state.lessonId + '-' + state.taskIndex;
    codeArea.value = (progress.code[key] !== undefined)
      ? progress.code[key]
      : (task.starter || '');

    clearChat();
    addSystem('▶ «Запустить» — поговорить с ботом. ✓ «Проверить» — сдать задание.');
    hideResult();
    resetChatInput();

    const allDone = (progress.done[lesson.id] || []).length === lesson.tasks.length;
    $('#btnSummary').classList.toggle('hidden', !allDone);
  }

  function renderDots(lesson) {
    const dots = $('#dots');
    dots.innerHTML = '';
    lesson.tasks.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = 'dot' + (isDone(lesson.id, i) ? ' is-done' : '') + (i === state.taskIndex ? ' is-active' : '');
      b.textContent = String(i + 1);
      b.onclick = () => { saveCode(); state.taskIndex = i; renderTask(); };
      dots.appendChild(b);
    });
  }

  function renderLibrary(lesson) {
    const lib = $('#libBody');
    lib.innerHTML = '';
    (lesson.lib || Object.keys(LIB_GROUPS)).forEach((gid) => {
      const g = LIB_GROUPS[gid];
      if (!g) return;
      const block = document.createElement('div');
      block.className = 'lib-group';
      block.innerHTML = '<div class="lib-group__title">' + g.title + '</div>';
      const wrap = document.createElement('div');
      wrap.className = 'lib-group__items';

      if (g.hasTextInput) {
        const row = document.createElement('div');
        row.className = 'lib-text';
        row.innerHTML = '<input type="text" placeholder="Твой текст..."><button>send( )</button>';
        const inp = row.querySelector('input');
        const btn = row.querySelector('button');
        btn.onclick = () => {
          const v = inp.value.trim();
          if (!v) { inp.focus(); return; }
          playClick();
          insertSnippet('send("' + escapePy(v) + '")');
          inp.value = '';
        };
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') btn.click(); });
        wrap.appendChild(row);
      }

      g.items.forEach((item) => {
        const b = document.createElement('button');
        b.className = 'lib-btn';
        b.textContent = item.label;
        b.onclick = () => { playClick(); insertSnippet(item.text); };
        wrap.appendChild(b);
      });

      block.appendChild(wrap);
      lib.appendChild(block);
    });
  }

  /* ================= вставка сниппетов ================= */
  const MARK_OPEN = '⟦';
  const MARK_CLOSE = '⟧';

  function insertSnippet(snippet) {
    const ta = codeArea;
    let clean = '';
    let selFrom = null, selTo = null;

    for (const ch of snippet) {
      if (ch === MARK_OPEN) { if (selFrom === null) selFrom = clean.length; }
      else if (ch === MARK_CLOSE) { if (selTo === null) selTo = clean.length; }
      else clean += ch;
    }
    if (selFrom === null) selFrom = clean.length;
    if (selTo === null || selTo < selFrom) selTo = selFrom;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const beforeText = ta.value.slice(0, start);
    const lineStart = beforeText.lastIndexOf('\n') + 1;
    const indent = (ta.value.slice(lineStart).match(/^[ \t]*/) || [''])[0];

    const lines = clean.split('\n');
    const indented = lines.map((l, i) => (i === 0 || !l) ? l : indent + l).join('\n');

    let prefix = '';
    if (beforeText.length > 0 && !beforeText.endsWith('\n')) prefix = '\n' + indent;

    const shiftFor = (pos) => {
      let n = 0;
      for (let i = 0; i < pos; i++) if (clean[i] === '\n') n++;
      return n * indent.length;
    };

    ta.value = beforeText + prefix + indented + ta.value.slice(end);
    ta.focus();
    ta.setSelectionRange(
      start + prefix.length + selFrom + shiftFor(selFrom),
      start + prefix.length + selTo + shiftFor(selTo)
    );
    saveCode();
  }

  /* ================= мессенджер ================= */
  function clearChat() {
    chatBody.innerHTML = '';
    typingEl = null;
  }
  function scrollChat() { chatBody.scrollTop = chatBody.scrollHeight; }

  function addBubble(role, text) {
    const el = document.createElement('div');
    el.className = 'bubble bubble--' + role;
    el.textContent = text;
    chatBody.appendChild(el);
    scrollChat();
  }

  function addSystem(html) {
    const el = document.createElement('div');
    el.className = 'bubble bubble--sys';
    el.innerHTML = html;
    chatBody.appendChild(el);
    scrollChat();
  }

  function addErrorBubble(text) {
    const el = document.createElement('div');
    el.className = 'bubble bubble--err';
    el.textContent = '⚠️ ' + text;
    chatBody.appendChild(el);
    scrollChat();
  }

  function showTypingBubble() {
    if (typingEl) return;
    typingEl = document.createElement('div');
    typingEl.className = 'bubble bubble--bot bubble--typing';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(typingEl);
    scrollChat();
  }
  function hideTypingBubble() {
    if (typingEl) { typingEl.remove(); typingEl = null; }
  }

  function resetChatInput() {
    chatInput.value = '';
    chatInput.disabled = true;
    chatSendBtn.disabled = true;
  }
  function enableChatInput() {
    chatInput.disabled = false;
    chatSendBtn.disabled = false;
    if (!isMobile()) chatInput.focus();
  }

  function waitForUserInput() {
    return new Promise((resolve, reject) => {
      pendingInput = { resolve, reject };
      enableChatInput();
    });
  }

  function cancelPendingInput() {
    if (pendingInput) {
      const p = pendingInput;
      pendingInput = null;
      p.reject(new PyBot.AbortError());
    }
    resetChatInput();
  }

  function submitChat() {
    const v = chatInput.value;
    if (!v.trim() || !pendingInput) return;
    chatInput.value = '';
    resetChatInput();
    const p = pendingInput;
    pendingInput = null;
    p.resolve(v);
  }

  chatSendBtn.addEventListener('click', submitChat);
  chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitChat(); });
  chatInput.addEventListener('focus', () => {
    if (isMobile()) {
      setTimeout(() => chatInput.scrollIntoView({ block: 'center', behavior: 'smooth' }), 120);
    }
  });

  /* ================= результат ================= */
  function hideResult() { resultBar.classList.add('hidden'); }

  function showResult(kind, html) {
    resultBar.className = 'result-bar result-bar--' + kind;
    resultBar.innerHTML = html;
    resultBar.classList.remove('hidden');
  }

  /* ================= запуск интерпретатора ================= */
  function makeRuntime(opts) {
    const rt = {
      steps: 0,
      aborted: false,
      delay: opts.delay,
      onBot: opts.onBot,
      onUser: opts.onUser,
      getInput: opts.getInput
    };
    rt.send = async (text) => {
      if (rt.aborted) throw new PyBot.AbortError();
      if (opts.typing) {
        showTypingBubble();
        await sleep(opts.typingDelay || 200);
        hideTypingBubble();
        if (rt.aborted) throw new PyBot.AbortError();
      }
      rt.onBot(text);
      await sleep(rt.delay);
      if (rt.aborted) throw new PyBot.AbortError();
    };
    rt.input = async () => {
      if (rt.aborted) throw new PyBot.AbortError();
      const v = await rt.getInput();
      if (rt.aborted) throw new PyBot.AbortError();
      rt.onUser(v);
      await sleep(rt.delay * 0.4);
      return v;
    };
    return rt;
  }

  function stopRun() {
    if (currentRuntime) { currentRuntime.aborted = true; currentRuntime = null; }
    cancelPendingInput();
    hideTypingBubble();
  }

  async function runFree() {
    if (busy) return;
    stopRun();
    hideResult();
    clearChat();
    playClick();

    const code = codeArea.value;
    const rt = makeRuntime({
      delay: 260,
      typing: true,
      typingDelay: 200,
      onBot: (t) => addBubble('bot', t),
      onUser: (t) => addBubble('user', t),
      getInput: () => waitForUserInput()
    });
    currentRuntime = rt;

    try {
      await PyBot.run(code, rt);
      addSystem('— бот закончил работу —');
    } catch (e) {
      if (!(e instanceof PyBot.AbortError)) {
        playError();
        addErrorBubble(e.message || String(e));
      }
    } finally {
      if (currentRuntime === rt) currentRuntime = null;
      resetChatInput();
    }
  }

  async function runCheck() {
    if (busy) return;
    stopRun();
    hideResult();

    const code = codeArea.value;
    if (!code.trim()) {
      showResult('fail', '⚠️ Сначала напиши код!');
      playError();
      return;
    }

    busy = true;
    $('#btnCheck').disabled = true;
    $('#btnRun').disabled = true;
    clearChat();

    const task = currentTask();
    const tests = task.tests || [];

    try {
      for (let ti = 0; ti < tests.length; ti++) {
        const test = tests[ti];
        addSystem(tests.length > 1 ? '<b>Тест ' + (ti + 1) + ' из ' + tests.length + '</b>' : '<b>Проверка</b>');

        const replies = (test.replies || []).slice();
        const got = [];

        const rt = makeRuntime({
          delay: 150,
          typing: false,
          onBot: (t) => { got.push(norm(t)); addBubble('bot', t); },
          onUser: (t) => addBubble('user', t),
          getInput: async () => {
            if (!replies.length) {
              throw new PyBot.PyError('Бот ждёт сообщение, но по сценарию теста сообщений больше нет. Может, бот считывает лишний раз?');
            }
            await sleep(220);
            return replies.shift();
          }
        });
        currentRuntime = rt;

        try {
          await PyBot.run(code, rt);
        } catch (e) {
          if (e instanceof PyBot.AbortError) return;
          addErrorBubble(e.message || String(e));
          showResult('fail', '❌ Ошибка в программе. Исправь и попробуй снова!');
          playError();
          return;
        } finally {
          if (currentRuntime === rt) currentRuntime = null;
        }

        const expected = (test.expect || []).map(norm);
        if (JSON.stringify(got) !== JSON.stringify(expected)) {
          const fmt = (arr) => arr.length
            ? arr.map((s) => '«' + escapeHtml(s) + '»').join(' → ')
            : '(бот ничего не отправил)';
          addSystem('<b>❌ Не совпало.</b><br>Ожидалось: ' + fmt(expected) +
                    '<br>А бот отправил: ' + fmt(got));
          showResult('fail', '❌ Пока не получилось. Проверь код и попробуй снова!');
          playError();
          return;
        }
      }

      // успех
      markDone(state.lessonId, state.taskIndex);
      saveCode();
      renderDots(currentLesson());

      const lesson = currentLesson();
      const allDone = (progress.done[lesson.id] || []).length === lesson.tasks.length;

      if (allDone) {
        $('#btnSummary').classList.remove('hidden');
        showResult('ok', '🏆 Урок пройден! <button class="btn btn--sm" id="btnGoSummary">Смотреть итог</button>');
        const b = $('#btnGoSummary');
        if (b) b.onclick = () => openSummary(lesson);
        fireConfetti(55);
        playJingle();
        showToast('Урок ' + lesson.id + ' пройден!', '🏆');
      } else if (state.taskIndex < lesson.tasks.length - 1) {
        showResult('ok', '✅ Задание выполнено! <button class="btn btn--sm" id="btnNextTask">Дальше →</button>');
        const b = $('#btnNextTask');
        if (b) b.onclick = () => { saveCode(); state.taskIndex++; renderTask(); };
        playSuccess();
        showToast('Задание выполнено!', '✨');
      } else {
        showResult('ok', '✅ Задание выполнено!');
        playSuccess();
        showToast('Задание выполнено!', '✨');
      }
    } finally {
      busy = false;
      $('#btnCheck').disabled = false;
      $('#btnRun').disabled = false;
      resetChatInput();
    }
  }

  function saveCode() {
    if (state.lessonId === null) return;
    progress.code[state.lessonId + '-' + state.taskIndex] = codeArea.value;
    saveProgress();
    showSaveIndicator();
  }

  function showSaveIndicator() {
    if (!saveIndicator) return;
    saveIndicator.classList.add('is-visible');
    clearTimeout(indicatorTimer);
    indicatorTimer = setTimeout(() => saveIndicator.classList.remove('is-visible'), 1200);
  }

  /* ================= модалки ================= */
  function openModal(title, html) {
    $('#modalTitle').textContent = title;
    $('#modalBody').innerHTML = html;
    $('#modal').classList.remove('hidden');
    $('#modalBody').scrollTop = 0;
  }
  function closeModal() { $('#modal').classList.add('hidden'); }

  function summaryHtml(lesson) {
    if (!lesson.summary) return '';
    let html = '<h3>🏆 Итоговый код урока</h3><div class="summary">';
    lesson.summary.forEach((s) => {
      html += '<div class="sum-row"><pre class="sum-code">' + escapeHtml(s.code) +
              '</pre><div class="sum-note">' + s.note + '</div></div>';
    });
    return html + '</div>';
  }

  function openSummary(lesson) {
    openModal('🏆 Урок ' + lesson.id + ' пройден!',
      '<h3>' + escapeHtml(lesson.title) + '</h3>' +
      '<p>Вот код, который ты собрал в этом уроке — с объяснением каждой строки:</p>' +
      summaryHtml(lesson));
  }

  function openTextbook(activeId) {
    const tabs = LESSONS.map((l) =>
      '<button class="tab' + (l.id === activeId ? ' tab--active' : '') + '" data-l="' + l.id + '">Урок ' + l.id + '</button>'
    ).join('');
    const panes = LESSONS.map((l) =>
      '<div class="tabpane' + (l.id === activeId ? '' : ' hidden') + '" data-pane="' + l.id + '">' +
        l.theory + summaryHtml(l) +
      '</div>'
    ).join('');

    openModal('📖 Учебник', '<div class="tabs">' + tabs + '</div><div class="tabpanes">' + panes + '</div>');

    const body = $('#modalBody');
    body.querySelectorAll('.tab').forEach((t) => {
      t.onclick = () => {
        body.querySelectorAll('.tab').forEach(x => x.classList.remove('tab--active'));
        t.classList.add('tab--active');
        body.querySelectorAll('.tabpane').forEach(p => {
          p.classList.toggle('hidden', p.dataset.pane !== t.dataset.l);
        });
      };
    });
  }

  /* ================= привязка событий ================= */
  updateSoundBtn();

  $('#btnSound').onclick = () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem(SOUND_KEY, soundEnabled ? '1' : '0');
    updateSoundBtn();
    if (soundEnabled) playSuccess();
  };

  $('#btnTextbook').onclick = () => { playClick(); openTextbook(state.lessonId || 1); };
  $('#modalClose').onclick = closeModal;
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });

  $('#btnReset').onclick = () => {
    if (confirm('Удалить весь прогресс и весь написанный код? Это нельзя отменить.')) {
      progress = { done: {}, code: {} };
      saveProgress();
      renderLessons();
      if (state.lessonId !== null) { state.taskIndex = 0; renderTask(); }
      showToast('Прогресс очищен', '🗑');
    }
  };

  $('#btnRun').onclick = runFree;
  $('#btnCheck').onclick = runCheck;

  $('#btnCopy').onclick = async () => {
    const code = codeArea.value;
    if (!code.trim()) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        codeArea.select();
        document.execCommand('copy');
      }
      showToast('Код скопирован', '📋');
      playClick();
    } catch (e) {
      showToast('Не удалось скопировать', '⚠️');
    }
  };

  $('#btnResetCode').onclick = () => {
    if (!confirm('Вернуть исходный код задания?')) return;
    codeArea.value = currentTask().starter || '';
    saveCode();
  };

  $('#btnBack').onclick = () => {
    saveCode();
    stopRun();
    renderLessons();
    showScreen('lessons');
  };

  $('#btnTheory').onclick = () => { playClick(); openTextbook(state.lessonId); };
  $('#btnSummary').onclick = () => openSummary(currentLesson());

  /* автосохранение кода */
  codeArea.addEventListener('input', () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveCode, 400);
  });

  /* клавиши в редакторе */
  codeArea.addEventListener('keydown', (e) => {
    const ta = e.target;

    /* Ctrl+Enter / Cmd+Enter — запустить */
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runFree();
      return;
    }

    /* Enter — автоотступ */
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      const start = ta.selectionStart;
      const before = ta.value.slice(0, start);
      const lineStart = before.lastIndexOf('\n') + 1;
      const line = before.slice(lineStart);
      const indent = (line.match(/^[ \t]*/) || [''])[0];
      const extra = line.trim().endsWith(':') ? '    ' : '';
      if (indent || extra) {
        e.preventDefault();
        const ins = '\n' + indent + extra;
        ta.value = before + ins + ta.value.slice(ta.selectionEnd);
        ta.setSelectionRange(start + ins.length, start + ins.length);
        saveCode();
      }
    }

    /* Tab — 4 пробела */
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = ta.selectionStart;
      ta.value = ta.value.slice(0, start) + '    ' + ta.value.slice(ta.selectionEnd);
      ta.setSelectionRange(start + 4, start + 4);
      saveCode();
    }
  });

  /* Esc закрывает модалку */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('#modal').classList.contains('hidden')) closeModal();
  });

  window.addEventListener('beforeunload', () => { saveCode(); stopRun(); });

  /* ================= старт ================= */
  renderLessons();
  showScreen('lessons');
})();