/* ==========================================================================
   CSF Leak IL - קובץ הלוגיקה והסקריפטים המרכזי (script.js)
   כולל ניווט נקי, בורר שפות, שיתוף מהיר, נגישות, הדגמת עיגול מים ומוח ואשף תסמינים
   ========================================================================== */

function getCorrectPath(filename) {
    const isInCenters = window.location.pathname.includes('/centers/') || window.location.href.includes('/centers/');
    return isInCenters ? '../' + filename : filename;
}

const SHARED_HEADER_FALLBACK = `<!-- הודעות טוסט מערכתיות -->
<div id="toastBox" class="toast-notification" role="status" aria-live="polite">
    <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
    <span id="toastText">הפעולה בוצעה בהצלחה</span>
</div>

<!-- ווידג'ט נגישות קבוע לכל האתר -->
<button type="button" id="accToggleBtn" class="acc-widget-btn" aria-label="פתיחת תפריט נגישות" aria-expanded="false" aria-controls="accWidgetPanel">
    <i class="fa-solid fa-universal-access" aria-hidden="true"></i>
</button>

<div id="accWidgetPanel" class="acc-widget-panel hidden" role="dialog" aria-label="תפריט התאמות נגישות">
    <div class="acc-panel-header">
        <div>
            <i class="fa-solid fa-universal-access" aria-hidden="true"></i>
            <span>כלי נגישות ותצוגה</span>
        </div>
        <button type="button" id="accCloseBtn" class="acc-panel-close" aria-label="סגירת תפריט נגישות">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
    </div>
    <div class="acc-panel-body">
        <button type="button" class="acc-option-btn" data-acc-action="calm">
            <span><i class="fa-solid fa-eye-slash" aria-hidden="true"></i> מצב קריאה עדין (לכאב ראש)</span>
            <span>פעיל/כבוי</span>
        </button>
        <button type="button" class="acc-option-btn" data-acc-action="font-lg">
            <span><i class="fa-solid fa-text-height" aria-hidden="true"></i> הגדלת טקסט בינונית</span>
            <span>א+</span>
        </button>
        <button type="button" class="acc-option-btn" data-acc-action="font-xl">
            <span><i class="fa-solid fa-magnifying-glass-plus" aria-hidden="true"></i> הגדלת טקסט מקסימלית</span>
            <span>א++</span>
        </button>
        <button type="button" class="acc-option-btn" data-acc-action="contrast">
            <span><i class="fa-solid fa-circle-half-stroke" aria-hidden="true"></i> ניגודיות גבוהה (כהה)</span>
            <span>ניגודיות</span>
        </button>
        <button type="button" class="acc-option-btn" data-acc-action="links">
            <span><i class="fa-solid fa-underline" aria-hidden="true"></i> הדגשת קישורים בקו תחתון</span>
            <span>קישורים</span>
        </button>
        <button type="button" class="acc-option-btn" data-acc-action="readable">
            <span><i class="fa-solid fa-font" aria-hidden="true"></i> גופן קריא וריווח שורות</span>
            <span>קריאות</span>
        </button>
        <button type="button" class="acc-option-btn" data-acc-action="animations">
            <span><i class="fa-solid fa-pause" aria-hidden="true"></i> עצירת אנימציות והבהובים</span>
            <span>תנועה</span>
        </button>
        <button type="button" class="acc-reset-btn" data-acc-action="reset">
            <i class="fa-solid fa-rotate-left" aria-hidden="true"></i> איפוס הגדרות נגישות
        </button>
    </div>
</div>

<!-- בר עליון -->
<div class="top-bar">
    <div class="container top-bar-inner">
        <div class="top-bar-badge">
            <i class="fa-solid fa-shield-heart" aria-hidden="true"></i>
            <span>מרחב בטוח, נטול אינטרסים מסחריים, למתמודדים עם דליפת נוזל מוח-שדרה</span>
        </div>
        <div class="top-bar-actions">
            <button type="button" id="calmToggleBtn" class="btn-calm-mode">
                <i class="fa-solid fa-eye-slash" aria-hidden="true"></i>
                <span>מצב קריאה עדין (הפחתת ניגודיות לכאב ראש)</span>
            </button>
            <span class="top-divider" aria-hidden="true">|</span>
            <div class="lang-picker-wrap">
                <span class="lang-picker-icon" aria-hidden="true"><i class="fa-solid fa-globe"></i></span>
                <select id="siteLangSelect" class="lang-picker-select" aria-label="בחירת שפה">
                    <option value="he">עברית</option>
                    <option value="en">English</option>
                    <option value="ru">Русский</option>
                    <option value="ar">العربية</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                </select>
            </div>
            <span class="top-divider" aria-hidden="true">|</span>
            <a href="CONTACT_URL" data-page="contact" class="spa-link urgent-link">סיוע מיידי</a>
        </div>
    </div>
</div>

<!-- Header & Navigation -->
<header class="site-header">
    <div class="container header-inner">
        <a href="INDEX_URL" data-page="index" class="spa-link brand-link">
            <div class="brand-logo-wrap">
                <img src="LOGO_URL" alt="CSF Leak IL - לוגו הקהילה" class="brand-logo">
            </div>
            <div class="brand-text">
                <span class="brand-title">CSF LEAK IL</span>
                <span class="brand-subtitle">קהילת מתמודדי דליפת CSF בישראל</span>
            </div>
        </a>

        <nav class="main-nav" aria-label="תפריט ניווט ראשי">
            <a href="INDEX_URL" data-page="index" class="nav-link spa-link">דף הבית</a>
            <a href="INFO_URL" data-page="info" class="nav-link spa-link">מידע רפואי</a>
            <a href="DOCTORS_URL" data-page="doctors" class="nav-link spa-link">רופאים ומרכזים</a>
            <a href="RESEARCH_URL" data-page="research" class="nav-link spa-link">חדשות ומחקרים</a>
            <a href="FAQ_URL" data-page="faq" class="nav-link spa-link">שאלות נפוצות</a>
            <a href="CAREGIVERS_URL" data-page="caregivers" class="nav-link spa-link">משפחה ומלווים</a>
            <a href="CONTACT_URL" data-page="contact" class="spa-link">צור קשר</a>
            <a href="COMMUNITY_URL" target="_blank" rel="noopener noreferrer" class="nav-link">קהילה</a>
        </nav>

        <div class="header-cta">
            <a href="CONTACT_URL" data-page="contact" class="spa-link btn-whatsapp-nav">
                <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
                <span>הצטרפות לקבוצה</span>
            </a>
        </div>

        <button type="button" id="mobileMenuBtn" class="mobile-menu-btn" aria-label="פתיחת תפריט ניווט בנייד" aria-expanded="false" aria-controls="mobileMenu">
            <i class="fa-solid fa-bars" aria-hidden="true"></i>
        </button>
    </div>

    <div id="mobileMenu" class="mobile-nav hidden">
        <a href="INDEX_URL" data-page="index" class="spa-link">דף הבית</a>
        <a href="INFO_URL" data-page="info" class="spa-link">מידע רפואי</a>
        <a href="DOCTORS_URL" data-page="doctors" class="spa-link">רופאים ומרכזים רפואיים</a>
        <a href="RESEARCH_URL" data-page="research" class="spa-link">חדשות ומחקרים</a>
        <a href="FAQ_URL" data-page="faq" class="spa-link">שאלות נפוצות (FAQ)</a>
        <a href="CAREGIVERS_URL" data-page="caregivers" class="spa-link">משפחה ומלווים</a>
        <a href="CONTACT_URL" data-page="contact" class="spa-link">צור קשר</a>
        <a href="COMMUNITY_URL" target="_blank" rel="noopener noreferrer">קהילה</a>
        <div class="mobile-lang-wrap">
            <div class="lang-picker-wrap">
                <span class="lang-picker-icon" aria-hidden="true"><i class="fa-solid fa-globe"></i></span>
                <select id="siteLangSelectMobile" class="lang-picker-select" aria-label="בחירת שפה בנייד">
                    <option value="he">עברית</option>
                    <option value="en">English</option>
                    <option value="ru">Русский</option>
                    <option value="ar">العربية</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                </select>
            </div>
        </div>
    </div>

    <div id="google_translate_element" class="goog-hidden-host"></div>
</header>`;

