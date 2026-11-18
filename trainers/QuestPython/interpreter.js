/* ============================================================
   interpreter.js — мини-интерпретатор Python-подобного кода
   ============================================================ */
(function () {
'use strict';

// -------- Трансформация Python-выражений в JS (бережно к строкам) --------
function transformExpr(expr) {
  let out = '';
  let inStr = null, esc = false;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (inStr) {
      out += c;
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'") { inStr = c; out += c; continue; }
    const rest = expr.slice(i);
    const prev = i > 0 ? expr[i - 1] : ' ';
    const prevIsWord = /[A-Za-z0-9_]/.test(prev);
    if (!prevIsWord) {
      if (/^True\b/.test(rest))  { out += 'true';  i += 3; continue; }
      if (/^False\b/.test(rest)) { out += 'false'; i += 4; continue; }
      if (/^None\b/.test(rest))  { out += 'null';  i += 3; continue; }
      if (/^and\b/.test(rest))   { out += '&&';    i += 2; continue; }
      if (/^or\b/.test(rest))    { out += '||';    i += 1; continue; }
      if (/^not\b/.test(rest))   { out += '!';     i += 2; continue; }
    }
    if (/^==/.test(rest)) { out += '==='; i += 1; continue; }
    if (/^!=/.test(rest)) { out += '!=='; i += 1; continue; }
    out += c;
  }
  return out;
}

function stripComment(line) {
  let inStr = null, esc = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === inStr) inStr = null;
    } else {
      if (c === '"' || c === "'") inStr = c;
      else if (c === '#') return line.slice(0, i);
    }
  }
  return line;
}

function parseProgram(code) {
  const rawLines = code.replace(/\t/g, '    ').split('\n');
  const lines = [];
  for (const raw of rawLines) {
    const s = stripComment(raw);
    if (s.trim() === '') continue;
    const indent = s.match(/^ */)[0].length;
    lines.push({ indent, text: s.trim() });
  }

  let pos = 0;

  function parseStatement(line) {
    const t = line.text;
    let m;
    if ((m = t.match(/^for\s+([A-Za-z_]\w*)\s+in\s+(.+):$/)))
      return { type: 'for', varName: m[1], iter: m[2], needsBody: true };
    if ((m = t.match(/^while\s+(.+):$/)))
      return { type: 'while', cond: m[1], needsBody: true };
    if ((m = t.match(/^if\s+(.+):$/)))
      return { type: 'if', cond: m[1], needsBody: true };
    if ((m = t.match(/^def\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*:$/)))
      return { type: 'def', name: m[1], params: m[2].split(',').map(s => s.trim()).filter(Boolean), needsBody: true };
    if ((m = t.match(/^([A-Za-z_]\w*)\s*=(?!=)\s*(.+)$/)))
      return { type: 'assign', name: m[1], expr: m[2] };
    return { type: 'expr', expr: t };
  }

  function parseBlock(parentIndent) {
    const block = [];
    if (pos >= lines.length) return block;
    const blockIndent = lines[pos].indent;
    if (blockIndent <= parentIndent) return block;

    while (pos < lines.length && lines[pos].indent === blockIndent) {
      const line = lines[pos];
      if (/^(else|elif)\b/.test(line.text))
        throw new Error('Строка «' + line.text + '»: else должен идти сразу после if с тем же отступом');
      pos++;
      const stmt = parseStatement(line);
      if (stmt.needsBody) stmt.body = parseBlock(blockIndent);
      if (stmt.type === 'if' && pos < lines.length &&
          lines[pos].indent === blockIndent && /^else\s*:/.test(lines[pos].text)) {
        pos++;
        stmt.elseBody = parseBlock(blockIndent);
      }
      block.push(stmt);
    }
    return block;
  }

  return parseBlock(-1);
}

function evalExpr(expr, env) {
  const js = transformExpr(expr);
  const keys = Object.keys(env).filter(k => /^[A-Za-z_]\w*$/.test(k));
  const values = keys.map(k => env[k]);
  let fn;
  try {
    fn = new Function(...keys, 'return (' + js + ');');
  } catch (e) {
    throw new Error('Не могу понять выражение: «' + expr + '»');
  }
  try {
    return fn.apply(null, values);
  } catch (e) {
    throw new Error((e && e.message) || 'Ошибка в выражении');
  }
}

function execBlock(block, env) {
  for (const stmt of block) execStmt(stmt, env);
}

function execStmt(stmt, env) {
  switch (stmt.type) {
    case 'expr':
      evalExpr(stmt.expr, env);
      break;
    case 'assign':
      env[stmt.name] = evalExpr(stmt.expr, env);
      break;
    case 'for': {
      const it = evalExpr(stmt.iter, env);
      if (!it || typeof it[Symbol.iterator] !== 'function')
        throw new Error('После «in» нужен список или range(...)');
      for (const v of it) {
        env[stmt.varName] = v;
        execBlock(stmt.body, env);
      }
      break;
    }
    case 'while': {
      let guard = 0;
      while (evalExpr(stmt.cond, env)) {
        execBlock(stmt.body, env);
        if (++guard > 500)
          throw new Error('Похоже, бесконечный цикл: условие никогда не станет ложным');
      }
      break;
    }
    case 'if':
      if (evalExpr(stmt.cond, env)) execBlock(stmt.body, env);
      else if (stmt.elseBody) execBlock(stmt.elseBody, env);
      break;
    case 'def': {
      const def = stmt;
      env[stmt.name] = function () {
        const args = arguments;
        def.params.forEach(function (p, i) { env[p] = args[i]; });
        execBlock(def.body, env);
        return null;
      };
      break;
    }
  }
}

