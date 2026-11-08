(function() {
            // ---------- 30 ИСТОРИЙ ПРО MINECRAFT ----------
            const STORIES = [
                [ // 1
                    "Стив проснулся в своём доме.",
                    "Он взял кирку и пошёл в шахту.",
                    "В шахте он нашёл железо и уголь.",
                    "Вдруг он услышал шипение.",
                    "Это был крипер! Стив быстро убежал."
                ],
                [ // 2
                    "Крипер подкрался к Стиву.",
                    "Стив ударил крипера мечом.",
                    "Крипер взорвался и разрушил часть стены.",
                    "Стив восстановил стену из булыжника.",
                    "Теперь его дом стал больше."
                ],
                [ // 3
                    "Алекс захотела приручить волка.",
                    "Она взяла кости и пошла в лес.",
                    "Там она нашла двух волков.",
                    "Она покормила их костями.",
                    "Волки стали её друзьями."
                ],
                [ // 4
                    "Стив решил построить мост через реку.",
                    "Он нарубил дерево и сделал доски.",
                    "Потом он построил мост из досок.",
                    "По мосту можно было перейти реку.",
                    "Теперь Стив мог ходить в лес быстрее."
                ],
                [ // 5
                    "В небе появился дракон Края.",
                    "Стив приготовил алмазную броню и меч.",
                    "Он выпил зелье силы и прыгнул в портал.",
                    "Дракон атаковал, но Стив стрелял из лука.",
                    "Дракон побеждён! Стив получил яйцо дракона."
                ],
                [ // 6
                    "Стив нашёл сундук в заброшенной шахте.",
                    "В сундуке были золотые яблоки и алмазы.",
                    "Стив обрадовался и положил всё в рюкзак.",
                    "Вдруг из темноты вылез паук.",
                    "Стив убил паука мечом."
                ],
                [ // 7
                    "Житель деревни предложил Стиву сделку.",
                    "Он дал Стиву изумруды за пшеницу.",
                    "Стив собрал пшеницу с поля.",
                    "Он обменял пшеницу на изумруды.",
                    "На изумруды он купил алмазную кирку."
                ],
                [ // 8
                    "Стив захотел летать.",
                    "Он собрал порох у криперов и сделал фейерверки.",
                    "Он также сделал элитры из крыльев.",
                    "Стив надел элитры и запустил фейерверк.",
                    "Он полетел высоко в небо!"
                ],
                [ // 9
                    "Хрюн (свинья) Стива потерялась.",
                    "Стив искал её в лесу и в горах.",
                    "Наконец он нашёл её у озера.",
                    "Хрюн сидела и ела морковку.",
                    "Стив отвёл её домой и дал яблоко."
                ],
                [ // 10
                    "Стив построил ферму для тыкв.",
                    "Он посадил семена тыквы и ждал.",
                    "Тыквы выросли большие и оранжевые.",
                    "Стив сделал из тыкв пироги и фонарики.",
                    "Теперь у него всегда есть еда."
                ],
                [ // 11
                    "Стив пошёл в Нижний мир.",
                    "Там было много лавы и зомби-пиглинов.",
                    "Он нашёл крепость и сразился с ифритом.",
                    "Стив получил стержень ифрита.",
                    "Из стержня он сделал зелья."
                ],
                [ // 12
                    "Алекс решила построить маяк.",
                    "Она собрала много железа и сделала блоки.",
                    "Потом она добыла звезду Нижнего мира.",
                    "Алекс построила пирамиду из блоков.",
                    "Маяк засиял в небе!"
                ],
                [ // 13
                    "Стив захотел покататься на лодке.",
                    "Он срубил дерево и сделал вёсла.",
                    "Лодка получилась крепкой и красивой.",
                    "Стив поплыл по океану и увидел дельфинов.",
                    "Дельфины проводили его до затонувшего корабля."
                ],
                [ // 14
                    "В деревне появился разбойник.",
                    "Жители спрятались в домах.",
                    "Стив взял лук и стрелы.",
                    "Он выстрелил в разбойника и прогнал его.",
                    "Жители подарили Стиву изумруды."
                ],
                [ // 15
                    "Стив захотел приручить попугая.",
                    "Он нашёл джунгли и долго искал птицу.",
                    "Попугай сидел на дереве.",
                    "Стив дал ему семечко, и попугай сел на плечо.",
                    "Теперь у Стива есть весёлый друг."
                ],
                [ // 16
                    "Алекс пошла в храм в пустыне.",
                    "Внутри были ловушки и сундук.",
                    "Она осторожно обошла ловушки.",
                    "В сундуке лежали золотые яблоки и алмазы.",
                    "Алекс забрала сокровища и вернулась домой."
                ],
                [ // 17
                    "Стив решил сделать книгу с историями.",
                    "Он сделал бумагу из сахарного тростника.",
                    "Потом сделал книгу и перо.",
                    "Он записал свои приключения.",
                    "Книга получилась очень интересной."
                ],
                [ // 18
                    "Ночью на Стива напали зомби.",
                    "Он закрыл дверь и зажёг факелы.",
                    "Зомби ломились в дверь, но не сломали.",
                    "Утром Стив вышел и добил зомби мечом.",
                    "Он получил гнилую плоть, но выбросил её."
                ],
                [ // 19
                    "Стив нашёл яйцо черепахи на пляже.",
                    "Он огородил забором, чтобы не раздавили.",
                    "Из яиц вылупились маленькие черепашки.",
                    "Стив покормил их водорослями.",
                    "Черепашки поползли к океану."
                ],
                [ // 20
                    "Алекс захотела покататься на лошади.",
                    "Она нашла табун в степи.",
                    "Алекс выбрала белую лошадь и оседлала её.",
                    "Она привязала лошадь у дома.",
                    "Теперь они вместе путешествуют."
                ],
                [ // 21
                    "Стив увидел в небе воздушный шар.",
                    "Это был шар с сундуком.",
                    "Стив выстрелил из лука и сбил шар.",
                    "Сундук упал, из него выпали алмазы.",
                    "Стив был очень рад."
                ],
                [ // 22
                    "Подземный паук напал на Стива в пещере.",
                    "Стив отбивался мечом, но паук был силён.",
                    "Тогда Стив использовал лук и стрелы.",
                    "Паук убежал, оставив паутину.",
                    "Стив собрал паутину для лука."
                ],
                [ // 23
                    "Стив решил сделать ледяную дорогу.",
                    "Он набрал вёдра с водой в холодном биоме.",
                    "Вода замёрзла, и получился лёд.",
                    "Стив поставил лёд длинной полосой.",
                    "Теперь он быстро ездит на лодке по льду."
                ],
                [ // 24
                    "Алекс нашла книгу зачарований в сундуке.",
                    "Она положила книгу на наковальню.",
                    "Вместе с алмазным мечом она зачаровала его.",
                    "Меч стал светиться и бить сильнее.",
                    "Алекс назвала меч «Пылающий клинок»."
                ],
                [ // 25
                    "Стив пошёл ловить рыбу удочкой.",
                    "Он закинул удочку в воду и ждал.",
                    "Поплавок ушёл под воду!",
                    "Стив вытащил рыбу и старые сапоги.",
                    "Сапоги он выкинул, а рыбу пожарил."
                ],
                [ // 26
                    "В дом Стива залез лиловый странник.",
                    "Стив испугался и спрятался.",
                    "Странник оставил фиолетовый след.",
                    "Стив прочитал в книге, что это безвредно.",
                    "Он просто помыл пол водой."
                ],
                [ // 27
                    "Алекс построила башню из камня.",
                    "На самом верху она поставила стекло.",
                    "Из башни было видно весь лес.",
                    "Она увидела озеро и деревню.",
                    "Алекс обрадовалась красивому виду."
                ],
                [ // 28
                    "Стив научился варить зелья.",
                    "Он сварил зелье ночного зрения.",
                    "Потом зелье невидимости.",
                    "Стив выпил зелье и стал невидимым.",
                    "Он подкрался к криперу и напугал его."
                ],
                [ // 29
                    "Стив захотел сделать снежного голема.",
                    "Он поставил два снежных блока.",
                    "Сверху поставил тыкву.",
                    "Голем ожил и начал кидаться снежками.",
                    "Стив смеялся и играл с големом."
                ],
                [ // 30
                    "Алекс нашла нотный блок в пещере.",
                    "Она принесла его домой.",
                    "Алекс сделала из блоков музыку.",
                    "Получилась весёлая мелодия.",
                    "Все жители деревни пришли слушать."
                ]
            ];

            // ---------- Глобальные переменные ----------
            const sentenceListEl = document.getElementById('sentenceList');
            const checkBtn = document.getElementById('checkBtn');
            const newStoryBtn = document.getElementById('newStoryBtn');
            const teacherTrigger = document.getElementById('teacherTrigger'); // скрытая кнопка учителя
            const answerPanel = document.getElementById('answerPanel');
            const closeAnswerBtn = document.getElementById('closeAnswerBtn');
            const correctOrderList = document.getElementById('correctOrderList');
            const praiseToast = document.getElementById('praiseToast');

            let currentStory = [];           // правильный порядок предложений текущей истории
            let praiseTimer = null;           // для таймера скрытия тоста

            // ---------- Инициализация: случайная история, перемешать и отрисовать ----------
            function initGame() {
                const randomIndex = Math.floor(Math.random() * STORIES.length);
                currentStory = STORIES[randomIndex].slice(); // копия эталона

                // Перемешиваем предложения
                const shuffled = shuffleArray(currentStory.slice());

                renderList(shuffled);

                clearErrors();
                answerPanel.classList.add('hidden');
                hidePraise();
            }

            // Перемешивание массива (алгоритм Фишера-Йетса)
            function shuffleArray(arr) {
                const a = arr.slice();
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }
                return a;
            }

            // Отрисовка списка
            function renderList(sentences) {
                sentenceListEl.innerHTML = '';
                for (let s of sentences) {
                    const li = document.createElement('li');
                    li.className = 'sentence-item';

                    const span = document.createElement('span');
                    span.className = 'sentence-text';
                    span.textContent = s;

                    const btnGroup = document.createElement('div');
                    btnGroup.className = 'button-group';

                    const upBtn = document.createElement('button');
                    upBtn.className = 'move-btn up-btn';
                    upBtn.innerHTML = '▲';
                    upBtn.setAttribute('aria-label', 'Переместить вверх');

                    const downBtn = document.createElement('button');
                    downBtn.className = 'move-btn down-btn';
                    downBtn.innerHTML = '▼';
                    downBtn.setAttribute('aria-label', 'Переместить вниз');

                    btnGroup.appendChild(upBtn);
                    btnGroup.appendChild(downBtn);

                    li.appendChild(span);
                    li.appendChild(btnGroup);
                    sentenceListEl.appendChild(li);
                }
            }

            function clearErrors() {
                document.querySelectorAll('.sentence-item').forEach(item => {
                    item.classList.remove('error');
                });
            }

            function showPraise() {
                if (praiseTimer) clearTimeout(praiseTimer);
                praiseToast.classList.remove('hidden');
                praiseTimer = setTimeout(() => {
                    praiseToast.classList.add('hidden');
                    praiseTimer = null;
                }, 2500);
            }

            function hidePraise() {
                if (praiseTimer) {
                    clearTimeout(praiseTimer);
                    praiseTimer = null;
                }
                praiseToast.classList.add('hidden');
            }

            // Проверка порядка предложений
            function checkOrder() {
                const items = document.querySelectorAll('.sentence-item');
                const userOrder = Array.from(items).map(li => li.querySelector('.sentence-text').textContent);

                let allCorrect = true;
                items.forEach((li, index) => {
                    const text = li.querySelector('.sentence-text').textContent;
                    if (text !== currentStory[index]) {
                        li.classList.add('error');
                        allCorrect = false;
                    } else {
                        li.classList.remove('error');
                    }
                });

                if (allCorrect) showPraise();
                else hidePraise();

                return allCorrect;
            }

            // ---------- Обработчики событий ----------
            sentenceListEl.addEventListener('click', (e) => {
                const target = e.target;
                if (target.classList.contains('up-btn')) {
                    e.preventDefault();
                    const li = target.closest('.sentence-item');
                    if (!li) return;
                    const prevLi = li.previousElementSibling;
                    if (prevLi) {
                        li.parentNode.insertBefore(li, prevLi);
                        clearErrors();
                        hidePraise();
                    }
                } else if (target.classList.contains('down-btn')) {
                    e.preventDefault();
                    const li = target.closest('.sentence-item');
                    if (!li) return;
                    const nextLi = li.nextElementSibling;
                    if (nextLi) {
                        li.parentNode.insertBefore(nextLi, li);
                        clearErrors();
                        hidePraise();
                    }
                }
            });

            checkBtn.addEventListener('click', checkOrder);

            newStoryBtn.addEventListener('click', initGame);

            // ---------- Скрытая кнопка учителя (показать/скрыть правильный ответ) ----------
            function showCorrectAnswer() {
                correctOrderList.innerHTML = '';
                currentStory.forEach(sentence => {
                    const li = document.createElement('li');
                    li.textContent = sentence;
                    correctOrderList.appendChild(li);
                });
                answerPanel.classList.remove('hidden');
            }

            teacherTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                if (answerPanel.classList.contains('hidden')) {
                    showCorrectAnswer();
                } else {
                    answerPanel.classList.add('hidden');
                }
            });

            closeAnswerBtn.addEventListener('click', () => {
                answerPanel.classList.add('hidden');
            });

            // ---------- Запуск ----------
            initGame();
        })();
