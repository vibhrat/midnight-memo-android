
import { useState, forwardRef, useImperativeHandle } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ShoppingList, ShoppingListItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { Search } from 'lucide-react';

interface ShoppingListsRef {
  triggerCreate: () => void;
}

interface ShoppingListsProps {
  onListSelect?: (listId: string) => void;
  onSearchClick?: () => void;
}

const ShoppingLists = forwardRef<ShoppingListsRef, ShoppingListsProps>(({ onListSelect, onSearchClick }, ref) => {
  const [lists, setLists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);

  useImperativeHandle(ref, () => ({
    triggerCreate: () => {
      // Create a new blank list and navigate to it
      const now = new Date();
      const newList: ShoppingList = {
        id: Date.now().toString(),
        title: '',
        items: [],
        createdAt: now,
        updatedAt: now,
      };
      setLists([newList, ...lists]);
      if (onListSelect) {
        onListSelect(newList.id);
      }
    }
  }));

  const getDaysAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCardClick = (listId: string) => {
    if (onListSelect) {
      onListSelect(listId);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-[#DBDBDB]" style={{ fontFamily: 'IBM Plex Mono' }}>Lists</h1>
          <button onClick={onSearchClick} className="p-2 hover:bg-[#181818] rounded-lg">
            <Search size={20} className="text-[#9B9B9B]" />
          </button>
        </div>

        <div className="space-y-4">
          {lists.map((list) => (
            <Card 
              key={list.id} 
              className="cursor-pointer hover:bg-[#2A2A2A] transition-colors bg-[#181818] border-0 rounded-lg"
              onClick={() => handleCardClick(list.id)}
            >
              <CardContent className="p-4 py-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[#F2CB2F]"></div>
                      <h3 className="text-base font-bold text-[#DBDBDB]">{list.title || 'Untitled List'}</h3>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-sm font-medium text-[#9B9B9B]">
                        <Clock className="w-3 h-3" />
                        <span>{getDaysAgo(list.createdAt)}d</span>
                      </div>
                      <span className="text-sm font-medium text-[#9B9B9B]">{list.items.length} items</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {lists.length === 0 && (
            <div className="text-center py-12 text-[#9B9B9B]">
              No shopping lists yet. Create your first list!
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ShoppingLists.displayName = 'ShoppingLists';

export default ShoppingLists;
