
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CasualNote, ShoppingList, Password } from '@/types';
import { ArrowLeft, Download, LogOut, Award, Upload, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AppMenuProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const AppMenu = ({ onBack, onNavigate }: AppMenuProps) => {
  const [notes] = useLocalStorage<CasualNote[]>('casual-notes', []);
  const [lists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);
  const [passwords] = useLocalStorage<Password[]>('vault-passwords', []);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importType, setImportType] = useState<'complete' | 'note' | 'list' | 'password' | null>(null);
  const [importMethod, setImportMethod] = useState<'json' | 'text' | null>(null);
  const [textInput, setTextInput] = useState('');
  const { toast } = useToast();

  const handleExportData = () => {
    const exportData = {
      notes,
      lists,
      passwords,
      exportedAt: new Date().toISOString()
    };

    const jsonData = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `cipher-vault-export-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Data exported successfully!",
    });
    setShowExportConfirm(false);
  };

  const handleSignOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        processImportData(content);
      } catch (error) {
        console.error('Error reading file:', error);
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
    if (!textInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter some data to import",
        variant: "destructive",
      });
      return;
    }
    processImportData(textInput);
  };

  const processImportData = (content: string) => {
    try {
      let data;
      
      // Check if it's a cipher format (CIPHER_NOTE:, CIPHER_LIST:, CIPHER_PASSWORD:)
      if (content.startsWith('CIPHER_')) {
        const colonIndex = content.indexOf(':');
        if (colonIndex === -1) {
          throw new Error('Invalid cipher format');
        }
        
        const type = content.substring(0, colonIndex);
        const jsonPart = content.substring(colonIndex + 1);
        data = JSON.parse(jsonPart);
        
        // Handle cipher format imports
        if (type === 'CIPHER_NOTE') {
          importNote(data);
        } else if (type === 'CIPHER_LIST') {
          importList(data);
        } else if (type === 'CIPHER_PASSWORD') {
          importPassword(data);
        } else {
          throw new Error('Unknown cipher type');
        }
      } else {
        // Try to parse as regular JSON
        data = JSON.parse(content);
        
        if (importType === 'complete') {
          importCompleteData(data);
        } else if (importType === 'note') {
          importNote(data);
        } else if (importType === 'list') {
          importList(data);
        } else if (importType === 'password') {
          importPassword(data);
        }
      }
      
      toast({
        title: "Success",
        description: "Data imported successfully!",
      });
      setShowImportDialog(false);
      setTextInput('');
      setImportType(null);
      setImportMethod(null);
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: "Invalid JSON format or data structure",
        variant: "destructive",
      });
    }
  };

  const importCompleteData = (data: any) => {
    if (data.notes) {
      const currentNotes = JSON.parse(localStorage.getItem('casual-notes') || '[]');
      const newNotes = data.notes.map((note: any) => ({
        ...note,
        id: Date.now().toString() + Math.random().toString(),
        createdAt: new Date(note.createdAt || Date.now()),
        updatedAt: new Date(note.updatedAt || Date.now())
      }));
      localStorage.setItem('casual-notes', JSON.stringify([...currentNotes, ...newNotes]));
    }
    
    if (data.lists) {
      const currentLists = JSON.parse(localStorage.getItem('shopping-lists') || '[]');
      const newLists = data.lists.map((list: any) => ({
        ...list,
        id: Date.now().toString() + Math.random().toString(),
        createdAt: new Date(list.createdAt || Date.now()),
        updatedAt: new Date(list.updatedAt || Date.now())
      }));
      localStorage.setItem('shopping-lists', JSON.stringify([...currentLists, ...newLists]));
    }
    
    if (data.passwords) {
      const currentPasswords = JSON.parse(localStorage.getItem('vault-passwords') || '[]');
      const newPasswords = data.passwords.map((password: any) => ({
        ...password,
        id: Date.now().toString() + Math.random().toString(),
        createdAt: new Date(password.createdAt || Date.now()),
        updatedAt: new Date(password.updatedAt || Date.now())
      }));
      localStorage.setItem('vault-passwords', JSON.stringify([...currentPasswords, ...newPasswords]));
    }
  };

  const importNote = (data: any) => {
    const currentNotes = JSON.parse(localStorage.getItem('casual-notes') || '[]');
    const newNote = {
      ...data,
      id: Date.now().toString() + Math.random().toString(),
      createdAt: new Date(data.createdAt || Date.now()),
      updatedAt: new Date(data.updatedAt || Date.now())
    };
    localStorage.setItem('casual-notes', JSON.stringify([newNote, ...currentNotes]));
  };

  const importList = (data: any) => {
    const currentLists = JSON.parse(localStorage.getItem('shopping-lists') || '[]');
    const newList = {
      ...data,
      id: Date.now().toString() + Math.random().toString(),
      createdAt: new Date(data.createdAt || Date.now()),
      updatedAt: new Date(data.updatedAt || Date.now())
    };
    localStorage.setItem('shopping-lists', JSON.stringify([newList, ...currentLists]));
  };

  const importPassword = (data: any) => {
    const currentPasswords = JSON.parse(localStorage.getItem('vault-passwords') || '[]');
    const newPassword = {
      ...data,
      id: Date.now().toString() + Math.random().toString(),
      createdAt: new Date(data.createdAt || Date.now()),
      updatedAt: new Date(data.updatedAt || Date.now())
    };
    localStorage.setItem('vault-passwords', JSON.stringify([newPassword, ...currentPasswords]));
  };

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="p-2 border border-[#9B9B9B] rounded-lg hover:bg-[#181818]"
          >
            <ArrowLeft size={22} className="text-[#9B9B9B]" />
          </button>
          <h1 className="text-xl font-bold text-[#DBDBDB] ml-4">Menu</h1>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setShowExportConfirm(true)}
            className="w-full bg-[#181818] p-4 rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <Download size={20} className="text-[#9B9B9B]" />
            <span className="text-[#DBDBDB]">Export Data</span>
          </button>

          <button
            onClick={() => setShowSignOutConfirm(true)}
            className="w-full bg-[#181818] p-4 rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <LogOut size={20} className="text-[#9B9B9B]" />
            <span className="text-[#DBDBDB]">Sign Out</span>
          </button>

          <button
            onClick={() => onNavigate('badge')}
            className="w-full bg-[#181818] p-4 rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <Award size={20} className="text-[#9B9B9B]" />
            <span className="text-[#DBDBDB]">Badge</span>
          </button>

          <button
            onClick={() => setShowImportDialog(true)}
            className="w-full bg-[#181818] p-4 rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <Upload size={20} className="text-[#9B9B9B]" />
            <span className="text-[#DBDBDB]">Import</span>
          </button>

          <button
            onClick={() => onNavigate('pin-management')}
            className="w-full bg-[#181818] p-4 rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <KeyRound size={20} className="text-[#9B9B9B]" />
            <span className="text-[#DBDBDB]">PIN</span>
          </button>
        </div>

        {/* Export Confirmation */}
        {showExportConfirm && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: 'rgba(19, 16, 16, 0.60)',
              backdropFilter: 'blur(5px)',
            }}
          >
            <div 
              className="w-full max-w-xs mx-auto rounded-[32px] overflow-hidden border border-[#2F2F2F] p-8"
              style={{
                background: 'linear-gradient(180deg, rgba(47, 42, 42, 0.53) 0%, rgba(25, 25, 25, 0.48) 49.04%, #000 100%)',
              }}
            >
              <h2 className="text-center text-2xl font-semibold text-[#EAEAEA] mb-6">Export All Data?</h2>
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleExportData}
                  className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ backgroundColor: '#272727' }}
                >
                  Export
                </button>
                <button
                  onClick={() => setShowExportConfirm(false)}
                  className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ backgroundColor: '#191919' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sign Out Confirmation */}
        {showSignOutConfirm && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: 'rgba(19, 16, 16, 0.60)',
              backdropFilter: 'blur(5px)',
            }}
          >
            <div 
              className="w-full max-w-xs mx-auto rounded-[32px] overflow-hidden border border-[#2F2F2F] p-8"
              style={{
                background: 'linear-gradient(180deg, rgba(47, 42, 42, 0.53) 0%, rgba(25, 25, 25, 0.48) 49.04%, #000 100%)',
              }}
            >
              <h2 className="text-center text-2xl font-semibold text-[#EAEAEA] mb-6">Sign Out?</h2>
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ backgroundColor: '#272727' }}
                >
                  Sign Out
                </button>
                <button
                  onClick={() => setShowSignOutConfirm(false)}
                  className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ backgroundColor: '#191919' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Import Dialog */}
        {showImportDialog && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: 'rgba(19, 16, 16, 0.60)',
              backdropFilter: 'blur(5px)',
            }}
          >
            <div 
              className="w-full max-w-xs mx-auto rounded-[32px] overflow-hidden border border-[#2F2F2F] p-8"
              style={{
                background: 'linear-gradient(180deg, rgba(47, 42, 42, 0.53) 0%, rgba(25, 25, 25, 0.48) 49.04%, #000 100%)',
              }}
            >
              <h2 className="text-center text-2xl font-semibold text-[#EAEAEA] mb-6">Import Data</h2>
              
              {!importType && (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => setImportType('complete')}
                    className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{ backgroundColor: '#272727' }}
                  >
                    Complete Data
                  </button>
                  <button
                    onClick={() => setImportType('note')}
                    className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{ backgroundColor: '#272727' }}
                  >
                    Note
                  </button>
                  <button
                    onClick={() => setImportType('list')}
                    className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{ backgroundColor: '#272727' }}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setImportType('password')}
                    className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{ backgroundColor: '#272727' }}
                  >
                    Password
                  </button>
                  <button
                    onClick={() => setShowImportDialog(false)}
                    className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{ backgroundColor: '#191919' }}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {importType && !importMethod && (
                <div className="flex flex-col gap-4">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                    id="file-input"
                  />
                  <button
                    onClick={() => document.getElementById('file-input')?.click()}
                    className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{ backgroundColor: '#272727' }}
                  >
                    JSON File
                  </button>
                  <button
                    onClick={() => setImportMethod('text')}
                    className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{ backgroundColor: '#272727' }}
                  >
                    Text Input
                  </button>
                  <button
                    onClick={() => setImportType(null)}
                    className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{ backgroundColor: '#191919' }}
                  >
                    Back
                  </button>
                </div>
              )}

              {importMethod === 'text' && (
                <div className="flex flex-col gap-4">
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste your JSON data here..."
                    className="w-full h-32 bg-[#181818] text-[#DBDBDB] p-3 rounded-lg border border-[#2A2A2A] resize-none"
                  />
                  <button
                    onClick={handleTextImport}
                    className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{ backgroundColor: '#272727' }}
                  >
                    Import
                  </button>
                  <button
                    onClick={() => setImportMethod(null)}
                    className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{ backgroundColor: '#191919' }}
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppMenu;