const SHARED_FOOTER_FALLBACK = `<!-- הבהרה משפטית ואזהרת אי-לקיחת אחריות רפואית קבועה -->
<section class="container legal-disclaimer-section">
    <div class="legal-disclaimer-box">
        <div class="legal-disclaimer-title">
            <i class="fa-solid fa-scale-balanced" aria-hidden="true"></i>
            <span>הבהרה משפטית ואזהרת אי-לקיחת אחריות רפואית</span>
        </div>
        <p class="legal-disclaimer-text">
            המידע המופיע בפורטל זה נועד להרחבת הידע הכללי, לתמיכה קהילתית ולהכוונה ראשונית בלבד, ואינו מהווה בשום אופן ייעוץ רפואי, אבחנה מקצועית, המלצה טיפולית או תחליף להתייעצות עם רופא נוירולוג או מומחה מוסמך. הצוות הפועל בקהילה הינו מתנדב, ואינו נושא באחריות משפטית או אחרת לכל נזק, ישיר או עקיף, העלול להיגרם כתוצאה מהסתמכות על המידע המוצג באתר. בכל מקרה של שינוי במצב הרפואי או הופעת תסמינים חריגים, חובה לפנות מיד לרופא מטפל או לחדר מיון.
        </p>
    </div>
</section>

<!-- פוטר משותף לכל עמודי האתר -->
<footer class="site-footer">
    <div class="container">
        <div class="footer-grid">
            <div class="stack-sm">
                <div class="brand-link">
                    <div class="brand-logo-wrap">
                        <img src="LOGO_URL" alt="לוגו CSF Leak IL" class="brand-logo">
                    </div>
                    <div class="brand-text">
                        <span class="brand-title">CSF Leak IL</span>
                        <span class="brand-subtitle">קהילת מתמודדי דליפת CSF בישראל</span>
                    </div>
                </div>
                <p class="footer-links-list">
                    מרחב התנדבותי ללא כוונת רווח, המחבר ומלווה מטופלים ובני משפחה המתמודדים עם דליפת נוזל מוח-שדרה ו-SIH בישראל.
                </p>
            </div>

            <div class="footer-links-list">
                <strong>מעבר בין עמודי הפורטל</strong>
                <a href="INDEX_URL" data-page="index" class="spa-link">דף הבית</a>
                <a href="INFO_URL" data-page="info" class="spa-link">מידע רפואי והכנה לפגישה</a>
                <a href="DOCTORS_URL" data-page="doctors" class="spa-link">רופאים ומרכזים</a>
                <a href="RESEARCH_URL" data-page="research" class="spa-link">חדשות ומחקרים</a>
                <a href="FAQ_URL" data-page="faq" class="spa-link">שאלות נפוצות (FAQ)</a>
                <a href="CAREGIVERS_URL" data-page="caregivers" class="spa-link">ארגז כלים למשפחה ומלווים</a>
                <a href="CONTACT_URL" data-page="contact" class="spa-link">צור קשר</a>
                <a href="COMMUNITY_URL" target="_blank" rel="noopener noreferrer">קהילה</a>
            </div>

            <div class="footer-links-list">
                <strong>ארגונים בינלאומיים שותפים</strong>
                <p>אנו פועלים בהתאם לפרוטוקולים של הארגונים המובילים בעולם:</p>
                <a href="https://spinalcsfleak.org/" target="_blank" rel="noopener noreferrer">
                    <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> Spinal CSF Leak Foundation (ארה"ב)
                </a>
                <a href="https://csfleak.uk/" target="_blank" rel="noopener noreferrer">
                    <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> CSF Leak Association (בריטניה)
                </a>
            </div>
        </div>

        <div class="footer-bottom">
            <div class="footer-mini-disclaimer">
                <strong>הבהרה רפואית חשובה:</strong> כל התכנים, הדיונים והמידע המופיעים בפורטל "CSF Leak IL" ובקבוצות הקהילה נכתבו על ידי מטופלים ומתנדבים למטרות תמיכה הדדית ושיתוף ידע בלבד. הם אינם מהווים ייעוץ רפואי, המלצה רפואית או תחליף לפגישה עם רופא נוירולוג או מומחה מוסמך.
            </div>
            <div>
                © 2026 כל הזכויות שמורות • CSF Leak IL • קהילת מתמודדי דליפת CSF בישראל
            </div>
        </div>
    </div>
</footer>`;

