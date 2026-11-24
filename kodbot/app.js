/* app.js — интерфейс тренажёра «КодБот» */
(function () {
'use strict';
const STORAGE_KEY = 'kodobot_progress_v2';
const SOUND_KEY = 'kodobot_sound';
const ACH_KEY = 'kodobot_achievements_v1';
const INTRO_KEY = 'kodobot_intro_seen_v1';
const SANDBOX_KEY = 'kodobot_sandbox_v1';
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
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
function lessonDoneCount(lid) { return (progress.done[lid] || []).length; }
function isLessonUnlocked(lid) {
  if (lid === 1) return true;
  return lessonDoneCount(lid - 1) >= 7; // нужно решить 7 из 10 предыдущего
}

/* ================= достижения ================= */
const ACHIEVEMENTS = [
  { id: 'first_send', title: 'Первое слово', desc: 'Отправь первое сообщение ботом', icon: '💬' },
  { id: 'first_if', title: 'Первая развилка', desc: 'Реши задание с if', icon: '🔀' },
  { id: 'first_loop', title: 'Крутится-вертится', desc: 'Реши задание с циклом', icon: '🔁' },
  { id: 'first_func', title: 'Мастер функций', desc: 'Создай свою функцию', icon: '🧩' },
  { id: 'first_list', title: 'Список дел', desc: 'Используй список', icon: '📋' },
  { id: 'first_random', title: 'Игра случая', desc: 'Используй random', icon: '🎲' },
  { id: 'lesson_1', title: 'Знакомство', desc: 'Пройди урок 1', icon: '👋' },
  { id: 'lesson_2', title: 'Считаем вместе', desc: 'Пройди урок 2', icon: '🔢' },
  { id: 'lesson_3', title: 'Логик', desc: 'Пройди урок 3', icon: '🧠' },
  { id: 'lesson_4', title: 'Повторенье', desc: 'Пройди урок 4', icon: '🔁' },
  { id: 'lesson_5', title: 'Архитектор', desc: 'Пройди урок 5', icon: '🏗' },
  { id: 'lesson_6', title: 'Коллекционер', desc: 'Пройди урок 6', icon: '📦' },
  { id: 'lesson_7', title: 'Маг слов', desc: 'Пройди урок 7', icon: '✨' },
  { id: 'lesson_8', title: 'Мастер-бот', desc: 'Пройди финальный урок', icon: '🏆' },
  { id: 'sandboxer', title: 'Творец', desc: 'Запусти код в песочнице', icon: '🧪' },
  { id: 'perfectionist', title: 'Перфекционист', desc: 'Реши все 80 заданий', icon: '💎' },
];
let achievements = loadAchievements();
function loadAchievements() {
  try {
    const raw = localStorage.getItem(ACH_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return [];
}
function saveAchievements() {
  try { localStorage.setItem(ACH_KEY, JSON.stringify(achievements)); } catch (e) { /* ignore */ }
}
function earnAchievement(id) {
  if (achievements.indexOf(id) !== -1) return;
  const a = ACHIEVEMENTS.find(x => x.id === id);
  if (!a) return;
  achievements.push(id);
  saveAchievements();
  showToast(a.title + ' — ' + a.desc, a.icon);
  playJingle();
}

/* ================= звук ================= */
let audioCtx = null;
let soundEnabled = localStorage.getItem(SOUND_KEY) === '1';
function updateSoundBtn() {
  const b = $('#btnSound');
  if (b) b.textContent = soundEnabled ? '🔊' : '🔇';
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
      { label: 'x = "текст"', text: '⟦text⟧ = " "' },
      { label: 'x = 0', text: '⟦n⟧ = 0' }
    ]
  },
  cond: {
    title: '🔀 Условия',
    items: [
      { label: 'if / else', text: 'if ⟦answer == "Да"⟧:\n    send(" ")\nelse:\n    send(" ")' },
      { label: 'if / elif / else', text: 'if ⟦answer == "Да"⟧:\n    send(" ")\nelif answer == "Нет":\n    send(" ")\nelse:\n    send(" ")' }
    ]
  },
  loop: {
    title: '🔁 Циклы',
    items: [
      { label: 'for i in range(3)', text: 'for i in range(⟦3⟧):\n    send(" ")' },
      { label: 'while True', text: 'while True:\n    ⟦answer⟧ = input()\n    if answer == "стоп":\n        break' },
      { label: 'break', text: 'break' },
      { label: 'continue', text: 'continue' }
    ]
  },
  func: {
    title: '🧩 Функции',
    items: [
      { label: 'def имя():', text: 'def ⟦hello⟧():\n    send(" ")' },
      { label: 'def имя(x):', text: 'def ⟦greet⟧(name):\n    send("Привет, " + name + "!")' },
      { label: 'return', text: 'return ⟦"текст"⟧' }
    ]
  },
  list: {
    title: '📋 Списки',
    items: [
      { label: '[1, 2, 3]', text: '⟦items⟧ = [⟦1, 2, 3⟧]' },
      { label: 'list.append(x)', text: '⟦items⟧.append(⟦x⟧)' },
      { label: 'list.remove(x)', text: '⟦items⟧.remove(⟦x⟧)' },
      { label: 'list[i]', text: '⟦items⟧[⟦0⟧]' },
      { label: 'len(list)', text: 'len(⟦items⟧)' },
      { label: 'x in list', text: '⟦x⟧ in ⟦items⟧' }
    ]
  },
  str: {
    title: '✂️ Строки',
    items: [
      { label: 'upper()', text: '⟦text⟧.upper()' },
      { label: 'lower()', text: '⟦text⟧.lower()' },
      { label: 'find()', text: '⟦text⟧.find(⟦"мир"⟧)' },
      { label: 'split()', text: '⟦text⟧.split(⟦" "⟧)' },
      { label: '" ".join()', text: '" ".join(⟦words⟧)' },
      { label: 'replace()', text: '⟦text⟧.replace(⟦"а"⟧, ⟦"о"⟧)' }
    ]
  },
  random: {
    title: '🎲 Случайности',
    items: [
      { label: 'random.randint(1,10)', text: 'random.randint(⟦1⟧, ⟦10⟧)' },
      { label: 'random.choice(list)', text: 'random.choice(⟦items⟧)' }
    ]
  },
  math: {
    title: '🔢 Числа и текст',
    items: [
      { label: 'int()', text: 'int(⟦⟧)' },
      { label: 'str()', text: 'str(⟦⟧)' },
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
let varsPanel = null;

/* ================= навигация ================= */
function showScreen(name) {
  $('#screenLessons').classList.toggle('hidden', name !== 'lessons');
  $('#screenTrainer').classList.toggle('hidden', name !== 'trainer');
  $('#screenSandbox').classList.toggle('hidden', name !== 'sandbox');
  window.scrollTo(0, 0);
}
function renderLessons() {
  const grid = $('#lessonsGrid');
  grid.innerHTML = '';
  LESSONS.forEach((l) => {
    const doneCount = lessonDoneCount(l.id);
    const unlocked = isLessonUnlocked(l.id);
    const card = document.createElement('button');
    card.className = 'lesson-card' + (unlocked ? '' : ' is-locked');
    card.style.setProperty('--card-color', l.color);
    card.innerHTML =
      '<div class="lesson-card__emoji">' + l.emoji + '</div>' +
      '<div class="lesson-card__title">Урок ' + l.id + '</div>' +
      '<div class="lesson-card__name">' + escapeHtml(l.title) + '</div>' +
      '<div class="lesson-card__tag">' + escapeHtml(l.tagline) + '</div>' +
      '<div class="lesson-card__bar"><i style="width:' + (doneCount * 10) + '%"></i></div>' +
      '<div class="lesson-card__meta">' + doneCount + ' / 10 заданий' +
        (doneCount === 10 ? ' · 🏆' : '') + '</div>' +
      (unlocked ? '' : '<div class="lesson-card__lock">🔒</div>');
    if (unlocked) {
      card.onclick = () => { playClick(); openLesson(l.id); };
    } else {
      card.onclick = () => {
        playError();
        showToast('Сначала пройди минимум 7 заданий урока ' + (l.id - 1), '🔒');
      };
    }
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
  // Показываем интро, если урок открывается впервые
  const introSeen = JSON.parse(localStorage.getItem(INTRO_KEY) || '{}');
  if (!introSeen[id]) {
    showLessonIntro(LESSONS[id - 1]);
    introSeen[id] = true;
    localStorage.setItem(INTRO_KEY, JSON.stringify(introSeen));
  }
}
function currentLesson() { return LESSONS[state.lessonId - 1]; }
function currentTask() { return currentLesson().tasks[state.taskIndex]; }

/* ================= интро урока ================= */
function showLessonIntro(lesson) {
  const intro = lesson.intro;
  let html = '<div class="intro-welcome">';
  html += '<div class="intro-welcome__emoji">' + intro.emoji + '</div>';
  html += '<div class="intro-welcome__title">' + escapeHtml(intro.title) + '</div>';
  html += '<div class="intro-welcome__sub">Урок ' + lesson.id + ' · Новые команды</div>';
  html += '</div>';
  html += '<p>Вот что ты научишься использовать в этом уроке:</p>';
  intro.commands.forEach((c) => {
    html += '<div class="intro-cmd">' +
      '<pre class="intro-cmd__code">' + escapeHtml(c.code) + '</pre>' +
      '<div class="intro-cmd__desc">' + c.desc + '</div>' +
      '</div>';
  });
  html += '<p style="text-align:center;margin-top:18px;"><button class="btn btn--primary" id="btnIntroStart">Понятно, начинаем! 🚀</button></p>';
  openModal('📘 Урок ' + lesson.id + ': ' + escapeHtml(lesson.title), html);
  setTimeout(() => {
    const b = $('#btnIntroStart');
    if (b) b.onclick = () => { playClick(); closeModal(); };
  }, 50);
}

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
  const allDone = lessonDoneCount(lesson.id) === lesson.tasks.length;
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
      row.innerHTML = '<input type="text" placeholder="Твой текст..."><button>send()</button>';
      const inp = row.querySelector('input');
      const btn = row.querySelector('button');
      btn.onclick = () => {
        const v = inp.value.trim();
        if (!v) { inp.focus(); return; }
        playClick();
        insertSnippet(codeArea, 'send("' + escapePy(v) + '")');
        inp.value = '';
      };
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') btn.click(); });
      wrap.appendChild(row);
    }
    g.items.forEach((item) => {
      const b = document.createElement('button');
      b.className = 'lib-btn';
      b.textContent = item.label;
      b.onclick = () => { playClick(); insertSnippet(codeArea, item.text); };
      wrap.appendChild(b);
    });
    block.appendChild(wrap);
    lib.appendChild(block);
  });
}

/* ================= вставка сниппетов ================= */
const MARK_OPEN = '⟦';
const MARK_CLOSE = '⟧';
function insertSnippet(ta, snippet) {
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
function clearChat() { chatBody.innerHTML = ''; typingEl = null; }
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
  if (isMobile()) setTimeout(() => chatInput.scrollIntoView({ block: 'center', behavior: 'smooth' }), 120);
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
    getInput: opts.getInput,
    onVars: opts.onVars
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

/* ================= визуализация переменных ================= */
function showVarsPanel(vars) {
  closeVarsPanel();
  const panel = document.createElement('div');
  panel.className = 'vars-panel';
  panel.innerHTML =
    '<div class="vars-panel__head"><span>📊 Переменные</span><button class="pane-icon-btn" id="varsClose">✕</button></div>' +
    '<div class="vars-panel__body"></div>';
  const body = panel.querySelector('.vars-panel__body');
  const keys = Object.keys(vars).filter(k => k !== 'random');
  if (keys.length === 0) {
    body.innerHTML = '<div class="vars-empty">Нет переменных. Запусти код!</div>';
  } else {
    keys.forEach((k) => {
      const row = document.createElement('div');
      row.className = 'vars-row';
      const v = vars[k];
      let display;
      if (v && v.__module) display = '&lt;module&gt;';
      else if (v && v.__fn) display = '&lt;function&gt;';
      else if (Array.isArray(v)) display = escapeHtml(toStrPy(v));
      else if (typeof v === 'string') display = '"' + escapeHtml(v) + '"';
      else display = escapeHtml(String(v));
      row.innerHTML = '<span class="vars-name">' + escapeHtml(k) + '</span><span class="vars-val">' + display + '</span>';
      body.appendChild(row);
    });
  }
  document.body.appendChild(panel);
  panel.querySelector('#varsClose').onclick = closeVarsPanel;
  varsPanel = panel;
}
function closeVarsPanel() {
  if (varsPanel) { varsPanel.remove(); varsPanel = null; }
}
function toStrPy(v) {
  if (Array.isArray(v)) return '[' + v.map(x => typeof x === 'string' ? '"' + x + '"' : String(x)).join(', ') + ']';
  return String(v);
}

/* ================= запуск свободного режима ================= */
async function runFree(targetCodeArea, targetChatBody, targetChatInput, targetChatSendBtn, opts) {
  opts = opts || {};
  const code = targetCodeArea.value;
  const chatBodyEl = targetChatBody;
  const chatInputEl = targetChatInput;
  const chatSendBtnEl = targetChatSendBtn;
  let typingElLocal = null;
  let pendingLocal = null;

  function clearChatLocal() { chatBodyEl.innerHTML = ''; typingElLocal = null; }
  function scrollChatLocal() { chatBodyEl.scrollTop = chatBodyEl.scrollHeight; }
  function addBubbleLocal(role, text) {
    const el = document.createElement('div');
    el.className = 'bubble bubble--' + role;
    el.textContent = text;
    chatBodyEl.appendChild(el);
    scrollChatLocal();
  }
  function showTypingLocal() {
    if (typingElLocal) return;
    typingElLocal = document.createElement('div');
    typingElLocal.className = 'bubble bubble--bot bubble--typing';
    typingElLocal.innerHTML = '<span></span><span></span><span></span>';
    chatBodyEl.appendChild(typingElLocal);
    scrollChatLocal();
  }
  function hideTypingLocal() {
    if (typingElLocal) { typingElLocal.remove(); typingElLocal = null; }
  }
  function resetInputLocal() {
    chatInputEl.value = '';
    chatInputEl.disabled = true;
    chatSendBtnEl.disabled = true;
  }
  function enableInputLocal() {
    chatInputEl.disabled = false;
    chatSendBtnEl.disabled = false;
    if (!isMobile()) chatInputEl.focus();
  }
  function waitInputLocal() {
    return new Promise((resolve, reject) => {
      pendingLocal = { resolve, reject };
      enableInputLocal();
    });
  }
  function cancelLocal() {
    if (pendingLocal) {
      const p = pendingLocal;
      pendingLocal = null;
      p.reject(new PyBot.AbortError());
    }
    resetInputLocal();
  }
  function submitLocal() {
    const v = chatInputEl.value;
    if (!v.trim() || !pendingLocal) return;
    chatInputEl.value = '';
    resetInputLocal();
    const p = pendingLocal;
    pendingLocal = null;
    p.resolve(v);
  }

  const submitHandler = () => submitLocal();
  const keyHandler = (e) => { if (e.key === 'Enter') submitLocal(); };
  chatSendBtnEl.onclick = submitHandler;
  chatInputEl.onkeydown = keyHandler;

  clearChatLocal();
  playClick();

  const rt = makeRuntime({
    delay: opts.delay || 260,
    typing: opts.typing !== false,
    typingDelay: 200,
    onBot: (t) => addBubbleLocal('bot', t),
    onUser: (t) => addBubbleLocal('user', t),
    getInput: () => waitInputLocal(),
    onVars: opts.onVars
  });
  currentRuntime = rt;
  try {
    await PyBot.run(code, rt);
    const sys = document.createElement('div');
    sys.className = 'bubble bubble--sys';
    sys.textContent = '— бот закончил работу —';
    chatBodyEl.appendChild(sys);
    scrollChatLocal();
  } catch (e) {
    if (!(e instanceof PyBot.AbortError)) {
      playError();
      addErrorBubble(e.message || String(e));
    }
  } finally {
    if (currentRuntime === rt) currentRuntime = null;
    resetInputLocal();
    chatSendBtnEl.onclick = null;
    chatInputEl.onkeydown = null;
  }
}

async function runTrainerFree() {
  if (busy) return;
  stopRun();
  hideResult();
  let lastVars = null;
  await runFree(codeArea, chatBody, chatInput, chatSendBtn, {
    delay: 260,
    typing: true,
    onVars: (v) => { lastVars = v; }
  });
  if (lastVars) showVarsPanel(lastVars);
}

async function runCheck() {
  if (busy) return;
  stopRun();
  hideResult();
  closeVarsPanel();
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
      // Кастомная проверка
      if (test.check) {
        if (!test.check(got)) {
          addSystem('<b>❌ Не совпало.</b><br>Бот отправил: ' + got.map(s => '«' + escapeHtml(s) + '»').join(' → '));
          showResult('fail', '❌ Пока не получилось. Проверь код и попробуй снова!');
          playError();
          return;
        }
      } else {
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
    }
    // успех
    markDone(state.lessonId, state.taskIndex);
    saveCode();
    renderDots(currentLesson());
    checkTaskAchievements();
    const lesson = currentLesson();
    const allDone = lessonDoneCount(lesson.id) === lesson.tasks.length;
    if (allDone) {
      $('#btnSummary').classList.remove('hidden');
      showResult('ok', '🏆 Урок пройден! <button class="btn btn--sm" id="btnGoSummary">Смотреть итог</button>');
      const b = $('#btnGoSummary');
      if (b) b.onclick = () => openSummary(lesson);
      fireConfetti(55);
      playJingle();
      showToast('Урок ' + lesson.id + ' пройден!', '🏆');
      earnAchievement('lesson_' + lesson.id);
      // Проверяем перфекциониста
      let total = 0;
      LESSONS.forEach(l => total += lessonDoneCount(l.id));
      if (total === 80) earnAchievement('perfectionist');
      // Разблокировка следующего урока
      if (lesson.id < LESSONS.length) {
        setTimeout(() => showToast('Открыт урок ' + (lesson.id + 1) + '!', '🔓'), 1500);
      }
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

/* ================= проверки достижений по коду ================= */
function checkTaskAchievements() {
  const code = codeArea.value;
  if (/send\s*\(/.test(code)) earnAchievement('first_send');
  if (/\bif\b/.test(code)) earnAchievement('first_if');
  if (/\b(for|while)\b/.test(code)) earnAchievement('first_loop');
  if (/\bdef\b/.test(code)) earnAchievement('first_func');
  if (/\[.*\]/.test(code) || /\.append\(/.test(code)) earnAchievement('first_list');
  if (/random\./.test(code)) earnAchievement('first_random');
}

/* ================= песочница ================= */
let sandboxRuntime = null;
function openSandbox() {
  showScreen('sandbox');
  renderSandboxLib();
  const saved = localStorage.getItem(SANDBOX_KEY) || '# Напиши свой код здесь!\nsend("Привет из песочницы!")\n';
  $('#sandboxCode').value = saved;
  $('#sandboxChatBody').innerHTML = '';
  const sys = document.createElement('div');
  sys.className = 'bubble bubble--sys';
  sys.textContent = '🧪 Песочница — экспериментируй свободно!';
  $('#sandboxChatBody').appendChild(sys);
}
function renderSandboxLib() {
  const lib = $('#sandboxLibBody');
  lib.innerHTML = '';
  Object.keys(LIB_GROUPS).forEach((gid) => {
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
      row.innerHTML = '<input type="text" placeholder="Твой текст..."><button>send()</button>';
      const inp = row.querySelector('input');
      const btn = row.querySelector('button');
      btn.onclick = () => {
        const v = inp.value.trim();
        if (!v) { inp.focus(); return; }
        playClick();
        insertSnippet($('#sandboxCode'), 'send("' + escapePy(v) + '")');
        inp.value = '';
      };
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') btn.click(); });
      wrap.appendChild(row);
    }
    g.items.forEach((item) => {
      const b = document.createElement('button');
      b.className = 'lib-btn';
      b.textContent = item.label;
      b.onclick = () => { playClick(); insertSnippet($('#sandboxCode'), item.text); };
      wrap.appendChild(b);
    });
    block.appendChild(wrap);
    lib.appendChild(block);
  });
}
async function runSandbox() {
  if (sandboxRuntime) { sandboxRuntime.aborted = true; sandboxRuntime = null; }
  earnAchievement('sandboxer');
  let lastVars = null;
  await runFree($('#sandboxCode'), $('#sandboxChatBody'), $('#sandboxChatInput'), $('#sandboxChatSend'), {
    delay: 260,
    typing: true,
    onVars: (v) => { lastVars = v; }
  });
  if (lastVars) showVarsPanel(lastVars);
}

/* ================= сохранение кода ================= */
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
function openAchievements() {
  let html = '<p>Твои достижения за время обучения:</p><div class="ach-grid">';
  ACHIEVEMENTS.forEach((a) => {
    const earned = achievements.indexOf(a.id) !== -1;
    html += '<div class="ach-card ' + (earned ? 'is-earned' : 'is-locked') + '">' +
      '<div class="ach-card__emoji">' + (earned ? a.icon : '🔒') + '</div>' +
      '<div class="ach-card__title">' + escapeHtml(a.title) + '</div>' +
      '<div class="ach-card__desc">' + escapeHtml(a.desc) + '</div>' +
      '</div>';
  });
  html += '</div>';
  openModal('🏅 Достижения (' + achievements.length + '/' + ACHIEVEMENTS.length + ')', html);
}

/* ================= экспорт/импорт ================= */
function exportProgress() {
  const data = {
    version: 2,
    progress: progress,
    achievements: achievements,
    introSeen: JSON.parse(localStorage.getItem(INTRO_KEY) || '{}'),
    sandbox: localStorage.getItem(SANDBOX_KEY) || '',
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kodbot_progress_' + new Date().toISOString().slice(0, 10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Прогресс сохранён в файл', '💾');
  playClick();
}
function importProgress(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.progress) throw new Error('Неверный формат');
      if (!confirm('Заменить текущий прогресс данными из файла?')) return;
      progress = data.progress;
      achievements = data.achievements || [];
      if (data.introSeen) localStorage.setItem(INTRO_KEY, JSON.stringify(data.introSeen));
      if (data.sandbox) localStorage.setItem(SANDBOX_KEY, data.sandbox);
      saveProgress();
      saveAchievements();
      renderLessons();
      if (state.lessonId !== null) { state.taskIndex = 0; renderTask(); }
      showToast('Прогресс загружен!', '📥');
      playSuccess();
    } catch (err) {
      showToast('Ошибка: ' + err.message, '⚠️');
      playError();
    }
  };
  reader.readAsText(file);
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
    achievements = [];
    saveProgress();
    saveAchievements();
    localStorage.removeItem(INTRO_KEY);
    renderLessons();
    if (state.lessonId !== null) { state.taskIndex = 0; renderTask(); }
    showToast('Прогресс очищен', '🗑');
  }
};
$('#btnRun').onclick = runTrainerFree;
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
  closeVarsPanel();
  renderLessons();
  showScreen('lessons');
};
$('#btnTheory').onclick = () => { playClick(); openTextbook(state.lessonId); };
$('#btnSummary').onclick = () => openSummary(currentLesson());
$('#btnVars').onclick = () => {
  if (varsPanel) closeVarsPanel();
  else showToast('Запусти код, чтобы увидеть переменные', '📊');
};

/* Песочница */
$('#btnSandbox').onclick = () => { playClick(); openSandbox(); };
$('#btnBackFromSandbox').onclick = () => {
  localStorage.setItem(SANDBOX_KEY, $('#sandboxCode').value);
  showScreen('lessons');
};
$('#btnSandboxRun').onclick = runSandbox;
$('#btnSandboxClear').onclick = () => {
  if (confirm('Очистить код и чат?')) {
    $('#sandboxCode').value = '';
    $('#sandboxChatBody').innerHTML = '';
    localStorage.removeItem(SANDBOX_KEY);
  }
};
$('#btnSandboxCopy').onclick = async () => {
  const code = $('#sandboxCode').value;
  if (!code.trim()) return;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(code);
    else { $('#sandboxCode').select(); document.execCommand('copy'); }
    showToast('Код скопирован', '📋');
    playClick();
  } catch (e) { showToast('Не удалось скопировать', '⚠️'); }
};
$('#btnSandboxVars').onclick = () => {
  if (varsPanel) closeVarsPanel();
  else showToast('Запусти код, чтобы увидеть переменные', '📊');
};

/* Достижения, экспорт, импорт */
$('#btnAchievements').onclick = () => { playClick(); openAchievements(); };
$('#btnExport').onclick = exportProgress;
$('#btnImport').onclick = () => $('#importFile').click();
$('#importFile').addEventListener('change', (e) => {
  if (e.target.files[0]) importProgress(e.target.files[0]);
  e.target.value = '';
});

/* автосохранение кода */
codeArea.addEventListener('input', () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveCode, 400);
});
$('#sandboxCode').addEventListener('input', () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    localStorage.setItem(SANDBOX_KEY, $('#sandboxCode').value);
  }, 400);
});

/* клавиши в редакторе */
function setupEditorKeys(ta) {
  ta.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (ta.id === 'sandboxCode') runSandbox();
      else runTrainerFree();
      return;
    }
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
        if (ta.id === 'codeArea') saveCode();
      }
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = ta.selectionStart;
      ta.value = ta.value.slice(0, start) + '    ' + ta.value.slice(ta.selectionEnd);
      ta.setSelectionRange(start + 4, start + 4);
      if (ta.id === 'codeArea') saveCode();
    }
  });
}
setupEditorKeys(codeArea);
setupEditorKeys($('#sandboxCode'));

/* Esc закрывает модалку и панель переменных */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!$('#modal').classList.contains('hidden')) closeModal();
    else if (varsPanel) closeVarsPanel();
  }
});
window.addEventListener('beforeunload', () => {
  saveCode();
  stopRun();
  if ($('#screenSandbox') && !$('#screenSandbox').classList.contains('hidden')) {
    localStorage.setItem(SANDBOX_KEY, $('#sandboxCode').value);
  }
});

/* ================= старт ================= */
renderLessons();
showScreen('lessons');
})();
