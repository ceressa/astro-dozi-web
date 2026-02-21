// ========================================
// Firebase Configuration for Astro Dozi Web
// ========================================

const firebaseConfig = {
    apiKey: "AIzaSyAMYg0qjmGz6erpbFd7b4SasBvLRE_wwvc",
    authDomain: "zodi-cf6b7.firebaseapp.com",
    projectId: "zodi-cf6b7",
    storageBucket: "zodi-cf6b7.firebasestorage.app",
    messagingSenderId: "810852009885",
    appId: "1:810852009885:web:52ddc99732b877e284d174",
    measurementId: "G-0KJ96QY4H4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});
