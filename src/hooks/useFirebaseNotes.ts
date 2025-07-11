
import { useState, useEffect } from 'react';
import { CasualNote } from '@/types';
import { 
  subscribeToNotes, 
  addNote, 
  updateNote, 
  deleteNote 
} from '@/integrations/firebase/firestore';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { useToast } from '@/hooks/use-toast';

export const useFirebaseNotes = () => {
  const [notes, setNotes] = useState<CasualNote[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useFirebaseAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      console.log('No user authenticated, loading from localStorage');
      // Load from localStorage when not authenticated
      const localNotes = JSON.parse(localStorage.getItem('casual-notes') || '[]');
      setNotes(localNotes);
      setLoading(false);
      return;
    }

    console.log('User authenticated, subscribing to Firebase notes for:', user.email);
    const unsubscribe = subscribeToNotes((newNotes) => {
      console.log('Firebase notes updated:', newNotes.length);
      setNotes(newNotes);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const createNote = async (note: Omit<CasualNote, 'id'>) => {
    try {
      if (user) {
        console.log('Creating note in Firebase for user:', user.email);
        await addNote(note);
      } else {
        console.log('Creating note in localStorage');
        const localNotes = JSON.parse(localStorage.getItem('casual-notes') || '[]');
        const newNote = {
          ...note,
          id: Date.now().toString(),
        };
        localNotes.unshift(newNote);
        localStorage.setItem('casual-notes', JSON.stringify(localNotes));
        setNotes(localNotes);
      }
      
      toast({
        title: "Success",
        description: "Note created successfully!",
      });
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
    }
  };

  const editNote = async (id: string, note: Partial<CasualNote>) => {
    try {
      if (user) {
        await updateNote(id, note);
      } else {
        const localNotes = JSON.parse(localStorage.getItem('casual-notes') || '[]');
        const updatedNotes = localNotes.map((n: CasualNote) => 
          n.id === id ? { ...n, ...note, updatedAt: new Date() } : n
        );
        localStorage.setItem('casual-notes', JSON.stringify(updatedNotes));
        setNotes(updatedNotes);
      }
      
      toast({
        title: "Success",
        description: "Note updated successfully!",
      });
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    }
  };

  const removeNote = async (id: string) => {
    try {
      if (user) {
        await deleteNote(id);
      } else {
        const localNotes = JSON.parse(localStorage.getItem('casual-notes') || '[]');
        const filteredNotes = localNotes.filter((n: CasualNote) => n.id !== id);
        localStorage.setItem('casual-notes', JSON.stringify(filteredNotes));
        setNotes(filteredNotes);
      }
      
      toast({
        title: "Success",
        description: "Note deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  return {
    notes,
    loading,
    createNote,
    editNote,
    removeNote
  };
};
