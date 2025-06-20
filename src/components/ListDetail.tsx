
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ShoppingList, ShoppingListItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { Skeleton } from '@/components/ui/skeleton';

interface ListDetailProps {
  listId: string;
  onBack: () => void;
}

const ListDetail = ({ listId, onBack }: ListDetailProps) => {
  const [lists, setLists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);
  const [editableList, setEditableList] = useState<ShoppingList | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
          <Button onClick={onBack} className="mt-4">Go Back</Button>
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

  const addItem = () => {
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

  const toggleItem = (itemId: string) => {
    const item = editableList.items.find(item => item.id === itemId);
    if (item) {
      updateItem(itemId, { checked: !item.checked });
    }
  };

  const deleteItem = (itemId: string) => {
    const updatedItems = editableList.items.filter(item => item.id !== itemId);
    autoSave({ items: updatedItems });
  };

  const handleDeleteList = () => {
    setIsDeleting(true);
    setLists(lists.filter(l => l.id !== listId));
    setTimeout(() => {
      onBack();
    }, 1000);
  };

  const confirmDeleteItem = (itemId: string) => {
    setItemToDelete(itemId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete);
      setItemToDelete(null);
    }
    setShowDeleteDialog(false);
  };

  if (isDeleting) {
    return (
      <div className="min-h-screen bg-[#FBFAF5] flex flex-col justify-center items-center p-4">
        <div className="space-y-4 w-full max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
          <Skeleton className="h-16 w-full rounded-lg" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFAF5]">
      <div className="max-w-2xl mx-auto p-4 pb-20">
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

        <div className="mb-6">
          <input
            value={editableList.title}
            onChange={(e) => autoSave({ title: e.target.value })}
            className="text-2xl font-bold w-full border-none outline-none bg-transparent"
            placeholder="List title"
            style={{ fontSize: '24px' }}
          />
        </div>

        <div className="space-y-3">
          {editableList.items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-4" style={{ boxShadow: '0px 1px 4px 0px #E8E7E3' }}>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <input
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    className="w-full border-none outline-none bg-transparent text-lg font-medium break-words"
                    placeholder="Item name"
                    style={{ 
                      fontSize: '18px',
                      wordWrap: 'break-word',
                      whiteSpace: 'normal'
                    }}
                  />
                </div>
                <input
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, { quantity: e.target.value })}
                  className="w-16 text-center border-none outline-none bg-gray-50 rounded px-2 py-1"
                  placeholder="1"
                />
                <button
                  onClick={() => toggleItem(item.id)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}
                >
                  {item.checked && <span className="text-white text-sm">✓</span>}
                </button>
                <button
                  onClick={() => confirmDeleteItem(item.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Trash2 size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addItem}
          className="w-full mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600"
        >
          <Plus size={20} />
          Add Item
        </button>

        <div className="flex justify-between items-center mt-6 px-2">
          <p className="text-xs text-gray-500">
            Created: {new Date(editableList.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500">
            Updated: {new Date(editableList.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setItemToDelete(null);
        }}
        onConfirm={itemToDelete ? handleConfirmDelete : handleDeleteList}
      />
    </div>
  );
};

export default ListDetail;
