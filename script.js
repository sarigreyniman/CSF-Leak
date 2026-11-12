// פונקציות גלובליות לאתר CSF Leak IL

window.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});

function toggleMobileNav() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('hidden');
}
function closeMobileNav() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.add('hidden');
}

let calmModeActive = false;
function toggleCalmMode() {
    calmModeActive = !calmModeActive;
    const btn = document.getElementById('calmToggleBtn');
    if (calmModeActive) {
        document.body.classList.add('calm-mode');
        showToast("מצב קריאה רגוע הופעל: ניגודיות מופחתת להקלה על כאבי ראש");
        if (btn) btn.innerHTML = '<i class="fa-solid fa-eye text-sky-400"></i><span>ביטול מצב רגוע</span>';
    } else {
        document.body.classList.remove('calm-mode');
        showToast("חזרת למצב צפייה רגיל");
        if (btn) btn.innerHTML = '<i class="fa-solid fa-eye-slash text-sky-400"></i><span>מצב קריאה עדין</span>';
    }
}

function switchMedicalTab(tabKey, btn) {
    document.querySelectorAll('#medicalTabContainer .tab-btn').forEach(b => {
        b.classList.remove('active');
        b.classList.add('bg-white', 'text-navy-800');
    });
    if (btn) {
        btn.classList.add('active');
        btn.classList.remove('bg-white', 'text-navy-800');
    }

    ['mechanism', 'symptoms', 'imaging', 'treatment'].forEach(key => {
        const el = document.getElementById('med-tab-' + key);
        if (el) {
            if (key === tabKey) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    });
}

function toggleAccordion(id) {
    const content = document.getElementById('content-' + id);
    const icon = document.getElementById('icon-' + id);
    if (content && icon) {
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            icon.classList.add('rotate-180');
        } else {
            content.classList.add('hidden');
            icon.classList.remove('rotate-180');
        }
    }
}

function applyDiscFilter(cat, btn) {
    document.querySelectorAll('#discFilterTabs .tab-btn').forEach(b => {
        b.classList.remove('active');
        b.classList.add('bg-white', 'text-navy-800');
    });
    if (btn) {
        btn.classList.add('active');
        btn.classList.remove('bg-white', 'text-navy-800');
    }

    const items = document.querySelectorAll('.disc-item');
    items.forEach(item => {
        if (cat === 'all' || item.getAttribute('data-cat') === cat) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function searchDiscussions() {
    const input = document.getElementById('discSearchInput');
    if (!input) return;
    const query = input.value.toLowerCase();
    const items = document.querySelectorAll('.disc-item');
    items.forEach(item => {
        const text = item.innerText.toLowerCase();
        if (text.includes(query)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function openForumModal() {
    const modal = document.getElementById('forumModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}
function closeForumModal() {
    const modal = document.getElementById('forumModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function postNewDiscussion(e) {
    e.preventDefault();
    const catEl = document.getElementById('newDiscCat');
    const nameEl = document.getElementById('newDiscName');
    const titleEl = document.getElementById('newDiscTitle');
    const textEl = document.getElementById('newDiscText');

    if (!titleEl) return;

    const cat = catEl ? catEl.value : 'diagnosis';
    const author = nameEl ? nameEl.value : 'אנונימי';
    const title = titleEl.value;
    const text = textEl ? textEl.value : '';

    const categoryLabels = {
        bloodpatch: 'התאוששות מ-Blood Patch',
        diagnosis: 'אבחון והדמיות',
        rights: 'זכויות וביטוח לאומי',
        life: 'חיים בשכיבה'
    };

    const container = document.getElementById('discListContainer');
    if (container) {
        const newElem = document.createElement('div');
        newElem.className = 'disc-item p-6 rounded-2xl bg-white border border-gold/30 shadow-card transition';
        newElem.setAttribute('data-cat', cat);
        newElem.innerHTML = `
            <div class="flex items-start justify-between gap-4">
                <div class="space-y-2">
                    <div class="flex items-center gap-2">
                        <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">${categoryLabels[cat] || 'כללי'}</span>
                        <span class="text-xs text-gray-400">הרגע • מאת ${author}</span>
                    </div>
                    <h3 class="font-heading font-bold text-lg text-navy-800">${title}</h3>
                    <p class="text-xs text-navy-700/85 leading-relaxed">${text}</p>
                </div>
                <div class="flex flex-col items-center justify-center p-3 rounded-xl bg-cream-50 border border-gold/20 min-w-[75px]">
                    <i class="fa-regular fa-comment-dots text-tealBrand text-lg"></i>
                    <span class="text-xs font-bold text-navy-800 mt-1">חדש</span>
                </div>
            </div>
        `;
        container.prepend(newElem);
    }
    closeForumModal();
    titleEl.value = '';
    if (textEl) textEl.value = '';
    showToast("שאלתך נוספה בהצלחה לדיוני הקהילה!");
}

function handleContactSubmit(e) {
    e.preventDefault();
    showToast("פנייתך התקבלה בסודיות מלאה. נציג הקהילה ייצור קשר בהקדם!");
    const form = document.getElementById('mainContactForm');
    if (form) form.reset();
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
        toast.classList.remove('translate-y-36');
        toast.classList.add('translate-y-0');
        setTimeout(() => {
            toast.classList.remove('translate-y-0');
            toast.classList.add('translate-y-36');
        }, 4500);
    }
}
