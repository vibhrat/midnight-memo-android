
import { useState, useEffect } from 'react';
import { CasualNote } from '@/types';
import { 
  subscribeToNotes, 
  addNote, 
  updateNote, 
  deleteNote 
} from '@/integrations/firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export const useFirebaseNotes = () => {
  const [notes, setNotes] = useState<CasualNote[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up Firebase notes subscription');
    
    const unsubscribe = subscribeToNotes((newNotes) => {
      console.log('Firebase notes received:', newNotes);
      setNotes(newNotes);
      setLoading(false);
    });

    // Set a timeout to stop loading if no response after 10 seconds
    const timeout = setTimeout(() => {
      console.log('Firebase notes subscription timeout, stopping loading');
      setLoading(false);
    }, 10000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const createNote = async (note: Omit<CasualNote, 'id'>) => {
    const noteWithId = {
      ...note,
      id: Date.now().toString(), // Temporary ID for optimistic updates
    };
    
    try {
      console.log('Creating Firebase note:', note);
      
      // Optimistic update
      setNotes(prev => [noteWithId, ...prev]);
      
      await addNote(note);
      toast({
        title: "Success",
        description: "Note created successfully!",
      });
    } catch (error) {
      console.error('Error creating note:', error);
      // Revert optimistic update on error
      setNotes(prev => prev.filter(n => n.id !== noteWithId.id));
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
    }
  };

  const editNote = async (id: string, note: Partial<CasualNote>) => {
    try {
      await updateNote(id, note);
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
      await deleteNote(id);
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