const ALL_SITE_PAGES = [
    'index', 'info', 'doctors', 'research', 'faq',
    'caregivers', 'contact',
    'center-szmc', 'center-ichilov', 'center-rambam', 'center-sheba'
];

const runtimePagesCache = {};
let isInternalNavigation = false;

function getFilePathForPage(pageKey) {
    const inCenters = window.location.pathname.includes('/centers/') || window.location.href.includes('/centers/');
    if (pageKey && pageKey.startsWith('center-')) {
        return inCenters ? pageKey + '.html' : 'centers/' + pageKey + '.html';
    }
    return inCenters ? '../' + pageKey + '.html' : pageKey + '.html';
}

function processTemplate(template) {
    const inCenters = window.location.pathname.includes('/centers/') || window.location.href.includes('/centers/');
    const p = inCenters ? '../' : '';
    const resolvedCommunityUrl = inCenters ? '../community/Pages/index.html' : 'community/Pages/index.html';

    return template
        .replace(/LOGO_URL/g, p + 'images/logo.png')
        .replace(/INDEX_URL/g, p + 'index.html')
        .replace(/INFO_URL/g, p + 'info.html')
        .replace(/DOCTORS_URL/g, p + 'doctors.html')
        .replace(/RESEARCH_URL/g, p + 'research.html')
        .replace(/FAQ_URL/g, p + 'faq.html')
        .replace(/CAREGIVERS_URL/g, p + 'caregivers.html')
        .replace(/CONTACT_URL/g, p + 'contact.html')
        .replace(/COMMUNITY_URL/g, resolvedCommunityUrl);
}

document.addEventListener('DOMContentLoaded', async () => {
    document.body.classList.add('portal-page');
    initGlobalEventDelegation();

    await loadSharedLayout();
    restoreAccessibilityState();
    loadGoogleTranslate();
    initQuickShareWidget();
    initSymptomWizard();

    const currentPage = detectCurrentPageKey();
    const mainContainer = document.getElementById('page-content');

    if (mainContainer) {
        runtimePagesCache[currentPage] = {
            title: document.title,
            html: mainContainer.innerHTML
        };
    }

    highlightActiveNav(currentPage);
    preloadAllPagesInBackground(currentPage);
});

async function loadSharedLayout() {
    const headerSlot = document.getElementById('site-header-placeholder');
    const footerSlot = document.getElementById('site-footer-placeholder');

    const processedHeader = processTemplate(SHARED_HEADER_FALLBACK);
    const processedFooter = processTemplate(SHARED_FOOTER_FALLBACK);

    if (headerSlot && !headerSlot.innerHTML.trim()) {
        headerSlot.innerHTML = processedHeader;
    }

    if (footerSlot && !footerSlot.innerHTML.trim()) {
        footerSlot.innerHTML = processedFooter;
    }
}

function detectCurrentPageKey() {
    const bodyPage = document.body.getAttribute('data-current-page');
    if (bodyPage) return bodyPage;

    const pathFile = window.location.pathname.split('/').pop().replace('.html', '');
    if (pathFile) return pathFile;

    return 'index';
}

async function fetchAndCachePage(pageKey) {
    if (runtimePagesCache[pageKey]) return runtimePagesCache[pageKey];

    const targetFile = getFilePathForPage(pageKey);
    const response = await fetch(targetFile);
    if (!response.ok) throw new Error('Page fetch failed');

    const rawText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawText, 'text/html');
    const extractedMain = doc.getElementById('page-content');

    if (!extractedMain) throw new Error('No #page-content found');

    const pageData = {
        title: doc.title || document.title,
        html: extractedMain.innerHTML
    };

    runtimePagesCache[pageKey] = pageData;
    return pageData;
}

function preloadAllPagesInBackground(currentPage) {
    if (window.location.protocol === 'file:') return;

    setTimeout(() => {
        ALL_SITE_PAGES.forEach(pageKey => {
            if (pageKey !== currentPage && !runtimePagesCache[pageKey]) {
                fetchAndCachePage(pageKey).catch(() => {});
            }
        });
    }, 400);
}

async function navigateToPage(pageKey, pushToHistory = true) {
    const mainContainer = document.getElementById('page-content');
    const targetFile = getFilePathForPage(pageKey);

    if (!mainContainer || window.location.protocol === 'file:') {
        window.location.href = targetFile;
        return;
    }

    try {
        const pageData = runtimePagesCache[pageKey] || await fetchAndCachePage(pageKey);

        mainContainer.innerHTML = pageData.html;
        document.title = pageData.title;
        document.body.setAttribute('data-current-page', pageKey);

        if (pushToHistory) {
            isInternalNavigation = true;
            window.history.pushState({ pageKey }, pageData.title, targetFile);
            setTimeout(() => { isInternalNavigation = false; }, 50);
        }

        highlightActiveNav(pageKey);
        closeMobileNav();
        renderTranslateWidgets();
        initQuickShareWidget();
        initSymptomWizard();
        window.scrollTo({ top: 0, behavior: 'instant' });

    } catch (err) {
        window.location.href = targetFile;
    }
}

