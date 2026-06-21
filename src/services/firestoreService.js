import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

export async function getAll(collectionName) {
  const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getById(collectionName, id) {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}

export async function create(collectionName, data) {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function update(collectionName, id, data) {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
  return true;
}

export async function remove(collectionName, id) {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
  return true;
}

export async function getByField(collectionName, fieldName, value) {
  const q = query(collection(db, collectionName), where(fieldName, '==', value));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getSingleByField(collectionName, fieldName, value) {
  const results = await getByField(collectionName, fieldName, value);
  return results.length > 0 ? results[0] : null;
}
