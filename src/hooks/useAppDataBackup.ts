
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

export const useAppDataBackup = () => {
  const createBackup = async () => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      // Get all app data
      const appData = {
        notes: JSON.parse(localStorage.getItem('casual-notes') || '[]'),
        lists: JSON.parse(localStorage.getItem('shopping-lists') || '[]'),
        passwords: JSON.parse(localStorage.getItem('passwords') || '[]'),
        reminders: JSON.parse(localStorage.getItem('reminders') || '{}'),
        pin: localStorage.getItem('app-pin') || '',
        lastBackup: new Date().toISOString()
      };

      const jsonData = JSON.stringify(appData, null, 2);

      // Create vertex-data folder and save data
      await Filesystem.writeFile({
        path: 'vertex-data/app-backup.json',
        data: jsonData,
        directory: Directory.ExternalStorage,
        recursive: true
      });

      console.log('App data backed up successfully to: /storage/emulated/0/vertex-data/app-backup.json');
    } catch (error) {
      console.error('Failed to backup app data:', error);
      
      // Fallback to Documents directory if ExternalStorage fails
      try {
        const appData = {
          notes: JSON.parse(localStorage.getItem('casual-notes') || '[]'),
          lists: JSON.parse(localStorage.getItem('shopping-lists') || '[]'),
          passwords: JSON.parse(localStorage.getItem('passwords') || '[]'),
          reminders: JSON.parse(localStorage.getItem('reminders') || '{}'),
          pin: localStorage.getItem('app-pin') || '',
          lastBackup: new Date().toISOString()
        };

        const jsonData = JSON.stringify(appData, null, 2);

        await Filesystem.writeFile({
          path: 'vertex-data/app-backup.json',
          data: jsonData,
          directory: Directory.Documents,
          recursive: true
        });

        console.log('App data backed up to Documents directory');
      } catch (fallbackError) {
        console.error('Fallback backup also failed:', fallbackError);
      }
    }
  };

  useEffect(() => {
    // Create initial backup
    createBackup();

    // Listen for storage changes and backup data
    const handleStorageChange = () => {
      createBackup();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for manual backup triggers
    window.addEventListener('app-data-changed', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('app-data-changed', handleStorageChange);
    };
  }, []);

  return { createBackup };
};
