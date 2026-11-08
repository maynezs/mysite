const G = {};
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = list => list[Math.floor(Math.random() * list.length)];
const shuffle = list => {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};
const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) [a, b] = [b, a % b];
    return a;
};
const round = x => Math.round(x * 1e6) / 1e6;
const ans = x => String(round(x)).replace('.', ',');
const fmt = x => ans(x).replace('-', '−');
const fr = (a, b) => `<span class="fr"><i>${a}</i><i>${b}</i></span>`;
const sq = x => `√<span class="sq">${x}</span>`;
const par = x => (x < 0 ? `(${fmt(x)})` : fmt(x));
const coefTerm = (k, v, first) => {
    if (k === 0) return '';
    const sign = k < 0 ? (first ? '−' : ' − ') : (first ? '' : ' + ');
    const abs = Math.abs(k);
    const body = v && abs === 1 ? v : fmt(abs) + v;
    return sign + body;
};
const polyText = terms => {
    let text = '';
    terms.forEach(([k, v]) => { text += coefTerm(k, v, text === ''); });
    return text || '0';
};
const options = list => '<ol class="opts">' + list.map(x => `<li>${x}</li>`).join('') + '</ol>';
const nonZero = (a, b) => {
    let x = 0;
    while (x === 0) x = R(a, b);
    return x;
};

G[1] = () => {
    if (Math.random() < 0.5) {
        const width = pick([175, 185, 195, 205, 215, 225]);
        const profile = pick([45, 50, 55, 60, 65, 70]);
        const rim = pick([14, 15, 16, 17]);
        const side = width * profile / 100;
        const diameter = rim * 25.4 + 2 * side;
        return {
            text: `Шина легкового автомобиля имеет маркировку <b>${width}/${profile} R${rim}</b>. Первое число – ширина шины в миллиметрах, второе – высота боковины в процентах от ширины, R${rim} – диаметр диска в дюймах (1 дюйм = 25,4 мм). Найдите диаметр колеса в миллиметрах.`,
            answer: ans(diameter),
            solution: `Высота боковины: ${width} · ${profile} / 100 = ${fmt(side)} мм.<br>Диаметр диска: ${rim} · 25,4 = ${fmt(rim * 25.4)} мм.<br>Диаметр колеса: ${fmt(rim * 25.4)} + 2 · ${fmt(side)} = ${fmt(diameter)} мм.`
        };
    }
    const fee = pick([300, 350, 400, 450, 500]);
    const minutes = pick([300, 400, 500]);
    const price = pick([2, 2.5, 3, 4]);
    const talked = minutes + R(5, 30) * 10;
    const total = fee + (talked - minutes) * price;
    return {
        text: `Тариф мобильной связи: абонентская плата ${fee} руб. в месяц, в неё входит ${minutes} минут разговоров. Каждая минута сверх пакета стоит ${fmt(price)} руб. За месяц абонент проговорил ${talked} минут. Сколько рублей он заплатил за месяц?`,
        answer: ans(total),
        solution: `Сверх пакета: ${talked} − ${minutes} = ${talked - minutes} мин.<br>Доплата: ${talked - minutes} · ${fmt(price)} = ${fmt((talked - minutes) * price)} руб.<br>Итого: ${fee} + ${fmt((talked - minutes) * price)} = ${fmt(total)} руб.`
    };
};

G[2] = () => {
    if (Math.random() < 0.5) {
        const tile = pick([20, 25, 40]);
        const a = tile * R(8, 20) / 100;
        const b = tile * R(8, 20) / 100;
        const pack = pick([6, 8, 10, 12]);
        const count = Math.round(a * 100 / tile) * Math.round(b * 100 / tile);
        const packs = Math.ceil(count / pack);
        return {
            text: `Пол комнаты имеет форму прямоугольника ${fmt(a)} м × ${fmt(b)} м. Его покрывают квадратной плиткой со стороной ${tile} см, в упаковке ${pack} плиток. Сколько упаковок нужно купить, чтобы покрыть весь пол?`,
            answer: ans(packs),
            solution: `По длине: ${fmt(a * 100)} / ${tile} = ${Math.round(a * 100 / tile)}, по ширине: ${fmt(b * 100)} / ${tile} = ${Math.round(b * 100 / tile)} плиток.<br>Всего ${count} плиток. ${count} / ${pack} ≈ ${fmt(count / pack)}, значит нужно ${packs} упаковок.`
        };
    }
    const price = R(4, 60) * 50;
    const discount = pick([5, 10, 15, 20, 25, 30, 40]);
    const result = price * (100 - discount) / 100;
    return {
        text: `Куртка стоила ${price} руб. Во время распродажи цену снизили на ${discount}%. Сколько рублей стоит куртка после снижения цены?`,
        answer: ans(result),
        solution: `${discount}% от ${price}: ${price} · ${discount} / 100 = ${fmt(price * discount / 100)} руб.<br>Новая цена: ${price} − ${fmt(price * discount / 100)} = ${fmt(result)} руб.`
    };
};

G[3] = () => {
    const scale = pick([100000, 200000, 250000, 500000, 1000000]);
    const cm = R(3, 18) + pick([0, 0.5]);
    const km = cm * scale / 100000;
    return {
        text: `Масштаб карты 1 : ${scale.toLocaleString('ru-RU')}. Расстояние между двумя посёлками на карте равно ${fmt(cm)} см. Каково расстояние между посёлками на местности в километрах?`,
        answer: ans(km),
        solution: `1 см на карте – это ${scale.toLocaleString('ru-RU')} см = ${fmt(scale / 100000)} км.<br>${fmt(cm)} · ${fmt(scale / 100000)} = ${fmt(km)} км.`
    };
};

G[4] = () => {
    const dayStart = R(1000, 5000);
    const dayUsed = R(80, 300);
    const nightStart = R(500, 3000);
    const nightUsed = R(40, 200);
    const dayPrice = pick([5.2, 5.6, 6.1, 6.4]);
    const nightPrice = pick([2.1, 2.4, 2.8, 3.2]);
    const total = dayUsed * dayPrice + nightUsed * nightPrice;
    return {
        text: `Двухтарифный счётчик в начале месяца показывал: день – ${dayStart} кВт·ч, ночь – ${nightStart} кВт·ч; в конце месяца: день – ${dayStart + dayUsed} кВт·ч, ночь – ${nightStart + nightUsed} кВт·ч. Дневной тариф ${fmt(dayPrice)} руб. за кВт·ч, ночной – ${fmt(nightPrice)} руб. Сколько рублей нужно заплатить за месяц?`,
        answer: ans(total),
        solution: `День: ${dayUsed} кВт·ч · ${fmt(dayPrice)} = ${fmt(dayUsed * dayPrice)} руб.<br>Ночь: ${nightUsed} кВт·ч · ${fmt(nightPrice)} = ${fmt(nightUsed * nightPrice)} руб.<br>Итого: ${fmt(total)} руб.`
    };
};

G[5] = () => {
    const [dx, dy] = pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]]);
    const cell = pick([1, 2, 5, 10]);
    const cols = Math.max(dx, 4) + 2;
    const rows = Math.max(dy, 4) + 2;
    const ax = 1;
    const ay = rows - 1;
    const distance = cell * Math.hypot(dx, dy);
    const figure = gridFigure(cols, rows,
        `<circle cx="${ax}" cy="${ay}" r=".22" class="pt"/><circle cx="${ax + dx}" cy="${ay - dy}" r=".22" class="pt"/>` +
        `<text x="${ax - .6}" y="${ay + .7}" class="lb">A</text><text x="${ax + dx + .3}" y="${ay - dy - .3}" class="lb">B</text>`);
    return {
        text: `На плане участка, изображённом на клетчатой бумаге, сторона клетки равна ${cell} м. Найдите расстояние по прямой между колодцем A и беседкой B в метрах.${figure}`,
        answer: ans(distance),
        solution: `По горизонтали ${dx} клеток, по вертикали ${dy}. По теореме Пифагора: ${sq(`${dx}² + ${dy}²`)} = ${Math.hypot(dx, dy)} клеток.<br>${Math.hypot(dx, dy)} · ${cell} = ${fmt(distance)} м.`
    };
};

G[6] = () => {
    if (Math.random() < 0.35) {
        const a = R(11, 99) / 10;
        const b = R(2, 9);
        const c = R(11, 99) / 10;
        const value = a * b - c;
        return {
            text: `Найдите значение выражения ${fmt(a)} · ${b} − ${fmt(c)}.`,
            answer: ans(value),
            solution: `${fmt(a)} · ${b} = ${fmt(a * b)}; ${fmt(a * b)} − ${fmt(c)} = ${fmt(value)}.`
        };
    }
    const dens = [2, 4, 5, 8, 10, 20, 25];
    const makeFraction = () => {
        const q = pick(dens);
        let p = R(1, q - 1);
        while (gcd(p, q) !== 1) p = R(1, q - 1);
        return [p, q];
    };
    const [a, b] = makeFraction();
    const [c, d] = makeFraction();
    const operation = pick(['+', '−', ':']);
    const value = operation === '+' ? a / b + c / d : operation === '−' ? a / b - c / d : (a / b) / (c / d);
    if (operation === ':' && ![1, 2, 4, 5, 8].includes(c)) return G[6]();
    return {
        text: `Найдите значение выражения ${fr(a, b)} ${operation} ${fr(c, d)}.`,
        answer: ans(value),
        solution: operation === ':'
            ? `${fr(a, b)} : ${fr(c, d)} = ${fr(a, b)} · ${fr(d, c)} = ${fr(a * d, b * c)} = ${fmt(value)}.`
            : `${fr(a, b)} = ${fmt(a / b)}, ${fr(c, d)} = ${fmt(c / d)}.<br>${fmt(a / b)} ${operation} ${fmt(c / d)} = ${fmt(value)}.`
    };
};

G[7] = () => {
    const m = R(3, 9);
    const inside = m * m + R(1, 2 * m);
    const values = new Set([inside]);
    const below = m * m - R(1, 2 * m - 2);
    const above = (m + 1) * (m + 1) + R(1, 2 * m + 2);
    values.add(below);
    values.add(above);
    values.add(m * m);
    const list = shuffle([...values]);
    const correct = list.indexOf(inside) + 1;
    return {
        text: `Какое из данных чисел заключено между числами ${m} и ${m + 1}?` + options(list.map(n => sq(n))),
        answer: String(correct),
        solution: `${m} = ${sq(m * m)}, ${m + 1} = ${sq((m + 1) * (m + 1))}. Нужно число под корнем строго между ${m * m} и ${(m + 1) * (m + 1)}: это ${sq(inside)}, вариант ${correct}.`
    };
};

