
import { useState } from 'react';
import { ArrowLeft, Download, Upload, LogOut, Lock, Award } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SettingsProps {
  onBack: () => void;
  onCredentialsClick?: () => void;
  onBadgeClick?: () => void;
}

const Settings = ({ onBack, onCredentialsClick, onBadgeClick }: SettingsProps) => {
  const [notes] = useLocalStorage('casual-notes', []);
  const [lists] = useLocalStorage('shopping-lists', []);
  const [passwords] = useLocalStorage('passwords', []);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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
    
    setShowExportDialog(false);
    toast({
      title: "Success",
      description: "Data exported successfully!",
    });
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
            
            toast({
              title: "Success",
              description: "Data imported successfully! Please refresh the page.",
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "Invalid JSON file. Please check your backup file.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
    setShowImportDialog(false);
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
    setShowLogoutDialog(false);
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col">
      <div className="max-w-2xl mx-auto p-4 flex-1 flex flex-col">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="p-2 border border-[#9B9B9B] rounded-lg hover:bg-[#181818]"
          >
            <ArrowLeft size={22} className="text-[#9B9B9B]" />
          </button>
        </div>

        {/* Full-width buttons */}
        <div className="space-y-4 mb-8">
          <button
            onClick={() => setShowExportDialog(true)}
            className="w-full bg-[#181818] border border-[#9B9B9B] text-[#DBDBDB] p-4 rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <Download size={20} />
            <span className="text-left">Export Data</span>
          </button>
          
          <button
            onClick={() => setShowImportDialog(true)}
            className="w-full bg-[#181818] border border-[#9B9B9B] text-[#DBDBDB] p-4 rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <Upload size={20} />
            <span className="text-left">Import Data</span>
          </button>

          <button
            onClick={onCredentialsClick}
            className="w-full bg-[#181818] border border-[#9B9B9B] text-[#DBDBDB] p-4 rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <Lock size={20} />
            <span className="text-left">Manage Credentials</span>
          </button>

          <button
            onClick={onBadgeClick}
            className="w-full bg-[#181818] border border-[#9B9B9B] text-[#DBDBDB] p-4 rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <Award size={20} />
            <span className="text-left">Badge</span>
          </button>

          {user && (
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="w-full bg-[#181818] border border-[#9B9B9B] text-[#DBDBDB] p-4 rounded-lg flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
            >
              <LogOut size={20} />
              <span className="text-left">Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer with user email */}
      {user && (
        <div className="flex items-center justify-center gap-2 pb-6">
          <Lock size={12} className="text-[#9B9B9B]" />
          <p className="text-xs text-[#9B9B9B]">{user.email}</p>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-md bg-[#181818] border-[#9B9B9B] p-8">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-[#DBDBDB]">Export Data</DialogTitle>
            <DialogDescription className="text-[#9B9B9B]">
              This will download all your notes, lists, and passwords as a JSON file.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-6 pt-6">
            <Button variant="outline" onClick={() => setShowExportDialog(false)} className="flex-1 py-4 text-lg border-[#9B9B9B] text-[#DBDBDB] hover:bg-[#000000] bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleBackup} className="bg-[#DBDBDB] hover:bg-[#9B9B9B] text-[#000000] flex-1 py-4 text-lg">
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-md bg-[#181818] border-[#9B9B9B] p-8">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-[#DBDBDB]">Import Data</DialogTitle>
            <DialogDescription className="text-[#9B9B9B]">
              This will replace all your current data with the imported data. Make sure you have a backup first.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-6 pt-6">
            <Button variant="outline" onClick={() => setShowImportDialog(false)} className="flex-1 py-4 text-lg border-[#9B9B9B] text-[#DBDBDB] hover:bg-[#000000] bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleImport} className="bg-[#DBDBDB] hover:bg-[#9B9B9B] text-[#000000] flex-1 py-4 text-lg">
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="max-w-md bg-[#181818] border-[#9B9B9B] p-8">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-[#DBDBDB]">Sign Out</DialogTitle>
            <DialogDescription className="text-[#9B9B9B]">
              Are you sure you want to sign out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-6 pt-6">
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)} className="flex-1 py-4 text-lg border-[#9B9B9B] text-[#DBDBDB] hover:bg-[#000000] bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSignOut} className="bg-[#DBDBDB] hover:bg-[#9B9B9B] text-[#000000] flex-1 py-4 text-lg">
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
