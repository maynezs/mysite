/* interpreter.js — мини-интерпретатор Python-подобного языка для тренажёра */
(function (global) {
'use strict';
class PyError extends Error {}
class AbortError extends Error {}
class BreakSignal {}
class ContinueSignal {}
class ReturnSignal { constructor(v) { this.value = v; } }

/* ---------- утилиты ---------- */
function truthy(v) {
  if (v === null || v === undefined || v === false) return false;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'string') return v.length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}
function toStr(v) {
  if (v === null || v === undefined) return '';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (Array.isArray(v)) return '[' + v.map(x => typeof x === 'string' ? '"' + x + '"' : toStr(x)).join(', ') + ']';
  return String(v);
}
function toNum(v) {
  if (typeof v === 'number') return v;
  const s = String(v).trim().replace(',', '.');
  const n = Number(s);
  if (isNaN(n)) throw new PyError('Не получается превратить «' + v + '» в число');
  return n;
}

/* ---------- лексер ---------- */
const ID_START = /[A-Za-zА-Яа-яЁё_]/;
const ID_BODY = /[A-Za-zА-Яа-яЁё0-9_]/;
function tokenize(src) {
  const out = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === ' ' || c === '\t') { i++; continue; }
    if (c === '"' || c === "'") {
      const q = c; i++;
      let s = '';
      while (i < src.length && src[i] !== q) {
        if (src[i] === '\\' && i + 1 < src.length) {
          const n = src[i + 1];
          s += (n === 'n') ? '\n' : (n === 't') ? '\t' : n;
          i += 2;
        } else { s += src[i]; i++; }
      }
      if (i >= src.length) throw new PyError('Не закрыта кавычка ' + q);
      i++;
      out.push({ t: 'str', v: s });
      continue;
    }
    if (c >= '0' && c <= '9') {
      let j = i;
      while (j < src.length && /[0-9.]/.test(src[j])) j++;
      out.push({ t: 'num', v: Number(src.slice(i, j)) });
      i = j; continue;
    }
    if (ID_START.test(c)) {
      let j = i;
      while (j < src.length && ID_BODY.test(src[j])) j++;
      out.push({ t: 'name', v: src.slice(i, j) });
      i = j; continue;
    }
    const two = src.slice(i, i + 2);
    if (two === '==' || two === '!=' || two === '<=' || two === '>=') {
      out.push({ t: 'op', v: two }); i += 2; continue;
    }
    if ('+-*/%<>()=,[]{}.'.includes(c)) { out.push({ t: 'op', v: c }); i++; continue; }
    throw new PyError('Непонятный символ: «' + c + '»');
  }
  return out;
}