G[8] = () => {
    const kind = R(1, 3);
    if (kind === 1) {
        const base = pick([2, 3]);
        const exp = base === 2 ? R(2, 6) : R(2, 4);
        const p = R(3, 9);
        const q = R(3, 9);
        const r = p + q - exp;
        return {
            text: `Найдите значение выражения ${fr(`${base}<sup>${p}</sup> · ${base}<sup>${q}</sup>`, `${base}<sup>${r}</sup>`)}.`,
            answer: ans(base ** exp),
            solution: `${base}<sup>${p}+${q}−${r}</sup> = ${base}<sup>${exp}</sup> = ${base ** exp}.`
        };
    }
    if (kind === 2) {
        const p = pick([2, 3, 5, 6, 7]);
        const a = R(1, 4);
        const b = R(2, 5);
        return {
            text: `Найдите значение выражения ${sq(p * a * a)} · ${sq(p * b * b)}.`,
            answer: ans(p * a * b),
            solution: `${sq(p * a * a)} · ${sq(p * b * b)} = ${sq(`${p * a * a} · ${p * b * b}`)} = ${sq(p * a * a * p * b * b)} = ${p * a * b}.`
        };
    }
    const squares = [4, 9, 16, 25, 36, 49];
    let a = R(10, 60);
    let b = R(2, 9);
    while (squares.includes(a) || squares.includes(b) || a === b) {
        a = R(10, 60);
        b = R(2, 9);
    }
    return {
        text: `Найдите значение выражения (${sq(a)} − ${sq(b)})(${sq(a)} + ${sq(b)}).`,
        answer: ans(a - b),
        solution: `По формуле разности квадратов: (${sq(a)})² − (${sq(b)})² = ${a} − ${b} = ${a - b}.`
    };
};

G[9] = () => {
    if (Math.random() < 0.5) {
        const root = R(-9, 9);
        const a = nonZero(-9, 9);
        let c = nonZero(-9, 9);
        while (c === a) c = nonZero(-9, 9);
        const b = R(-15, 15);
        const d = a * root + b - c * root;
        return {
            text: `Найдите корень уравнения ${polyText([[a, 'x'], [b, '']])} = ${polyText([[c, 'x'], [d, '']])}.`,
            answer: ans(root),
            solution: `${polyText([[a - c, 'x']])} = ${fmt(d - b)}, x = ${fmt(d - b)} : ${par(a - c)} = ${fmt(root)}.`
        };
    }
    const r1 = R(-9, 9);
    let r2 = R(-9, 9);
    while (r2 === r1) r2 = R(-9, 9);
    const p = -(r1 + r2);
    const q = r1 * r2;
    const big = Math.max(r1, r2);
    return {
        text: `Решите уравнение ${polyText([[1, 'x²'], [p, 'x'], [q, '']])} = 0. Если уравнение имеет более одного корня, в ответ запишите больший из корней.`,
        answer: ans(big),
        solution: `D = ${par(p)}² − 4 · ${par(q)} = ${p * p - 4 * q}, ${sq(p * p - 4 * q)} = ${Math.abs(r1 - r2)}.<br>x₁ = ${fmt(Math.min(r1, r2))}, x₂ = ${fmt(big)}. Больший корень: ${fmt(big)}.`
    };
};

G[10] = () => {
    const kind = R(1, 3);
    if (kind === 1) {
        const total = pick([20, 25, 40, 50]);
        const yellow = R(2, total / 2);
        const black = R(1, total - yellow - 1);
        return {
            text: `В фирме такси ${total} машин: ${black} чёрных, ${yellow} жёлтых, остальные – зелёные. По вызову выехала одна из машин, случайно оказавшаяся ближе всего к заказчику. Найдите вероятность того, что к нему приедет жёлтое такси.`,
            answer: ans(yellow / total),
            solution: `P = ${fr(yellow, total)} = ${fmt(yellow / total)}.`
        };
    }
    if (kind === 2) {
        const bad = R(2, 9) / 100;
        return {
            text: `Вероятность того, что новая шариковая ручка пишет плохо или не пишет, равна ${fmt(bad)}. Покупатель выбирает одну ручку. Найдите вероятность того, что она пишет хорошо.`,
            answer: ans(1 - bad),
            solution: `События противоположные: P = 1 − ${fmt(bad)} = ${fmt(1 - bad)}.`
        };
    }
    const sum = R(3, 11);
    const ways = 6 - Math.abs(sum - 7);
    const value = Math.round(ways / 36 * 100) / 100;
    return {
        text: `Игральную кость бросают дважды. Найдите вероятность того, что сумма выпавших очков равна ${sum}. Результат округлите до сотых.`,
        answer: ans(value),
        solution: `Всего исходов 6 · 6 = 36. Благоприятных исходов с суммой ${sum}: ${ways}.<br>P = ${fr(ways, 36)} ≈ ${fmt(value)}.`
    };
};

const SVG_DEFAULTS = {
    gr: 'stroke="#9aa3bd" stroke-opacity=".45" stroke-width=".04"',
    pt: 'fill="#4283d8"',
    ptf: 'fill="#7d8796"',
    lb: 'font-size=".8" font-weight="700" fill="#7d8796"',
    lb2: 'font-size="11" font-weight="700" fill="#7d8796"',
    tk: 'font-size=".7" fill="#7d8796"',
    ax: 'stroke="#7d8796" stroke-width=".06"',
    fn: 'stroke="#4283d8" stroke-width=".14" fill="none"',
    sh: 'fill="#4283d8" fill-opacity=".15" stroke="#4283d8" stroke-width="2"',
    shg: 'fill="#4283d8" fill-opacity=".15" stroke="#4283d8" stroke-width=".08"',
    dash: 'stroke="#7d8796" stroke-width="1.2" stroke-dasharray="4 3"'
};
const withDefaults = inner => inner.replace(/class="(\w+)"/g, (m, name) => `${m} ${SVG_DEFAULTS[name] || ''}`);
const svgBox = (w, h, inner, viewBox) =>
    `<svg class="fig" viewBox="${viewBox || `0 0 ${w} ${h}`}" xmlns="http://www.w3.org/2000/svg">${withDefaults(inner)}</svg>`;

function gridFigure(cols, rows, inner) {
    let lines = '';
    for (let x = 0; x <= cols; x++) lines += `<line x1="${x}" y1="0" x2="${x}" y2="${rows}" class="gr"/>`;
    for (let y = 0; y <= rows; y++) lines += `<line x1="0" y1="${y}" x2="${cols}" y2="${y}" class="gr"/>`;
    return svgBox(cols, rows, lines + inner, `-.8 -.8 ${cols + 1.6} ${rows + 1.6}`);
}

function plotFigure(fn, label) {
    const size = 6;
    let axes = `<line x1="${-size}" y1="0" x2="${size}" y2="0" class="ax"/><line x1="0" y1="${-size}" x2="0" y2="${size}" class="ax"/>`;
    axes += `<line x1="1" y1="-.2" x2="1" y2=".2" class="ax"/><line x1="-.2" y1="-1" x2=".2" y2="-1" class="ax"/>`;
    axes += `<text x="1" y=".9" class="tk">1</text><text x="-.8" y="-.8" class="tk">1</text>`;
    let path = '';
    let pen = false;
    for (let x = -size; x <= size; x += 0.05) {
        const y = fn(x);
        if (!isFinite(y) || Math.abs(y) > size) {
            pen = false;
            continue;
        }
        path += `${pen ? 'L' : 'M'}${x.toFixed(2)} ${(-y).toFixed(2)} `;
        pen = true;
    }
    return `<div class="plot">${label ? `<b>${label})</b>` : ''}` +
        svgBox(0, 0, axes + `<path d="${path}" class="fn"/>`, `${-size} ${-size} ${2 * size} ${2 * size}`) + '</div>';
}

G[11] = () => {
    const variants = shuffle([
        { fn: x => 2 * x + 1, text: 'y = 2x + 1', signs: 'k > 0, b > 0' },
        { fn: x => -2 * x + 1, text: 'y = −2x + 1', signs: 'k < 0, b > 0' },
        { fn: x => 2 * x - 1, text: 'y = 2x − 1', signs: 'k > 0, b < 0' },
        { fn: x => -2 * x - 1, text: 'y = −2x − 1', signs: 'k < 0, b < 0' }
    ]).slice(0, 3);
    const formulas = shuffle([0, 1, 2]);
    const letters = ['А', 'Б', 'В'];
    const plots = variants.map((v, i) => plotFigure(v.fn, letters[i])).join('');
    const formulaList = formulas.map((index, i) => `${i + 1}) ${variants[index].text}`).join('&nbsp;&nbsp;&nbsp;');
    const answer = variants.map((_, i) => formulas.indexOf(i) + 1).join('');
    return {
        text: `Установите соответствие между графиками функций и формулами, которые их задают. В ответ запишите цифры для А, Б, В подряд.<div class="plots">${plots}</div><p class="center">${formulaList}</p>`,
        answer,
        solution: variants.map((v, i) => `${letters[i]}: ${v.signs} → ${v.text}`).join('<br>') + `<br>Ответ: ${answer}.`
    };
};

G[12] = () => {
    if (Math.random() < 0.5) {
        const c = R(10, 40);
        const f = c * 1.8 + 32;
        return {
            text: `Перевести температуру из шкалы Цельсия в шкалу Фаренгейта позволяет формула t<sub>F</sub> = 1,8t<sub>C</sub> + 32. Сколько градусов по Фаренгейту соответствует ${c}° по Цельсию?`,
            answer: ans(f),
            solution: `t<sub>F</sub> = 1,8 · ${c} + 32 = ${fmt(c * 1.8)} + 32 = ${fmt(f)}.`
        };
    }
    const m = R(2, 12);
    const v = R(2, 10);
    const energy = m * v * v / 2;
    return {
        text: `Кинетическая энергия тела вычисляется по формуле E = ${fr('mv²', 2)}, где m – масса (кг), v – скорость (м/с). Найдите E (в джоулях), если m = ${m} кг, v = ${v} м/с.`,
        answer: ans(energy),
        solution: `E = ${fr(`${m} · ${v}²`, 2)} = ${fr(m * v * v, 2)} = ${fmt(energy)} Дж.`
    };
};

G[13] = () => {
    const a = nonZero(-5, 5);
    const root = R(-6, 6);
    const b = R(-10, 10);
    const c = a * root + b;
    const greater = a > 0;
    const sets = shuffle([
        { label: `(−∞; ${fmt(root)})`, correct: !greater },
        { label: `(${fmt(root)}; +∞)`, correct: greater },
        { label: `(−∞; ${fmt(-root)})`, correct: false },
        { label: `(${fmt(-root)}; +∞)`, correct: false }
    ]);
    if (root === 0) return G[13]();
    const unique = sets;
    const correct = unique.findIndex(s => s.correct) + 1;
    return {
        text: `Укажите решение неравенства ${polyText([[a, 'x'], [b, '']])} > ${fmt(c)}.` + options(unique.map(s => s.label)),
        answer: String(correct),
        solution: `${polyText([[a, 'x']])} > ${fmt(c - b)}. Делим на ${par(a)}${a < 0 ? ', знак меняется' : ''}: x ${greater ? '>' : '<'} ${fmt(root)}.<br>Ответ: вариант ${correct}.`
    };
};

G[14] = () => {
    const first = R(2, 15);
    const step = R(2, 8);
    const n = R(6, 15);
    const last = first + (n - 1) * step;
    if (Math.random() < 0.5) {
        return {
            text: `В амфитеатре ${n + 4} рядов. В первом ряду ${first} мест, а в каждом следующем на ${step} места больше, чем в предыдущем. Сколько мест в ${n}-м ряду?`,
            answer: ans(last),
            solution: `Арифметическая прогрессия: a₁ = ${first}, d = ${step}.<br>a<sub>${n}</sub> = ${first} + ${n - 1} · ${step} = ${last}.`
        };
    }
    const total = (first + last) * n / 2;
    return {
        text: `Бегун в первый день пробежал ${first} км, а каждый следующий день пробегал на ${step} км больше, чем в предыдущий. Сколько километров он пробежал за ${n} дней?`,
        answer: ans(total),
        solution: `a<sub>${n}</sub> = ${first} + ${n - 1} · ${step} = ${last}.<br>S = ${fr(`(${first} + ${last}) · ${n}`, 2)} = ${total} км.`
    };
};

