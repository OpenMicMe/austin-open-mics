import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBI400EA83oWpU-rNYnr7CSPzeJtGDn3x8",
  authDomain: "austin-open-mics.firebaseapp.com",
  projectId: "austin-open-mics",
  storageBucket: "austin-open-mics.firebasestorage.app",
  messagingSenderId: "44933464688",
  appId: "1:44933464688:web:2c1baeb302dbfc03652b75",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
