
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ShoppingList, ShoppingListItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import FloatingActionButton from '@/components/FloatingActionButton';

interface ListDetailProps {
  listId: string;
  onBack: () => void;
}

const ListDetail = ({ listId, onBack }: ListDetailProps) => {
  const [lists, setLists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const list = lists.find(l => l.id === listId);

  if (!list) {
    return (
      <div className="min-h-screen bg-[#FBFAF5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">List not found</p>
          <Button onClick={onBack} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  const handleTitleChange = (newTitle: string) => {
    setLists(lists.map(l => 
      l.id === listId 
        ? { ...l, title: newTitle, updatedAt: new Date() }
        : l
    ));
  };

  const handleItemChange = (itemId: string, field: 'name' | 'quantity', value: string) => {
    setLists(lists.map(l => 
      l.id === listId 
        ? { 
            ...l, 
            items: l.items.map(item => 
              item.id === itemId 
                ? { ...item, [field]: value }
                : item
            ),
            updatedAt: new Date()
          }
        : l
    ));
  };

  const handleItemToggle = (itemId: string) => {
    setLists(lists.map(l => 
      l.id === listId 
        ? { 
            ...l, 
            items: l.items.map(item => 
              item.id === itemId 
                ? { ...item, completed: !item.completed }
                : item
            ),
            updatedAt: new Date()
          }
        : l
    ));
  };

  const addNewItem = () => {
    const newItem: ShoppingListItem = {
      id: Date.now().toString(),
      name: '',
      quantity: '',
      completed: false,
    };

    setLists(lists.map(l => 
      l.id === listId 
        ? { 
            ...l, 
            items: [...l.items, newItem],
            updatedAt: new Date()
          }
        : l
    ));
  };

  const deleteItem = (itemId: string) => {
    setLists(lists.map(l => 
      l.id === listId 
        ? { 
            ...l, 
            items: l.items.filter(item => item.id !== itemId),
            updatedAt: new Date()
          }
        : l
    ));
  };

  const handleDelete = () => {
    setLists(lists.filter(l => l.id !== listId));
    setTimeout(() => {
      onBack();
    }, 200);
  };

  const handleLongPressStart = (itemId: string) => {
    const timer = setTimeout(() => {
      handleItemToggle(itemId);
    }, 500);
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAF5]">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Trash2 size={20} className="text-black" />
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={list.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-2xl font-bold w-full bg-transparent border-none outline-none"
            placeholder="List Title"
            style={{ fontSize: '26px' }}
          />
        </div>

        <div className="space-y-3">
          {list.items.map((item) => (
            <div 
              key={item.id} 
              className={`bg-white p-4 rounded-lg cursor-pointer ${item.completed ? 'opacity-60' : ''}`}
              style={{ boxShadow: '0px 1px 4px 0px #E8E7E3' }}
              onMouseDown={() => handleLongPressStart(item.id)}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
              onTouchStart={() => handleLongPressStart(item.id)}
              onTouchEnd={handleLongPressEnd}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 flex items-start gap-3" style={{ width: '80%' }}>
                  <div className="w-3 h-3 bg-blue-200 rounded-full mt-2 flex-shrink-0"></div>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                    className={`flex-1 bg-transparent border-none outline-none font-medium ${item.completed ? 'line-through' : ''} leading-relaxed`}
                    placeholder="Item name"
                    style={{ fontSize: '20px', lineHeight: '1.4' }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <div className="w-px h-8 bg-gray-300 mx-2 flex-shrink-0"></div>
                
                <div className="flex items-center" style={{ width: '20%' }}>
                  <input
                    type="text"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                    className={`w-full bg-transparent border-none outline-none text-center ${item.completed ? 'line-through' : ''}`}
                    placeholder="Qty"
                    style={{ fontSize: '18px' }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(item.id);
                  }}
                  className="p-1 hover:bg-gray-100 rounded opacity-40 hover:opacity-100 flex-shrink-0"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 px-2">
          <p className="text-xs text-gray-500" style={{ fontSize: '12px' }}>
            Created: {new Date(list.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500" style={{ fontSize: '12px' }}>
            Updated: {new Date(list.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <FloatingActionButton onClick={addNewItem} />

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ListDetail;
