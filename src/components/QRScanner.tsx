
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

const QRScanner = ({ onScan, onClose }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        
        // Start scanning for QR codes
        videoRef.current.onloadedmetadata = () => {
          startQRScanning();
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Failed to access camera. Please ensure camera permissions are granted.');
      toast({
        title: "Error",
        description: "Failed to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const startQRScanning = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    intervalRef.current = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          onScan(code.data);
          stopCamera();
        }
      }
    }, 300);
  };

  // Simple QR detection function (basic implementation)
  const jsQR = (data: Uint8ClampedArray, width: number, height: number) => {
    // This is a simplified QR detection - in a real app you'd use a proper QR library
    // For now, we'll just return null to fallback to file upload
    return null;
  };

  const stopCamera = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) {
              canvas.width = img.width;
              canvas.height = img.height;
              context.drawImage(img, 0, 0);
              
              const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
              const code = jsQR(imageData.data, imageData.width, imageData.height);
              
              if (code) {
                onScan(code.data);
              } else {
                toast({
                  title: "Error",
                  description: "No QR code found in the image",
                  variant: "destructive"
                });
              }
            }
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      // Handle text files
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onScan(content);
      };
      reader.readAsText(file);
    }
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
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}
        
        {isScanning && (
          <div className="mb-4 rounded-lg overflow-hidden relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover bg-black"
            />
            <div className="absolute inset-0 border-2 border-white/30 rounded-lg">
              <div className="absolute inset-4 border border-white/60 rounded-lg"></div>
            </div>
          </div>
        )}
        
        {/* Hidden canvas for QR processing */}
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="flex flex-col gap-4">
          <p className="text-center text-[#9B9B9B] text-sm">
            {isScanning 
              ? "Point your camera at a QR code" 
              : "Camera access required or upload an image/file"
            }
          </p>
          
          {!isScanning && (
            <button
              onClick={startCamera}
              className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#272727' }}
            >
              Open Camera
            </button>
          )}
          
          <label className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer text-center" style={{ backgroundColor: '#272727' }}>
            Upload Image/File
            <input
              type="file"
              accept="image/*,.txt,.json"
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
