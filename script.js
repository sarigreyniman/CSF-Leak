/* ==========================================================================
   CSF Leak IL - קובץ הלוגיקה והסקריפטים המרכזי (script.js)
   ניווט נקי, נגישות, שיתוף מהיר, תרגום שפות, קוקיז, FAQ ומילון כיס
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
let activeGlossaryFilter = 'sih';

const POCKET_GLOSSARY_TERMS = [
    {
        key: 'sih',
        code: 'SIH',
        heTitle: 'תת־לחץ תוך־גולגולתי ספונטני',
        enTitle: 'Spontaneous Intracranial Hypotension (SIH)',
        heDesc: 'ירידה בלחץ ובציפה של נוזל השדרה (CSF) סביב המוח ועמוד השדרה ללא פעולה רפואית קודמת, שלרוב מתבטאת בכאב ראש שמחמיר בעמידה או בישיבה ומוקל בשכיבה.',
        enDesc: 'Low CSF volume/pressure causing orthostatic headache and brainstem/dural traction without a prior dural puncture.',
        clinicTip: 'בעברית אפשר לומר "תת-לחץ תוך-גולגולתי" ולציין אם הכאב משתנה בשכיבה לעומת עמידה.'
    },
    {
        key: 'cvf',
        code: 'CVF / פיסטולה ורידית',
        heTitle: 'פיסטולה CSF ורידית',
        enTitle: 'CSF-Venous Fistula (CVF)',
        heDesc: 'חיבור לא תקין וזעיר בין שק נוזל השדרה לבין וריד סמוך בעמוד השדרה, שבו נוזל ה-CSF מתנקז ישר למערכת הוורידים — לעיתים קרובות כאשר MRI מוח רגיל נראה תקין.',
        enDesc: 'An abnormal connection between the spinal subarachnoid space and an adjacent epidural/paraspinal vein, often occult on standard brain MRI.',
        clinicTip: 'אם ה-MRI תקין והחשד גבוה, כדאי לשאול את הרופא/רדיולוג אם נדרשת בדיקה דינמית לחיפוש CVF.'
    },
    {
        key: 'dsm',
        code: 'DSM',
        heTitle: 'מיאלוגרפיה דינמית (בחיסור דיגיטלי)',
        enTitle: 'Digital Subtraction Myelography (DSM)',
        heDesc: 'בדיקת הדמיה בזמן אמת (תחת שיקוף רנטגן והזרקת חומר ניגוד לנוזל השדרה) שנועדה לעקוב אחרי זרימה מהירה של נוזל או לאתר פיסטולה ורידית.',
        enDesc: 'Real-time fluoroscopic myelography used to capture rapid CSF leaks and CSF-venous fistulas with high temporal resolution.',
        clinicTip: 'במרפאה או בהפניה אפשר לשאול איזה פרוטוקול הדמיה מתאים לבירור (DSM, CT myelography או MRI עמוד שדרה).'
    },
    {
        key: 'ebp',
        code: 'EBP',
        heTitle: 'טלאי דם אפידורלי',
        enTitle: 'Epidural Blood Patch (EBP)',
        heDesc: 'הזרקת דם עצמי (או חומר אטימה ייעודי) לחלל האפידורלי בעמוד השדרה כדי להעלות לחץ מקומי ולאטום דליפה, לרוב תוך הקפדה על מנוחה וחוק ה-BLT.',
        enDesc: 'Injection of autologous blood (or fibrin sealant) into the epidural space to restore CSF pressure and seal a dural defect.',
        clinicTip: 'כדאי לברר מראש מה הנחיות המנוחה וה-BLT אחרי הפעולה ומה נחשב סימן שדורש עדכון.'
    },
    {
        key: 'rebound',
        code: 'Rebound Pressure',
        heTitle: 'לחץ חוזר (עודף לחץ זמני אחרי אטימה)',
        enTitle: 'Rebound Intracranial Hypertension (Rebound Pressure)',
        heDesc: 'עליית לחץ זמנית שיכולה להופיע אחרי שהדליפה או הפיסטולה נאטמת — לרוב מורגשת במצח או מאחורי העיניים ומתגברת בשכיבה.',
        enDesc: 'Transient elevated CSF pressure after leak closure, often felt frontally/retro-orbitally and worse when lying flat.',
        clinicTip: 'אם הכאב מתהפך ומתגבר בשכיבה אחרי טיפול, חשוב לעדכן את הרופא המטפל כדי לקבל הנחיה מסודרת.'
    }
];

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
    initCookieNotice();
    renderPocketGlossary();

    if (typeof window.initInfoPage === 'function') {
        window.initInfoPage();
    }

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
    if (typeof window.onBeforeNavigatePage === 'function') {
        window.onBeforeNavigatePage();
    }

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
        renderPocketGlossary();
        if (typeof window.initInfoPage === 'function') {
            window.initInfoPage();
        }
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

function toggleAccordion(id, triggerBtn) {
    const content = document.getElementById('content-' + id);
    const icon = document.getElementById('icon-' + id);
    if (!content) return;

    const isHidden = content.classList.contains('hidden');
    content.classList.toggle('hidden', !isHidden);
    if (icon) icon.classList.toggle('rotate-180', isHidden);
    if (triggerBtn) triggerBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
}

function renderPocketGlossary() {
    const listEl = document.getElementById('glossaryCardsList');
    if (!listEl) return;

    const query = (document.getElementById('glossarySearchInput')?.value || '').trim().toLowerCase();

    const filtered = POCKET_GLOSSARY_TERMS.filter(item => {
        if (query) {
            const haystack = [
                item.code,
                item.heTitle,
                item.enTitle,
                item.heDesc,
                item.enDesc
            ].join(' ').toLowerCase();
            return haystack.includes(query);
        }
        return item.key === activeGlossaryFilter;
    });

    if (!filtered.length) {
        listEl.innerHTML = `<div class="callout-box callout-slate">לא נמצא מונח מתאים לחיפוש. נסו להקליד SIH, CVF, DSM, EBP או Rebound.</div>`;
        return;
    }

    listEl.innerHTML = filtered.map(item => `
        <article class="glossary-spotlight-card stack-sm">
            <div class="glossary-spotlight-head">
                <h3>${item.heTitle}</h3>
                <span class="badge-pill badge-sky">${item.code}</span>
            </div>
            <p>${item.heDesc}</p>
            <div class="glossary-en-panel" dir="ltr">
                <div class="glossary-en-title">${item.enTitle}</div>
                <p class="glossary-en-desc">${item.enDesc}</p>
            </div>
            <div class="callout-box callout-sky glossary-tip">
                <strong>בשיחה במרפאה:</strong> ${item.clinicTip}
            </div>
        </article>
    `).join('');
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

        const accTrigger = e.target.closest('[data-acc-target]');
        if (accTrigger && document.body.getAttribute('data-current-page') === 'faq') {
            toggleAccordion(accTrigger.getAttribute('data-acc-target'), accTrigger);
            return;
        }

        const filterPill = e.target.closest('[data-glossary-filter]');
        if (filterPill) {
            activeGlossaryFilter = filterPill.getAttribute('data-glossary-filter');
            const searchInput = document.getElementById('glossarySearchInput');
            if (searchInput) searchInput.value = '';

            document.querySelectorAll('[data-glossary-filter]').forEach(btn => {
                const active = btn.getAttribute('data-glossary-filter') === activeGlossaryFilter;
                btn.classList.toggle('active', active);
                btn.setAttribute('aria-selected', active ? 'true' : 'false');
            });
            renderPocketGlossary();
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

    document.addEventListener('input', (e) => {
        if (e.target && e.target.id === 'glossarySearchInput') {
            renderPocketGlossary();
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