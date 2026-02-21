// ========================================
// Firebase Configuration for Astro Dozi Web
// ========================================
// TODO: Replace with your actual Firebase config
// Get these values from Firebase Console > Project Settings > Web App

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "zodi-cf6b7.firebaseapp.com",
    projectId: "zodi-cf6b7",
    storageBucket: "zodi-cf6b7.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
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
