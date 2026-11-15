/* interpreter.js — мини-интерпретатор Python-подобного языка для тренажёра */
(function (global) {
  'use strict';

  class PyError extends Error {}
  class AbortError extends Error {}
  class BreakSignal {}
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
            s += (n === 'n') ? '\n' : n;
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
      if ('+-*/%<>()=,[]'.includes(c)) { out.push({ t: 'op', v: c }); i++; continue; }
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
      return this.parsePrimary();
    }
    parsePrimary() {
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

      /* if / elif / else */
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

      /* while */
      if (/^while\s+.+:$/.test(t)) {
        const cond = parseExprString(t.slice(6, -1).trim());
        const bi = needBlock(i + 1, t);
        const r = parseBlock(lines, i + 1, bi);
        stmts.push({ type: 'while', cond, body: r.stmts });
        i = r.i;
        continue;
      }

      /* for */
      if (/^for\s+.+:$/.test(t)) {
        const inner = t.slice(4, -1).trim();
        const m = inner.match(new RegExp('^(' + ID_RE + ')\\s+in\\s+(.+)$'));
        if (!m) throw new PyError('Пиши так: for i in range(3):');
        const iter = parseExprString(m[2]);
        const bi = needBlock(i + 1, t);
        const r = parseBlock(lines, i + 1, bi);
        stmts.push({ type: 'for', name: m[1], iter, body: r.stmts });
        i = r.i;
        continue;
      }

      /* def */
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

      /* break */
      if (t === 'break') { stmts.push({ type: 'break' }); i++; continue; }

      /* return */
      if (/^return(\s+.+)?$/.test(t)) {
        const expr = t.length > 6 ? parseExprString(t.slice(7).trim()) : null;
        stmts.push({ type: 'return', expr });
        i++;
        continue;
      }

      /* присваивание */
      const am = t.match(new RegExp('^(' + ID_RE + ')\\s*=(?!=)(.*)$'));
      if (am) {
        stmts.push({ type: 'assign', name: am[1], expr: parseExprString(am[2].trim()) });
        i++;
        continue;
      }

      /* выражение */
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
        if (typeof a === 'string' || typeof b === 'string') return toStr(a) + toStr(b);
        return toNum(a) + toNum(b);
      case '-': return toNum(a) - toNum(b);
      case '*':
        if (typeof a === 'string' && typeof b === 'number') return a.repeat(Math.max(0, b));
        if (typeof b === 'string' && typeof a === 'number') return b.repeat(Math.max(0, a));
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
      case 'in': return toStr(b).includes(toStr(a));
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
    if (name === 'len') return toStr(args[0]).length;
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
          catch (e) { if (e instanceof BreakSignal) return; throw e; }
        }
        return;
      }
      case 'for': {
        const iter = await evalExpr(st.iter, ctx);
        if (!Array.isArray(iter)) throw new PyError('for работает только с range(...)');
        for (const item of iter) {
          if (rt.aborted) throw new AbortError();
          if (++rt.steps > 20000) throw new PyError('Слишком много шагов! Похоже, в программе бесконечный цикл 🌀');
          ctx.scope.set(st.name, item);
          try { await execBlock(st.body, ctx); }
          catch (e) { if (e instanceof BreakSignal) return; throw e; }
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
    }
  }

  async function run(src, rt) {
    const ast = parseProgram(src);
    if (!ast.length) throw new PyError('Код пустой. Напиши что-нибудь! 🙂');
    rt.steps = 0;
    const ctx = { scope: new Scope(null), rt };
    try {
      await execBlock(ast, ctx);
    } catch (e) {
      if (e instanceof ReturnSignal || e instanceof BreakSignal) return;
      throw e;
    }
  }

  global.PyBot = { run, parseProgram, PyError, AbortError };
})(window);