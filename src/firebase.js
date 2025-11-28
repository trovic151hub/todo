// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1LhJASyTk69EXJjF76hnwYRqgoJUt9Cg",
  authDomain: "todo-app-fdefc.firebaseapp.com",
  projectId: "todo-app-fdefc",
  storageBucket: "todo-app-fdefc.firebasestorage.app",
  messagingSenderId: "753248342754",
  appId: "1:753248342754:web:b7ed6fa4defea3515f44bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };