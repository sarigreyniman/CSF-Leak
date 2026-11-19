import { auth, db } from "./firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

const postDetailEl = document.getElementById("post-detail");
const commentForm = document.getElementById("comment-form");
const commentAuthorInput = document.getElementById("comment-author");
const commentStatus = document.getElementById("comment-status");
const commentsList = document.getElementById("comments-list");
const bottomTriggerWrap = document.getElementById("bottom-reply-trigger-wrap");

let currentUser = null;
let currentNickname = "חבר קהילה";
let currentPhotoURL = "";
let isAdmin = false;
let currentPost = null;
let loadedComments = [];
let replyingTo = null; // { id, author }
let isCommentBoxOpen = false;
const userProfilesCache = new Map(); // uid -> { nickname, photoURL }

commentForm.style.display = "none";

const replyBanner = document.createElement("div");
replyBanner.className = "reply-banner";
replyBanner.style.display = "none";

const replyBannerText = document.createElement("span");
const cancelReplyBtn = document.createElement("button");
cancelReplyBtn.type = "button";
cancelReplyBtn.className = "btn btn-secondary";
cancelReplyBtn.style.padding = "0.25rem 0.6rem";
cancelReplyBtn.style.fontSize = "0.85rem";
cancelReplyBtn.textContent = "בטל מענה";
cancelReplyBtn.addEventListener("click", () => setReplyTarget(null));

replyBanner.append(replyBannerText, cancelReplyBtn);
commentForm.insertBefore(replyBanner, commentForm.firstChild);

function createInitialsAvatar(name, extraClass = "") {
  const span = document.createElement("span");
  span.className = `avatar-fallback ${extraClass}`.trim();
  const clean = (name || "ק").trim();
  span.textContent = clean.charAt(0).toUpperCase();
  return span;
}

function createAuthorAvatar(name, photoURL, extraClass = "") {
  if (photoURL) {
    const img = document.createElement("img");
    img.src = photoURL;
    img.alt = name || "תמונת פרופיל";
    img.className = `avatar-img ${extraClass}`.trim();
    img.referrerPolicy = "no-referrer";
    img.addEventListener("error", () => {
      img.replaceWith(createInitialsAvatar(name, extraClass));
    });
    return img;
  }
  return createInitialsAvatar(name, extraClass);
}

async function resolveUserProfile(uid, fallbackName = "חבר קהילה", fallbackPhoto = "") {
  if (!uid) {
    return { nickname: fallbackName, photoURL: fallbackPhoto };
  }
  if (userProfilesCache.has(uid)) {
    return userProfilesCache.get(uid);
  }

  let profile = { nickname: fallbackName, photoURL: fallbackPhoto };
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      const data = snap.data();
      profile = {
        nickname: data.nickname || fallbackName,
        photoURL: data.photoURL || fallbackPhoto
      };
    }
  } catch {
    // נשאר עם ערכי ברירת מחדל
  }

  userProfilesCache.set(uid, profile);
  return profile;
}

async function hydrateProfilesForThread() {
  const uids = new Set();
  if (currentPost?.authorId) uids.add(currentPost.authorId);
  loadedComments.forEach((c) => {
    if (c.authorId) uids.add(c.authorId);
  });

  const missing = [...uids].filter((uid) => !userProfilesCache.has(uid));
  if (missing.length === 0) return;

  await Promise.all(
    missing.map((uid) => {
      const sampleComment = loadedComments.find((c) => c.authorId === uid);
      const name = currentPost?.authorId === uid
        ? (currentPost.author || "חבר קהילה")
        : (sampleComment?.author || "חבר קהילה");
      const photo = currentPost?.authorId === uid
        ? (currentPost.authorPhotoURL || "")
        : (sampleComment?.authorPhotoURL || "");
      return resolveUserProfile(uid, name, photo);
    })
  );

  renderPostView();
  renderCommentsList();
}

function redirectToLogin() {
  window.location.href = `auth.html?redirect=${encodeURIComponent(`post.html?id=${postId}`)}`;
}

async function toggleLike(docRef, likesArray) {
  const activeUser = auth.currentUser || currentUser;
  if (!activeUser) {
    redirectToLogin();
    return;
  }

  const uid = activeUser.uid;
  const alreadyLiked = Array.isArray(likesArray) && likesArray.includes(uid);

  try {
    await updateDoc(docRef, {
      likes: alreadyLiked ? arrayRemove(uid) : arrayUnion(uid)
    });
  } catch (err) {
    console.error("שגיאה בעדכון לייק:", err);
  }
}

