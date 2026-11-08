(function () {
    'use strict';

    const LIST_URL = '../trainers.html';
    const BUTTON_SIZE_PX = 44;
    const EDGE_OFFSET_PX = 12;

    function goBack() {
        if (window.history.length > 1) window.history.back();
        else window.location.href = LIST_URL;
    }

    function initMaxBackButton() {
        const webApp = window.WebApp;
        if (!webApp || !webApp.initData || !webApp.BackButton) return false;
        if (webApp.ready) webApp.ready();
        if (webApp.expand) webApp.expand();
        webApp.BackButton.show();
        webApp.BackButton.onClick(goBack);
        return true;
    }

    function isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
    }

    function createBackButton() {
        const button = document.createElement('a');
        button.href = LIST_URL;
        button.setAttribute('aria-label', 'К списку тренажёров');
        button.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" ' +
            'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>';
        button.style.cssText = [
            'position:fixed', 'z-index:9999', 'display:grid', 'place-items:center',
            `width:${BUTTON_SIZE_PX}px`, `height:${BUTTON_SIZE_PX}px`, 'border-radius:50%',
            `left:calc(${EDGE_OFFSET_PX}px + env(safe-area-inset-left))`,
            `bottom:calc(${EDGE_OFFSET_PX}px + env(safe-area-inset-bottom))`,
            'background:rgba(18,21,27,.82)', 'color:#d5dae1', 'border:1px solid rgba(255,255,255,.12)',
            'box-shadow:0 6px 18px rgba(0,0,0,.3)', 'backdrop-filter:blur(8px)', '-webkit-backdrop-filter:blur(8px)',
            'opacity:0', 'transition:opacity .3s ease', 'text-decoration:none'
        ].join(';');
        button.addEventListener('click', event => {
            event.preventDefault();
            goBack();
        });
        document.body.appendChild(button);
        requestAnimationFrame(() => { button.style.opacity = '1'; });
    }

    if (initMaxBackButton()) return;
    if (isStandalone()) createBackButton();
})();
