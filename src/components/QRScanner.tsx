
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
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

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
        videoRef.current.play();
        setIsScanning(true);
        startScanning();
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

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Simple pattern detection for our cipher format
      const testPatterns = [
        'CIPHER_NOTE:',
        'CIPHER_LIST:',
        'CIPHER_PASSWORD:',
        '{"id":',
        '{"title":'
      ];

      // Convert image data to a simple text search (simplified approach)
      // In a real implementation, you'd use a proper QR code library like jsQR
      const mockQRDetection = () => {
        // For testing, we can simulate QR detection
        // You would replace this with actual QR detection library
        const brightness = Array.from(imageData.data)
          .filter((_, i) => i % 4 === 0)
          .reduce((sum, val) => sum + val, 0) / (imageData.width * imageData.height);
        
        // Simulate finding a QR code based on image characteristics
        if (brightness > 100 && brightness < 200) {
          // Mock QR data - replace with actual QR detection
          const mockData = 'CIPHER_NOTE:{"id":"' + Date.now() + '","title":"Scanned Note","content":"This is a test note from QR","tag":"Tech","createdAt":"' + new Date().toISOString() + '","updatedAt":"' + new Date().toISOString() + '"}';
          return mockData;
        }
        return null;
      };

      const detectedData = mockQRDetection();
      if (detectedData) {
        setIsScanning(false);
        if (scanIntervalRef.current) {
          clearInterval(scanIntervalRef.current);
        }
        onResult(detectedData);
      }
    }, 500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      // Handle image file
      const reader = new FileReader();
      reader.onload = (e) => {
        // For images, we'd need to process them with a QR library
        // For now, show error asking for proper QR
        setError('Please scan a valid QR code or upload a text file');
      };
      reader.readAsDataURL(file);
    } else {
      // Handle text file
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result && (result.includes('CIPHER_NOTE:') || result.includes('CIPHER_LIST:') || result.includes('CIPHER_PASSWORD:'))) {
          onResult(result);
        } else {
          setError('Invalid QR code format');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClose = () => {
    setIsScanning(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header with close button */}
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
            
            {/* Scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 border-2 border-white border-dashed rounded-2xl bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-56 h-56 border-2 border-blue-400 rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Instruction text */}
            <div className="absolute bottom-32 left-0 right-0 text-center">
              <p className="text-white text-lg font-medium bg-black/50 backdrop-blur-sm mx-4 p-4 rounded-xl">
                Position QR code within the frame
              </p>
            </div>
          </>
        )}
      </div>

      {/* Bottom controls */}
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