function simulateLevel(level, code) {
  const size = level.size || 8;
  const hero = { x: level.hero.x, y: level.hero.y, d: level.hero.d || 'up' };
  const walls = new Set((level.walls || []).map(p => p[0] + ',' + p[1]));
  const stars = new Set((level.stars || []).map(p => p[0] + ',' + p[1]));
  const goals = new Set((level.goals || []).map(p => p[0] + ',' + p[1]));
  let collected = 0;
  const prints = [];
  const says = [];
  const events = [];

  const key = (x, y) => x + ',' + y;
  const inB = (x, y) => x >= 0 && x < size && y >= 0 && y < size;

  function nextCell() {
    if (hero.d === 'up') return [hero.x, hero.y - 1];
    if (hero.d === 'down') return [hero.x, hero.y + 1];
    if (hero.d === 'left') return [hero.x - 1, hero.y];
    return [hero.x + 1, hero.y];
  }
  function canMove() {
    const nc = nextCell();
    return inB(nc[0], nc[1]) && !walls.has(key(nc[0], nc[1]));
  }
  function doStep() {
    if (!canMove()) throw new Error('Впереди стена или край поля — герой не может пройти');
    const nc = nextCell();
    hero.x = nc[0]; hero.y = nc[1];
    events.push({ type: 'move', x: hero.x, y: hero.y, d: hero.d });
    if (stars.has(key(hero.x, hero.y))) {
      stars.delete(key(hero.x, hero.y));
      collected++;
      events.push({ type: 'star', x: hero.x, y: hero.y });
    }
  }
  function doTurn(which) {
    const order = ['up', 'right', 'down', 'left'];
    const i = order.indexOf(hero.d);
    hero.d = order[(i + (which === 'left' ? 3 : 1)) % 4];
    events.push({ type: 'turn', x: hero.x, y: hero.y, d: hero.d });
  }

  const env = {
    print: function () {
      const a = Array.prototype.slice.call(arguments);
      const text = a.map(function (v) {
        if (v === null) return 'None';
        if (v === true) return 'True';
        if (v === false) return 'False';
        return String(v);
      }).join(' ');
      prints.push(text);
      events.push({ type: 'print', text: text });
    },
    say: function (t) {
      const s = String(t);
      says.push(s);
      events.push({ type: 'say', text: s, x: hero.x, y: hero.y });
    },
    move_forward: function () { doStep(); },
    move: function (n) {
      if (typeof n !== 'number' || n < 0) throw new Error('move(n) ждёт положительное число');
      for (let i = 0; i < n; i++) doStep();
    },
    move_dir: function (dir) {
      const order = ['up', 'right', 'down', 'left'];
      if (order.indexOf(dir) < 0) throw new Error('Неизвестное направление: ' + dir);
      hero.d = dir;
      events.push({ type: 'turn', x: hero.x, y: hero.y, d: hero.d });
      doStep();
    },
    turn_left: function () { doTurn('left'); },
    turn_right: function () { doTurn('right'); },
    can_move: function () { return canMove(); },
    at_goal: function () { return goals.has(key(hero.x, hero.y)); },
    stars_collected: function () { return collected; },
    range: function () {
      const args = Array.prototype.slice.call(arguments);
      let start = 0, stop, step = 1;
      if (args.length === 1) stop = args[0];
      else if (args.length === 2) { start = args[0]; stop = args[1]; }
      else { start = args[0]; stop = args[1]; step = args[2]; }
      const out = [];
      if (step > 0) for (let i = start; i < stop; i += step) out.push(i);
      else for (let i = start; i > stop; i += step) out.push(i);
      return out;
    },
    len: function (a) { return a.length; }
  };

  let ast;
  try {
    ast = parseProgram(code);
  } catch (e) {
    return { ok: false, error: e.message, events, prints, says, collected, hero, size };
  }
  try {
    execBlock(ast, env);
  } catch (e) {
    return { ok: false, error: e.message, events, prints, says, collected, hero, size };
  }
  return { ok: true, events, prints, says, collected, hero, size };
}

function checkWin(level, result) {
  if (!result.ok) return { win: false, reason: result.error };
  const win = level.win || {};

  if (win.prints) {
    if (JSON.stringify(result.prints) !== JSON.stringify(win.prints))
      return { win: false, reason: 'Проверь, что именно печатает программа: ' + win.prints.map(t => '«' + t + '»').join(', ') };
  }
  if (win.says) {
    if (JSON.stringify(result.says) !== JSON.stringify(win.says))
      return { win: false, reason: 'Что должен сказать герой: ' + win.says.map(t => '«' + t + '»').join(', ') };
  }
  if (win.stars !== undefined && result.collected !== win.stars)
    return { win: false, reason: 'Нужно собрать ' + win.stars + ' звёзд, а собрано ' + result.collected };

  if (level.goals && level.goals.length > 0) {
    const onGoal = level.goals.some(function (p) { return p[0] === result.hero.x && p[1] === result.hero.y; });
    if (!onGoal) return { win: false, reason: 'Герой не дошёл до флага' };
  }
  if (level.stars && level.stars.length > 0) {
    const need = win.stars !== undefined ? win.stars : level.stars.length;
    if (result.collected < need)
      return { win: false, reason: 'Собрано ' + result.collected + ' из ' + need + ' звёзд' };
  }
  return { win: true };
}

// Явно вешаем на window — на случай нестандартной загрузки скриптов
window.simulateLevel = simulateLevel;
window.checkWin = checkWin;
window.parseProgram = parseProgram;
console.log('✅ interpreter.js загружен, simulateLevel:', typeof window.simulateLevel);

})();