function createLikeButton(likesArray, onToggle) {
  const activeUser = auth.currentUser || currentUser;
  const likes = Array.isArray(likesArray) ? likesArray : [];
  const isLiked = Boolean(activeUser && likes.includes(activeUser.uid));

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `btn-like ${isLiked ? "liked" : ""}`;
  btn.setAttribute("aria-pressed", isLiked ? "true" : "false");

  const icon = document.createElement("i");
  icon.className = isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart";
  icon.setAttribute("aria-hidden", "true");

  const label = document.createElement("span");
  label.textContent = likes.length > 0 ? `לייק (${likes.length})` : "לייק";

  btn.append(icon, label);
  btn.addEventListener("click", onToggle);
  return btn;
}

function renderBottomReplyButton() {
  if (!bottomTriggerWrap) return;
  bottomTriggerWrap.innerHTML = "";

  if (!currentPost) return;

  if (currentPost.isLocked) {
    const lockedNote = document.createElement("p");
    lockedNote.className = "status-msg";
    lockedNote.textContent = "הדיון נעול על ידי הנהלת הקהילה ולא ניתן להוסיף תגובות חדשות.";
    bottomTriggerWrap.appendChild(lockedNote);
    return;
  }

  const addCommentBtn = document.createElement("button");
  addCommentBtn.type = "button";
  addCommentBtn.className = "btn";
  addCommentBtn.innerHTML = isCommentBoxOpen && !replyingTo
    ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i><span>סגור תיבת תגובה</span>'
    : '<i class="fa-solid fa-plus" aria-hidden="true"></i><span>הוסף תגובה</span>';
  addCommentBtn.addEventListener("click", handleTogglePostCommentBox);

  bottomTriggerWrap.appendChild(addCommentBtn);
}

function syncCommentBoxUI() {
  const isLocked = Boolean(currentPost?.isLocked);

  if (isLocked) {
    isCommentBoxOpen = false;
    replyingTo = null;
    replyBanner.style.display = "none";
    commentForm.style.display = "none";
    renderBottomReplyButton();
    return;
  }

  commentForm.style.display = isCommentBoxOpen ? "flex" : "none";
  renderBottomReplyButton();

  if (isCommentBoxOpen) {
    commentForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
    const bodyTextarea = document.getElementById("comment-body");
    if (bodyTextarea) bodyTextarea.focus();
  }
}

function setReplyTarget(target) {
  replyingTo = target;
  if (replyingTo) {
    isCommentBoxOpen = true;
    replyBannerText.textContent = `מגיב לתגובה של: ${replyingTo.author || "אנונימי"}`;
    replyBanner.style.display = "flex";
  } else {
    replyBannerText.textContent = "";
    replyBanner.style.display = "none";
  }
  syncCommentBoxUI();
}

function handleTogglePostCommentBox() {
  const activeUser = auth.currentUser || currentUser;
  if (!activeUser) {
    redirectToLogin();
    return;
  }
  if (!currentPost || currentPost.isLocked) return;

  if (!isCommentBoxOpen) {
    replyingTo = null;
    replyBanner.style.display = "none";
    isCommentBoxOpen = true;
  } else {
    isCommentBoxOpen = false;
    replyingTo = null;
    replyBanner.style.display = "none";
  }
  syncCommentBoxUI();
}

