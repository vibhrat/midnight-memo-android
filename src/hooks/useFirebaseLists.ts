
import { useState, useEffect } from 'react';
import { ShoppingList } from '@/types';
import { 
  subscribeToLists, 
  addList, 
  updateList, 
  deleteList 
} from '@/integrations/firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export const useFirebaseLists = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToLists((newLists) => {
      setLists(newLists);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const createList = async (list: Omit<ShoppingList, 'id'>) => {
    try {
      await addList(list);
      toast({
        title: "Success",
        description: "List created successfully!",
      });
    } catch (error) {
      console.error('Error creating list:', error);
      toast({
        title: "Error",
        description: "Failed to create list",
        variant: "destructive",
      });
    }
  };

  const editList = async (id: string, list: Partial<ShoppingList>) => {
    try {
      await updateList(id, list);
      toast({
        title: "Success",
        description: "List updated successfully!",
      });
    } catch (error) {
      console.error('Error updating list:', error);
      toast({
        title: "Error",
        description: "Failed to update list",
        variant: "destructive",
      });
    }
  };

  const removeList = async (id: string) => {
    try {
      await deleteList(id);
      toast({
        title: "Success",
        description: "List deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting list:', error);
      toast({
        title: "Error",
        description: "Failed to delete list",
        variant: "destructive",
      });
    }
  };

  return {
    lists,
    loading,
    createList,
    editList,
    removeList
  };
};
