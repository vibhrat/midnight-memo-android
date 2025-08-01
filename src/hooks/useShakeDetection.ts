
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

  useEffect(() => {
    let motionListener: any;

    const initializeMotionDetection = async () => {
      if (!Capacitor.isNativePlatform()) {
        console.log('Motion detection only available on native platforms');
        return;
      }

      try {
        const { Motion } = await import('@capacitor/motion');
        
        motionListener = await Motion.addListener('accel', (event) => {
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
            onShake();
          }
        });
        
      } catch (error) {
        console.error('Failed to initialize motion detection:', error);
      }
    };

    initializeMotionDetection();

    return () => {
      const cleanup = async () => {
        if (motionListener) {
          motionListener.remove();
        }
      };
      cleanup();
    };
  }, [onShake, threshold, debounceTime]);
};
