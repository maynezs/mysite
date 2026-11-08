(function() {
            // ============ THREE.JS BACKGROUND ============
            const threeContainer = document.getElementById('three-bg');
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
            camera.position.z = 12;

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setClearColor(0x000000, 0);
            threeContainer.appendChild(renderer.domElement);

            // Wireframe shapes
            const shapes = [];
            const shapeMaterials = [];
            const geometries = [
                new THREE.IcosahedronGeometry(1.4, 1),
                new THREE.TorusKnotGeometry(0.7, 0.22, 100, 16),
                new THREE.OctahedronGeometry(1.0, 0),
                new THREE.TorusGeometry(1.1, 0.25, 16, 40),
                new THREE.TetrahedronGeometry(1.2, 0),
            ];

            const darkColors = [0x00f0ff, 0xb400ff, 0xff00aa, 0x4d7fff, 0x00ff88];
            const lightColors = [0x3388aa, 0x8855aa, 0xaa5588, 0x5566aa, 0x44aa77];

            geometries.forEach((geo, i) => {
                const wireframe = new THREE.WireframeGeometry(geo);
                const mat = new THREE.LineBasicMaterial({
                    color: darkColors[i],
                    transparent: true,
                    opacity: 0.55,
                    linewidth: 1,
                });
                const line = new THREE.LineSegments(wireframe, mat);
                line.position.set(
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 6 - 2
                );
                line.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                line.userData = {
                    rotSpeed: {
                        x: (Math.random() - 0.5) * 0.008,
                        y: (Math.random() - 0.5) * 0.01,
                        z: (Math.random() - 0.5) * 0.006,
                    },
                    floatSpeed: 0.003 + Math.random() * 0.007,
                    floatAmp: 0.4 + Math.random() * 1.2,
                    baseY: line.position.y,
                    baseX: line.position.x,
                };
                shapes.push(line);
                shapeMaterials.push(mat);
                scene.add(line);
            });

            // Particles
            const particlesGeo = new THREE.BufferGeometry();
            const particlesCount = 150;
            const positions = new Float32Array(particlesCount * 3);
            for (let i = 0; i < particlesCount * 3; i += 3) {
                positions[i] = (Math.random() - 0.5) * 20;
                positions[i + 1] = (Math.random() - 0.5) * 16;
                positions[i + 2] = (Math.random() - 0.5) * 10 - 3;
            }
            particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const particlesMat = new THREE.PointsMaterial({
                color: 0x00f0ff,
                size: 0.03,
                transparent: true,
                opacity: 0.5,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });
            const particles = new THREE.Points(particlesGeo, particlesMat);
            scene.add(particles);

            // Animation
            let time = 0;

            function animate() {
                requestAnimationFrame(animate);
                time += 0.016;
                shapes.forEach((shape) => {
                    shape.rotation.x += shape.userData.rotSpeed.x;
                    shape.rotation.y += shape.userData.rotSpeed.y;
                    shape.rotation.z += shape.userData.rotSpeed.z;
                    shape.position.y =
                        shape.userData.baseY + Math.sin(time * shape.userData.floatSpeed) * shape.userData
                        .floatAmp;
                    shape.position.x =
                        shape.userData.baseX + Math.cos(time * shape.userData.floatSpeed * 0.7) * shape
                        .userData.floatAmp * 0.5;
                });
                particles.rotation.y += 0.0004;
                particles.rotation.x += 0.0002;
                renderer.render(scene, camera);
            }
            animate();

            // Resize
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

            // ============ DARK / LIGHT MODE ============
            const html = document.documentElement;
            const body = document.body;
            const themeToggle = document.getElementById('themeToggle');
            const themeIcon = document.getElementById('themeIcon');
            let isDark = true;

            function updateThemeColors() {
                const colors = isDark ? darkColors : lightColors;
                shapeMaterials.forEach((mat, i) => {
                    mat.color.set(colors[i]);
                    mat.opacity = isDark ? 0.55 : 0.35;
                });
                particlesMat.opacity = isDark ? 0.5 : 0.25;
                particlesMat.color.set(isDark ? 0x00f0ff : 0x5577aa);
                threeContainer.style.opacity = isDark ? '0.85' : '0.45';
            }

            themeToggle.addEventListener('click', () => {
                isDark = !isDark;
                if (isDark) {
                    html.classList.add('dark');
                    html.classList.remove('light');
                    body.classList.add('dark');
                    body.classList.remove('light');
                    themeIcon.textContent = '🌙';
                    localStorage.setItem('theme', 'dark');
                } else {
                    html.classList.remove('dark');
                    html.classList.add('light');
                    body.classList.remove('dark');
                    body.classList.add('light');
                    themeIcon.textContent = '☀️';
                    localStorage.setItem('theme', 'light');
                }
                updateThemeColors();
            });

            // Load saved theme
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light') {
                isDark = false;
                html.classList.remove('dark');
                html.classList.add('light');
                body.classList.remove('dark');
                body.classList.add('light');
                themeIcon.textContent = '☀️';
                updateThemeColors();
            }

            // ============ TYPED TEXT EFFECT ============
            const typedTextEl = document.getElementById('typedText');
            const typedCursor = document.getElementById('typedCursor');
            const roles = [
                'Педагог математики и информатики',
                'Автор собственных методик преподавания',
                'Промпт-инженер',
                '3D-моделлер',
                'Руководитель Медиацентра «Луч»',
            ];
            let roleIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let typeSpeed = 70;
            const pauseBetween = 2000;

            function typeEffect() {
                const currentRole = roles[roleIndex];
                if (isDeleting) {
                    typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
                    charIndex--;
                    typeSpeed = 35;
                } else {
                    typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
                    charIndex++;
                    typeSpeed = 65;
                }

                if (!isDeleting && charIndex === currentRole.length) {
                    typeSpeed = pauseBetween;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    typeSpeed = 300;
                }
                setTimeout(typeEffect, typeSpeed);
            }
            typeEffect();

            // ============ SCROLL-TRIGGERED FADE-IN ============
            const fadeElements = document.querySelectorAll('.fade-in');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

            fadeElements.forEach((el) => observer.observe(el));

            // ============ STATS COUNTER ANIMATION ============
            const statNumbers = document.querySelectorAll('.stat-number');
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const target = parseInt(el.getAttribute('data-target'));
                        const suffix = el.getAttribute('data-suffix') || '';
                        const duration = 1800;
                        const startTime = performance.now();

                        function updateCounter(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            const current = Math.round(eased * target);
                            el.textContent = current + suffix;
                            if (progress < 1) {
                                requestAnimationFrame(updateCounter);
                            }
                        }
                        requestAnimationFrame(updateCounter);
                        statsObserver.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });

            statNumbers.forEach((el) => statsObserver.observe(el));

            // ============ STICKY HEADER SCROLL EFFECT ============
            const header = document.getElementById('header');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });

            // ============ MOBILE MENU ============
            const hamburger = document.getElementById('hamburger');
            const navLinks = document.getElementById('navLinks');
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('open');
                navLinks.classList.toggle('open');
                const isOpen = navLinks.classList.contains('open');
                hamburger.setAttribute('aria-expanded', isOpen);
            });
            // Close menu on link click
            navLinks.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('open');
                    hamburger.classList.remove('open');
                    hamburger.setAttribute('aria-expanded', 'false');
                });
            });

            // ============ CONTACT FORM (demo) ============
            const contactForm = document.getElementById('contactForm');

