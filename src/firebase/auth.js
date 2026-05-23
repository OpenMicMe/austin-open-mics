import { auth, googleProvider } from "./config";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export function signOutUser() {
  return signOut(auth);
}

export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}
