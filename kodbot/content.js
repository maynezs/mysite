/* content.js — вся учебная программа: теория, задания, тесты, итоги уроков */

const L5_START = ['Привет! Я бот-помощник 🤖', 'Как тебя зовут?', 'Приятно познакомиться, Петя!'];
const L5_MENU  = ['1 - анекдот', '2 - комплимент', '3 - выход'];

const LESSONS = [

/* ================= УРОК 1 ================= */
{
  id: 1,
  emoji: '👋',
  title: 'Первые сообщения',
  tagline: 'send, input и переменные',
  color: '#ffd93d',
  lib: ['msg', 'var', 'cond'],

  theory: `
    <h3>Что мы делаем?</h3>
    <p>Мы учимся писать <b>чат-бота на Python</b>. Бот живёт в мессенджере и умеет две главные вещи:
       отправлять сообщения и читать то, что написал человек.</p>

    <h3>1. Бот говорит — send()</h3>
    <pre><code>send("Привет, как тебя зовут?")</code></pre>
    <p>Всё, что стоит в кавычках, бот отправит в чат. Кавычки обязательны — без них Python не поймёт, что это текст.</p>

    <h3>2. Бот слушает — input()</h3>
    <pre><code>answer = input()</code></pre>
    <p><code>input()</code> ждёт сообщение от человека. Чтобы не потерять его, мы кладём ответ
       в <b>переменную</b> — это коробочка с именем. Здесь коробочка называется <code>answer</code>.</p>

    <h3>3. Склеиваем текст через +</h3>
    <pre><code>name = input()
send("Привет, " + name + "!")</code></pre>
    <p>Если человек написал «Петя», бот отправит «Привет, Петя!». Плюс склеивает кусочки текста.</p>

    <h3>4. Бот думает — if / else</h3>
    <pre><code>if answer == "Да":
    send("Круто!")
else:
    send("Жаль!")</code></pre>
    <p><b>if</b> — «если». <b>else</b> — «иначе». Два знака равно <code>==</code> — это сравнение
       (одно равно — это присваивание!). После двоеточия в следующей строке обязательно
       <b>4 пробела</b> — это отступ.</p>
  `,

  summary: [
    { code: 'send("Привет!")', note: 'бот отправляет сообщение в чат' },
    { code: 'name = input()', note: 'бот ждёт ответ и кладёт его в переменную name' },
    { code: 'send("Привет, " + name + "!")', note: 'склеиваем текст и переменную знаком +' },
    { code: 'if answer == "Да":', note: 'если ответ равен «Да» — выполняется блок с отступом' },
    { code: '    send("Погнали!")', note: 'эта строка сработает только при ответе «Да»' },
    { code: 'else:', note: 'иначе — во всех остальных случаях' },
    { code: '    send("Ок, в другой раз")', note: 'эта строка сработает, если ответ не «Да»' }
  ],

  tasks: [
    {
      title: 'Поздоровайся',
      text: 'Бот должен отправить в чат сообщение: <b>Привет, как тебя зовут?</b>',
      hint: 'Напиши текст внутри кавычек: <code>send("Привет, как тебя зовут?")</code>',
      starter: 'send("")\n',
      tests: [{ replies: [], expect: ['Привет, как тебя зовут?'] }]
    },
    {
      title: 'Прочитай имя',
      text: 'Считай сообщение пользователя в переменную <code>name</code> и поздоровайся: <b>Привет, &lt;имя&gt;!</b>',
      hint: 'Склей три кусочка: <code>"Привет, " + name + "!"</code>',
      starter: 'name = input()\nsend("")\n',
      tests: [{ replies: ['Петя'], expect: ['Привет, Петя!'] }]
    },
    {
      title: 'Ответь по контексту',
      text: 'Считай имя и предложи: <b>&lt;имя&gt;, давай учиться кодить вместе?</b>',
      hint: 'Начни сообщение с переменной: <code>send(name + ", давай учиться кодить вместе?")</code>',
      starter: 'name = input()\nsend("")\n',
      tests: [{ replies: ['Петя'], expect: ['Петя, давай учиться кодить вместе?'] }]
    },
    {
      title: 'Согласие или отказ',
      text: 'Считай ответ. Если «Да» — отправь <b>Круто! Погнали!</b>, иначе — <b>Жаль! Может позже?</b>',
      hint: 'Внутри if и else у тебя по одному send. Впиши нужный текст в кавычки.',
      starter: 'answer = input()\nif answer == "Да":\n    send("")\nelse:\n    send("")\n',
      tests: [
        { replies: ['Да'], expect: ['Круто! Погнали!'] },
        { replies: ['Нет'], expect: ['Жаль! Может позже?'] }
      ]
    },
    {
      title: 'Два сообщения подряд',
      text: 'Отправь два сообщения: сначала <b>Я бот.</b>, потом <b>Я учусь кодить.</b>',
      hint: 'Просто напиши две команды send подряд — каждая отправит своё сообщение.',
      starter: 'send("")\n',
      tests: [{ replies: [], expect: ['Я бот.', 'Я учусь кодить.'] }]
    },
    {
      title: 'Переменная с текстом',
      text: 'Сохрани в переменную <code>game</code> слово <b>Minecraft</b>. Отправь два сообщения: <b>Я играю в Minecraft</b> и <b>Minecraft — топ!</b>',
      hint: 'Сначала <code>game = "Minecraft"</code>, потом используй переменную внутри send.',
      starter: 'game = ""\nsend("")\nsend("")\n',
      tests: [{ replies: [], expect: ['Я играю в Minecraft', 'Minecraft — топ!'] }]
    },
    {
      title: 'Имя и город',
      text: 'Считай два сообщения: имя и город. Отправь: <b>&lt;имя&gt; из города &lt;город&gt;</b>',
      hint: '<code>send(name + " из города " + city)</code>',
      starter: 'name = input()\ncity = input()\nsend("")\n',
      tests: [{ replies: ['Петя', 'Казань'], expect: ['Петя из города Казань'] }]
    },
    {
      title: 'Три варианта',
      text: 'Считай ответ. «Да» → <b>Огонь!</b>, «Нет» → <b>Ладно</b>, любой другой → <b>Не понял</b>',
      hint: 'Для второго условия используй <code>elif</code>, для остальных случаев — <code>else</code>.',
      starter: 'answer = input()\nif answer == "Да":\n    send("")\nelif answer == "Нет":\n    send("")\nelse:\n    send("")\n',
      tests: [
        { replies: ['Да'], expect: ['Огонь!'] },
        { replies: ['Нет'], expect: ['Ладно'] },
        { replies: ['Может'], expect: ['Не понял'] }
      ]
    },
    {
      title: 'Спроси и познакомься',
      text: 'Сначала отправь <b>Как тебя зовут?</b>, потом считай имя и отправь <b>Привет, &lt;имя&gt;!</b>',
      hint: 'Порядок важен: send → input → send.',
      starter: 'send("")\nname = input()\nsend("")\n',
      tests: [{ replies: ['Петя'], expect: ['Как тебя зовут?', 'Привет, Петя!'] }]
    },
    {
      title: 'Мини-бот',
      text: 'Собери мини-бота:<br>1) спроси «Как тебя зовут?»<br>2) поздоровайся: «Привет, &lt;имя&gt;!»<br>3) предложи: «&lt;имя&gt;, давай учиться кодить вместе?»<br>4) если ответ «Да» → «Погнали!», иначе → «Ок, в другой раз»',
      hint: 'Всего 5 команд: send, input, send, send, input, if/else.',
      starter: '',
      tests: [
        { replies: ['Петя', 'Да'], expect: ['Как тебя зовут?', 'Привет, Петя!', 'Петя, давай учиться кодить вместе?', 'Погнали!'] },
        { replies: ['Аня', 'Нет'], expect: ['Как тебя зовут?', 'Привет, Аня!', 'Аня, давай учиться кодить вместе?', 'Ок, в другой раз'] }
      ]
    }
  ]
},

/* ================= УРОК 2 ================= */
{
  id: 2,
  emoji: '🔀',
  title: 'Условия и числа',
  tagline: 'int, сравнения, and / or',
  color: '#5eead4',
  lib: ['msg', 'var', 'cond', 'math'],

  theory: `
    <h3>Текст ≠ число</h3>
    <p>Всё, что приходит из <code>input()</code>, — это <b>текст</b>. Даже если человек написал «12»,
       для Python это строка «12», а не число 12. Чтобы сравнивать числа, текст надо превратить в число:</p>
    <pre><code>age = int(input())</code></pre>
    <p><code>int()</code> — «сделай из этого целое число».</p>

    <h3>Сравнения</h3>
    <pre><code>age &gt;= 12      # больше или равно
age &lt; 12       # меньше
age == 12      # равно
age != 12      # НЕ равно</code></pre>

    <h3>Логика: and / or / not</h3>
    <pre><code>if age &gt;= 10 and age &lt;= 12:
    send("Тебе самое время учить Python!")</code></pre>
    <p><b>and</b> — «и то, и другое». <b>or</b> — «хотя бы одно». <b>not</b> — «наоборот».</p>

    <h3>elif — несколько вариантов</h3>
    <pre><code>if score &gt;= 90:
    send("Отлично!")
elif score &gt;= 60:
    send("Хорошо!")
else:
    send("Надо потренироваться")</code></pre>

    <h3>Длина строки и поиск внутри</h3>
    <pre><code>len(name)          # сколько букв
"привет" in text   # есть ли слово внутри текста</code></pre>
  `,

  summary: [
    { code: 'age = int(input())', note: 'превращаем текст от пользователя в число' },
    { code: 'if age >= 12:', note: 'сравниваем числа (без int() сравнение работало бы неправильно)' },
    { code: 'if a > 10 and b > 10:', note: 'and — оба условия должны быть верны' },
    { code: 'if x == "Да" or x == "да":', note: 'or — достаточно одного верного условия' },
    { code: 'if word != "нет":', note: '!= — «не равно»' },
    { code: 'elif score >= 60:', note: 'elif проверяется, только если первое условие не сработало' },
    { code: 'if "привет" in text:', note: 'in — проверяет, есть ли кусочек текста внутри строки' },
    { code: 'if len(name) > 5:', note: 'len() возвращает количество символов' }
  ],

  tasks: [
    {
      title: 'Возраст',
      text: 'Считай возраст как число. Если возраст 12 или больше → <b>Ты уже большой!</b>, иначе → <b>Ты ещё маленький!</b>',
      hint: 'Не забудь <code>int()</code> перед input() и знак <code>&gt;=</code>.',
      starter: 'age = int(input())\nif age >= 12:\n    send("")\nelse:\n    send("")\n',
      tests: [{ replies: ['12'], expect: ['Ты уже большой!'] }, { replies: ['9'], expect: ['Ты ещё маленький!'] }]
    },
    {
      title: 'НЕ равно',
      text: 'Считай слово. Если оно НЕ равно «нет» → <b>Продолжаем!</b>, иначе → <b>Стоп.</b>',
      hint: '«Не равно» — это <code>!=</code>.',
      starter: 'word = input()\nif word != "нет":\n    send("")\nelse:\n    send("")\n',
      tests: [{ replies: ['да'], expect: ['Продолжаем!'] }, { replies: ['нет'], expect: ['Стоп.'] }]
    },
    {
      title: 'Оператор and',
      text: 'Считай возраст. Если возраст от 10 до 12 включительно → <b>Тебе самое время учить Python!</b>, иначе → <b>Другой возраст</b>',
      hint: '<code>if age &gt;= 10 and age &lt;= 12:</code>',
      starter: 'age = int(input())\nif age >= 10 and age <= 12:\n    send("")\nelse:\n    send("")\n',
      tests: [{ replies: ['11'], expect: ['Тебе самое время учить Python!'] }, { replies: ['15'], expect: ['Другой возраст'] }]
    },
    {
      title: 'Оператор or',
      text: 'Считай ответ. Если «Да» или «да» → <b>Погнали!</b>, иначе → <b>Не понял</b>',
      hint: '<code>if answer == "Да" or answer == "да":</code>',
      starter: 'answer = input()\nif answer == "Да" or answer == "да":\n    send("")\nelse:\n    send("")\n',
      tests: [
        { replies: ['Да'], expect: ['Погнали!'] },
        { replies: ['да'], expect: ['Погнали!'] },
        { replies: ['нет'], expect: ['Не понял'] }
      ]
    },
    {
      title: 'Длина имени',
      text: 'Считай имя. Если в нём больше 5 букв → <b>Классное длинное имя!</b>, иначе → <b>Короткое, но тоже классное!</b>',
      hint: '<code>if len(name) &gt; 5:</code>',
      starter: 'name = input()\nif len(name) > 5:\n    send("")\nelse:\n    send("")\n',
      tests: [
        { replies: ['Владимир'], expect: ['Классное длинное имя!'] },
        { replies: ['Петя'], expect: ['Короткое, но тоже классное!'] }
      ]
    },
    {
      title: 'Лестница elif',
      text: 'Считай число очков. 90 и больше → <b>Отлично!</b>, 60 и больше → <b>Хорошо!</b>, иначе → <b>Надо потренироваться</b>',
      hint: 'Порядок важен: сначала проверяем самое большое число.',
      starter: 'score = int(input())\nif score >= 90:\n    send("")\nelif score >= 60:\n    send("")\nelse:\n    send("")\n',
      tests: [
        { replies: ['95'], expect: ['Отлично!'] },
        { replies: ['70'], expect: ['Хорошо!'] },
        { replies: ['30'], expect: ['Надо потренироваться'] }
      ]
    },
    {
      title: 'Сумма двух чисел',
      text: 'Считай два числа и отправь их сумму.',
      hint: 'Оба числа получи через <code>int(input())</code>, потом <code>send(a + b)</code>.',
      starter: 'a = int(input())\nb = int(input())\nsend(0)\n',
      tests: [{ replies: ['3', '4'], expect: ['7'] }]
    },
    {
      title: 'Поиск слова',
      text: 'Считай сообщение. Если в нём есть слово «привет» → <b>И тебе привет!</b>, иначе → <b>Не понял</b>',
      hint: '<code>if "привет" in text:</code>',
      starter: 'text = input()\nif "привет" in text:\n    send("")\nelse:\n    send("")\n',
      tests: [
        { replies: ['привет, бот'], expect: ['И тебе привет!'] },
        { replies: ['пока'], expect: ['Не понял'] }
      ]
    },
    {
      title: 'Оба числа большие',
      text: 'Считай два числа. Если оба больше 10 → <b>Оба большие!</b>, иначе → <b>Не оба большие</b>',
      hint: '<code>if a &gt; 10 and b &gt; 10:</code>',
      starter: 'a = int(input())\nb = int(input())\nif a > 10 and b > 10:\n    send("")\nelse:\n    send("")\n',
      tests: [
        { replies: ['12', '15'], expect: ['Оба большие!'] },
        { replies: ['12', '5'], expect: ['Не оба большие'] }
      ]
    },
    {
      title: 'Викторина',
      text: 'Задай вопрос <b>Сколько будет 2+2?</b> и считай ответ. Если 4 → <b>Верно!</b>, иначе → <b>Неверно!</b><br>Потом спроси <b>А сколько будет 5*5?</b>: если 25 → <b>Правильно!</b>, иначе → <b>Неверно!</b>',
      hint: 'Два раза подряд: send → int(input()) → if/else.',
      starter: '',
      tests: [
        { replies: ['4', '25'], expect: ['Сколько будет 2+2?', 'Верно!', 'А сколько будет 5*5?', 'Правильно!'] },
        { replies: ['5', '20'], expect: ['Сколько будет 2+2?', 'Неверно!', 'А сколько будет 5*5?', 'Неверно!'] }
      ]
    }
  ]
},

/* ================= УРОК 3 ================= */
{
  id: 3,
  emoji: '🔁',
  title: 'Циклы',
  tagline: 'for, while и break',
  color: '#ff6bcb',
  lib: ['msg', 'var', 'cond', 'loop', 'math'],

  theory: `
    <h3>Цикл for — повтори N раз</h3>
    <pre><code>for i in range(3):
    send("Я учу Python!")</code></pre>
    <p><code>range(3)</code> даёт числа 0, 1, 2 — итого <b>три</b> повтора.
       Если нужно от 1 до 5, пиши <code>range(1, 6)</code>.</p>

    <h3>Цикл while — повторяй, пока условие верно</h3>
    <pre><code>answer = input()
while answer != "2":
    send("Не угадал, попробуй ещё")
    answer = input()</code></pre>
    <p>Пока условие верно — тело цикла повторяется.</p>

    <h3>break — выйти из цикла</h3>
    <pre><code>while True:
    text = input()
    if text == "стоп":
        break
    send("Ты сказал: " + text)</code></pre>
    <p><code>while True</code> — «повторяй вечно», а <code>break</code> — «хватит, выходим».</p>

    <h3>Счётчик и остаток</h3>
    <pre><code>count = 0
count = count + 1     # увеличить счётчик на 1
i % 2 == 0            # проверка на чётность (остаток от деления)</code></pre>
  `,

  summary: [
    { code: 'for i in range(3):', note: 'повторить блок 3 раза (i = 0, 1, 2)' },
    { code: 'for i in range(1, 6):', note: 'повторить для чисел 1, 2, 3, 4, 5' },
    { code: 'while answer != "2":', note: 'повторять, пока ответ не равен «2»' },
    { code: 'while True:', note: 'бесконечный цикл — выходить будем через break' },
    { code: '    break', note: 'немедленно выйти из цикла' },
    { code: 'count = count + 1', note: 'счётчик: увеличиваем число на 1 на каждом круге' },
    { code: 'if i % 2 == 0:', note: 'остаток от деления: 0 — значит число чётное' }
  ],

  tasks: [
    {
      title: 'Повтори 3 раза',
      text: 'Отправь сообщение <b>Я учу Python!</b> три раза с помощью цикла for.',
      hint: 'Внутри цикла один send — он выполнится три раза.',
      starter: 'for i in range(3):\n    send("")\n',
      tests: [{ replies: [], expect: ['Я учу Python!', 'Я учу Python!', 'Я учу Python!'] }]
    },
    {
      title: 'Числа по порядку',
      text: 'С помощью цикла отправь числа от 1 до 5.',
      hint: '<code>for i in range(1, 6):</code> и внутри <code>send(i)</code>.',
      starter: 'for i in range(1, 6):\n    send(i)\n',
      tests: [{ replies: [], expect: ['1', '2', '3', '4', '5'] }]
    },
    {
      title: 'Счётчик сообщений',
      text: 'Считай сообщения пользователя, пока он не напишет <b>стоп</b>. Потом отправь <b>Сообщений: &lt;n&gt;</b>',
      hint: 'Внутри цикла увеличивай <code>count</code> на 1, а после цикла отправь результат.',
      starter: 'count = 0\nwhile True:\n    text = input()\n    if text == "стоп":\n        break\n    count = count + 1\nsend("")\n',
      tests: [{ replies: ['привет', 'как дела', 'стоп'], expect: ['Сообщений: 2'] }]
    },
    {
      title: 'Угадай число',
      text: 'Отправь <b>Угадай число от 1 до 3</b>. Считай ответ. Пока ответ не «2» — отправляй <b>Не угадал, попробуй ещё</b> и снова считывай. Когда угадает — <b>Ты угадал!</b>',
      hint: 'Внутри while не забудь снова считать ответ, иначе цикл будет вечным.',
      starter: 'send("Угадай число от 1 до 3")\nanswer = input()\nwhile answer != "2":\n    send("")\n    answer = input()\nsend("Ты угадал!")\n',
      tests: [{ replies: ['1', '3', '2'], expect: ['Угадай число от 1 до 3', 'Не угадал, попробуй ещё', 'Не угадал, попробуй ещё', 'Ты угадал!'] }]
    },
    {
      title: 'Только чётные',
      text: 'С помощью цикла for отправь только чётные числа от 1 до 10.',
      hint: 'Добавь внутри цикла проверку <code>if i % 2 == 0:</code> и send с отступом.',
      starter: 'for i in range(1, 11):\n    send(i)\n',
      tests: [{ replies: [], expect: ['2', '4', '6', '8', '10'] }]
    },
    {
      title: 'Стоп-слово',
      text: 'Считывай слова в цикле, пока не встретится слово <b>хватит</b>. Каждое слово повторяй: <b>Ты сказал: &lt;слово&gt;</b>',
      hint: 'Сначала проверка на «хватит» с break, потом send.',
      starter: 'while True:\n    word = input()\n    if word == "хватит":\n        break\n    send("")\n',
      tests: [{ replies: ['привет', 'как дела', 'хватит'], expect: ['Ты сказал: привет', 'Ты сказал: как дела'] }]
    },
    {
      title: 'Склей строку',
      text: 'Считай 3 слова и склей их в одну строку через пробел. Потом отправь эту строку.',
      hint: 'Внутри цикла добавь: <code>result = result + word + " "</code>',
      starter: 'result = ""\nfor i in range(3):\n    word = input()\n\nsend(result)\n',
      tests: [{ replies: ['я', 'люблю', 'python'], expect: ['я люблю python'] }]
    },
    {
      title: 'Меню с циклом',
      text: 'Бот показывает меню: <b>1 - привет</b>, <b>2 - пока</b>. Считай выбор. Если «1» → <b>Привет!</b>, если «2» → <b>Пока!</b> и выход из цикла, иначе → <b>Не понял</b>. Меню повторяется.',
      hint: 'Меню и считывание должны быть внутри while True.',
      starter: 'while True:\n    send("1 - привет")\n    send("2 - пока")\n    choice = input()\n    if choice == "1":\n        send("")\n    elif choice == "2":\n        send("")\n        break\n    else:\n        send("")\n',
      tests: [{ replies: ['1', '2'], expect: ['1 - привет', '2 - пока', 'Привет!', '1 - привет', '2 - пока', 'Пока!'] }]
    },
    {
      title: 'Сумма от 1 до N',
      text: 'Считай число N и отправь сумму всех чисел от 1 до N.',
      hint: 'Внутри цикла: <code>total = total + i</code>',
      starter: 'n = int(input())\ntotal = 0\nfor i in range(1, n + 1):\n\nsend(total)\n',
      tests: [{ replies: ['5'], expect: ['15'] }]
    },
    {
      title: 'Бот-эхо',
      text: 'Три раза считай сообщение и повторяй его. Потом отправь <b>Хватит болтать!</b>',
      hint: 'Цикл for на 3 повтора, внутри input и send. Прощание — после цикла.',
      starter: 'for i in range(3):\n    text = input()\n    send("")\nsend("")\n',
      tests: [{ replies: ['раз', 'два', 'три'], expect: ['раз', 'два', 'три', 'Хватит болтать!'] }]
    }
  ]
},

/* ================= УРОК 4 ================= */
{
  id: 4,
  emoji: '🧩',
  title: 'Функции',
  tagline: 'def, параметры и return',
  color: '#a78bfa',
  lib: ['msg', 'var', 'cond', 'loop', 'func', 'math'],

  theory: `
    <h3>Зачем нужны функции?</h3>
    <p>Функция — это «сохранённый кусочек программы» с именем. Написал один раз — вызываешь сколько хочешь.</p>

    <h3>Создаём функцию — def</h3>
    <pre><code>def hello():
    send("Привет!")

hello()</code></pre>
    <p><code>def</code> — «создай функцию». Всё с отступом — это её тело.
       Пока функцию не <b>вызовешь</b> по имени, она не выполнится.</p>

    <h3>Параметры — функция с данными</h3>
    <pre><code>def greet(name):
    send("Привет, " + name + "!")

greet("Петя")     # отправит: Привет, Петя!</code></pre>
    <p><code>name</code> — это <b>параметр</b>, «дырочка» в функции. При вызове мы кладём в неё значение.</p>

    <h3>return — вернуть результат</h3>
    <pre><code>def double(x):
    return x * 2

send(double(5))   # отправит: 10</code></pre>
    <p><code>send</code> отправляет сообщение наружу, а <code>return</code> <b>возвращает</b> значение
       тому, кто вызвал функцию. Поэтому результат можно положить в переменную или передать в send.</p>

    <h3>Функция с условием</h3>
    <pre><code>def check(answer):
    if answer == "Да":
        return "Погнали!"
    else:
        return "Ладно"</code></pre>
  `,

  summary: [
    { code: 'def hello():', note: 'объявляем функцию с именем hello' },
    { code: '    send("Привет!")', note: 'тело функции — выполнится при вызове' },
    { code: 'hello()', note: 'вызов функции: без скобок она не запустится' },
    { code: 'def greet(name):', note: 'name — параметр, значение подставится при вызове' },
    { code: 'greet("Петя")', note: 'вызываем функцию и передаём ей значение' },
    { code: 'def double(x):', note: 'функция, которая что-то считает' },
    { code: '    return x * 2', note: 'return возвращает результат наружу' },
    { code: 'send(double(5))', note: 'результат функции сразу отправляем в чат' }
  ],

  tasks: [
    {
      title: 'Первая функция',
      text: 'Создай функцию <code>hello()</code>, которая отправляет <b>Привет!</b>, и вызови её.',
      hint: 'Не забудь строку <code>hello()</code> в самом конце без отступа.',
      starter: 'def hello():\n    send("")\n\nhello()\n',
      tests: [{ replies: [], expect: ['Привет!'] }]
    },
    {
      title: 'Функция с параметром',
      text: 'Создай функцию <code>greet(name)</code>, которая отправляет <b>Привет, &lt;name&gt;!</b>. Вызови <code>greet("Петя")</code>.',
      hint: 'Внутри функции используй параметр name так же, как переменную.',
      starter: 'def greet(name):\n    send("")\n\ngreet("Петя")\n',
      tests: [{ replies: [], expect: ['Привет, Петя!'] }]
    },
    {
      title: 'return',
      text: 'Создай функцию <code>make_greeting(name)</code>, которая <b>возвращает</b> строку <b>Привет, &lt;name&gt;!</b>. Отправь результат: <code>send(make_greeting("Аня"))</code>',
      hint: 'Внутри функции: <code>return "Привет, " + name + "!"</code>',
      starter: 'def make_greeting(name):\n    return ""\n\nsend(make_greeting("Аня"))\n',
      tests: [{ replies: [], expect: ['Привет, Аня!'] }]
    },
    {
      title: 'Два параметра',
      text: 'Создай функцию <code>sum_numbers(a, b)</code>, которая возвращает сумму a и b. Отправь <code>sum_numbers(3, 4)</code>.',
      hint: '<code>return a + b</code>',
      starter: 'def sum_numbers(a, b):\n    return 0\n\nsend(sum_numbers(3, 4))\n',
      tests: [{ replies: [], expect: ['7'] }]
    },
    {
      title: 'Функция с условием',
      text: 'Создай функцию <code>check(answer)</code>: если answer равен «Да» — возвращает <b>Погнали!</b>, иначе — <b>Ладно</b>. Считай ответ пользователя и отправь результат функции.',
      hint: 'Сначала input(), потом send(check(answer)).',
      starter: 'def check(answer):\n    if answer == "Да":\n        return ""\n    else:\n        return ""\n\nanswer = input()\nsend(check(answer))\n',
      tests: [{ replies: ['Да'], expect: ['Погнали!'] }, { replies: ['Нет'], expect: ['Ладно'] }]
    },
    {
      title: 'Две функции',
      text: 'Создай две функции: <code>hi()</code> отправляет <b>Привет!</b>, <code>bye()</code> отправляет <b>Пока!</b>. Вызови сначала hi(), потом bye().',
      hint: 'Функции объявляются одна за другой, вызовы — в самом конце.',
      starter: 'def hi():\n    send("")\n\ndef bye():\n    send("")\n\nhi()\nbye()\n',
      tests: [{ replies: [], expect: ['Привет!', 'Пока!'] }]
    },
    {
      title: 'Удвоитель',
      text: 'Создай функцию <code>double(x)</code>, которая возвращает x * 2. Отправь double(5) и double(10).',
      hint: '<code>return x * 2</code>',
      starter: 'def double(x):\n    return 0\n\nsend(double(5))\nsend(double(10))\n',
      tests: [{ replies: [], expect: ['10', '20'] }]
    },
    {
      title: 'Функция с циклом',
      text: 'Создай функцию <code>repeat_message(text, n)</code>, которая отправляет text ровно n раз (используй цикл). Вызови <code>repeat_message("Python", 3)</code>.',
      hint: '<code>for i in range(n): send(text)</code>',
      starter: 'def repeat_message(text, n):\n    for i in range(n):\n        send("")\n\nrepeat_message("Python", 3)\n',
      tests: [{ replies: [], expect: ['Python', 'Python', 'Python'] }]
    },
    {
      title: 'Функция-меню',
      text: 'Создай функцию <code>menu()</code>, которая отправляет <b>1 - привет</b> и <b>2 - пока</b>. Вызови её, считай выбор: «1» → <b>Привет!</b>, иначе → <b>Пока!</b>',
      hint: 'Меню рисует функция, а логика выбора — снаружи.',
      starter: 'def menu():\n    send("")\n    send("")\n\nmenu()\nchoice = input()\nif choice == "1":\n    send("")\nelse:\n    send("")\n',
      tests: [
        { replies: ['1'], expect: ['1 - привет', '2 - пока', 'Привет!'] },
        { replies: ['2'], expect: ['1 - привет', '2 - пока', 'Пока!'] }
      ]
    },
    {
      title: 'Бот с функциями',
      text: 'Собери бота:<br>1) <code>greet(name)</code> возвращает «Привет, &lt;name&gt;!»<br>2) <code>bye(name)</code> возвращает «Пока, &lt;name&gt;!»<br>3) спроси имя, поздоровайся, спроси «Как дела?», если ответ «хорошо» → «Класс!», иначе → «Не грусти!», затем попрощайся.',
      hint: 'Порядок: send → input → send(greet(name)) → send → input → if/else → send(bye(name)).',
      starter: '',
      tests: [
        { replies: ['Петя', 'хорошо'], expect: ['Как тебя зовут?', 'Привет, Петя!', 'Как дела?', 'Класс!', 'Пока, Петя!'] },
        { replies: ['Аня', 'плохо'], expect: ['Как тебя зовут?', 'Привет, Аня!', 'Как дела?', 'Не грусти!', 'Пока, Аня!'] }
      ]
    }
  ]
},

/* ================= УРОК 5 ================= */
{
  id: 5,
  emoji: '🤖',
  title: 'Финальный чат-бот',
  tagline: 'собираем всё вместе',
  color: '#4ade80',
  lib: ['msg', 'var', 'cond', 'loop', 'func', 'math'],

  theory: `
    <h3>Финишная прямая!</h3>
    <p>Теперь у нас есть все инструменты, чтобы собрать настоящего чат-бота для мессенджера.
       Вот его план:</p>
    <pre><code>1. Поздороваться
2. Спросить имя и познакомиться
3. В бесконечном цикле показывать меню
4. Обрабатывать выбор: анекдот / комплимент / выход
5. Попрощаться по имени</code></pre>

    <h3>Скелет бота</h3>
    <pre><code>def show_menu():
    send("1 - анекдот")
    send("2 - комплимент")
    send("3 - выход")

def joke():
    send("Колобок повесился 😄")

def compliment(name):
    send(name + ", ты классный!")

send("Привет! Я бот-помощник 🤖")
send("Как тебя зовут?")
name = input()
send("Приятно познакомиться, " + name + "!")

while True:
    show_menu()
    choice = input()
    if choice == "1":
        joke()
    elif choice == "2":
        compliment(name)
    elif choice == "3":
        send("Пока, " + name + "! Увидимся!")
        break
    else:
        send("Не понял, попробуй ещё")</code></pre>

    <h3>Почему это работает</h3>
    <p>Функции прячут повторяющиеся куски, <code>while True</code> держит бота «в сети»,
       а <code>break</code> аккуратно выключает его, когда пользователь выбрал выход.</p>
  `,

  summary: [
    { code: 'def show_menu():', note: 'функция рисует меню из трёх пунктов' },
    { code: 'def joke():', note: 'функция с анекдотом — её легко заменить на другую шутку' },
    { code: 'def compliment(name):', note: 'функция принимает имя и делает персональный комплимент' },
    { code: 'name = input()', note: 'знакомство: запоминаем имя на всю программу' },
    { code: 'while True:', note: 'бот работает, пока пользователь не выберет выход' },
    { code: '    show_menu()', note: 'на каждом круге показываем меню заново' },
    { code: '    choice = input()', note: 'ждём выбор пользователя' },
    { code: '    if choice == "1": joke()', note: 'пункт 1 — вызываем функцию с анекдотом' },
    { code: '    elif choice == "3":', note: 'пункт 3 — прощаемся' },
    { code: '        break', note: 'выходим из цикла — бот завершает работу' },
    { code: '        send("Пока, " + name + "!")', note: 'прощание с именем пользователя' }
  ],

  tasks: [
    {
      title: 'Приветствие бота',
      text: 'Финальный бот начинается так: отправь <b>Привет! Я бот-помощник 🤖</b> и <b>Как тебя зовут?</b>',
      hint: 'Два send подряд.',
      starter: 'send("")\nsend("")\n',
      tests: [{ replies: [], expect: ['Привет! Я бот-помощник 🤖', 'Как тебя зовут?'] }]
    },
    {
      title: 'Знакомство',
      text: 'Считай имя и отправь <b>Приятно познакомиться, &lt;имя&gt;!</b>',
      hint: 'Склей текст и переменную через +.',
      starter: 'send("Привет! Я бот-помощник 🤖")\nsend("Как тебя зовут?")\nname = input()\nsend("")\n',
      tests: [{ replies: ['Петя'], expect: L5_START }]
    },
    {
      title: 'Меню-функция',
      text: 'Создай функцию <code>show_menu()</code>, которая отправляет три строки: <b>1 - анекдот</b>, <b>2 - комплимент</b>, <b>3 - выход</b>. Вызови её после знакомства.',
      hint: 'Объяви функцию можно в любом месте, главное — вызвать: <code>show_menu()</code>.',
      starter: 'send("Привет! Я бот-помощник 🤖")\nsend("Как тебя зовут?")\nname = input()\nsend("Приятно познакомиться, " + name + "!")\n\ndef show_menu():\n    send("")\n    send("")\n    send("")\n\nshow_menu()\n',
      tests: [{ replies: ['Петя'], expect: L5_START.concat(L5_MENU) }]
    },
    {
      title: 'Обработка выбора',
      text: 'Считай выбор. Если «1» → <b>Колобок повесился 😄</b>. Если «3» → <b>Пока!</b>',
      hint: 'Добавь в конец: choice = input() и if/elif.',
      starter: 'send("Привет! Я бот-помощник 🤖")\nsend("Как тебя зовут?")\nname = input()\nsend("Приятно познакомиться, " + name + "!")\n\ndef show_menu():\n    send("1 - анекдот")\n    send("2 - комплимент")\n    send("3 - выход")\n\nshow_menu()\nchoice = input()\nif choice == "1":\n    send("")\nelif choice == "3":\n    send("")\n',
      tests: [
        { replies: ['Петя', '1'], expect: L5_START.concat(L5_MENU).concat(['Колобок повесился 😄']) },
        { replies: ['Петя', '3'], expect: L5_START.concat(L5_MENU).concat(['Пока!']) }
      ]
    },
    {
      title: 'Комплимент по имени',
      text: 'Если выбран пункт «2» → <b>&lt;имя&gt;, ты классный!</b>',
      hint: 'Добавь ветку <code>elif choice == "2":</code>',
      starter: 'send("Привет! Я бот-помощник 🤖")\nsend("Как тебя зовут?")\nname = input()\nsend("Приятно познакомиться, " + name + "!")\n\ndef show_menu():\n    send("1 - анекдот")\n    send("2 - комплимент")\n    send("3 - выход")\n\nshow_menu()\nchoice = input()\nif choice == "1":\n    send("Колобок повесился 😄")\nelif choice == "2":\n    send("")\nelif choice == "3":\n    send("Пока!")\n',
      tests: [{ replies: ['Петя', '2'], expect: L5_START.concat(L5_MENU).concat(['Петя, ты классный!']) }]
    },
    {
      title: 'Обработка ошибки',
      text: 'Если выбран неизвестный пункт → <b>Не понял, попробуй ещё</b>',
      hint: 'Это ветка <code>else:</code> в конце цепочки if/elif.',
      starter: 'send("Привет! Я бот-помощник 🤖")\nsend("Как тебя зовут?")\nname = input()\nsend("Приятно познакомиться, " + name + "!")\n\ndef show_menu():\n    send("1 - анекдот")\n    send("2 - комплимент")\n    send("3 - выход")\n\nshow_menu()\nchoice = input()\nif choice == "1":\n    send("Колобок повесился 😄")\nelif choice == "2":\n    send(name + ", ты классный!")\nelif choice == "3":\n    send("Пока!")\nelse:\n    send("")\n',
      tests: [{ replies: ['Петя', '7'], expect: L5_START.concat(L5_MENU).concat(['Не понял, попробуй ещё']) }]
    },
    {
      title: 'Бесконечный цикл',
      text: 'Пусть меню повторяется, пока не выбран пункт «3». Оберни меню и обработку выбора в <code>while True:</code>',
      hint: 'Не забудь <code>break</code> после прощания, иначе бот не выключится.',
      starter: 'send("Привет! Я бот-помощник 🤖")\nsend("Как тебя зовут?")\nname = input()\nsend("Приятно познакомиться, " + name + "!")\n\ndef show_menu():\n    send("1 - анекдот")\n    send("2 - комплимент")\n    send("3 - выход")\n\nwhile True:\n    show_menu()\n    choice = input()\n    if choice == "1":\n        send("Колобок повесился 😄")\n    elif choice == "2":\n        send(name + ", ты классный!")\n    elif choice == "3":\n        send("Пока!")\n        break\n    else:\n        send("Не понял, попробуй ещё")\n',
      tests: [
        { replies: ['Петя', '3'], expect: L5_START.concat(L5_MENU).concat(['Пока!']) },
        { replies: ['Петя', '1', '2', '3'],
          expect: L5_START
            .concat(L5_MENU, ['Колобок повесился 😄'])
            .concat(L5_MENU, ['Петя, ты классный!'])
            .concat(L5_MENU, ['Пока!']) }
      ]
    },
    {
      title: 'Функции joke() и compliment()',
      text: 'Вынеси анекдот в функцию <code>joke()</code>, а комплимент — в функцию <code>compliment(name)</code>. Вызывай их вместо send.',
      hint: 'Внутри функции compliment используй параметр name, а не внешнюю переменную.',
      starter: 'send("Привет! Я бот-помощник 🤖")\nsend("Как тебя зовут?")\nname = input()\nsend("Приятно познакомиться, " + name + "!")\n\ndef show_menu():\n    send("1 - анекдот")\n    send("2 - комплимент")\n    send("3 - выход")\n\ndef joke():\n    send("Колобок повесился 😄")\n\ndef compliment(who):\n    send(who + ", ты классный!")\n\nwhile True:\n    show_menu()\n    choice = input()\n    if choice == "1":\n        joke()\n    elif choice == "2":\n        compliment(name)\n    elif choice == "3":\n        send("Пока!")\n        break\n    else:\n        send("Не понял, попробуй ещё")\n',
      tests: [
        { replies: ['Петя', '1', '2', '3'],
          expect: L5_START
            .concat(L5_MENU, ['Колобок повесился 😄'])
            .concat(L5_MENU, ['Петя, ты классный!'])
            .concat(L5_MENU, ['Пока!']) }
      ]
    },
    {
      title: 'Прощание по имени',
      text: 'Замени прощание на <b>Пока, &lt;имя&gt;! Увидимся!</b>',
      hint: 'Одна строчка внутри elif choice == "3".',
      starter: 'send("Привет! Я бот-помощник 🤖")\nsend("Как тебя зовут?")\nname = input()\nsend("Приятно познакомиться, " + name + "!")\n\ndef show_menu():\n    send("1 - анекдот")\n    send("2 - комплимент")\n    send("3 - выход")\n\ndef joke():\n    send("Колобок повесился 😄")\n\ndef compliment(who):\n    send(who + ", ты классный!")\n\nwhile True:\n    show_menu()\n    choice = input()\n    if choice == "1":\n        joke()\n    elif choice == "2":\n        compliment(name)\n    elif choice == "3":\n        send("Пока!")\n        break\n    else:\n        send("Не понял, попробуй ещё")\n',
      tests: [
        { replies: ['Петя', '3'], expect: L5_START.concat(L5_MENU).concat(['Пока, Петя! Увидимся!']) }
      ]
    },
    {
      title: 'ФИНАЛЬНЫЙ БОТ',
      text: 'Собери всё вместе! Бот должен:<br>• поздороваться и познакомиться<br>• показывать меню в цикле<br>• на «1» рассказать анекдот, на «2» — комплимент по имени, на «3» — попрощаться по имени и выйти<br>• на любой другой выбор — «Не понял, попробуй ещё»',
      hint: 'Проверь, что все функции вызываются, а break стоит только в ветке выхода.',
      starter: 'send("Привет! Я бот-помощник 🤖")\nsend("Как тебя зовут?")\nname = input()\nsend("Приятно познакомиться, " + name + "!")\n\ndef show_menu():\n    send("1 - анекдот")\n    send("2 - комплимент")\n    send("3 - выход")\n\ndef joke():\n    send("Колобок повесился 😄")\n\ndef compliment(who):\n    send(who + ", ты классный!")\n\nwhile True:\n    show_menu()\n    choice = input()\n    if choice == "1":\n        joke()\n    elif choice == "2":\n        compliment(name)\n    elif choice == "3":\n        send("Пока, " + name + "! Увидимся!")\n        break\n    else:\n        send("Не понял, попробуй ещё")\n',
      tests: [
        { replies: ['Петя', '1', '2', '5', '3'],
          expect: L5_START
            .concat(L5_MENU, ['Колобок повесился 😄'])
            .concat(L5_MENU, ['Петя, ты классный!'])
            .concat(L5_MENU, ['Не понял, попробуй ещё'])
            .concat(L5_MENU, ['Пока, Петя! Увидимся!']) }
      ]
    }
  ]
}

];