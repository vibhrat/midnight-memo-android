
import { useState, useEffect } from 'react';
import { Password } from '@/types';
import { 
  subscribeToPasswords, 
  addPassword, 
  updatePassword, 
  deletePassword 
} from '@/integrations/firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export const useFirebasePasswords = () => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToPasswords((newPasswords) => {
      setPasswords(newPasswords);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const createPassword = async (password: Omit<Password, 'id'>) => {
    try {
      await addPassword(password);
      toast({
        title: "Success",
        description: "Password created successfully!",
      });
    } catch (error) {
      console.error('Error creating password:', error);
      toast({
        title: "Error",
        description: "Failed to create password",
        variant: "destructive",
      });
    }
  };

  const editPassword = async (id: string, password: Partial<Password>) => {
    try {
      await updatePassword(id, password);
      toast({
        title: "Success",
        description: "Password updated successfully!",
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    }
  };

  const removePassword = async (id: string) => {
    try {
      await deletePassword(id);
      toast({
        title: "Success",
        description: "Password deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting password:', error);
      toast({
        title: "Error",
        description: "Failed to delete password",
        variant: "destructive",
      });
    }
  };

  return {
    passwords,
    loading,
    createPassword,
    editPassword,
    removePassword
  };
};
