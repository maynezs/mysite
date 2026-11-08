(function () {
    'use strict';

    const SERVICE_WORKER_URL = 'sw.js';

    const installButton = document.getElementById('installButton');
    const iosHint = document.getElementById('iosHint');
    let deferredPrompt = null;

    function isInsideMax() {
        const webApp = window.WebApp;
        return Boolean(webApp && webApp.initData);
    }

    function isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
    }

    function isIos() {
        const iosDevice = /iphone|ipad|ipod/i.test(navigator.userAgent);
        const ipadDesktopMode = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
        return iosDevice || ipadDesktopMode;
    }

    function initMax() {
        const webApp = window.WebApp;
        if (!isInsideMax()) return;
        if (webApp.ready) webApp.ready();
        if (webApp.expand) webApp.expand();
        if (webApp.BackButton && webApp.BackButton.hide) webApp.BackButton.hide();
    }

    function registerServiceWorker() {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.register(SERVICE_WORKER_URL).catch(() => {});
    }

    async function installApp() {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        installButton.hidden = true;
    }

    function initInstall() {
        if (isInsideMax() || isStandalone()) return;

        window.addEventListener('beforeinstallprompt', event => {
            event.preventDefault();
            deferredPrompt = event;
            installButton.hidden = false;
        });
        window.addEventListener('appinstalled', () => { installButton.hidden = true; });
        installButton.addEventListener('click', installApp);

        if (isIos()) iosHint.hidden = false;
    }

    initMax();
    registerServiceWorker();
    initInstall();
})();
