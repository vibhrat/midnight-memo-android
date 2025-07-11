
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { CasualNote, ShoppingList, Password } from '@/types';

interface AppData {
  notes: CasualNote[];
  lists: ShoppingList[];
  passwords: Password[];
  lastUpdated: string;
}

export const useLocalFileSystem = () => {
  const [data, setData] = useState<AppData>({
    notes: [],
    lists: [],
    passwords: [],
    lastUpdated: new Date().toISOString()
  });

  // Load data from file on app start
  useEffect(() => {
    loadDataFromFile();
  }, []);

  const loadDataFromFile = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        // On native platform, we'll use Capacitor Filesystem
        const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
        
        try {
          const result = await Filesystem.readFile({
            path: 'CipherVault/data.json',
            directory: Directory.Documents,
            encoding: Encoding.UTF8
          });
          
          const fileData = JSON.parse(result.data as string) as AppData;
          setData(fileData);
        } catch (error) {
          console.log('No existing data file found, starting fresh');
          // Create initial file
          await saveDataToFile({
            notes: [],
            lists: [],
            passwords: [],
            lastUpdated: new Date().toISOString()
          });
        }
      } else {
        // Fallback to localStorage for web
        const storedData = localStorage.getItem('cipher-vault-data');
        if (storedData) {
          setData(JSON.parse(storedData));
        }
      }
    } catch (error) {
      console.error('Error loading data from file:', error);
    }
  };

  const saveDataToFile = async (newData: AppData) => {
    try {
      const dataToSave = { ...newData, lastUpdated: new Date().toISOString() };
      
      if (Capacitor.isNativePlatform()) {
        const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
        
        // Create directory if it doesn't exist
        try {
          await Filesystem.mkdir({
            path: 'CipherVault',
            directory: Directory.Documents,
            recursive: true
          });
        } catch (error) {
          // Directory might already exist
        }
        
        await Filesystem.writeFile({
          path: 'CipherVault/data.json',
          data: JSON.stringify(dataToSave, null, 2),
          directory: Directory.Documents,
          encoding: Encoding.UTF8
        });
      } else {
        // Fallback to localStorage for web
        localStorage.setItem('cipher-vault-data', JSON.stringify(dataToSave));
      }
      
      setData(dataToSave);
    } catch (error) {
      console.error('Error saving data to file:', error);
    }
  };

  return {
    data,
    saveData: saveDataToFile,
    loadData: loadDataFromFile
  };
};