window.addEventListener('popstate', (event) => {
    if (isInternalNavigation) return;

    const pageKey = (event.state && event.state.pageKey)
        ? event.state.pageKey
        : detectCurrentPageKey();

    if (pageKey) {
        navigateToPage(pageKey, false);
    }
});

function highlightActiveNav(pageKey) {
    const activeTopKey = (pageKey && pageKey.startsWith('center-')) ? 'doctors' : pageKey;
    document.querySelectorAll('.site-header .nav-link').forEach(link => {
        const linkPage = link.getAttribute('data-page');
        const isActive = linkPage === activeTopKey;
        link.classList.toggle('active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function initGlobalEventDelegation() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
            const href = link.getAttribute('href') || '';
            const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || link.target === '_blank' || link.hasAttribute('download');

            if (!isExternal) {
                let targetPage = link.getAttribute('data-page');
                if (!targetPage && href.endsWith('.html')) {
                    targetPage = href.split('/').pop().replace('.html', '');
                }

                if (targetPage) {
                    e.preventDefault();
                    const currentPage = document.body.getAttribute('data-current-page');
                    if (targetPage !== currentPage) {
                        navigateToPage(targetPage, true);
                    } else {
                        closeMobileNav();
                    }
                    return;
                }
            }
        }

        if (e.target.closest('#mobileMenuBtn')) {
            toggleMobileNav();
            return;
        }

        if (e.target.closest('#calmToggleBtn')) {
            toggleAccessibilityFeature('calm');
            return;
        }

        if (e.target.closest('#accToggleBtn')) {
            toggleAccPanel();
            return;
        }
        if (e.target.closest('#accCloseBtn')) {
            closeAccPanel();
            return;
        }

        const accBtn = e.target.closest('[data-acc-action]');
        if (accBtn) {
            const action = accBtn.getAttribute('data-acc-action');
            if (action === 'reset') {
                resetAllAccessibility();
            } else {
                toggleAccessibilityFeature(action);
            }
            return;
        }

        const medTabBtn = e.target.closest('[data-med-tab]');
        if (medTabBtn) {
            const tabKey = medTabBtn.getAttribute('data-med-tab');
            switchMedicalTab(tabKey, medTabBtn);
            return;
        }

        const centerTabBtn = e.target.closest('[data-center-tab]');
        if (centerTabBtn) {
            const centerKey = centerTabBtn.getAttribute('data-center-tab');
            switchMedicalCenter(centerKey, centerTabBtn);
            return;
        }

        const accTrigger = e.target.closest('[data-acc-target]');
        if (accTrigger) {
            const targetId = accTrigger.getAttribute('data-acc-target');
            toggleAccordion(targetId, accTrigger);
            return;
        }

        /* הדגמת עיגול מים ומוח (שכיבה לעומת עמידה) */
        const simBtn = e.target.closest('[data-sim-posture]');
        if (simBtn) {
            const posture = simBtn.getAttribute('data-sim-posture');
            const visualBox = document.getElementById('simVisualBox');
            const statusBadge = document.getElementById('simStatusBadge');
            const stateTag = document.getElementById('simStateTag');
            const stateTitle = document.getElementById('simStateTitle');
            const stateDesc = document.getElementById('simStateDesc');
            const stateTip = document.getElementById('simStateTip');

            document.querySelectorAll('[data-sim-posture]').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            simBtn.classList.add('active');
            simBtn.setAttribute('aria-pressed', 'true');

            if (visualBox) visualBox.setAttribute('data-state', posture);

            if (posture === 'standing') {
                if (statusBadge) statusBadge.textContent = 'מצב עמידה/ישיבה: דליפת CSF, ירידת מפלס ושקיעת המוח';
                if (stateTag) {
                    stateTag.textContent = 'בעמידה או ישיבה';
                    stateTag.className = 'badge-pill badge-amber';
                }
                if (stateTitle) stateTitle.textContent = 'מפלס הנוזל יורד והמוח צונח כלפי מטה';
                if (stateDesc) {
                    stateDesc.textContent = 'כאשר עומדים או יושבים ויש דליפת CSF, מפלס הנוזל התומך יורד והמוח מאבד חלק מהציפה שלו, מה שיוצר משיכה ומתיחה על קרומי המוח ועצבי הגולגולת.';
                }
                if (stateTip) {
                    stateTip.className = 'callout-box callout-amber';
                    stateTip.innerHTML = '<strong>מה מרגישים בפועל:</strong> כאב ראש תנוחתי, לחץ או צפצוף באוזניים, בחילה, כאב בצוואר ובשכמות וערפול מוחי.';
                }
            } else {
                if (statusBadge) statusBadge.textContent = 'מצב שכיבה: העיגול מלא בנוזל והמוח צף';
                if (stateTag) {
                    stateTag.textContent = 'בשכיבה מאוזנת';
                    stateTag.className = 'badge-pill badge-emerald';
                }
                if (stateTitle) stateTitle.textContent = 'מפלס הנוזל מלא והמוח צף בתמיכה מלאה';
                if (stateDesc) {
                    stateDesc.textContent = 'כאשר שוכבים במאוזן, המכל עוטף את המוח באופן מלא ומאוזן. המוח צף בתוך הנוזל והמתיחה על קרומי המוח והעצבים פוחתת.';
                }
                if (stateTip) {
                    stateTip.className = 'callout-box callout-emerald';
                    stateTip.innerHTML = '<strong>מה מרגישים בפועל:</strong> הקלה הדרגתית בכאב הראש ושיפור בבהירות המחשבה ובנוחות.';
                }
            }
            return;
        }

        /* אשף הכוונה ראשונית לתסמינים */
        const wizardChoiceBtn = e.target.closest('[data-wizard-choice]');
        if (wizardChoiceBtn) {
            const choiceIdx = Number(wizardChoiceBtn.getAttribute('data-wizard-choice'));
            wizardState.answers[wizardState.step] = choiceIdx;
            if (wizardState.step < WIZARD_QUESTIONS.length - 1) {
                wizardState.step += 1;
                renderWizardStep();
            } else {
                renderWizardResult();
            }
            return;
        }

        if (e.target.closest('#wizardBackBtn')) {
            if (wizardState.step > 0) {
                wizardState.step -= 1;
                renderWizardStep();
            }
            return;
        }

        if (e.target.closest('#wizardRestartBtn')) {
            initSymptomWizard();
            return;
        }

        const sharePresetBtn = e.target.closest('[data-share-preset]');
        if (sharePresetBtn) {
            const presetKey = sharePresetBtn.getAttribute('data-share-preset');
            const textarea = document.getElementById('quickShareText');
            const waBtn = document.getElementById('whatsappQuickShareBtn');

            document.querySelectorAll('[data-share-preset]').forEach(b => b.classList.remove('active'));
            sharePresetBtn.classList.add('active');

            if (textarea && SHARE_PRESETS[presetKey]) {
                textarea.value = SHARE_PRESETS[presetKey];
                if (waBtn) {
                    waBtn.href = 'https://wa.me/?text=' + encodeURIComponent(textarea.value);
                }
            }
            return;
        }

        if (e.target.closest('#copyQuickShareBtn')) {
            const textarea = document.getElementById('quickShareText');
            if (textarea) {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(textarea.value).then(() => {
                        showToast('הטקסט הועתק! אפשר להדביק ולשלוח בכל אפליקציה');
                    }).catch(() => {
                        textarea.select();
                        document.execCommand('copy');
                        showToast('הטקסט הועתק! אפשר להדביק ולשלוח בכל אפליקציה');
                    });
                } else {
                    textarea.select();
                    document.execCommand('copy');
                    showToast('הטקסט הועתק! אפשר להדביק ולשלוח בכל אפליקציה');
                }
            }
            return;
        }

        if (e.target.closest('#downloadPdfBtn')) {
            downloadDoctorBrief();
            return;
        }
    });

    document.addEventListener('submit', (e) => {
        if (e.target && e.target.id === 'mainContactForm') {
            e.preventDefault();
            e.target.reset();
            showToast("פנייתך התקבלה בסודיות מלאה. נציג הקהילה ייצור קשר בהקדם!");
        }
    });
}

