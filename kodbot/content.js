/* content.js — учебная программа: теория, задания, тесты, итоги уроков */
const LESSONS = [
  // ================= УРОК 1 =================
  {
    id: 1, title: 'Привет, бот!', tagline: 'Первые сообщения и диалог',
    emoji: '🤖', color: '#ffd93d',
    lib: ['msg', 'var'],
    intro: {
      title: 'Знакомство с КодБотом',
      emoji: '🤖',
      commands: [
        { code: 'send("Привет!")', desc: '<strong>send()</strong> — отправить сообщение пользователю.' },
        { code: 'name = input()', desc: '<strong>input()</strong> — ждать ответ и сохранить в переменную.' },
        { code: 'send("Привет, " + name + "!")', desc: 'Строки склеиваются знаком <code>+</code>.' }
      ]
    },
    theory: '<h3>👋 Первый урок</h3><p>Чат-бот отправляет сообщения и читает ответы.</p><p><code>send("текст")</code> — бот пишет. <code>input()</code> — бот ждёт ответ.</p><h3>📦 Переменные</h3><p><code>name = input()</code> — сохранить ответ. Потом: <code>send("Привет, " + name)</code>.</p>',
    summary: [
      { code: 'send("Привет! Как тебя зовут?")\nname = input()\nsend("Рад знакомству, " + name + "!")', note: 'Бот здоровается, спрашивает имя и приветствует пользователя.' }
    ],
    tasks: [
      { title: '👋 Первое сообщение', text: 'Отправь <code>"Привет!"</code>',
        starter: '', hint: '<code>send("Привет!")</code>',
        tests: [{ replies: [], expect: ['Привет!'] }] },
      { title: '❓ Вопрос', text: 'Пусть бот спросит: <code>"Как тебя зовут?"</code>',
        starter: '', hint: '<code>send("Как тебя зовут?")</code>',
        tests: [{ replies: [], expect: ['Как тебя зовут?'] }] },
      { title: '💾 Запомнить имя', text: 'Сохрани ответ в переменную <code>name</code>.',
        starter: 'send("Как тебя зовут?")\n', hint: '<code>name = input()</code>',
        tests: [{ replies: ['Алиса'], expect: ['Как тебя зовут?'] }] },
      { title: '🎉 Приветствие по имени', text: 'Отправь: <code>"Привет, &lt;имя&gt;!"</code>',
        starter: 'send("Как тебя зовут?")\nname = input()\n', hint: '<code>send("Привет, " + name + "!")</code>',
        tests: [{ replies: ['Алиса'], expect: ['Как тебя зовут?', 'Привет, Алиса!'] }] },
      { title: '🗨 Полный диалог', text: 'Добавь вопрос <code>"Сколько тебе лет?"</code> и ответ <code>"Круто, тебе &lt;возраст&gt; лет!"</code>',
        starter: 'send("Как тебя зовут?")\nname = input()\nsend("Привет, " + name + "!")\n',
        hint: 'Создай переменную <code>age</code>.',
        tests: [{ replies: ['Алиса', '25'], expect: ['Как тебя зовут?', 'Привет, Алиса!', 'Сколько тебе лет?', 'Круто, тебе 25 лет!'] }] },
      { title: '🎨 Три вопроса', text: 'Спроси имя, цвет и еду. После каждого — комментарий.',
        starter: '', hint: 'Повтори: send → input → send.',
        tests: [{ replies: ['Алиса', 'синий', 'пицца'], expect: ['Как тебя зовут?', 'Привет, Алиса!', 'Какой твой любимый цвет?', 'синий — классный выбор!', 'Какую еду ты любишь?', 'пицца — вкусно!'] }] },
      { title: '🔢 Сложение двух чисел', text: 'Спроси два числа, преврати в <code>int()</code>, выведи сумму.',
        starter: '', hint: '<code>a = int(input())</code>',
        tests: [{ replies: ['5', '7'], expect: ['Введи первое число:', 'Введи второе число:', 'Сумма: 12'] }] },
      { title: '📏 Площадь прямоугольника', text: 'Спроси длину и ширину, выведи <code>"Площадь: &lt;S&gt;"</code>',
        starter: '', hint: '<code>S = a * b</code>',
        tests: [{ replies: ['5', '4'], expect: ['Длина?', 'Ширина?', 'Площадь: 20'] }] },
      { title: '🎂 Возраст через 10 лет', text: 'Выведи <code>"Через 10 лет тебе будет &lt;age+10&gt;"</code>',
        starter: '', hint: '<code>age + 10</code>',
        tests: [{ replies: ['20'], expect: ['Сколько тебе лет?', 'Через 10 лет тебе будет 30'] }] },
      { title: '🏆 Бот-визитка', text: 'Бот: <code>"Я КодБот!"</code>, спрашивает имя и город, затем: <code>"Привет, &lt;имя&gt; из &lt;город&gt;!"</code>',
        starter: '', hint: 'Две переменные.',
        tests: [{ replies: ['Алиса', 'Москва'], expect: ['Я КодБот!', 'Как тебя зовут?', 'Откуда ты?', 'Привет, Алиса из Москва!'] }] }
    ]
  },

  // ================= УРОК 2 =================
  {
    id: 2, title: 'Переменные и числа', tagline: 'Математика и преобразования',
    emoji: '🔢', color: '#5eead4',
    lib: ['var', 'math'],
    intro: {
      title: 'Работа с числами',
      emoji: '🔢',
      commands: [
        { code: 'x = int(input())', desc: '<strong>int()</strong> превращает текст в число.' },
        { code: 'a + b, a - b, a * b, a / b', desc: 'Обычная <strong>арифметика</strong>.' },
        { code: 'a % b', desc: '<strong>Остаток от деления</strong>. Например, <code>10 % 3 = 1</code>.' }
      ]
    },
    theory: '<h3>🔢 Числа</h3><p>Когда пользователь пишет число, оно приходит как текст. Преврати: <code>n = int(input())</code>.</p><h3>🧮 Операции</h3><p><code>+ - * / %</code> — как в математике.</p>',
    summary: [
      { code: 'send("Введи число:")\nn = int(input())\nsend("Квадрат: " + str(n * n))', note: 'Превращаем ввод в число, считаем квадрат.' }
    ],
    tasks: [
      { title: '📥 Число в переменной', text: 'Спроси число, выведи <code>"Ты ввёл: &lt;n&gt;"</code>',
        starter: '', hint: '<code>n = int(input())</code>',
        tests: [{ replies: ['42'], expect: ['Введи число:', 'Ты ввёл: 42'] }] },
      { title: '➕ Сложение', text: 'Сложи два числа, выведи <code>"Сумма: &lt;s&gt;"</code>',
        starter: '', hint: '<code>a = int(input())</code>, <code>b = int(input())</code>',
        tests: [{ replies: ['3', '4'], expect: ['Первое:', 'Второе:', 'Сумма: 7'] }] },
      { title: '🧮 Все операции', text: 'Спроси два числа, выведи сумму, разность, произведение, частное',
        starter: '', hint: '<code>+ - * /</code>',
        tests: [{ replies: ['10', '2'], expect: ['Два числа:', 'Сумма: 12', 'Разность: 8', 'Произведение: 20', 'Частное: 5'] }] },
      { title: '💱 Конвертер валют', text: 'Спроси рубли и курс, выведи <code>"В долларах: &lt;сумма/курс&gt;"</code>',
        starter: '', hint: '<code>usd = rub / course</code>',
        tests: [{ replies: ['1000', '100'], expect: ['Рублей?', 'Курс?', 'В долларах: 10'] }] },
      { title: '📐 Периметр квадрата', text: 'Выведи <code>"Периметр: &lt;4*a&gt;"</code>',
        starter: '', hint: '<code>P = a * 4</code>',
        tests: [{ replies: ['5'], expect: ['Сторона?', 'Периметр: 20'] }] },
      { title: '🎂 Год рождения', text: 'Выведи <code>"Ты родился примерно в &lt;2026-age&gt; году"</code>',
        starter: '', hint: '<code>2026 - age</code>',
        tests: [{ replies: ['20'], expect: ['Сколько тебе лет?', 'Ты родился примерно в 2006 году'] }] },
      { title: '🔢 Чётное или нечётное', text: 'Выведи <code>"Чётное"</code> или <code>"Нечётное"</code>',
        starter: '', hint: '<code>n % 2 == 0</code>',
        tests: [{ replies: ['4'], expect: ['Число?', 'Чётное'] }, { replies: ['5'], expect: ['Число?', 'Нечётное'] }] },
      { title: '🌡️ Цельсий → Фаренгейт', text: '<code>F = C * 9 / 5 + 32</code>',
        starter: '', hint: 'Порядок операций!',
        tests: [{ replies: ['0'], expect: ['Цельсии?', '32 градусов по Фаренгейту'] }, { replies: ['100'], expect: ['Цельсии?', '212 градусов по Фаренгейту'] }] },
      { title: '⏱️ Секунды в минуты', text: 'Выведи <code>"&lt;мин&gt; мин &lt;сек&gt; сек"</code>',
        starter: '', hint: '<code>int(s / 60)</code>, <code>s % 60</code>',
        tests: [{ replies: ['125'], expect: ['Секунд?', '2 мин 5 сек'] }] },
      { title: '🏆 Калькулятор', text: 'Спроси число, знак и число. Выведи <code>"Результат: &lt;r&gt;"</code>',
        starter: '', hint: '4 if',
        tests: [{ replies: ['10', '+', '5'], expect: ['Число?', 'Знак?', 'Число?', 'Результат: 15'] }, { replies: ['10', '*', '3'], expect: ['Число?', 'Знак?', 'Число?', 'Результат: 30'] }] }
    ]
  },

  // ================= УРОК 3 =================
  {
    id: 3, title: 'Условия', tagline: 'Логика и развилки',
    emoji: '🔀', color: '#ff6bcb',
    lib: ['cond', 'var', 'math'],
    intro: {
      title: 'Учим бота думать',
      emoji: '🔀',
      commands: [
        { code: 'if x > 5:\n    send("Много")', desc: '<strong>if</strong> — если условие верно.' },
        { code: 'if x > 5:\n    send("Много")\nelse:\n    send("Мало")', desc: '<strong>else</strong> — иначе.' },
        { code: 'if x > 10:\n    send("Очень")\nelif x > 5:\n    send("Много")\nelse:\n    send("Мало")', desc: '<strong>elif</strong> — дополнительная проверка.' },
        { code: 'x > 5 and x < 10', desc: '<strong>and</strong> — оба условия. <strong>or</strong> — хотя бы одно.' }
      ]
    },
    theory: '<h3>🔀 Условия</h3><p><code>if</code> проверяет условие. Если верно — выполняется блок.</p><h3>🧪 Сравнения</h3><p><code>== != &lt; &gt; &lt;= &gt;=</code></p><h3>🔗 Логика</h3><p><code>and</code>, <code>or</code>, <code>not</code>.</p>',
    summary: [
      { code: 'send("Сколько тебе лет?")\nage = int(input())\nif age < 18:\n    send("Ты несовершеннолетний")\nelif age < 60:\n    send("Ты взрослый")\nelse:\n    send("Ты пожилой")', note: 'Каскад if/elif/else.' }
    ],
    tasks: [
      { title: '✅ Да или нет', text: 'Если "да" — <code>"Иди гулять!"</code>, иначе <code>"Посиди дома"</code>',
        starter: '', hint: '<code>if answer == "да":</code>',
        tests: [{ replies: ['да'], expect: ['Светит солнце?', 'Иди гулять!'] }, { replies: ['нет'], expect: ['Светит солнце?', 'Посиди дома'] }] },
      { title: '🔢 Больше/меньше', text: 'Если &gt;10 — <code>"Много"</code>, иначе <code>"Норм"</code>',
        starter: '', hint: '<code>if n > 10:</code>',
        tests: [{ replies: ['15'], expect: ['Число?', 'Много'] }, { replies: ['5'], expect: ['Число?', 'Норм'] }] },
      { title: '🎯 Три варианта', text: '&lt;0 — <code>"Отрицательное"</code>, 0 — <code>"Ноль"</code>, иначе <code>"Положительное"</code>',
        starter: '', hint: 'elif',
        tests: [{ replies: ['-5'], expect: ['Число?', 'Отрицательное'] }, { replies: ['0'], expect: ['Число?', 'Ноль'] }, { replies: ['7'], expect: ['Число?', 'Положительное'] }] },
      { title: '🔐 Пароль', text: 'Если <code>"1234"</code> — <code>"Добро пожаловать!"</code>, иначе <code>"Отказано"</code>',
        starter: '', hint: '<code>if pwd == "1234":</code>',
        tests: [{ replies: ['1234'], expect: ['Пароль?', 'Добро пожаловать!'] }, { replies: ['0000'], expect: ['Пароль?', 'Отказано'] }] },
      { title: '🎂 Возраст: ребёнок/взрослый', text: '&lt;18 — <code>"Ребёнок"</code>, 18-65 — <code>"Взрослый"</code>, &gt;65 — <code>"Пожилой"</code>',
        starter: '', hint: '<code>age >= 18 and age <= 65</code>',
        tests: [{ replies: ['10'], expect: ['Возраст?', 'Ребёнок'] }, { replies: ['30'], expect: ['Возраст?', 'Взрослый'] }, { replies: ['70'], expect: ['Возраст?', 'Пожилой'] }] },
      { title: '🔢 Угадай число', text: 'Загадай 7. Скажи <code>"Угадал!"</code> или <code>"Не угадал"</code>',
        starter: '', hint: '<code>if n == 7:</code>',
        tests: [{ replies: ['7'], expect: ['Угадай число от 1 до 10:', 'Угадал!'] }, { replies: ['5'], expect: ['Угадай число от 1 до 10:', 'Не угадал'] }] },
      { title: '🚦 Светофор', text: 'красный — <code>"Стой"</code>, жёлтый — <code>"Жди"</code>, зелёный — <code>"Иди"</code>',
        starter: '', hint: 'Три elif',
        tests: [{ replies: ['красный'], expect: ['Цвет?', 'Стой'] }, { replies: ['жёлтый'], expect: ['Цвет?', 'Жди'] }, { replies: ['зелёный'], expect: ['Цвет?', 'Иди'] }] },
      { title: '🎫 Билет', text: 'Если &lt;18 или студент — <code>"Бесплатно"</code>, иначе <code>"200 рублей"</code>',
        starter: '', hint: '<code>if age < 18 or student == "да":</code>',
        tests: [{ replies: ['15', 'нет'], expect: ['Возраст?', 'Студент?', 'Бесплатно'] }, { replies: ['25', 'да'], expect: ['Возраст?', 'Студент?', 'Бесплатно'] }, { replies: ['25', 'нет'], expect: ['Возраст?', 'Студент?', '200 рублей'] }] },
      { title: '🌡️ Температура', text: '&lt;0 — <code>"Холодно"</code>, 0-20 — <code>"Прохладно"</code>, 20-30 — <code>"Тепло"</code>, &gt;30 — <code>"Жарко"</code>',
        starter: '', hint: 'Четыре ветки',
        tests: [{ replies: ['-5'], expect: ['Температура?', 'Холодно'] }, { replies: ['15'], expect: ['Температура?', 'Прохладно'] }, { replies: ['25'], expect: ['Температура?', 'Тепло'] }, { replies: ['35'], expect: ['Температура?', 'Жарко'] }] },
      { title: '🏆 Квиз', text: '"Столица Франции?" (ответ: paris). Верно — <code>"Верно!"</code>, иначе <code>"Неверно, это Париж"</code>',
        starter: '', hint: 'Сравнивай с "paris"',
        tests: [{ replies: ['paris'], expect: ['Столица Франции?', 'Верно!'] }, { replies: ['london'], expect: ['Столица Франции?', 'Неверно, это Париж'] }] }
    ]
  },

  // ================= УРОК 4 =================
  {
    id: 4, title: 'Циклы', tagline: 'Повторения и диапазоны',
    emoji: '🔁', color: '#a78bfa',
    lib: ['loop', 'var', 'cond', 'math'],
    intro: {
      title: 'Повторяем действия',
      emoji: '🔁',
      commands: [
        { code: 'for i in range(5):\n    send(str(i))', desc: '<strong>for</strong> повторяет N раз. <code>range(5)</code> — от 0 до 4.' },
        { code: 'for i in range(1, 6):\n    send(str(i))', desc: '<code>range(от, до)</code> — от 1 до 5.' },
        { code: 'while условие:\n    ...', desc: '<strong>while</strong> — пока условие истинно.' },
        { code: 'break', desc: '<strong>break</strong> — выйти из цикла.' },
        { code: 'continue', desc: '<strong>continue</strong> — к следующей итерации.' }
      ]
    },
    theory: '<h3>🔁 Цикл for</h3><p><code>for i in range(N)</code> — N повторов.</p><h3>🔄 Цикл while</h3><p>Пока условие верно. Не забудь <code>break</code>!</p>',
    summary: [
      { code: 'for i in range(1, 6):\n    send("Шаг " + str(i))\nsend("Готово!")', note: 'Цикл от 1 до 5.' }
    ],
    tasks: [
      { title: '🔢 Счётчик до 5', text: 'Выведи числа от 1 до 5',
        starter: '', hint: '<code>for i in range(1, 6):</code>',
        tests: [{ replies: [], expect: ['1', '2', '3', '4', '5'] }] },
      { title: '🔁 Повтор 3 раза', text: 'Спроси имя и поприветствуй 3 раза',
        starter: '', hint: '<code>for i in range(3):</code>',
        tests: [{ replies: ['Алиса'], expect: ['Имя?', 'Привет, Алиса!', 'Привет, Алиса!', 'Привет, Алиса!'] }] },
      { title: '📊 Таблица умножения', text: 'Выведи таблицу от 1 до 10: <code>"&lt;n&gt; * &lt;i&gt; = &lt;результат&gt;"</code>',
        starter: '', hint: '<code>for i in range(1, 11):</code>',
        tests: [{ replies: ['5'], expect: ['Число?', '5 * 1 = 5', '5 * 2 = 10', '5 * 3 = 15', '5 * 4 = 20', '5 * 5 = 25', '5 * 6 = 30', '5 * 7 = 35', '5 * 8 = 40', '5 * 9 = 45', '5 * 10 = 50'] }] },
      { title: '🎯 Сумма чисел', text: 'Сумма от 1 до N: <code>"Сумма: &lt;s&gt;"</code>',
        starter: '', hint: '<code>s = 0</code>, <code>s = s + i</code>',
        tests: [{ replies: ['5'], expect: ['N?', 'Сумма: 15'] }, { replies: ['10'], expect: ['N?', 'Сумма: 55'] }] },
      { title: '🔁 While: пока не "стоп"', text: 'Спрашивай слово, пока не <code>"стоп"</code>. После каждого: <code>"Слышал: &lt;слово&gt;"</code>',
        starter: '', hint: '<code>while True:</code> и <code>break</code>',
        tests: [{ replies: ['привет', 'мир', 'стоп'], expect: ['Слово (стоп — выход)?', 'Слышал: привет', 'Слово (стоп — выход)?', 'Слышал: мир', 'Слово (стоп — выход)?', 'Пока!'] }] },
      { title: '🎮 Угадай число', text: 'Загадай 7. Говори <code>"Мало"</code> / <code>"Много"</code> / <code>"Угадал!"</code>',
        starter: '', hint: '<code>while True:</code>',
        tests: [{ replies: ['3', '9', '7'], expect: ['Угадай (1-10)?', 'Мало', 'Угадай (1-10)?', 'Много', 'Угадай (1-10)?', 'Угадал!'] }] },
      { title: '🔢 Только чётные', text: 'Выведи чётные от 1 до 10 через <code>continue</code>',
        starter: '', hint: '<code>if i % 2 != 0: continue</code>',
        tests: [{ replies: [], expect: ['2', '4', '6', '8', '10'] }] },
      { title: '📉 Обратный отсчёт', text: 'От 10 до 1, потом <code>"Пуск!"</code>',
        starter: '', hint: 'while с уменьшением счётчика',
        tests: [{ replies: [], expect: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1', 'Пуск!'] }] },
      { title: '🎲 Бросок кубика', text: 'Спрашивай "Бросить?" (да/нет). Если да — <code>"Выпало: 6"</code>, если нет — <code>"Ладно"</code>',
        starter: '', hint: 'Простой if',
        tests: [{ replies: ['да'], expect: ['Бросить кубик? (да/нет)', 'Выпало: 6'] }, { replies: ['нет'], expect: ['Бросить кубик? (да/нет)', 'Ладно'] }] },
      { title: '🏆 Пирамида', text: 'Пирамида из звёздочек: 1, 2, 3, ..., N',
        starter: '', hint: '<code>send("*" * i)</code>',
        tests: [{ replies: ['4'], expect: ['N?', '*', '**', '***', '****'] }] }
    ]
  },

  // ================= УРОК 5 =================
  {
    id: 5, title: 'Функции', tagline: 'Свои команды',
    emoji: '🧩', color: '#4ade80',
    lib: ['func', 'var', 'cond', 'loop', 'math'],
    intro: {
      title: 'Создаём свои команды',
      emoji: '🧩',
      commands: [
        { code: 'def greet():\n    send("Привет!")', desc: '<strong>def</strong> создаёт команду. Вызов: <code>greet()</code>.' },
        { code: 'def greet(name):\n    send("Привет, " + name)', desc: 'Функция с <strong>параметрами</strong>.' },
        { code: 'def square(x):\n    return x * x', desc: '<strong>return</strong> — вернуть результат.' }
      ]
    },
    theory: '<h3>🧩 Функции</h3><p><code>def имя(параметры):</code> — переиспользуемый кусок кода.</p><h3>📤 return</h3><p>Возвращает значение из функции.</p>',
    summary: [
      { code: 'def greet(name):\n    send("Привет, " + name + "!")\n\ndef square(x):\n    return x * x\n\ngreet("Алиса")\nsend("Квадрат 5: " + str(square(5)))', note: 'Две функции: одна общается, другая считает.' }
    ],
    tasks: [
      { title: '🎤 Простая функция', text: 'Создай <code>hello()</code>, отправляющую <code>"Привет!"</code>. Вызови её.',
        starter: '', hint: '<code>def hello():</code>',
        tests: [{ replies: [], expect: ['Привет!'] }] },
      { title: '👋 С параметром', text: '<code>greet(name)</code> → <code>"Привет, &lt;name&gt;!"</code>. Вызови с "Мир".',
        starter: '', hint: '<code>def greet(name):</code>',
        tests: [{ replies: [], expect: ['Привет, Мир!'] }] },
      { title: '🔢 Возврат значения', text: '<code>square(x)</code> → <code>x * x</code>. Выведи <code>"Квадрат 5: &lt;r&gt;"</code>',
        starter: '', hint: '<code>return x * x</code>',
        tests: [{ replies: [], expect: ['Квадрат 5: 25'] }] },
      { title: '🧮 Сумма', text: '<code>add(a, b)</code> → сумма. Выведи <code>"3 + 4 = &lt;r&gt;"</code>',
        starter: '', hint: '<code>return a + b</code>',
        tests: [{ replies: [], expect: ['3 + 4 = 7'] }] },
      { title: '🎯 Максимум из двух', text: '<code>max2(a, b)</code> → большее. Для 10 и 20.',
        starter: '', hint: '<code>if a > b: return a</code>',
        tests: [{ replies: [], expect: ['Максимум: 20'] }] },
      { title: '🔁 Функция в цикле', text: '<code>greet(name)</code>. Спроси 3 имени и вызови для каждого.',
        starter: '', hint: '<code>for i in range(3):</code>',
        tests: [{ replies: ['Алиса', 'Борис', 'Виктор'], expect: ['Имя 1?', 'Привет, Алиса!', 'Имя 2?', 'Привет, Борис!', 'Имя 3?', 'Привет, Виктор!'] }] },
      { title: '🔀 Функция с условием', text: '<code>check_age(age)</code> → <code>"взрослый"</code> или <code>"ребёнок"</code>. Для 25.',
        starter: '', hint: '<code>if age >= 18: return "взрослый"</code>',
        tests: [{ replies: [], expect: ['взрослый'] }] },
      { title: '📊 Несколько функций', text: '<code>square(x)</code> и <code>cube(x)</code>. Квадрат и куб 3.',
        starter: '', hint: 'Две функции с return',
        tests: [{ replies: [], expect: ['Квадрат: 9', 'Куб: 27'] }] },
      { title: '🎮 Меню команд', text: '<code>cmd_help()</code>, <code>cmd_time()</code> (отправляет "12:00"). Команды: help/time/exit',
        starter: '', hint: 'if/elif внутри while',
        tests: [{ replies: ['help', 'time', 'exit'], expect: ['Команда?', 'Я бот-помощник!', 'Команда?', '12:00', 'Команда?', 'Пока!'] }] },
      { title: '🏆 Факториал', text: '<code>fact(n)</code>. Выведи <code>"5! = &lt;r&gt;"</code>',
        starter: '', hint: 'Цикл от 1 до n',
        tests: [{ replies: [], expect: ['5! = 120'] }] }
    ]
  },

  // ================= УРОК 6 =================
  {
    id: 6, title: 'Списки', tagline: 'Храним много данных',
    emoji: '📋', color: '#ffd93d',
    lib: ['list', 'loop', 'var', 'cond', 'func'],
    intro: {
      title: 'Работа со списками',
      emoji: '📋',
      commands: [
        { code: 'items = [1, 2, 3]', desc: '<strong>Список</strong> — набор элементов.' },
        { code: 'items[0]', desc: '<strong>Первый элемент</strong> — индекс 0. <code>items[-1]</code> — последний.' },
        { code: 'items.append(x)', desc: '<strong>Добавить</strong> элемент в конец.' },
        { code: 'items.remove(x)', desc: '<strong>Удалить</strong> первое вхождение.' },
        { code: 'for x in items:\n    send(str(x))', desc: 'Перебор списка.' },
        { code: 'len(items)', desc: '<strong>Длина</strong> списка.' },
        { code: 'x in items', desc: 'Есть ли элемент в списке.' }
      ]
    },
    theory: '<h3>📋 Списки</h3><p><code>items = [1, 2, 3]</code>.</p><h3>🔢 Индексы</h3><p>С 0. <code>items[-1]</code> — последний.</p><h3>🛠 Методы</h3><p><code>append</code>, <code>remove</code>, <code>len</code>.</p>',
    summary: [
      { code: 'items = []\nfor i in range(3):\n    send("Элемент?")\n    items.append(input())\nsend("Твой список: " + str(items))', note: 'Собираем список из 3 элементов.' }
    ],
    tasks: [
      { title: '📝 Создать список', text: '<code>fruits = ["яблоко", "банан", "вишня"]</code>. Выведи его.',
        starter: '', hint: '<code>send(str(fruits))</code>',
        tests: [{ replies: [], expect: ['["яблоко", "банан", "вишня"]'] }] },
      { title: '🔢 Первый и последний', text: 'Список <code>[10, 20, 30, 40]</code>. Выведи первый и последний.',
        starter: '', hint: '<code>items[0]</code> и <code>items[-1]</code>',
        tests: [{ replies: [], expect: ['Первый: 10', 'Последний: 40'] }] },
      { title: '➕ Добавить элемент', text: 'Пустой список. Спроси 3 слова, добавь через <code>append</code>.',
        starter: '', hint: '<code>items.append(input())</code>',
        tests: [{ replies: ['а', 'б', 'в'], expect: ['Слово 1?', 'Слово 2?', 'Слово 3?', '["а", "б", "в"]'] }] },
      { title: '🗑 Удалить элемент', text: '<code>[1, 2, 3, 4]</code>. Удали 2 и 3.',
        starter: '', hint: '<code>items.remove(2)</code>',
        tests: [{ replies: [], expect: ['[1, 4]'] }] },
      { title: '🔁 Перебор списка', text: '<code>["Алиса", "Борис", "Виктор"]</code>. Для каждого: <code>"Привет, &lt;имя&gt;!"</code>',
        starter: '', hint: '<code>for name in names:</code>',
        tests: [{ replies: [], expect: ['Привет, Алиса!', 'Привет, Борис!', 'Привет, Виктор!'] }] },
      { title: '🔍 Поиск', text: '<code>[10, 20, 30]</code>. Если есть — <code>"Нашёл!"</code>, иначе <code>"Нет"</code>',
        starter: '', hint: '<code>if n in items:</code>',
        tests: [{ replies: ['20'], expect: ['Число?', 'Нашёл!'] }, { replies: ['5'], expect: ['Число?', 'Нет'] }] },
      { title: '📊 Сумма списка', text: '<code>[1, 2, 3, 4, 5]</code>. Посчитай сумму.',
        starter: '', hint: '<code>s = 0</code>, <code>for x in items: s = s + x</code>',
        tests: [{ replies: [], expect: ['Сумма: 15'] }] },
      { title: '🛒 Список покупок', text: 'Спрашивай, пока не <code>"стоп"</code>. Выведи <code>"В корзине N товаров"</code>',
        starter: '', hint: '<code>while True</code> и <code>cart.append</code>',
        tests: [{ replies: ['хлеб', 'молоко', 'стоп'], expect: ['Товар (стоп — выход)?', 'Товар (стоп — выход)?', 'Товар (стоп — выход)?', 'В корзине 2 товаров'] }] },
      { title: '🔢 Максимум в списке', text: '<code>[5, 2, 9, 1, 7]</code>. Найди максимум.',
        starter: '', hint: '<code>m = items[0]</code>',
        tests: [{ replies: [], expect: ['Максимум: 9'] }] },
      { title: '🏆 Функция со списком', text: '<code>show_list(items)</code> — выводит каждый элемент. Для <code>["a", "b", "c"]</code>',
        starter: '', hint: '<code>for x in items: send(str(x))</code>',
        tests: [{ replies: [], expect: ['a', 'b', 'c'] }] }
    ]
  },

  // ================= УРОК 7 =================
  {
    id: 7, title: 'Строки и случайности', tagline: 'Магия текста и рандом',
    emoji: '🎲', color: '#ff6bcb',
    lib: ['str', 'random', 'list', 'var', 'cond', 'loop'],
    intro: {
      title: 'Работа со строками и случайностями',
      emoji: '🎲',
      commands: [
        { code: 'text.upper()', desc: '<strong>ВЕРХНИЙ РЕГИСТР</strong>.' },
        { code: 'text.lower()', desc: '<strong>нижний регистр</strong>.' },
        { code: 'text.find("мир")', desc: 'Ищет подстроку. Индекс или <code>-1</code>.' },
        { code: 'text.split(", ")', desc: 'Разбивает на <strong>список</strong>.' },
        { code: '", ".join(words)', desc: 'Склеивает список в строку.' },
        { code: 'random.randint(1, 10)', desc: 'Случайное <strong>целое</strong> от 1 до 10.' },
        { code: 'random.choice(items)', desc: 'Случайный <strong>элемент</strong> из списка.' }
      ]
    },
    theory: '<h3>✂️ Методы строк</h3><p><code>upper</code>, <code>lower</code>, <code>find</code>, <code>split</code>, <code>join</code>.</p><h3>🎲 Случайности</h3><p><code>random.randint(a, b)</code> и <code>random.choice(list)</code>.</p>',
    summary: [
      { code: 'send("Как дела?")\nanswer = input().lower()\nif "хорошо" in answer:\n    send("Рад слышать!")\nelse:\n    send("Держись!")', note: 'Приводим к нижнему регистру.' }
    ],
    tasks: [
      { title: '🔠 Верхний регистр', text: 'Спроси имя, выведи ЗАГЛАВНЫМИ',
        starter: '', hint: '<code>name.upper()</code>',
        tests: [{ replies: ['Алиса'], expect: ['Имя?', 'АЛИСА'] }] },
      { title: '🔡 Нижний регистр', text: 'Спроси слово, выведи маленькими',
        starter: '', hint: '<code>word.lower()</code>',
        tests: [{ replies: ['ПРИВЕТ'], expect: ['Слово?', 'привет'] }] },
      { title: '🔍 Поиск подстроки', text: 'Если есть — <code>"Нашёл на позиции &lt;idx&gt;"</code>, иначе <code>"Не нашёл"</code>',
        starter: '', hint: '<code>text.find(word)</code>',
        tests: [{ replies: ['привет мир', 'мир'], expect: ['Фраза?', 'Слово?', 'Нашёл на позиции 7'] }, { replies: ['привет мир', 'кот'], expect: ['Фраза?', 'Слово?', 'Не нашёл'] }] },
      { title: '🔪 Разбить на слова', text: 'Спроси строку, выведи количество слов',
        starter: '', hint: '<code>text.split(" ")</code>',
        tests: [{ replies: ['один два три'], expect: ['Строка?', 'Слов: 3'] }] },
      { title: '🧵 Склеить список', text: '<code>["Алиса", "Борис", "Виктор"]</code>. Через <code>", "</code>',
        starter: '', hint: '<code>", ".join(names)</code>',
        tests: [{ replies: [], expect: ['Алиса, Борис, Виктор'] }] },
      { title: '🎲 Случайное число', text: 'От 1 до 100: <code>"Твоё число: &lt;n&gt;"</code>',
        starter: '', hint: '<code>random.randint(1, 100)</code>',
        tests: [{ replies: [], expect: [], check: (got) => got.length === 1 && got[0].startsWith('Твоё число:') && (() => { const n = parseInt(got[0].slice(12)); return n >= 1 && n <= 100; })() }] },
      { title: '🎯 Случайный элемент', text: '<code>["яблоко", "банан", "вишня"]</code>. <code>"Выбрано: &lt;x&gt;"</code>',
        starter: '', hint: '<code>random.choice(items)</code>',
        tests: [{ replies: [], expect: [], check: (got) => got.length === 1 && got[0].startsWith('Выбрано: ') && ['Выбрано: яблоко', 'Выбрано: банан', 'Выбрано: вишня'].includes(got[0]) }] },
      { title: '🔐 Генератор пароля', text: '6 случайных цифр (0-9)',
        starter: '', hint: 'Цикл 6 раз, <code>random.randint(0, 9)</code>',
        tests: [{ replies: [], expect: [], check: (got) => got.length === 1 && /^Пароль: \d{6}$/.test(got[0]) }] },
      { title: '🎮 Магический шар', text: 'Список ответов: <code>["Да", "Нет", "Возможно", "Спроси позже"]</code>. Спроси вопрос, дай случайный ответ',
        starter: '', hint: '<code>random.choice(answers)</code>',
        tests: [{ replies: ['Будет ли солнце?'], expect: ['Задай вопрос:', ''], check: (got) => got.length === 2 && ['Да', 'Нет', 'Возможно', 'Спроси позже'].includes(got[1]) }] },
      { title: '🏆 Анализатор текста', text: 'Длину, кол-во слов, в верхнем регистре',
        starter: '', hint: '<code>len</code>, <code>split</code>, <code>upper</code>',
        tests: [{ replies: ['привет мир'], expect: ['Текст?', 'Длина: 10', 'Слов: 2', 'ВЕРХ: ПРИВЕТ МИР'] }] }
    ]
  },

  // ================= УРОК 8 =================
  {
    id: 8, title: 'Финальный проект', tagline: 'Твой собственный бот',
    emoji: '🏆', color: '#4ade80',
    lib: ['msg', 'var', 'cond', 'loop', 'func', 'list', 'str', 'random', 'math'],
    intro: {
      title: 'Финальный босс 🏆',
      emoji: '🏆',
      commands: [
        { code: 'Все команды из прошлых уроков', desc: 'Объединяй списки, функции, условия, циклы и случайности!' },
        { code: 'while True:\n    cmd = input()\n    if cmd == "...":\n        ...', desc: 'Главный цикл бота.' },
        { code: 'memory = []\nmemory.append(x)', desc: 'Бот запоминает данные между сообщениями.' }
      ]
    },
    theory: '<h3>🏆 Финал</h3><p>Собери всё в один проект! Бот с памятью, командами и случайностями.</p>',
    summary: [
      { code: 'users = []\n\ndef add(name):\n    users.append(name)\n    send("Добавил: " + name)\n\ndef show():\n    if len(users) == 0:\n        send("Пока никого")\n    else:\n        send(", ".join(users))\n\nwhile True:\n    send("Команда?")\n    cmd = input()\n    if cmd == "добавить":\n        send("Имя?")\n        add(input())\n    elif cmd == "список":\n        show()\n    elif cmd == "выход":\n        send("Пока!")\n        break', note: 'Полноценный бот с памятью.' }
    ],
    tasks: [
      { title: '📝 Бот-список дел', text: 'Команды: <code>"добавить"</code>, <code>"список"</code>, <code>"выход"</code>',
        starter: '', hint: 'while True и if/elif',
        tests: [{ replies: ['добавить', 'купить хлеб', 'список', 'выход'], expect: ['Команда?', 'Дело?', 'Команда?', 'Команда?', '1. купить хлеб', 'Команда?', 'Пока!'] }] },
      { title: '🎮 Угадай число (продвинутый)', text: 'Загадай <code>random.randint(1, 10)</code>. <code>"Угадал за N попыток!"</code>',
        starter: '', hint: 'Счётчик попыток',
        tests: [{ replies: [], expect: [], check: () => true }] },
      { title: '🎲 Бот-предсказатель', text: 'Список 5 предсказаний. Спрашивай вопрос, давай случайный ответ. <code>"выход"</code>',
        starter: '', hint: '<code>random.choice</code>',
        tests: [{ replies: [], expect: [], check: () => true }] },
      { title: '🧮 Калькулятор с памятью', text: 'Команды: <code>"&lt;a&gt; + &lt;b&gt;"</code>, <code>"история"</code>, <code>"выход"</code>',
        starter: '', hint: '<code>text.split(" ")</code>',
        tests: [{ replies: [], expect: [], check: () => true }] },
      { title: '📊 Статистика чисел', text: 'Пока не <code>"стоп"</code>. Количество, сумма, среднее',
        starter: '', hint: 'Список + цикл',
        tests: [{ replies: ['10', '20', '30', 'стоп'], expect: ['Число (стоп — выход)?', 'Число (стоп — выход)?', 'Число (стоп — выход)?', 'Число (стоп — выход)?', 'Введено: 3', 'Сумма: 60', 'Среднее: 20'] }] },
      { title: '🎯 Викторина', text: 'Список вопросов. Считай правильные. <code>"Правильно: N из M"</code>',
        starter: '', hint: 'Список пар',
        tests: [{ replies: [], expect: [], check: () => true }] },
      { title: '🔐 Менеджер паролей', text: 'Команды: <code>"добавить сайт пароль"</code>, <code>"показать сайт"</code>, <code>"все"</code>, <code>"выход"</code>',
        starter: '', hint: 'Два списка или split',
        tests: [{ replies: [], expect: [], check: () => true }] },
      { title: '🎨 Генератор историй', text: '3 списка: имена, места, действия. Случайно составляй историю',
        starter: '', hint: '<code>random.choice</code> × 3',
        tests: [{ replies: [], expect: [], check: () => true }] },
      { title: '📱 Бот-переводчик регистра', text: 'Команды: <code>"вверх &lt;текст&gt;"</code>, <code>"вниз &lt;текст&gt;"</code>, <code>"длина &lt;текст&gt;"</code>, <code>"выход"</code>',
        starter: '', hint: '<code>cmd.split(" ", 1)</code>',
        tests: [{ replies: [], expect: [], check: () => true }] },
      { title: '🏆 Свободный проект', text: 'Придумай своего бота! Минимум: 3 команды, список, функция.',
        starter: '', hint: 'Объедини всё!',
        tests: [{ replies: [], expect: [], check: () => true }] }
    ]
  }
];
