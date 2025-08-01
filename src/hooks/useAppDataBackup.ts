
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

export const useAppDataBackup = () => {
  const createBackup = async () => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      // Create app data object
      const appData = {
        notes: JSON.parse(localStorage.getItem('casual-notes') || '[]'),
        lists: JSON.parse(localStorage.getItem('shopping-lists') || '[]'),
        passwords: JSON.parse(localStorage.getItem('passwords') || '[]'),
        reminders: JSON.parse(localStorage.getItem('reminders') || '{}'),
        pin: localStorage.getItem('app-pin') || '',
        lastBackup: new Date().toISOString()
      };

      const jsonData = JSON.stringify(appData, null, 2);

      // Save to app's data directory with a fixed filename
      await Filesystem.writeFile({
        path: 'vertex-app-data.json',
        data: jsonData,
        directory: Directory.Data,
        recursive: true
      });

      console.log('App data backed up successfully to app data directory');
    } catch (error) {
      console.error('Failed to backup app data:', error);
    }
  };

  // Function to trigger backup manually
  const triggerBackup = () => {
    createBackup();
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('app-data-changed'));
  };

  useEffect(() => {
    // Create initial backup
    createBackup();

    // Listen for custom backup events
    const handleBackupTrigger = () => {
      createBackup();
    };

    window.addEventListener('app-data-changed', handleBackupTrigger);
    
    // Backup every time localStorage changes
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, [key, value]);
      if (['casual-notes', 'shopping-lists', 'passwords', 'reminders', 'app-pin'].includes(key)) {
        setTimeout(() => createBackup(), 100); // Small delay to ensure data is saved
      }
    };

    return () => {
      window.removeEventListener('app-data-changed', handleBackupTrigger);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  return { createBackup, triggerBackup };
};
