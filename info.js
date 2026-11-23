/* ==========================================================================
   CSF Leak IL - לוגיקת עמוד מידע רפואי (info.js)
   לשוניות, אקורדיונים, הדגמת עיגול מים ומוח, אשף תסמינים,
   הדמיית אטימות וטנטון, הדמיית רגישות לאור וערפול מוחי, ומחולל הכנה לרופא
   ========================================================================== */

let infoEventsBound = false;
let doctorPrepLang = 'he';

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

const tinnitusSim = {
    ctx: null,
    osc: null,
    gainNode: null,
    isPlaying: false,
    mode: 'normal',
    volumePct: 20
};

const EN_SYMPTOM_MAP = {
    'כאב ראש תנוחתי (מחמיר בעמידה/ישיבה, מוקל בשכיבה)': 'Orthostatic headache (worse upright, relieved when lying flat)',
    'לחץ או כאב בעורף, בצוואר ובין השכמות': 'Neck stiffness and interscapular ("coat-hanger") pain',
    'טנטון או תחושת אטימות/מלאות באוזניים': 'Tinnitus and aural fullness / muffled hearing',
    'רגישות לאור או טשטוש ראייה': 'Photophobia and blurred/visual disturbances',
    'סחרחורת, חוסר יציבות או בחילה': 'Dizziness, imbalance, and nausea',
    'ערפול מוחי (Brain Fog) וקושי בריכוז': 'Brain fog and difficulty concentrating'
};

const EN_TIME_MAP = {
    'תוך דקות ספורות': 'Within a few minutes',
    'תוך 15–30 דקות': 'Within 15–30 minutes',
    'אחרי שעה או יותר (מחמיר לקראת ערב)': 'After 1+ hour (worse toward evening)',
    'קבוע לאורך היום ללא שינוי ברור': 'Constant throughout the day',
    'תוך 5–15 דקות': 'Within 5–15 minutes',
    'תוך 15–45 דקות': 'Within 15–45 minutes',
    'רק אחרי שכיבה ממושכת של שעות': 'Only after prolonged flat rest',
    'שכיבה דווקא מחמירה את הלחץ': 'Lying flat worsens head pressure (possible rebound)'
};

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
            panel.classList.toggle('hidden', key !== tabKey);
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
        if (id === 'sym-tinnitus') {
            stopTinnitusAudio();
        }
        if (id === 'sym-light-fog') {
            setLightFogMode('normal');
        }
        content.classList.add('hidden');
        if (icon) icon.classList.remove('rotate-180');
        if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'false');
    }
}

function setPostureState(posture) {
    const visualBox = document.getElementById('simVisualBox');
    const statusBadge = document.getElementById('simStatusBadge');
    const stateTag = document.getElementById('simStateTag');
    const stateTitle = document.getElementById('simStateTitle');
    const stateDesc = document.getElementById('simStateDesc');
    const stateTip = document.getElementById('simStateTip');

    document.querySelectorAll('[data-sim-posture]').forEach(b => {
        const active = b.getAttribute('data-sim-posture') === posture;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

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
}

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

function getTinnitusGainValue() {
    const baseMax = tinnitusSim.mode === 'muffled-tinnitus' ? 0.045 : 0.025;
    return (tinnitusSim.volumePct / 100) * baseMax;
}

function startTinnitusAudio() {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            showToast('הדפדפן אינו תומך בהפקת שמע להדמיה זו');
            return;
        }

        if (!tinnitusSim.ctx) {
            tinnitusSim.ctx = new AudioContextClass();
        }
        if (tinnitusSim.ctx.state === 'suspended') {
            tinnitusSim.ctx.resume();
        }

        stopTinnitusAudio(true);

        const osc = tinnitusSim.ctx.createOscillator();
        const gainNode = tinnitusSim.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(3100, tinnitusSim.ctx.currentTime);

        gainNode.gain.setValueAtTime(0.0001, tinnitusSim.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            Math.max(0.0002, getTinnitusGainValue()),
            tinnitusSim.ctx.currentTime + 0.15
        );

        osc.connect(gainNode);
        gainNode.connect(tinnitusSim.ctx.destination);
        osc.start();

        tinnitusSim.osc = osc;
        tinnitusSim.gainNode = gainNode;
        tinnitusSim.isPlaying = true;
        updateTinnitusAudioUi();
    } catch (err) {
        showToast('לא ניתן להפעיל שמע כרגע');
    }
}

