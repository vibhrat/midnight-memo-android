
import { ArrowLeft, Download, Upload, LogOut, Lock } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SettingsProps {
  onBack: () => void;
  onCredentialsClick?: () => void;
}

const Settings = ({ onBack, onCredentialsClick }: SettingsProps) => {
  const [notes] = useLocalStorage('casual-notes', []);
  const [lists] = useLocalStorage('shopping-lists', []);
  const [passwords] = useLocalStorage('passwords', []);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleBackup = () => {
    const appData = {
      notes,
      lists,
      passwords,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(appData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `app-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            
            if (data.notes) {
              localStorage.setItem('casual-notes', JSON.stringify(data.notes));
            }
            if (data.lists) {
              localStorage.setItem('shopping-lists', JSON.stringify(data.lists));
            }
            if (data.passwords) {
              localStorage.setItem('passwords', JSON.stringify(data.passwords));
            }
            
            alert('Data imported successfully! Please refresh the page.');
          } catch (error) {
            alert('Invalid JSON file. Please check your backup file.');
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
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
  };

  return (
    <div className="min-h-screen bg-[#FBFAF5] dark:bg-gray-900">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={22} className="dark:text-white" />
          </button>
        </div>

        {/* Full width image with 5% margins */}
        <div className="mb-8" style={{ marginLeft: '5%', marginRight: '5%' }}>
          <img 
            src="/lovable-uploads/0e66d0a5-0c78-4057-ae0a-31ac7f762df9.png" 
            alt="Settings Banner" 
            className="w-full h-48 object-cover rounded-xl"
          />
        </div>

        {/* Circular action buttons */}
        <div className="flex justify-center gap-8 mb-8">
          <button
            onClick={handleBackup}
            className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            title="Export Data"
          >
            <Download size={24} />
          </button>
          
          <button
            onClick={handleImport}
            className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            title="Import Data"
          >
            <Upload size={24} />
          </button>

          <button
            onClick={onCredentialsClick}
            className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            title="Manage Credentials"
          >
            <Lock size={24} />
          </button>

          {user && (
            <button
              onClick={handleSignOut}
              className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              title="Sign Out"
            >
              <LogOut size={24} />
            </button>
          )}
        </div>

        {/* User info card at bottom with smaller size */}
        {user && (
          <div className="mt-auto p-3 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">Signed in as:</p>
            <p className="text-sm font-medium dark:text-white">{user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