G[15] = () => {
    const kind = R(1, 3);
    const triangle = svgBox(0, 0,
        `<polygon points="10,90 150,90 60,15" class="sh"/><text x="0" y="100" class="lb2">A</text><text x="152" y="100" class="lb2">B</text><text x="56" y="10" class="lb2">C</text>`,
        '-5 0 175 105');
    if (kind === 1) {
        const a = R(30, 80);
        const b = R(30, 160 - a);
        return {
            text: `В треугольнике ABC угол A равен ${a}°, угол B равен ${b}°. Найдите угол C. Ответ дайте в градусах.${triangle}`,
            answer: ans(180 - a - b),
            solution: `Сумма углов треугольника 180°: ∠C = 180° − ${a}° − ${b}° = ${180 - a - b}°.`
        };
    }
    if (kind === 2) {
        const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 12, 15]]);
        return {
            text: `В прямоугольном треугольнике катеты равны ${a} и ${b}. Найдите гипотенузу.`,
            answer: ans(c),
            solution: `По теореме Пифагора: c = ${sq(`${a}² + ${b}²`)} = ${sq(a * a + b * b)} = ${c}.`
        };
    }
    const side = R(4, 20) * 2;
    const angle = pick([30, 150]);
    const other = R(3, 15);
    const area = side * other * 0.5 / 2;
    return {
        text: `В треугольнике ABC AB = ${side}, AC = ${other}, угол A равен ${angle}°. Найдите площадь треугольника.${triangle}`,
        answer: ans(area),
        solution: `S = ${fr(1, 2)} · AB · AC · sin A = ${fr(1, 2)} · ${side} · ${other} · ${fr(1, 2)} = ${fmt(area)}.`
    };
};

G[16] = () => {
    const circle = svgBox(0, 0,
        `<circle cx="60" cy="60" r="50" class="sh"/><circle cx="60" cy="60" r="2" class="ptf"/><text x="64" y="58" class="lb2">O</text>`,
        '0 0 120 120');
    if (Math.random() < 0.5) {
        const central = R(20, 80) * 2;
        return {
            text: `Центральный угол AOB опирается на дугу AB и равен ${central}°. Найдите вписанный угол ACB, опирающийся на ту же дугу. Ответ дайте в градусах.${circle}`,
            answer: ans(central / 2),
            solution: `Вписанный угол равен половине центрального, опирающегося на ту же дугу: ${central}° : 2 = ${central / 2}°.`
        };
    }
    const r = R(3, 15);
    return {
        text: `Около квадрата описана окружность радиуса ${r}${sq(2)}. Найдите сторону квадрата.${circle}`,
        answer: ans(2 * r),
        solution: `Диагональ квадрата – диаметр: d = ${2 * r}${sq(2)}. Сторона a = d / ${sq(2)} = ${2 * r}.`
    };
};

G[17] = () => {
    const kind = R(1, 3);
    if (kind === 1) {
        const a = R(4, 20);
        const b = R(a + 2, 30);
        const h = R(3, 15);
        const figure = svgBox(0, 0, `<polygon points="10,80 150,80 115,20 45,20" class="sh"/><line x1="45" y1="20" x2="45" y2="80" class="dash"/>`, '0 10 160 80');
        return {
            text: `Основания трапеции равны ${a} и ${b}, высота равна ${h}. Найдите площадь трапеции.${figure}`,
            answer: ans((a + b) * h / 2),
            solution: `S = ${fr('a + b', 2)} · h = ${fr(`${a} + ${b}`, 2)} · ${h} = ${fmt((a + b) * h / 2)}.`
        };
    }
    if (kind === 2) {
        const d1 = R(3, 15) * 2;
        const d2 = R(3, 15) * 2;
        const figure = svgBox(0, 0, `<polygon points="80,5 150,50 80,95 10,50" class="sh"/><line x1="80" y1="5" x2="80" y2="95" class="dash"/><line x1="10" y1="50" x2="150" y2="50" class="dash"/>`, '0 0 160 100');
        return {
            text: `Диагонали ромба равны ${d1} и ${d2}. Найдите площадь ромба.${figure}`,
            answer: ans(d1 * d2 / 2),
            solution: `S = ${fr('d₁ · d₂', 2)} = ${fr(`${d1} · ${d2}`, 2)} = ${d1 * d2 / 2}.`
        };
    }
    const a = R(20, 80);
    const figure = svgBox(0, 0, `<polygon points="10,80 120,80 150,20 40,20" class="sh"/>`, '0 10 160 80');
    return {
        text: `Один из углов параллелограмма равен ${a}°. Найдите больший угол параллелограмма. Ответ дайте в градусах.${figure}`,
        answer: ans(Math.max(a, 180 - a)),
        solution: `Сумма соседних углов параллелограмма 180°: 180° − ${a}° = ${180 - a}°. Больший угол: ${Math.max(a, 180 - a)}°.`
    };
};

G[18] = () => {
    const kind = R(1, 2);
    if (kind === 1) {
        const base = R(3, 8);
        const h = R(2, 6);
        const shift = R(0, base);
        const pts = `1,${h + 1} ${1 + base},${h + 1} ${1 + shift},1`;
        return {
            text: `На клетчатой бумаге с размером клетки 1 × 1 изображён треугольник. Найдите его площадь.` +
                gridFigure(base + 2, h + 2, `<polygon points="${pts}" class="shg"/>`),
            answer: ans(base * h / 2),
            solution: `Основание ${base}, высота ${h}. S = ${fr(`${base} · ${h}`, 2)} = ${fmt(base * h / 2)}.`
        };
    }
    const bottom = R(4, 8);
    const top = R(1, bottom - 1);
    const h = R(2, 5);
    const left = R(0, bottom - top);
    const pts = `1,${h + 1} ${1 + bottom},${h + 1} ${1 + left + top},1 ${1 + left},1`;
    return {
        text: `На клетчатой бумаге с размером клетки 1 × 1 изображена трапеция. Найдите её площадь.` +
            gridFigure(bottom + 2, h + 2, `<polygon points="${pts}" class="shg"/>`),
        answer: ans((top + bottom) * h / 2),
        solution: `Основания ${top} и ${bottom}, высота ${h}. S = ${fr(`${top} + ${bottom}`, 2)} · ${h} = ${fmt((top + bottom) * h / 2)}.`
    };
};

const STATEMENTS = [
    ['Через любые две точки проходит не более одной прямой.', true],
    ['Вертикальные углы равны.', true],
    ['Сумма углов любого треугольника равна 180°.', true],
    ['Диагонали прямоугольника равны.', true],
    ['Диагонали ромба перпендикулярны.', true],
    ['В любой треугольник можно вписать окружность.', true],
    ['Площадь квадрата равна квадрату его стороны.', true],
    ['Все углы ромба равны.', false],
    ['Диагонали любого параллелограмма равны.', false],
    ['Сумма углов выпуклого четырёхугольника равна 180°.', false],
    ['Любой прямоугольник является квадратом.', false],
    ['Площадь треугольника равна произведению стороны на высоту.', false],
    ['Касательная к окружности параллельна радиусу, проведённому в точку касания.', false],
    ['Треугольник со сторонами 1, 2, 4 существует.', false]
];

G[19] = () => {
    const chosen = shuffle(STATEMENTS.filter(s => s[1])).slice(0, R(1, 2));
    const list = shuffle(chosen.concat(shuffle(STATEMENTS.filter(s => !s[1])).slice(0, 3 - chosen.length)));
    const answer = list.map((s, i) => (s[1] ? i + 1 : '')).join('');
    return {
        text: 'Какие из следующих утверждений верны? В ответ запишите номера верных утверждений без пробелов.' + options(list.map(s => s[0])),
        answer,
        solution: list.map((s, i) => `${i + 1}) ${s[1] ? 'верно' : 'неверно'}`).join('<br>') + `<br>Ответ: ${answer}.`
    };
};

G[20] = () => {
    if (Math.random() < 0.5) {
        const x = R(-6, 6);
        const y = R(-6, 6);
        const a = nonZero(1, 4);
        const b = nonZero(-4, 4);
        const c = nonZero(1, 4);
        let d = nonZero(-4, 4);
        while (a * d - b * c === 0) d = nonZero(-4, 4);
        const e = a * x + b * y;
        const f = c * x + d * y;
        return {
            text: `Решите систему уравнений:<div class="sys">${polyText([[a, 'x'], [b, 'y']])} = ${fmt(e)}<br>${polyText([[c, 'x'], [d, 'y']])} = ${fmt(f)}</div>`,
            answer: `(${fmt(x)}; ${fmt(y)})`,
            solution: `Умножим первое уравнение на ${c}, второе на ${a} и вычтем:<br>${polyText([[b * c - a * d, 'y']])} = ${fmt(e * c - f * a)}, y = ${fmt(y)}.<br>Подставим в первое: ${polyText([[a, 'x']])} = ${fmt(e - b * y)}, x = ${fmt(x)}.<br>Ответ: (${fmt(x)}; ${fmt(y)}).`
        };
    }
    const r1 = nonZero(-5, 5);
    let r2 = nonZero(-5, 5);
    while (r2 === r1 || r2 === -r1) r2 = nonZero(-5, 5);
    const s = r1 * r1 + r2 * r2;
    const p = r1 * r1 * r2 * r2;
    return {
        text: `Решите уравнение x⁴ − ${s}x² + ${p} = 0.`,
        answer: `${[-Math.abs(r1), -Math.abs(r2), Math.abs(r1), Math.abs(r2)].sort((a, b) => a - b).map(fmt).join('; ')}`,
        solution: `Замена t = x² ≥ 0: t² − ${s}t + ${p} = 0.<br>По теореме Виета t₁ = ${r1 * r1}, t₂ = ${r2 * r2}.<br>x² = ${r1 * r1} → x = ±${Math.abs(r1)}; x² = ${r2 * r2} → x = ±${Math.abs(r2)}.`
    };
};

G[21] = () => {
    if (Math.random() < 0.5) {
        const v = pick([12, 15, 18, 20, 24]);
        const u = pick([2, 3, 4]);
        const s = pick([35, 40, 45, 60, 72, 80]);
        const stop = pick([2, 3, 4, 5]);
        const total = s / (v + u) + s / (v - u) + stop;
        if (Math.abs(total * 4 - Math.round(total * 4)) > 1e-9) return G[21]();
        return {
            text: `Теплоход проходит по течению реки до пункта назначения ${s} км и после стоянки возвращается в пункт отправления. Скорость течения ${u} км/ч, стоянка длится ${stop} ч, в пункт отправления теплоход возвращается через ${fmt(total)} ч после отплытия. Найдите скорость теплохода в неподвижной воде.`,
            answer: `${v} км/ч`,
            solution: `Пусть x – скорость теплохода. ${fr(s, 'x + ' + u)} + ${fr(s, 'x − ' + u)} = ${fmt(total - stop)}.<br>Приводим к общему знаменателю и решаем квадратное уравнение, положительный корень больше ${u}: x = ${v}.<br>Ответ: ${v} км/ч.`
        };
    }
    const a = pick([10, 12, 15, 20, 24, 30]);
    const b = pick([15, 20, 30, 40, 60]);
    if (a === b) return G[21]();
    const together = a * b / (a + b);
    if (!Number.isInteger(together * 10)) return G[21]();
    return {
        text: `Первая труба наполняет бассейн за ${a} ч, вторая – за ${b} ч. За сколько часов наполнят бассейн обе трубы, работая одновременно?`,
        answer: `${fmt(together)} ч`,
        solution: `Производительности: ${fr(1, a)} и ${fr(1, b)} бассейна в час. Вместе: ${fr(1, a)} + ${fr(1, b)} = ${fr(a + b, a * b)}.<br>Время: ${fr(a * b, a + b)} = ${fmt(together)} ч.`
    };
};

