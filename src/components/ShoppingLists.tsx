
import { useState, forwardRef, useImperativeHandle } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useFirebaseLists } from '@/hooks/useFirebaseLists';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { ShoppingList } from '@/types';
import { Download, Search } from 'lucide-react';
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
  const { user } = useFirebaseAuth();
  const [localLists, setLocalLists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);
  const { lists: firebaseLists, loading: firebaseLoading, createList } = useFirebaseLists();
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Use Firebase lists if user is authenticated, otherwise use localStorage
  const lists = user ? firebaseLists : localLists;

  useImperativeHandle(ref, () => ({
    triggerCreate: () => {
      // Only create if not in loading state
      if (user && firebaseLoading) {
        console.log('Still loading Firebase data, skipping create');
        return;
      }

      // Create a new blank list and navigate to it
      const now = new Date();
      const newList: ShoppingList = {
        id: Date.now().toString(),
        title: '',
        items: [],
        createdAt: now,
        updatedAt: now,
      };
      
      if (user) {
        // Use Firebase
        createList(newList);
      } else {
        // Use localStorage
        setLocalLists([newList, ...localLists]);
      }
      
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
              className="p-2 text-[#DBDBDB] hover:text-white transition-colors"
            >
              <Download size={20} />
            </button>
            <button
              onClick={onSearchClick}
              className="p-2 text-[#DBDBDB] hover:text-white transition-colors"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Loading State for Firebase */}
        {user && firebaseLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-[#9B9B9B]">Loading your lists...</p>
            </div>
          </div>
        ) : (
          /* Lists */
          lists.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {lists.map((list) => (
                <div
                  key={list.id}
                  onClick={() => handleCardClick(list.id)}
                  className="bg-[#1A1A1A] rounded-lg p-4 cursor-pointer hover:bg-[#252525] transition-colors border border-[#2A2A2A]"
                >
                  <h3 className="text-[#DBDBDB] font-medium mb-2">{list.title || 'Untitled List'}</h3>
                  <div className="flex items-center justify-between text-sm text-[#9B9B9B]">
                    <span>{list.items?.length || 0} items</span>
                    <span>{format(new Date(list.updatedAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              ))}
            </div>
          )
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
