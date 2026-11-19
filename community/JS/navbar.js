import { auth, db } from "./firebase-init.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

function ensureFontsAndIcons() {
  if (document.getElementById("csf-fonts-link")) return;

  const p1 = document.createElement("link");
  p1.rel = "preconnect";
  p1.href = "https://fonts.googleapis.com";

  const p2 = document.createElement("link");
  p2.rel = "preconnect";
  p2.href = "https://fonts.gstatic.com";
  p2.crossOrigin = "anonymous";

  const fonts = document.createElement("link");
  fonts.id = "csf-fonts-link";
  fonts.rel = "stylesheet";
  fonts.href = "https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700&family=Rubik:wght@600;700;800&display=swap";

  const fa = document.createElement("link");
  fa.rel = "stylesheet";
  fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";

  document.head.append(p1, p2, fonts, fa);
}

function getPageMeta() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes("post.html")) {
    return {
      key: "post",
      kicker: "דיון בקהילה",
      title: "שרשור ותגובות",
      desc: "מרחב לשיתוף ניסיון, שאלות ותמיכה הדדית בין חברי הקהילה."
    };
  }
  if (path.includes("auth.html")) {
    return {
      key: "auth",
      kicker: "אזור אישי",
      title: "התחברות וניהול פרופיל",
      desc: "התחברי עם חשבון Google או אימייל כדי לפתוח דיונים ולהגיב בשרשורים."
    };
  }
  return {
    key: "index",
    kicker: "קהילת מתמודדי דליפת CSF בישראל",
    title: "פורום הקהילה והדיונים",
    desc: "מקום בטוח, מכבד ונטול אינטרסים לשאול שאלות, לשתף בתהליך ולהתייעץ עם חברי הקהילה."
  };
}

function mountSharedChrome() {
  // הסרת הדר ישן אם קיים בקובץ ה-HTML כדי למנוע כפילות
  document.querySelectorAll("header.topbar, .topbar:not(.top-bar)").forEach((oldHeader) => {
    oldHeader.remove();
  });

  if (!document.querySelector(".site-header")) {
    const meta = getPageMeta();
    const headerWrap = document.createElement("div");
    headerWrap.innerHTML = `
      <div class="top-bar">
        <div class="container top-bar-inner">
          <div class="top-bar-badge">
            <i class="fa-solid fa-shield-heart" aria-hidden="true"></i>
            <span>מרחב בטוח, נטול אינטרסים מסחריים, למתמודדים עם דליפת נוזל מוח-שדרה</span>
          </div>
          <div class="top-bar-actions">
            <a href="index.html" class="urgent-link">לוח הדיונים</a>
          </div>
        </div>
      </div>

      <header class="site-header">
        <div class="container header-inner">
          <a href="index.html" class="brand-link">
            <div class="brand-logo-wrap">
              <img src="../images/logo.png" alt="CSF Leak IL - לוגו הקהילה" class="brand-logo">
            </div>
            <div class="brand-text">
              <span class="brand-title">CSF LEAK IL • קהילה</span>
              <span class="brand-subtitle">פורום מתמודדי דליפת CSF בישראל</span>
            </div>
          </a>

          <nav class="main-nav topbar-nav" aria-label="תפריט ניווט בפורום">
            <a href="index.html" class="nav-link ${meta.key === "index" ? "active" : ""}">דיוני הפורום</a>
            <a href="auth.html" class="nav-link ${meta.key === "auth" ? "active" : ""}">אזור אישי והתחברות</a>
          </nav>

          <div class="header-cta" id="header-user-area">
            <span id="nav-user-pill" class="nav-user-pill" style="display:none;"></span>
            <a id="nav-auth-action" href="auth.html" class="btn-whatsapp-nav">
              <i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i>
              <span>התחברות</span>
            </a>
          </div>
        </div>
      </header>

      <section class="forum-hero-banner">
        <div class="container">
          <div class="banner-kicker">
            <i class="fa-solid fa-comments" aria-hidden="true"></i>
            <span>${meta.kicker}</span>
          </div>
          <h1>${meta.title}</h1>
          <p>${meta.desc}</p>
        </div>
      </section>
    `;

    while (headerWrap.firstElementChild) {
      document.body.insertBefore(headerWrap.firstElementChild, document.body.firstChild);
    }

    const brandLogoImg = document.querySelector(".brand-logo");
    if (brandLogoImg) {
      brandLogoImg.addEventListener("error", () => {
        const wrap = brandLogoImg.closest(".brand-logo-wrap");
        if (wrap) {
          wrap.innerHTML = '<i class="fa-solid fa-droplet" style="color:#0284C7;font-size:1.35rem;"></i>';
        }
      });
    }
  }

  if (!document.querySelector(".forum-footer")) {
    const footer = document.createElement("footer");
    footer.className = "forum-footer";
    footer.innerHTML = `
      <div class="container">
        <p style="color:#CBD5E1;margin-bottom:0.4rem;">
          <strong>הבהרה רפואית:</strong> התכנים בפורום מיועדים לתמיכה הדדית ושיתוף ניסיון בלבד ואינם מהווים ייעוץ רפואי.
        </p>
        <div style="color:#94A3B8;">© 2026 CSF Leak IL • קהילת מתמודדי דליפת CSF בישראל</div>
      </div>
    `;
    document.body.appendChild(footer);
  }
}

function createInitialsAvatar(name) {
  const span = document.createElement("span");
  span.className = "avatar-fallback";
  const clean = (name || "ק").trim();
  span.textContent = clean.charAt(0).toUpperCase();
  return span;
}

function createAvatarEl(name, photoURL) {
  if (photoURL) {
    const img = document.createElement("img");
    img.src = photoURL;
    img.alt = name || "תמונת פרופיל";
    img.className = "avatar-img";
    img.referrerPolicy = "no-referrer";
    img.addEventListener("error", () => {
      img.replaceWith(createInitialsAvatar(name));
    });
    return img;
  }
  return createInitialsAvatar(name);
}

ensureFontsAndIcons();
mountSharedChrome();

const userPillEl = document.getElementById("nav-user-pill");
const authActionEl = document.getElementById("nav-auth-action");

if (userPillEl && authActionEl) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      let displayName = user.displayName || "חבר קהילה";
      let photoURL = user.photoURL || "";

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          displayName = snap.data().nickname || displayName;
          photoURL = snap.data().photoURL || photoURL;
        }
      } catch {
        // ממשיכים עם נתוני Auth
      }

      userPillEl.innerHTML = "";
      userPillEl.append(createAvatarEl(displayName, photoURL));

      const nameSpan = document.createElement("span");
      nameSpan.textContent = displayName;
      userPillEl.appendChild(nameSpan);
      userPillEl.style.display = "inline-flex";

      authActionEl.innerHTML = '<i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i><span>התנתקות</span>';
      authActionEl.href = "#";
      authActionEl.onclick = async (e) => {
        e.preventDefault();
        const confirmed = window.confirm("האם את בטוחה שברצונך להתנתק מהחשבון?");
        if (!confirmed) return;

        try {
          await signOut(auth);
          window.location.href = "index.html";
        } catch (err) {
          console.error("שגיאה בהתנתקות:", err);
        }
      };
    } else {
      userPillEl.style.display = "none";
      userPillEl.innerHTML = "";

      authActionEl.innerHTML = '<i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i><span>התחברות</span>';
      authActionEl.href = "auth.html";
      authActionEl.onclick = null;
    }
  });
}