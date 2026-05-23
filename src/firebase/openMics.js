import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";

const openMicsRef = collection(db, "openMics");

export async function fetchApprovedOpenMics() {
  const q = query(
    openMicsRef,
    where("approved", "==", true)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function fetchPendingOpenMics() {
  const q = query(
    openMicsRef,
    where("approved", "==", false)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function submitOpenMic(openMic, submittedBy = "anonymous") {
  return addDoc(openMicsRef, {
    ...openMic,
    approved: false,
    submittedBy,
    createdAt: serverTimestamp(),
  });
}

export async function approveOpenMic(id) {
  const openMicDoc = doc(db, "openMics", id);
  return updateDoc(openMicDoc, { approved: true });
}

export async function deleteOpenMic(id) {
  const openMicDoc = doc(db, "openMics", id);
  return deleteDoc(openMicDoc);
}