G[22] = () => {
    const k = nonZero(-3, 3);
    const p = R(-4, 4);
    const q = nonZero(-3, 3);
    const fn = x => (x === p ? NaN : k * x + q);
    return {
        text: `Постройте график функции y = ${fr(polyText([[k, 'x²'], [q - k * p, 'x'], [-q * p, '']]), polyText([[1, 'x'], [-p, '']]))} и определите, при каких значениях m прямая y = m не имеет с графиком ни одной общей точки.`,
        answer: `m = ${fmt(k * p + q)}`,
        solution: `Числитель раскладывается: (${polyText([[1, 'x'], [-p, '']])})(${polyText([[k, 'x'], [q, '']])}). При x ≠ ${fmt(p)} функция y = ${polyText([[k, 'x'], [q, '']])}.<br>График – прямая с выколотой точкой (${fmt(p)}; ${fmt(k * p + q)}).` +
            plotFigure(fn, '') + `Прямая y = m не пересекает график только через выколотую точку: m = ${fmt(k * p + q)}.`
    };
};

G[23] = () => {
    if (Math.random() < 0.5) {
        const [a, b, c] = pick([[6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]);
        const h = a * b / c;
        return {
            text: `Катеты прямоугольного треугольника равны ${a} и ${b}. Найдите высоту, проведённую к гипотенузе.`,
            answer: fmt(h),
            solution: `Гипотенуза: ${sq(`${a}² + ${b}²`)} = ${c}.<br>Площадь: ${fr(`${a} · ${b}`, 2)} = ${a * b / 2}; также S = ${fr(`${c} · h`, 2)}.<br>h = ${fr(`${a} · ${b}`, c)} = ${fmt(h)}.`
        };
    }
    const ab = R(3, 12);
    const k = R(2, 4);
    const bc = R(3, 12);
    return {
        text: `Прямая, параллельная стороне AC треугольника ABC, пересекает стороны AB и BC в точках M и N. AB = ${ab * k}, MN = ${bc}, BM = ${ab}. Найдите AC.`,
        answer: fmt(bc * k),
        solution: `Треугольники MBN и ABC подобны по двум углам (соответственные углы при MN ∥ AC).<br>k = ${fr('AB', 'BM')} = ${fr(ab * k, ab)} = ${k}. AC = MN · k = ${bc} · ${k} = ${bc * k}.`
    };
};

const PROOFS = [
    {
        text: 'В параллелограмме ABCD точка E – середина стороны AB. Известно, что EC = ED. Докажите, что данный параллелограмм – прямоугольник.',
        solution: 'AE = EB, EC = ED, AD = BC (противоположные стороны), значит △AED = △BEC по трём сторонам. Отсюда ∠A = ∠B. Но ∠A + ∠B = 180° как соседние углы параллелограмма, значит ∠A = ∠B = 90°, и ABCD – прямоугольник.'
    },
    {
        text: 'Биссектрисы углов B и C трапеции ABCD (AD ∥ BC) пересекаются в точке O, лежащей на стороне AD. Докажите, что точка O равноудалена от прямых AB, BC и CD.',
        solution: 'Любая точка биссектрисы угла равноудалена от его сторон. O лежит на биссектрисе угла B, значит равноудалена от AB и BC. O лежит на биссектрисе угла C, значит равноудалена от BC и CD. Следовательно, O равноудалена от всех трёх прямых.'
    },
    {
        text: 'Точка M – середина отрезка AB, точка O – середина отрезка CD, причём отрезки AB и CD пересекаются в точке O = M. Докажите, что AC ∥ BD.',
        solution: 'AO = OB, CO = OD, ∠AOC = ∠BOD как вертикальные, значит △AOC = △BOD по двум сторонам и углу между ними. Отсюда ∠OAC = ∠OBD – это накрест лежащие углы при прямых AC, BD и секущей AB, значит AC ∥ BD.'
    },
    {
        text: 'В остроугольном треугольнике ABC проведены высоты AA₁ и CC₁. Докажите, что углы CC₁A₁ и CAA₁ равны.',
        solution: 'Точки A₁ и C₁ видят отрезок AC под прямым углом, значит лежат на окружности с диаметром AC. Вписанные углы CC₁A₁ и CAA₁ опираются на одну дугу CA₁, поэтому они равны.'
    }
];

G[24] = () => {
    const item = pick(PROOFS);
    return { text: item.text, answer: 'Доказательство', solution: item.solution };
};

G[25] = () => {
    if (Math.random() < 0.5) {
        const a = R(3, 12);
        const b = R(3, 12);
        const ratio = R(2, 4);
        return {
            text: `Основания трапеции равны ${a} и ${a * ratio}. Диагонали трапеции пересекаются в точке O. Площадь треугольника, образованного меньшим основанием и отрезками диагоналей, равна ${b}. Найдите площадь трапеции.`,
            answer: fmt(b * (1 + ratio) * (1 + ratio)),
            solution: `Треугольники при основаниях подобны с коэффициентом ${ratio}, площадь большего: ${b} · ${ratio}² = ${b * ratio * ratio}.<br>Боковые треугольники равновелики, каждый: ${b} · ${ratio} = ${b * ratio}.<br>S = ${b} + ${b * ratio * ratio} + 2 · ${b * ratio} = ${b * (1 + ratio) * (1 + ratio)}.`
        };
    }
    const [a, b, c] = pick([[6, 8, 10], [12, 16, 20], [18, 24, 30], [24, 32, 40]]);
    const r = (a + b - c) / 2;
    const big = c / 2;
    return {
        text: `Катеты прямоугольного треугольника равны ${a} и ${b}. Найдите расстояние между центрами вписанной и описанной окружностей.`,
        answer: Number.isInteger(Math.sqrt(big * big - 2 * big * r))
            ? fmt(Math.sqrt(big * big - 2 * big * r))
            : sq(fmt(big * big - 2 * big * r)),
        solution: `R = ${fr(c, 2)} = ${fmt(big)}, r = ${fr('a + b − c', 2)} = ${fmt(r)}.<br>По формуле Эйлера d² = R² − 2Rr = ${fmt(big * big)} − ${fmt(2 * big * r)} = ${fmt(big * big - 2 * big * r)}.<br>d = ${sq(fmt(big * big - 2 * big * r))} ≈ ${fmt(Math.round(Math.sqrt(big * big - 2 * big * r) * 100) / 100)}.`
    };
};

const TOPICS = {
    1: 'Практическая задача', 2: 'Практическая задача', 3: 'Практическая задача', 4: 'Практическая задача',
    5: 'Практическая задача', 6: 'Вычисления', 7: 'Числа на прямой', 8: 'Степени и корни', 9: 'Уравнения',
    10: 'Вероятность', 11: 'Графики функций', 12: 'Расчёты по формулам', 13: 'Неравенства', 14: 'Прогрессии',
    15: 'Треугольники', 16: 'Окружность', 17: 'Четырёхугольники', 18: 'Фигуры на клетках', 19: 'Анализ утверждений',
    20: 'Алгебра: уравнения', 21: 'Текстовая задача', 22: 'Функции и графики', 23: 'Геометрия: вычисление',
    24: 'Геометрия: доказательство', 25: 'Геометрия: сложная задача'
};
const GEOMETRY = [15, 16, 17, 18, 19, 23, 24, 25];
const makeTask = n => Object.assign({ n, topic: TOPICS[n] }, G[n]());

const ORIGINAL_WEIGHT = 2;

const extend = (n, ...extras) => {
    const variants = Array(ORIGINAL_WEIGHT).fill(G[n]).concat(extras);
    G[n] = () => pick(variants)();
};

extend(1, () => {
    const start = pick([100, 120, 150, 200]);
    const perKm = pick([18, 20, 22, 25, 30]);
    const km = R(4, 25);
    const total = start + perKm * km;
    return {
        text: `Поездка на такси стоит ${start} руб. за посадку и ${perKm} руб. за каждый километр пути. Сколько рублей стоит поездка длиной ${km} км?`,
        answer: ans(total),
        solution: `За путь: ${km} · ${perKm} = ${km * perKm} руб.<br>Итого: ${start} + ${km * perKm} = ${total} руб.`
    };
});

extend(2, () => {
    const old = R(4, 40) * 50;
    const percent = pick([10, 20, 25, 30, 40, 50]);
    const now = old * (100 + percent) / 100;
    return {
        text: `Билет в кино стоил ${old} руб., а теперь стоит ${fmt(now)} руб. На сколько процентов подорожал билет?`,
        answer: ans(percent),
        solution: `Рост цены: ${fmt(now)} − ${old} = ${fmt(now - old)} руб.<br>${fmt(now - old)} / ${old} · 100% = ${percent}%.`
    };
});

extend(3, () => {
    const usage = pick([6, 7, 8, 9, 10, 12]);
    const km = R(2, 9) * 50;
    const price = pick([52, 54, 56, 58, 60]);
    const liters = usage * km / 100;
    return {
        text: `Автомобиль расходует ${usage} л бензина на 100 км. Сколько рублей стоит бензин на поездку длиной ${km} км, если литр стоит ${price} руб.?`,
        answer: ans(liters * price),
        solution: `Расход: ${usage} · ${km} / 100 = ${fmt(liters)} л.<br>Стоимость: ${fmt(liters)} · ${price} = ${fmt(liters * price)} руб.`
    };
});

extend(4, () => {
    const a = R(10, 40);
    const b = R(8, 30);
    const price = pick([150, 200, 250, 300, 350]);
    const perimeter = 2 * (a + b);
    return {
        text: `Участок имеет форму прямоугольника ${a} м × ${b} м. Его обносят забором, метр которого стоит ${price} руб. Сколько рублей стоит забор для всего участка?`,
        answer: ans(perimeter * price),
        solution: `Периметр: 2 · (${a} + ${b}) = ${perimeter} м.<br>Стоимость: ${perimeter} · ${price} = ${perimeter * price} руб.`
    };
});

extend(5, () => {
    const a = R(3, 9);
    const b = R(2, 7);
    const cell = pick([1, 2, 5]);
    const cols = a + 2;
    const rows = b + 2;
    const figure = gridFigure(cols, rows, `<rect x="1" y="1" width="${a}" height="${b}" class="shg"/>`);
    const area = a * b * cell * cell;
    return {
        text: `На плане, изображённом на клетчатой бумаге, сторона клетки равна ${cell} м. Найдите площадь закрашенной грядки в квадратных метрах.${figure}`,
        answer: ans(area),
        solution: `Стороны грядки: ${a} · ${cell} = ${a * cell} м и ${b} · ${cell} = ${b * cell} м.<br>S = ${a * cell} · ${b * cell} = ${area} м².`
    };
});

extend(6, () => {
    const a = R(2, 9);
    const b = R(2, 9);
    const p = R(-4, -1);
    const q = R(2, 5);
    const value = a * b * Math.pow(10, p + q);
    return {
        text: `Найдите значение выражения (${a} · 10<sup>${fmt(p)}</sup>) · (${b} · 10<sup>${q}</sup>).`,
        answer: ans(value),
        solution: `${a} · ${b} = ${a * b}; 10<sup>${fmt(p)}</sup> · 10<sup>${q}</sup> = 10<sup>${fmt(p + q)}</sup>.<br>${a * b} · 10<sup>${fmt(p + q)}</sup> = ${fmt(value)}.`
    };
});

extend(7, () => {
    const pool = shuffle([[1, 2], [1, 4], [3, 4], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [5, 8], [7, 10]]).slice(0, 4);
    const values = pool.map(([a, b]) => a / b);
    const best = values.indexOf(Math.max(...values)) + 1;
    return {
        text: 'Какое из данных чисел наибольшее?' + options(pool.map(([a, b]) => fr(a, b))),
        answer: String(best),
        solution: pool.map(([a, b]) => `${fr(a, b)} = ${fmt(a / b)}`).join('; ') + `.<br>Наибольшее – вариант ${best}.`
    };
});

extend(8, () => {
    const a = pick([2, 3, 5]);
    const m = R(3, 7);
    const k = R(2, 4);
    const r = m + k - R(1, 3);
    const power = m + k - r;
    return {
        text: `Найдите значение выражения ${fr(`a<sup>${m}</sup> · a<sup>${k}</sup>`, `a<sup>${r}</sup>`)} при a = ${a}.`,
        answer: ans(Math.pow(a, power)),
        solution: `${fr(`a<sup>${m}</sup> · a<sup>${k}</sup>`, `a<sup>${r}</sup>`)} = a<sup>${m} + ${k} − ${r}</sup> = a<sup>${power}</sup> = ${a}<sup>${power}</sup> = ${Math.pow(a, power)}.`
    };
});

extend(9, () => {
    const a = R(2, 9);
    const x = R(-12, 12) * a;
    const b = R(-9, 9);
    const c = x / a + b;
    return {
        text: `Найдите корень уравнения ${fr('x', a)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${fmt(c)}.`,
        answer: ans(x),
        solution: `${fr('x', a)} = ${fmt(c)} ${b < 0 ? '+' : '−'} ${Math.abs(b)} = ${fmt(c - b)}.<br>x = ${fmt(c - b)} · ${a} = ${fmt(x)}.`
    };
});

extend(10, () => {
    const total = pick([20, 25, 40, 50]);
    const marked = R(2, total / 2);
    return {
        text: `В сборнике ${total} билетов по математике, в ${marked} из них встречается вопрос о вероятности. Найдите вероятность того, что в случайно выбранном билете есть этот вопрос.`,
        answer: ans(marked / total),
        solution: `P = ${fr(marked, total)} = ${fmt(marked / total)}.`
    };
});

extend(11, () => {
    const variants = shuffle([
        { fn: x => 2 / x, text: 'y = 2/x', hint: 'гипербола в I и III четвертях' },
        { fn: x => -2 / x, text: 'y = −2/x', hint: 'гипербола во II и IV четвертях' },
        { fn: x => x * x - 2, text: 'y = x² − 2', hint: 'парабола ветвями вверх, вершина (0; −2)' },
        { fn: x => -x * x + 2, text: 'y = −x² + 2', hint: 'парабола ветвями вниз, вершина (0; 2)' }
    ]).slice(0, 3);
    const formulas = shuffle([0, 1, 2]);
    const letters = ['А', 'Б', 'В'];
    const plots = variants.map((v, i) => plotFigure(v.fn, letters[i])).join('');
    const formulaList = formulas.map((index, i) => `${i + 1}) ${variants[index].text}`).join('&nbsp;&nbsp;&nbsp;');
    const answer = variants.map((_, i) => formulas.indexOf(i) + 1).join('');
    return {
        text: `Установите соответствие между графиками функций и формулами, которые их задают. В ответ запишите цифры для А, Б, В подряд.<div class="plots">${plots}</div><p class="center">${formulaList}</p>`,
        answer,
        solution: variants.map((v, i) => `${letters[i]}: ${v.hint} → ${v.text}`).join('<br>') + `<br>Ответ: ${answer}.`
    };
});

extend(12, () => {
    const current = R(2, 8);
    const resistance = R(3, 25);
    const power = current * current * resistance;
    return {
        text: `Мощность тока вычисляется по формуле P = I²R, где I – сила тока (А), R – сопротивление (Ом). Найдите R, если P = ${power} Вт, I = ${current} А.`,
        answer: ans(resistance),
        solution: `R = ${fr('P', 'I²')} = ${fr(power, current * current)} = ${resistance} Ом.`
    };
});

extend(13, () => {
    const a = R(1, 9);
    const less = Math.random() < 0.5;
    const sets = shuffle([
        { label: `(−${a}; ${a})`, correct: less },
        { label: `(−∞; −${a}) ∪ (${a}; +∞)`, correct: !less },
        { label: `(−∞; ${a})`, correct: false },
        { label: `(−${a}; +∞)`, correct: false }
    ]);
    const correct = sets.findIndex(s => s.correct) + 1;
    return {
        text: `Укажите решение неравенства x² − ${a * a} ${less ? '<' : '>'} 0.` + options(sets.map(s => s.label)),
        answer: String(correct),
        solution: `(x − ${a})(x + ${a}) ${less ? '<' : '>'} 0. Корни ±${a}, ветви параболы вверх, значит она ${less ? 'ниже оси между корнями' : 'выше оси вне корней'}.<br>Ответ: вариант ${correct}.`
    };
});

extend(14, () => {
    const first = pick([50, 100, 200, 300, 500]);
    const day = R(3, 7);
    const value = first * Math.pow(2, day - 1);
    return {
        text: `Число бактерий в колонии удваивается каждые сутки. В первые сутки их было ${first}. Сколько бактерий будет в ${day}-е сутки?`,
        answer: ans(value),
        solution: `Геометрическая прогрессия: b₁ = ${first}, q = 2.<br>b<sub>${day}</sub> = ${first} · 2<sup>${day - 1}</sup> = ${value}.`
    };
});

extend(15, () => {
    const base = R(20, 80);
    return {
        text: `В равнобедренном треугольнике ABC с основанием AC угол B равен ${180 - 2 * base}°. Найдите угол A. Ответ дайте в градусах.`,
        answer: ans(base),
        solution: `Углы при основании равны: ∠A = (180° − ${180 - 2 * base}°) / 2 = ${base}°.`
    };
}, () => {
    const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [12, 16, 20]]);
    return {
        text: `В прямоугольном треугольнике ABC с прямым углом C гипотенуза AB = ${c}, sin A = ${fr(a, c)}. Найдите BC.`,
        answer: ans(a),
        solution: `sin A = ${fr('BC', 'AB')}, значит BC = ${c} · ${fr(a, c)} = ${a}.`
    };
});

