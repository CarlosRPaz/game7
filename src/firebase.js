// Import the functions you need from the SDKs you need
// if using Nextjs or Server-Side Rendering, import { initializeApp, getApps, getApp } from "firebase/app";

//import firebase from 'firebase';
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  setDoc,
  getDoc,
  getDocs,
  where,
  onSnapshot,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import {getStorage} from "firebase/storage";

/*
import {getAnalytics} from "firebase/analytics";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
*/

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8VjkRkW_7ZGCt2N1XudN88VwjAFBkp1A",
  authDomain: "game7-blog.firebaseapp.com",
  projectId: "game7-blog",
  storageBucket: "game7-blog.appspot.com",
  messagingSenderId: "248798987246",
  appId: "1:248798987246:web:095cc133590d933183c4ff",
  measurementId: "G-KEWYDVY7CL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const analytics = getAnalytics(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export {
  app,
  db,
  auth,
  analytics,
  storage,
  doc,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  setDoc,
  getDoc,
  getDocs,
  where,
  onSnapshot,
  increment,
  serverTimestamp,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
};