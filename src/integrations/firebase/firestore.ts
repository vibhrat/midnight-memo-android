
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db, auth } from './config';
import { CasualNote, ShoppingList, Password } from '@/types';

// Helper function to get current user ID
const getCurrentUserId = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user.uid;
};

// Convert Firestore timestamps to Date objects
const convertTimestamps = (data: any) => {
  return {
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

// CASUAL NOTES
export const subscribeToNotes = (callback: (notes: CasualNote[]) => void) => {
  try {
    const userId = getCurrentUserId();
    const notesRef = collection(db, 'casualNotes');
    const q = query(
      notesRef, 
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const notes: CasualNote[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        notes.push({
          id: doc.id,
          ...convertTimestamps(data),
        } as CasualNote);
      });
      callback(notes);
    });
  } catch (error) {
    console.error('Error subscribing to notes:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

export const addNote = async (note: Omit<CasualNote, 'id'>) => {
  try {
    const userId = getCurrentUserId();
    const notesRef = collection(db, 'casualNotes');
    const docRef = await addDoc(notesRef, {
      ...note,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log('Note added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
};

export const updateNote = async (id: string, note: Partial<CasualNote>) => {
  try {
    const noteRef = doc(db, 'casualNotes', id);
    await updateDoc(noteRef, {
      ...note,
      updatedAt: Timestamp.now(),
    });
    console.log('Note updated:', id);
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

export const deleteNote = async (id: string) => {
  try {
    const noteRef = doc(db, 'casualNotes', id);
    await deleteDoc(noteRef);
    console.log('Note deleted:', id);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

// SHOPPING LISTS
export const subscribeToLists = (callback: (lists: ShoppingList[]) => void) => {
  try {
    const userId = getCurrentUserId();
    const listsRef = collection(db, 'shoppingLists');
    const q = query(
      listsRef, 
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const lists: ShoppingList[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        lists.push({
          id: doc.id,
          ...convertTimestamps(data),
        } as ShoppingList);
      });
      callback(lists);
    });
  } catch (error) {
    console.error('Error subscribing to lists:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

export const addList = async (list: Omit<ShoppingList, 'id'>) => {
  try {
    const userId = getCurrentUserId();
    const listsRef = collection(db, 'shoppingLists');
    const docRef = await addDoc(listsRef, {
      ...list,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log('List added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding list:', error);
    throw error;
  }
};

export const updateList = async (id: string, list: Partial<ShoppingList>) => {
  try {
    const listRef = doc(db, 'shoppingLists', id);
    await updateDoc(listRef, {
      ...list,
      updatedAt: Timestamp.now(),
    });
    console.log('List updated:', id);
  } catch (error) {
    console.error('Error updating list:', error);
    throw error;
  }
};

export const deleteList = async (id: string) => {
  try {
    const listRef = doc(db, 'shoppingLists', id);
    await deleteDoc(listRef);
    console.log('List deleted:', id);
  } catch (error) {
    console.error('Error deleting list:', error);
    throw error;
  }
};

// PASSWORDS
export const subscribeToPasswords = (callback: (passwords: Password[]) => void) => {
  try {
    const userId = getCurrentUserId();
    const passwordsRef = collection(db, 'passwords');
    const q = query(
      passwordsRef, 
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const passwords: Password[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        passwords.push({
          id: doc.id,
          ...convertTimestamps(data),
        } as Password);
      });
      callback(passwords);
    });
  } catch (error) {
    console.error('Error subscribing to passwords:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

export const addPassword = async (password: Omit<Password, 'id'>) => {
  try {
    const userId = getCurrentUserId();
    const passwordsRef = collection(db, 'passwords');
    const docRef = await addDoc(passwordsRef, {
      ...password,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log('Password added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding password:', error);
    throw error;
  }
};

export const updatePassword = async (id: string, password: Partial<Password>) => {
  try {
    const passwordRef = doc(db, 'passwords', id);
    await updateDoc(passwordRef, {
      ...password,
      updatedAt: Timestamp.now(),
    });
    console.log('Password updated:', id);
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const deletePassword = async (id: string) => {
  try {
    const passwordRef = doc(db, 'passwords', id);
    await deleteDoc(passwordRef);
    console.log('Password deleted:', id);
  } catch (error) {
    console.error('Error deleting password:', error);
    throw error;
  }
};
