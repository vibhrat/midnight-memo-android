
import { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import jsQR from 'jsqr';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  onResult: (result: string) => void;
  onClose: () => void;
}

const QRScanner = ({ onResult, onClose }: QRScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const scanIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();

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

  const processQRData = (qrData: string) => {
    console.log('Processing QR data:', qrData);
    
    // Check for our specific cipher prefixes
    if (qrData.startsWith('CIPHER_NOTE:') || 
        qrData.startsWith('CIPHER_LIST:') || 
        qrData.startsWith('CIPHER_PASSWORD:')) {
      
      console.log('Valid cipher QR code detected');
      setIsScanning(false);
      cleanup();
      
      toast({
        title: "Success",
        description: "QR code detected successfully!",
      });
      
      // Process the result
      setTimeout(() => {
        onResult(qrData);
      }, 500);
      
      return true;
    }
    
    // Check for JSON data that might be valid
    try {
      const parsed = JSON.parse(qrData);
      if (parsed && typeof parsed === 'object' && 
          (parsed.title !== undefined || parsed.content !== undefined || 
           parsed.items !== undefined || parsed.password !== undefined)) {
        
        console.log('Valid JSON QR code detected');
        setIsScanning(false);
        cleanup();
        
        toast({
          title: "Success",
          description: "QR code detected successfully!",
        });
        
        setTimeout(() => {
          onResult(qrData);
        }, 500);
        
        return true;
      }
    } catch (e) {
      // Not valid JSON, continue
    }
    
    return false;
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

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (qrCode && qrCode.data) {
        console.log('QR Code detected:', qrCode.data);
        
        const processed = processQRData(qrCode.data);
        if (!processed) {
          toast({
            title: "Invalid QR Code",
            description: "This QR code is not compatible with this app",
            variant: "destructive",
          });
        }
      }
    }, 200);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

        if (qrCode && qrCode.data) {
          console.log('QR Code from image:', qrCode.data);
          
          const processed = processQRData(qrCode.data);
          if (!processed) {
            toast({
              title: "Invalid QR Code",
              description: "This QR code is not compatible with this app",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "No QR Code Found",
            description: "No valid QR code found in the image",
            variant: "destructive",
          });
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
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
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Upload Image Instead
              </button>
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
            
            {/* Large scanning frame */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div 
                  className="border-2 border-white/80 rounded-2xl relative overflow-hidden"
                  style={{ width: '420px', height: '420px' }}
                >
                  {/* Corner indicators */}
                  <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-blue-400 rounded-tl-lg"></div>
                  <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-blue-400 rounded-tr-lg"></div>
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-blue-400 rounded-bl-lg"></div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-blue-400 rounded-br-lg"></div>
                  
                  {/* Scanning line animation */}
                  {isScanning && (
                    <div className="absolute inset-0">
                      <div 
                        className="w-full h-0.5 bg-blue-400 opacity-80 animate-pulse"
                        style={{
                          animation: 'scanLine 2s linear infinite'
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center space-y-4">
              <p className="text-white text-lg font-medium bg-black/50 backdrop-blur-sm px-6 py-3 rounded-xl">
                Point camera at QR code
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                Upload Image
              </button>
            </div>
          </>
        )}
      </div>

      {/* Hidden file input for upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* CSS for scan line animation */}
      <style>
        {`
          @keyframes scanLine {
            0% { 
              transform: translateY(0);
              opacity: 1;
            }
            50% {
              opacity: 0.6;
            }
            100% { 
              transform: translateY(416px);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default QRScanner;
