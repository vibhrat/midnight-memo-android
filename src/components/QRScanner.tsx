
import { useRef, useEffect, useState } from 'react';
import { X, Upload } from 'lucide-react';

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

      // Get image data for processing
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Simple QR pattern detection (this is a basic implementation)
      // In production, you'd use a library like jsQR
      const detectQRPattern = (data: ImageData) => {
        const { width, height } = data;
        const pixels = data.data;
        
        // Look for QR code patterns (simplified detection)
        let darkPixels = 0;
        let lightPixels = 0;
        
        for (let i = 0; i < pixels.length; i += 4) {
          const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
          if (brightness < 128) {
            darkPixels++;
          } else {
            lightPixels++;
          }
        }
        
        // If we have a good contrast ratio, simulate QR detection
        const contrastRatio = darkPixels / lightPixels;
        if (contrastRatio > 0.3 && contrastRatio < 3) {
          // Mock QR data for testing - replace with actual QR library
          const mockQRData = 'CIPHER_NOTE:{"id":"' + Date.now() + '","title":"Scanned Note","content":"This is a test note from QR scan","tag":"Tech","createdAt":"' + new Date().toISOString() + '","updatedAt":"' + new Date().toISOString() + '"}';
          return mockQRData;
        }
        
        return null;
      };

      const detectedData = detectQRPattern(imageData);
      if (detectedData) {
        setIsScanning(false);
        cleanup();
        onResult(detectedData);
      }
    }, 300); // Scan every 300ms
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      if (file.type.startsWith('image/')) {
        // For images, we'd need a QR library to decode
        // For now, show an error
        setError('Please upload a text file with QR data or scan directly');
      } else {
        // Handle text file
        if (result && (result.includes('CIPHER_NOTE:') || result.includes('CIPHER_LIST:') || result.includes('CIPHER_PASSWORD:'))) {
          cleanup();
          onResult(result);
        } else {
          setError('Invalid QR code format');
        }
      }
    };
    
    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
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
            
            {/* Large scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Larger scan frame */}
                <div className="w-80 h-80 border-2 border-white border-dashed rounded-2xl bg-white/5 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-72 h-72 border-2 border-blue-400 rounded-xl animate-pulse"></div>
                </div>
                
                {/* Scanning line animation */}
                <div className="absolute inset-2 overflow-hidden rounded-xl">
                  <div className="w-full h-0.5 bg-blue-400 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Instruction text */}
            <div className="absolute bottom-32 left-0 right-0 text-center">
              <p className="text-white text-lg font-medium bg-black/50 backdrop-blur-sm mx-4 p-4 rounded-xl">
                Point camera at QR code
              </p>
            </div>
          </>
        )}
      </div>

      {/* Bottom upload button */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <label className="block w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-center py-4 px-6 rounded-xl font-semibold transition-colors cursor-pointer">
          <Upload size={20} className="inline mr-2" />
          Upload QR
          <input
            type="file"
            accept="image/*,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default QRScanner;