if (contactForm) contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    // Блокируем кнопку
    btn.disabled = true;
    btn.textContent = '⏳ Отправка...';
    btn.style.background = 'linear-gradient(135deg, #ffaa00, #ff8800)';

    // Собираем данные (убедитесь, что у полей есть атрибуты name)
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // Таймаут 10 секунд для fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch('https://formsubmit.co/ajax/vegduh@gmail.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            // Успех
            btn.textContent = '✅ Отправлено!';
            btn.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = 'linear-gradient(to right, #00f0ff, #b400ff)';
                contactForm.reset();
                btn.disabled = false;
            }, 2500);
        } else {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
    } catch (error) {
        clearTimeout(timeoutId);
        let errorMessage = '❌ Ошибка!';
        if (error.name === 'AbortError') {
            errorMessage = '⏱️ Таймаут! Повторите.';
        }
        btn.textContent = errorMessage;
        btn.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = 'linear-gradient(to right, #00f0ff, #b400ff)';
            btn.disabled = false;
        }, 3000);
    }
});

            console.log('%c🚀 Портфолио Александра Шебалкова загружено! %c| %cvk.com/archigpt',
                'color: #00f0ff; font-size: 1.1em; font-weight: bold;',
                '',
                'color: #b400ff;');
            console.log('%c✨ Стек: HTML5 + TailwindCSS + Three.js + Vanilla JS', 'color: #ff00aa;');
        })();
