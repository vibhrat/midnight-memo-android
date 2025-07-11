
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
    const unsubscribe = subscribeToNotes((newNotes) => {
      setNotes(newNotes);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const createNote = async (note: Omit<CasualNote, 'id'>) => {
    try {
      await addNote(note);
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
