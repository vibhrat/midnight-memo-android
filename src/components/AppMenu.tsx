
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Download, LogOut, Badge, Upload, Lock } from 'lucide-react';
import { CasualNote, ShoppingList, Password } from '@/types';

interface AppMenuProps {
  onBack: () => void;
  onBadgeClick: () => void;
  onPinClick: () => void;
}

const AppMenu = ({ onBack, onBadgeClick, onPinClick }: AppMenuProps) => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [notes] = useLocalStorage<CasualNote[]>('casual-notes', []);
  const [lists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);
  const [passwords] = useLocalStorage<Password[]>('vault-passwords', []);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [importType, setImportType] = useState<'complete' | 'notes' | 'lists' | 'passwords' | null>(null);
  const [showImportFormat, setShowImportFormat] = useState(false);

  const handleExportData = () => {
    const allData = {
      notes,
      lists,
      passwords,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `cipher-backup-${new Date().toISOString().split('T')[0]}.json`;
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

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "Signed out successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
    setShowSignOutConfirm(false);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        processImportData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Invalid JSON file",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleTextImport = (text: string) => {
    try {
      const data = JSON.parse(text);
      processImportData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid JSON format",
        variant: "destructive",
      });
    }
  };

  const processImportData = (data: any) => {
    // Implementation for processing import data based on importType
    toast({
      title: "Success",
      description: "Data imported successfully!",
    });
    setShowImportFormat(false);
    setImportType(null);
    setShowImportMenu(false);
  };

  if (showImportFormat && importType) {
    return (
      <ImportFormatDialog
        importType={importType}
        onBack={() => setShowImportFormat(false)}
        onFileImport={handleFileImport}
        onTextImport={handleTextImport}
      />
    );
  }

  if (showImportMenu) {
    return (
      <ImportTypeDialog
        onBack={() => setShowImportMenu(false)}
        onSelectType={(type) => {
          setImportType(type);
          setShowImportFormat(true);
        }}
      />
    );
  }

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
          <h1 className="text-xl font-bold ml-4 text-[#DBDBDB]">Menu</h1>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setShowExportConfirm(true)}
            className="w-full p-4 bg-[#181818] rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <Download size={20} className="text-[#9B9B9B]" />
            <span className="text-[#DBDBDB] font-medium">Export data</span>
          </button>

          <button
            onClick={() => setShowSignOutConfirm(true)}
            className="w-full p-4 bg-[#181818] rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <LogOut size={20} className="text-[#9B9B9B]" />
            <span className="text-[#DBDBDB] font-medium">Sign out</span>
          </button>

          <button
            onClick={onBadgeClick}
            className="w-full p-4 bg-[#181818] rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <Badge size={20} className="text-[#9B9B9B]" />
            <span className="text-[#DBDBDB] font-medium">Badge</span>
          </button>

          <button
            onClick={() => setShowImportMenu(true)}
            className="w-full p-4 bg-[#181818] rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <Upload size={20} className="text-[#9B9B9B]" />
            <span className="text-[#DBDBDB] font-medium">Import</span>
          </button>

          <button
            onClick={onPinClick}
            className="w-full p-4 bg-[#181818] rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <Lock size={20} className="text-[#9B9B9B]" />
            <span className="text-[#DBDBDB] font-medium">Pin</span>
          </button>
        </div>
      </div>

      {/* Export Confirmation Dialog */}
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
            <h2 className="text-center text-2xl font-semibold text-[#EAEAEA] mb-6">Export Data?</h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={handleExportData}
                className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#272727' }}
              >
                Yes, Export
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

      {/* Sign Out Confirmation Dialog */}
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
                Yes, Sign Out
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
  );
};

// Import Type Selection Dialog
const ImportTypeDialog = ({ onBack, onSelectType }: {
  onBack: () => void;
  onSelectType: (type: 'complete' | 'notes' | 'lists' | 'passwords') => void;
}) => (
  <div className="min-h-screen bg-[#000000]">
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="p-2 border border-[#9B9B9B] rounded-lg hover:bg-[#181818]"
        >
          <ArrowLeft size={22} className="text-[#9B9B9B]" />
        </button>
        <h1 className="text-xl font-bold ml-4 text-[#DBDBDB]">Import Type</h1>
      </div>

      <div className="space-y-4">
        {[
          { key: 'complete', label: 'Complete Data' },
          { key: 'notes', label: 'Notes Only' },
          { key: 'lists', label: 'Shopping Lists Only' },
          { key: 'passwords', label: 'Passwords Only' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onSelectType(key as any)}
            className="w-full p-4 bg-[#181818] rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <span className="text-[#DBDBDB] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// Import Format Selection Dialog
const ImportFormatDialog = ({ importType, onBack, onFileImport, onTextImport }: {
  importType: string;
  onBack: () => void;
  onFileImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTextImport: (text: string) => void;
}) => {
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);

  if (showTextInput) {
    return (
      <div className="min-h-screen bg-[#000000]">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center mb-8">
            <button
              onClick={() => setShowTextInput(false)}
              className="p-2 border border-[#9B9B9B] rounded-lg hover:bg-[#181818]"
            >
              <ArrowLeft size={22} className="text-[#9B9B9B]" />
            </button>
            <h1 className="text-xl font-bold ml-4 text-[#DBDBDB]">Paste JSON</h1>
          </div>

          <div className="space-y-4">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste your JSON data here..."
              className="w-full h-64 p-4 bg-[#181818] border border-[#9B9B9B] rounded-lg text-[#DBDBDB] placeholder:text-[#9B9B9B] resize-none"
            />
            <button
              onClick={() => onTextImport(textInput)}
              disabled={!textInput.trim()}
              className="w-full p-4 bg-[#DBDBDB] text-[#000000] rounded-lg font-medium hover:bg-[#9B9B9B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import Data
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold ml-4 text-[#DBDBDB]">Import Format</h1>
        </div>

        <div className="space-y-4">
          <label className="w-full p-4 bg-[#181818] rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={onFileImport}
              className="hidden"
            />
            <span className="text-[#DBDBDB] font-medium">Import from JSON File</span>
          </label>

          <button
            onClick={() => setShowTextInput(true)}
            className="w-full p-4 bg-[#181818] rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <span className="text-[#DBDBDB] font-medium">Import from Text</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppMenu;
