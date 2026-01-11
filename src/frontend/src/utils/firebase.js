// Firebase configuration for GunGong
// Replace with your Firebase project credentials
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBmtYwembGaFfwovG8bZQ-EEikc1EK_VfM",
    authDomain: "gungong-6502f.firebaseapp.com",
    projectId: "gungong-6502f",
    storageBucket: "gungong-6502f.firebasestorage.app",
    messagingSenderId: "904053267778",
    appId: "1:904053267778:web:1450339de4202808d67cdb",
    measurementId: "G-8R3F5JPBPB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Optional: Add custom parameters for better UX
googleProvider.setCustomParameters({
    prompt: 'select_account' // Always show account selection
});

export default app;
