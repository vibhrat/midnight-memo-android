
import { useState, forwardRef, useImperativeHandle } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ShoppingList } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Search, Download } from 'lucide-react';
import ImportDialog from './ImportDialog';
import EmptyStateIllustration from './EmptyStateIllustration';
import BackgroundGrid from './BackgroundGrid';

interface ShoppingListsRef {
  triggerCreate: () => void;
}

interface ShoppingListsProps {
  onListSelect?: (listId: string) => void;
  onSearchClick?: () => void;
}

const ShoppingLists = forwardRef<ShoppingListsRef, ShoppingListsProps>(({
  onListSelect,
  onSearchClick
}, ref) => {
  const [lists, setLists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);
  const [showImportDialog, setShowImportDialog] = useState(false);

  useImperativeHandle(ref, () => ({
    triggerCreate: () => {
      // Create a new blank list and navigate to it
      const now = new Date();
      const newList: ShoppingList = {
        id: Date.now().toString(),
        title: '',
        items: [],
        createdAt: now,
        updatedAt: now
      };
      setLists([newList, ...lists]);
      
      // Trigger automatic backup
      window.dispatchEvent(new CustomEvent('app-data-changed'));
      
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
    <div className="min-h-screen bg-[#000000] relative">
      <BackgroundGrid />
      <div className="max-w-2xl mx-auto p-4 pb-20 relative z-10 py-[64px]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-[#DBDBDB]" style={{ fontFamily: 'IBM Plex Mono' }}>
            Lists
          </h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowImportDialog(true)} 
              className="p-2 hover:bg-[#181818] rounded-lg"
            >
              <Download size={20} className="text-[#9B9B9B]" />
            </button>
            <button 
              onClick={onSearchClick} 
              className="p-2 hover:bg-[#181818] rounded-lg"
            >
              <Search size={20} className="text-[#9B9B9B]" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {lists.map(list => (
            <Card 
              key={list.id} 
              className="cursor-pointer hover:bg-[#2A2A2A] transition-colors border-0 rounded-lg" 
              style={{ backgroundColor: '#181818' }}
              onClick={() => handleCardClick(list.id)}
            >
              <CardContent className="p-4 py-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[#F2CB2F]"></div>
                      <h3 className="text-base font-bold text-[#DBDBDB]">
                        {list.title || 'Untitled List'}
                      </h3>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-sm font-medium text-[#9B9B9B]">
                        <Clock className="w-3 h-3" />
                        <span>{getDaysAgo(list.createdAt)}d</span>
                      </div>
                      <span className="text-sm font-medium text-[#9B9B9B]">
                        {list.items.length} items
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {lists.length === 0 && <EmptyStateIllustration />}
        </div>

        <ImportDialog 
          isOpen={showImportDialog} 
          onClose={() => setShowImportDialog(false)} 
          type="list" 
        />
      </div>
    </div>
  );
});

ShoppingLists.displayName = 'ShoppingLists';

export default ShoppingLists;
