
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

const QRScanner = ({ onScan, onClose }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Error",
        description: "Failed to access camera",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onScan(content);
    };
    reader.readAsText(file);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(19, 16, 16, 0.60)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <div 
        className="w-full max-w-md mx-auto rounded-[32px] overflow-hidden border border-[#2F2F2F] p-6"
        style={{
          background: 'linear-gradient(180deg, rgba(47, 42, 42, 0.53) 0%, rgba(25, 25, 25, 0.48) 49.04%, #000 100%)',
        }}
      >
        <h2 className="text-center text-2xl font-semibold text-[#EAEAEA] mb-6">Scan QR Code</h2>
        
        {isScanning && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-64 object-cover"
            />
          </div>
        )}
        
        <div className="flex flex-col gap-4">
          <p className="text-center text-[#9B9B9B] text-sm">
            Point your camera at a QR code or upload an image
          </p>
          
          <label className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer text-center" style={{ backgroundColor: '#272727' }}>
            Upload QR Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          
          <button
            onClick={onClose}
            className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#191919' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