function toggleMobileNav() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.getElementById('mobileMenuBtn');
    if (!menu) return;
    const willOpen = menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    if (btn) btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
}

function closeMobileNav() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.getElementById('mobileMenuBtn');
    if (menu) menu.classList.add('hidden');
    if (btn) btn.setAttribute('aria-expanded', 'false');
}

function switchMedicalTab(tabKey, activeBtn) {
    document.querySelectorAll('#medicalTabContainer .tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });

    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-selected', 'true');
    }

    ['mechanism', 'symptoms', 'imaging', 'treatment', 'preparation'].forEach(key => {
        const panel = document.getElementById('med-tab-' + key);
        if (panel) {
            if (key === tabKey) {
                panel.classList.remove('hidden');
            } else {
                panel.classList.add('hidden');
            }
        }
    });
}

function switchMedicalCenter(centerKey, activeBtn) {
    document.querySelectorAll('.center-nav-card').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });

    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-selected', 'true');
    }

    ['szmc', 'ichilov', 'rambam', 'sheba'].forEach(key => {
        const panel = document.getElementById('center-panel-' + key);
        if (panel) {
            if (key === centerKey) {
                panel.classList.remove('hidden');
            } else {
                panel.classList.add('hidden');
            }
        }
    });
}

function toggleAccordion(id, triggerBtn) {
    const content = document.getElementById('content-' + id);
    const icon = document.getElementById('icon-' + id);
    if (!content) return;

    const isHidden = content.classList.contains('hidden');
    if (isHidden) {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
        if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'true');
    } else {
        content.classList.add('hidden');
        if (icon) icon.classList.remove('rotate-180');
        if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'false');
    }
}

/* ==========================================================================
   אשף הכוונה ראשונית לתסמינים (CSF Symptom Wizard)
   ========================================================================== */
const WIZARD_QUESTIONS = [
    {
        id: 'posture',
        question: '1. איך הכאב או התסמינים המרכזיים מגיבים לתנוחת הגוף?',
        options: [
            { label: 'מחמירים בעמידה, ישיבה או מאמץ ומוקלים בשכיבה שטוחה', scoreLeak: 3, scoreRebound: 0 },
            { label: 'מופיעים או מתגברים בעיקר בשכיבה ומוקלים בעמידה או בהגבהת ראש', scoreLeak: 0, scoreRebound: 3 },
            { label: 'קבועים פחות או יותר ללא שינוי ברור בין שכיבה לעמידה', scoreLeak: 0, scoreRebound: 0 }
        ]
    },
    {
        id: 'trigger',
        question: '2. האם היה אירוע או רקע רפואי סביב תחילת התסמינים?',
        options: [
            { label: 'כן — ניקור מותני (LP), אפידורל, ניתוח/פרוצדורה או חבלה/מאמץ פתאומי', scoreLeak: 2, scoreRebound: 0 },
            { label: 'עברתי לאחרונה טלאי דם (EBP) או סגירת דליפה/פיסטולה', scoreLeak: 0, scoreRebound: 2 },
            { label: 'התחיל בהדרגה או בפתאומיות ללא אירוע ברור שזכור לי', scoreLeak: 1, scoreRebound: 0 }
        ]
    },
    {
        id: 'associated',
        question: '3. האם מופיעים תסמינים נלווים אופייניים לתת-לחץ תוך-גולגולתי?',
        options: [
            { label: 'כן — טנטון/אטימות באוזניים, כאב עורף/צוואר/שכמות, בחילה, סחרחורת או ערפול מוחי', scoreLeak: 2, scoreRebound: 0 },
            { label: 'יותר לחץ במצח, מאחורי העיניים או שינוי בראייה', scoreLeak: 0, scoreRebound: 1 },
            { label: 'לא שמתי לב לתסמינים נלווים כאלה', scoreLeak: 0, scoreRebound: 0 }
        ]
    },
    {
        id: 'timeline',
        question: '4. כמה זמן התסמינים נמשכים?',
        options: [
            { label: 'כמה שבועות עד חודשים או יותר, עם השפעה ברורה על התפקוד היומי', scoreLeak: 2, scoreRebound: 1 },
            { label: 'כמה ימים עד שבועיים (כולל ימים ראשונים אחרי פרוצדורה)', scoreLeak: 1, scoreRebound: 1 },
            { label: 'רק לעיתים רחוקות מאוד', scoreLeak: 0, scoreRebound: 0 }
        ]
    },
    {
        id: 'mri',
        question: '5. האם בוצעה הדמיה (כמו MRI מוח) ומה נאמר לגביה?',
        options: [
            { label: 'כן, ה-MRI היה תקין או שלא מצאו סיבה ברורה למרות התסמינים', scoreLeak: 2, scoreRebound: 0 },
            { label: 'נמצאו סימנים לתת-לחץ תוך-גולגולתי / דליפה / פיסטולה', scoreLeak: 3, scoreRebound: 0 },
            { label: 'עוד לא עשיתי בדיקת הדמיה בנושא הזה', scoreLeak: 1, scoreRebound: 0 }
        ]
    }
];

