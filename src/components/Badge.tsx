
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface BadgeProps {
  onBack: () => void;
}

const Badge = ({ onBack }: BadgeProps) => {
  const [gyroSupported, setGyroSupported] = useState(false);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  useEffect(() => {
    const checkGyroSupport = () => {
      if (typeof DeviceOrientationEvent !== 'undefined') {
        if ('requestPermission' in DeviceOrientationEvent) {
          (DeviceOrientationEvent as any).requestPermission()
            .then((response: string) => {
              if (response === 'granted') {
                setGyroSupported(true);
                setupGyroListener();
              }
            })
            .catch(console.error);
        } else {
          setGyroSupported(true);
          setupGyroListener();
        }
      }
    };

    const setupGyroListener = () => {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        const maxTilt = 20;
        const smoothingFactor = 0.15;
        
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
          <h1 className="text-xl font-bold ml-4 text-[#DBDBDB]">Badge</h1>
        </div>

        {/* 3D Card with gyroscope tilt effect */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <img 
              src="/lovable-uploads/0e66d0a5-0c78-4057-ae0a-31ac7f762df9.png" 
              alt="Badge" 
              className="w-80 h-auto object-cover rounded-xl transition-transform duration-100 ease-out shadow-2xl"
              loading="eager"
              decoding="sync"
              style={{
                transform: gyroSupported 
                  ? `perspective(1000px) rotateX(${tiltX}deg) rotateY(${-tiltY}deg) translateZ(50px)`
                  : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(50px)',
                transformStyle: 'preserve-3d',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              }}
              onMouseMove={!gyroSupported ? (e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 1000;
                const rotateY = (centerX - x) / 1000;
                
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(50px)`;
              } : undefined}
              onMouseLeave={!gyroSupported ? (e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(50px)';
              } : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Badge;
