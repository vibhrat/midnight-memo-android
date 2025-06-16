
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ShoppingList, ShoppingListItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ShoppingLists = () => {
  const [lists, setLists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const now = new Date();

    if (editingId) {
      setLists(lists.map(list => 
        list.id === editingId 
          ? { ...list, title, items, updatedAt: now }
          : list
      ));
      setEditingId(null);
    } else {
      const newList: ShoppingList = {
        id: Date.now().toString(),
        title,
        items,
        createdAt: now,
        updatedAt: now,
      };
      setLists([newList, ...lists]);
    }

    setTitle('');
    setItems([]);
    setIsCreating(false);
  };

  const addItem = () => {
    if (!newItem.name.trim()) return;
    
    const item: ShoppingListItem = {
      id: Date.now().toString(),
      name: newItem.name,
      quantity: newItem.quantity || '1',
    };
    
    setItems([...items, item]);
    setNewItem({ name: '', quantity: '' });
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleEdit = (list: ShoppingList) => {
    setTitle(list.title);
    setItems(list.items);
    setEditingId(list.id);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    setLists(lists.filter(list => list.id !== id));
  };

  const handleCancel = () => {
    setTitle('');
    setItems([]);
    setNewItem({ name: '', quantity: '' });
    setIsCreating(false);
    setEditingId(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Shopping Lists</h1>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="bg-black text-white hover:bg-gray-800">
            New List
          </Button>
        )}
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="space-y-4">
            <Input
              placeholder="List title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-gray-300"
            />
            
            <div className="space-y-2">
              <h4 className="font-medium">Items</h4>
              <div className="grid grid-cols-3 gap-2">
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
              <Button type="button" onClick={addItem} variant="outline" size="sm">
                Add Item
              </Button>
            </div>

            {items.length > 0 && (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-sm font-medium text-gray-600 pb-2 border-b">
                  <div className="col-span-2">Item</div>
                  <div>Quantity</div>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-3 gap-2 items-center">
                    <div className="col-span-2 text-sm">{item.name}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                {editingId ? 'Update' : 'Save'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {lists.map((list) => (
          <div key={list.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-medium">{list.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(list)}
                  className="text-sm text-gray-600 hover:text-black"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(list.id)}
                  className="text-sm text-gray-600 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
            
            {list.items.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-600 pb-1 border-b">
                  <div className="col-span-2">Item</div>
                  <div>Quantity</div>
                </div>
                {list.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-3 gap-2 text-sm">
                    <div className="col-span-2">{item.name}</div>
                    <div>{item.quantity}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No items in this list</p>
            )}
            
            <p className="text-xs text-gray-500 mt-3">
              {new Date(list.updatedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
        {lists.length === 0 && !isCreating && (
          <div className="text-center py-12 text-gray-500">
            No shopping lists yet. Create your first list!
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingLists;