/* ---------- парсер выражений ---------- */
class ExprParser {
  constructor(toks) { this.toks = toks; this.pos = 0; }
  peek() { return this.toks[this.pos]; }
  next() { return this.toks[this.pos++]; }
  atOp(v) { const t = this.peek(); return t && t.t === 'op' && t.v === v; }
  atName(v) { const t = this.peek(); return t && t.t === 'name' && t.v === v; }
  expectOp(v) { if (!this.atOp(v)) throw new PyError('Ожидался символ «' + v + '»'); this.pos++; }
  parseFull() {
    if (!this.toks.length) throw new PyError('Пустое выражение');
    const e = this.parseOr();
    if (this.pos < this.toks.length) throw new PyError('Лишний текст в выражении');
    return e;
  }
  parseOr() {
    let l = this.parseAnd();
    while (this.atName('or')) { this.pos++; l = { type: 'or', left: l, right: this.parseAnd() }; }
    return l;
  }
  parseAnd() {
    let l = this.parseNot();
    while (this.atName('and')) { this.pos++; l = { type: 'and', left: l, right: this.parseNot() }; }
    return l;
  }
  parseNot() {
    if (this.atName('not')) { this.pos++; return { type: 'not', expr: this.parseNot() }; }
    return this.parseCmp();
  }
  parseCmp() {
    let l = this.parseAdd();
    for (;;) {
      const t = this.peek();
      if (t && t.t === 'op' && ['==', '!=', '<', '>', '<=', '>='].includes(t.v)) {
        this.pos++;
        l = { type: 'bin', op: t.v, left: l, right: this.parseAdd() };
      } else if (t && t.t === 'name' && t.v === 'in') {
        this.pos++;
        l = { type: 'bin', op: 'in', left: l, right: this.parseAdd() };
      } else if (t && t.t === 'name' && t.v === 'not' && this.toks[this.pos + 1] && this.toks[this.pos + 1].v === 'in') {
        this.pos += 2;
        l = { type: 'bin', op: 'not in', left: l, right: this.parseAdd() };
      } else break;
    }
    return l;
  }
  parseAdd() {
    let l = this.parseMul();
    for (;;) {
      const t = this.peek();
      if (t && t.t === 'op' && (t.v === '+' || t.v === '-')) {
        this.pos++;
        l = { type: 'bin', op: t.v, left: l, right: this.parseMul() };
      } else break;
    }
    return l;
  }
  parseMul() {
    let l = this.parseUnary();
    for (;;) {
      const t = this.peek();
      if (t && t.t === 'op' && (t.v === '*' || t.v === '/' || t.v === '%')) {
        this.pos++;
        l = { type: 'bin', op: t.v, left: l, right: this.parseUnary() };
      } else break;
    }
    return l;
  }
  parseUnary() {
    if (this.atOp('-')) { this.pos++; return { type: 'neg', expr: this.parseUnary() }; }
    return this.parsePostfix();
  }
  parsePostfix() {
    let node = this.parsePrimaryBase();
    for (;;) {
      if (this.atOp('.')) {
        this.pos++;
        const method = this.next();
        if (!method || method.t !== 'name') throw new PyError('Ожидалось имя метода после «.»');
        this.expectOp('(');
        const args = [];
        if (!this.atOp(')')) {
          for (;;) {
            args.push(this.parseOr());
            if (this.atOp(',')) { this.pos++; continue; }
            break;
          }
        }
        this.expectOp(')');
        node = { type: 'method', obj: node, name: method.v, args };
      } else if (this.atOp('[')) {
        this.pos++;
        const idx = this.parseOr();
        this.expectOp(']');
        node = { type: 'index', obj: node, index: idx };
      } else break;
    }
    return node;
  }
  parsePrimaryBase() {
    const t = this.next();
    if (!t) throw new PyError('Выражение оборвалось');
    if (t.t === 'num') return { type: 'num', v: t.v };
    if (t.t === 'str') return { type: 'str', v: t.v };
    if (t.t === 'name') {
      if (t.v === 'True') return { type: 'bool', v: true };
      if (t.v === 'False') return { type: 'bool', v: false };
      if (t.v === 'None') return { type: 'null' };
      if (this.atOp('(')) {
        this.pos++;
        const args = [];
        if (!this.atOp(')')) {
          for (;;) {
            args.push(this.parseOr());
            if (this.atOp(',')) { this.pos++; continue; }
            break;
          }
        }
        this.expectOp(')');
        return { type: 'call', name: t.v, args };
      }
      return { type: 'var', name: t.v };
    }
    if (t.t === 'op' && t.v === '(') {
      const e = this.parseOr();
      this.expectOp(')');
      return e;
    }
    if (t.t === 'op' && t.v === '[') {
      const items = [];
      if (!this.atOp(']')) {
        for (;;) {
          items.push(this.parseOr());
          if (this.atOp(',')) { this.pos++; continue; }
          break;
        }
      }
      this.expectOp(']');
      return { type: 'list', items };
    }
    throw new PyError('Неожиданный символ «' + (t.v !== undefined ? t.v : t.t) + '»');
  }
}
function parseExprString(s) {
  return new ExprParser(tokenize(s)).parseFull();
}

