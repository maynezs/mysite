(function() {
    // ---------- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ----------
    const questionsCount = 5;           // 5 уравнений
    let currentQuestions = [];           // массив объектов вопросов

    // Диапазон корней (целые числа)
    const MIN_ROOT = -5;
    const MAX_ROOT = 5;
    // Множитель a (от 1 до 3, чтобы не было огромных коэффициентов)
    const A_MIN = 1;
    const A_MAX = 3;

    // ---------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ----------
    // Случайное целое от min до max включительно
    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Форматирование уравнения по коэффициентам A, B, C
    function formatEquation(A, B, C) {
      let str = '';
      // A x²
      if (A === 1) str += 'x²';
      else if (A === -1) str += '-x²';
      else str += A + 'x²';

      // B x
      if (B > 0) {
        str += ' + ' + (B === 1 ? 'x' : B + 'x');
      } else if (B < 0) {
        str += ' - ' + (B === -1 ? 'x' : (-B) + 'x');
      }

      // C
      if (C > 0) {
        str += ' + ' + C;
      } else if (C < 0) {
        str += ' - ' + (-C);
      }

      str += ' = 0';
      return str;
    }

    // Получить строку пары (отсортированную)
    function pairToString(x1, x2) {
      let arr = [x1, x2].sort((a, b) => a - b);
      return arr[0] + ', ' + arr[1];
    }

    // Генерация одного вопроса (объект)
    function generateQuestion() {
      // 1) выбираем два целых корня
      let x1 = randomInt(MIN_ROOT, MAX_ROOT);
      let x2 = randomInt(MIN_ROOT, MAX_ROOT);
      // 2) выбираем a (коэффициент при x²)
      let a = randomInt(A_MIN, A_MAX);

      // 3) вычисляем коэффициенты A, B, C (A = a, B = -a*(x1+x2), C = a*x1*x2)
      let A = a;
      let B = -a * (x1 + x2);
      let C = a * x1 * x2;

      // 4) форматируем уравнение
      let equationText = formatEquation(A, B, C);

      // 5) правильный ответ в виде строки
      let correctPairStr = pairToString(x1, x2);

      // 6) генерируем 3 неправильных варианта (целые пары, не совпадающие с правильным и между собой)
      let wrongOptions = new Set();
      let maxAttempts = 100;
      while (wrongOptions.size < 3 && maxAttempts-- > 0) {
        let y1 = randomInt(MIN_ROOT, MAX_ROOT);
        let y2 = randomInt(MIN_ROOT, MAX_ROOT);
        let candidate = pairToString(y1, y2);
        // не должно совпадать с правильным и уже добавленными
        if (candidate !== correctPairStr && !wrongOptions.has(candidate)) {
          wrongOptions.add(candidate);
        }
      }
      // если вдруг не хватило (бывает редко), добиваем фиктивными, но уникальными вручную
      const fallbacks = ['-3, 1', '0, 4', '-2, -1', '1, 5', '-4, 0', '2, 3'];
      while (wrongOptions.size < 3) {
        for (let fb of fallbacks) {
          if (fb !== correctPairStr && !wrongOptions.has(fb)) {
            wrongOptions.add(fb);
            if (wrongOptions.size >= 3) break;
          }
        }
      }

      // 7) собираем все варианты (правильный + 3 неправильных)
      let allOptions = [correctPairStr, ...Array.from(wrongOptions)];

      // 8) перемешиваем варианты и запоминаем индекс правильного
      let shuffled = [];
      let indexes = [0, 1, 2, 3];
      for (let i = indexes.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
      }
      shuffled = indexes.map(idx => allOptions[idx]);
      let correctIndex = indexes.findIndex(idx => idx === 0); // где исходный правильный (0)

      // 9) дискриминант для подсказки
      let D = B * B - 4 * A * C;

      return {
        equation: equationText,
        options: shuffled,
        correctIndex: correctIndex,
        correctPair: [x1, x2],
        A, B, C,
        discriminant: D
      };
    }

    // Генерация массива вопросов
    function generateQuestions(count) {
      let qs = [];
      for (let i = 0; i < count; i++) {
        qs.push(generateQuestion());
      }
      return qs;
    }

    // ---------- ОТРИСОВКА ТЕСТА ----------
    function renderTest(questions) {
      const container = document.getElementById('test-container');
      container.innerHTML = ''; // очистка

      questions.forEach((q, idx) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.dataset.qid = idx;

        // Шапка с уравнением и кнопкой-подсказкой
        const header = document.createElement('div');
        header.className = 'question-header';

        const eqSpan = document.createElement('span');
        eqSpan.className = 'equation';
        eqSpan.textContent = q.equation;

        const hintButton = document.createElement('span');
        hintButton.className = 'hint-btn';
        hintButton.textContent = '?';
        hintButton.setAttribute('title', 'Показать дискриминант');
        // подсказка: при клике показываем дискриминант
        hintButton.addEventListener('click', (e) => {
          e.stopPropagation();
          alert(`📌 Дискриминант D = ${q.discriminant} (√D = ${Math.sqrt(q.discriminant)})`);
        });

        header.appendChild(eqSpan);
        header.appendChild(hintButton);
        card.appendChild(header);

        // Варианты ответов (radio)
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';

        q.options.forEach((optText, optIndex) => {
          const label = document.createElement('label');
          label.className = 'option-item';

          const radio = document.createElement('input');
          radio.type = 'radio';
          radio.name = `q${idx}`;
          radio.value = optIndex;

          const span = document.createElement('span');
          span.className = 'option-text';
          span.textContent = optText;

          label.appendChild(radio);
          label.appendChild(span);
          optionsDiv.appendChild(label);
        });

        card.appendChild(optionsDiv);
        container.appendChild(card);
      });

      // Сброс результата
      document.getElementById('result').innerHTML = '→ Выберите ответы и нажмите «Проверить»';
    }

    // ---------- ОЧИСТКА ВСЕХ ПОДСВЕТОК ----------
    function clearAllHighlights() {
      document.querySelectorAll('.option-item').forEach(item => {
        item.classList.remove('show-correct', 'correct-checked', 'wrong-checked');
      });
    }

    // ---------- ПРОВЕРКА ОТВЕТОВ (подсвечивает правильность выбора) ----------
    function checkAnswers() {
      clearAllHighlights();
      let correctCount = 0;
      let total = currentQuestions.length;

      for (let i = 0; i < total; i++) {
        const q = currentQuestions[i];
        const radios = document.getElementsByName(`q${i}`);
        let selectedValue = null;
        let selectedLabel = null;

        // какой вариант выбран?
        for (let j = 0; j < radios.length; j++) {
          if (radios[j].checked) {
            selectedValue = radios[j].value;
            selectedLabel = radios[j].closest('.option-item');
            break;
          }
        }

        // правильный индекс
        const correct = q.correctIndex;

        // если ответ выбран
        if (selectedValue !== null) {
          if (parseInt(selectedValue) === correct) {
            correctCount++;
            if (selectedLabel) selectedLabel.classList.add('correct-checked');
          } else {
            if (selectedLabel) selectedLabel.classList.add('wrong-checked');
          }
        } else {
          // не выбран — ничего не подсвечиваем, просто не засчитываем
        }
      }

      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = `✅ Верно: ${correctCount} из ${total}`;
    }

    // ---------- ПОКАЗАТЬ ПРАВИЛЬНЫЕ ОТВЕТЫ (подсветка зелёным, без учёта выбора) ----------
    function showCorrectAnswers() {
      clearAllHighlights();

      for (let i = 0; i < currentQuestions.length; i++) {
        const q = currentQuestions[i];
        const correctIdx = q.correctIndex;

        // ищем все label для данного вопроса
        const items = document.querySelectorAll(`input[name='q${i}']`);
        items.forEach((radio, idx) => {
          if (idx === correctIdx) {
            const label = radio.closest('.option-item');
            if (label) label.classList.add('show-correct');
          }
        });
      }
      document.getElementById('result').innerHTML = '🔍 Правильные ответы выделены зелёным';
    }

    // ---------- НОВЫЙ ТЕСТ ----------
    function newTest() {
      currentQuestions = generateQuestions(questionsCount);
      renderTest(currentQuestions);
    }

    // ---------- ИНИЦИАЛИЗАЦИЯ И ОБРАБОТЧИКИ ----------
    document.addEventListener('DOMContentLoaded', () => {
      newTest(); // генерация при загрузке

      document.getElementById('checkBtn').addEventListener('click', checkAnswers);
      document.getElementById('showAnswersBtn').addEventListener('click', showCorrectAnswers);
      document.getElementById('newTestBtn').addEventListener('click', () => {
        newTest();
      });
    });

  })();
