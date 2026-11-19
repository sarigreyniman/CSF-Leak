import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDVzETLuzn2gHhadcgZ_TL6xmcgMEL_R0M",
  authDomain: "csf-leak-il-community.firebaseapp.com",
  projectId: "csf-leak-il-community",
  storageBucket: "csf-leak-il-community.firebasestorage.app",
  messagingSenderId: "679616513327",
  appId: "1:679616513327:web:e7bbc7932a5b63ae088dda",
  measurementId: "G-R9DJE4BBNW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);