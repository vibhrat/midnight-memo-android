import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Upload, LogOut, Lock } from 'lucide-react';
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
}

const Settings = ({ onBack, onCredentialsClick }: SettingsProps) => {
  const [notes] = useLocalStorage('casual-notes', []);
  const [lists] = useLocalStorage('shopping-lists', []);
  const [passwords] = useLocalStorage('passwords', []);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [gyroSupported, setGyroSupported] = useState(false);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  // Check for gyroscope support and setup listeners
  useEffect(() => {
    const checkGyroSupport = () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEvent.requestPermission) {
        // iOS 13+ requires permission
        DeviceOrientationEvent.requestPermission()
          .then(response => {
            if (response === 'granted') {
              setGyroSupported(true);
              setupGyroListener();
            }
          })
          .catch(console.error);
      } else if (typeof DeviceOrientationEvent !== 'undefined') {
        // Android and older iOS
        setGyroSupported(true);
        setupGyroListener();
      }
    };

    const setupGyroListener = () => {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        // Limit tilt range and smooth the values
        const maxTilt = 15; // Maximum tilt in degrees
        const smoothingFactor = 0.1;
        
        const newTiltX = Math.max(-maxTilt, Math.min(maxTilt, (event.beta || 0) * smoothingFactor));
        const newTiltY = Math.max(-maxTilt, Math.min(maxTilt, (event.gamma || 0) * smoothingFactor));
        
        setTiltX(newTiltX);
        setTiltY(newTiltY);
      };

      window.addEventListener('deviceorientation', handleOrientation);
      
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    };

    checkGyroSupport();
  }, []);

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
    <div className="min-h-screen bg-[#FBFAF5] flex flex-col">
      <div className="max-w-2xl mx-auto p-4 flex-1 flex flex-col">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft size={22} />
          </button>
        </div>

        {/* Image container with gyroscope tilt effect */}
        <div className="mb-8 mx-4 relative">
          <img 
            src="/lovable-uploads/0e66d0a5-0c78-4057-ae0a-31ac7f762df9.png" 
            alt="Settings Banner" 
            className="w-full h-auto object-cover rounded-xl transition-transform duration-100 ease-out"
            loading="eager"
            decoding="sync"
            style={{
              transform: gyroSupported 
                ? `perspective(1000px) rotateX(${tiltX}deg) rotateY(${-tiltY}deg)`
                : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
            }}
            onMouseMove={!gyroSupported ? (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const rotateX = (y - centerY) / 2000;
              const rotateY = (centerX - x) / 2000;
              
              e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            } : undefined}
            onMouseLeave={!gyroSupported ? (e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            } : undefined}
            onTouchMove={!gyroSupported ? (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.touches[0].clientX - rect.left;
              const y = e.touches[0].clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const rotateX = (y - centerY) / 2000;
              const rotateY = (centerX - x) / 2000;
              
              e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            } : undefined}
            onTouchEnd={!gyroSupported ? (e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            } : undefined}
          />
        </div>

        {/* Circular action buttons - 4 buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setShowExportDialog(true)}
            className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            title="Export Data"
          >
            <Download size={24} />
          </button>
          
          <button
            onClick={() => setShowImportDialog(true)}
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
              onClick={() => setShowLogoutDialog(true)}
              className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              title="Sign Out"
            >
              <LogOut size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Footer with user email */}
      {user && (
        <div className="flex items-center justify-center gap-2 pb-6">
          <Lock size={12} className="text-gray-500" />
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-md bg-white border-gray-200 p-8">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-black">Export Data</DialogTitle>
            <DialogDescription className="text-gray-600">
              This will download all your notes, lists, and passwords as a JSON file.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-6 pt-6">
            <Button variant="outline" onClick={() => setShowExportDialog(false)} className="flex-1 py-4 text-lg border-gray-300 text-black hover:bg-gray-100">
              Cancel
            </Button>
            <Button onClick={handleBackup} className="bg-black hover:bg-gray-800 flex-1 py-4 text-lg">
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-md bg-white border-gray-200 p-8">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-black">Import Data</DialogTitle>
            <DialogDescription className="text-gray-600">
              This will replace all your current data with the imported data. Make sure you have a backup first.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-6 pt-6">
            <Button variant="outline" onClick={() => setShowImportDialog(false)} className="flex-1 py-4 text-lg border-gray-300 text-black hover:bg-gray-100">
              Cancel
            </Button>
            <Button onClick={handleImport} className="bg-black hover:bg-gray-800 flex-1 py-4 text-lg">
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="max-w-md bg-white border-gray-200 p-8">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-black">Sign Out</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to sign out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-6 pt-6">
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)} className="flex-1 py-4 text-lg border-gray-300 text-black hover:bg-gray-100">
              Cancel
            </Button>
            <Button onClick={handleSignOut} className="bg-black hover:bg-gray-800 flex-1 py-4 text-lg">
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