/* ---------- парсер блоков ---------- */
function stripComment(line) {
  let inStr = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inStr) {
      if (c === '\\') i++;
      else if (c === inStr) inStr = null;
    } else if (c === '"' || c === "'") inStr = c;
    else if (c === '#') return line.slice(0, i);
  }
  return line;
}
function preprocess(src) {
  const raw = String(src).replace(/\r\n/g, '\n').replace(/\t/g, '    ').split('\n');
  const lines = [];
  for (const r of raw) {
    const s = stripComment(r);
    if (!s.trim()) continue;
    const indent = s.match(/^ */)[0].length;
    lines.push({ indent, text: s.trim() });
  }
  return lines;
}
const ID_RE = '[A-Za-zА-Яа-яЁё_][A-Za-zА-Яа-яЁё0-9_]*';
function parseBlock(lines, start, indent) {
  const stmts = [];
  let i = start;
  const needBlock = (from, what) => {
    if (!(from < lines.length && lines[from].indent > indent)) {
      throw new PyError('После «' + what + '» нужен блок с отступом (4 пробела)');
    }
    return lines[from].indent;
  };
  while (i < lines.length) {
    const line = lines[i];
    if (line.indent < indent) break;
    if (line.indent > indent) throw new PyError('Лишний отступ в строке: «' + line.text + '»');
    const t = line.text;
    if (/^if\s+.+:$/.test(t)) {
      const branches = [];
      let cond = parseExprString(t.slice(3, -1).trim());
      let bi = needBlock(i + 1, t);
      let r = parseBlock(lines, i + 1, bi);
      branches.push({ cond, body: r.stmts });
      i = r.i;
      let elseBody = null;
      while (i < lines.length && lines[i].indent === indent) {
        const t2 = lines[i].text;
        if (/^elif\s+.+:$/.test(t2)) {
          const c2 = parseExprString(t2.slice(5, -1).trim());
          const b2 = needBlock(i + 1, t2);
          const r2 = parseBlock(lines, i + 1, b2);
          branches.push({ cond: c2, body: r2.stmts });
          i = r2.i;
        } else if (t2 === 'else:') {
          const b2 = needBlock(i + 1, t2);
          const r2 = parseBlock(lines, i + 1, b2);
          elseBody = r2.stmts;
          i = r2.i;
          break;
        } else break;
      }
      stmts.push({ type: 'if', branches, elseBody });
      continue;
    }
    if (/^while\s+.+:$/.test(t)) {
      const cond = parseExprString(t.slice(6, -1).trim());
      const bi = needBlock(i + 1, t);
      const r = parseBlock(lines, i + 1, bi);
      stmts.push({ type: 'while', cond, body: r.stmts });
      i = r.i;
      continue;
    }
    if (/^for\s+.+:$/.test(t)) {
      const inner = t.slice(4, -1).trim();
      const m = inner.match(new RegExp('^(' + ID_RE + ')\\s+in\\s+(.+)$'));
      if (!m) throw new PyError('Пиши так: for i in range(3) или for x in список:');
      const iter = parseExprString(m[2]);
      const bi = needBlock(i + 1, t);
      const r = parseBlock(lines, i + 1, bi);
      stmts.push({ type: 'for', name: m[1], iter, body: r.stmts });
      i = r.i;
      continue;
    }
    if (/^def\s+.+:$/.test(t)) {
      const inner = t.slice(4, -1).trim();
      const m = inner.match(new RegExp('^(' + ID_RE + ')\\s*\\((.*)\\)$'));
      if (!m) throw new PyError('Пиши так: def имя(параметры):');
      const params = m[2].split(',').map(s => s.trim()).filter(Boolean);
      const bi = needBlock(i + 1, t);
      const r = parseBlock(lines, i + 1, bi);
      stmts.push({ type: 'def', name: m[1], params, body: r.stmts });
      i = r.i;
      continue;
    }
    if (t === 'break') { stmts.push({ type: 'break' }); i++; continue; }
    if (t === 'continue') { stmts.push({ type: 'continue' }); i++; continue; }
    if (/^return(\s+.+)?$/.test(t)) {
      const expr = t.length > 6 ? parseExprString(t.slice(7).trim()) : null;
      stmts.push({ type: 'return', expr });
      i++;
      continue;
    }
    const am = t.match(new RegExp('^(' + ID_RE + ')\\s*=(?!=)(.*)$'));
    if (am) {
      stmts.push({ type: 'assign', name: am[1], expr: parseExprString(am[2].trim()) });
      i++;
      continue;
    }
    stmts.push({ type: 'expr', expr: parseExprString(t) });
    i++;
  }
  return { stmts, i };
}
function parseProgram(src) {
  const lines = preprocess(src);
  if (!lines.length) return [];
  const r = parseBlock(lines, 0, lines[0].indent);
  if (r.i < lines.length) throw new PyError('Проверь отступы возле строки: «' + lines[r.i].text + '»');
  return r.stmts;
}

