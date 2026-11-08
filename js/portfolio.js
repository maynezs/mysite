(function () {
    'use strict';

    const SCROLL_THRESHOLD_PX = 50;

    const html = document.documentElement;
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    let isDark = localStorage.getItem('theme') !== 'light';

    function applyTheme() {
        html.classList.toggle('dark', isDark);
        html.classList.toggle('light', !isDark);
        body.classList.toggle('dark', isDark);
        body.classList.toggle('light', !isDark);
        themeIcon.textContent = isDark ? '🌙' : '☀️';
    }

    function closeMenu() {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        applyTheme();
    });

    hamburger.addEventListener('click', () => {
        const isOpen = !navLinks.classList.contains('open');
        navLinks.classList.toggle('open', isOpen);
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD_PX);
    });

    const observer = new IntersectionObserver(entries => {
        entries.filter(entry => entry.isIntersecting).forEach(entry => {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.fade-in').forEach(element => observer.observe(element));

    applyTheme();
})();