function renderPostView() {
  if (!postId) {
    postDetailEl.textContent = "לא נבחר דיון להצגה.";
    return;
  }

  if (!currentPost) return;

  const cachedAuthor = currentPost.authorId ? userProfilesCache.get(currentPost.authorId) : null;
  const authorName = cachedAuthor?.nickname || currentPost.author || "אנונימי";
  const authorPhoto = cachedAuthor?.photoURL || currentPost.authorPhotoURL || "";

  postDetailEl.innerHTML = "";

  const badgesWrap = document.createElement("div");
  badgesWrap.style.display = "flex";
  badgesWrap.style.gap = "0.4rem";
  badgesWrap.style.flexWrap = "wrap";

  if (currentPost.isPinned) {
    const pinnedBadge = document.createElement("span");
    pinnedBadge.className = "tag badge-pinned";
    pinnedBadge.textContent = "נעוץ";
    badgesWrap.appendChild(pinnedBadge);
  }

  if (currentPost.isLocked) {
    const lockedBadge = document.createElement("span");
    lockedBadge.className = "tag badge-locked";
    lockedBadge.textContent = "נעול";
    badgesWrap.appendChild(lockedBadge);
  }

  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = currentPost.category || "כללי";
  badgesWrap.appendChild(tag);

  const titleEl = document.createElement("h1");
  titleEl.className = "post-title";
  titleEl.style.fontSize = "1.45rem";
  titleEl.textContent = currentPost.title || "";

  const bodyEl = document.createElement("p");
  bodyEl.className = "post-excerpt";
  bodyEl.textContent = currentPost.body || "";

  const metaEl = document.createElement("div");
  metaEl.className = "post-meta author-row";
  const dateLabel = currentPost.createdAt?.toDate
    ? currentPost.createdAt.toDate().toLocaleDateString("he-IL")
    : "עכשיו";

  const avatarEl = createAuthorAvatar(authorName, authorPhoto, "post-author-avatar");
  const metaText = document.createElement("span");
  metaText.textContent = `מאת: ${authorName} • ${dateLabel}`;
  metaEl.append(avatarEl, metaText);

  postDetailEl.append(badgesWrap, titleEl, bodyEl, metaEl);

  const postActionsBox = document.createElement("div");
  postActionsBox.className = "mod-actions";

  const postLikeBtn = createLikeButton(currentPost.likes, () =>
    toggleLike(doc(db, "posts", postId), currentPost.likes)
  );
  postActionsBox.appendChild(postLikeBtn);

  if (isAdmin) {
    const pinBtn = document.createElement("button");
    pinBtn.type = "button";
    pinBtn.className = "btn btn-secondary";
    pinBtn.textContent = currentPost.isPinned ? "בטל הצמדה" : "הצמד פוסט";
    pinBtn.addEventListener("click", async () => {
      try {
        await updateDoc(doc(db, "posts", postId), { isPinned: !currentPost.isPinned });
      } catch (err) {
        console.error("שגיאה בעדכון הצמדה:", err);
      }
    });

    const lockBtn = document.createElement("button");
    lockBtn.type = "button";
    lockBtn.className = "btn btn-secondary";
    lockBtn.textContent = currentPost.isLocked ? "פתח דיון" : "נעל דיון";
    lockBtn.addEventListener("click", async () => {
      try {
        await updateDoc(doc(db, "posts", postId), { isLocked: !currentPost.isLocked });
      } catch (err) {
        console.error("שגיאה בעדכון נעילה:", err);
      }
    });

    const deletePostBtn = document.createElement("button");
    deletePostBtn.type = "button";
    deletePostBtn.className = "btn btn-secondary";
    deletePostBtn.textContent = "מחק פוסט";
    deletePostBtn.addEventListener("click", async () => {
      const confirmed = window.confirm("למחוק את הדיון הזה לצמיתות?");
      if (!confirmed) return;
      try {
        await deleteDoc(doc(db, "posts", postId));
        window.location.href = "index.html";
      } catch (err) {
        console.error("שגיאה במחיקת דיון:", err);
      }
    });

    postActionsBox.append(pinBtn, lockBtn, deletePostBtn);
  }

  postDetailEl.appendChild(postActionsBox);
  syncCommentBoxUI();
}

function buildCommentElement(comment, childrenMap) {
  const item = document.createElement("div");
  item.className = "comment-item";

  const cachedAuthor = comment.authorId ? userProfilesCache.get(comment.authorId) : null;
  const authorName = cachedAuthor?.nickname || comment.author || "אנונימי";
  const authorPhoto = cachedAuthor?.photoURL || comment.authorPhotoURL || "";

  const headerRow = document.createElement("div");
  headerRow.className = "comment-author-row";

  const avatarEl = createAuthorAvatar(authorName, authorPhoto, "comment-author-avatar");
  const authorEl = document.createElement("strong");
  const dateLabel = comment.createdAt?.toDate
    ? comment.createdAt.toDate().toLocaleDateString("he-IL")
    : "עכשיו";
  authorEl.textContent = `${authorName} • ${dateLabel}`;

  headerRow.append(avatarEl, authorEl);

  const textEl = document.createElement("p");
  textEl.className = "post-excerpt";
  textEl.textContent = comment.body || "";

  const actionsRow = document.createElement("div");
  actionsRow.className = "mod-actions";
  actionsRow.style.marginTop = "0.45rem";

  const commentLikeBtn = createLikeButton(comment.likes, () =>
    toggleLike(doc(db, "posts", postId, "comments", comment.id), comment.likes)
  );
  actionsRow.appendChild(commentLikeBtn);

  if (!currentPost?.isLocked) {
    const replyBtn = document.createElement("button");
    replyBtn.type = "button";
    replyBtn.className = "btn btn-secondary";
    replyBtn.style.padding = "0.3rem 0.7rem";
    replyBtn.style.fontSize = "0.85rem";
    replyBtn.textContent = "הגב";
    replyBtn.addEventListener("click", () => {
      const activeUser = auth.currentUser || currentUser;
      if (!activeUser) {
        redirectToLogin();
        return;
      }
      setReplyTarget({ id: comment.id, author: authorName });
    });
    actionsRow.appendChild(replyBtn);
  }

  if (isAdmin) {
    const delCommentBtn = document.createElement("button");
    delCommentBtn.type = "button";
    delCommentBtn.className = "btn btn-secondary";
    delCommentBtn.style.padding = "0.3rem 0.7rem";
    delCommentBtn.style.fontSize = "0.85rem";
    delCommentBtn.textContent = "מחק תגובה";
    delCommentBtn.addEventListener("click", async () => {
      const confirmed = window.confirm("למחוק את התגובה הזו?");
      if (!confirmed) return;
      try {
        await deleteDoc(doc(db, "posts", postId, "comments", comment.id));
        if (replyingTo?.id === comment.id) {
          setReplyTarget(null);
        }
      } catch (err) {
        console.error("שגיאה במחיקת תגובה:", err);
      }
    });
    actionsRow.appendChild(delCommentBtn);
  }

  item.append(headerRow, textEl, actionsRow);

  const replies = childrenMap.get(comment.id) || [];
  if (replies.length > 0) {
    const repliesWrap = document.createElement("div");
    repliesWrap.className = "comment-replies";
    replies.forEach((child) => {
      repliesWrap.appendChild(buildCommentElement(child, childrenMap));
    });
    item.appendChild(repliesWrap);
  }

  return item;
}

