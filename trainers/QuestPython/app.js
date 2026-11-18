/* ============================================================
   app.js — вся логика приложения: экраны, сцена, анимация
   ============================================================ */
(function () {
'use strict';
if (typeof simulateLevel !== 'function') {
  document.getElementById('app').innerHTML =
    '<div style="padding:40px 20px;text-align:center;font-family:sans-serif;color:#e8edff;max-width:640px;margin:0 auto">' +
    '<h1 style="color:#f87171">⚠️ Файл interpreter.js не загружен</h1>' +
    '<p>Проверьте:</p>' +
    '<ol style="text-align:left;display:inline-block;line-height:1.8">' +
    '<li>Файл <code style="background:#1a2344;padding:2px 6px;border-radius:4px">interpreter.js</code> лежит рядом с <code style="background:#1a2344;padding:2px 6px;border-radius:4px">index.html</code></li>' +
    '<li>В <code style="background:#1a2344;padding:2px 6px;border-radius:4px">index.html</code> есть строка <code style="background:#1a2344;padding:2px 6px;border-radius:4px">&lt;script src="interpreter.js"&gt;&lt;/script&gt;</code></li>' +
    '<li>Она идёт <b>до</b> <code style="background:#1a2344;padding:2px 6px;border-radius:4px">&lt;script src="app.js"&gt;&lt;/script&gt;</code></li>' +
    '<li>В консоли (F12) нет красной ошибки <b>SyntaxError</b> про interpreter.js</li>' +
    '</ol>' +
    '<p style="margin-top:20px"><button onclick="location.reload()" style="padding:10px 20px;border-radius:10px;border:1px solid #2f3d70;background:#1a2344;color:#e8edff;font-weight:700;cursor:pointer">Обновить</button></p>' +
    '</div>';
  return;
}

// ================= Storage =================
let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && typeof s === 'object') {
        s.progress = s.progress || {};
        if (s.age) {
          const oldKeys = Object.keys(s.progress).filter(k => /^\d+-\d+$/.test(k));
          oldKeys.forEach(k => {
            const nk = s.age + '-' + k;
            if (!s.progress[nk]) s.progress[nk] = s.progress[k];
          });
        }
        return s;
      }
    }
  } catch (e) {}
  return { age: null, progress: {} };
}
function saveState() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {}
}

// ================= Utils =================
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function toast(msg, ms = 2000) {
  const t = el('div', 'toast', msg);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), ms);
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function keyOf(mi, li) { return (state.age || '7-9') + '-' + mi + '-' + li; }
function isDone(mi, li) { const p = state.progress[keyOf(mi, li)]; return !!(p && p.done); }
function getStars(mi, li) { const p = state.progress[keyOf(mi, li)]; return p ? (p.stars || 0) : 0; }
function moduleStars(mi) {
  let s = 0;
  for (let li = 0; li < MODULES[mi].levels.length; li++) s += getStars(mi, li);
  return s;
}
function totalStars() {
  let s = 0;
  for (let mi = 0; mi < MODULES.length; mi++) s += moduleStars(mi);
  return s;
}
function isModuleUnlocked(mi) {
  if (mi === 0) return true;
  let done = 0;
  const prev = MODULES[mi - 1].levels.length;
  for (let li = 0; li < prev; li++) if (isDone(mi - 1, li)) done++;
  return done >= 5;
}
function isLevelUnlocked(mi, li) {
  if (!isModuleUnlocked(mi)) return false;
  for (let i = 0; i < li; i++) if (!isDone(mi, i)) return false;
  return true;
}

// ================= App root =================
const app = document.getElementById('app');
let currentScene = null;