extend(16, () => {
    const [r, tangent, distance] = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15]]);
    return {
        text: `Из точки A проведена касательная AB к окружности с центром O (B – точка касания). Радиус окружности ${r}, AO = ${distance}. Найдите AB.`,
        answer: ans(tangent),
        solution: `Радиус в точку касания перпендикулярен касательной, △ABO прямоугольный.<br>AB = ${sq(`${distance}² − ${r}²`)} = ${sq(distance * distance - r * r)} = ${tangent}.`
    };
}, () => {
    const angle = R(15, 75);
    return {
        text: `Треугольник ABC вписан в окружность, сторона AB – её диаметр. Угол A равен ${angle}°. Найдите угол B. Ответ дайте в градусах.`,
        answer: ans(90 - angle),
        solution: `Вписанный угол C опирается на диаметр, ∠C = 90°.<br>∠B = 90° − ${angle}° = ${90 - angle}°.`
    };
});

extend(17, () => {
    const [a, b, d] = pick([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]]);
    return {
        text: `Стороны прямоугольника равны ${a} и ${b}. Найдите его диагональ.`,
        answer: ans(d),
        solution: `d = ${sq(`${a}² + ${b}²`)} = ${sq(a * a + b * b)} = ${d}.`
    };
}, () => {
    const d = R(2, 12) * 2;
    return {
        text: `Диагональ квадрата равна ${d}. Найдите площадь квадрата.`,
        answer: ans(d * d / 2),
        solution: `S = ${fr('d²', 2)} = ${fr(d * d, 2)} = ${d * d / 2}.`
    };
});

extend(18, () => {
    const base = R(3, 6);
    const height = R(2, 5);
    const shift = R(1, 3);
    const cols = base + shift + 2;
    const rows = height + 2;
    const points = `1,${rows - 1} ${1 + base},${rows - 1} ${1 + base + shift},1 ${1 + shift},1`;
    return {
        text: `На клетчатой бумаге с размером клетки 1 × 1 изображён параллелограмм. Найдите его площадь.${gridFigure(cols, rows, `<polygon points="${points}" class="shg"/>`)}`,
        answer: ans(base * height),
        solution: `Основание ${base}, высота ${height}.<br>S = ${base} · ${height} = ${base * height}.`
    };
});

STATEMENTS.push(
    ['Средняя линия трапеции равна полусумме оснований.', true],
    ['Если две стороны и угол между ними одного треугольника равны соответственно двум сторонам и углу между ними другого, то треугольники равны.', true],
    ['В прямоугольном треугольнике квадрат гипотенузы равен сумме квадратов катетов.', true],
    ['Вписанный угол, опирающийся на диаметр, прямой.', true],
    ['Любые два равнобедренных треугольника подобны.', false],
    ['Центр описанной окружности всегда лежит внутри треугольника.', false],
    ['Если в ромбе один угол прямой, то он не является квадратом.', false]
);

extend(20, () => {
    const r1 = R(-6, 3);
    const r2 = r1 + R(1, 6);
    return {
        text: `Решите неравенство ${polyText([[1, 'x²'], [-(r1 + r2), 'x'], [r1 * r2, '']])} ≤ 0.`,
        answer: `[${fmt(r1)}; ${fmt(r2)}]`,
        solution: `Корни трёхчлена по теореме Виета: x₁ = ${fmt(r1)}, x₂ = ${fmt(r2)}.<br>Ветви параболы вверх, значения ≤ 0 между корнями включительно.<br>Ответ: [${fmt(r1)}; ${fmt(r2)}].`
    };
}, () => {
    const a = nonZero(-5, 5);
    let root = R(1, 5);
    while (root === Math.abs(a)) root = R(1, 5);
    const b = root * root;
    const roots = [-a, -root, root].sort((x, y) => x - y);
    return {
        text: `Решите уравнение x³ ${a < 0 ? '−' : '+'} ${Math.abs(a)}x² = ${b}x ${a * b < 0 ? '−' : '+'} ${Math.abs(a * b)}.`,
        answer: roots.map(fmt).join('; '),
        solution: `x²(${polyText([[1, 'x'], [a, '']])}) − ${b}(${polyText([[1, 'x'], [a, '']])}) = 0 → (${polyText([[1, 'x'], [a, '']])})(x² − ${b}) = 0.<br>x = ${fmt(-a)} или x = ±${root}.<br>Ответ: ${roots.map(fmt).join('; ')}.`
    };
});

