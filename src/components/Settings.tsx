
import { ArrowLeft, Moon, Download, Upload } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface SettingsProps {
  onBack: () => void;
}

const Settings = ({ onBack }: SettingsProps) => {
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('dark-mode', false);
  const [notes] = useLocalStorage('casual-notes', []);
  const [lists] = useLocalStorage('shopping-lists', []);
  const [passwords] = useLocalStorage('passwords', []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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

  return (
    <div className="min-h-screen bg-[#FBFAF5] dark:bg-gray-900">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={22} className="dark:text-white" />
          </button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-64 h-64 mb-6 bg-black dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
            {/* Barcode-like design */}
            <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-300"
                  style={{
                    width: i < 5 ? '20px' : i < 8 ? '12px' : '8px',
                    height: '120px'
                  }}
                />
              ))}
            </div>
            
            <div className="absolute bottom-16 text-white text-2xl font-mono tracking-widest">
              Vibhrat
            </div>
            
            {/* Deer/antler icon */}
            <div className="absolute bottom-8 right-8">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L8 6L12 10L16 6L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M8 6L4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 6L20 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 10V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={toggleDarkMode}
            className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <Moon size={24} className="text-gray-600 dark:text-gray-300" />
            <span className="text-lg font-medium dark:text-white">Toggle Dark Mode</span>
          </button>

          <button
            onClick={handleBackup}
            className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <Download size={24} className="text-gray-600 dark:text-gray-300" />
            <span className="text-lg font-medium dark:text-white">Backup</span>
          </button>

          <button
            onClick={handleImport}
            className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <Upload size={24} className="text-gray-600 dark:text-gray-300" />
            <span className="text-lg font-medium dark:text-white">Import</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
