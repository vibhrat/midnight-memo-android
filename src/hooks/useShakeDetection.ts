
import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';

interface UseShakeDetectionProps {
  onShake: () => void;
  threshold?: number;
  debounceTime?: number;
}

export const useShakeDetection = ({ onShake, threshold = 15, debounceTime = 1000 }: UseShakeDetectionProps) => {
  const lastShakeTime = useRef(0);
  const accelerationRef = useRef({ x: 0, y: 0, z: 0 });
  const motionListenerRef = useRef<any>(null);

  useEffect(() => {
    const initializeMotionDetection = async () => {
      if (!Capacitor.isNativePlatform()) {
        console.log('Motion detection only available on native platforms');
        return;
      }

      try {
        const { Motion } = await import('@capacitor/motion');
        
        console.log('Requesting motion permissions...');
        
        // Request permissions for motion
        try {
          // Try to access device motion (this will trigger permission request on Android)
          if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
            const permission = await (DeviceMotionEvent as any).requestPermission();
            if (permission !== 'granted') {
              console.log('Motion permission denied');
              return;
            }
          }
        } catch (permError) {
          console.log('Motion permission handling:', permError);
        }
        
        // Add listener for acceleration data
        motionListenerRef.current = await Motion.addListener('accel', (event) => {
          const { x, y, z } = event.acceleration;
          const prevAccel = accelerationRef.current;
          
          // Calculate the change in acceleration
          const deltaX = Math.abs(x - prevAccel.x);
          const deltaY = Math.abs(y - prevAccel.y);
          const deltaZ = Math.abs(z - prevAccel.z);
          
          const totalDelta = deltaX + deltaY + deltaZ;
          
          // Update reference
          accelerationRef.current = { x, y, z };
          
          // Check if shake threshold is exceeded and debounce
          const now = Date.now();
          if (totalDelta > threshold && now - lastShakeTime.current > debounceTime) {
            lastShakeTime.current = now;
            console.log('Shake detected! Delta:', totalDelta);
            onShake();
          }
        });
        
        console.log('Motion detection initialized successfully');
        
      } catch (error) {
        console.error('Failed to initialize motion detection:', error);
      }
    };

    initializeMotionDetection();

    return () => {
      const cleanup = async () => {
        if (motionListenerRef.current) {
          console.log('Removing motion listener');
          motionListenerRef.current.remove();
          motionListenerRef.current = null;
        }
      };
      cleanup();
    };
  }, [onShake, threshold, debounceTime]);
};
