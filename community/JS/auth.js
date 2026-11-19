import { auth, db } from "./firebase-init.js";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const nicknameField = document.getElementById("nickname-field");
const nicknameInput = document.getElementById("auth-nickname");
const emailSubmitBtn = document.getElementById("email-submit-btn");
const emailForm = document.getElementById("email-auth-form");
const googleBtn = document.getElementById("google-login-btn");
const statusEl = document.getElementById("auth-status");

let mode = "login"; // "login" | "signup"

const params = new URLSearchParams(window.location.search);
const redirectTarget = params.get("redirect") || "index.html";

// כרטיס תצוגת פרופיל עם תמונה/אווטאר בעמוד ההתחברות
const previewCard = document.createElement("div");
previewCard.className = "profile-preview-card";
previewCard.style.display = "none";
if (emailForm && emailForm.parentNode) {
  emailForm.parentNode.insertBefore(previewCard, emailForm);
}

function renderProfilePreview(name, email, photoURL) {
  previewCard.innerHTML = "";
  let avatarNode;
  if (photoURL) {
    const img = document.createElement("img");
    img.src = photoURL;
    img.alt = name || "תמונת פרופיל";
    img.className = "avatar-img";
    img.referrerPolicy = "no-referrer";
    img.addEventListener("error", () => {
      img.replaceWith(createFallbackNode(name));
    });
    avatarNode = img;
  } else {
    avatarNode = createFallbackNode(name);
  }

  const meta = document.createElement("div");
  meta.className = "profile-preview-meta";

  const title = document.createElement("div");
  title.className = "profile-preview-name";
  title.textContent = name || "חבר קהילה";

  const sub = document.createElement("div");
  sub.className = "profile-preview-sub";
  sub.textContent = email ? `מחובר כעת • ${email}` : "מחובר כעת לחשבון";

  meta.append(title, sub);
  previewCard.append(avatarNode, meta);
  previewCard.style.display = "flex";
}

function createFallbackNode(name) {
  const span = document.createElement("span");
  span.className = "avatar-fallback";
  span.textContent = ((name || "ק").trim().charAt(0) || "ק").toUpperCase();
  return span;
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    previewCard.style.display = "none";
    return;
  }

  let nick = user.displayName || "חבר קהילה";
  let photo = user.photoURL || "";
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      nick = snap.data().nickname || nick;
      photo = snap.data().photoURL || photo;
    }
  } catch {
    // מתעלמים משגיאת קריאה מקומית
  }

  renderProfilePreview(nick, user.email, photo);
});

function setMode(nextMode) {
  mode = nextMode;
  if (mode === "login") {
    nicknameField.style.display = "none";
    nicknameInput.required = false;
    emailSubmitBtn.textContent = "התחברות";
    tabLogin.style.backgroundColor = "var(--mid-blue)";
    tabLogin.style.color = "#ffffff";
    tabSignup.style.backgroundColor = "var(--soft-blue)";
    tabSignup.style.color = "var(--dark-blue)";
  } else {
    nicknameField.style.display = "block";
    nicknameInput.required = true;
    emailSubmitBtn.textContent = "הרשמה";
    tabSignup.style.backgroundColor = "var(--mid-blue)";
    tabSignup.style.color = "#ffffff";
    tabLogin.style.backgroundColor = "var(--soft-blue)";
    tabLogin.style.color = "var(--dark-blue)";
  }
  statusEl.textContent = "";
}

tabLogin.addEventListener("click", () => setMode("login"));
tabSignup.addEventListener("click", () => setMode("signup"));

async function ensureUserProfile(user, chosenNickname = "") {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  const fallbackNick = chosenNickname.trim()
    || (snap.exists() && snap.data().nickname)
    || user.displayName
    || "חבר קהילה";

  const payload = {
    nickname: fallbackNick,
    updatedAt: serverTimestamp()
  };

  if (user.photoURL) {
    payload.photoURL = user.photoURL;
  }

  if (!snap.exists()) {
    payload.role = "member";
  }

  await setDoc(userRef, payload, { merge: true });
}

googleBtn.addEventListener("click", async () => {
  statusEl.textContent = "מתחבר עם Google...";
  try {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    await ensureUserProfile(cred.user);
    window.location.href = redirectTarget;
  } catch (err) {
    statusEl.textContent = "שגיאה בכניסה עם Google: " + err.message;
  }
});

emailForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("auth-email").value.trim();
  const password = document.getElementById("auth-password").value;
  const nickname = nicknameInput.value.trim();

  statusEl.textContent = mode === "signup" ? "יוצר חשבון..." : "מתחבר...";

  try {
    if (mode === "signup") {
      if (!nickname) {
        statusEl.textContent = "נא להזין כינוי להרשמה.";
        return;
      }
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await ensureUserProfile(cred.user, nickname);
    } else {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await ensureUserProfile(cred.user);
    }
    window.location.href = redirectTarget;
  } catch (err) {
    statusEl.textContent = "שגיאה: " + err.message;
  }
});