const wizardState = {
    step: 0,
    answers: []
};

function initSymptomWizard() {
    const qArea = document.getElementById('wizardQuestionArea');
    const rArea = document.getElementById('wizardResultArea');
    if (!qArea || !rArea) return;

    wizardState.step = 0;
    wizardState.answers = [];
    qArea.classList.remove('hidden');
    rArea.classList.add('hidden');
    renderWizardStep();
}

function renderWizardStep() {
    const qArea = document.getElementById('wizardQuestionArea');
    const stepText = document.getElementById('wizardStepText');
    const fill = document.getElementById('wizardProgressFill');
    if (!qArea) return;

    const current = WIZARD_QUESTIONS[wizardState.step];
    const total = WIZARD_QUESTIONS.length;

    if (stepText) stepText.textContent = `שאלה ${wizardState.step + 1} מתוך ${total}`;
    if (fill) fill.style.width = `${((wizardState.step + 1) / total) * 100}%`;

    const optionsHtml = current.options.map((opt, idx) => `
        <button type="button" class="wizard-option-btn" data-wizard-choice="${idx}">
            <span>${opt.label}</span>
            <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
        </button>
    `).join('');

    const backBtnHtml = wizardState.step > 0
        ? `<button type="button" class="wizard-back-btn" id="wizardBackBtn"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i> לשאלה הקודמת</button>`
        : `<span></span>`;

    qArea.innerHTML = `
        <div class="wizard-question-title">${current.question}</div>
        <div class="wizard-options-list">${optionsHtml}</div>
        <div class="wizard-footer-nav">${backBtnHtml}</div>
    `;
}

function renderWizardResult() {
    const qArea = document.getElementById('wizardQuestionArea');
    const rArea = document.getElementById('wizardResultArea');
    const stepText = document.getElementById('wizardStepText');
    const fill = document.getElementById('wizardProgressFill');
    if (!qArea || !rArea) return;

    let leakScore = 0;
    let reboundScore = 0;

    wizardState.answers.forEach((choiceIdx, qIdx) => {
        const q = WIZARD_QUESTIONS[qIdx];
        const opt = q && q.options[choiceIdx];
        if (opt) {
            leakScore += opt.scoreLeak;
            reboundScore += opt.scoreRebound;
        }
    });

    qArea.classList.add('hidden');
    rArea.classList.remove('hidden');
    if (stepText) stepText.textContent = 'סיכום הכוונה ראשונית';
    if (fill) fill.style.width = '100%';

    let resultHtml = '';
    if (reboundScore >= 4 && reboundScore > leakScore) {
        resultHtml = `
            <div class="callout-box callout-amber stack-sm">
                <span class="badge-pill badge-amber">דפוס שעשוי להתאים ל"לחץ חוזר" (Rebound High Pressure)</span>
                <h3>התשובות מתארות החמרה בשכיבה — כדאי לעדכן את הרופא המטפל</h3>
                <p>כאשר מתרחשת אטימה מוצלחת של דליפה או פיסטולה, חלק מהמטופלים חווים עליית לחץ זמנית שמתגברת בשכיבה או מלווה בלחץ באזור המצח והעיניים. חשוב לדווח לרופא המטפל להנחיה מדויקת.</p>
            </div>
        `;
    } else if (leakScore >= 5) {
        resultHtml = `
            <div class="callout-box callout-sky stack-sm">
                <span class="badge-pill badge-sky">התאמה גבוהה לדפוס תנוחתי (דליפת CSF / SIH)</span>
                <h3>הדפוס שתיארת מזכיר מאפיינים מוכרים של דליפת נוזל מוח־שדרה</h3>
                <p>שילוב של תגובה לתנוחה (בעיקר הקלה בשכיבה שטוחה) ותסמינים נלווים מתאים לדפוס שמוכר בדליפות CSF ופיסטולות ורידיות. כדאי להגיע לרופא נוירולוג או מומחה בתחום עם תיעוד מסודר של התסמינים ושל תנוחות הגוף.</p>
                <p><strong>נקודה חשובה:</strong> גם אם בדיקת MRI מוח ראשונית יצאה תקינה, הדבר אינו שולל לחלוטין דליפה או פיסטולה ורידית — לעיתים נדרשת הערכה מעמיקה והדמיות ייעודיות לפי שיקול דעת רפואי.</p>
            </div>
        `;
    } else {
        resultHtml = `
            <div class="callout-box callout-slate stack-sm">
                <span class="badge-pill badge-slate">דפוס חלקי או פחות אופייני לדליפה תנוחתית קלאסית</span>
                <h3>התסמינים לא מציגים תמונה תנוחתית מובהקת של דליפת CSF</h3>
                <p>ייתכן שמדובר במצב רפואי אחר או בשלב מוקדם/שונה של בירור. מומלץ להמשיך בירור מסודר אצל רופא נוירולוג ולתעד מתי התסמינים מופיעים ומה משפיע עליהם.</p>
            </div>
        `;
    }

    resultHtml += `
        <p class="stat-desc"><strong>הבהרה:</strong> כלי זה נועד להכוונה והכנה לשיחה רפואית בלבד ואינו מהווה אבחון רפואי או המלצה טיפולית.</p>
        <div class="wizard-actions-row">
            <button type="button" class="wizard-restart-btn" id="wizardRestartBtn">
                <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
                <span>התחלה מחדש</span>
            </button>
            <a href="doctors.html" data-page="doctors" class="spa-link btn-emerald-block" style="margin-top: 0; width: auto;">
                <span>לרופאים ומרכזים רפואיים</span>
            </a>
        </div>
    `;

    rArea.innerHTML = resultHtml;
}