function stopTinnitusAudio(silent = false) {
    if (tinnitusSim.osc) {
        try {
            tinnitusSim.osc.stop();
            tinnitusSim.osc.disconnect();
        } catch (e) {}
        tinnitusSim.osc = null;
    }
    if (tinnitusSim.gainNode) {
        try {
            tinnitusSim.gainNode.disconnect();
        } catch (e) {}
        tinnitusSim.gainNode = null;
    }
    tinnitusSim.isPlaying = false;
    if (!silent) updateTinnitusAudioUi();
}

function updateTinnitusAudioUi() {
    const btn = document.getElementById('toggleTinnitusAudioBtn');
    const label = document.getElementById('tinnitusAudioLabel');
    if (!btn || !label) return;

    btn.classList.toggle('playing', tinnitusSim.isPlaying);
    btn.setAttribute('aria-pressed', tinnitusSim.isPlaying ? 'true' : 'false');
    btn.innerHTML = tinnitusSim.isPlaying
        ? '<i class="fa-solid fa-stop" aria-hidden="true"></i> <span id="tinnitusAudioLabel">עצור צליל טנטון</span>'
        : '<i class="fa-solid fa-play" aria-hidden="true"></i> <span id="tinnitusAudioLabel">השמע צליל טנטון עדין</span>';
}

