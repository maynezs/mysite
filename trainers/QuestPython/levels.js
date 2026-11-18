/* ============================================================
   levels.js — контент тренажёра: модули, теория, уровни
   ============================================================ */

const SAVE_KEY = 'pythonquest_v1';

const MODULES = [
/* ================= МОДУЛЬ 1 ================= */
{
  icon:'💬', title:'Печать и строки',
  desc:'Учимся выводить текст на экран и говорить',
  theory:`
    <h3>Что такое print()</h3>
    <p><code>print()</code> — команда, которая выводит на экран то, что ты в неё положишь.</p>
    <pre><code>print("Привет, мир!")</code></pre>
    <p>Текст в кавычках называется <b>строкой</b>. Кавычки бывают двойные <code>"..."</code> и одинарные <code>'...'</code>.</p>
    <div class="note">Не забудь закрыть скобку <code>)</code> — иначе Python расстроится!</div>
    <h3>Числа</h3>
    <pre><code>print(42)</code></pre>
    <p>Числа пишутся без кавычек. Числа можно складывать прямо внутри print:</p>
    <pre><code>print(2 + 2)</code></pre>
    <h3>Несколько значений</h3>
    <pre><code>print("Мне", 11, "лет")</code></pre>
    <p>Python сам поставит пробелы между значениями.</p>
    <h3>Команда say()</h3>
    <p><code>say()</code> — как print, только герой говорит это вслух, пузырём над головой.</p>
    <pre><code>say("Ура!")</code></pre>
  `,
  cmds:[
    {code:'print("Привет!")', desc:'вывести текст'},
    {code:'print(42)', desc:'вывести число'},
    {code:'print(2 + 2)', desc:'вывести результат'},
    {code:'say("Ура!")', desc:'сказать вслух'},
  ],
  levels:[
    {title:'Привет, мир!', size:6, hero:{x:2,y:5,d:'up'},
     task:'Напиши <code>print("Привет!")</code> и запусти программу.',
     win:{prints:['Привет!']}, sol:'print("Привет!")',
     hint:'Напиши: print("Привет!") — не забудь кавычки и скобки.'},

    {title:'Две строки', size:6, hero:{x:2,y:5,d:'up'},
     task:'Выведи две строки: <b>Раз</b> и <b>Два</b> — каждую с новой строки.',
     win:{prints:['Раз','Два']}, sol:'print("Раз")\nprint("Два")',
     hint:'Нужны две команды print, каждая на своей строке.'},

    {title:'Числа', size:6, hero:{x:2,y:5,d:'up'},
     task:'Выведи число <b>42</b>. У чисел кавычки не нужны!',
     win:{prints:['42']}, sol:'print(42)',
     hint:'print(42) — без кавычек.'},

    {title:'Мне N лет', size:6, hero:{x:2,y:5,d:'up'},
     task:'Выведи через запятую: <b>Мне</b>, число <b>12</b> и слово <b>лет</b>. Должно получиться «Мне 12 лет».',
     win:{prints:['Мне 12 лет']}, sol:'print("Мне", 12, "лет")',
     hint:'print("Мне", 12, "лет") — значения через запятую.'},

    {title:'Скажи вслух', size:6, hero:{x:2,y:5,d:'up'}, npcs:[{x:4,y:4,e:'🐸'}],
     task:'Пусть герой скажет вслух: <b>Ура!</b> Используй <code>say()</code>.',
     win:{says:['Ура!']}, sol:'say("Ура!")',
     hint:'say("Ура!")'},

    {title:'Одинарные кавычки', size:6, hero:{x:2,y:5,d:'up'},
     task:'Выведи <b>Python — это круто</b>, используя одинарные кавычки.',
     win:{prints:['Python — это круто']}, sol:"print('Python — это круто')",
     hint:"print('Python — это круто')"},

    {title:'Три раза', size:6, hero:{x:2,y:5,d:'up'},
     task:'Выведи слово <b>Python</b> три раза — тремя строками.',
     win:{prints:['Python','Python','Python']}, sol:'print("Python")\nprint("Python")\nprint("Python")',
     hint:'Три команды print подряд.'},

    {title:'Математика', size:6, hero:{x:2,y:5,d:'up'},
     task:'Выведи результат выражения <b>2 + 2</b> (Python сам посчитает).',
     win:{prints:['4']}, sol:'print(2 + 2)',
     hint:'print(2 + 2)'},

    {title:'Кот и пёс', size:6, hero:{x:2,y:5,d:'up'},
     task:'Выведи «Кот и пёс» — три слова через запятую в одном print.',
     win:{prints:['Кот и пёс']}, sol:'print("Кот", "и", "пёс")',
     hint:'print("Кот", "и", "пёс")'},

    {title:'Диалог', size:6, hero:{x:2,y:5,d:'up'}, npcs:[{x:4,y:5,e:'🐸'}],
     task:'Скажи вслух <b>Привет!</b> и выведи <b>Как дела?</b>',
     win:{says:['Привет!'], prints:['Как дела?']},
     sol:'say("Привет!")\nprint("Как дела?")',
     hint:'Две команды: say("Привет!") и print("Как дела?")'},
  ]
},

/* ================= МОДУЛЬ 2 ================= */
{
  icon:'🏃', title:'Движение героя',
  desc:'Команды шага и поворота',
  theory:`
    <h3>Герой и направление</h3>
    <p>Герой всегда смотрит в одну из четырёх сторон: вверх, вправо, вниз или влево. Маленькая стрелка показывает, куда он смотрит.</p>
    <h3>Три команды</h3>
    <pre><code>move_forward()   # шаг вперёд
turn_left()      # повернуть налево
turn_right()     # повернуть направо</code></pre>
    <p><b>move_forward()</b> делает ровно один шаг в ту сторону, куда смотрит герой.</p>
    <p><b>turn_left()</b> и <b>turn_right()</b> поворачивают героя на месте — он не двигается с клетки.</p>
    <div class="note">Поворот на 180° — это два поворота в одну сторону: turn_left() два раза.</div>
    <h3>Звёзды и финиш</h3>
    <p>⭐ Звёзды собираются автоматически, когда герой наступает на клетку. 🏁 Флаг — это финиш.</p>
    <p>Если герой упрётся в стену — программа остановится с ошибкой. Это нормально, просто поверни!</p>
  `,
  cmds:[
    {code:'move_forward()', desc:'шаг вперёд'},
    {code:'turn_left()', desc:'повернуть налево'},
    {code:'turn_right()', desc:'повернуть направо'},
  ],
  levels:[
    {title:'Прямая дорога', hero:{x:1,y:6,d:'up'}, goals:[[1,2]],
     task:'Герой смотрит вверх. Проведи его к флагу — сделай <b>4 шага</b> вперёд.',
     sol:'move_forward()\nmove_forward()\nmove_forward()\nmove_forward()',
     hint:'Вызови move_forward() четыре раза.'},

    {title:'Поворот направо', hero:{x:1,y:6,d:'up'}, goals:[[5,6]],
     task:'Флаг справа. Сначала <b>поверни направо</b>, потом иди 4 шага.',
     sol:'turn_right()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()',
     hint:'turn_right() повернёт героя вправо. Затем 4 раза move_forward().'},

    {title:'Вниз по дороге', hero:{x:6,y:1,d:'right'}, goals:[[6,5]],
     task:'Флаг внизу. Поверни героя вниз и дойди до флага.',
     sol:'turn_right()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()',
     hint:'Из «вправо» поворот направо даёт «вниз». Потом 4 шага.'},

    {title:'Буква Г', hero:{x:1,y:1,d:'down'}, goals:[[5,5]],
     task:'Иди вниз 4 шага, поверни налево и иди ещё 4 шага.',
     sol:'move_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nturn_left()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()',
     hint:'Сначала 4× move_forward(), затем turn_left(), затем ещё 4× move_forward().'},

    {title:'Собери звёзды', hero:{x:0,y:7,d:'right'}, goals:[[7,7]], stars:[[2,7],[4,7],[6,7]],
     task:'Пройди вправо до флага и собери все <b>3 звезды</b>.',
     sol:'move_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()',
     hint:'От x=0 до x=7 ровно 7 шагов.'},

    {title:'Разворот', hero:{x:3,y:4,d:'up'}, goals:[[3,7]],
     task:'Флаг позади героя. Развернись (два поворота) и иди вниз 3 шага.',
     sol:'turn_right()\nturn_right()\nmove_forward()\nmove_forward()\nmove_forward()',
     hint:'Два turn_right() подряд развернут героя вниз.'},

    {title:'Зигзаг', hero:{x:1,y:6,d:'up'}, goals:[[6,1]], walls:[[3,3],[4,3],[3,4],[4,4]],
     task:'Иди вверх 5 шагов, затем поверни направо и иди 5 шагов.',
     sol:'move_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nturn_right()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()',
     hint:'5 шагов вверх → turn_right() → 5 шагов вправо.'},

    {title:'Лабиринт', hero:{x:0,y:0,d:'down'}, goals:[[7,7]], walls:[[3,0],[3,1],[3,2],[3,3],[3,4],[3,5]],
     task:'Спустись по левой стене вниз (7 шагов), поверни налево и иди вправо 7 шагов.',
     sol:'move_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nturn_left()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()',
     hint:'Вниз до упора, потом налево (это будет «вправо») и до флага.'},

    {title:'Три поворота', hero:{x:1,y:1,d:'down'}, goals:[[6,1]], walls:[[3,1],[3,2],[3,3]],
     task:'Пройди: вниз 4, налево (→вправо) 5, налево (→вверх) 4.',
     sol:'move_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nturn_left()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nturn_left()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()',
     hint:'1) 4 шага вниз 2) turn_left() 3) 5 шагов 4) turn_left() 5) 4 шага вверх.'},

    {title:'Большой поход', hero:{x:0,y:7,d:'up'}, goals:[[7,0]], stars:[[0,3],[4,0]], walls:[[2,5],[2,4],[2,3],[5,2],[5,3],[5,4]],
     task:'Дойди до флага в правом верхнем углу и собери <b>2 звезды</b>.',
     sol:'move_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nturn_right()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()\nmove_forward()',
     hint:'Вверх 7 шагов, затем поворот направо и ещё 7 шагов.'},
  ]
},

/* ================= МОДУЛЬ 3 ================= */
{
  icon:'🔁', title:'Циклы for',
  desc:'Повторяем команды без лишней писанины',
  theory:`
    <h3>Зачем цикл</h3>
    <p>Писать 20 раз <code>move_forward()</code> скучно. Цикл <b>for</b> повторяет команды несколько раз.</p>
    <pre><code>for i in range(4):
    move_forward()</code></pre>
    <p><code>range(4)</code> даёт числа 0, 1, 2, 3 — то есть тело цикла выполнится <b>4 раза</b>.</p>
    <div class="note">После строки с <code>:</code> обязательно нужен <b>отступ</b> (4 пробела). Всё, что с отступом, повторяется.</div>
    <h3>Два аргумента</h3>
    <pre><code>for i in range(2, 6):
    move_forward()</code></pre>
    <p>От 2 до 6, не включая 6 → числа 2, 3, 4, 5 → 4 повторения.</p>
    <h3>Шаг</h3>
    <pre><code>for i in range(0, 7, 2):   # 0, 2, 4, 6 → 4 раза</code></pre>
    <h3>Переменная i</h3>
    <p><code>i</code> — счётчик, его можно использовать внутри цикла: <code>print(i)</code>.</p>
  `,
  cmds:[
    {code:'for i in range(3):\n    move_forward()', desc:'повторить 3 раза'},
    {code:'for i in range(2, 6):\n    move_forward()', desc:'повторить от 2 до 6'},
    {code:'print(i)', desc:'вывести счётчик'},
    {code:'move_forward()', desc:'шаг вперёд'},
    {code:'turn_left()', desc:'повернуть налево'},
    {code:'turn_right()', desc:'повернуть направо'},
  ],
  levels:[
    {title:'Первый цикл', hero:{x:1,y:6,d:'up'}, goals:[[1,2]],
     task:'Сделай 4 шага вперёд, но используй <b>цикл for</b> и range(4).',
     sol:'for i in range(4):\n    move_forward()',
     hint:'for i in range(4): и с отступом move_forward()'},

    {title:'Семь шагов', hero:{x:0,y:7,d:'right'}, goals:[[7,7]],
     task:'Пройди 7 шагов вправо с помощью цикла.',
     sol:'for i in range(7):\n    move_forward()',
     hint:'range(7) даст 7 повторений.'},

    {title:'Вниз', hero:{x:2,y:2,d:'down'}, goals:[[2,7]],
     task:'Проведи героя вниз 5 шагов циклом.',
     sol:'for i in range(5):\n    move_forward()',
     hint:'range(5).'},

    {title:'Два цикла', hero:{x:1,y:1,d:'down'}, goals:[[5,5]],
     task:'Спустись на 4 шага циклом, поверни налево, пройди ещё 4 шага циклом.',
     sol:'for i in range(4):\n    move_forward()\nturn_left()\nfor i in range(4):\n    move_forward()',
     hint:'Первый цикл — вниз, turn_left(), второй цикл — вправо.'},

    {title:'Цикл с поворотом', hero:{x:1,y:6,d:'up'}, goals:[[4,3]],
     task:'Иди вверх 3 шага, поверни направо, иди вправо 3 шага. Используй циклы.',
     sol:'for i in range(3):\n    move_forward()\nturn_right()\nfor i in range(3):\n    move_forward()',
     hint:'Два цикла по 3 и один turn_right() между ними.'},

    {title:'Дорожка из звёзд', hero:{x:0,y:4,d:'right'}, goals:[[6,4]], stars:[[2,4],[3,4],[4,4],[5,4]],
     task:'Собери все звёзды и дойди до флага — циклом на 6 шагов.',
     sol:'for i in range(6):\n    move_forward()',
     hint:'range(6).'},

    {title:'Range с двумя числами', hero:{x:3,y:7,d:'up'}, goals:[[3,3]],
     task:'Используй <code>range(2, 6)</code> — это тоже 4 повторения.',
     sol:'for i in range(2, 6):\n    move_forward()',
     hint:'for i in range(2, 6):'},

    {title:'Шаг 2', hero:{x:0,y:0,d:'right'}, goals:[[4,0]],
     task:'Используй <code>range(0, 7, 2)</code> — цикл выполнится 4 раза.',
     sol:'for i in range(0, 7, 2):\n    move_forward()',
     hint:'range(0, 7, 2) — числа 0,2,4,6.'},

    {title:'Уголок', hero:{x:1,y:6,d:'up'}, goals:[[6,1]],
     task:'Пройди вверх 5 шагов, поверни направо и пройди 5 шагов вправо.',
     sol:'for i in range(5):\n    move_forward()\nturn_right()\nfor i in range(5):\n    move_forward()',
     hint:'Два цикла по range(5).'},

    {title:'Длинный маршрут', hero:{x:0,y:7,d:'up'}, goals:[[7,0]],
     task:'Дойди до флага: вверх 7 шагов, поворот направо, вправо 7 шагов.',
     sol:'for i in range(7):\n    move_forward()\nturn_right()\nfor i in range(7):\n    move_forward()',
     hint:'range(7) два раза, между ними turn_right().'},
  ]
},

/* ================= МОДУЛЬ 4 ================= */
{
  icon:'📦', title:'Переменные и числа',
  desc:'Храним значения и считаем',
  theory:`
    <h3>Переменная — это коробка</h3>
    <pre><code>x = 5</code></pre>
    <p>Мы положили число 5 в коробку с именем <code>x</code>. Теперь <code>x</code> можно использовать.</p>
    <pre><code>print(x)      # 5
print(x + 2)  # 7</code></pre>
    <h3>Изменение</h3>
    <pre><code>x = 1
x = x + 1
x = x + 1
print(x)      # 3</code></pre>
    <p>Справа считается новое значение, потом кладётся обратно в <code>x</code>.</p>
    <h3>Переменная в цикле</h3>
    <pre><code>n = 4
for i in range(n):
    move_forward()</code></pre>
    <h3>Операции</h3>
    <ul>
      <li><code>+</code> сложение, <code>-</code> вычитание</li>
      <li><code>*</code> умножение, <code>/</code> деление</li>
    </ul>
  `,
  cmds:[
    {code:'x = 5', desc:'создать переменную'},
    {code:'print(x)', desc:'вывести переменную'},
    {code:'x = x + 1', desc:'увеличить на 1'},
    {code:'for i in range(n):\n    move_forward()', desc:'цикл по переменной'},
    {code:'move_forward()', desc:'шаг вперёд'},
  ],
  levels:[
    {title:'Коробка с числом', hero:{x:2,y:5,d:'up'},
     task:'Создай переменную <code>x = 5</code> и выведи её.',
     win:{prints:['5']}, sol:'x = 5\nprint(x)',
     hint:'x = 5, затем print(x).'},

    {title:'Сложение', hero:{x:2,y:5,d:'up'},
     task:'Создай <code>x = 3</code> и выведи <code>x + 2</code>.',
     win:{prints:['5']}, sol:'x = 3\nprint(x + 2)',
     hint:'print(x + 2) посчитает 3+2.'},

    {title:'Цикл по переменной', hero:{x:1,y:6,d:'up'}, goals:[[1,2]],
     task:'Создай <code>n = 4</code> и пройди 4 шага циклом <code>range(n)</code>.',
     sol:'n = 4\nfor i in range(n):\n    move_forward()',
     hint:'range(n) — то же, что range(4).'},

    {title:'Две переменные', hero:{x:2,y:5,d:'up'},
     task:'Создай <code>a = 10</code> и <code>b = 20</code>, выведи их сумму.',
     win:{prints:['30']}, sol:'a = 10\nb = 20\nprint(a + b)',
     hint:'print(a + b).'},

    {title:'Счётчик', hero:{x:2,y:5,d:'up'},
     task:'Начни с <code>x = 1</code>, дважды сделай <code>x = x + 1</code> и выведи x.',
     win:{prints:['3']}, sol:'x = 1\nx = x + 1\nx = x + 1\nprint(x)',
     hint:'1 → 2 → 3.'},

    {title:'Умножение', hero:{x:2,y:5,d:'up'},
     task:'<code>x = 2</code>, потом <code>x = x * 5</code>, выведи x.',
     win:{prints:['10']}, sol:'x = 2\nx = x * 5\nprint(x)',
     hint:'2 * 5 = 10.'},

    {title:'Посчитай звёзды', hero:{x:0,y:4,d:'right'}, goals:[[5,4]], stars:[[2,4],[3,4],[4,4]],
     task:'Пройди 5 шагов и выведи, сколько звёзд собрано (команда <code>stars_collected()</code>).',
     win:{prints:['3']}, sol:'for i in range(5):\n    move_forward()\nprint(stars_collected())',
     hint:'print(stars_collected()) после цикла.'},

    {title:'Вычитание', hero:{x:2,y:5,d:'up'},
     task:'<code>a = 7</code>, <code>b = 3</code>, выведи <code>a - b</code>.',
     win:{prints:['4']}, sol:'a = 7\nb = 3\nprint(a - b)',
     hint:'print(a - b).'},

    {title:'Переменная-маршрут', hero:{x:2,y:7,d:'up'}, goals:[[2,2]],
     task:'<code>n = 5</code>, пройди <code>range(n)</code> шагов.',
     sol:'n = 5\nfor i in range(n):\n    move_forward()',
     hint:'5 шагов вверх.'},

    {title:'Квадрат', hero:{x:0,y:0,d:'right'}, goals:[[3,0]],
     task:'<code>n = 3</code>, выведи <code>n * n</code>, потом пройди <code>range(n)</code> шагов вправо.',
     win:{prints:['9']}, sol:'n = 3\nprint(n * n)\nfor i in range(n):\n    move_forward()',
     hint:'print(n * n) даст 9, потом цикл на 3 шага.'},
  ]
},

/* ================= МОДУЛЬ 5 ================= */
{
  icon:'🤔', title:'Условия if / else',
  desc:'Программа принимает решения',
  theory:`
    <h3>Если... то...</h3>
    <pre><code>if can_move():
    move_forward()</code></pre>
    <p><b>can_move()</b> возвращает True, если впереди нет стены и не край поля.</p>
    <h3>Иначе</h3>
    <pre><code>if can_move():
    move_forward()
else:
    turn_right()</code></pre>
    <h3>Сравнения</h3>
    <ul>
      <li><code>==</code> равно (два знака!)</li>
      <li><code>!=</code> не равно</li>
      <li><code>&lt;</code> <code>&gt;</code> <code>&lt;=</code> <code>&gt;=</code></li>
    </ul>
    <pre><code>if stars_collected() == 3:
    print("Все звёзды!")</code></pre>
    <h3>Логика</h3>
    <ul>
      <li><code>and</code> — и то, и другое</li>
      <li><code>or</code> — хотя бы одно</li>
      <li><code>not</code> — наоборот</li>
    </ul>
    <h3>Полезные проверки</h3>
    <p><code>at_goal()</code> — герой на флаге?<br><code>can_move()</code> — можно идти вперёд?</p>
  `,
  cmds:[
    {code:'if can_move():\n    move_forward()', desc:'если можно — шаг'},
    {code:'else:\n    turn_right()', desc:'иначе — поворот'},
    {code:'if at_goal():\n    print("Ура!")', desc:'проверить финиш'},
    {code:'move_forward()', desc:'шаг'},
    {code:'turn_left()', desc:'налево'},
    {code:'turn_right()', desc:'направо'},
  ],
  levels:[
    {title:'Можно идти', hero:{x:2,y:6,d:'up'}, goals:[[2,5]],
     task:'Проверь <code>can_move()</code> и, если можно, сделай шаг.',
     sol:'if can_move():\n    move_forward()',
     hint:'if can_move(): и с отступом move_forward().'},

    {title:'Иначе повернись', hero:{x:2,y:1,d:'up'}, goals:[[2,5]],
     task:'Впереди стена. Если идти нельзя — поверни направо, иначе шагни.',
     sol:'if can_move():\n    move_forward()\nelse:\n    turn_right()',
     hint:'Используй else: turn_right().'},

    {title:'Проверка финиша', hero:{x:3,y:3,d:'up'}, goals:[[3,3]],
     task:'Герой уже на флаге. Проверь <code>at_goal()</code> и выведи <b>Ура!</b>',
     win:{prints:['Ура!']}, sol:'if at_goal():\n    print("Ура!")',
     hint:'if at_goal(): print("Ура!")'},

    {title:'Три шага с проверкой', hero:{x:1,y:6,d:'up'}, goals:[[1,3]],
     task:'В цикле на 3 повторения делай шаг только если <code>can_move()</code>.',
     sol:'for i in range(3):\n    if can_move():\n        move_forward()',
     hint:'Цикл, внутри if can_move(): move_forward() (двойной отступ).'},

    {title:'Сравнение чисел', hero:{x:2,y:5,d:'up'},
     task:'<code>x = 5</code>. Если x больше 3 — выведи <b>больше</b>.',
     win:{prints:['больше']}, sol:'x = 5\nif x > 3:\n    print("больше")',
     hint:'if x > 3: print("больше")'},

    {title:'Звёзды == 2', hero:{x:0,y:4,d:'right'}, goals:[[5,4]], stars:[[2,4],[3,4]],
     task:'Пройди 5 шагов, потом если собрано ровно 2 звезды — выведи <b>Собрал!</b>',
     win:{prints:['Собрал!']},
     sol:'for i in range(5):\n    move_forward()\nif stars_collected() == 2:\n    print("Собрал!")',
     hint:'if stars_collected() == 2: print("Собрал!")'},

    {title:'Вложенное условие', hero:{x:1,y:6,d:'up'}, goals:[[1,1]],
     task:'Пока можно идти — шагай. Внутри цикла на 4 повторения проверяй can_move().',
     sol:'for i in range(5):\n    if can_move():\n        move_forward()',
     hint:'Внешний for range(5), внутри if can_move(): move_forward().'},

    {title:'И / ИЛИ', hero:{x:2,y:6,d:'up'}, goals:[[2,4]],
     task:'Если можно идти И не на финише — сделай 2 шага циклом с проверкой.',
     sol:'for i in range(2):\n    if can_move() and not at_goal():\n        move_forward()',
     hint:'if can_move() and not at_goal(): move_forward()'},

    {title:'Поворот у стены', hero:{x:0,y:0,d:'right'}, goals:[[7,0]],
     task:'Иди вперёд 7 раз, и если впереди стена — поверни направо. (Стен нет, но проверка нужна.)',
     sol:'for i in range(7):\n    if can_move():\n        move_forward()\n    else:\n        turn_right()',
     hint:'Внутри цикла if/else.'},

    {title:'Умный поход', hero:{x:0,y:7,d:'up'}, goals:[[7,0]], stars:[[0,3],[4,0]],
     task:'Дойди до флага. В цикле на 7 шагов проверяй can_move(), иначе поворачивай направо.',
     sol:'for i in range(7):\n    if can_move():\n        move_forward()\n    else:\n        turn_right()\nfor i in range(7):\n    if can_move():\n        move_forward()\n    else:\n        turn_right()',
     hint:'Два таких цикла по 7.'},
  ]
},

/* ================= МОДУЛЬ 6 ================= */
{
  icon:'🧰', title:'Функции def',
  desc:'Свои собственные команды',
  theory:`
    <h3>Зачем свои команды</h3>
    <p>Если ты повторяешь одни и те же команды — собери их в <b>функцию</b>.</p>
    <pre><code>def go():
    move_forward()
    move_forward()

go()</code></pre>
    <p><b>def</b> — создаёт функцию. Внутри — тело с отступом. Вызов <code>go()</code> выполняет её.</p>
    <div class="note">Функция не выполняется, пока ты её не вызовешь!</div>
    <h3>Параметры</h3>
    <pre><code>def go(n):
    for i in range(n):
        move_forward()

go(3)
go(2)</code></pre>
    <p><code>n</code> — параметр. При вызове <code>go(3)</code> внутри n = 3.</p>
    <h3>Полезно знать</h3>
    <p>Функция может печатать, поворачивать, двигать — всё что угодно.</p>
  `,
  cmds:[
    {code:'def go():\n    move_forward()', desc:'создать функцию'},
    {code:'go()', desc:'вызвать функцию'},
    {code:'def go(n):\n    for i in range(n):\n        move_forward()', desc:'функция с параметром'},
    {code:'move_forward()', desc:'шаг'},
    {code:'turn_right()', desc:'направо'},
  ],
  levels:[
    {title:'Первая функция', hero:{x:2,y:5,d:'up'},
     task:'Создай функцию <code>hello()</code>, которая выводит <b>Привет!</b>, и вызови её.',
     win:{prints:['Привет!']},
     sol:'def hello():\n    print("Привет!")\n\nhello()',
     hint:'def hello(): print("Привет!"), потом hello()'},

    {title:'Функция-шаг', hero:{x:1,y:6,d:'up'}, goals:[[1,2]],
     task:'Создай <code>go(n)</code>, которая делает n шагов. Вызови <code>go(4)</code>.',
     sol:'def go(n):\n    for i in range(n):\n        move_forward()\n\ngo(4)',
     hint:'def go(n): for i in range(n): move_forward()'},

    {title:'Два вызова', hero:{x:1,y:6,d:'up'}, goals:[[1,3]],
     task:'Функция <code>go(n)</code> уже есть в решении — вызови её дважды: go(2) и go(1).',
     sol:'def go(n):\n    for i in range(n):\n        move_forward()\n\ngo(2)\ngo(1)',
     hint:'go(2) и go(1) — итого 3 шага.'},

    {title:'Функция-поворот', hero:{x:2,y:2,d:'up'}, goals:[[2,6]],
     task:'Создай <code>turn_around()</code> (два turn_right) и вызови её, потом 4 шага.',
     sol:'def turn_around():\n    turn_right()\n    turn_right()\n\nturn_around()\nfor i in range(4):\n    move_forward()',
     hint:'turn_around() развернёт героя вниз.'},

    {title:'Квадрат', hero:{x:1,y:1,d:'right'}, goals:[[1,1]],
     task:'Создай <code>side(n)</code>, которая проходит n шагов. Вызови side(4).',
     sol:'def side(n):\n    for i in range(n):\n        move_forward()\n\nside(4)',
     hint:'Просто функция с циклом.'},

    {title:'Функция выводит', hero:{x:2,y:5,d:'up'},
     task:'Создай <code>hi(name)</code>, которая выводит <b>Привет, name</b>. Вызови hi("Мир").',
     win:{prints:['Привет, Мир']},
     sol:'def hi(name):\n    print("Привет,", name)\n\nhi("Мир")',
     hint:'print("Привет,", name)'},

    {title:'Функция вызывает функцию', hero:{x:1,y:6,d:'up'}, goals:[[1,1]],
     task:'Создай <code>step()</code> (1 шаг) и <code>go(n)</code>, которая вызывает step n раз. Вызови go(5).',
     sol:'def step():\n    move_forward()\n\ndef go(n):\n    for i in range(n):\n        step()\n\ngo(5)',
     hint:'Внутри go вызывай step().'},

    {title:'Два параметра', hero:{x:1,y:6,d:'up'}, goals:[[3,2]],
     task:'Создай <code>path(a, b)</code>: a шагов, поворот направо, b шагов. Вызови path(4, 2).',
     sol:'def path(a, b):\n    for i in range(a):\n        move_forward()\n    turn_right()\n    for i in range(b):\n        move_forward()\n\npath(4, 2)',
     hint:'(1,6) вверх 4 → (1,2), направо 2 → (3,2).'},

    {title:'Функция с условием', hero:{x:1,y:6,d:'up'}, goals:[[1,1]],
     task:'Создай <code>safe_step()</code>: если can_move() — шаг. Вызови её 5 раз циклом.',
     sol:'def safe_step():\n    if can_move():\n        move_forward()\n\nfor i in range(5):\n    safe_step()',
     hint:'Внутри функции if can_move(): move_forward().'},

    {title:'Большой проект', hero:{x:0,y:7,d:'up'}, goals:[[6,1]],
     task:'Создай <code>go(n)</code> и дойди до флага: вверх 6, направо 6. Используй функции.',
     sol:'def go(n):\n    for i in range(n):\n        move_forward()\n\ngo(6)\nturn_right()\ngo(6)',
     hint:'go(6), turn_right(), go(6).'},
  ]
},

/* ================= МОДУЛЬ 7 ================= */
{
  icon:'📋', title:'Списки',
  desc:'Много значений в одной коробке',
  theory:`
    <h3>Список</h3>
    <pre><code>nums = [1, 2, 3]</code></pre>
    <p>Список — это много значений подряд, в квадратных скобках через запятую.</p>
    <h3>Перебор</h3>
    <pre><code>for n in [2, 3, 1]:
    move(n)</code></pre>
    <p><code>move(n)</code> — пройти n шагов вперёд.</p>
    <h3>Длина и индексы</h3>
    <pre><code>a = [10, 20, 30]
print(len(a))   # 3
print(a[0])     # 10
print(a[2])     # 30</code></pre>
    <p>Индексы начинаются с <b>0</b>! Первый элемент — <code>a[0]</code>.</p>
    <h3>Список направлений</h3>
    <pre><code>for d in ["up", "up", "right"]:
    move_dir(d)</code></pre>
    <p><code>move_dir("up")</code> — повернуться вверх и сделать шаг.</p>
  `,
  cmds:[
    {code:'nums = [1, 2, 3]', desc:'создать список'},
    {code:'for n in nums:\n    move(n)', desc:'перебрать список'},
    {code:'print(len(nums))', desc:'длина списка'},
    {code:'print(nums[0])', desc:'первый элемент'},
    {code:'move_dir("up")', desc:'шаг в направлении'},
    {code:'move(3)', desc:'3 шага вперёд'},
  ],
  levels:[
    {title:'Список шагов', hero:{x:0,y:4,d:'right'}, goals:[[5,4]],
     task:'Пройди по списку <code>[2, 3]</code>: сначала 2 шага, потом 3 шага.',
     sol:'for n in [2, 3]:\n    move(n)',
     hint:'for n in [2, 3]: move(n)'},

    {title:'Список с переменной', hero:{x:0,y:4,d:'right'}, goals:[[6,4]],
     task:'Создай <code>path = [3, 2, 1]</code> и пройди по нему циклом.',
     sol:'path = [3, 2, 1]\nfor n in path:\n    move(n)',
     hint:'path = [3, 2, 1], потом for n in path: move(n)'},

    {title:'Длина', hero:{x:2,y:5,d:'up'},
     task:'Выведи длину списка <code>[1, 2, 3]</code> — используй len().',
     win:{prints:['3']}, sol:'a = [1, 2, 3]\nprint(len(a))',
     hint:'print(len(a))'},

    {title:'Направления', hero:{x:2,y:6,d:'up'}, goals:[[4,4]],
     task:'Пройди по списку направлений <code>["up", "up", "right", "right"]</code> командой move_dir.',
     sol:'for d in ["up", "up", "right", "right"]:\n    move_dir(d)',
     hint:'for d in [...]: move_dir(d)'},

    {title:'Сумма', hero:{x:2,y:5,d:'up'},
     task:'Сложи все числа из <code>nums = [1, 2, 3]</code> и выведи сумму (6).',
     win:{prints:['6']},
     sol:'nums = [1, 2, 3]\ntotal = 0\nfor n in nums:\n    total = total + n\nprint(total)',
     hint:'total = 0, в цикле total = total + n.'},

    {title:'Индекс', hero:{x:2,y:5,d:'up'},
     task:'Создай <code>a = [10, 20, 30]</code> и выведи второй элемент (это a[1] = 20).',
     win:{prints:['20']}, sol:'a = [10, 20, 30]\nprint(a[1])',
     hint:'Индексы с нуля: a[1] — второй.'},

    {title:'Маршрут', hero:{x:1,y:6,d:'up'}, goals:[[5,2]],
     task:'Маршрут: вверх 4, направо 4. Сделай списком: <code>[4, 4]</code> + поворот между ними.',
     sol:'for n in [4, 4]:\n    for i in range(n):\n        move_forward()\n    turn_right()',
     hint:'Цикл по [4,4], внутри цикл шагов и turn_right().'},

    {title:'Список и условие', hero:{x:0,y:4,d:'right'}, goals:[[7,4]], stars:[[2,4],[5,4]],
     task:'Пройди 7 шагов. Потом, если собрано 2 звезды, выведи <b>Готово</b>.',
     win:{prints:['Готово']},
     sol:'for i in range(7):\n    move_forward()\nif stars_collected() == 2:\n    print("Готово")',
     hint:'Цикл 7 шагов, потом if stars_collected() == 2.'},

    {title:'Список имён', hero:{x:2,y:5,d:'up'},
     task:'Есть список <code>names = ["Аня", "Боря"]</code>. Выведи каждое имя отдельной строкой.',
     win:{prints:['Аня','Боря']},
     sol:'names = ["Аня", "Боря"]\nfor n in names:\n    print(n)',
     hint:'for n in names: print(n)'},

    {title:'Финальный маршрут', hero:{x:0,y:0,d:'right'}, goals:[[7,7]],
     task:'Маршрут: вправо 7, вниз 7. Используй список <code>[7, 7]</code> и цикл с turn_right.',
     sol:'for n in [7, 7]:\n    for i in range(n):\n        move_forward()\n    turn_right()',
     hint:'Как в уровне «Маршрут», но с числами 7 и 7.'},
  ]
},

/* ================= МОДУЛЬ 8 ================= */
{
  icon:'♾️', title:'Цикл while',
  desc:'Повторяем, пока условие верно',
  theory:`
    <h3>while — пока</h3>
    <pre><code>while can_move():
    move_forward()</code></pre>
    <p>Пока <code>can_move()</code> возвращает True — шагаем. Как только впереди стена — цикл останавливается.</p>
    <h3>Пока не на финише</h3>
    <pre><code>while not at_goal():
    move_forward()</code></pre>
    <div class="note"><b>Осторожно!</b> Если условие никогда не станет ложным — цикл будет бесконечным. Тренажёр остановит программу с ошибкой.</div>
    <h3>Со счётчиком</h3>
    <pre><code>i = 0
while i < 4:
    move_forward()
    i = i + 1</code></pre>
    <p>Не забывай увеличивать счётчик, иначе цикл не закончится!</p>
  `,
  cmds:[
    {code:'while can_move():\n    move_forward()', desc:'пока можно — шаг'},
    {code:'while not at_goal():\n    move_forward()', desc:'пока не финиш'},
    {code:'i = 0\nwhile i < 4:\n    move_forward()\n    i = i + 1', desc:'со счётчиком'},
    {code:'move_forward()', desc:'шаг'},
    {code:'turn_right()', desc:'направо'},
  ],
  levels:[
    {title:'Пока можно', hero:{x:1,y:6,d:'up'}, goals:[[1,1]],
     task:'Иди вперёд, пока не дойдёшь до стены — используй <code>while can_move()</code>.',
     sol:'while can_move():\n    move_forward()',
     hint:'Поставь стену-подсказку: просто while can_move(): move_forward().'},

    {title:'Пока не финиш', hero:{x:3,y:7,d:'up'}, goals:[[3,2]],
     task:'Иди вперёд, пока не окажешься на флаге: <code>while not at_goal()</code>.',
     sol:'while not at_goal():\n    move_forward()',
     hint:'while not at_goal(): move_forward()'},

    {title:'Со счётчиком', hero:{x:0,y:4,d:'right'}, goals:[[4,4]],
     task:'Сделай ровно 4 шага, используя while и счётчик i.',
     sol:'i = 0\nwhile i < 4:\n    move_forward()\n    i = i + 1',
     hint:'Не забудь i = i + 1 внутри цикла!'},

    {title:'Пока звёзд мало', hero:{x:0,y:4,d:'right'}, goals:[[5,4]], stars:[[1,4],[2,4],[3,4]],
     task:'Иди вперёд, пока не соберёшь 3 звезды: <code>while stars_collected() < 3</code>.',
     sol:'while stars_collected() < 3:\n    move_forward()',
     hint:'while stars_collected() < 3: move_forward()'},

    {title:'Поворот у стены', hero:{x:0,y:0,d:'right'}, goals:[[7,7]],
     task:'Используй while can_move() — иди вправо до стены, потом направо и вниз. Стен нет, но проверка нужна.',
     sol:'while can_move():\n    move_forward()\nturn_right()\nwhile can_move():\n    move_forward()',
     hint:'Два while can_move() с turn_right() между ними.'},

    {title:'Найди ошибку', hero:{x:1,y:4,d:'right'}, goals:[[5,4]],
     task:'В коде есть бесконечный цикл. Исправь его, чтобы герой дошёл до флага.',
     start:'i = 0\nwhile i < 4:\n    move_forward()\n    turn_left()',
     sol:'for i in range(4):\n    move_forward()',
     hint:'Просто замени while на for i in range(4).'},

    {title:'Два условия', hero:{x:0,y:4,d:'right'}, goals:[[6,4]],
     task:'Иди, пока можно И пока не на финише: <code>while can_move() and not at_goal()</code>.',
     sol:'while can_move() and not at_goal():\n    move_forward()',
     hint:'while can_move() and not at_goal(): move_forward()'},

    {title:'While с if', hero:{x:0,y:0,d:'right'}, goals:[[7,0]],
     task:'Иди, пока можно. Внутри — если звёзд собрано 0, просто шагай (звёзд нет, но условие нужно).',
     sol:'while can_move():\n    if stars_collected() == 0:\n        move_forward()\n    else:\n        move_forward()',
     hint:'while can_move(): с if внутри.'},

    {title:'Счёт и печать', hero:{x:0,y:4,d:'right'}, goals:[[4,4]],
     task:'Пройди 4 шага через while со счётчиком и выведи число шагов (4).',
     win:{prints:['4']},
     sol:'i = 0\nwhile i < 4:\n    move_forward()\n    i = i + 1\nprint(i)',
     hint:'После цикла print(i).'},

{title:'Большой лабиринт', hero:{x:0,y:7,d:'up'}, goals:[[7,0]], stars:[[0,3],[3,0],[7,0]],
 task:'Дойди до флага и собери 3 звезды.',
 sol:'for i in range(7):\n    move_forward()\nturn_right()\nfor i in range(7):\n    move_forward()',
 hint:'Вверх 7, направо 7.'},
  ]
},

/* ================= МОДУЛЬ 9 ================= */
{
  icon:'🧭', title:'Алгоритмы и лабиринты',
  desc:'Собираем всё вместе',
  theory:`
    <h3>Алгоритм — это план</h3>
    <p>Большая задача разбивается на маленькие шаги. В этом модуле ты будешь комбинировать всё, что уже выучил.</p>
    <h3>Шпаргалка</h3>
    <pre><code>move_forward()   # шаг
move(n)          # n шагов
move_dir("up")   # повернуться и шагнуть
turn_left()      # налево
turn_right()     # направо
can_move()       # можно ли идти
at_goal()        # на финише ли
stars_collected()# сколько звёзд
for i in range(n):  # цикл
while условие:      # цикл с условием
def имя():          # своя команда
if условие:         # ветвление</code></pre>
    <div class="note">Совет: сначала продумай маршрут словами, потом пиши код.</div>
  `,
  cmds:[
    {code:'for i in range(4):\n    move_forward()', desc:'цикл'},
    {code:'while can_move():\n    move_forward()', desc:'while'},
    {code:'def go(n):\n    for i in range(n):\n        move_forward()', desc:'функция'},
    {code:'if can_move():\n    move_forward()', desc:'условие'},
    {code:'move_dir("up")', desc:'шаг в направлении'},
    {code:'print(stars_collected())', desc:'звёзды'},
  ],
  levels:[
    {title:'Коридор', hero:{x:0,y:0,d:'down'}, goals:[[0,7]],
     task:'Спустись по коридору до флага.',
     sol:'for i in range(7):\n    move_forward()',
     hint:'7 шагов вниз.'},

    {title:'Коридор с поворотом', hero:{x:1,y:1,d:'down'}, goals:[[6,6]],
     task:'Вниз 5 шагов, потом направо 5 шагов.',
     sol:'for i in range(5):\n    move_forward()\nturn_left()\nfor i in range(5):\n    move_forward()',
     hint:'turn_left() из «вниз» даёт «вправо».'},

    {title:'Лабиринт с while', hero:{x:0,y:0,d:'down'}, goals:[[7,7]],
     task:'Используй while can_move(), чтобы пройти до конца, потом поверни и иди до флага.',
     sol:'while can_move():\n    move_forward()\nturn_left()\nwhile can_move():\n    move_forward()',
     hint:'Два while can_move().'},

    {title:'Звёздная дорожка', hero:{x:0,y:3,d:'right'}, goals:[[7,3]], stars:[[1,3],[3,3],[5,3],[7,3]],
     task:'Собери все 4 звезды и дойди до флага.',
     sol:'for i in range(7):\n    move_forward()',
     hint:'7 шагов вправо — звёзды собираются сами.'},

    {title:'Функция и цикл', hero:{x:1,y:6,d:'up'}, goals:[[6,1]],
     task:'Создай <code>go(n)</code> и дойди до флага: вверх 5, направо 5.',
     sol:'def go(n):\n    for i in range(n):\n        move_forward()\n\ngo(5)\nturn_right()\ngo(5)',
     hint:'go(5), turn_right(), go(5).'},

    {title:'Список направлений', hero:{x:2,y:6,d:'up'}, goals:[[5,3]],
     task:'Маршрут: вверх 3, вправо 3. Используй список направлений.',
     sol:'for d in ["up", "up", "up", "right", "right", "right"]:\n    move_dir(d)',
     hint:'Список из трёх "up" и трёх "right".'},

    {title:'Условие в цикле', hero:{x:0,y:0,d:'right'}, goals:[[7,0]],
     task:'Иди вправо 7 раз; если впереди стена — поверни направо.',
     sol:'for i in range(7):\n    if can_move():\n        move_forward()\n    else:\n        turn_right()',
     hint:'if can_move(): шаг, else: поворот.'},

    {title:'Длинный коридор', hero:{x:1,y:7,d:'up'}, goals:[[1,0]],
     task:'Используй while can_move() и дойди до верха.',
     sol:'while can_move():\n    move_forward()',
     hint:'while can_move(): move_forward()'},

    {title:'Большой лабиринт', hero:{x:0,y:7,d:'up'}, goals:[[7,0]], stars:[[0,3],[3,0],[7,4]],
     task:'Дойди до флага и собери 3 звезды.',
     sol:'for i in range(7):\n    move_forward()\nturn_right()\nfor i in range(7):\n    move_forward()',
     hint:'Вверх 7, направо 7.'},

{title:'Финальный экзамен', hero:{x:0,y:0,d:'down'}, goals:[[7,7]], stars:[[0,3],[3,3],[7,3]],
 task:'Дойди до флага в правом нижнем углу и собери 3 звезды. Ты справишься!',
 sol:'for i in range(3):\n    move_forward()\nturn_left()\nfor i in range(7):\n    move_forward()\nturn_right()\nfor i in range(4):\n    move_forward()',
 hint:'Вниз 3 → поворот направо → вправо 7 (собираем звёзды) → поворот направо → вниз 4.'},
  ]
},

/* ================= МОДУЛЬ 10 ================= */
{
  icon:'🚀', title:'Творческий проект',
  desc:'Придумываем и программируем сами',
  theory:`
    <h3>Ты — программист и дизайнер</h3>
    <p>В этом модуле задания открытые: много правильных решений. Пробуй, экспериментируй, ломай и чини!</p>
    <h3>Творческий режим</h3>
    <p>В главном меню есть кнопка <b>🎨 Творческий режим</b>. Там можно:</p>
    <ul>
      <li>нарисовать свой уровень (стены, звёзды, флаг)</li>
      <li>поставить героя в нужную клетку</li>
      <li>написать программу и пройти свой уровень</li>
    </ul>
    <div class="note">Это лучший способ проверить, понял ли ты тему: объясни её компьютеру.</div>
    <h3>Все команды</h3>
    <pre><code>print(x)  say("...")  move_forward()  move(n)
move_dir("up")  turn_left()  turn_right()
can_move()  at_goal()  stars_collected()
for i in range(n):   while условие:
if условие: / else:   def имя(параметры):</code></pre>
  `,
  cmds:[
    {code:'print("Мой уровень!")', desc:'печать'},
    {code:'say("Привет!")', desc:'сказать'},
    {code:'for i in range(4):\n    move_forward()', desc:'цикл'},
    {code:'while can_move():\n    move_forward()', desc:'while'},
    {code:'def go(n):\n    for i in range(n):\n        move_forward()', desc:'функция'},
    {code:'if can_move():\n    move_forward()', desc:'условие'},
  ],
  levels:[
    {title:'Асcii-арт', hero:{x:3,y:4,d:'up'},
     task:'Выведи три строки: <b>★</b>, <b>★★</b>, <b>★★★</b>.',
     win:{prints:['★','★★','★★★']},
     sol:'print("★")\nprint("★★")\nprint("★★★")',
     hint:'Три команды print.'},

    {title:'Диалог с NPC', hero:{x:2,y:4,d:'up'}, npcs:[{x:4,y:4,e:'🐸'}],
     task:'Скажи вслух <b>Привет, жаба!</b> и выведи <b>Ква-ква</b>.',
     win:{says:['Привет, жаба!'], prints:['Ква-ква']},
     sol:'say("Привет, жаба!")\nprint("Ква-ква")',
     hint:'say и print.'},

    {title:'Маршрут по координатам', hero:{x:0,y:0,d:'right'}, goals:[[7,7]],
     task:'Пройди до флага любым способом: вправо 7, вниз 7.',
     sol:'for i in range(7):\n    move_forward()\nturn_right()\nfor i in range(7):\n    move_forward()',
     hint:'Два цикла по 7.'},

    {title:'Собери всё', hero:{x:0,y:4,d:'right'}, goals:[[7,4]], stars:[[1,4],[2,4],[4,4],[6,4]],
     task:'Пройди по ряду и собери все 4 звезды. Выведи их число.',
     win:{stars:4, prints:['4']},
     sol:'for i in range(7):\n    move_forward()\nprint(stars_collected())',
     hint:'7 шагов, потом print(stars_collected()).'},

    {title:'Своя функция', hero:{x:1,y:6,d:'up'}, goals:[[6,1]],
     task:'Придумай функцию <code>go(n)</code> и дойди до флага (вверх 5, вправо 5).',
     sol:'def go(n):\n    for i in range(n):\n        move_forward()\n\ngo(5)\nturn_right()\ngo(5)',
     hint:'go(5), turn_right(), go(5).'},

    {title:'Лабиринт-вызов', hero:{x:0,y:7,d:'up'}, goals:[[7,0]], walls:[[2,6],[2,5],[2,4],[5,3],[5,2],[5,1]],
     task:'Пройди лабиринт: вверх 7, направо 7.',
     sol:'while can_move():\n    move_forward()\nturn_right()\nwhile can_move():\n    move_forward()',
     hint:'Два while can_move() с turn_right().'},

    {title:'Счёт и вывод', hero:{x:0,y:4,d:'right'}, goals:[[5,4]], stars:[[2,4],[3,4],[4,4]],
     task:'Пройди 5 шагов, выведи число собранных звёзд.',
     win:{prints:['3']},
     sol:'for i in range(5):\n    move_forward()\nprint(stars_collected())',
     hint:'print(stars_collected())'},

    {title:'Свободное творчество', hero:{x:3,y:3,d:'up'},
     task:'Напиши любую программу — главное, чтобы она выполнилась без ошибок. Например, выведи своё имя и скажи что-нибудь.',
     win:{}, sol:'print("Меня зовут ...")\nsay("Я программист!")',
     hint:'Подойдёт любой работающий код.'},

    {title:'Свой уровень', hero:{x:2,y:4,d:'up'},
     task:'Открой <b>🎨 Творческий режим</b> в меню и построй свой уровень. Это твой проект!',
     win:{}, sol:'print("Мой уровень готов!")',
     hint:'Кнопка «Творческий режим» в меню.'},

    {title:'Финальный экзамен', hero:{x:0,y:0,d:'down'}, goals:[[7,7]], stars:[[0,3],[3,3],[7,3]],
     task:'Дойди до флага в правом нижнем углу и собери 3 звезды. Ты справишься!',
     sol:'for i in range(7):\n    move_forward()\nturn_left()\nfor i in range(7):\n    move_forward()',
     hint:'Вниз 7, turn_left() (вправо), вправо 7.'},
  ]
}
];