extend(21, () => {
    let slow = 0;
    let fast = 0;
    let hours = 0;
    let distance = 0;
    while (!distance) {
        slow = R(8, 20);
        const diff = pick([2, 3, 4, 5, 10]);
        hours = pick([1, 2, 3]);
        const s = hours * slow * (slow + diff) / diff;
        if (Number.isInteger(s) && s <= 300) {
            fast = slow + diff;
            distance = s;
        }
    }
    return {
        text: `Два велосипедиста одновременно отправились в пробег длиной ${distance} км. Первый ехал со скоростью на ${fast - slow} км/ч больше второго и прибыл к финишу на ${hours} ч раньше. Найдите скорость велосипедиста, пришедшего вторым.`,
        answer: ans(slow),
        solution: `Пусть v – скорость второго, тогда ${fr(distance, 'v')} − ${fr(distance, `v + ${fast - slow}`)} = ${hours}.<br>${distance} · ${fast - slow} = ${hours}v(v + ${fast - slow}), v² + ${fast - slow}v − ${distance * (fast - slow) / hours} = 0.<br>Положительный корень v = ${slow} км/ч.`
    };
}, () => {
    const massA = R(2, 8);
    const massB = R(2, 8);
    const percentA = pick([10, 20, 30, 40]);
    const percentB = pick([50, 60, 70, 80]);
    const mix = (massA * percentA + massB * percentB) / (massA + massB);
    return {
        text: `Смешали ${massA} кг ${percentA}-процентного раствора соли и ${massB} кг ${percentB}-процентного. Сколько процентов составляет концентрация получившегося раствора?`,
        answer: ans(Math.round(mix * 100) / 100),
        solution: `Соли: ${fmt(massA * percentA / 100)} + ${fmt(massB * percentB / 100)} = ${fmt((massA * percentA + massB * percentB) / 100)} кг.<br>Масса: ${massA + massB} кг.<br>${fmt((massA * percentA + massB * percentB) / 100)} / ${massA + massB} · 100% ≈ ${fmt(Math.round(mix * 100) / 100)}%.`
    };
});

extend(22, () => {
    const a = R(1, 2);
    const c = R(-1, 3);
    const fn = x => x * x - 2 * a * Math.abs(x) + c;
    return {
        text: `Постройте график функции y = x² − ${2 * a}|x| ${c < 0 ? '−' : '+'} ${Math.abs(c)} и определите, при каких значениях m прямая y = m имеет с графиком ровно три общие точки.`,
        answer: `m = ${fmt(c)}`,
        solution: `При x ≥ 0: y = (x − ${a})² ${c - a * a < 0 ? '−' : '+'} ${Math.abs(c - a * a)}, при x < 0 – симметрично. Минимумы в точках (±${a}; ${fmt(c - a * a)}), локальный максимум (0; ${fmt(c)}).` +
            plotFigure(fn, '') + `Ровно три общие точки – прямая через вершину (0; ${fmt(c)}): m = ${fmt(c)}.`
    };
});

extend(23, () => {
    const bk = R(3, 12);
    const kc = R(2, 10);
    const perimeter = 2 * (bk + bk + kc);
    return {
        text: `Биссектриса угла A параллелограмма ABCD пересекает сторону BC в точке K. Найдите периметр параллелограмма, если BK = ${bk}, CK = ${kc}.`,
        answer: ans(perimeter),
        solution: `∠BAK = ∠KAD = ∠BKA (накрест лежащие), △ABK равнобедренный: AB = BK = ${bk}.<br>BC = ${bk} + ${kc} = ${bk + kc}.<br>P = 2 · (${bk} + ${bk + kc}) = ${perimeter}.`
    };
}, () => {
    const ce = R(2, 8);
    const de = R(2, 9);
    const ae = pick([...Array(12)].map((_, i) => i + 1).filter(x => (ce * de) % x === 0));
    const be = ce * de / ae;
    return {
        text: `Хорды AB и CD окружности пересекаются в точке E. Известно, что AE = ${ae}, BE = ${be}, CE = ${ce}. Найдите DE.`,
        answer: ans(de),
        solution: `△AEC ∼ △DEB по двум углам, откуда AE · BE = CE · DE.<br>DE = ${fr(`${ae} · ${be}`, ce)} = ${de}.`
    };
});

PROOFS.push(
    {
        text: 'Докажите, что медиана прямоугольного треугольника, проведённая к гипотенузе, равна половине гипотенузы.',
        solution: 'Достроим треугольник до прямоугольника, отложив на продолжении медианы CM отрезок MD = CM. Диагонали четырёхугольника ACBD делятся точкой пересечения пополам и угол C прямой, значит это прямоугольник. Его диагонали равны: CD = AB, поэтому CM = AB / 2.'
    },
    {
        text: 'В трапеции ABCD с основаниями AD и BC диагонали пересекаются в точке O. Докажите, что площади треугольников AOB и COD равны.',
        solution: 'S(ABD) = S(ACD), так как у них общее основание AD и равные высоты (BC ∥ AD). Вычтем из обеих площадь треугольника AOD: S(AOB) = S(COD).'
    },
    {
        text: 'Докажите, что биссектрисы смежных углов перпендикулярны.',
        solution: 'Смежные углы в сумме дают 180°. Угол между биссектрисами равен сумме половин этих углов: 180° / 2 = 90°.'
    },
    {
        text: 'В параллелограмме ABCD точки M и N – середины сторон BC и AD. Докажите, что четырёхугольник AMCN – параллелограмм.',
        solution: 'MC = BC / 2 = AD / 2 = AN и MC ∥ AN, так как BC ∥ AD. Четырёхугольник, у которого две противоположные стороны равны и параллельны, – параллелограмм.'
    }
);

extend(25, () => {
    const m = R(2, 10);
    const n = R(2, 10);
    return {
        text: `Окружность, вписанная в прямоугольный треугольник, касается гипотенузы в точке, которая делит её на отрезки ${m} и ${n}. Найдите площадь треугольника.`,
        answer: ans(m * n),
        solution: `Катеты: r + ${m} и r + ${n}, гипотенуза ${m + n}. По теореме Пифагора (r + ${m})² + (r + ${n})² = ${m + n}², откуда r² + ${m + n}r = ${m * n}.<br>S = ${fr(1, 2)}(r + ${m})(r + ${n}) = ${fr(1, 2)}(r² + ${m + n}r + ${m * n}) = ${fr(1, 2)} · 2 · ${m * n} = ${m * n}.`
    };
});