// ================= Home =================
function renderHome() {
  app.innerHTML = '';
  const home = el('div', 'home');
  home.innerHTML = `
    <div class="logo">Python Quest</div>
    <div class="sub">Игровой тренажёр по программированию.<br>Выбери свой возраст — и вперёд!</div>
    <div class="ages">
      <button class="agecard" data-age="7-9">
        <span class="emo">🧒</span><div class="t">7–9 лет</div>
        <div class="d">Простые команды, яркие персонажи, много подсказок</div>
      </button>
      <button class="agecard" data-age="10-12">
        <span class="emo">👦</span><div class="t">10–12 лет</div>
        <div class="d">Циклы, условия, функции — с играми и мемами</div>
      </button>
      <button class="agecard" data-age="13-14">
        <span class="emo">🧑</span><div class="t">13–14 лет</div>
        <div class="d">Полный курс Python: списки, функции, алгоритмы</div>
      </button>
    </div>
    <div class="row" style="margin-top:16px">
      <button class="btn ghost" id="go-textbook">📖 Учебник</button>
      <button class="btn ghost" id="go-creative">🎨 Творческий режим</button>
      <button class="btn ghost" id="go-reset">🗑️ Сбросить прогресс</button>
    </div>
    <div class="sub" style="font-size:12px;margin-top:12px">⭐ Звёзды: ${totalStars()} / ${MODULES.length * 30}</div>
  `;
  app.appendChild(home);

  home.querySelectorAll('.agecard').forEach(b => b.addEventListener('click', () => {
    state.age = b.dataset.age;
    saveState();
    renderModules();
  }));
  document.getElementById('go-textbook').addEventListener('click', openTextbook);
  document.getElementById('go-creative').addEventListener('click', renderCreative);
  document.getElementById('go-reset').addEventListener('click', () => {
    if (!confirm('Сбросить весь прогресс? Это действие нельзя отменить.')) return;
    state = { age: state.age, progress: {} };
    saveState();
    toast('Прогресс сброшен');
    renderHome();
  });
}

// ================= Age-based level picker =================
function getLevel(mi, li) {
  const base = MODULES[mi].levels[li];
  const age = state.age || '7-9';
  const ov = base.byAge && base.byAge[age];
  return ov ? Object.assign({}, base, ov) : base;
}

