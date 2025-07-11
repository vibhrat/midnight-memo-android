
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { useFirebaseNotes } from '@/hooks/useFirebaseNotes';
import { useFirebaseLists } from '@/hooks/useFirebaseLists';
import { useFirebasePasswords } from '@/hooks/useFirebasePasswords';
import { signOut } from '@/integrations/firebase/auth';
import { CasualNote, ShoppingList, Password } from '@/types';
import { ArrowLeft, Upload, LogOut, Award, Download, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AppMenuProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const AppMenu = ({ onBack, onNavigate }: AppMenuProps) => {
  const { user } = useFirebaseAuth();
  const [notes, setNotes] = useLocalStorage<CasualNote[]>('casual-notes', []);
  const [lists, setLists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);
  const [passwords, setPasswords] = useLocalStorage<Password[]>('passwords', []);
  const { createNote } = useFirebaseNotes();
  const { createList } = useFirebaseLists();
  const { createPassword } = useFirebasePasswords();
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
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

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        // Import notes
        if (importedData.notes && Array.isArray(importedData.notes)) {
          for (const noteData of importedData.notes) {
            const newNote = {
              title: noteData.title || '',
              content: noteData.content || '',
              tag: noteData.tag || '',
              isBlurred: noteData.isBlurred || false,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            if (user) {
              await createNote(newNote);
            } else {
              const existingNotes = JSON.parse(localStorage.getItem('casual-notes') || '[]');
              const noteWithId = { ...newNote, id: Date.now().toString() + Math.random() };
              existingNotes.unshift(noteWithId);
              localStorage.setItem('casual-notes', JSON.stringify(existingNotes));
            }
          }
        }

        // Import lists
        if (importedData.lists && Array.isArray(importedData.lists)) {
          for (const listData of importedData.lists) {
            const newList = {
              title: listData.title || '',
              items: listData.items || [],
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            if (user) {
              await createList(newList);
            } else {
              const existingLists = JSON.parse(localStorage.getItem('shopping-lists') || '[]');
              const listWithId = { ...newList, id: Date.now().toString() + Math.random() };
              existingLists.unshift(listWithId);
              localStorage.setItem('shopping-lists', JSON.stringify(existingLists));
            }
          }
        }

        // Import passwords
        if (importedData.passwords && Array.isArray(importedData.passwords)) {
          for (const passwordData of importedData.passwords) {
            const newPassword = {
              title: passwordData.title || '',
              password: passwordData.password || '',
              fields: passwordData.fields || [],
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            if (user) {
              await createPassword(newPassword);
            } else {
              const existingPasswords = JSON.parse(localStorage.getItem('passwords') || '[]');
              const passwordWithId = { ...newPassword, id: Date.now().toString() + Math.random() };
              existingPasswords.unshift(passwordWithId);
              localStorage.setItem('passwords', JSON.stringify(existingPasswords));
            }
          }
        }

        toast({
          title: "Success",
          description: "Data imported successfully!",
        });
        setShowImportDialog(false);
        
      } catch (error) {
        console.error('Import error:', error);
        toast({
          title: "Error",
          description: "Invalid file format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleSignOut = async () => {
    if (user) {
      // Firebase sign out
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Error",
          description: "Failed to sign out",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
    } else {
      // Local storage clear
      localStorage.clear();
      window.location.reload();
    }
    setShowSignOutConfirm(false);
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
            <Upload size={20} className="text-[#9B9B9B]" />
            <span className="text-[#DBDBDB]">Export Data</span>
          </button>

          <button
            onClick={() => setShowImportDialog(true)}
            className="w-full bg-[#181818] p-4 rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <Download size={20} className="text-[#9B9B9B]" />
            <span className="text-[#DBDBDB]">Import Data</span>
          </button>

          {!user && (
            <button
              onClick={() => onNavigate('auth')}
              className="w-full bg-[#181818] p-4 rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
            >
              <LogOut size={20} className="text-[#9B9B9B]" />
              <span className="text-[#DBDBDB]">Sign In</span>
            </button>
          )}

          {user && (
            <button
              onClick={() => setShowSignOutConfirm(true)}
              className="w-full bg-[#181818] p-4 rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
            >
              <LogOut size={20} className="text-[#9B9B9B]" />
              <span className="text-[#DBDBDB]">Sign Out</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('badge')}
            className="w-full bg-[#181818] p-4 rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <Award size={20} className="text-[#9B9B9B]" />
            <span className="text-[#DBDBDB]">Badge</span>
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
              <div className="flex flex-col gap-4">
                <label className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer text-center" style={{ backgroundColor: '#272727' }}>
                  Select JSON File
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => setShowImportDialog(false)}
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
      </div>
    </div>
  );
};

export default AppMenu;