/* ---------- окружение ---------- */
class Scope {
  constructor(parent) { this.vars = new Map(); this.parent = parent || null; }
  has(n) { let s = this; while (s) { if (s.vars.has(n)) return true; s = s.parent; } return false; }
  get(n) {
    let s = this;
    while (s) { if (s.vars.has(n)) return s.vars.get(n); s = s.parent; }
    throw new PyError('Переменная «' + n + '» не найдена. Сначала создай её, например: ' + n + ' = input()');
  }
  set(n, v) {
    let s = this;
    while (s) { if (s.vars.has(n)) { s.vars.set(n, v); return; } s = s.parent; }
    this.vars.set(n, v);
  }
  define(n, v) { this.vars.set(n, v); }
  snapshot() {
    const out = {};
    let s = this;
    while (s) {
      for (const [k, v] of s.vars.entries()) {
        if (!(k in out)) out[k] = v;
      }
      s = s.parent;
    }
    return out;
  }
}

/* ---------- вычисление выражений ---------- */
async function evalExpr(node, ctx) {
  switch (node.type) {
    case 'num': return node.v;
    case 'str': return node.v;
    case 'bool': return node.v;
    case 'null': return null;
    case 'var': return ctx.scope.get(node.name);
    case 'neg': return -toNum(await evalExpr(node.expr, ctx));
    case 'not': return !truthy(await evalExpr(node.expr, ctx));
    case 'and': {
      const a = await evalExpr(node.left, ctx);
      if (!truthy(a)) return false;
      return truthy(await evalExpr(node.right, ctx));
    }
    case 'or': {
      const a = await evalExpr(node.left, ctx);
      if (truthy(a)) return true;
      return truthy(await evalExpr(node.right, ctx));
    }
    case 'bin': {
      const a = await evalExpr(node.left, ctx);
      const b = await evalExpr(node.right, ctx);
      return applyBin(node.op, a, b);
    }
    case 'list': {
      const arr = [];
      for (const item of node.items) arr.push(await evalExpr(item, ctx));
      return arr;
    }
    case 'index': {
      const obj = await evalExpr(node.obj, ctx);
      const idx = await evalExpr(node.index, ctx);
      if (Array.isArray(obj)) {
        let n = toNum(idx);
        if (n < 0) n = obj.length + n;
        if (n < 0 || n >= obj.length) throw new PyError('Индекс ' + idx + ' вне списка (длина ' + obj.length + ')');
        return obj[n];
      }
      if (typeof obj === 'string') {
        let n = toNum(idx);
        if (n < 0) n = obj.length + n;
        if (n < 0 || n >= obj.length) throw new PyError('Индекс вне строки');
        return obj[n];
      }
      throw new PyError('У этого значения нет элементов по индексу');
    }
    case 'method': {
      const obj = await evalExpr(node.obj, ctx);
      const args = [];
      for (const a of node.args) args.push(await evalExpr(a, ctx));
      return callMethod(obj, node.name, args, ctx);
    }
    case 'call': {
      const args = [];
      for (const a of node.args) args.push(await evalExpr(a, ctx));
      return await callFunction(node.name, args, ctx);
    }
  }
  throw new PyError('Неизвестное выражение');
}
function eq(a, b) {
  const na = (typeof a === 'number') ? a : Number(String(a).trim());
  const nb = (typeof b === 'number') ? b : Number(String(b).trim());
  if (!isNaN(na) && !isNaN(nb) && String(a).trim() !== '' && String(b).trim() !== '') return na === nb;
  return toStr(a) === toStr(b);
}
function applyBin(op, a, b) {
  switch (op) {
    case '+':
      if (Array.isArray(a) && Array.isArray(b)) return a.concat(b);
      if (typeof a === 'string' || typeof b === 'string') return toStr(a) + toStr(b);
      return toNum(a) + toNum(b);
    case '-': return toNum(a) - toNum(b);
    case '*':
      if (typeof a === 'string' && typeof b === 'number') return a.repeat(Math.max(0, b));
      if (typeof b === 'string' && typeof a === 'number') return b.repeat(Math.max(0, a));
      if (Array.isArray(a) && typeof b === 'number') {
        const out = [];
        for (let i = 0; i < Math.max(0, b); i++) out = out.concat(a);
        return out;
      }
      return toNum(a) * toNum(b);
    case '/': {
      const d = toNum(b);
      if (d === 0) throw new PyError('Делить на ноль нельзя!');
      return toNum(a) / d;
    }
    case '%': return toNum(a) % toNum(b);
    case '==': return eq(a, b);
    case '!=': return !eq(a, b);
    case '<': return cmp(a, b) < 0;
    case '>': return cmp(a, b) > 0;
    case '<=': return cmp(a, b) <= 0;
    case '>=': return cmp(a, b) >= 0;
    case 'in':
      if (Array.isArray(b)) return b.some(x => eq(x, a));
      return toStr(b).includes(toStr(a));
    case 'not in':
      if (Array.isArray(b)) return !b.some(x => eq(x, a));
      return !toStr(b).includes(toStr(a));
  }
  throw new PyError('Неизвестная операция: ' + op);
}
function cmp(a, b) {
  const na = Number(a), nb = Number(b);
  const aNum = (typeof a === 'number') || (!isNaN(na) && String(a).trim() !== '');
  const bNum = (typeof b === 'number') || (!isNaN(nb) && String(b).trim() !== '');
  if (aNum && bNum) return na < nb ? -1 : na > nb ? 1 : 0;
  const sa = toStr(a), sb = toStr(b);
  return sa < sb ? -1 : sa > sb ? 1 : 0;
}

