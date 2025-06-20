
import { ArrowLeft, Download, Upload, LogOut } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SettingsProps {
  onBack: () => void;
}

const Settings = ({ onBack }: SettingsProps) => {
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

        {user && (
          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as:</p>
            <p className="font-medium dark:text-white">{user.email}</p>
          </div>
        )}

        <div className="space-y-6">
          <button
            onClick={handleBackup}
            className="w-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all flex items-center gap-6"
          >
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <Download size={28} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-xl font-semibold dark:text-white mb-1">Export Data</h3>
              <p className="text-gray-600 dark:text-gray-400">Download all your data as a JSON file</p>
            </div>
          </button>

          <button
            onClick={handleImport}
            className="w-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all flex items-center gap-6"
          >
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full">
              <Upload size={28} className="text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-xl font-semibold dark:text-white mb-1">Import Data</h3>
              <p className="text-gray-600 dark:text-gray-400">Restore your data from a backup file</p>
            </div>
          </button>

          {user && (
            <button
              onClick={handleSignOut}
              className="w-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all flex items-center gap-6"
            >
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full">
                <LogOut size={28} className="text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-semibold dark:text-white mb-1">Sign Out</h3>
                <p className="text-gray-600 dark:text-gray-400">Sign out of your account</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
