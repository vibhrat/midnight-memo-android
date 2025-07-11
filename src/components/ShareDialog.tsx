
import { useState } from 'react';
import { CasualNote, ShoppingList, Password } from '@/types';
import { X, Copy, FileText, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: CasualNote | ShoppingList | Password | {};
  type: 'note' | 'list' | 'password';
  mode: 'share' | 'import';
}

const ShareDialog = ({ isOpen, onClose, data, type, mode }: ShareDialogProps) => {
  const [importText, setImportText] = useState('');
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleCopyText = () => {
    const textToCopy = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const handleImportFromText = () => {
    try {
      const importedData = JSON.parse(importText);
      
      // Add the imported data to localStorage based on type
      if (type === 'note') {
        const existingNotes = JSON.parse(localStorage.getItem('casual-notes') || '[]');
        const newNote = {
          ...importedData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        existingNotes.unshift(newNote);
        localStorage.setItem('casual-notes', JSON.stringify(existingNotes));
      } else if (type === 'list') {
        const existingLists = JSON.parse(localStorage.getItem('shopping-lists') || '[]');
        const newList = {
          ...importedData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        existingLists.unshift(newList);
        localStorage.setItem('shopping-lists', JSON.stringify(existingLists));
      } else if (type === 'password') {
        const existingPasswords = JSON.parse(localStorage.getItem('passwords') || '[]');
        const newPassword = {
          ...importedData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        existingPasswords.unshift(newPassword);
        localStorage.setItem('passwords', JSON.stringify(existingPasswords));
      }
      
      toast({
        title: "Success",
        description: "Data imported successfully!",
      });
      
      setImportText('');
      onClose();
      
      // Refresh the page to show the new data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid JSON format",
        variant: "destructive",
      });
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setImportText(content);
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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(19, 16, 16, 0.60)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <div 
        className="w-full max-w-md mx-auto rounded-[24px] overflow-hidden border border-[#2F2F2F] p-6"
        style={{
          background: 'linear-gradient(180deg, rgba(47, 42, 42, 0.53) 0%, rgba(25, 25, 25, 0.48) 49.04%, #000 100%)',
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#EAEAEA]">
            {mode === 'share' ? 'Share' : 'Import'} {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <button onClick={onClose} className="text-[#9B9B9B] hover:text-[#DBDBDB]">
            <X size={24} />
          </button>
        </div>

        {mode === 'share' ? (
          <div className="space-y-4">
            <button
              onClick={handleCopyText}
              className="w-full bg-[#181818] p-4 rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
            >
              <Copy size={20} className="text-[#9B9B9B]" />
              <span className="text-[#DBDBDB]">Copy as Text</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="w-full bg-[#181818] p-4 rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors cursor-pointer">
              <Upload size={20} className="text-[#9B9B9B]" />
              <span className="text-[#DBDBDB]">Import from File</span>
              <input
                type="file"
                accept=".json,.txt"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#9B9B9B]">
                Or paste JSON text:
              </label>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full h-32 p-3 bg-[#181818] border border-[#2F2F2F] rounded-lg text-[#DBDBDB] placeholder:text-[#9B9B9B] resize-none"
                placeholder="Paste your JSON data here..."
              />
              {importText && (
                <button
                  onClick={handleImportFromText}
                  className="w-full bg-[#DBDBDB] hover:bg-[#9B9B9B] text-[#000000] py-3 rounded-lg font-medium transition-colors"
                >
                  Import Data
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareDialog;