// ================= Module intro (theory) =================
function renderModuleIntro(mi) {
  const m = MODULES[mi];
  const overlay = el('div', 'overlay');
  const modal = el('div', 'modal');
  modal.innerHTML = `
    <header><h3>${m.icon} Модуль ${mi + 1}. ${escapeHtml(m.title)}</h3></header>
    <div class="body"><div class="theory">${m.theory}</div></div>
    <footer>
      <button class="btn ghost" id="close">← Назад</button>
      <button class="btn primary" id="start">🚀 Начать обучение</button>
    </footer>`;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  modal.querySelector('#close').addEventListener('click', () => overlay.remove());
  modal.querySelector('#start').addEventListener('click', () => {
    overlay.remove();
    renderLevels(mi);
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}


// ================= Modules list =================


function renderModules() {
  app.innerHTML = '';
  const screen = el('div', 'screen');
  const top = el('div', 'topbar');
  top.innerHTML = `
    <button class="btn ghost" id="back">← На главную</button>
    <div class="title">Выбери модуль</div>
    <span class="badge">⭐ ${totalStars()}</span>`;
  const scroll = el('div', 'scroll');
  const grid = el('div', 'modgrid');

  MODULES.forEach((m, mi) => {
    const unlocked = isModuleUnlocked(mi);
    const stars = moduleStars(mi);
    const card = el('div', 'modcard' + (unlocked ? '' : ' locked'));
    card.innerHTML = `
      <div class="ic">${m.icon}</div>
      <div class="mt">Модуль ${mi + 1}. ${m.title}</div>
      <div class="md">${m.desc}</div>
      <div class="bar"><i style="width:${(stars / (m.levels.length * 3) * 100).toFixed(0)}%"></i></div>
      <div style="font-size:12px;color:var(--dim)">${stars} / ${m.levels.length * 3} ⭐ ${unlocked ? '' : '· 🔒 пройди 5 уровней предыдущего'}</div>`;
    if (unlocked) card.addEventListener('click', () => renderModuleIntro(mi));
    grid.appendChild(card);
  });

  scroll.appendChild(grid);
  screen.appendChild(top);
  screen.appendChild(scroll);
  app.appendChild(screen);
  document.getElementById('back').addEventListener('click', renderHome);
}

// ================= Levels list =================
function renderLevels(mi) {
  app.innerHTML = '';
  const m = MODULES[mi];
  const screen = el('div', 'screen');
  const top = el('div', 'topbar');
  top.innerHTML = `
    <button class="btn ghost" id="back">← Модули</button>
    <div class="title">${m.icon} ${m.title}</div>
    <button class="btn ghost" id="theory">📚 Теория</button>
    <span class="badge">⭐ ${moduleStars(mi)}</span>`;
  const scroll = el('div', 'scroll');
  const grid = el('div', 'lvlgrid');

  m.levels.forEach((lv, li) => {
    const unlocked = isLevelUnlocked(mi, li);
    const done = isDone(mi, li);
    const b = el('button', 'lvlbtn' + (done ? ' done' : '') + (unlocked ? '' : ' locked'));
    b.innerHTML = `<div>${li + 1}</div>
      <div class="st">${done ? '⭐'.repeat(getStars(mi, li)) : (unlocked ? '▶' : '🔒')}</div>`;
    if (unlocked) b.addEventListener('click', () => renderGame(mi, li));
    grid.appendChild(b);
  });

  scroll.appendChild(grid);
  screen.appendChild(top);
  screen.appendChild(scroll);
  app.appendChild(screen);
  document.getElementById('back').addEventListener('click', renderModules);
  document.getElementById('theory').addEventListener('click', () => openTheory(m));
}

// ================= Modals =================
function openTheory(m) {
  openModal(`${m.icon} ${m.title} — теория`, `<div class="theory">${m.theory}</div>`);
}

function openTextbook() {
  const overlay = el('div', 'overlay');
  const modal = el('div', 'modal');
  modal.innerHTML = `
    <header><h3>📖 Учебник</h3><button class="btn ghost" id="close">✕</button></header>
    <div class="body" style="padding:0">
      <div class="book">
        <nav id="booknav"></nav>
        <div class="content" id="bookcontent"></div>
      </div>
    </div>`;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const nav = modal.querySelector('#booknav');
  const content = modal.querySelector('#bookcontent');

  MODULES.forEach(m => {
    const b = el('button', '', `${m.icon} ${m.title}`);
    b.addEventListener('click', () => {
      nav.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      content.innerHTML = `<div class="theory">${m.theory}</div>`;
      content.scrollTop = 0;
    });
    nav.appendChild(b);
  });
  nav.querySelector('button').click();

  modal.querySelector('#close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

function openModal(title, html) {
  const overlay = el('div', 'overlay');
  const modal = el('div', 'modal');
  modal.innerHTML = `
    <header><h3>${title}</h3><button class="btn ghost" id="close">✕</button></header>
    <div class="body">${html}</div>`;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  modal.querySelector('#close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

// ================= Scene =================
class Scene {
  constructor(container, level) {
    this.container = container;
    this.outer = container.parentElement;
    this.level = level;
    this.size = level.size || 8;
    this.walls = new Set((level.walls || []).map(p => `${p[0]},${p[1]}`));
    this.goals = new Set((level.goals || []).map(p => `${p[0]},${p[1]}`));
    this.npcs = level.npcs || [];
    this.reset();
  }
  reset() {
    this.stars = new Set((this.level.stars || []).map(p => `${p[0]},${p[1]}`));
    this.hero = { x: this.level.hero.x, y: this.level.hero.y, d: this.level.hero.d || 'up' };
    this.bubble = null;
    this.build();
  }
  build() {
    const c = this.container;
    c.innerHTML = '';
    const size = this.size;
    const cw = 100 / size;
    c.style.setProperty('--w', size);
    c.style.setProperty('--h', size);

    const grid = el('div', 'grid');
    grid.style.setProperty('--w', size);
    grid.style.setProperty('--h', size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        grid.appendChild(el('div', 'cell' + (this.walls.has(`${x},${y}`) ? ' wall' : '')));
      }
    }
    c.appendChild(grid);

    this.starEls = new Map();
    this.goals.forEach(k => {
      const [x, y] = k.split(',').map(Number);
      c.appendChild(this.makeEnt('🏁', x, y, 'goal'));
    });
    this.stars.forEach(k => {
      const [x, y] = k.split(',').map(Number);
      const e = this.makeEnt('⭐', x, y, 'star');
      this.starEls.set(k, e);
      c.appendChild(e);
    });
    this.npcs.forEach(n => c.appendChild(this.makeEnt(n.e || '🐸', n.x, n.y)));

    this.heroEl = this.makeEnt('🦸', this.hero.x, this.hero.y, 'hero');
    c.appendChild(this.heroEl);

    this.arrowEl = el('div', 'dirarrow');
    c.appendChild(this.arrowEl);

    this.updateHero();
    if (!this._ro) {
      this._ro = new ResizeObserver(() => this.fixSize());
      this._ro.observe(this.outer);
    }
    requestAnimationFrame(() => this.fixSize());
  }
  makeEnt(emoji, x, y, cls) {
    const cw = 100 / this.size;
    const e = el('div', 'ent ' + (cls || ''), emoji);
    e.style.left = (x * cw) + '%';
    e.style.top = (y * cw) + '%';
    e.style.width = cw + '%';
    e.style.height = cw + '%';
    return e;
  }
 fixSize() {
  if (!this.outer) return;
  const ow = this.outer.clientWidth;
  const oh = this.outer.clientHeight;
  const size = Math.min(ow, oh);
  if (size <= 0) return;
  this.container.style.width = size + 'px';
  this.container.style.height = size + 'px';
  const px = size / this.size;
  this.container.querySelectorAll('.ent').forEach(e => {
    e.style.fontSize = (px * 0.72) + 'px';
  });
  if (this.arrowEl) this.arrowEl.style.fontSize = (px * 0.5) + 'px';
}
    updateHero() {
    const cw = 100 / this.size;
    if (this.heroEl) {
      this.heroEl.style.left = (this.hero.x * cw) + '%';
      this.heroEl.style.top = (this.hero.y * cw) + '%';
    }
    if (this.arrowEl) {
      const a = this.arrowEl;
      const cx = (this.hero.x + 0.5) * cw;
      const cy = (this.hero.y + 0.5) * cw;
      // смещаем стрелку к краю клетки в сторону взгляда
      const off = cw * 0.42;
      let dx = 0, dy = 0, ch = '▲';
      if (this.hero.d === 'up')         { dy = -off; ch = '▲'; }
      else if (this.hero.d === 'down')  { dy =  off; ch = '▼'; }
      else if (this.hero.d === 'left')  { dx = -off; ch = '◀'; }
      else                              { dx =  off; ch = '▶'; }
      a.textContent = ch;
      a.style.left = (cx + dx) + '%';
      a.style.top  = (cy + dy) + '%';
    }
    if (this.bubbleEl) {
      this.bubbleEl.style.left = ((this.hero.x + 0.5) * cw) + '%';
      this.bubbleEl.style.top = (this.hero.y * cw) + '%';
    }
  }
  setHero(x, y, d) { this.hero = { x, y, d }; this.updateHero(); }
  removeStar(x, y) {
    const k = `${x},${y}`;
    const e = this.starEls && this.starEls.get(k);
    if (e) { e.remove(); this.starEls.delete(k); }
    this.stars.delete(k);
  }
  say(text) {
    if (this.bubbleEl) this.bubbleEl.remove();
    const cw = 100 / this.size;
    const b = el('div', 'bubble', escapeHtml(text));
    b.style.left = ((this.hero.x + 0.5) * cw) + '%';
    b.style.top = (this.hero.y * cw) + '%';
    b.style.transform = 'translate(-50%, -100%)';
    b.style.bottom = 'auto';
    this.container.appendChild(b);
    this.bubbleEl = b;
  }
  hideBubble() {
    if (this.bubbleEl) { this.bubbleEl.remove(); this.bubbleEl = null; }
  }
  destroy() { if (this._ro) this._ro.disconnect(); }
}

// ================= Game screen =================
function renderGame(mi, li, customLevel) {
  const isCreative = !!customLevel;
  const level = customLevel || getLevel(mi, li);
  const m = isCreative ? null : MODULES[mi];

  app.innerHTML = '';
  const game = el('div', 'game');

  const top = el('div', 'topbar');
  top.innerHTML = `
    <button class="btn ghost" id="back">← ${isCreative ? 'Меню' : 'Уровни'}</button>
    <div class="title">${isCreative ? '🎨 Свой уровень' : `${m.icon} ${level.title}`}</div>
    ${!isCreative ? `<button class="btn ghost" id="theory">📚</button>` : ''}
    <button class="btn ghost" id="hint">💡</button>`;

  const body = el('div', 'gbody');
  body.innerHTML = `
    <div class="panel p-task"><h3>Задание</h3><div class="tasktext" id="tasktext"></div></div>
    <div class="panel p-cmds"><h3>Команды</h3><div class="cmdlist" id="cmdlist"></div></div>
    <div class="panel p-scene"><h3>Сцена</h3>
    <div class="stagewrap">
      <div class="stage-outer"><div class="stage" id="stage"></div></div>
      <div class="console" id="console"></div>
      <div class="scenebar">
        <button class="btn primary" id="run">▶ Запустить</button>
        <button class="btn ghost" id="reset">↺ Сброс</button>
      </div>
    </div></div>
    <div class="panel p-editor"><h3>Код на Python</h3>
      <div class="editor-wrap">
        <div class="line-numbers" id="linenums">1</div>
        <textarea id="editor" spellcheck="false"></textarea>
      </div>
      <div class="codestatus" id="status"><span class="dot"></span>Готов к запуску</div>
    </div>`;

  game.appendChild(top);
  game.appendChild(body);
  app.appendChild(game);

  // Task
  const taskEl = document.getElementById('tasktext');
  taskEl.innerHTML = `<div style="font-weight:800;font-size:15px;margin-bottom:8px">${escapeHtml(isCreative ? 'Свой уровень' : level.title)}</div>${level.task || ''}`;

  // Commands
  const cmds = m ? m.cmds : [
    { code: 'print("...")', desc: 'печать' },
    { code: 'say("...")', desc: 'сказать' },
    { code: 'move_forward()', desc: 'шаг' },
    { code: 'turn_left()', desc: 'налево' },
    { code: 'turn_right()', desc: 'направо' },
    { code: 'move(n)', desc: 'n шагов' },
    { code: 'for i in range(4):\n    move_forward()', desc: 'цикл' },
  ];
  const cmdList = document.getElementById('cmdlist');
  const editor = document.getElementById('editor');
  const linenums = document.getElementById('linenums');

  function refreshLineNumbers() {
    const n = editor.value.split('\n').length;
    let out = '';
    for (let i = 1; i <= n; i++) out += i + (i < n ? '\n' : '');
    linenums.textContent = out;
    linenums.scrollTop = editor.scrollTop;
  }
  function syncScroll() { linenums.scrollTop = editor.scrollTop; }

  editor.addEventListener('input', refreshLineNumbers);
  editor.addEventListener('scroll', syncScroll);
  editor.addEventListener('keydown', () => setTimeout(refreshLineNumbers, 0));
  editor.addEventListener('paste', () => setTimeout(refreshLineNumbers, 0));
  editor.addEventListener('cut', () => setTimeout(refreshLineNumbers, 0));

  cmds.forEach(c => {
    const b = el('button', 'cmdbtn');
    b.innerHTML = `${escapeHtml(c.code)}<small>${escapeHtml(c.desc)}</small>`;
    b.addEventListener('click', () => { insertAtCursor(editor, c.code); refreshLineNumbers(); });
    cmdList.appendChild(b);
  });

  // Initial code
  if (isCreative) {
    editor.value = '';
  } else {
    const saved = (state.progress[keyOf(mi, li)] || {}).code;
    editor.value = level.start || saved || '';
  }
  refreshLineNumbers();

  // Scene
  const stage = document.getElementById('stage');
  const scene = new Scene(stage, level);
  currentScene = scene;

  const consoleEl = document.getElementById('console');
  const statusEl = document.getElementById('status');
  const runBtn = document.getElementById('run');

  function appendConsole(text, cls) {
    const line = el('div', cls || '', escapeHtml(text));
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
    if (consoleEl.children.length > 250) consoleEl.firstChild.remove();
  }
  function clearConsole() {
    consoleEl.innerHTML = '<div class="empty">Здесь появятся сообщения программы…</div>';
  }
  clearConsole();

  document.getElementById('reset').addEventListener('click', () => {
    scene.reset();
    clearConsole();
    statusEl.innerHTML = '<span class="dot"></span>Готов к запуску';
  });

  let running = false;
runBtn.addEventListener('click', async () => {
  if (running) return;
  running = true;
  runBtn.disabled = true;
  try {
    scene.reset();
    clearConsole();
    statusEl.innerHTML = '<span class="dot"></span>Выполняется…';

    const code = editor.value;
    const result = simulateLevel(level, code);

    const many = result.events.length > 40;
    const dMove = many ? 25 : 130;
    const dPrint = many ? 15 : 100;
    const dSay = many ? 250 : 700;

    for (const ev of result.events) {
      if (ev.type === 'move' || ev.type === 'turn') {
        scene.setHero(ev.x, ev.y, ev.d);
        await sleep(dMove);
      } else if (ev.type === 'star') {
        scene.removeStar(ev.x, ev.y);
        await sleep(many ? 20 : 120);
      } else if (ev.type === 'print') {
        appendConsole(ev.text, 'ok');
        await sleep(dPrint);
      } else if (ev.type === 'say') {
        scene.say(ev.text);
        await sleep(dSay);
        scene.hideBubble();
      }
    }

    if (!result.ok) {
      appendConsole('Ошибка: ' + result.error, 'err');
      statusEl.innerHTML = '<span class="dot bad"></span>Ошибка — исправь код';
      return;
    }

    const check = checkWin(level, result);
    if (!check.win) {
      appendConsole('· ' + check.reason, 'err');
      statusEl.innerHTML = '<span class="dot bad"></span>' + escapeHtml(check.reason);
      return;
    }

    statusEl.innerHTML = '<span class="dot ok"></span>Уровень пройден!';

    if (!isCreative) {
      const stars = calcStars(code, level.sol || '');
      const k = keyOf(mi, li);
      const prev = state.progress[k] || {};
      if (!prev.done || (prev.stars || 0) < stars) {
        state.progress[k] = { done: true, stars, code };
      } else {
        state.progress[k] = Object.assign({}, prev, { code });
      }
      saveState();
      await sleep(350);
      showSuccess(mi, li, level, code, stars);
    } else {
      await sleep(350);
      toast('Уровень пройден! 🎉', 2500);
    }
  } catch (err) {
    console.error('Run error:', err);
    appendConsole('Непредвиденная ошибка: ' + (err && err.message ? err.message : err), 'err');
    statusEl.innerHTML = '<span class="dot bad"></span>Ошибка';
  } finally {
    running = false;
    runBtn.disabled = false;
  }
});

  document.getElementById('hint').addEventListener('click', () => {
    if (level.hint) openModal('💡 Подсказка', `<div class="theory"><p>${escapeHtml(level.hint)}</p></div>`);
    else toast('Подсказки нет — попробуй сам!');
  });

  if (!isCreative) {
    document.getElementById('theory').addEventListener('click', () => openTheory(m));
  }

  document.getElementById('back').addEventListener('click', () => {
    if (currentScene) { currentScene.destroy(); currentScene = null; }
    if (isCreative) renderHome();
    else renderLevels(mi);
  });
}

// ================= Helpers =================
function insertAtCursor(textarea, text) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const indent = (value.slice(lineStart, start).match(/^[ \t]*/) || [''])[0];
  const lines = text.split('\n');
  let insert = lines[0];
  if (lines.length > 1) insert += '\n' + lines.slice(1).map(l => indent + l).join('\n');
  textarea.value = value.slice(0, start) + insert + value.slice(end);
  const pos = start + insert.length;
  textarea.selectionStart = textarea.selectionEnd = pos;
  textarea.focus();
}

function calcStars(code, sol) {
  const c = code.replace(/\s+/g, ' ').trim();
  const s = sol.replace(/\s+/g, ' ').trim();
  if (!s) return 3;
  if (c.length <= s.length * 1.4) return 3;
  if (c.length <= s.length * 2.5) return 2;
  return 1;
}

function explainLine(line) {
  if (/^print\s*\(/.test(line)) return 'Вывести значение на экран';
  if (/^say\s*\(/.test(line)) return 'Сказать вслух';
  if (/^move_forward\s*\(\s*\)/.test(line)) return 'Сделать шаг вперёд';
  if (/^move_dir\s*\(/.test(line)) return 'Повернуться в направлении и шагнуть';
  if (/^move\s*\(/.test(line)) return 'Сделать несколько шагов вперёд';
  if (/^turn_left\s*\(\s*\)/.test(line)) return 'Повернуть налево';
  if (/^turn_right\s*\(\s*\)/.test(line)) return 'Повернуть направо';
  if (/^for\s+.+\s+in\s+range\s*\(/.test(line)) return 'Начать цикл: повторить команды с отступом';
  if (/^for\s+.+\s+in\s+/.test(line)) return 'Начать цикл по списку';
  if (/^while\s+/.test(line)) return 'Цикл: повторять, пока условие верно';
  if (/^if\s+/.test(line)) return 'Проверить условие — выполнить блок, если верно';
  if (/^else\s*:/.test(line)) return 'Иначе — выполнить этот блок';
  if (/^def\s+/.test(line)) return 'Создать свою функцию';
  if (/^[A-Za-z_]\w*\s*=(?!=)/.test(line)) return 'Записать значение в переменную';
  if (/^[A-Za-z_]\w*\s*\(/.test(line)) return 'Вызвать функцию';
  return 'Выполнить команду';
}

function showSuccess(mi, li, level, code, stars) {
  const m = MODULES[mi];
  const isLast = li === m.levels.length - 1;
  const lines = code.split('\n');
  const rows = lines.map((l, i) => {
    const t = l.trim();
    if (!t) return '';
    return `<tr><td class="n">${i + 1}</td><td class="c">${escapeHtml(l)}</td><td class="e">${escapeHtml(explainLine(t))}</td></tr>`;
  }).join('');
  const starsHtml = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

  const html = `
    <div class="success-emo">🎉</div>
    <div class="starsbig">${starsHtml}</div>
    <h3 style="text-align:center;margin:12px 0">Уровень «${escapeHtml(level.title)}» пройден!</h3>
    <h4 style="margin-top:20px">Что делает твой код:</h4>
    <table class="codetable">${rows}</table>`;

  const overlay = el('div', 'overlay');
  const modal = el('div', 'modal');
  modal.innerHTML = `
    <header><h3>Уровень пройден!</h3></header>
    <div class="body">${html}</div>
    <footer>
      <button class="btn ghost" id="retry">↺ Ещё раз</button>
      ${!isLast
        ? '<button class="btn primary" id="next">Следующий →</button>'
        : '<button class="btn primary" id="finish">К модулям</button>'}
    </footer>`;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  modal.querySelector('#retry').addEventListener('click', () => overlay.remove());
  if (!isLast) {
    modal.querySelector('#next').addEventListener('click', () => {
      overlay.remove();
      if (currentScene) { currentScene.destroy(); currentScene = null; }
      renderGame(mi, li + 1);
    });
  } else {
    modal.querySelector('#finish').addEventListener('click', () => {
      overlay.remove();
      if (currentScene) { currentScene.destroy(); currentScene = null; }
      renderLevels(mi);
    });
  }
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

// ================= Creative mode =================
function renderCreative() {
  app.innerHTML = '';
  const SIZE = 8;
  const screen = el('div', 'screen');
  const top = el('div', 'topbar');
  top.innerHTML = `
    <button class="btn ghost" id="back">← Меню</button>
    <div class="title">🎨 Творческий режим</div>
    <button class="btn primary" id="play">▶ Программировать</button>`;
  const scroll = el('div', 'scroll');
  const wrap = el('div', 'creative');
  wrap.innerHTML = `
    <div class="cwrap"><div class="cgrid" id="cgrid"></div></div>
    <div class="tools" id="tools">
      <div style="font-size:12px;color:var(--dim);text-transform:uppercase;letter-spacing:1.4px;font-weight:800;margin-bottom:4px">Инструменты</div>
      <button class="tool active" data-tool="hero"><span class="ico">🦸</span> Герой (старт)</button>
      <button class="tool" data-tool="wall"><span class="ico">🧱</span> Стена</button>
      <button class="tool" data-tool="star"><span class="ico">⭐</span> Звезда</button>
      <button class="tool" data-tool="goal"><span class="ico">🏁</span> Финиш</button>
      <button class="tool" data-tool="erase"><span class="ico">🧽</span> Стереть</button>
      <button class="tool" data-tool="clear"><span class="ico">🗑️</span> Очистить всё</button>
      <div style="font-size:12px;color:var(--dim);margin-top:8px;line-height:1.4">
        Кликай по клеткам, чтобы рисовать. Затем нажми «Программировать» и напиши код!
      </div>
    </div>`;
  scroll.appendChild(wrap);
  screen.appendChild(top);
  screen.appendChild(scroll);
  app.appendChild(screen);

  const grid = document.getElementById('cgrid');
  const cwrap = wrap.querySelector('.cwrap');
  function fitCreativeGrid() {
    if (!cwrap) return;
    const w = cwrap.clientWidth;
    const h = cwrap.clientHeight;
    if (w <= 0 || h <= 0) return;
    const s = Math.min(w, h);
    grid.style.width = s + 'px';
    grid.style.height = s + 'px';
    // размер шрифта эмодзи подгоняем под реальный размер клетки
    const cell = s / SIZE;
    grid.querySelectorAll('.ccell').forEach(c => {
      c.style.fontSize = (cell * 0.62) + 'px';
    });
  }
  window.addEventListener('resize', fitCreativeGrid);
  requestAnimationFrame(fitCreativeGrid);
  const lvl = {
    size: SIZE,
    hero: { x: 1, y: 6, d: 'up' },
    walls: [], stars: [], goals: [],
    task: 'Твой собственный уровень! Дойди до флага.',
    hint: 'Используй команды движения и циклы.',
    sol: ''
  };

  function cellHas(arr, x, y) { return arr.some(p => p[0] === x && p[1] === y); }
  function rm(arr, x, y) { return arr.filter(p => !(p[0] === x && p[1] === y)); }

  function renderGrid() {
    grid.innerHTML = '';
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const c = el('div', 'ccell');
        if (cellHas(lvl.walls, x, y)) c.classList.add('wall');
        else if (lvl.hero.x === x && lvl.hero.y === y) c.textContent = '🦸';
        else if (cellHas(lvl.stars, x, y)) c.textContent = '⭐';
        else if (cellHas(lvl.goals, x, y)) c.textContent = '🏁';
        c.addEventListener('click', () => handleClick(x, y));
        grid.appendChild(c);
      }
    }
    fitCreativeGrid();
  }

  let tool = 'hero';
  function handleClick(x, y) {
    const isHero = lvl.hero.x === x && lvl.hero.y === y;
    if (tool === 'erase') {
      lvl.walls = rm(lvl.walls, x, y);
      lvl.stars = rm(lvl.stars, x, y);
      lvl.goals = rm(lvl.goals, x, y);
    } else if (tool === 'hero') {
      lvl.hero = { x, y, d: lvl.hero.d || 'up' };
      lvl.walls = rm(lvl.walls, x, y);
      lvl.stars = rm(lvl.stars, x, y);
      lvl.goals = rm(lvl.goals, x, y);
    } else if (tool === 'wall') {
      if (!isHero && !cellHas(lvl.goals, x, y) && !cellHas(lvl.stars, x, y)) {
        if (cellHas(lvl.walls, x, y)) lvl.walls = rm(lvl.walls, x, y);
        else lvl.walls.push([x, y]);
      }
    } else if (tool === 'star') {
      if (cellHas(lvl.stars, x, y)) lvl.stars = rm(lvl.stars, x, y);
      else if (!isHero && !cellHas(lvl.walls, x, y) && !cellHas(lvl.goals, x, y)) lvl.stars.push([x, y]);
    } else if (tool === 'goal') {
      if (cellHas(lvl.goals, x, y)) lvl.goals = rm(lvl.goals, x, y);
      else if (!isHero && !cellHas(lvl.walls, x, y) && !cellHas(lvl.stars, x, y)) lvl.goals.push([x, y]);
    }
    renderGrid();
  }

  document.querySelectorAll('#tools .tool').forEach(b => {
    b.addEventListener('click', () => {
      if (b.dataset.tool === 'clear') {
        lvl.walls = []; lvl.stars = []; lvl.goals = [];
        lvl.hero = { x: 1, y: 6, d: 'up' };
        renderGrid();
        return;
      }
      document.querySelectorAll('#tools .tool').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      tool = b.dataset.tool;
    });
  });

  renderGrid();

  document.getElementById('play').addEventListener('click', () => {
    if (lvl.goals.length === 0) { toast('Поставь хотя бы один финиш 🏁'); return; }
    if (currentScene) { currentScene.destroy(); currentScene = null; }
    renderGame(-1, -1, JSON.parse(JSON.stringify(lvl)));
  });

  document.getElementById('back').addEventListener('click', renderHome);
}

// ================= Start =================
renderHome();

})();