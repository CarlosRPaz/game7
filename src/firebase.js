import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC8VjkRkW_7ZGCt2N1XudN88VwjAFBkp1A",
    authDomain: "game7-blog.firebaseapp.com",
    projectId: "game7-blog",
    storageBucket: "game7-blog.appspot.com",
    messagingSenderId: "248798987246",
    appId: "1:248798987246:web:095cc133590d933183c4ff",
    measurementId: "G-KEWYDVY7CL"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };