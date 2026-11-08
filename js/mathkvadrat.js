(function(){
  'use strict';

  /* ======================= УТИЛИТЫ ======================= */
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Правдоподобные числовые дистракторы (возвращает перемешанный массив чисел)
  function numDist(n){
    const s = new Set();
    const add = v => {
      if (Number.isInteger(v) && v !== n && v > 0 && v <= 10000) s.add(v);
    };
    add(n + 1); add(n + 2); add(n + 3); add(n + 4);
    add(n - 1); add(n - 2); add(n - 3); add(n - 5);
    add(n * 2); add(n * 3); add(Math.round(n / 2)); add(n * 10);
    if (n <= 40) add(n * n);
    add(n + 10); add(n + 7); add(n - 7);
    return shuffle([...s]);
  }

  // Берём 3 уникальных строки-дистрактора, не совпадающих с верным ответом
  function pick3(cands, correct){
    const out = [];
    for (const c of cands){
      const s = String(c);
      if (s === correct || out.includes(s)) continue;
      out.push(s);
      if (out.length === 3) break;
    }
    return out;
  }

  /* ======================= ГЕНЕРАТОРЫ: КВАДРАТНЫЕ КОРНИ ======================= */
  const rootGens = [
    // √(n²)
    () => {
      const n = rand(2, 20);
      return { q: `√${n * n}`, a: String(n), gen: () => pick3(numDist(n).map(String), String(n)) };
    },
    // √((-n)²)
    () => {
      const n = rand(2, 12);
      return {
        q: `√((−${n})²)`, a: String(n),
        gen: () => pick3([-n, n * n, -n * n, n + 1, 2 * n].map(String), String(n))
      };
    },
    // Вынесение множителя: √(k²m) = k√m
    () => {
      const m = pick([2, 3, 5, 6, 7, 10]);
      const k = rand(2, 7);
      const a = `${k}√${m}`;
      const cands = [`${k * m}`, `${k + 1}√${m}`, `${k - 1}√${m}`, `${k}√${m + 1}`, `${k + 2}`, `${k * m}√${m}`];
      return { q: `Упрости: √${k * k * m}`, a, gen: () => pick3(cands, a) };
    },
    // √a · √b
    () => {
      const m = pick([2, 3, 5, 7]);
      const k1 = rand(1, 4), k2 = rand(1, 4);
      const a = String(k1 * k2 * m);
      return {
        q: `√${k1 * k1 * m} · √${k2 * k2 * m}`, a,
        gen: () => pick3(numDist(k1 * k2 * m).map(String), a)
      };
    },
    // Деление корней
    () => {
      const m = pick([2, 3, 5, 6, 7]);
      const k = rand(2, 9);
      const a = String(k);
      return { q: `√${k * k * m} : √${m}`, a, gen: () => pick3(numDist(k).map(String), a) };
    },
    // Корень из дроби
    () => {
      let p = rand(2, 9), qq = rand(2, 9);
      while (qq === p) qq = rand(2, 9);
      const a = `${p}/${qq}`;
      const cands = [`${qq}/${p}`, `${p * p}/${qq * qq}`, `${p}/${qq * 2}`, `${p * 2}/${qq}`, `${p}/${qq * qq}`];
      return { q: `Вычисли: √(${p * p}/${qq * qq})`, a, gen: () => pick3(cands, a) };
    },
    // Подобные слагаемые
    () => {
      const m = pick([2, 3, 5, 6, 7]);
      const a1 = rand(2, 9), a2 = rand(2, 9);
      const a = `${a1 + a2}√${m}`;
      const cands = [
        `${a1 + a2}`, `${a1 * a2}√${m}`, `${a1 + a2}√${m + 1}`,
        `${Math.abs(a1 - a2)}√${m}`, `${a1 + a2 + 1}√${m}`
      ];
      return { q: `Упрости: ${a1}√${m} + ${a2}√${m}`, a, gen: () => pick3(cands, a) };
    },
    // (√n)²
    () => {
      const n = rand(2, 30);
      const a = String(n);
      return {
        q: `(√${n})²`, a,
        gen: () => pick3([n * n, 2 * n, `√${n}`, n + 1, n - 1].map(String), a)
      };
    },
    // Внесение множителя под корень
    () => {
      const m = pick([2, 3, 5, 6, 7]);
      const k = rand(2, 8);
      const a = `√${k * k * m}`;
      const cands = [`√${k * m}`, `√${k + m}`, `√${k * k * k * m}`, `${k * k * m}`, `√${k * k + m}`];
      return { q: `Внеси множитель под корень: ${k}√${m}`, a, gen: () => pick3(cands, a) };
    }
  ];

  /* ======================= ГЕНЕРАТОРЫ: УРАВНЕНИЯ С КОРНЯМИ ======================= */
  const eqGens = [
    // √x = a
    () => {
      const a = rand(2, 15);
      const ans = a * a;
      return {
        q: `√x = ${a}`, a: String(ans),
        gen: () => pick3([a, 2 * a, ans + 1, ans - 1, ans + a].map(String), String(ans))
      };
    },
    // √(x + b) = a
    () => {
      const a = rand(3, 12);
      const b = rand(1, a * a - 1);
      const x = a * a - b;
      return {
        q: `√(x + ${b}) = ${a}`, a: String(x),
        gen: () => pick3([String(a * a + b), ...numDist(x).map(String)], String(x))
      };
    },
    // √(x − b) = a
    () => {
      const a = rand(2, 12);
      const b = rand(1, 30);
      const x = a * a + b;
      const wrong = (a * a - b > 0) ? a * a - b : a * a + b + 5;
      return {
        q: `√(x − ${b}) = ${a}`, a: String(x),
        gen: () => pick3([String(wrong), ...numDist(x).map(String)], String(x))
      };
    },
    // √(kx + b) = a
    () => {
      for (let t = 0; t < 100; t++){
        const k = rand(2, 5), x0 = rand(1, 15), b = rand(1, 12);
        const v = k * x0 + b;
        const a = Math.sqrt(v);
        if (Number.isInteger(a) && a >= 2){
          return {
            q: `√(${k}x + ${b}) = ${a}`, a: String(x0),
            gen: () => pick3(
              [String(v), String(x0 + 1), String(x0 - 1 > 0 ? x0 - 1 : x0 + 2),
               String(Math.floor(v / k)), ...numDist(x0).map(String)],
              String(x0)
            )
          };
        }
      }
      // резервный вариант
      const a = rand(3, 10), b = rand(1, 10);
      const x = a * a - b;
      return {
        q: `√(x + ${b}) = ${a}`, a: String(x),
        gen: () => pick3([String(a * a + b), ...numDist(x).map(String)], String(x))
      };
    },
    // √x + b = a
    () => {
      const a = rand(4, 12);
      const b = rand(1, a - 2);
      const x = (a - b) * (a - b);
      return {
        q: `√x + ${b} = ${a}`, a: String(x),
        gen: () => pick3([String((a + b) * (a + b)), String(a * a), ...numDist(x).map(String)], String(x))
      };
    },
    // a − √x = b
    () => {
      const b = rand(1, 10), d = rand(1, 10);
      const a = b + d;
      const x = d * d;
      return {
        q: `${a} − √x = ${b}`, a: String(x),
        gen: () => pick3([String(a * a), String(b * b), ...numDist(x).map(String)], String(x))
      };
    },
    // √(a − x) = b
    () => {
      const b = rand(2, 7);
      const a = b * b + rand(1, 25);
      const x = a - b * b;
      return {
        q: `√(${a} − x) = ${b}`, a: String(x),
        gen: () => pick3([String(a + b * b), String(b * b), String(a - b), ...numDist(x).map(String)], String(x))
      };
    }
  ];

  /* ======================= СБОРКА ЗАДАНИЙ ======================= */
  const makeRootTask = () => pick(rootGens)();
  const makeEqTask   = () => pick(eqGens)();

  function buildQuestions(kind){
    const list = [];
    const seen = new Set();
    let guard = 0;
    while (list.length < 10 && guard++ < 800){
      const t = (kind === 'roots') ? makeRootTask() : makeEqTask();
      if (seen.has(t.q)) continue;
      seen.add(t.q);
      list.push(t);
    }
    while (list.length < 10){
      list.push(kind === 'roots' ? makeRootTask() : makeEqTask());
    }
    return list;
  }

  function makeOptions(task){
    const a = task.a;
    let ds = (task.gen() || []).map(String).filter(d => d !== a);
    ds = [...new Set(ds)];

    if (ds.length < 3){
      const n = Number(a);
      if (!Number.isNaN(n)){
        for (const d of numDist(n).map(String)){
          if (d !== a && !ds.includes(d)) ds.push(d);
          if (ds.length >= 3) break;
        }
      }
    }
    let guard = 0;
    while (ds.length < 3 && guard++ < 300){
      const d = String(rand(2, 200));
      if (d !== a && !ds.includes(d)) ds.push(d);
    }
    ds = ds.slice(0, 3);
    return shuffle([a, ...ds]);
  }

  /* ======================= СОСТОЯНИЕ И UI ======================= */
  const el = id => document.getElementById(id);
  const state = { theme: 'roots', tasks: [], idx: 0, score: 0, answered: false, correct: '' };

  function show(id){
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    el(id).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startGame(theme){
    state.theme = theme;
    state.tasks = buildQuestions(theme);
    state.idx = 0;
    state.score = 0;
    state.answered = false;
    el('quiz-theme').textContent = theme === 'roots' ? 'Квадратные корни' : 'Уравнения с корнями';
    el('score').textContent = '0';
    show('screen-quiz');
    renderQuestion();
  }

  function renderQuestion(){
    const task = state.tasks[state.idx];
    state.answered = false;
    state.correct = task.a;

    el('q-num').textContent = state.idx + 1;
    el('progress-fill').style.width = (state.idx / 10 * 100) + '%';
    el('question-text').textContent = task.q;

    const fb = el('feedback');
    fb.textContent = '';
    fb.className = 'feedback';

    el('btn-next').disabled = true;
    el('btn-next').textContent = (state.idx === 9) ? 'Завершить ✓' : 'Дальше →';
    el('btn-refresh').disabled = false;

    renderOptions();
  }

  function renderOptions(){
    const task = state.tasks[state.idx];
    const opts = makeOptions(task);
    const box = el('options');
    box.innerHTML = '';
    opts.forEach(o => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'option';
      b.textContent = o;
      b.addEventListener('click', () => answer(b, o));
      box.appendChild(b);
    });
  }

  function answer(btn, val){
    if (state.answered) return;
    state.answered = true;
    const correct = state.correct;

    document.querySelectorAll('.option').forEach(b => {
      b.disabled = true;
      if (b.textContent === correct) b.classList.add('correct');
    });

    const fb = el('feedback');
    if (val === correct){
      state.score++;
      el('score').textContent = state.score;
      fb.textContent = '✅ Верно! +1 очко';
      fb.className = 'feedback ok';
    } else {
      btn.classList.add('wrong');
      fb.textContent = `❌ Неверно. Правильный ответ: ${correct}`;
      fb.className = 'feedback no';
    }

    el('btn-next').disabled = false;
    el('btn-refresh').disabled = true;
    el('progress-fill').style.width = ((state.idx + 1) / 10 * 100) + '%';
  }

  function nextQuestion(){
    if (state.idx >= 9){ endGame(); return; }
    state.idx++;
    renderQuestion();
  }

  function endGame(){
    const s = state.score;
    el('final-score').textContent = s;

    let emoji = '🏆', title = 'Отлично!', text = '';
    if (s === 10){
      emoji = '👑'; title = 'Идеально!';
      text = 'Ты настоящий повелитель квадратных корней. Так держать!';
    } else if (s >= 8){
      emoji = '🏆'; title = 'Отличный результат!';
      text = 'Материал усвоен очень хорошо. Немного практики — и будет идеально.';
    } else if (s >= 6){
      emoji = '🎯'; title = 'Хорошо!';
      text = 'База есть, но есть над чем поработать. Повтори теорию и попробуй снова.';
    } else if (s >= 4){
      emoji = '💪'; title = 'Неплохо!';
      text = 'Половина пути пройдена. Загляни в блок теории — там все нужные формулы.';
    } else {
      emoji = '📚'; title = 'Нужна практика';
      text = 'Не расстраивайся! Прочитай теорию и попробуй ещё раз — с каждым разом будет лучше.';
    }
    el('result-emoji').textContent = emoji;
    el('result-title').textContent = title;
    el('result-text').textContent = text;

    show('screen-end');
  }

  /* ======================= ОБРАБОТЧИКИ ======================= */
  document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => startGame(card.dataset.theme));
  });

  el('btn-refresh').addEventListener('click', () => {
    if (state.answered) return;
    renderOptions();
  });

  el('btn-next').addEventListener('click', nextQuestion);

  el('btn-exit').addEventListener('click', () => show('screen-start'));

  el('btn-again').addEventListener('click', () => startGame(state.theme));

  el('btn-menu').addEventListener('click', () => show('screen-start'));

})();