function setSensoryMode(mode) {
    tinnitusSim.mode = mode;

    const box = document.getElementById('sensoryVisualBox');
    const badge = document.getElementById('tinnitusWaveBadge');
    const pill = document.getElementById('sensoryStatePill');
    const title = document.getElementById('sensoryStateTitle');
    const desc = document.getElementById('sensoryStateDesc');
    const note = document.getElementById('sensoryStateNote');

    document.querySelectorAll('[data-sensory-mode]').forEach(btn => {
        const isActive = btn.getAttribute('data-sensory-mode') === mode;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    if (box) box.setAttribute('data-sensory', mode);

    if (mode === 'muffled-tinnitus') {
        if (badge) badge.textContent = 'אטימות ("כמו במטוס") + צפצוף טנטון';
        if (pill) {
            pill.textContent = 'אטימות וטנטון';
            pill.className = 'badge-pill badge-amber';
        }
        if (title) title.textContent = 'תחושת אוזניים אטומות לצד צליל טנטון פנימי';
        if (desc) {
            desc.textContent = 'במצב של ירידת לחץ וציפה, חלק מהמתמודדים חווים תחושה של "פקק" או אטימות באוזניים (דומה לשינוי גובה בטיסה) יחד עם טנטון שמתחרה בקולות הסביבה ומכביד על הריכוז.';
        }
        if (note) {
            note.className = 'callout-box callout-amber';
            note.innerHTML = '<strong>מה עוזר בפועל:</strong> סביבה שקטה יותר, דיבור ברור ובקצב נוח, והבנה שזו תופעה פיזיולוגית ולא חוסר קשב.';
        }
    } else {
        if (badge) badge.textContent = 'מצב רגיל: ללא אטימות או זמזום';
        if (pill) {
            pill.textContent = 'שמיעה מאוזנת';
            pill.className = 'badge-pill badge-sky';
        }
        if (title) title.textContent = 'כך נשמעת ומרגישה סביבה רגילה';
        if (desc) {
            desc.textContent = 'במצב זה הצלילים ברורים והאוזניים אינן מרגישות לחץ או "פקק". בדליפת CSF או פיסטולה ורידית, ירידת הלחץ והשינוי בציפה עשויים לגרום לתחושת מלאות/אטימות באוזניים ולטנטון (צפצוף או זמזום פנימי) שמקשים להקשיב ולשוחח.';
        }
        if (note) {
            note.className = 'callout-box callout-sky';
            note.innerHTML = '<strong>למה חשוב להראות זאת לבני משפחה?</strong> כשאדם עייף או מתוח משילוב של כאב, אטימות וצפצוף באוזניים, שיחה רגילה ברקע רועש דורשת ממנו הרבה יותר מאמץ.';
        }
    }

    if (tinnitusSim.isPlaying && tinnitusSim.gainNode && tinnitusSim.ctx) {
        tinnitusSim.gainNode.gain.setTargetAtTime(
            Math.max(0.0002, getTinnitusGainValue()),
            tinnitusSim.ctx.currentTime,
            0.08
        );
    }
}

function setLightFogMode(mode) {
    const box = document.getElementById('lightFogPreviewBox');
    const badge = document.getElementById('lightFogBadge');
    const sampleTitle = document.getElementById('lightFogSampleTitle');
    const sampleText = document.getElementById('lightFogSampleText');
    const pill = document.getElementById('lightFogStatePill');
    const title = document.getElementById('lightFogStateTitle');
    const desc = document.getElementById('lightFogStateDesc');
    const tip = document.getElementById('lightFogStateTip');

    document.querySelectorAll('[data-light-fog-mode]').forEach(btn => {
        const isActive = btn.getAttribute('data-light-fog-mode') === mode;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    if (box) box.setAttribute('data-lf-mode', mode);

    if (mode === 'photophobia') {
        if (badge) {
            badge.textContent = 'רגישות לאור';
            badge.className = 'badge-pill badge-amber';
        }
        if (sampleTitle) sampleTitle.textContent = 'אור חזק או מסך בוהק שמעייף את העיניים';
        if (sampleText) sampleText.textContent = 'כשיש פוטופוביה, אור פלורסנט, שמש או מסך בהיר עשויים להרגיש צורבים ולעורר רצון לעצום עיניים או להסיט מבט.';
        if (pill) {
            pill.textContent = 'רגישות לאור (פוטופוביה)';
            pill.className = 'badge-pill badge-amber';
        }
        if (title) title.textContent = 'עומס חזותי מאור חזק או ניגודיות גבוהה';
        if (desc) desc.textContent = 'בזמן תת-לחץ תוך-גולגולתי או כאב ראש תנוחתי, מערכת הראייה והעצבים עשויה להגיב בעוצמה לאור רגיל שנראה לאחרים נעים.';
        if (tip) {
            tip.className = 'callout-box callout-amber';
            tip.innerHTML = '<strong>איך אפשר לעזור?</strong> עמעום תאורה, הורדת בהירות מסכים או שימוש ב"מצב קריאה עדין" בראש האתר.';
        }
    } else if (mode === 'brain-fog') {
        if (badge) {
            badge.textContent = 'ערפול מוחי';
            badge.className = 'badge-pill badge-purple';
        }
        if (sampleTitle) sampleTitle.textContent = 'מחשבות שמרגישות קצת מטושטשות או איטיות יותר';
        if (sampleText) sampleText.textContent = 'קשה לפעמים להחזיק כמה פרטים בראש בבת אחת, לזכור מילה מדויקת או להתרכז בשיחה מורכבת בלי לעצור.';
        if (pill) {
            pill.textContent = 'ערפול מוחי (Brain Fog)';
            pill.className = 'badge-pill badge-purple';
        }
        if (title) title.textContent = 'קושי במיקוד, בשליפת מילים ובעיבוד מידע';
        if (desc) desc.textContent = 'ערפול מוחי הוא תסמין מוכר ומתסכל: הראש רוצה להבין ולענות, אבל נדרש מאמץ נוסף כדי לארגן מחשבות.';
        if (tip) {
            tip.className = 'callout-box callout-purple';
            tip.innerHTML = '<strong>איך אפשר לעזור?</strong> משפטים קצרים ופשוטים, בלי ללחוץ לתשובה מיידית, ומתן אפשרות לנוח או לחזור לנושא מאוחר יותר.';
        }
    } else {
        if (badge) {
            badge.textContent = 'תצוגה רגילה';
            badge.className = 'badge-pill badge-sky';
        }
        if (sampleTitle) sampleTitle.textContent = 'דוגמה לקריאה ושליפת מילים';
        if (sampleText) sampleText.textContent = 'במצב מאוזן קל לקרוא שורה אחרי שורה, לחבר בין רעיונות ולהגיב מיד לשאלות שמתנהלות סביבך.';
        if (pill) {
            pill.textContent = 'מיקוד מלא';
            pill.className = 'badge-pill badge-emerald';
        }
        if (title) title.textContent = 'כך מרגישה תצוגה בהירה וצלולה';
        if (desc) desc.textContent = 'בדליפת CSF או תת-לחץ תוך-גולגולתי, שילוב של שינוי בלחץ הנוזל ועייפות עצבית עשוי לעורר רגישות לאור בוהק (פוטופוביה) או תחושה של "ערפל" שקשה לחשוב דרכו.';
        if (tip) {
            tip.className = 'callout-box callout-sky';
            tip.innerHTML = '<strong>איך אפשר לעזור?</strong> תאורה רכה יותר, זמן מנוחה בין משימות וסבלנות כשאדם עוצר לרגע לחפש מילה.';
        }
    }
}

function renderDoctorPrepSheet() {
    const out = document.getElementById('prepSheetOutput');
    const titleEl = document.getElementById('prepSheetTitle');
    const subEl = document.getElementById('prepSheetSub');
    const previewBox = document.getElementById('prepSheetPreview');
    if (!out) return;

    const startWhen = (document.getElementById('prepStartWhen')?.value || '').trim();
    const testsDone = (document.getElementById('prepTestsDone')?.value || '').trim();
    const dailyImpact = (document.getElementById('prepDailyImpact')?.value || '').trim();
    const standTime = document.getElementById('prepStandingTime')?.value || '';
    const lieTime = document.getElementById('prepLyingTime')?.value || '';

    const checkedSymptoms = Array.from(
        document.querySelectorAll('#prepSymptomsGroup input[type="checkbox"]:checked')
    ).map(cb => cb.value);

    if (doctorPrepLang === 'en') {
        if (previewBox) previewBox.setAttribute('dir', 'ltr');
        if (titleEl) titleEl.textContent = 'Patient Symptom & Posture Summary';
        if (subEl) subEl.textContent = 'Medical Consultation Brief • CSF Leak IL';

        const symList = checkedSymptoms.length
            ? checkedSymptoms.map(s => `• ${EN_SYMPTOM_MAP[s] || s}`).join('\n')
            : '• Not specified';

        out.textContent = [
            `Onset & Background: ${startWhen || 'Not specified'}`,
            ``,
            `Primary Symptoms:`,
            symList,
            ``,
            `Postural Pattern:`,
            `• Worsening when upright: ${EN_TIME_MAP[standTime] || standTime}`,
            `• Relief when lying flat: ${EN_TIME_MAP[lieTime] || lieTime}`,
            ``,
            `Prior Imaging & Treatments: ${testsDone || 'None / Not specified'}`,
            ``,
            `Functional Impact & Key Question: ${dailyImpact || 'Evaluation for suspected CSF leak / SIH and next diagnostic steps.'}`
        ].join('\n');
    } else {
        if (previewBox) previewBox.setAttribute('dir', 'rtl');
        if (titleEl) titleEl.textContent = 'סיכום תסמינים ותנוחות לקראת פגישה רפואית';
        if (subEl) subEl.textContent = 'מסמך הכנה אישי • CSF Leak IL';

        const symList = checkedSymptoms.length
            ? checkedSymptoms.map(s => `• ${s}`).join('\n')
            : '• לא סומנו תסמינים';

        out.textContent = [
            `תחילת התסמינים ורקע: ${startWhen || 'לא צוין'}`,
            ``,
            `תסמינים מרכזיים:`,
            symList,
            ``,
            `דפוס תנוחתי (שכיבה מול עמידה):`,
            `• החמרה בעמידה/ישיבה: ${standTime}`,
            `• הקלה בשכיבה שטוחה: ${lieTime}`,
            ``,
            `בדיקות וטיפולים קודמים: ${testsDone || 'לא צוין'}`,
            ``,
            `השפעה על התפקוד ושאלה לרופא: ${dailyImpact || 'בירור חשד לדליפת CSF / תת־לחץ תוך־גולגולתי והצעד האבחוני הבא.'}`
        ].join('\n');
    }
}

function initDoctorPrepBuilder() {
    const builder = document.getElementById('doctorPrepBuilder');
    if (!builder) return;

    renderDoctorPrepSheet();

    if (!builder.dataset.bound) {
        builder.dataset.bound = 'true';
        builder.addEventListener('input', renderDoctorPrepSheet);
        builder.addEventListener('change', renderDoctorPrepSheet);
    }
}

function bindInfoEvents() {
    if (infoEventsBound) return;
    infoEventsBound = true;

    document.addEventListener('click', (e) => {
        const medTabBtn = e.target.closest('[data-med-tab]');
        if (medTabBtn) {
            stopTinnitusAudio(true);
            switchMedicalTab(medTabBtn.getAttribute('data-med-tab'), medTabBtn);
            return;
        }

        const accTrigger = e.target.closest('[data-acc-target]');
        if (accTrigger) {
            toggleAccordion(accTrigger.getAttribute('data-acc-target'), accTrigger);
            return;
        }

        const simBtn = e.target.closest('[data-sim-posture]');
        if (simBtn) {
            setPostureState(simBtn.getAttribute('data-sim-posture'));
            return;
        }

        const wizardChoiceBtn = e.target.closest('[data-wizard-choice]');
        if (wizardChoiceBtn) {
            wizardState.answers[wizardState.step] = Number(wizardChoiceBtn.getAttribute('data-wizard-choice'));
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

        const sensoryBtn = e.target.closest('[data-sensory-mode]');
        if (sensoryBtn) {
            setSensoryMode(sensoryBtn.getAttribute('data-sensory-mode'));
            return;
        }

        if (e.target.closest('#toggleTinnitusAudioBtn')) {
            if (tinnitusSim.isPlaying) {
                stopTinnitusAudio();
            } else {
                startTinnitusAudio();
            }
            return;
        }

        const lightFogBtn = e.target.closest('[data-light-fog-mode]');
        if (lightFogBtn) {
            setLightFogMode(lightFogBtn.getAttribute('data-light-fog-mode'));
            return;
        }

        const prepLangBtn = e.target.closest('[data-prep-lang]');
        if (prepLangBtn) {
            doctorPrepLang = prepLangBtn.getAttribute('data-prep-lang');
            document.querySelectorAll('[data-prep-lang]').forEach(b => {
                const active = b.getAttribute('data-prep-lang') === doctorPrepLang;
                b.classList.toggle('active', active);
                b.setAttribute('aria-pressed', active ? 'true' : 'false');
            });
            renderDoctorPrepSheet();
            return;
        }

        if (e.target.closest('#copyDoctorPrepBtn')) {
            const out = document.getElementById('prepSheetOutput');
            if (out && navigator.clipboard && typeof showToast === 'function') {
                navigator.clipboard.writeText(out.textContent).then(() => {
                    showToast('הסיכום הועתק! אפשר להדביק או לשלוח לרופא');
                });
            }
            return;
        }

        if (e.target.closest('#printDoctorPrepBtn')) {
            document.body.classList.add('printing-doctor-prep');
            window.print();
            setTimeout(() => {
                document.body.classList.remove('printing-doctor-prep');
            }, 300);
        }
    });

    document.addEventListener('input', (e) => {
        if (e.target && e.target.id === 'tinnitusVolumeRange') {
            tinnitusSim.volumePct = Number(e.target.value) || 20;
            const valEl = document.getElementById('tinnitusVolumeValue');
            if (valEl) {
                valEl.textContent = tinnitusSim.volumePct <= 25
                    ? `נמוכה מאוד (${tinnitusSim.volumePct}%)`
                    : `בינונית-נמוכה (${tinnitusSim.volumePct}%)`;
            }
            if (tinnitusSim.isPlaying && tinnitusSim.gainNode && tinnitusSim.ctx) {
                tinnitusSim.gainNode.gain.setTargetAtTime(
                    Math.max(0.0002, getTinnitusGainValue()),
                    tinnitusSim.ctx.currentTime,
                    0.08
                );
            }
        }
    });
}

window.onBeforeNavigatePage = function () {
    stopTinnitusAudio(true);
};

window.initInfoPage = function () {
    bindInfoEvents();
    if (!document.getElementById('medicalTabContainer')) return;

    initSymptomWizard();
    setSensoryMode(tinnitusSim.mode);
    updateTinnitusAudioUi();
    setLightFogMode('normal');
    initDoctorPrepBuilder();
};