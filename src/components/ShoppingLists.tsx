import { useState, forwardRef, useImperativeHandle } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ShoppingList, ShoppingListItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface ShoppingListsRef {
  triggerCreate: () => void;
}

interface ShoppingListsProps {
  onListSelect?: (listId: string) => void;
}

const ShoppingLists = forwardRef<ShoppingListsRef, ShoppingListsProps>(({ onListSelect }, ref) => {
  const [lists, setLists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });

  useImperativeHandle(ref, () => ({
    triggerCreate: () => {
      setIsCreating(true);
    }
  }));

  const getDaysAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const now = new Date();
    const newList: ShoppingList = {
      id: Date.now().toString(),
      title,
      items,
      createdAt: now,
      updatedAt: now,
    };
    setLists([newList, ...lists]);

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

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLists(lists.filter(list => list.id !== id));
  };

  const handleCancel = () => {
    setTitle('');
    setItems([]);
    setNewItem({ name: '', quantity: '' });
    setIsCreating(false);
  };

  const handleCardClick = (listId: string) => {
    if (onListSelect) {
      onListSelect(listId);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Lists</h1>
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
                Save
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
          <Card 
            key={list.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick(list.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2">{list.title}</h3>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>{getDaysAgo(list.createdAt)}d</span>
                    </div>
                    <span className="text-sm text-gray-600">{list.items.length} items</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {lists.length === 0 && !isCreating && (
          <div className="text-center py-12 text-gray-500">
            No shopping lists yet. Create your first list!
          </div>
        )}
      </div>
    </div>
  );
});

ShoppingLists.displayName = 'ShoppingLists';

export default ShoppingLists;