/* ---------- методы объектов ---------- */
function callMethod(obj, name, args, ctx) {
  // Модуль random
  if (obj && obj.__module === 'random') {
    if (name === 'randint') {
      if (args.length !== 2) throw new PyError('random.randint(от, до) — нужно 2 числа');
      const a = toNum(args[0]), b = toNum(args[1]);
      if (a > b) throw new PyError('В randint первое число должно быть меньше второго');
      return Math.floor(a + Math.random() * (b - a + 1));
    }
    if (name === 'choice') {
      if (!Array.isArray(args[0]) || args[0].length === 0) throw new PyError('random.choice() требует непустой список');
      return args[0][Math.floor(Math.random() * args[0].length)];
    }
    if (name === 'random') return Math.random();
    throw new PyError('У random нет метода ' + name);
  }
  // Списки
  if (Array.isArray(obj)) {
    if (name === 'append') { obj.push(args[0]); return null; }
    if (name === 'remove') {
      const idx = obj.findIndex(x => eq(x, args[0]));
      if (idx === -1) throw new PyError('Элемента «' + args[0] + '» нет в списке');
      obj.splice(idx, 1);
      return null;
    }
    if (name === 'pop') {
      if (obj.length === 0) throw new PyError('Список пуст — нечего удалять');
      const idx = args.length ? toNum(args[0]) : obj.length - 1;
      const n = idx < 0 ? obj.length + idx : idx;
      if (n < 0 || n >= obj.length) throw new PyError('Индекс вне списка');
      return obj.splice(n, 1)[0];
    }
    if (name === 'insert') {
      obj.splice(toNum(args[0]), 0, args[1]);
      return null;
    }
    if (name === 'index') {
      const idx = obj.findIndex(x => eq(x, args[0]));
      if (idx === -1) throw new PyError('Элемента «' + args[0] + '» нет в списке');
      return idx;
    }
    if (name === 'count') return obj.filter(x => eq(x, args[0])).length;
    if (name === 'sort') { obj.sort((x, y) => cmp(x, y)); return null; }
    if (name === 'reverse') { obj.reverse(); return null; }
    if (name === 'clear') { obj.length = 0; return null; }
    if (name === 'copy') return obj.slice();
    throw new PyError('У списка нет метода ' + name + '()');
  }
  // Строки
  if (typeof obj === 'string') {
    if (name === 'upper') return obj.toUpperCase();
    if (name === 'lower') return obj.toLowerCase();
    if (name === 'strip') return obj.trim();
    if (name === 'find') return obj.indexOf(args[0]);
    if (name === 'replace') return obj.split(args[0]).join(args[1]);
    if (name === 'split') {
      const sep = args.length ? String(args[0]) : ' ';
      if (!sep) throw new PyError('split() не может делить пустой строкой');
      return obj.split(sep);
    }
    if (name === 'startswith') return obj.startsWith(String(args[0]));
    if (name === 'endswith') return obj.endsWith(String(args[0]));
    if (name === 'count') {
      if (!args[0]) return 0;
      const sub = String(args[0]);
      let c = 0, i = 0;
      while ((i = obj.indexOf(sub, i)) !== -1) { c++; i += sub.length || 1; }
      return c;
    }
    if (name === 'join') {
      if (!Array.isArray(args[0])) throw new PyError('join() работает со списком: "разделитель".join(список)');
      return args[0].map(toStr).join(obj);
    }
    throw new PyError('У строки нет метода ' + name + '()');
  }
  throw new PyError('Не могу вызвать метод ' + name + '() — у этого значения нет методов');
}

