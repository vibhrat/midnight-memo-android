
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ShoppingList, ShoppingListItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pen, Trash2, X, ArrowLeft, Plus } from 'lucide-react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import FloatingActionButton from '@/components/FloatingActionButton';

interface ListDetailProps {
  listId: string;
  onBack: () => void;
}

const ListDetail = ({ listId, onBack }: ListDetailProps) => {
  const [lists, setLists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);
  const [isTitleEditOpen, setIsTitleEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [checkedItems, setCheckedItems] = useLocalStorage<Record<string, boolean>>(`list-${listId}-checked`, {});
  const [editingItem, setEditingItem] = useState<ShoppingListItem | null>(null);
  const [isItemEditOpen, setIsItemEditOpen] = useState(false);
  const [editItemName, setEditItemName] = useState('');
  const [editItemQuantity, setEditItemQuantity] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const list = lists.find(l => l.id === listId);

  // Auto-save title changes
  const handleTitleChange = (newTitle: string) => {
    setLists(lists.map(l => 
      l.id === listId 
        ? { ...l, title: newTitle, updatedAt: new Date() }
        : l
    ));
  };

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
    const item: ShoppingListItem = {
      id: Date.now().toString(),
      name: '',
      quantity: '1',
    };
    
    setLists(lists.map(l => 
      l.id === listId 
        ? { ...l, items: [...l.items, item], updatedAt: new Date() }
        : l
    ));
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
    setTimeout(() => {
      onBack();
    }, 200);
  };

  const handleItemCheck = (itemId: string, checked: boolean) => {
    setCheckedItems({
      ...checkedItems,
      [itemId]: checked
    });
  };

  const handleItemMouseDown = (item: ShoppingListItem, e: React.MouseEvent) => {
    const timer = setTimeout(() => {
      // Long press - toggle strike through
      handleItemCheck(item.id, !checkedItems[item.id]);
    }, 500);
    setLongPressTimer(timer);
  };

  const handleItemMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleItemClick = (item: ShoppingListItem, e: React.MouseEvent) => {
    // Don't open edit if clicking on delete button or during long press
    const target = e.target as HTMLElement;
    if (target.closest('[data-delete-btn]') || longPressTimer) {
      return;
    }
    
    setEditingItem(item);
    setEditItemName(item.name);
    setEditItemQuantity(item.quantity);
    setIsItemEditOpen(true);
  };

  const handleSaveItem = () => {
    if (!editingItem) return;
    
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

  const handleItemNameChange = (itemId: string, newName: string) => {
    setLists(lists.map(l => 
      l.id === listId 
        ? { 
            ...l, 
            items: l.items.map(item => 
              item.id === itemId 
                ? { ...item, name: newName }
                : item
            ), 
            updatedAt: new Date() 
          }
        : l
    ));
  };

  const handleItemQuantityChange = (itemId: string, newQuantity: string) => {
    setLists(lists.map(l => 
      l.id === listId 
        ? { 
            ...l, 
            items: l.items.map(item => 
              item.id === itemId 
                ? { ...item, quantity: newQuantity }
                : item
            ), 
            updatedAt: new Date() 
          }
        : l
    ));
  };

  return (
    <div className="min-h-screen bg-[#FBFAF5] pb-20">
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
              onClick={() => setShowDeleteDialog(true)}
              className="p-2 text-gray-600 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <input
          type="text"
          value={list.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="text-xl font-extrabold mb-6 w-full border-none outline-none bg-transparent focus:border-b focus:border-gray-300 focus:pb-1"
          placeholder="Untitled List"
          style={{ fontSize: '20px' }}
        />

        <div className="space-y-3">
          {list.items.map((item) => (
            <div 
              key={item.id} 
              className={`flex items-center gap-3 p-3 rounded-lg bg-white cursor-pointer ${
                checkedItems[item.id] ? 'line-through opacity-60' : ''
              }`}
              style={{ boxShadow: '0px 1px 4px 0px #E8E7E3' }}
              onMouseDown={(e) => handleItemMouseDown(item, e)}
              onMouseUp={handleItemMouseUp}
              onMouseLeave={handleItemMouseUp}
              onClick={(e) => handleItemClick(item, e)}
            >
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
              <div className="flex-1 flex items-center">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemNameChange(item.id, e.target.value)}
                  placeholder="Item name"
                  className="text-sm font-medium border-none outline-none bg-transparent focus:border-b focus:border-gray-300 focus:pb-1"
                  style={{ width: '80%' }}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="w-px h-4 bg-gray-300 mx-2"></div>
                <input
                  type="text"
                  value={item.quantity}
                  onChange={(e) => handleItemQuantityChange(item.id, e.target.value)}
                  placeholder="Qty"
                  className="text-sm text-gray-600 border-none outline-none bg-transparent focus:border-b focus:border-gray-300 focus:pb-1"
                  style={{ width: '20%' }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          ))}
          {list.items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No items in this list yet
            </div>
          )}
        </div>

        <FloatingActionButton onClick={handleAddItem} />

        {/* Title Edit Dialog */}
        <Dialog open={isTitleEditOpen} onOpenChange={setIsTitleEditOpen}>
          <DialogContent className="sm:max-w-md" hideCloseButton>
            <DialogHeader>
              <DialogTitle>Edit List Title</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="List title"
                className="w-full focus:border-b focus:border-gray-300"
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
          <DialogContent className="sm:max-w-md" hideCloseButton>
            <div className="pb-2">
              <h2 className="text-lg font-semibold">Edit Item</h2>
            </div>
            <div className="space-y-4">
              <Input
                value={editItemName}
                onChange={(e) => setEditItemName(e.target.value)}
                placeholder="Item name"
                className="w-full focus:border-b focus:border-gray-300"
              />
              <Input
                value={editItemQuantity}
                onChange={(e) => setEditItemQuantity(e.target.value)}
                placeholder="Quantity"
                className="w-full focus:border-b focus:border-gray-300"
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

        <DeleteConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteList}
        />
      </div>
    </div>
  );
};

export default ListDetail;