function downloadDoctorBrief() {
    showToast("מוריד את מדריך ההנחיות לרופא (PDF)...");
    const link = document.createElement('a');
    link.href = 'מדריך CSF.pdf';
    link.download = 'מדריך CSF.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function showToast(msg) {
    const toast = document.getElementById('toastBox');
    const toastText = document.getElementById('toastText');
    if (toast && toastText) {
        toastText.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4200);
    }
}

/* ==========================================================================
   שיתוף מהיר עם הסביבה (Quick Share Templates)
   ========================================================================== */
const SHARE_PRESETS = {
    family: `היי ❤️ רציתי לשתף במשהו שיעזור להבין מה עובר עליי בתקופה האחרונה.
אני מתמודד/ת עם דליפת נוזל מוחי־שדרתי (CSF) ותת־לחץ תוך־גולגולתי. זו בעיה מכנית-פיזיולוגית: כשאני עומד/ת או יושב/ת, הנוזל שמגן על המוח יורד כלפי מטה ונוצר מתח שגורם לכאב ראש תנוחתי חזק, סחרחורת, ערפול מוחי ועייפות.
כשאני שוכב/ת במאוזן, הנוזל מתאזן והתסמינים נרגעים — לכן שכיבה שטוחה היא צורך רפואי ולא פינוק.
אפשר לקרוא הסבר קצר וברור לבני משפחה ומלווים כאן:
https://csfleak.org.il/caregivers.html`,

    work: `שלום,
רציתי לעדכן שאני מתמודד/ת כעת עם מצב רפואי נוירולוגי הנקרא דליפת נוזל מוחי־שדרתי (CSF) ותת־לחץ תוך־גולגולתי.
המאפיין המרכזי של המצב הוא כאב ראש תנוחתי ותסמינים נוירולוגיים שמחמירים בישיבה או בעמידה, ומוקלים משמעותית בשכיבה מאוזנת.
מסיבה זו נדרשת ממני מנוחה בשכיבה והתאמת אופן העבודה/הלימודים בתקופה הקרובה בהתאם להנחיות הרופא המטפל.
למידע תמציתי על המצב הרפואי:
https://csfleak.org.il/info.html`,

    friends: `היי! רק רציתי לעדכן למה קצת קשה לי לשבת או להיפגש כרגיל בתקופה האחרונה 🙏
יש לי מצב שנקרא דליפת CSF (ירידה בלחץ הנוזל סביב המוח ועמוד השדרה). בעמידה או בישיבה זה גורם לכאב ראש חזק וערפול, ובשכיבה זה נרגע.
לכן אני צריך/ה הרבה שכיבה שטוחה ומנוחה כרגע, ומעריך/ה מאוד את ההבנה והסבלנות ❤️
אם מסקרן לקרוא בקצרה מה זה:
https://csfleak.org.il/faq.html`
};

function initQuickShareWidget() {
    const textarea = document.getElementById('quickShareText');
    const waBtn = document.getElementById('whatsappQuickShareBtn');
    if (!textarea || !waBtn) return;

    if (!textarea.value.trim()) {
        textarea.value = SHARE_PRESETS.family;
    }

    const syncWhatsappHref = () => {
        waBtn.href = 'https://wa.me/?text=' + encodeURIComponent(textarea.value);
    };

    syncWhatsappHref();

    if (!textarea.dataset.bound) {
        textarea.dataset.bound = 'true';
        textarea.addEventListener('input', syncWhatsappHref);
    }
}

const accState = {
    calm: false,
    'font-lg': false,
    'font-xl': false,
    contrast: false,
    links: false,
    readable: false,
    animations: false
};

function toggleAccPanel() {
    const panel = document.getElementById('accWidgetPanel');
    const btn = document.getElementById('accToggleBtn');
    if (!panel) return;
    const isHidden = panel.classList.contains('hidden');
    if (isHidden) {
        panel.classList.remove('hidden');
        if (btn) btn.setAttribute('aria-expanded', 'true');
    } else {
        panel.classList.add('hidden');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }
}

function closeAccPanel() {
    const panel = document.getElementById('accWidgetPanel');
    const btn = document.getElementById('accToggleBtn');
    if (panel) panel.classList.add('hidden');
    if (btn) btn.setAttribute('aria-expanded', 'false');
}

function toggleAccessibilityFeature(key) {
    if (key === 'font-lg' && !accState['font-lg']) {
        accState['font-xl'] = false;
    }
    if (key === 'font-xl' && !accState['font-xl']) {
        accState['font-lg'] = false;
    }
    if (key === 'contrast' && !accState['contrast']) {
        accState.calm = false;
    }
    if (key === 'calm' && !accState.calm) {
        accState.contrast = false;
    }

    accState[key] = !accState[key];
    applyAccessibilityClasses();
    saveAccessibilityState();

    if (key === 'calm') {
        showToast(accState.calm ? "מצב קריאה עדין הופעל" : "חזרת למצב תצוגה רגיל");
    }
}

