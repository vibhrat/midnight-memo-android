
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ShoppingList, ShoppingListItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pen, Trash2, X, ArrowLeft } from 'lucide-react';

interface ListDetailProps {
  listId: string;
  onBack: () => void;
}

const ListDetail = ({ listId, onBack }: ListDetailProps) => {
  const [lists, setLists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);
  const [isTitleEditOpen, setIsTitleEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });
  const [checkedItems, setCheckedItems] = useLocalStorage<Record<string, boolean>>(`list-${listId}-checked`, {});
  const [editingItem, setEditingItem] = useState<ShoppingListItem | null>(null);
  const [isItemEditOpen, setIsItemEditOpen] = useState(false);
  const [editItemName, setEditItemName] = useState('');
  const [editItemQuantity, setEditItemQuantity] = useState('');
  const [showAddButton, setShowAddButton] = useState(false);

  const list = lists.find(l => l.id === listId);

  if (!list) {
    return (
      <div className="min-h-screen bg-[#FBFAF5]">
        <div className="max-w-2xl mx-auto p-4 pb-20">
          <div className="text-center py-12 text-gray-500">
            List not found
          </div>
        </div>
      </div>
    );
  }

  const handleEditTitle = () => {
    setEditTitle(list.title);
    setIsTitleEditOpen(true);
  };

  const handleSaveTitle = () => {
    if (!editTitle.trim()) return;
    
    setLists(lists.map(l => 
      l.id === listId 
        ? { ...l, title: editTitle, updatedAt: new Date() }
        : l
    ));
    setIsTitleEditOpen(false);
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
    setShowAddButton(false);
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

  const handleItemClick = (item: ShoppingListItem, e: React.MouseEvent) => {
    // Don't open edit if clicking on checkbox or delete button
    const target = e.target as HTMLElement;
    if (target.closest('[data-checkbox]') || target.closest('[data-delete-btn]')) {
      return;
    }
    
    setEditingItem(item);
    setEditItemName(item.name);
    setEditItemQuantity(item.quantity);
    setIsItemEditOpen(true);
  };

  const handleSaveItem = () => {
    if (!editingItem || !editItemName.trim()) return;
    
    setLists(lists.map(l => 
      l.id === listId 
        ? { 
            ...l, 
            items: l.items.map(item => 
              item.id === editingItem.id 
                ? { ...item, name: editItemName, quantity: editItemQuantity || '1' }
                : item
            ), 
            updatedAt: new Date() 
          }
        : l
    ));
    setIsItemEditOpen(false);
    setEditingItem(null);
  };

  const handleInputFocus = () => {
    setShowAddButton(true);
  };

  return (
    <div className="min-h-screen bg-[#FBFAF5] pb-32">
      {/* Sticky Add Item Section */}
      <div className="fixed bottom-16 left-0 right-0 bg-white p-3 z-10" style={{ boxShadow: '0px -1px 4px 0px #E8E7E3' }}>
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-2 mb-2">
            <Input
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              onFocus={handleInputFocus}
              className="col-span-2 border-gray-300 h-8 text-sm"
            />
            <Input
              placeholder="Qty"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              onFocus={handleInputFocus}
              className="border-gray-300 h-8 text-sm"
            />
          </div>
          {showAddButton && (
            <Button onClick={handleAddItem} className="w-full bg-black text-white hover:bg-gray-800 h-8 text-sm">
              Add Item
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 border border-gray-300 rounded-md text-gray-600 hover:text-black hover:border-gray-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
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

        <h1 className="text-sm font-bold mb-6">{list.title}</h1>

        <div className="space-y-3">
          {list.items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 bg-white"
              style={{ boxShadow: '0px 1px 4px 0px #E8E7E3' }}
              onClick={(e) => handleItemClick(item, e)}
            >
              <div data-checkbox className="flex-shrink-0">
                <Checkbox
                  checked={checkedItems[item.id] || false}
                  onCheckedChange={(checked) => handleItemCheck(item.id, checked as boolean)}
                  className="transition-all duration-300 ease-out data-[state=checked]:animate-[bounce_0.3s_ease-out]"
                />
              </div>
              <div className={`flex-1 transition-all duration-200 ease-in-out ${checkedItems[item.id] ? 'line-through text-gray-500' : ''}`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{item.quantity}</span>
                    <button
                      data-delete-btn
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
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

        {/* Title Edit Dialog */}
        <Dialog open={isTitleEditOpen} onOpenChange={setIsTitleEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit List Title</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="List title"
                className="w-full"
              />
              <Button 
                onClick={handleSaveTitle} 
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Item Edit Dialog */}
        <Dialog open={isItemEditOpen} onOpenChange={setIsItemEditOpen}>
          <DialogContent className="sm:max-w-md">
            <div className="pb-2">
              <h2 className="text-lg font-semibold">Edit Item</h2>
            </div>
            <div className="space-y-4">
              <Input
                value={editItemName}
                onChange={(e) => setEditItemName(e.target.value)}
                placeholder="Item name"
                className="w-full"
              />
              <Input
                value={editItemQuantity}
                onChange={(e) => setEditItemQuantity(e.target.value)}
                placeholder="Quantity"
                className="w-full"
              />
              <Button 
                onClick={handleSaveItem} 
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ListDetail;
