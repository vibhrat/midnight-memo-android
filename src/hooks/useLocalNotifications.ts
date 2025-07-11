
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export const useLocalNotifications = () => {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initializeNotifications();
    }
  }, []);

  const initializeNotifications = async () => {
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      
      // Request permissions
      const permission = await LocalNotifications.requestPermissions();
      if (permission.display !== 'granted') {
        console.log('Notification permission not granted');
        return;
      }
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  };

  const scheduleReminder = async (title: string, body: string, date: Date) => {
    try {
      if (Capacitor.isNativePlatform()) {
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        
        await LocalNotifications.schedule({
          notifications: [
            {
              title,
              body,
              id: Date.now(),
              schedule: { at: date },
              sound: 'default',
              attachments: [],
              actionTypeId: '',
              extra: null
            }
          ]
        });
      } else {
        // Fallback for web - use browser notifications
        if ('Notification' in window && Notification.permission === 'granted') {
          setTimeout(() => {
            new Notification(title, { body });
          }, date.getTime() - Date.now());
        }
      }
    } catch (error) {
      console.error('Failed to schedule reminder:', error);
    }
  };

  const cancelReminder = async (id: number) => {
    try {
      if (Capacitor.isNativePlatform()) {
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        await LocalNotifications.cancel({ notifications: [{ id }] });
      }
    } catch (error) {
      console.error('Failed to cancel reminder:', error);
    }
  };

  return {
    scheduleReminder,
    cancelReminder
  };
};
