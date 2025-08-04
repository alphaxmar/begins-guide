// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// Replace these values with your actual Firebase project configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB56-1rSJrtEtdK6luzQ66-h1z95qHew6s",
    authDomain: "begins-guide.firebaseapp.com",
    projectId: "begins-guide",
    storageBucket: "begins-guide.firebasestorage.app",
    messagingSenderId: "874232611726",
    appId: "1:874232611726:web:1683005b244abfb0be5adf",
    measurementId: "G-W8MS0PMLZG"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const firestore = getFirestore(app);

// Export the app instance if needed elsewhere
export default app;