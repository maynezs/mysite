/* levels-by-age.js — возрастные варианты уровней (10-12 и 13-14).
   Для 7-9 используется базовый уровень из levels.js. */
(function () {
'use strict';

function ovr(mi, li, m, h) {
  const lvl = MODULES[mi] && MODULES[mi].levels[li];
  if (!lvl) return;
  lvl.byAge = lvl.byAge || {};
  if (m) lvl.byAge['10-12'] = m;
  if (h) lvl.byAge['13-14'] = h;
}

/* ===== МОДУЛЬ 1. Print ===== */
ovr(0,0,
  {task:'Выведи <b>Привет, Python!</b>', win:{prints:['Привет, Python!']}, sol:'print("Привет, Python!")', hint:'Одна команда print.'},
  {task:'Выведи слово <b>Python</b> три раза — каждое на новой строке.', win:{prints:['Python','Python','Python']}, sol:'print("Python")\nprint("Python")\nprint("Python")', hint:'Три команды print.'});
ovr(0,1,
  {task:'Выведи три строки: <b>Раз</b>, <b>Два</b>, <b>Три</b>.', win:{prints:['Раз','Два','Три']}, sol:'print("Раз")\nprint("Два")\nprint("Три")', hint:'Три print.'},
  {task:'Выведи <b>Раз</b>, <b>Два</b>, <b>Три</b>, <b>Поехали!</b> — каждой на отдельной строке.', win:{prints:['Раз','Два','Три','Поехали!']}, sol:'print("Раз")\nprint("Два")\nprint("Три")\nprint("Поехали!")', hint:'Четыре print.'});
ovr(0,2,
  {task:'Выведи число 42 через выражение <code>50 - 8</code>.', win:{prints:['42']}, sol:'print(50 - 8)', hint:'print(50 - 8)'},
  {task:'Выведи 42 через произведение <code>6 * 7</code>.', win:{prints:['42']}, sol:'print(6 * 7)', hint:'print(6 * 7)'});
ovr(0,3,
  {task:'Выведи <b>Мне 10 лет</b> через запятую.', win:{prints:['Мне 10 лет']}, sol:'print("Мне", 10, "лет")', hint:'print("Мне", 10, "лет")'},
  {task:'Выведи <b>Мне 10 лет</b>, где 10 — это выражение <code>5 + 5</code>.', win:{prints:['Мне 10 лет']}, sol:'print("Мне", 5 + 5, "лет")', hint:'print("Мне", 5 + 5, "лет")'});
ovr(0,4,
  {task:'Пусть герой скажет <b>Привет!</b>, и выведи <b>Я говорю.</b>', win:{says:['Привет!'],prints:['Я говорю.']}, sol:'say("Привет!")\nprint("Я говорю.")', hint:'say + print.'},
  {task:'Скажи <b>Привет</b>, выведи <b>Мир</b>, потом скажи <b>Пока</b>.', win:{says:['Привет','Пока'],prints:['Мир']}, sol:'say("Привет")\nprint("Мир")\nsay("Пока")', hint:'Три команды.'});
ovr(0,5,
  {task:'Выведи <b>Мне нравится Python</b> в одинарных кавычках.', win:{prints:['Мне нравится Python']}, sol:"print('Мне нравится Python')", hint:"print('...')"},
  {task:'Выведи <b>Python</b> одинарными кавычками, потом <b>Python</b> двойными — две строки.', win:{prints:['Python','Python']}, sol:"print('Python')\nprint(\"Python\")", hint:'Разные кавычки.'});
ovr(0,6,
  {task:'Выведи <b>Python</b> четыре раза (каждое на новой строке).', win:{prints:['Python','Python','Python','Python']}, sol:'print("Python")\nprint("Python")\nprint("Python")\nprint("Python")', hint:'Четыре print.'},
  {task:'Выведи пять строк: <b>1</b>, <b>2</b>, <b>3</b>, <b>4</b>, <b>5</b>.', win:{prints:['1','2','3','4','5']}, sol:'print(1)\nprint(2)\nprint(3)\nprint(4)\nprint(5)', hint:'Пять print.'});
ovr(0,7,
  {task:'Выведи результат <b>10 - 3</b>.', win:{prints:['7']}, sol:'print(10 - 3)', hint:'print(10 - 3)'},
  {task:'Выведи результат <b>(5 + 5) * 2</b>.', win:{prints:['20']}, sol:'print((5 + 5) * 2)', hint:'Скобки работают как в математике.'});
ovr(0,8,
  {task:'Выведи <b>Кот и пёс — друзья</b> через print с запятыми.', win:{prints:['Кот и пёс — друзья']}, sol:'print("Кот", "и", "пёс", "—", "друзья")', hint:'Пять значений через запятую.'},
  {task:'Выведи <b>Кот</b> на одной строке и <b>пёс</b> на другой.', win:{prints:['Кот','пёс']}, sol:'print("Кот")\nprint("пёс")', hint:'Два print.'});
ovr(0,9,
  {task:'Скажи <b>Привет!</b>, выведи <b>Как дела?</b> и скажи <b>Отлично!</b>', win:{says:['Привет!','Отлично!'],prints:['Как дела?']}, sol:'say("Привет!")\nprint("Как дела?")\nsay("Отлично!")', hint:'3 команды.'},
  {task:'Скажи <b>Привет</b>, выведи <b>1</b>, скажи <b>Пока</b>, выведи <b>2</b>.', win:{says:['Привет','Пока'],prints:['1','2']}, sol:'say("Привет")\nprint(1)\nsay("Пока")\nprint(2)', hint:'4 команды.'});

/* ===== МОДУЛЬ 2. Движение ===== */
ovr(1,0,
  {task:'Дойди до флага и собери звезду по пути.', stars:[[1,4]], win:{stars:1}},
  {task:'Собери 3 звезды и дойди до флага.', stars:[[1,5],[1,4],[1,3]], win:{stars:3}});
ovr(1,1,
  {task:'Дойди до флага и собери звезду по пути.', stars:[[3,6]], win:{stars:1}},
  {task:'Собери 3 звезды и дойди до флага.', stars:[[2,6],[3,6],[4,6]], win:{stars:3}});
ovr(1,2,
  {task:'Дойди до флага и собери звезду по пути.', stars:[[6,4]], win:{stars:1}},
  {task:'Собери 2 звезды и дойди до флага.', stars:[[6,3],[6,4]], win:{stars:2}});
ovr(1,3,
  {task:'Дойди до флага и собери звезду по пути.', stars:[[1,3]], win:{stars:1}},
  {task:'Собери 2 звезды и дойди до флага.', stars:[[1,3],[3,5]], win:{stars:2}});
ovr(1,5,
  {task:'Разверни героя и дойди до флага, собрав звезду.', stars:[[3,6]], win:{stars:1}},
  {task:'Разверни героя и дойди до флага, собрав 2 звезды.', stars:[[3,5],[3,6]], win:{stars:2}});
ovr(1,6,
  {task:'Дойди до флага и собери 2 звезды.', stars:[[1,3],[4,1]], win:{stars:2}},
  {task:'Дойди до флага и собери 3 звезды.', stars:[[1,4],[1,1],[4,1]], win:{stars:3}});
ovr(1,7,
  {task:'Пройди лабиринт и собери звезду.', stars:[[0,4]], win:{stars:1}},
  {task:'Пройди лабиринт и собери 2 звезды.', stars:[[0,3],[4,7]], win:{stars:2}});
ovr(1,8,
  {task:'Пройди маршрут и собери 2 звезды.', stars:[[1,4],[4,5]], win:{stars:2}},
  {task:'Пройди маршрут и собери 3 звезды.', stars:[[1,4],[4,5],[6,2]], win:{stars:3}});
ovr(1,9,
  {task:'Дойди до флага и собери 2 звезды.', win:{stars:2}},
  {task:'Дойди до флага и собери все звёзды (2).', win:{stars:2}});

/* ===== МОДУЛЬ 3. For ===== */
ovr(2,0,
  {task:'Дойди до флага, используя <code>for i in range(5)</code>.', hint:'range(5) даст 5 итераций.'},
  {task:'Дойди до флага через цикл for. Добавь в конце <code>print("Готово!")</code>.', win:{prints:['Готово!']}, hint:'for i in range(5): move_forward(), потом print("Готово!").'});
ovr(2,1,
  {task:'Дойди до флага циклом for. Попробуй записать <code>range(3, 10)</code> — тоже 7 итераций.'},
  {task:'Дойди до флага, используя for. В конце выведи <code>print("Я дошёл!")</code>.', win:{prints:['Я дошёл!']}});
ovr(2,2,
  {task:'Дойди до флага циклом for.'},
  {task:'Дойди до флага циклом for и выведи количество шагов через print(5).', win:{prints:['5']}});
ovr(2,3,
  {task:'Дойди до флага, используя два цикла.'},
  {task:'Дойди до флага двумя циклами и собери 2 звезды.', stars:[[1,3],[3,3]], win:{stars:2}});
ovr(2,4,
  {task:'Дойди до флага. Используй ровно два цикла.'},
  {task:'Дойди до флага. Используй два цикла и выведи <code>print("Ура!")</code>.', win:{prints:['Ура!']}});
ovr(2,5,
  {task:'Собери все звёзды и дойди до флага циклом.'},
  {task:'Собери все звёзды и дойди до флага, используя for. В конце выведи количество звёзд.', win:{stars:4,prints:['4']}});
ovr(2,6,
  {task:'Дойди до флага, используя <code>range(2, 6)</code>.'},
  {task:'Дойди до флага через <code>range(2, 6)</code>, добавь в конце <code>print("Ок")</code>.', win:{prints:['Ок']}});
ovr(2,7,
  {task:'Дойди до флага через <code>range(0, 7, 2)</code>.'},
  {task:'Дойди до флага через <code>range(0, 7, 2)</code> и выведи <code>print(4)</code>.', win:{prints:['4']}});
ovr(2,8,
  {task:'Дойди до флага. Используй два цикла for.'},
  {task:'Дойди до флага двумя for. Собери 2 звезды по пути.', stars:[[1,3],[4,1]], win:{stars:2}});
ovr(2,9,
  {task:'Дойди до флага. Используй два цикла for.'},
  {task:'Дойди до флага. Используй два for и собери 2 звезды.', stars:[[0,4],[4,0]], win:{stars:2}});

/* ===== МОДУЛЬ 4. Переменные ===== */
ovr(3,0,
  {task:'Создай <code>x = 10</code> и выведи x.', win:{prints:['10']}, sol:'x = 10\nprint(x)'},
  {task:'Создай <code>a = 3</code> и <code>b = 4</code>, выведи <code>a * b</code>.', win:{prints:['12']}, sol:'a = 3\nb = 4\nprint(a * b)'});
ovr(3,1,
  {task:'Создай <code>x = 7</code> и выведи <code>x - 2</code>.', win:{prints:['5']}, sol:'x = 7\nprint(x - 2)'},
  {task:'Создай <code>x = 5</code>, <code>y = 3</code>, выведи <code>x * y + 1</code>.', win:{prints:['16']}, sol:'x = 5\ny = 3\nprint(x * y + 1)'});
ovr(3,2,
  {task:'<code>n = 4</code>. Дойди до флага циклом <code>range(n)</code>.', sol:'n = 4\nfor i in range(n):\n    move_forward()'},
  {task:'<code>n = 4</code>. Дойди до флага циклом <code>range(n)</code>, в конце выведи n.', win:{prints:['4']}, sol:'n = 4\nfor i in range(n):\n    move_forward()\nprint(n)'});
ovr(3,3,
  {task:'Создай <code>a = 15</code>, <code>b = 25</code>, выведи их сумму.', win:{prints:['40']}, sol:'a = 15\nb = 25\nprint(a + b)'},
  {task:'<code>a = 6</code>, <code>b = 7</code>, выведи <code>a * b</code> и <code>a + b</code> отдельными строками.', win:{prints:['42','13']}, sol:'a = 6\nb = 7\nprint(a * b)\nprint(a + b)'});
ovr(3,4,
  {task:'Начни с <code>x = 5</code>, трижды сделай <code>x = x + 1</code> и выведи x.', win:{prints:['8']}, sol:'x = 5\nx = x + 1\nx = x + 1\nx = x + 1\nprint(x)'},
  {task:'Начни с <code>x = 2</code>. Сделай <code>x = x * 2</code> три раза и выведи x.', win:{prints:['16']}, sol:'x = 2\nx = x * 2\nx = x * 2\nx = x * 2\nprint(x)'});
ovr(3,5,
  {task:'<code>x = 4</code>, сделай <code>x = x * 5</code>, выведи x.', win:{prints:['20']}, sol:'x = 4\nx = x * 5\nprint(x)'},
  {task:'<code>x = 10</code>, сделай <code>x = x - 3</code> дважды, выведи x.', win:{prints:['4']}, sol:'x = 10\nx = x - 3\nx = x - 3\nprint(x)'});
ovr(3,6,
  {task:'Дойди до флага и выведи, сколько звёзд собрано.', win:{prints:['3']}},
  {task:'Дойди до флага. Выведи количество звёзд ДВАЖДЫ (две одинаковые строки).', win:{prints:['3','3']}});
ovr(3,7,
  {task:'<code>a = 20</code>, <code>b = 8</code>, выведи <code>a - b</code>.', win:{prints:['12']}, sol:'a = 20\nb = 8\nprint(a - b)'},
  {task:'<code>a = 100</code>, <code>b = 4</code>, выведи <code>a / b</code>.', win:{prints:['25']}, sol:'a = 100\nb = 4\nprint(a / b)'});
ovr(3,8,
  {task:'<code>n = 5</code>. Дойди до флага через <code>range(n)</code>.', sol:'n = 5\nfor i in range(n):\n    move_forward()'},
  {task:'<code>n = 5</code>. Дойди до флага. Перед циклом выведи n.', win:{prints:['5']}, sol:'n = 5\nprint(n)\nfor i in range(n):\n    move_forward()'});
ovr(3,9,
  {task:'<code>n = 3</code>. Выведи <code>n * n</code>, потом дойди до флага через <code>range(n)</code>.', win:{prints:['9']}},
  {task:'<code>n = 3</code>. Выведи <code>n * n</code> и <code>n + n</code> на разных строках, потом дойди до флага.', win:{prints:['9','6']}, sol:'n = 3\nprint(n * n)\nprint(n + n)\nfor i in range(n):\n    move_forward()'});

/* ===== МОДУЛЬ 5. If ===== */
ovr(4,0,
  {task:'Проверь <code>can_move()</code> и, если можно, шагни. В конце выведи <code>print("Готово")</code>.', win:{prints:['Готово']}},
  {task:'Проверь <code>can_move()</code> и, если можно, шагни. Потом проверь <code>at_goal()</code> и выведи <b>Ура!</b>', win:{prints:['Ура!']}});
ovr(4,1,
  {task:'Используй <code>if can_move()</code> для шага, <code>else</code> для поворота.'},
  {task:'Используй if/else. После условия выведи <code>print("Дальше")</code>.', win:{prints:['Дальше']}});
ovr(4,2,
  {task:'Проверь <code>at_goal()</code> и выведи <b>Ура!</b>', win:{prints:['Ура!']}},
  {task:'Проверь <code>at_goal()</code> и выведи <b>Ура!</b>. Также выведи <code>print("Начало")</code> перед проверкой.', win:{prints:['Начало','Ура!']}});
ovr(4,3,
  {task:'В цикле на 3 итерации шагай только если <code>can_move()</code>.'},
  {task:'В цикле на 3 итерации с проверкой <code>can_move()</code>. Выведи <code>print("Конец")</code> после цикла.', win:{prints:['Конец']}});
ovr(4,4,
  {task:'<code>x = 10</code>. Если x больше 3 — выведи <b>больше</b>.', win:{prints:['больше']}, sol:'x = 10\nif x > 3:\n    print("больше")'},
  {task:'<code>x = 3</code>. Если x > 3 — выведи <b>больше</b>, иначе выведи <b>не больше</b>.', win:{prints:['не больше']}, sol:'x = 3\nif x > 3:\n    print("больше")\nelse:\n    print("не больше")'});
ovr(4,5,
  {task:'Пройди маршрут. Если собрано 2 звезды — выведи <b>Собрал!</b>', win:{prints:['Собрал!']}},
  {task:'Пройди маршрут. Если собрано 2 звезды — выведи <b>Собрал!</b>, иначе — <b>Не всё.</b>', win:{prints:['Собрал!']}});
ovr(4,6,
  {task:'Используй цикл на 5 итераций с проверкой <code>can_move()</code>.'},
  {task:'Цикл на 5 итераций с <code>can_move()</code>. После цикла выведи <code>print("Готово")</code>.', win:{prints:['Готово']}});
ovr(4,7,
  {task:'Условие: <code>can_move()</code> и <code>not at_goal()</code>. Сделай 2 шага.'},
  {task:'Условие <code>can_move() and not at_goal()</code>. Сделай 2 шага и выведи <code>print("Дошёл")</code>.', win:{prints:['Дошёл']}});
ovr(4,8,
  {task:'Иди вперёд. В цикле проверяй can_move(), если нет — поворот.'},
  {task:'Иди вперёд. При каждой итерации проверяй can_move(): иначе — поворот.'});
ovr(4,9,
  {task:'Дойди до флага. В цикле на 7 шагов проверяй can_move(), иначе поворот.'},
  {task:'Дойди до флага через два цикла с проверками <code>can_move()</code>.'});

/* ===== МОДУЛЬ 6. Функции ===== */
ovr(5,0,
  {task:'Создай функцию <code>hi()</code>, которая выводит <b>Привет!</b>, и вызови её.', win:{prints:['Привет!']}},
  {task:'Создай функцию <code>hi(name)</code>, которая выводит <b>Привет, name</b>. Вызови hi("Мир").', win:{prints:['Привет, Мир']}, sol:'def hi(name):\n    print("Привет,", name)\n\nhi("Мир")'});
ovr(5,1,
  {task:'Функция <code>go(n)</code> делает n шагов. Вызови go(4).'},
  {task:'Функция <code>go(n)</code> делает n шагов. Вызови go(4) и go(1).'});
ovr(5,2,
  {task:'Функция go(n) уже есть. Вызови её дважды: go(2) и go(1).'},
  {task:'Функция go(n). Вызови go(1) три раза подряд.'});
ovr(5,3,
  {task:'Создай <code>turn_around()</code> (два turn_right) и вызови её. Потом 4 шага.'},
  {task:'Создай turn_around() и step(), потом вызови turn_around() + step() ×4.'});
ovr(5,4,
  {task:'Создай <code>side(n)</code>, которая делает n шагов. Вызови side(4).'},
  {task:'Создай <code>side(n)</code>. Вызови side(4) и выведи <code>print("Ok")</code>.', win:{prints:['Ok']}});
ovr(5,5,
  {task:'Создай <code>hi(name)</code>, выведи <b>Привет, name</b>. Вызови hi("Мир").', win:{prints:['Привет, Мир']}},
  {task:'Создай hi(name). Вызови hi("Мир") и hi("Python").', win:{prints:['Привет, Мир','Привет, Python']}});
ovr(5,6,
  {task:'Создай step() и go(n), go вызывает step n раз. Вызови go(5).'},
  {task:'Создай step() и go(n). go вызывает step и выводит <code>print(n)</code>. Вызови go(3).', win:{prints:['3']}});
ovr(5,7,
  {task:'Создай path(a, b): a шагов, поворот, b шагов. Вызови path(4, 2).'},
  {task:'Создай path(a, b). Вызови path(2, 2) и выведи <code>print(a + b)</code>.', win:{prints:['4']}});
ovr(5,8,
  {task:'Создай safe_step(). Если can_move() — шаг. Вызови 5 раз циклом.'},
  {task:'Создай safe_step(). Цикл 5 раз. Выведи <code>print("Готово")</code>.', win:{prints:['Готово']}});
ovr(5,9,
  {task:'Создай go(n), дойди до флага через go(6), turn_right(), go(6).'},
  {task:'Создай go(n). Дойди до флага через go(6), turn_right(), go(6). Перед стартом выведи <code>print("Пошли")</code>.', win:{prints:['Пошли']}});

/* ===== МОДУЛЬ 7. Списки ===== */
ovr(6,0,
  {task:'Пройди по списку <code>[3, 2]</code>: сначала 3 шага, потом 2.'},
  {task:'Пройди по списку <code>[2, 3, 1, 1]</code>. Дойди до флага.'});
ovr(6,1,
  {task:'Создай <code>path = [2, 2, 2]</code>, пройди циклом.'},
  {task:'Создай <code>path = [1, 2, 3, 1]</code>, пройди циклом. Выведи <code>print(len(path))</code>.', win:{prints:['4']}});
ovr(6,2,
  {task:'Выведи длину списка <code>[1, 2, 3, 4]</code>.', win:{prints:['4']}},
  {task:'Выведи длину списка <code>[10, 20, 30, 40, 50]</code>.', win:{prints:['5']}});
ovr(6,3,
  {task:'Пройди по списку направлений <code>["up","up","right","right"]</code>.'},
  {task:'Пройди по списку <code>["up","right","up","right","up","right"]</code>.'});
ovr(6,4,
  {task:'Сложи <code>nums = [2, 3, 5]</code> и выведи сумму (10).', win:{prints:['10']}},
  {task:'Сложи <code>nums = [1, 2, 3, 4, 5]</code> и выведи сумму (15).', win:{prints:['15']}});
ovr(6,5,
  {task:'Создай <code>a = [10, 20, 30]</code>. Выведи <code>a[2]</code> (30).', win:{prints:['30']}},
  {task:'Создай <code>a = [5, 15, 25, 35]</code>. Выведи <code>a[1]</code> и <code>a[3]</code> раздельно.', win:{prints:['15','35']}});
ovr(6,6,
  {task:'Маршрут <code>[4, 4]</code> с поворотом между блоками.'},
  {task:'Маршрут <code>[2, 2, 2]</code> с поворотами между блоками.'});
ovr(6,7,
  {task:'Пройди маршрут, потом если собрано 2 звезды — выведи <b>Готово</b>.', win:{prints:['Готово']}},
  {task:'Пройди маршрут. Выведи <code>print("Собрано:", stars_collected())</code>.'});
ovr(6,8,
  {task:'Выведи каждое имя из <code>["Аня","Боря"]</code> отдельной строкой.', win:{prints:['Аня','Боря']}},
  {task:'Выведи каждое из <code>["Раз","Два","Три","Четыре"]</code> отдельной строкой.', win:{prints:['Раз','Два','Три','Четыре']}});
ovr(6,9,
  {task:'Маршрут <code>[7, 7]</code> с turn_right между блоками.'},
  {task:'Маршрут <code>[2, 7, 2]</code> с turn_right после каждого блока. Найди путь сам.'});

/* ===== МОДУЛЬ 8. While ===== */
ovr(7,0,
  {task:'Иди вперёд, пока не дойдёшь до флага: <code>while not at_goal()</code>.'},
  {task:'Используй <code>while can_move()</code>. После цикла выведи <code>print("Готово")</code>.', win:{prints:['Готово']}});
ovr(7,1,
  {task:'Иди вперёд, пока <code>not at_goal()</code>.'},
  {task:'Пока <code>not at_goal()</code> — шагай. После выведи <code>print("Дошёл!")</code>.', win:{prints:['Дошёл!']}});
ovr(7,2,
  {task:'Сделай ровно 4 шага через while со счётчиком.'},
  {task:'Сделай ровно 4 шага через while со счётчиком. Выведи <code>print(i)</code> после.', win:{prints:['4']}});
ovr(7,3,
  {task:'Иди, пока не соберёшь 3 звезды: <code>while stars_collected() &lt; 3</code>.'},
  {task:'Иди, пока не соберёшь 3 звезды. Выведи <code>print("Собрал")</code>.', win:{prints:['Собрал']}});
ovr(7,4,
  {task:'Используй <code>while can_move()</code> два раза с поворотом между.'},
  {task:'Два <code>while can_move()</code> с поворотом, потом выведи <code>print("Финиш")</code>.', win:{prints:['Финиш']}});
ovr(7,5,
  {task:'В коде бесконечный цикл — исправь, чтобы герой дошёл до флага.'},
  {task:'В коде бесконечный цикл — исправь. Добавь вывод <code>print("Ok")</code> в конце.', win:{prints:['Ok']}});
ovr(7,6,
  {task:'Иди, пока можно И пока не на финише.'},
  {task:'Используй двойное условие. После выведи <code>print("Стоп")</code>.', win:{prints:['Стоп']}});
ovr(7,7,
  {task:'Иди, пока можно. Внутри — if с проверкой звёзд.'},
  {task:'Иди, пока можно. Внутри — if, который шагает. После выведи <code>print("Хватит")</code>.', win:{prints:['Хватит']}});
ovr(7,8,
  {task:'Пройди 4 шага через while со счётчиком и выведи число шагов.'},
  {task:'Пройди 5 шагов через while, выведи число шагов и <code>print("Всё")</code>.', win:{prints:['5','Всё']}});
ovr(7,9,
  {task:'Дойди до флага: while can_move() вверх, поворот, while can_move() вправо.'},
  {task:'Дойди до флага двумя while can_move() и собери 2 звезды по пути.', stars:[[0,4],[4,0]], win:{stars:2}});

/* ===== МОДУЛЬ 9. Алгоритмы ===== */
ovr(8,0,
  {task:'Дойди до флага циклом for. Найди путь сам.'},
  {task:'Дойди до флага двумя циклами for и собери 2 звезды.', stars:[[0,3],[0,5]], win:{stars:2}});
ovr(8,1,
  {task:'Дойди до флага двумя циклами.'},
  {task:'Дойди до флага двумя циклами, собери 2 звезды.', stars:[[1,3],[4,4]], win:{stars:2}});
ovr(8,2,
  {task:'Дойди до флага через два <code>while can_move()</code>.'},
  {task:'Дойди до флага двумя while can_move(). Выведи <code>print("Готово")</code>.', win:{prints:['Готово']}});
ovr(8,3,
  {task:'Собери все звёзды и дойди до флага.'},
  {task:'Собери все звёзды и дойди до флага. Выведи <code>print("Собрано")</code>.', win:{prints:['Собрано']}});
ovr(8,4,
  {task:'Создай <code>go(n)</code>, дойди до флага двумя вызовами.'},
  {task:'Создай go(n) и turn_around(). Дойди до флага. Перед стартом выведи <code>print("Старт")</code>.', win:{prints:['Старт']}});
ovr(8,5,
  {task:'Пройди до флага через список направлений.'},
  {task:'Пройди до флага через список направлений. Выведи <code>print(len(path))</code>.', win:{prints:['6']}});
ovr(8,6,
  {task:'Иди, пока можешь. Если стена — поворачивай.'},
  {task:'Иди, пока можешь. Если стена — поворачивай. После выведи <code>print("Финиш")</code>.', win:{prints:['Финиш']}});
ovr(8,7,
  {task:'Дойди до флага через <code>while can_move()</code>.'},
  {task:'Дойди до флага через два <code>while can_move()</code>. Собери звезду.', stars:[[1,3]], win:{stars:1}});
ovr(8,8,
  {task:'Дойди до флага и собери 3 звезды.'},
  {task:'Дойди до флага, собери все звёзды, выведи количество.', win:{stars:3,prints:['3']}});
ovr(8,9,
  {task:'Пройди весь маршрут и собери 3 звезды.'},
  {task:'Пройди весь маршрут. Собери 3 звезды и выведи <code>print("Экзамен сдан")</code>.', win:{stars:3,prints:['Экзамен сдан']}});

/* ===== МОДУЛЬ 10. Творческий ===== */
ovr(9,0,
  {task:'Выведи три строки: <b>★</b>, <b>★★</b>, <b>★★★</b>.', win:{prints:['★','★★','★★★']}},
  {task:'Выведи 5 строк: ★, ★★, ★★★, ★★★★, ★★★★★.', win:{prints:['★','★★','★★★','★★★★','★★★★★']}});
ovr(9,1,
  {task:'Скажи <b>Привет</b> и выведи <b>Как дела?</b>', win:{says:['Привет'],prints:['Как дела?']}},
  {task:'Скажи <b>Привет</b>, выведи <b>1</b>, скажи <b>Пока</b>, выведи <b>2</b>.', win:{says:['Привет','Пока'],prints:['1','2']}});
ovr(9,2,
  {task:'Дойди до флага любым способом.'},
  {task:'Дойди до флага и собери звезду.', stars:[[3,3]], win:{stars:1}});
ovr(9,3,
  {task:'Собери все звёзды и выведи их число.'},
  {task:'Собери все звёзды. Выведи <code>print("Собрал", stars_collected())</code>.', win:{stars:4}});
ovr(9,4,
  {task:'Придумай <code>go(n)</code>, дойди до флага.'},
  {task:'Придумай go(n), дойди до флага и выведи <code>print("Финиш")</code>.', win:{prints:['Финиш']}});
ovr(9,5,
  {task:'Пройди лабиринт.'},
  {task:'Пройди лабиринт двумя <code>while can_move()</code>.'});
ovr(9,6,
  {task:'Пройди до флага и выведи число звёзд.'},
  {task:'Пройди до флага. Выведи число звёзд двумя строками.', win:{prints:['3','3']}});
ovr(9,7,
  {task:'Напиши любую программу без ошибок.'},
  {task:'Напиши программу: <code>print</code>, <code>say</code> и хотя бы одна команда движения.'});
ovr(9,8,
  {task:'Открой 🎨 Творческий режим и построй свой уровень.'},
  {task:'Открой 🎨 Творческий режим и построй уровень с 3+ звёздами и 2+ стенами.'});
ovr(9,9,
  {task:'Дойди до флага и собери 3 звезды. Ты справишься!'},
  {task:'Дойди до флага, собери 3 звезды и выведи <code>print("Победа!")</code>.', win:{stars:3,prints:['Победа!']}});

console.log('✅ levels-by-age.js загружен');
})();