function renderCommentsList() {
  commentsList.innerHTML = "";
  if (loadedComments.length === 0) {
    commentsList.textContent = "עדיין אין תגובות בדיון הזה.";
    return;
  }

  const topLevel = [];
  const childrenMap = new Map();

  loadedComments.forEach((c) => {
    if (c.parentId) {
      if (!childrenMap.has(c.parentId)) {
        childrenMap.set(c.parentId, []);
      }
      childrenMap.get(c.parentId).push(c);
    } else {
      topLevel.push(c);
    }
  });

  topLevel.forEach((rootComment) => {
    commentsList.appendChild(buildCommentElement(rootComment, childrenMap));
  });
}

onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  isAdmin = false;
  currentPhotoURL = user?.photoURL || "";

  if (user) {
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        currentNickname = data.nickname || user.displayName || "חבר קהילה";
        currentPhotoURL = data.photoURL || currentPhotoURL;
        isAdmin = data.role === "admin";
      } else {
        currentNickname = user.displayName || "חבר קהילה";
      }
    } catch {
      currentNickname = user.displayName || "חבר קהילה";
    }

    userProfilesCache.set(user.uid, {
      nickname: currentNickname,
      photoURL: currentPhotoURL
    });

    if (commentAuthorInput) {
      commentAuthorInput.value = currentNickname;
      commentAuthorInput.readOnly = true;
    }
  } else if (commentAuthorInput) {
    commentAuthorInput.value = "";
    commentAuthorInput.readOnly = false;
  }

  renderPostView();
  renderCommentsList();
});

if (postId) {
  onSnapshot(doc(db, "posts", postId), (snap) => {
    if (!snap.exists()) {
      postDetailEl.textContent = "הדיון לא נמצא.";
      return;
    }
    currentPost = { id: snap.id, ...snap.data() };
    renderPostView();
    hydrateProfilesForThread();
  }, (err) => {
    postDetailEl.textContent = "שגיאה בטעינת הדיון: " + err.message;
  });
} else {
  postDetailEl.textContent = "לא נבחר דיון להצגה.";
}

commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!postId) return;

  const activeUser = auth.currentUser || currentUser;
  if (!activeUser) {
    redirectToLogin();
    return;
  }

  if (currentPost?.isLocked) {
    commentStatus.textContent = "הדיון נעול ולא ניתן להגיב.";
    return;
  }

  const body = document.getElementById("comment-body").value.trim();
  if (!body) return;

  commentStatus.textContent = "שומר תגובה...";
  try {
    await addDoc(collection(db, "posts", postId, "comments"), {
      author: currentNickname,
      authorId: activeUser.uid,
      authorPhotoURL: currentPhotoURL,
      parentId: replyingTo ? replyingTo.id : null,
      body,
      likes: [],
      createdAt: serverTimestamp()
    });
    document.getElementById("comment-body").value = "";
    isCommentBoxOpen = false;
    setReplyTarget(null);
    commentStatus.textContent = "התגובה נוספה!";
  } catch (err) {
    commentStatus.textContent = "שגיאה בהוספת תגובה: " + err.message;
  }
});

if (postId) {
  const commentsQuery = query(
    collection(db, "posts", postId, "comments"),
    orderBy("createdAt", "asc")
  );

  onSnapshot(commentsQuery, (snapshot) => {
    loadedComments = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    renderCommentsList();
    hydrateProfilesForThread();
  }, (err) => {
    commentsList.textContent = "שגיאה בטעינת התגובות: " + err.message;
  });
}