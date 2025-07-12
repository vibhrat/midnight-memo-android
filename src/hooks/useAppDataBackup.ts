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
        lastBackup: new Date().toISOString()
      };

      const jsonData = JSON.stringify(appData, null, 2);

      // Create cipher-vault folder and save data
      await Filesystem.writeFile({
        path: 'cipher-vault/app-data.json',
        data: jsonData,
        directory: Directory.Documents,
        recursive: true
      });

      console.log('App data backed up successfully');
    } catch (error) {
      console.error('Failed to backup app data:', error);
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