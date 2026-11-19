import { auth, db } from "./firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const toggleFormBtn = document.getElementById("toggle-post-form");
const newPostBox = document.getElementById("new-post-box");
const createPostForm = document.getElementById("create-post-form");
const authorInput = document.getElementById("author-name");
const postStatus = document.getElementById("post-status");
const categoryFilter = document.getElementById("category-filter");
const postsList = document.getElementById("posts-list");

let currentUser = null;
let currentNickname = "חבר קהילה";
let isAdmin = false;
let loadedPosts = [];

onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  isAdmin = false;

  if (user) {
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        currentNickname = snap.data().nickname || user.displayName || "חבר קהילה";
        isAdmin = snap.data().role === "admin";
      } else {
        currentNickname = user.displayName || "חבר קהילה";
      }
    } catch {
      currentNickname = user.displayName || "חבר קהילה";
    }

    if (authorInput) {
      authorInput.value = currentNickname;
      authorInput.readOnly = true;
    }
  } else {
    newPostBox.style.display = "none";
    if (authorInput) {
      authorInput.value = "";
      authorInput.readOnly = false;
    }
  }

  renderPosts();
});

toggleFormBtn.addEventListener("click", () => {
  if (!currentUser) {
    window.location.href = "auth.html?redirect=index.html";
    return;
  }
  const isHidden = newPostBox.style.display === "none";
  newPostBox.style.display = isHidden ? "block" : "none";
});

createPostForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) {
    window.location.href = "auth.html?redirect=index.html";
    return;
  }

  const author = currentNickname;
  const category = document.getElementById("post-category").value;
  const title = document.getElementById("post-title").value.trim();
  const body = document.getElementById("post-body").value.trim();

  if (!title || !body) return;

  postStatus.textContent = "שומר ב-Firestore...";

  try {
    await addDoc(collection(db, "posts"), {
      author,
      authorId: currentUser.uid,
      category,
      title,
      body,
      isPinned: false,
      isLocked: false,
      createdAt: serverTimestamp()
    });

    createPostForm.reset();
    authorInput.value = currentNickname;
    newPostBox.style.display = "none";
    postStatus.textContent = "";
  } catch (error) {
    postStatus.textContent = "שגיאה בשמירה: " + error.message;
  }
});

async function togglePostFlag(postId, field, currentValue) {
  if (!isAdmin) return;
  try {
    await updateDoc(doc(db, "posts", postId), {
      [field]: !currentValue
    });
  } catch (err) {
    console.error("שגיאת ניהול:", err);
  }
}

async function deletePostById(postId) {
  if (!isAdmin) return;
  const confirmed = window.confirm("למחוק את הפוסט הזה לצמיתות?");
  if (!confirmed) return;

  try {
    await deleteDoc(doc(db, "posts", postId));
  } catch (err) {
    console.error("שגיאה במחיקת פוסט:", err);
  }
}

const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));

onSnapshot(postsQuery, (snapshot) => {
  loadedPosts = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
  renderPosts();
}, (error) => {
  postsList.innerHTML = "";
  const errCard = document.createElement("div");
  errCard.className = "card";
  errCard.textContent = "לא ניתן לטעון פוסטים כרגע: " + error.message;
  postsList.appendChild(errCard);
});

categoryFilter.addEventListener("change", renderPosts);

function renderPosts() {
  const selectedCategory = categoryFilter.value;
  postsList.innerHTML = "";

  const filteredPosts = selectedCategory === "ALL"
    ? [...loadedPosts]
    : loadedPosts.filter((post) => post.category === selectedCategory);

  filteredPosts.sort((a, b) => Number(Boolean(b.isPinned)) - Number(Boolean(a.isPinned)));

  if (filteredPosts.length === 0) {
    const emptyCard = document.createElement("div");
    emptyCard.className = "card";
    emptyCard.textContent = "עדיין אין דיונים להצגה.";
    postsList.appendChild(emptyCard);
    return;
  }

  filteredPosts.forEach((post) => {
    const card = document.createElement("article");
    card.className = "card";

    const badgesWrap = document.createElement("div");
    badgesWrap.style.display = "flex";
    badgesWrap.style.gap = "0.4rem";
    badgesWrap.style.flexWrap = "wrap";

    if (post.isPinned) {
      const pinnedBadge = document.createElement("span");
      pinnedBadge.className = "tag badge-pinned";
      pinnedBadge.textContent = "נעוץ";
      badgesWrap.appendChild(pinnedBadge);
    }

    if (post.isLocked) {
      const lockedBadge = document.createElement("span");
      lockedBadge.className = "tag badge-locked";
      lockedBadge.textContent = "נעול";
      badgesWrap.appendChild(lockedBadge);
    }

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = post.category || "כללי";
    badgesWrap.appendChild(tag);

    const titleEl = document.createElement("h3");
    titleEl.className = "post-title";

    const titleLink = document.createElement("a");
    titleLink.href = `post.html?id=${encodeURIComponent(post.id)}`;
    titleLink.textContent = post.title || "";
    titleLink.style.color = "inherit";
    titleLink.style.textDecoration = "none";
    titleLink.addEventListener("mouseenter", () => {
      titleLink.style.textDecoration = "underline";
    });
    titleLink.addEventListener("mouseleave", () => {
      titleLink.style.textDecoration = "none";
    });

    titleEl.appendChild(titleLink);

    const bodyEl = document.createElement("p");
    bodyEl.className = "post-excerpt";
    bodyEl.textContent = post.body || "";

    const metaEl = document.createElement("div");
    metaEl.className = "post-meta";
    const dateText = post.createdAt?.toDate
      ? post.createdAt.toDate().toLocaleDateString("he-IL")
      : "עכשיו";
    metaEl.textContent = `מאת: ${post.author || "אנונימי"} • ${dateText}`;

    card.append(badgesWrap, titleEl, bodyEl, metaEl);

    if (isAdmin) {
      const modBox = document.createElement("div");
      modBox.className = "mod-actions";

      const pinBtn = document.createElement("button");
      pinBtn.type = "button";
      pinBtn.className = "btn btn-secondary";
      pinBtn.textContent = post.isPinned ? "בטל הצמדה" : "הצמד פוסט";
      pinBtn.addEventListener("click", () => togglePostFlag(post.id, "isPinned", Boolean(post.isPinned)));

      const lockBtn = document.createElement("button");
      lockBtn.type = "button";
      lockBtn.className = "btn btn-secondary";
      lockBtn.textContent = post.isLocked ? "פתח דיון" : "נעל דיון";
      lockBtn.addEventListener("click", () => togglePostFlag(post.id, "isLocked", Boolean(post.isLocked)));

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "btn btn-secondary";
      deleteBtn.textContent = "מחק פוסט";
      deleteBtn.addEventListener("click", () => deletePostById(post.id));

      modBox.append(pinBtn, lockBtn, deleteBtn);
      card.appendChild(modBox);
    }

    postsList.appendChild(card);
  });
}