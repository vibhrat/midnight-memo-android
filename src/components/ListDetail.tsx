
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ShoppingList, ShoppingListItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Pen, Trash2, X } from 'lucide-react';

interface ListDetailProps {
  listId: string;
  onBack: () => void;
}

const ListDetail = ({ listId, onBack }: ListDetailProps) => {
  const [lists, setLists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });
  const [checkedItems, setCheckedItems] = useLocalStorage<Record<string, boolean>>(`list-${listId}-checked`, {});

  const list = lists.find(l => l.id === listId);

  if (!list) {
    return (
      <div className="max-w-2xl mx-auto p-4 pb-20">
        <div className="text-center py-12 text-gray-500">
          List not found
        </div>
      </div>
    );
  }

  const handleEditTitle = () => {
    setEditTitle(list.title);
    setIsEditing(true);
  };

  const handleSaveTitle = () => {
    if (!editTitle.trim()) return;
    
    setLists(lists.map(l => 
      l.id === listId 
        ? { ...l, title: editTitle, updatedAt: new Date() }
        : l
    ));
    setIsEditing(false);
  };

  const handleAddItem = () => {
    if (!newItem.name.trim()) return;
    
    const item: ShoppingListItem = {
      id: Date.now().toString(),
      name: newItem.name,
      quantity: newItem.quantity || '1',
    };
    
    setLists(lists.map(l => 
      l.id === listId 
        ? { ...l, items: [...l.items, item], updatedAt: new Date() }
        : l
    ));
    setNewItem({ name: '', quantity: '' });
  };

  const handleDeleteItem = (itemId: string) => {
    setLists(lists.map(l => 
      l.id === listId 
        ? { ...l, items: l.items.filter(item => item.id !== itemId), updatedAt: new Date() }
        : l
    ));
    // Remove from checked items as well
    const newCheckedItems = { ...checkedItems };
    delete newCheckedItems[itemId];
    setCheckedItems(newCheckedItems);
  };

  const handleDeleteList = () => {
    setLists(lists.filter(l => l.id !== listId));
    onBack();
  };

  const handleItemCheck = (itemId: string, checked: boolean) => {
    setCheckedItems({
      ...checkedItems,
      [itemId]: checked
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex justify-end items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={handleEditTitle}
            className="p-2 text-gray-600 hover:text-black"
          >
            <Pen className="w-5 h-5" />
          </button>
          <button
            onClick={handleDeleteList}
            className="p-2 text-gray-600 hover:text-red-600"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="mb-6">
          <div className="flex gap-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="border-gray-300"
            />
            <Button onClick={handleSaveTitle} className="bg-black text-white hover:bg-gray-800">
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <h1 className="text-2xl font-semibold mb-6">{list.title}</h1>
      )}

      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Input
            placeholder="Item name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="col-span-2 border-gray-300"
          />
          <Input
            placeholder="Qty"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            className="border-gray-300"
          />
        </div>
        <Button onClick={handleAddItem} className="w-full bg-black text-white hover:bg-gray-800">
          Add Item
        </Button>
      </div>

      <div className="space-y-3">
        {list.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
            <Checkbox
              checked={checkedItems[item.id] || false}
              onCheckedChange={(checked) => handleItemCheck(item.id, checked as boolean)}
            />
            <div className={`flex-1 ${checkedItems[item.id] ? 'line-through text-gray-500' : ''}`}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{item.quantity}</span>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {list.items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No items in this list yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ListDetail;