/* ---------- встроенные функции ---------- */
async function callFunction(name, args, ctx) {
  if (name === 'input') return await ctx.rt.input();
  if (name === 'send') {
    await ctx.rt.send(toStr(args.length ? args[0] : ''));
    return null;
  }
  if (name === 'int') {
    const s = String(args[0]).trim();
    const n = parseInt(s, 10);
    if (isNaN(n)) throw new PyError('int() не может превратить «' + args[0] + '» в число');
    return n;
  }
  if (name === 'str') return toStr(args[0]);
  if (name === 'len') {
    const v = args[0];
    if (Array.isArray(v)) return v.length;
    return toStr(v).length;
  }
  if (name === 'range') {
    const a = toNum(args[0]);
    const b = args.length > 1 ? toNum(args[1]) : 0;
    const from = args.length > 1 ? a : 0;
    const to = args.length > 1 ? b : a;
    if (to - from > 100000) throw new PyError('range() слишком большой');
    const out = [];
    for (let i = from; i < to; i++) out.push(i);
    return out;
  }
  if (name === 'print') {
    // псевдоним send для привычки
    await ctx.rt.send(args.map(toStr).join(' '));
    return null;
  }
  if (name === 'abs') return Math.abs(toNum(args[0]));
  if (name === 'min') {
    if (args.length === 1 && Array.isArray(args[0])) return args[0].reduce((a, b) => cmp(a, b) < 0 ? a : b);
    return args.reduce((a, b) => cmp(a, b) < 0 ? a : b);
  }
  if (name === 'max') {
    if (args.length === 1 && Array.isArray(args[0])) return args[0].reduce((a, b) => cmp(a, b) > 0 ? a : b);
    return args.reduce((a, b) => cmp(a, b) > 0 ? a : b);
  }
  if (name === 'sum') {
    const arr = Array.isArray(args[0]) ? args[0] : args;
    return arr.reduce((a, b) => toNum(a) + toNum(b), 0);
  }
  if (name === 'type') {
    const v = args[0];
    if (Array.isArray(v)) return 'list';
    if (typeof v === 'number') return 'int';
    if (typeof v === 'string') return 'str';
    if (typeof v === 'boolean') return 'bool';
    if (v === null) return 'None';
    return 'unknown';
  }
  if (ctx.scope.has(name)) {
    const fn = ctx.scope.get(name);
    if (fn && fn.__fn) {
      const sc = new Scope(fn.closure);
      fn.params.forEach((p, idx) => sc.define(p, args[idx]));
      const childCtx = { scope: sc, rt: ctx.rt };
      try {
        await execBlock(fn.body, childCtx);
      } catch (e) {
        if (e instanceof ReturnSignal) return e.value;
        throw e;
      }
      return null;
    }
  }
  throw new PyError('Неизвестная команда: ' + name + '()');
}

