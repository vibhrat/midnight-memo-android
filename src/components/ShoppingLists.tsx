import { useState, forwardRef, useImperativeHandle } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ShoppingList } from '@/types';
import { Upload, Search } from 'lucide-react';
import { format } from 'date-fns';
import ShareDialog from '@/components/ShareDialog';
import EmptyState from '@/components/EmptyState';

interface ShoppingListsRef {
  triggerCreate: () => void;
}

interface ShoppingListsProps {
  onListSelect?: (listId: string) => void;
  onSearchClick?: () => void;
}

const ShoppingLists = forwardRef<ShoppingListsRef, ShoppingListsProps>(({ onListSelect, onSearchClick }, ref) => {
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
        updatedAt: now,
      };
      setLists([newList, ...lists]);
      if (onListSelect) {
        onListSelect(newList.id);
      }
    }
  }));

  const handleCardClick = (listId: string) => {
    if (onListSelect) {
      onListSelect(listId);
    }
  };

  const handleImportClick = () => {
    setShowImportDialog(true);
  };

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#DBDBDB]">Lists</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleImportClick}
              className="p-2 bg-[#2A2A2A] rounded-lg text-[#DBDBDB] hover:bg-[#3A3A3A] transition-colors"
            >
              <Upload size={20} />
            </button>
            <button
              onClick={onSearchClick}
              className="p-2 bg-[#2A2A2A] rounded-lg text-[#DBDBDB] hover:bg-[#3A3A3A] transition-colors"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Lists */}
        {lists.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {lists.map((list) => (
              <div
                key={list.id}
                onClick={() => handleCardClick(list.id)}
                className="bg-[#1A1A1A] rounded-lg p-4 cursor-pointer hover:bg-[#252525] transition-colors border border-[#2A2A2A]"
              >
                <h3 className="text-[#DBDBDB] font-medium mb-2">{list.title}</h3>
                <div className="flex items-center justify-between text-sm text-[#9B9B9B]">
                  <span>{list.items?.length || 0} items</span>
                  <span>{format(new Date(list.updatedAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ShareDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        data={{}}
        type="list"
        mode="import"
      />
    </div>
  );
});

ShoppingLists.displayName = 'ShoppingLists';

export default ShoppingLists;