function resetAllAccessibility() {
    Object.keys(accState).forEach(k => accState[k] = false);
    applyAccessibilityClasses();
    saveAccessibilityState();
    showToast("הגדרות הנגישות אופסו בהצלחה");
}

function applyAccessibilityClasses() {
    document.body.classList.toggle('calm-mode', accState.calm);
    document.documentElement.classList.toggle('acc-font-lg', accState['font-lg']);
    document.documentElement.classList.toggle('acc-font-xl', accState['font-xl']);
    document.body.classList.toggle('acc-high-contrast', accState.contrast);
    document.body.classList.toggle('acc-underline-links', accState.links);
    document.body.classList.toggle('acc-readable-font', accState.readable);
    document.body.classList.toggle('acc-stop-animations', accState.animations);

    document.querySelectorAll('[data-acc-action]').forEach(btn => {
        const act = btn.getAttribute('data-acc-action');
        if (accState[act]) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const calmBtn = document.getElementById('calmToggleBtn');
    if (calmBtn) {
        calmBtn.innerHTML = accState.calm
            ? '<i class="fa-solid fa-eye" aria-hidden="true"></i> <span>ביטול מצב קריאה עדין</span>'
            : '<i class="fa-solid fa-eye-slash" aria-hidden="true"></i> <span>מצב קריאה עדין (הפחתת ניגודיות לכאב ראש)</span>';
    }
}

function saveAccessibilityState() {
    try {
        localStorage.setItem('csf_leak_acc_state', JSON.stringify(accState));
    } catch (e) {}
}

function restoreAccessibilityState() {
    try {
        const saved = localStorage.getItem('csf_leak_acc_state');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.keys(accState).forEach(k => {
                if (typeof parsed[k] === 'boolean') accState[k] = parsed[k];
            });
            applyAccessibilityClasses();
        }
    } catch (e) {}
}

/* ==========================================================================
   תרגום שפות נקי מאחורי הקלעים (Google Translate Hidden Engine)
   ========================================================================== */
function clearGoogleTranslateCookies() {
    const host = window.location.hostname;
    const hostParts = host.split('.');
    const domains = ['', host, '.' + host];
    if (hostParts.length >= 2) {
        domains.push('.' + hostParts.slice(-2).join('.'));
    }

    domains.forEach(domain => {
        const domainAttr = domain ? `; domain=${domain}` : '';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${domainAttr}; SameSite=Lax`;
    });
}

function setGoogleTranslateLanguage(langCode) {
    if (langCode === 'he') {
        clearGoogleTranslateCookies();
        window.location.reload();
        return;
    }

    const cookieValue = `/he/${langCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/; SameSite=Lax`;
    const hostParts = window.location.hostname.split('.');
    if (hostParts.length >= 2) {
        const rootDomain = '.' + hostParts.slice(-2).join('.');
        document.cookie = `googtrans=${cookieValue}; domain=${rootDomain}; path=/; SameSite=Lax`;
    }

    const combo = document.querySelector('#google_translate_element select.goog-te-combo');
    if (combo) {
        combo.value = langCode;
        combo.dispatchEvent(new Event('change'));
    } else {
        window.location.reload();
    }

    ['siteLangSelect', 'siteLangSelectMobile'].forEach(id => {
        const sel = document.getElementById(id);
        if (sel && sel.value !== langCode) sel.value = langCode;
    });
}

function renderTranslateWidgets() {
    if (window.google && google.translate && google.translate.TranslateElement) {
        const host = document.getElementById('google_translate_element');
        if (host && !host.querySelector('.goog-te-gadget')) {
            new google.translate.TranslateElement({
                pageLanguage: 'he',
                includedLanguages: 'he,en,ru,ar,fr,es',
                autoDisplay: false
            }, 'google_translate_element');
        }
    }

    const match = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]+\/([^;]+)/);
    const currentLang = (match && match[1]) ? match[1] : 'he';

    ['siteLangSelect', 'siteLangSelectMobile'].forEach(id => {
        const sel = document.getElementById(id);
        if (!sel) return;
        sel.value = currentLang;
        if (!sel.dataset.bound) {
            sel.dataset.bound = 'true';
            sel.addEventListener('change', (e) => {
                setGoogleTranslateLanguage(e.target.value);
            });
        }
    });
}

window.googleTranslateElementInit = renderTranslateWidgets;

function loadGoogleTranslate() {
    renderTranslateWidgets();
    if (window.location.protocol === 'file:') return;
    if (document.getElementById('google-translate-script')) return;

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
}

/* ==========================================================================
   הודעת קוקיז עדינה (Cookie Notice)
   ========================================================================== */
function initCookieNotice() {
    const hasCookie = document.cookie.split('; ').some(row => row.startsWith('csf_leak_cookie_consent='));
    let hasStorage = false;
    try {
        hasStorage = localStorage.getItem('csf_leak_cookie_consent') === 'accepted';
    } catch (e) {}

    if (hasCookie || hasStorage) return;

    const banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'הודעת שימוש בקובצי Cookie');
    banner.innerHTML = `
        <span>
            אתר זה משתמש בקובצי Cookie ובכלי מדידה סטטיסטיים אנונימיים (Google Analytics) לשיפור חוויית הגלישה ושמירת הגדרות הנגישות שלך.
        </span>
        <button type="button" id="acceptCookiesBtn" class="cookie-banner-btn">הבנתי</button>
    `;

    document.body.appendChild(banner);

    document.getElementById('acceptCookiesBtn').addEventListener('click', () => {
        const maxAge = 60 * 60 * 24 * 180;
        document.cookie = `csf_leak_cookie_consent=accepted; max-age=${maxAge}; path=/; SameSite=Lax`;
        try {
            localStorage.setItem('csf_leak_cookie_consent', 'accepted');
        } catch (e) {}
        banner.classList.add('hidden');
    });
}

document.addEventListener('DOMContentLoaded', initCookieNotice);