/* ---------- выполнение ---------- */
async function execBlock(stmts, ctx) {
  for (const st of stmts) await execStmt(st, ctx);
}
async function execStmt(st, ctx) {
  const rt = ctx.rt;
  if (rt.aborted) throw new AbortError();
  rt.steps++;
  if (rt.steps > 20000) throw new PyError('Слишком много шагов! Похоже, в программе бесконечный цикл 🌀');
  switch (st.type) {
    case 'assign':
      ctx.scope.set(st.name, await evalExpr(st.expr, ctx));
      return;
    case 'expr':
      await evalExpr(st.expr, ctx);
      return;
    case 'if': {
      for (const br of st.branches) {
        if (truthy(await evalExpr(br.cond, ctx))) {
          await execBlock(br.body, ctx);
          return;
        }
      }
      if (st.elseBody) await execBlock(st.elseBody, ctx);
      return;
    }
    case 'while': {
      while (truthy(await evalExpr(st.cond, ctx))) {
        if (rt.aborted) throw new AbortError();
        if (++rt.steps > 20000) throw new PyError('Слишком много шагов! Похоже, в программе бесконечный цикл 🌀');
        try { await execBlock(st.body, ctx); }
        catch (e) {
          if (e instanceof BreakSignal) return;
          if (e instanceof ContinueSignal) continue;
          throw e;
        }
      }
      return;
    }
    case 'for': {
      const iter = await evalExpr(st.iter, ctx);
      if (!Array.isArray(iter)) throw new PyError('for работает со списками или range(...)');
      for (const item of iter) {
        if (rt.aborted) throw new AbortError();
        if (++rt.steps > 20000) throw new PyError('Слишком много шагов! Похоже, в программе бесконечный цикл 🌀');
        ctx.scope.set(st.name, item);
        try { await execBlock(st.body, ctx); }
        catch (e) {
          if (e instanceof BreakSignal) return;
          if (e instanceof ContinueSignal) continue;
          throw e;
        }
      }
      return;
    }
    case 'def':
      ctx.scope.define(st.name, { __fn: true, params: st.params, body: st.body, closure: ctx.scope });
      return;
    case 'return':
      throw new ReturnSignal(st.expr ? await evalExpr(st.expr, ctx) : null);
    case 'break':
      throw new BreakSignal();
    case 'continue':
      throw new ContinueSignal();
  }
}
async function run(src, rt) {
  const ast = parseProgram(src);
  if (!ast.length) throw new PyError('Код пустой. Напиши что-нибудь! 🙂');
  rt.steps = 0;
  const ctx = { scope: new Scope(null), rt };
  // Регистрируем модуль random
  ctx.scope.define('random', { __module: 'random' });
  try {
    await execBlock(ast, ctx);
  } catch (e) {
    if (e instanceof ReturnSignal || e instanceof BreakSignal || e instanceof ContinueSignal) return;
    throw e;
  }
  // Сохраняем снимок переменных для визуализации
  if (rt.onVars) rt.onVars(ctx.scope.snapshot());
}
global.PyBot = { run, parseProgram, PyError, AbortError };
})(window);
