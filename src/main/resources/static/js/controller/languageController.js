(function () {
    'use strict';

    let _currentLang = localStorage.getItem('appLang') || 'en';
    let _translations = {};

    window.i18n = {
        t: function (key) {
            return _translations[key] || key;
        },
        getCurrentLang: function () {
            return _currentLang;
        },
        setLanguage: setLanguage
    };
    window.setLanguage = setLanguage;

    async function loadTranslations(lang) {
        try {
            const res = await fetch('/i18n/' + lang + '.json?v=' + Date.now());
            if (!res.ok) throw new Error('Failed to load ' + lang + '.json');
            return await res.json();
        } catch (e) {
            console.error('[i18n] Error loading translations:', e);
            return {};
        }
    }

    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            const key = el.getAttribute('data-i18n');
            const value = _translations[key];
            if (value !== undefined) {
                el.textContent = value;
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            const key = el.getAttribute('data-i18n-placeholder');
            const value = _translations[key];
            if (value !== undefined) {
                el.placeholder = value;
            }
        });

        document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
            const key = el.getAttribute('data-i18n-title');
            const value = _translations[key];
            if (value !== undefined) {
                el.title = value;
            }
        });

        document.documentElement.lang = _currentLang;
    }

    function syncToggles() {
        const isBn = _currentLang === 'bn';
        document.querySelectorAll('.lang-toggle-checkbox').forEach(function (cb) {
            cb.checked = isBn;
        });
    }

    async function setLanguage(lang) {
        _currentLang = lang;
        localStorage.setItem('appLang', lang);
        _translations = await loadTranslations(lang);
        applyTranslations();
        syncToggles();
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
    }

    window.toggleLanguage = async function () {
        const newLang = _currentLang === 'en' ? 'bn' : 'en';
        await setLanguage(newLang);
    };

    function observeDom() {
        const observer = new MutationObserver(function (mutations) {
            let needsTranslation = false;
            mutations.forEach(function (m) {
                if (m.addedNodes.length) {
                    m.addedNodes.forEach(function (node) {
                        if (node.nodeType === 1) {
                            if (
                                node.hasAttribute('data-i18n') ||
                                node.hasAttribute('data-i18n-placeholder') ||
                                (node.querySelector && node.querySelector('[data-i18n],[data-i18n-placeholder]'))
                            ) {
                                needsTranslation = true;
                            }
                        }
                    });
                }
            });
            if (needsTranslation) {
                applyTranslations();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
    document.addEventListener('DOMContentLoaded', async function () {
        await setLanguage(_currentLang);
        observeDom();
    });

})();
