
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasualNote, ShoppingList, Password } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [notes, setNotes] = useState<CasualNote[]>([]);
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [passwords, setPasswords] = useState<Password[]>([]);
  
  // Load data from Supabase
  const loadData = async () => {
    if (!user) return;
    
    try {
      // Load notes
      const { data: notesData, error: notesError } = await supabase
        .from('casual_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (notesError) throw notesError;
      setNotes(notesData || []);
      
      // Load shopping lists with items
      const { data: listsData, error: listsError } = await supabase
        .from('shopping_lists')
        .select(`
          *,
          shopping_list_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (listsError) throw listsError;
      
      const formattedLists = listsData?.map(list => ({
        ...list,
        items: list.shopping_list_items || []
      })) || [];
      setLists(formattedLists);
      
      // Load passwords with fields
      const { data: passwordsData, error: passwordsError } = await supabase
        .from('passwords')
        .select(`
          *,
          password_fields (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (passwordsError) throw passwordsError;
      
      const formattedPasswords = passwordsData?.map(password => ({
        ...password,
        fields: password.password_fields || []
      })) || [];
      setPasswords(formattedPasswords);
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    }
  };
  
  useEffect(() => {
    loadData();
  }, [user]);
  
  return {
    notes,
    lists,
    passwords,
    setNotes,
    setLists,
    setPasswords,
    loadData
  };
};
