import { auth, db } from "./firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const nicknameForm = document.getElementById("nickname-form");
const nicknameInput = document.getElementById("profile-nickname");
const nicknameStatus = document.getElementById("nickname-status");

const symptomForm = document.getElementById("symptom-form");
const symptomStatus = document.getElementById("symptom-status");
const logsList = document.getElementById("logs-list");

let activeUser = null;
let unsubscribeLogs = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "auth.html?redirect=profile.html";
    return;
  }

  activeUser = user;

  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists() && snap.data().nickname) {
      nicknameInput.value = snap.data().nickname;
    } else if (user.displayName) {
      nicknameInput.value = user.displayName;
    }
  } catch (err) {
    nicknameStatus.textContent = "לא ניתן לטעון פרופיל: " + err.message;
  }

  if (unsubscribeLogs) unsubscribeLogs();

  const logsQuery = query(
    collection(db, "users", user.uid, "symptom_logs"),
    orderBy("createdAt", "desc")
  );

  unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
    logsList.innerHTML = "";
    if (snapshot.empty) {
      logsList.textContent = "עדיין אין רשומות ביומן.";
      return;
    }

    snapshot.forEach((docSnap) => {
      const item = docSnap.data();
      const row = document.createElement("div");
      row.style.padding = "0.75rem 0";
      row.style.borderBottom = "1px solid var(--border)";

      const dateLabel = item.createdAt?.toDate
        ? item.createdAt.toDate().toLocaleDateString("he-IL")
        : "עכשיו";

      const headerLine = document.createElement("strong");
      headerLine.textContent = `עוצמה: ${item.level}/10 • ${dateLabel}`;

      const notesLine = document.createElement("p");
      notesLine.className = "post-excerpt";
      notesLine.textContent = item.notes || "";

      row.append(headerLine, notesLine);
      logsList.appendChild(row);
    });
  }, (err) => {
    logsList.textContent = "שגיאה בטעינת היומן: " + err.message;
  });
});

nicknameForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!activeUser) return;

  const nickname = nicknameInput.value.trim();
  if (!nickname) return;

  nicknameStatus.textContent = "שומר כינוי...";
  try {
    await setDoc(doc(db, "users", activeUser.uid), {
      nickname,
      updatedAt: serverTimestamp()
    }, { merge: true });
    nicknameStatus.textContent = "הכינוי נשמר!";
  } catch (err) {
    nicknameStatus.textContent = "שגיאה בשמירת כינוי: " + err.message;
  }
});

symptomForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!activeUser) return;

  const level = Number(document.getElementById("symptom-level").value);
  const notes = document.getElementById("symptom-notes").value.trim();

  symptomStatus.textContent = "שומר ביומן...";
  try {
    await addDoc(collection(db, "users", activeUser.uid, "symptom_logs"), {
      level,
      notes,
      createdAt: serverTimestamp()
    });
    symptomForm.reset();
    symptomStatus.textContent = "הרשומה נוספה ליומן!";
  } catch (err) {
    symptomStatus.textContent = "שגיאה בהוספה: " + err.message;
  }
});