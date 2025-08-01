import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'note' | 'list';
}

const ImportDialog = ({ isOpen, onClose, type }: ImportDialogProps) => {
  const { toast } = useToast();
  const [showTextImport, setShowTextImport] = useState(false);
  const [importText, setImportText] = useState('');

  if (!isOpen) return null;

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        processImportData(content);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to read file",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleTextImport = () => {
    if (!importText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to import",
        variant: "destructive",
      });
      return;
    }
    processImportData(importText);
  };

  const processImportData = (content: string) => {
    try {
      let parsedData;
      
      // Try to parse as cipher format first
      if (content.startsWith('CIPHER_NOTE:') || content.startsWith('CIPHER_LIST:')) {
        const prefix = content.startsWith('CIPHER_NOTE:') ? 'CIPHER_NOTE:' : 'CIPHER_LIST:';
        const jsonStr = content.substring(prefix.length);
        parsedData = JSON.parse(jsonStr);
        
        // Add to localStorage based on current type
        if (type === 'note' && prefix === 'CIPHER_NOTE:') {
          const existingNotes = JSON.parse(localStorage.getItem('casual-notes') || '[]');
          const newNote = {
            ...parsedData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date()
          };
          existingNotes.unshift(newNote);
          localStorage.setItem('casual-notes', JSON.stringify(existingNotes));
        } else if (type === 'list' && prefix === 'CIPHER_LIST:') {
          const existingLists = JSON.parse(localStorage.getItem('shopping-lists') || '[]');
          const newList = {
            ...parsedData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date()
          };
          existingLists.unshift(newList);
          localStorage.setItem('shopping-lists', JSON.stringify(existingLists));
        }
      } else {
        // Try to parse as regular JSON
        parsedData = JSON.parse(content);
        
        // Check if it's from the app's export format
        if (parsedData.notes && Array.isArray(parsedData.notes) && type === 'note') {
          const existingNotes = JSON.parse(localStorage.getItem('casual-notes') || '[]');
          const newNotes = parsedData.notes.map((note: any) => ({
            ...note,
            id: Date.now().toString() + Math.random().toString(),
            createdAt: new Date(note.createdAt || Date.now()),
            updatedAt: new Date(note.updatedAt || Date.now())
          }));
          existingNotes.unshift(...newNotes);
          localStorage.setItem('casual-notes', JSON.stringify(existingNotes));
        } else if (parsedData.lists && Array.isArray(parsedData.lists) && type === 'list') {
          const existingLists = JSON.parse(localStorage.getItem('shopping-lists') || '[]');
          const newLists = parsedData.lists.map((list: any) => ({
            ...list,
            id: Date.now().toString() + Math.random().toString(),
            createdAt: new Date(list.createdAt || Date.now()),
            updatedAt: new Date(list.updatedAt || Date.now())
          }));
          existingLists.unshift(...newLists);
          localStorage.setItem('shopping-lists', JSON.stringify(existingLists));
        } else if (type === 'note' && (parsedData.title !== undefined || parsedData.content !== undefined)) {
          // Single note import
          const existingNotes = JSON.parse(localStorage.getItem('casual-notes') || '[]');
          const newNote = {
            id: Date.now().toString(),
            title: parsedData.title || '',
            content: parsedData.content || '',
            tag: parsedData.tag || '',
            isBlurred: parsedData.isBlurred || false,
            createdAt: new Date(parsedData.createdAt || Date.now()),
            updatedAt: new Date(parsedData.updatedAt || Date.now())
          };
          existingNotes.unshift(newNote);
          localStorage.setItem('casual-notes', JSON.stringify(existingNotes));
        } else if (type === 'list' && (parsedData.title !== undefined || parsedData.items !== undefined)) {
          // Single list import
          const existingLists = JSON.parse(localStorage.getItem('shopping-lists') || '[]');
          const newList = {
            id: Date.now().toString(),
            title: parsedData.title || '',
            items: parsedData.items || [],
            createdAt: new Date(parsedData.createdAt || Date.now()),
            updatedAt: new Date(parsedData.updatedAt || Date.now())
          };
          existingLists.unshift(newList);
          localStorage.setItem('shopping-lists', JSON.stringify(existingLists));
        } else {
          throw new Error('Invalid format for this import type');
        }
      }

      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} imported successfully!`,
      });
      setShowTextImport(false);
      setImportText('');
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: "Invalid format or incompatible data",
        variant: "destructive",
      });
    }
  };

  if (showTextImport) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: 'rgba(19, 16, 16, 0.60)',
          backdropFilter: 'blur(5px)',
        }}
      >
        <div 
          className="w-full max-w-lg mx-auto rounded-[32px] overflow-hidden border border-[#2F2F2F] p-8"
          style={{
            background: 'linear-gradient(180deg, rgba(47, 42, 42, 0.53) 0%, rgba(25, 25, 25, 0.48) 49.04%, #000 100%)',
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#EAEAEA]">Import as Text</h2>
            <button 
              onClick={() => setShowTextImport(false)}
              className="p-1 hover:bg-[#333] rounded"
            >
              <X size={20} className="text-[#9B9B9B]" />
            </button>
          </div>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder={`Paste your ${type} data here...`}
            className="w-full h-64 p-4 bg-[#1A1A1A] border border-[#333] rounded-lg text-white placeholder-[#9B9B9B] resize-none focus:outline-none focus:border-[#555]"
          />
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleTextImport}
              className="flex-1 px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#272727' }}
            >
              Import
            </button>
            <button
              onClick={() => setShowTextImport(false)}
              className="flex-1 px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#191919' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(19, 16, 16, 0.60)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <div 
        className="w-full max-w-sm mx-auto rounded-[32px] overflow-hidden border border-[#2F2F2F] p-8"
        style={{
          background: 'linear-gradient(180deg, rgba(47, 42, 42, 0.53) 0%, rgba(25, 25, 25, 0.48) 49.04%, #000 100%)',
        }}
      >
        <h2 className="text-center text-2xl font-semibold text-[#EAEAEA] mb-6">
          Import {type.charAt(0).toUpperCase() + type.slice(1)}
        </h2>
        <div className="flex flex-col gap-4">
          <label className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer text-center" 
                 style={{ backgroundColor: '#272727' }}>
            Import JSON
            <input
              type="file"
              accept=".json,.txt"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setShowTextImport(true)}
            className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#272727' }}
          >
            Import as Text
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#191919' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportDialog;
