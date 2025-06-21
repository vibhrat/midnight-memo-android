
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ShoppingList, ShoppingListItem } from '@/types';
import { ArrowLeft, X, Plus } from 'lucide-react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

interface ListDetailProps {
  listId: string;
  onBack: () => void;
}

const ListDetail = ({ listId, onBack }: ListDetailProps) => {
  const [lists, setLists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);
  const [editableList, setEditableList] = useState<ShoppingList | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

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

  const handleCirclePress = (itemId: string) => {
    const timer = setTimeout(() => {
      const item = editableList.items.find(i => i.id === itemId);
      if (item) {
        updateItem(itemId, { checked: !item.checked });
      }
    }, 500);
    setPressTimer(timer);
  };

  const handleCircleRelease = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
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
            <X size={22} className="text-gray-600" />
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
          {editableList.items.map((item) => (
            <div 
              key={item.id} 
              className="p-4 bg-white rounded-lg"
              style={{ boxShadow: '0px 1px 4px 0px #E8E7E3' }}
            >
              <div className="flex items-start gap-3">
                <button
                  onMouseDown={() => handleCirclePress(item.id)}
                  onMouseUp={handleCircleRelease}
                  onMouseLeave={handleCircleRelease}
                  onTouchStart={() => handleCirclePress(item.id)}
                  onTouchEnd={handleCircleRelease}
                  className="w-6 h-6 rounded-full bg-gray-300 hover:bg-gray-400 flex-shrink-0 mt-1 p-1"
                />
                <div className="flex-1 min-w-0 flex gap-3">
                  <div className="flex-1" style={{ width: '80%' }}>
                    <textarea
                      value={item.name}
                      onChange={(e) => updateItem(item.id, { name: e.target.value })}
                      className={`w-full bg-transparent border-none outline-none resize-none font-medium ${
                        item.checked ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}
                      placeholder="Item name"
                      rows={1}
                      style={{ 
                        fontSize: '16px',
                        fontWeight: '500',
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap'
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                      }}
                    />
                  </div>
                  <div className="w-16" style={{ width: '20%' }}>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: e.target.value })}
                      className={`w-full bg-transparent border-none outline-none font-medium text-center ${
                        item.checked ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}
                      placeholder="Qty"
                      style={{ 
                        fontSize: '16px',
                        fontWeight: '500'
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-gray-400 hover:text-red-500 p-2 flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
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
