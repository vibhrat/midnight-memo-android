
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ShoppingList, ShoppingListItem } from '@/types';
import { ArrowLeft, Trash2, Plus } from 'lucide-react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

interface ListDetailProps {
  listId: string;
  onBack: () => void;
}

const ListDetail = ({ listId, onBack }: ListDetailProps) => {
  const [lists, setLists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);
  const [editableList, setEditableList] = useState<ShoppingList | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
      <div className="min-h-screen bg-[#FBFAF5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">List not found</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-black text-white rounded">Go Back</button>
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
    <div className="min-h-screen bg-[#FBFAF5]">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft size={22} />
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Trash2 size={22} className="text-gray-600" />
          </button>
        </div>

        {/* Title */}
        <div className="mb-6">
          <textarea
            value={editableList.title}
            onChange={(e) => autoSave({ title: e.target.value })}
            className="text-2xl font-bold bg-transparent border-none outline-none resize-none w-full"
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
                className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm"
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
                <div 
                  className="w-5 h-5 rounded-full border-2 border-gray-400 flex-shrink-0 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSwipe(item.id);
                  }}
                  style={{ minWidth: '20px', minHeight: '20px', touchAction: 'manipulation' }}
                />
                
                <div className="flex-1 flex items-center">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    onFocus={() => handleInputFocus(item.id)}
                    onBlur={() => handleInputBlur(item.id)}
                    className={`flex-1 bg-transparent border-none outline-none font-medium mr-3 ${
                      isStriked ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}
                    placeholder="Item Name"
                    style={{ 
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
                  />
                  
                  <div className="w-px bg-gray-300 mx-3 h-4"></div>
                  
                  <input
                    type="text"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, { quantity: e.target.value })}
                    onFocus={() => handleInputFocus(item.id)}
                    onBlur={() => handleInputBlur(item.id)}
                    className={`bg-transparent border-none outline-none font-medium text-center w-16 ${
                      isStriked ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}
                    placeholder="Qty"
                    style={{ 
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
                  />
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(item.id);
                  }}
                  className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0"
                >
                  <Plus size={12} className="rotate-45" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Add Item Button */}
        <button
          onClick={addNewItem}
          className="w-full border-2 border-dashed border-gray-400 text-gray-600 py-3 rounded-lg flex items-center justify-center gap-2 hover:border-gray-500 hover:text-gray-700 transition-colors"
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
    </div>
  );
};

export default ListDetail;
