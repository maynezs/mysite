(function() {
            let currentClass = null;
            let questions = [];
            let secretVisible = false;

            const classBtns = document.querySelectorAll('.class-btn');
            const questionsDiv = document.getElementById('questionsArea');
            const checkBtn = document.getElementById('checkBtn');
            const newBtn = document.getElementById('newQuestBtn');
            const giftEye = document.getElementById('giftEye');
            const secretPanel = document.getElementById('secretPanel');
            const praisePanel = document.getElementById('praisePanel');

            function randomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            // ----- Текстовые шаблоны (Чебурашка и Гена) -----
            const templates = {
                addition: [
                    (a, b) => `Гена нашёл ${a} апельсинов, а Чебурашка принёс ещё ${b}. Сколько апельсинов стало?`,
                    (a, b) => `Чебурашка построил ${a} домиков из кубиков, а Гена добавил ${b} домиков. Сколько всего домиков?`,
                    (a, b) => `В коробке лежало ${a} конфет, Шапокляк положила ещё ${b}. Сколько конфет теперь?`,
                    (a, b) => `У Гены было ${a} воздушных шариков, ему подарили ещё ${b}. Сколько шариков стало?`,
                    (a, b) => `Чебурашка пригласил на день рождения ${a} друзей, а потом пришли ещё ${b}. Сколько всего гостей?`
                ],
                subtraction: [
                    (a, b) => `У Чебурашки было ${a} апельсинов, он съел ${b}. Сколько осталось?`,
                    (a, b) => `Гена принёс ${a} кирпичей для стройки, ${b} кирпичей использовали. Сколько кирпичей осталось?`,
                    (a, b) => `В корзине лежало ${a} яблок, ${b} забрала Шапокляк. Сколько яблок осталось?`,
                    (a, b) => `Чебурашка нарисовал ${a} картинок, ${b} подарил друзьям. Сколько картинок осталось?`,
                    (a, b) => `У Гены было ${a} монет, он купил мороженое за ${b} монет. Сколько монет осталось?`
                ],
                multiplication: [
                    (a, b) => `У Чебурашки ${a} карманов, в каждом лежит по ${b} апельсинов. Сколько всего апельсинов?`,
                    (a, b) => `Гена посадил ${a} рядов деревьев, в каждом ряду по ${b} деревьев. Сколько деревьев посадил Гена?`,
                    (a, b) => `В ${a} ящиках лежит по ${b} кг апельсинов. Сколько всего килограммов?`,
                    (a, b) => `Чебурашка разложил ${a} тарелок с пирожными, на каждой по ${b} пирожных. Сколько пирожных?`,
                    (a, b) => `Шапокляк поймала ${a} крысок Ларисок, у каждой по ${b} бантиков. Сколько бантиков?`
                ],
                division: [
                    (a, b) => `${a} апельсинов раздали поровну ${b} друзьям. Сколько апельсинов получил каждый?`,
                    (a, b) => `Гена и Чебурашка собрали ${a} грибов и разделили поровну на ${b} корзин. Сколько грибов в каждой корзине?`,
                    (a, b) => `${a} литров лимонада разлили в ${b} бутылок поровну. Сколько литров в каждой бутылке?`,
                    (a, b) => `${a} конфет разделили поровну между ${b} детьми. Сколько конфет у каждого?`,
                    (a, b) => `Чебурашка хочет разложить ${a} игрушек в ${b} коробок поровну. Сколько игрушек в каждой коробке?`
                ]
            };

            // Генерация простого вопроса
            function generateSimpleQuestion(classLevel) {
                let type;
                if (classLevel === 1) {
                    type = randomInt(0, 1) === 0 ? 0 : 3; // сложение или вычитание
                } else {
                    type = randomInt(0, 3); // 0-сложение,1-умн,2-дел,3-вычит
                }

                let a, b, correct, text;

                // настройки сложности (упрощённые, но в пределах разумного)
                let maxSum, maxMult, maxDiv, maxSub;
                if (classLevel === 1) {
                    maxSum = 10; maxMult = 5; maxDiv = 5; maxSub = 10;
                } else if (classLevel === 2) {
                    maxSum = 20; maxMult = 5; maxDiv = 10; maxSub = 20;
                } else if (classLevel === 3) {
                    maxSum = 30; maxMult = 6; maxDiv = 12; maxSub = 30;
                } else {
                    maxSum = 50; maxMult = 9; maxDiv = 20; maxSub = 50;
                }

                if (type === 2) { // деление
                    if (classLevel === 1) {
                        correct = randomInt(1, 3);
                        b = randomInt(1, 3);
                    } else if (classLevel === 2) {
                        correct = randomInt(2, 5);
                        b = randomInt(1, 4);
                    } else if (classLevel === 3) {
                        correct = randomInt(3, 8);
                        b = randomInt(2, 6);
                    } else {
                        correct = randomInt(4, 12);
                        b = randomInt(2, 9);
                    }
                    a = correct * b;
                    const template = templates.division[randomInt(0, templates.division.length - 1)];
                    text = template(a, b);
                } else if (type === 1) { // умножение
                    if (classLevel === 1) {
                        a = randomInt(1, 3);
                        b = randomInt(1, 2);
                    } else if (classLevel === 2) {
                        a = randomInt(2, 4);
                        b = randomInt(2, 4);
                    } else if (classLevel === 3) {
                        a = randomInt(3, 6);
                        b = randomInt(3, 5);
                    } else {
                        a = randomInt(4, 8);
                        b = randomInt(4, 7);
                    }
                    correct = a * b;
                    const template = templates.multiplication[randomInt(0, templates.multiplication.length - 1)];
                    text = template(a, b);
                } else if (type === 3) { // вычитание
                    if (classLevel === 1) {
                        a = randomInt(2, maxSub);
                        b = randomInt(1, a - 1);
                    } else if (classLevel === 2) {
                        a = randomInt(5, maxSub);
                        b = randomInt(1, a - 1);
                    } else if (classLevel === 3) {
                        a = randomInt(10, maxSub);
                        b = randomInt(1, a - 1);
                    } else {
                        a = randomInt(15, maxSub);
                        b = randomInt(1, a - 1);
                    }
                    correct = a - b;
                    const template = templates.subtraction[randomInt(0, templates.subtraction.length - 1)];
                    text = template(a, b);
                } else { // сложение
                    if (classLevel === 1) {
                        a = randomInt(1, 6);
                        b = randomInt(1, 5);
                    } else if (classLevel === 2) {
                        a = randomInt(5, 12);
                        b = randomInt(3, 8);
                    } else if (classLevel === 3) {
                        a = randomInt(10, 18);
                        b = randomInt(5, 12);
                    } else {
                        a = randomInt(15, 30);
                        b = randomInt(7, 20);
                    }
                    correct = a + b;
                    const template = templates.addition[randomInt(0, templates.addition.length - 1)];
                    text = template(a, b);
                }
                return { text, correct };
            }

            // Составные задачи для 3 класса (теперь тоже про Чебурашку)
            function generateCompound3() {
                const variant = randomInt(1, 3);
                let a, b, c, d, correct, text;
                if (variant === 1) { // a * b + c
                    a = randomInt(2, 5);
                    b = randomInt(2, 4);
                    c = randomInt(3, 9);
                    correct = a * b + c;
                    text = `Гена принёс ${a} коробок по ${b} апельсинов и ещё ${c} апельсинов отдельно. Сколько всего апельсинов?`;
                } else if (variant === 2) { // a * b + c * d
                    a = randomInt(2, 4);
                    b = randomInt(2, 5);
                    c = randomInt(2, 4);
                    d = randomInt(2, 4);
                    correct = a * b + c * d;
                    text = `Чебурашка собрал ${a} пакетов по ${b} конфет, а Гена — ${c} пакетов по ${d} конфет. Сколько всего конфет?`;
                } else { // a - b * c
                    let attempts = 0;
                    do {
                        a = randomInt(20, 40);
                        b = randomInt(2, 4);
                        c = randomInt(2, 5);
                        correct = a - b * c;
                        attempts++;
                    } while (correct < 5 && attempts < 10);
                    if (correct < 5) correct = 10;
                    text = `У Шапокляк было ${a} рублей. Она купила ${b} билетов в кино по ${c} рублей. Сколько денег у неё осталось?`;
                }
                return { text, correct };
            }

            // Составные задачи для 4 класса
            function generateCompound4() {
                const variant = randomInt(1, 3);
                let a, b, c, d, e, f, correct, text;
                if (variant === 1) { // a * b + c * d + e
                    a = randomInt(2, 5);
                    b = randomInt(3, 6);
                    c = randomInt(2, 4);
                    d = randomInt(3, 5);
                    e = randomInt(5, 12);
                    correct = a * b + c * d + e;
                    text = `В первый день Чебурашка съел ${a} пачек печенья по ${b} штук, во второй — ${c} пачек по ${d} штук, и ещё ${e} конфет. Сколько всего сладостей?`;
                } else if (variant === 2) { // a * b + c * d - e
                    a = randomInt(2, 4);
                    b = randomInt(4, 7);
                    c = randomInt(2, 4);
                    d = randomInt(3, 5);
                    e = randomInt(5, 15);
                    let total = a * b + c * d;
                    if (total <= e) e = total - 2;
                    correct = total - e;
                    text = `Гена привёз ${a} ящиков лимонада по ${b} бутылок и ${c} ящиков по ${d} бутылок. ${e} бутылок выпили. Сколько бутылок осталось?`;
                } else { // a + b * c - d * e
                    a = randomInt(10, 25);
                    b = randomInt(2, 4);
                    c = randomInt(3, 5);
                    d = randomInt(2, 3);
                    e = randomInt(3, 6);
                    correct = a + b * c - d * e;
                    if (correct < 3) correct = a + b * c;
                    text = `У Чебурашки было ${a} наклеек. Ему подарили ${b} набора по ${c} наклеек, а потом он отдал ${d} наборов по ${e} наклеек Шапокляк. Сколько наклеек осталось?`;
                }
                return { text, correct };
            }

            function generateOptions(correct, classLevel) {
                let options = [correct];
                let spread = classLevel <= 2 ? 3 : 5;
                while (options.length < 4) {
                    let offset = randomInt(-spread, spread);
                    let variant = correct + offset;
                    if (variant < 1) variant = correct + 1;
                    if (!options.includes(variant) && variant > 0) {
                        options.push(variant);
                    }
                    if (options.length < 4) {
                        let candidate = correct + options.length;
                        if (!options.includes(candidate) && candidate > 0) options.push(candidate);
                    }
                }
                for (let i = options.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [options[i], options[j]] = [options[j], options[i]];
                }
                return options;
            }

            function generateQuestions(classLevel) {
                let qs = [];
                let compoundNeeded = (classLevel === 3 || classLevel === 4) ? 2 : 0;
                let compoundCount = 0;

                for (let i = 0; i < 5; i++) {
                    let qData;
                    if (compoundCount < compoundNeeded) {
                        if (classLevel === 3) {
                            qData = generateCompound3();
                        } else if (classLevel === 4) {
                            qData = generateCompound4();
                        } else {
                            qData = generateSimpleQuestion(classLevel);
                        }
                        compoundCount++;
                    } else {
                        qData = generateSimpleQuestion(classLevel);
                    }
                    let correct = qData.correct;
                    let options = generateOptions(correct, classLevel);
                    qs.push({
                        text: qData.text,
                        correct: correct,
                        options: options
                    });
                }
                return qs;
            }

            function renderQuestions() {
                if (!currentClass || !questions.length) {
                    questionsDiv.innerHTML = `<div style="text-align: center; color: #a7773a; font-size: 2rem; padding: 40px;">⟡ Выбери класс, друг ⟡</div>`;
                    return;
                }

                let html = '<div class="quest-list">';
                questions.forEach((q, idx) => {
                    const qid = `q_${idx}`;
                    html += `<div class="quest-card" id="card_${idx}" data-qidx="${idx}">`;
                    html += `<div class="quest-text">${q.text}</div>`;
                    html += `<div class="options">`;

                    q.options.forEach((optVal, optIdx) => {
                        const optId = `${qid}_opt_${optIdx}`;
                        html += `
                            <input type="radio" class="option-input" name="${qid}" value="${optVal}" id="${optId}" data-q="${idx}" data-val="${optVal}">
                            <label class="option-label" for="${optId}">${optVal}</label>
                        `;
                    });
                    html += `</div></div>`;
                });
                html += '</div>';
                questionsDiv.innerHTML = html;

                document.querySelectorAll('.option-input').forEach(radio => {
                    radio.addEventListener('change', function(e) {
                        const name = this.getAttribute('name');
                        document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
                            const label = document.querySelector(`label[for="${r.id}"]`);
                            if (label) label.classList.remove('selected');
                        });
                        const currentLabel = document.querySelector(`label[for="${this.id}"]`);
                        if (currentLabel) currentLabel.classList.add('selected');
                        const card = this.closest('.quest-card');
                        if (card) card.classList.remove('incorrect');
                        praisePanel.classList.remove('visible');
                    });
                });

                if (secretVisible) {
                    fillSecretPanel();
                } else {
                    secretPanel.classList.remove('visible');
                }
                praisePanel.classList.remove('visible');
            }

            function fillSecretPanel() {
                if (!questions.length) {
                    secretPanel.innerHTML = '<div class="secret-item">Нет задач</div>';
                    return;
                }
                let panelHtml = '';
                questions.forEach((q, i) => {
                    panelHtml += `<div class="secret-item">Задание ${i+1}: правильный ответ = <strong style="color:#c96f0e;">${q.correct}</strong></div>`;
                });
                secretPanel.innerHTML = panelHtml;
            }

            function checkAnswers() {
                if (!currentClass || !questions.length) {
                    alert('Сначала выбери класс, друг!');
                    return;
                }

                let allCorrect = true;
                document.querySelectorAll('.quest-card').forEach(c => c.classList.remove('incorrect'));

                for (let i = 0; i < questions.length; i++) {
                    const radios = document.getElementsByName(`q_${i}`);
                    let selectedValue = null;
                    for (let r of radios) {
                        if (r.checked) {
                            selectedValue = Number(r.value);
                            break;
                        }
                    }
                    const correctAnswer = questions[i].correct;
                    const card = document.getElementById(`card_${i}`);
                    if (selectedValue === null || selectedValue !== correctAnswer) {
                        allCorrect = false;
                        if (card) card.classList.add('incorrect');
                    }
                }

                if (allCorrect) {
                    praisePanel.classList.add('visible');
                } else {
                    praisePanel.classList.remove('visible');
                }
            }

            function resetAndRenderNew() {
                if (!currentClass) {
                    alert('Выбери класс!');
                    return;
                }
                questions = generateQuestions(currentClass);
                renderQuestions();
                secretVisible = false;
                secretPanel.classList.remove('visible');
                praisePanel.classList.remove('visible');
            }

            function selectClass(classNum) {
                currentClass = classNum;
                classBtns.forEach(btn => {
                    btn.classList.remove('active');
                    if (Number(btn.dataset.class) === classNum) btn.classList.add('active');
                });
                questions = generateQuestions(classNum);
                renderQuestions();
                secretVisible = false;
                secretPanel.classList.remove('visible');
                praisePanel.classList.remove('visible');
            }

            classBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const cls = Number(e.currentTarget.dataset.class);
                    selectClass(cls);
                });
            });

            checkBtn.addEventListener('click', checkAnswers);
            newBtn.addEventListener('click', resetAndRenderNew);

            giftEye.addEventListener('click', () => {
                if (!currentClass || !questions.length) {
                    alert('Сначала выбери класс.');
                    return;
                }
                secretVisible = !secretVisible;
                if (secretVisible) {
                    fillSecretPanel();
                    secretPanel.classList.add('visible');
                } else {
                    secretPanel.classList.remove('visible');
                }
            });
        })();
