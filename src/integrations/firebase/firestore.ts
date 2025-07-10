
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "./config";
import { CasualNote, ShoppingList, Password } from "@/types";

// Notes operations
export const notesCollection = (userId: string) => collection(db, `users/${userId}/notes`);

export const addNote = async (userId: string, note: Omit<CasualNote, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(notesCollection(userId), {
      ...note,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

export const updateNote = async (userId: string, noteId: string, updates: Partial<CasualNote>) => {
  try {
    const noteRef = doc(notesCollection(userId), noteId);
    await updateDoc(noteRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteNote = async (userId: string, noteId: string) => {
  try {
    const noteRef = doc(notesCollection(userId), noteId);
    await deleteDoc(noteRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getNotes = async (userId: string) => {
  try {
    const q = query(notesCollection(userId), orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const notes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as CasualNote[];
    return { notes, error: null };
  } catch (error: any) {
    return { notes: [], error: error.message };
  }
};

export const subscribeToNotes = (userId: string, callback: (notes: CasualNote[]) => void) => {
  const q = query(notesCollection(userId), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const notes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as CasualNote[];
    callback(notes);
  });
};

// Shopping Lists operations
export const listsCollection = (userId: string) => collection(db, `users/${userId}/lists`);

export const addList = async (userId: string, list: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(listsCollection(userId), {
      ...list,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

export const updateList = async (userId: string, listId: string, updates: Partial<ShoppingList>) => {
  try {
    const listRef = doc(listsCollection(userId), listId);
    await updateDoc(listRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteList = async (userId: string, listId: string) => {
  try {
    const listRef = doc(listsCollection(userId), listId);
    await deleteDoc(listRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getLists = async (userId: string) => {
  try {
    const q = query(listsCollection(userId), orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const lists = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as ShoppingList[];
    return { lists, error: null };
  } catch (error: any) {
    return { lists: [], error: error.message };
  }
};

export const subscribeToLists = (userId: string, callback: (lists: ShoppingList[]) => void) => {
  const q = query(listsCollection(userId), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const lists = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as ShoppingList[];
    callback(lists);
  });
};

// Passwords operations
export const passwordsCollection = (userId: string) => collection(db, `users/${userId}/passwords`);

export const addPassword = async (userId: string, password: Omit<Password, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(passwordsCollection(userId), {
      ...password,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

export const updatePassword = async (userId: string, passwordId: string, updates: Partial<Password>) => {
  try {
    const passwordRef = doc(passwordsCollection(userId), passwordId);
    await updateDoc(passwordRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deletePassword = async (userId: string, passwordId: string) => {
  try {
    const passwordRef = doc(passwordsCollection(userId), passwordId);
    await deleteDoc(passwordRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getPasswords = async (userId: string) => {
  try {
    const q = query(passwordsCollection(userId), orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const passwords = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Password[];
    return { passwords, error: null };
  } catch (error: any) {
    return { passwords: [], error: error.message };
  }
};

export const subscribeToPasswords = (userId: string, callback: (passwords: Password[]) => void) => {
  const q = query(passwordsCollection(userId), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const passwords = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Password[];
    callback(passwords);
  });
};
