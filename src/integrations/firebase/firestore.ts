
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  onSnapshot,
  Timestamp 
} from "firebase/firestore";
import { db } from "./config";
import { CasualNote, ShoppingList, Password } from "@/types";

// Notes operations
export const notesCollection = collection(db, "notes");

export const addNote = async (note: Omit<CasualNote, 'id'>) => {
  try {
    const docRef = await addDoc(notesCollection, {
      ...note,
      createdAt: Timestamp.fromDate(new Date(note.createdAt)),
      updatedAt: Timestamp.fromDate(new Date(note.updatedAt))
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

export const updateNote = async (id: string, note: Partial<CasualNote>) => {
  try {
    const noteRef = doc(db, "notes", id);
    const updateData = {
      ...note,
      updatedAt: Timestamp.fromDate(new Date())
    };
    await updateDoc(noteRef, updateData);
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};

export const deleteNote = async (id: string) => {
  try {
    const noteRef = doc(db, "notes", id);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};

export const getNotes = async () => {
  try {
    const q = query(notesCollection, orderBy("updatedAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as CasualNote[];
  } catch (error) {
    console.error("Error getting notes:", error);
    throw error;
  }
};

export const subscribeToNotes = (callback: (notes: CasualNote[]) => void) => {
  const q = query(notesCollection, orderBy("updatedAt", "desc"));
  
  return onSnapshot(q, (querySnapshot) => {
    const notes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as CasualNote[];
    
    callback(notes);
  });
};

// Shopping Lists operations
export const listsCollection = collection(db, "shopping-lists");

export const addList = async (list: Omit<ShoppingList, 'id'>) => {
  try {
    const docRef = await addDoc(listsCollection, {
      ...list,
      createdAt: Timestamp.fromDate(new Date(list.createdAt)),
      updatedAt: Timestamp.fromDate(new Date(list.updatedAt))
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding list:", error);
    throw error;
  }
};

export const updateList = async (id: string, list: Partial<ShoppingList>) => {
  try {
    const listRef = doc(db, "shopping-lists", id);
    const updateData = {
      ...list,
      updatedAt: Timestamp.fromDate(new Date())
    };
    await updateDoc(listRef, updateData);
  } catch (error) {
    console.error("Error updating list:", error);
    throw error;
  }
};

export const deleteList = async (id: string) => {
  try {
    const listRef = doc(db, "shopping-lists", id);
    await deleteDoc(listRef);
  } catch (error) {
    console.error("Error deleting list:", error);
    throw error;
  }
};

export const getLists = async () => {
  try {
    const q = query(listsCollection, orderBy("updatedAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as ShoppingList[];
  } catch (error) {
    console.error("Error getting lists:", error);
    throw error;
  }
};

export const subscribeToLists = (callback: (lists: ShoppingList[]) => void) => {
  const q = query(listsCollection, orderBy("updatedAt", "desc"));
  
  return onSnapshot(q, (querySnapshot) => {
    const lists = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as ShoppingList[];
    
    callback(lists);
  });
};

// Passwords operations
export const passwordsCollection = collection(db, "passwords");

export const addPassword = async (password: Omit<Password, 'id'>) => {
  try {
    const docRef = await addDoc(passwordsCollection, {
      ...password,
      createdAt: Timestamp.fromDate(new Date(password.createdAt)),
      updatedAt: Timestamp.fromDate(new Date(password.updatedAt))
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding password:", error);
    throw error;
  }
};

export const updatePassword = async (id: string, password: Partial<Password>) => {
  try {
    const passwordRef = doc(db, "passwords", id);
    const updateData = {
      ...password,
      updatedAt: Timestamp.fromDate(new Date())
    };
    await updateDoc(passwordRef, updateData);
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

export const deletePassword = async (id: string) => {
  try {
    const passwordRef = doc(db, "passwords", id);
    await deleteDoc(passwordRef);
  } catch (error) {
    console.error("Error deleting password:", error);
    throw error;
  }
};

export const getPasswords = async () => {
  try {
    const q = query(passwordsCollection, orderBy("updatedAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as Password[];
  } catch (error) {
    console.error("Error getting passwords:", error);
    throw error;
  }
};

export const subscribeToPasswords = (callback: (passwords: Password[]) => void) => {
  const q = query(passwordsCollection, orderBy("updatedAt", "desc"));
  
  return onSnapshot(q, (querySnapshot) => {
    const passwords = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as Password[];
    
    callback(passwords);
  });
};