const ICONS = {
    dice: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1.3"/><circle cx="16" cy="16" r="1.3"/><circle cx="12" cy="12" r="1.3"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/><path d="M9 8h6"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4"/><path d="M12 13v4M8 21h8M9 17h6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M5 19l1.4-1.4M17.6 6.4L19 5"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z"/>',
    touch: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    calc: '<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18.5h8"/>',
    ref: '<path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6 0-8 1.5z"/><path d="M12 6v14"/>',
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    printer: '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
const LOGO = '<svg viewBox="0 0 32 32"><path d="M7 9h18M16 4v10M8 21l8 7 8-7M8 21h16" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const PART_TASKS = { 1: [...Array(19)].map((_, i) => i + 1), 2: [20, 21, 22, 23, 24, 25] };
const MOCK_MINUTES = { 1: 90, 2: 145 };
const SECRET_TAPS = 5;
const SECRET_WINDOW_MS = 2500;
const AUTHOR_URL = 'https://vk.ru/archigpt';
const GRADE_THRESHOLDS = [[17, 5], [13, 4], [8, 3], [0, 2]];
const MIN_GEOMETRY = 2;

const state = { mode: null, part: 1, tasks: [], index: 0, answers: {}, revealed: {}, selfScores: {}, finished: false, startTime: 0 };
const settings = JSON.parse(localStorage.getItem('oge-settings') || '{"light":false,"touch":false,"solved":0}');
const $ = s => document.querySelector(s);
let timerHandle = 0;
let logoTaps = [];

const saveSettings = () => localStorage.setItem('oge-settings', JSON.stringify(settings));
const normalize = (text, n) => {
    let value = String(text).toLowerCase().replace(/<[^>]+>/g, '').replace(/\s+/g, '').replace(/−/g, '-').replace(/\./g, ',');
    if (n === 19) value = value.split('').sort().join('');
    return value;
};
const isCorrect = task => normalize(state.answers[task.n] || '', task.n) === normalize(task.answer, task.n) && (state.answers[task.n] || '') !== '';
const pointsFor = task => (task.n <= 19 ? (isCorrect(task) ? 1 : 0) : (state.selfScores[task.n] || 0));
const maxPoints = part => (part === 1 ? 19 : 12);

function applyLook() {
    document.body.classList.toggle('light', settings.light);
    document.body.classList.toggle('touch', settings.touch);
    $('#themeBtn').innerHTML = icon(settings.light ? 'moon' : 'sun');
    $('#touchBtn').classList.toggle('on', settings.touch);
}

function toast(text) {
    const box = $('#toast');
    box.textContent = text;
    box.classList.add('show');
    clearTimeout(box.hideTimer);
    box.hideTimer = setTimeout(() => box.classList.remove('show'), 1800);
}

function render(html) {
    $('#view').innerHTML = `<div class="view">${html}</div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showHome() {
    stopTimer();
    state.mode = null;
    const card = (color, ico, title, text, buttons) => `<div class="mode"><div class="mode-head"><div class="badge ${color}">${icon(ico)}</div><h3>${title}</h3></div><p>${text}</p><div class="row">${buttons}</div></div>`;
    render(`<div class="hero"><svg class="hero-deco" viewBox="0 0 32 32">${LOGO.slice(25, -6)}</svg><h1>Готовимся к ОГЭ!</h1><p>Все 25 типов заданий по образцу банка ФИПИ, каждый раз новые числа</p><div class="stats"><span class="chip">Решено: ${settings.solved}</span><span class="chip">Максимум: 31 балл</span></div></div>
    <div class="modes">
        ${card('b-blue', 'dice', 'Случайное задание', 'Одна задача любого или выбранного номера. Проверка ответа сразу.', '<button class="btn" onclick="startRandom()">Любое</button><button class="btn ghost" onclick="pickNumber()">Выбрать №</button>')}
        ${card('b-green', 'book', 'Тренировочный вариант', 'Можно подсмотреть ответ и краткое решение к каждому заданию.', '<button class="btn green" onclick="startVariant(\'train\',1)">Часть 1</button><button class="btn green" onclick="startVariant(\'train\',2)">Часть 2</button>')}
        ${card('b-gold', 'trophy', 'Пробный вариант', 'Как на экзамене: с таймером, результаты и оценка – только в конце.', '<button class="btn gold" onclick="startVariant(\'mock\',1)">Часть 1</button><button class="btn gold" onclick="startVariant(\'mock\',2)">Часть 2</button>')}
    </div>`);
}

function pickNumber() {
    const keys = Array.from({ length: 25 }, (_, i) => `<button class="btn ${i >= 19 ? 'gold' : 'ghost'}" onclick="closeSheet();startRandom(${i + 1})">${i + 1}</button>`).join('');
    openSheet('Номер задания', `<div class="pick">${keys}</div>`);
}

function startRandom(n) {
    state.mode = 'random';
    state.tasks = [makeTask(n || Math.floor(Math.random() * 25) + 1)];
    state.fixed = n || 0;
    state.index = 0;
    state.answers = {};
    state.revealed = {};
    renderTask();
}

function startVariant(mode, part) {
    Object.assign(state, { mode, part, index: 0, answers: {}, revealed: {}, selfScores: {}, finished: false, startTime: Date.now() });
    state.tasks = PART_TASKS[part].map(makeTask);
    startTimer();
    renderTask();
}

function startTimer() {
    stopTimer();
    timerHandle = setInterval(updateTimer, 1000);
}

function stopTimer() {
    clearInterval(timerHandle);
}

function updateTimer() {
    const box = $('#timer');
    if (!box) return;
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    const seconds = state.mode === 'mock' ? Math.max(0, MOCK_MINUTES[state.part] * 60 - elapsed) : elapsed;
    const clock = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(v => String(v).padStart(2, '0')).join(':');
    box.textContent = clock;
    if (state.mode === 'mock' && seconds === 0) finishMock();
}

function renderTask() {
    const task = state.tasks[state.index];
    const random = state.mode === 'random';
    const mock = state.mode === 'mock';
    const title = random ? 'Случайное задание' : `${mock ? 'Пробный' : 'Тренировочный'} вариант · часть ${state.part}`;
    const answered = state.tasks.filter(t => state.answers[t.n] || state.selfScores[t.n] !== undefined).length;
    const dots = random ? '' : '<div class="dots">' + state.tasks.map((t, i) => {
        const mark = state.revealed[t.n] && t.n <= 19 ? (isCorrect(t) ? 'ok' : 'bad') : (state.answers[t.n] || state.selfScores[t.n] !== undefined ? 'done' : '');
        return `<button class="dot ${i === state.index ? 'cur' : ''} ${mark}" onclick="goTo(${i})">${t.n}</button>`;
    }).join('') + '</div>';
    const part2 = task.n >= 20;
    const input = part2
        ? `<p class="topic">Задание с развёрнутым ответом: оформи решение в тетради${mock ? ', проверка – после завершения' : ''}</p>`
        : `<div class="answer-row"><input class="input" id="answer" inputmode="text" autocomplete="off" placeholder="Ответ" value="${state.answers[task.n] || ''}" oninput="saveAnswer(this.value)" onkeydown="if(event.key==='Enter')checkAnswer()">${mock ? '' : '<button class="btn" onclick="checkAnswer()">Проверить</button>'}</div>`;
    const controls = random
        ? `<button class="btn ghost" onclick="reveal()">Решение</button><button class="btn" onclick="startRandom(state.fixed)">Ещё задание</button>`
        : `<button class="btn ghost" ${state.index === 0 ? 'disabled' : ''} onclick="goTo(state.index-1)">Назад</button>` +
          (mock ? '' : '<button class="btn ghost" onclick="reveal()">Ответ и решение</button>') +
          (state.index < state.tasks.length - 1 ? '<button class="btn" onclick="goTo(state.index+1)">Далее</button>' : '') +
          (mock ? '<button class="btn gold" onclick="confirmFinish()">Завершить</button>' : '');
    render(`<div class="bar"><h2>${title}</h2>${random ? '' : '<span class="timer" id="timer">00:00:00</span>'}</div>
        ${random ? '' : `<div class="progress"><i style="width:${answered / state.tasks.length * 100}%"></i></div>`}${dots}
        <div class="task"><div class="task-head"><span class="num">№ ${task.n}</span><span class="topic">${task.topic}</span></div>
        <div class="task-text">${task.text}</div>${input}<div id="feedback">${feedbackHtml(task)}</div></div>
        <div class="row">${controls}</div>`);
    updateTimer();
}

function feedbackHtml(task) {
    if (!state.revealed[task.n]) return '';
    let html = '';
    if (task.n <= 19 && state.answers[task.n] !== undefined) {
        html += isCorrect(task)
            ? '<div class="verdict ok">Верно! +1 балл</div>'
            : `<div class="verdict bad">Неверно. Правильный ответ: ${task.answer}</div>`;
    }
    html += `<div class="solution"><b class="h">Ответ:</b> ${task.answer}<br><b class="h">Решение:</b><br>${task.solution}</div>`;
    if (task.n >= 20 && state.mode !== 'random') html += selfScoreHtml(task);
    return html;
}

function selfScoreHtml(task) {
    const buttons = [0, 1, 2].map(p => `<button class="btn small ghost ${state.selfScores[task.n] === p ? 'on' : ''}" onclick="setSelf(${task.n},${p})">${p}</button>`).join('');
    return `<div class="self"><span>Оцени своё решение:</span>${buttons}</div>`;
}

function saveAnswer(value) {
    state.answers[state.tasks[state.index].n] = value.trim();
}

function checkAnswer() {
    const task = state.tasks[state.index];
    if (state.mode === 'mock' || task.n >= 20) return;
    if (!state.answers[task.n]) return toast('Введи ответ');
    if (!state.revealed[task.n]) settings.solved += isCorrect(task) ? 1 : 0;
    saveSettings();
    reveal();
}

function reveal() {
    state.revealed[state.tasks[state.index].n] = true;
    const scroll = window.scrollY;
    renderTask();
    window.scrollTo(0, scroll);
}

function setSelf(n, points) {
    state.selfScores[n] = points;
    if (state.finished) return renderResult();
    reveal();
}

function goTo(i) {
    state.index = i;
    renderTask();
}

function confirmFinish() {
    const empty = state.part === 1 ? state.tasks.filter(t => !state.answers[t.n]).length : 0;
    openSheet('Завершить вариант?', `<p>${empty ? `Без ответа заданий: ${empty}.` : 'Все ответы на месте.'} После завершения ответы изменить нельзя.</p><div class="row"><button class="btn ghost" onclick="closeSheet()">Продолжить</button><button class="btn gold" onclick="closeSheet();finishMock()">Завершить</button></div>`);
}

function finishMock() {
    stopTimer();
    state.finished = true;
    state.tasks.forEach(t => { state.revealed[t.n] = true; });
    settings.solved += state.tasks.filter(isCorrect).length;
    saveSettings();
    renderResult();
}

function getGrade(total, geometry) {
    if (state.part === 2) return null;
    const grade = GRADE_THRESHOLDS.find(([min]) => total >= min)[1];
    return grade >= 3 && geometry < MIN_GEOMETRY ? 2 : grade;
}

function renderResult() {
    const total = state.tasks.reduce((sum, t) => sum + pointsFor(t), 0);
    const geometry = state.tasks.filter(t => GEOMETRY.includes(t.n)).reduce((sum, t) => sum + pointsFor(t), 0);
    const grade = getGrade(total, geometry);
    const minutes = Math.round((Date.now() - state.startTime) / 60000);
    const review = state.tasks.map(t => `<div class="task"><div class="task-head"><span class="num">№ ${t.n}</span><span class="topic">${t.topic}</span></div><div class="task-text">${t.text}</div>${t.n <= 19 ? `<p>Твой ответ: <b>${state.answers[t.n] || '–'}</b></p>` : ''}${feedbackHtml(t)}</div>`).join('');
    const gradeBox = grade ? `<div class="grade g${grade}">${grade}</div><h2>Оценка: ${grade}</h2>` : '<div class="grade gx">' + total + '</div><h2>Баллы за часть 2</h2><p class="topic">Оценка ставится по полному варианту или по части 1</p>';
    const scroll = window.scrollY;
    render(`<div class="task result">${gradeBox}<div class="score-line"><span>Баллы: ${total} из ${maxPoints(state.part)}</span><span>Геометрия: ${geometry}</span><span>Время: ${minutes} мин</span></div>
        ${grade && geometry < MIN_GEOMETRY ? '<p class="topic">Нужно не меньше 2 баллов за геометрию</p>' : ''}
        ${state.part === 2 ? '<p class="topic">Оцени каждое решение кнопками 0, 1, 2 ниже</p>' : ''}
        <div class="row"><button class="btn ghost" onclick="showHome()">На главную</button><button class="btn gold" onclick="startVariant('mock',${state.part})">Новый вариант</button></div></div>
        <div class="review">${review}</div>`);
    if (state.part === 2) window.scrollTo(0, scroll);
}

const BOARD_COLORS = ['#4283d8', '#2c5fa8', '#3dbe8b', '#2f8f7a', '#e07a7e', '#e58f5a', '#e3b04b', '#9b7be0', '#d77bb0', '#5bb8c9', '#8a94a6', '#1f2433'];
const BOARD_WIDTHS = [2, 4, 7, 11, 16];
const BOARD_ICONS = {
    pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 7l3 3"/>',
    line: '<path d="M5 19L19 5"/><circle cx="5" cy="19" r="1.6"/><circle cx="19" cy="5" r="1.6"/>',
    paper: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M4 14l5-4 4 3 3-2 4 3"/>',
    undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
    broom: '<path d="M19 3l-7 8"/><path d="M12 11l-3 1-5 8h10l2-6z"/><path d="M8 20l2-4M11 20l1-4"/>'
};
const board = { tool: 'pen', color: BOARD_COLORS[0], width: BOARD_WIDTHS[1], paper: true, strokes: [], current: null, ready: false };

function boardIcon(name) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${BOARD_ICONS[name]}</svg>`;
}

function openBoard() {
    closeSheet();
    if (!board.ready) setupBoard();
    $('#board').classList.add('show');
    resizeBoard();
}

function closeBoard() {
    $('#board').classList.remove('show');
}

function setupBoard() {
    const canvas = $('#boardCanvas');
    const events = window.PointerEvent
        ? [['pointerdown', startStroke], ['pointermove', moveStroke], ['pointerup', endStroke], ['pointercancel', endStroke]]
        : [['touchstart', startStroke], ['touchmove', moveStroke], ['touchend', endStroke], ['touchcancel', endStroke],
            ['mousedown', startStroke], ['mousemove', moveStroke], ['mouseup', endStroke]];
    events.forEach(([name, handler]) => canvas.addEventListener(name, handler));
    window.addEventListener('resize', () => { if ($('#board').classList.contains('show')) resizeBoard(); });
    board.ready = true;
    renderBoardBar();
}

function renderBoardBar() {
    const toolButton = (name, title, action, active) =>
        `<button class="tool${active ? ' on' : ''}" title="${title}" onclick="${action}">${boardIcon(name)}</button>`;
    const widths = BOARD_WIDTHS.map(w =>
        `<button class="tool${w === board.width ? ' on' : ''}" title="Толщина ${w}" onclick="setBoardWidth(${w})"><i class="bw" style="width:${w + 2}px;height:${w + 2}px"></i></button>`).join('');
    const colors = BOARD_COLORS.map(c =>
        `<button class="swatch${c === board.color ? ' on' : ''}" title="Цвет" style="background:${c}" onclick="setBoardColor('${c}')"></button>`).join('');
    $('#boardBar').innerHTML =
        `<div class="bgroup">${toolButton('pen', 'Кисть', "setBoardTool('pen')", board.tool === 'pen')}${toolButton('line', 'Прямая линия', "setBoardTool('line')", board.tool === 'line')}</div>` +
        `<div class="bgroup">${widths}</div><div class="bgroup colors">${colors}</div>` +
        `<div class="bgroup">${toolButton('paper', 'Фон доски', 'toggleBoardPaper()', board.paper)}${toolButton('undo', 'Отменить', 'undoStroke()')}` +
        `${toolButton('broom', 'Очистить', 'clearBoard()')}<button class="tool" title="Закрыть" onclick="closeBoard()">${icon('close')}</button></div>`;
    $('#board').classList.toggle('paper', board.paper);
}

function setBoardTool(tool) { board.tool = tool; renderBoardBar(); }
function setBoardWidth(width) { board.width = width; renderBoardBar(); }
function setBoardColor(color) { board.color = color; renderBoardBar(); }
function toggleBoardPaper() { board.paper = !board.paper; renderBoardBar(); }
function undoStroke() { board.strokes.pop(); drawBoard(); }
function clearBoard() { board.strokes = []; drawBoard(); }

function resizeBoard() {
    const canvas = $('#boardCanvas');
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(canvas.clientWidth * ratio);
    canvas.height = Math.round(canvas.clientHeight * ratio);
    canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
    drawBoard();
}

function boardPoint(e) {
    const rect = $('#boardCanvas').getBoundingClientRect();
    const source = e.changedTouches ? e.changedTouches[0] : e;
    return [source.clientX - rect.left, source.clientY - rect.top];
}

function startStroke(e) {
    e.preventDefault();
    if (e.pointerId !== undefined && e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId);
    const point = boardPoint(e);
    board.current = { tool: board.tool, color: board.color, width: board.width, points: [point, point] };
    drawBoard();
}

function moveStroke(e) {
    if (!board.current) return;
    if (e.cancelable) e.preventDefault();
    const point = boardPoint(e);
    if (board.current.tool === 'line') board.current.points[1] = point;
    else board.current.points.push(point);
    drawBoard();
}

function endStroke() {
    if (!board.current) return;
    board.strokes.push(board.current);
    board.current = null;
}

function drawBoard() {
    const canvas = $('#boardCanvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    board.strokes.concat(board.current ? [board.current] : []).forEach(stroke => {
        context.strokeStyle = stroke.color;
        context.lineWidth = stroke.width;
        context.beginPath();
        stroke.points.forEach(([x, y], i) => i ? context.lineTo(x, y) : context.moveTo(x, y));
        context.stroke();
    });
}

