
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ShoppingList, ShoppingListItem } from '@/types';
import { ArrowLeft, Trash2, Plus, X, Share } from 'lucide-react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import ShareDialog from '@/components/ShareDialog';

interface ListDetailProps {
  listId: string;
  onBack: () => void;
}

const ListDetail = ({ listId, onBack }: ListDetailProps) => {
  const [lists, setLists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);
  const [editableList, setEditableList] = useState<ShoppingList | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [swipedItems, setSwipedItems] = useState<Set<string>>(new Set());
  const [editingItems, setEditingItems] = useState<Set<string>>(new Set());

  const list = lists.find(l => l.id === listId);

  useEffect(() => {
    if (list) {
      setEditableList(list);
    }
  }, [list]);

  if (!list || !editableList) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#9B9B9B]">List not found</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-[#DBDBDB] text-[#000000] rounded">Go Back</button>
        </div>
      </div>
    );
  }

  const autoSave = (updatedList: Partial<ShoppingList>) => {
    const now = new Date();
    const newList = { ...editableList, ...updatedList, updatedAt: now };
    setEditableList(newList);
    setLists(lists.map(l => 
      l.id === listId ? newList : l
    ));
  };

  const handleDelete = () => {
    setLists(lists.filter(l => l.id !== listId));
    setShowDeleteDialog(false);
    onBack();
  };

  const addNewItem = () => {
    const newItem: ShoppingListItem = {
      id: Date.now().toString(),
      name: '',
      quantity: '1',
      checked: false
    };
    autoSave({ items: [...editableList.items, newItem] });
  };

  const updateItem = (itemId: string, updates: Partial<ShoppingListItem>) => {
    const updatedItems = editableList.items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    autoSave({ items: updatedItems });
  };

  const deleteItem = (itemId: string) => {
    const updatedItems = editableList.items.filter(item => item.id !== itemId);
    autoSave({ items: updatedItems });
  };

  const handleSwipe = (itemId: string) => {
    const newSwipedItems = new Set(swipedItems);
    if (swipedItems.has(itemId)) {
      newSwipedItems.delete(itemId);
    } else {
      newSwipedItems.add(itemId);
    }
    setSwipedItems(newSwipedItems);
  };

  const handleInputFocus = (itemId: string) => {
    setEditingItems(prev => new Set(prev).add(itemId));
  };

  const handleInputBlur = (itemId: string) => {
    setEditingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 border border-[#9B9B9B] rounded-lg hover:bg-[#181818]"
          >
            <ArrowLeft size={22} className="text-[#9B9B9B]" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setShowShareDialog(true)}
              className="p-2 hover:bg-[#181818] rounded-lg"
            >
              <Share size={22} className="text-[#9B9B9B]" />
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="p-2 hover:bg-[#181818] rounded-lg"
            >
              <Trash2 size={22} className="text-[#9B9B9B]" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <textarea
            value={editableList.title}
            onChange={(e) => autoSave({ title: e.target.value })}
            className="text-2xl font-bold bg-transparent border-none outline-none resize-none w-full text-[#DBDBDB]"
            placeholder="Untitled List"
            rows={1}
            style={{ 
              fontSize: '24px',
              minHeight: '32px',
              fontWeight: 'bold'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
        </div>

        {/* Items */}
        <div className="space-y-3 mb-6">
          {editableList.items.map((item) => {
            const isEditing = editingItems.has(item.id);
            const isStriked = swipedItems.has(item.id) && !isEditing;
            
            return (
              <div 
                key={item.id} 
                className="bg-[#181818] rounded-2xl p-4 border-none"
                onTouchStart={(e) => e.currentTarget.setAttribute('data-touch-start', e.touches[0].clientX.toString())}
                onTouchEnd={(e) => {
                  const startX = parseFloat(e.currentTarget.getAttribute('data-touch-start') || '0');
                  const endX = e.changedTouches[0].clientX;
                  const diff = endX - startX;
                  if (Math.abs(diff) > 50) {
                    handleSwipe(item.id);
                  }
                }}
                onClick={(e) => {
                  if (e.detail === 1) {
                    handleSwipe(item.id);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, { name: e.target.value })}
                      onFocus={() => handleInputFocus(item.id)}
                      onBlur={() => handleInputBlur(item.id)}
                      className={`flex-1 bg-transparent border-none outline-none text-base font-medium ${
                        isStriked ? 'line-through text-[#9B9B9B]' : 'text-[#DBDBDB]'
                      }`}
                      placeholder="Item name"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: e.target.value })}
                      onFocus={() => handleInputFocus(item.id)}
                      onBlur={() => handleInputBlur(item.id)}
                      className={`bg-transparent border-none outline-none text-center w-12 text-base font-medium ${
                        isStriked ? 'line-through text-[#9B9B9B]' : 'text-[#9B9B9B]'
                      }`}
                      placeholder="1"
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(item.id);
                      }}
                      className="text-[#9B9B9B] hover:text-red-500 p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Item Button */}
        <button
          onClick={addNewItem}
          className="w-full border-2 border-dashed border-[#9B9B9B] text-[#9B9B9B] py-3 rounded-lg flex items-center justify-center gap-2 hover:border-[#DBDBDB] hover:text-[#DBDBDB] transition-colors"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />

      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        data={editableList}
        type="list"
      />
    </div>
  );
};

export default ListDetail;
