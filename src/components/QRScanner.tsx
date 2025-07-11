
import { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import jsQR from 'jsqr';

interface QRScannerProps {
  onResult: (result: string) => void;
  onClose: () => void;
}

const QRScanner = ({ onResult, onClose }: QRScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const scanIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsScanning(true);
          startScanning();
        };
      }
    } catch (err) {
      setError('Camera access denied or not available');
      console.error('Camera error:', err);
    }
  };

  const startScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    scanIntervalRef.current = window.setInterval(() => {
      if (!videoRef.current || !canvasRef.current || !isScanning) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
        return;
      }

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current frame
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data for QR scanning
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Scan for QR code using jsQR
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (qrCode && qrCode.data) {
        console.log('QR Code detected:', qrCode.data);
        
        // Check if it's our app's QR format
        if (qrCode.data.includes('CIPHER_NOTE:') || 
            qrCode.data.includes('CIPHER_LIST:') || 
            qrCode.data.includes('CIPHER_PASSWORD:')) {
          setIsScanning(false);
          cleanup();
          onResult(qrCode.data);
        }
      }
    }, 100); // Scan every 100ms for better performance
  };

  const handleClose = () => {
    setIsScanning(false);
    cleanup();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex justify-between items-center">
          <h2 className="text-white text-lg font-semibold">Scan QR Code</h2>
          <button
            onClick={handleClose}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Camera view or error */}
      <div className="w-full h-full relative">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white p-8">
              <p className="text-lg mb-6">{error}</p>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Large scanning frame - 420x420px */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Main scan frame - 420x420px */}
                <div 
                  className="border-2 border-white border-dashed rounded-2xl"
                  style={{ width: '420px', height: '420px' }}
                >
                  {/* Corner indicators */}
                  <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-blue-400 rounded-tl-lg"></div>
                  <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-blue-400 rounded-tr-lg"></div>
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-blue-400 rounded-bl-lg"></div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-blue-400 rounded-br-lg"></div>
                </div>
                
                {/* Scanning line animation */}
                {isScanning && (
                  <div className="absolute inset-2 overflow-hidden rounded-xl">
                    <div className="w-full h-0.5 bg-blue-400 animate-pulse" style={{
                      animation: 'scan 2s linear infinite'
                    }}></div>
                  </div>
                )}
              </div>
            </div>

            {/* Instruction text */}
            <div className="absolute bottom-20 left-0 right-0 text-center">
              <p className="text-white text-lg font-medium bg-black/50 backdrop-blur-sm mx-4 p-4 rounded-xl">
                Point camera at QR code
              </p>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(416px); }
        }
      `}</style>
    </div>
  );
};

export default QRScanner;