const REFERENCE = [
    ['Степени и корни', ['a<sup>m</sup> · a<sup>n</sup> = a<sup>m+n</sup>, a<sup>m</sup> : a<sup>n</sup> = a<sup>m−n</sup>, (a<sup>m</sup>)<sup>n</sup> = a<sup>mn</sup>', `${sq('ab')} = ${sq('a')} · ${sq('b')}, (${sq('a')})² = a`]],
    ['Формулы сокращённого умножения', ['(a ± b)² = a² ± 2ab + b²', 'a² − b² = (a − b)(a + b)']],
    ['Квадратное уравнение', ['ax² + bx + c = 0, D = b² − 4ac', `x = ${fr('−b ± ' + sq('D'), '2a')}`, 'Теорема Виета: x₁ + x₂ = −p, x₁ · x₂ = q для x² + px + q = 0']],
    ['Прогрессии', ['Арифметическая: a<sub>n</sub> = a₁ + d(n − 1), S<sub>n</sub> = ' + fr('(a₁ + a<sub>n</sub>)n', 2), 'Геометрическая: b<sub>n</sub> = b₁q<sup>n−1</sup>, S<sub>n</sub> = ' + fr('b₁(q<sup>n</sup> − 1)', 'q − 1')]],
    ['Вероятность', ['P = ' + fr('m', 'n') + ' – благоприятные / все исходы', 'P(не A) = 1 − P(A)']],
    ['Треугольник', ['Сумма углов 180°', 'S = ' + fr(1, 2) + 'ah = ' + fr(1, 2) + 'ab · sin C', 'Пифагор: c² = a² + b²', 'sin A = ' + fr('противолежащий', 'гипотенуза') + ', cos A = ' + fr('прилежащий', 'гипотенуза')]],
    ['Четырёхугольники', ['Параллелограмм: S = ah', 'Ромб: S = ' + fr('d₁d₂', 2), 'Трапеция: S = ' + fr('a + b', 2) + ' · h']],
    ['Окружность', ['C = 2πR, S = πR²', 'Вписанный угол равен половине центрального', 'Радиус ⟂ касательной в точке касания']],
    ['Шкала оценок ФИПИ (31 балл)', ['«2»: 0–7, «3»: 8–14, «4»: 15–21, «5»: 22–31', 'Не менее 2 баллов за геометрию (№ 15–19, 23–25)', 'Только часть 1 (19 баллов): «3» от 8, «4» от 13, «5» от 17']]
];
const CALC_KEYS = ['C', '(', ')', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '√', '0', ',', '=', 'x²', '^', '⌫', 'π'];
let calcExpression = '';

function openSheet(title, body) {
    $('#sheetTitle').textContent = title;
    $('#sheetBody').innerHTML = body;
    $('#overlay').classList.add('show');
}

function closeSheet() {
    $('#overlay').classList.remove('show');
}

const TRIG_ANGLES = [
    ['0°', '0', '1', '0'], ['30°', fr(1, 2), fr(sq(3), 2), fr(sq(3), 3)], ['45°', fr(sq(2), 2), fr(sq(2), 2), '1'],
    ['60°', fr(sq(3), 2), fr(1, 2), sq(3)], ['90°', '1', '0', '–'], ['120°', fr(sq(3), 2), '−' + fr(1, 2), '−' + sq(3)],
    ['135°', fr(sq(2), 2), '−' + fr(sq(2), 2), '−1'], ['150°', fr(1, 2), '−' + fr(sq(3), 2), '−' + fr(sq(3), 3)], ['180°', '0', '−1', '0']
];

function squaresTable() {
    const head = '<tr><th></th>' + [...Array(10)].map((_, u) => `<th>${u}</th>`).join('') + '</tr>';
    const rows = [...Array(9)].map((_, t) =>
        `<tr><th>${t + 1}</th>` + [...Array(10)].map((_, u) => `<td>${((t + 1) * 10 + u) ** 2}</td>`).join('') + '</tr>').join('');
    return `<h4>Таблица квадратов (10–99)</h4><p class="hint">Строка – десятки, столбец – единицы</p><div class="tbl"><table>${head}${rows}</table></div>`;
}

function trigTables() {
    const special = TRIG_ANGLES.map(([a, s, c, t]) => `<tr><th>${a}</th><td>${s}</td><td>${c}</td><td>${t}</td></tr>`).join('');
    return '<h4>Синусы и косинусы основных углов</h4><div class="tbl"><table class="trig"><tr><th>α</th><th>sin α</th><th>cos α</th><th>tg α</th></tr>' + special + '</table></div>';
}

function openReference() {
    openSheet('Справочник', '<div class="ref">' + REFERENCE.map(([title, lines]) => `<h4>${title}</h4>` + lines.map(l => `<p>${l}</p>`).join('')).join('') + squaresTable() + trigTables() + '</div>');
}

function openCalculator() {
    const keys = CALC_KEYS.map(k => `<button class="btn ${/[0-9,]/.test(k) ? 'ghost' : k === '=' ? 'gold' : ''}" onclick="calcPress('${k}')">${k}</button>`).join('');
    openSheet('Калькулятор', `<div class="calc-screen"><small id="calcHint"></small><span id="calcView">${calcExpression || '0'}</span></div><div class="calc-keys">${keys}</div>`);
}

function calcPress(key) {
    const hint = $('#calcHint');
    hint.textContent = '';
    if (key === 'C') calcExpression = '';
    else if (key === '⌫') calcExpression = calcExpression.slice(0, -1);
    else if (key === 'x²') calcExpression += '^2';
    else if (key === '√') calcExpression += '√(';
    else if (key === '=') {
        const result = evaluate(calcExpression);
        hint.textContent = calcExpression + ' =';
        calcExpression = result === null ? '' : fmt(Math.round(result * 1e10) / 1e10).replace('−', '-');
        if (result === null) hint.textContent = 'Ошибка в выражении';
    } else calcExpression += key;
    $('#calcView').textContent = calcExpression || '0';
}

function evaluate(expression) {
    const code = expression.replace(/,/g, '.').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
        .replace(/π/g, '(Math.PI)').replace(/√/g, 'Math.sqrt').replace(/\^/g, '**');
    if (!/^[0-9+\-*/().\sMathsqrtPI]*$/.test(code)) return null;
    try {
        const value = Function(`"use strict";return (${code})`)();
        return typeof value === 'number' && isFinite(value) ? value : null;
    } catch (e) {
        return null;
    }
}

function onLogoTap() {
    const now = Date.now();
    logoTaps = logoTaps.filter(t => now - t < SECRET_WINDOW_MS).concat(now);
    if (logoTaps.length < SECRET_TAPS) return showHome();
    logoTaps = [];
    openSheet('Секретная печать', `<p>Сформирую пробный вариант для печати: задания и отдельный лист с ответами и решениями. В окне печати выбери «Сохранить как PDF».</p>
        <div class="row"><button class="btn ghost" onclick="printVariant([1])">Часть 1</button><button class="btn ghost" onclick="printVariant([2])">Часть 2</button><button class="btn gold" onclick="printVariant([1,2])">Полный</button></div>`);
}

function printVariant(parts) {
    closeSheet();
    const numbers = parts.reduce((list, p) => list.concat(PART_TASKS[p]), []);
    const tasks = numbers.map(makeTask);
    const code = Math.floor(Math.random() * 9000) + 1000;
    const title = parts.length === 2 ? 'полный вариант' : `часть ${parts[0]}`;
    const taskHtml = tasks.map(t => `<div class="ptask"><b>${t.n}.</b> ${t.text}${t.n <= 19 ? '<div class="ans-line">Ответ: ______________________</div>' : ''}</div>`).join('');
    const rows = tasks.map(t => `<tr><td><b>${t.n}</b></td><td>${t.answer}</td><td>${t.solution}</td></tr>`).join('');
    $('#print').innerHTML = `<h1>Пробный вариант ОГЭ по математике № ${code}</h1><div class="meta">${title} · ФИ ученика: ________________________ · Класс: _____</div>
        ${parts.includes(1) ? '<h2>Часть 1</h2>' : ''}${taskHtml.replace('<div class="ptask"><b>20.</b>', '<h2>Часть 2</h2><div class="ptask"><b>20.</b>')}
        <div class="page"><h1>Ответы и решения · вариант № ${code}</h1><table><tr><th>№</th><th>Ответ</th><th>Краткое решение</th></tr>${rows}</table></div>`;
    const previousTitle = document.title;
    document.title = `Пробный вариант ОГЭ № ${code}`;
    setTimeout(() => {
        window.print();
        document.title = previousTitle;
    }, 300);
}

function initMax() {
    const webApp = window.WebApp;
    if (!webApp) return;
    if (webApp.ready) webApp.ready();
    if (webApp.expand) webApp.expand();
}

function detectFlexGap() {
    const probe = document.createElement('div');
    probe.style.cssText = 'display:flex;flex-direction:column;row-gap:1px;position:absolute;visibility:hidden';
    probe.appendChild(document.createElement('div'));
    probe.appendChild(document.createElement('div'));
    document.body.appendChild(probe);
    const supported = probe.scrollHeight === 1;
    document.body.removeChild(probe);
    document.documentElement.classList.toggle('no-flex-gap', !supported);
}

function init() {
    detectFlexGap();
    $('#logo').innerHTML = `<div class="logo-icon">${LOGO}</div><div><b>ОГЭ-тренажёр</b><small>Математика · 9 класс</small></div>`;
    $('#touchBtn').innerHTML = icon('touch');
    $('#calcBtn').innerHTML = icon('calc');
    $('#refBtn').innerHTML = icon('ref');
    $('#boardBtn').innerHTML = boardIcon('pen');
    $('#homeBtn').innerHTML = icon('home');
    $('#closeBtn').innerHTML = icon('close');
    $('#author').href = AUTHOR_URL;
    applyLook();
    initMax();
    showHome();
}

function toggleTheme() {
    settings.light = !settings.light;
    saveSettings();
    applyLook();
}

function toggleTouch() {
    settings.touch = !settings.touch;
    saveSettings();
    applyLook();
    toast(settings.touch ? 'Режим сенсорной панели включён' : 'Обычный режим');
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeSheet(); closeBoard(); } });
document.addEventListener('DOMContentLoaded', init);
