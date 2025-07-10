
import { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';

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

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
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
    const scanFrame = () => {
      if (!videoRef.current || !canvasRef.current || !isScanning) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
        requestAnimationFrame(scanFrame);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Simple QR detection - looking for CIPHER_ prefix in text
      try {
        // This is a simplified approach - in a real app you'd use a QR library like jsQR
        // For now, we'll simulate QR detection
        setTimeout(() => {
          if (isScanning) {
            requestAnimationFrame(scanFrame);
          }
        }, 100);
      } catch (error) {
        if (isScanning) {
          requestAnimationFrame(scanFrame);
        }
      }
    };

    requestAnimationFrame(scanFrame);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Simple check for our cipher format
      if (result.includes('CIPHER_NOTE:') || result.includes('CIPHER_LIST:')) {
        onResult(result);
      } else {
        setError('Invalid QR code format');
      }
    };
    reader.readAsText(file);
  };

  const handleClose = () => {
    setIsScanning(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  return (
    <div className="relative">
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white"
      >
        <X size={20} />
      </button>
      
      {error ? (
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <label className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer text-center bg-[#272727]">
            Upload QR Image
            <input
              type="file"
              accept="image/*,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover rounded-lg"
            autoPlay
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg"></div>
          </div>
          <p className="text-center text-sm text-[#9B9B9B] mt-2">
            Position QR code within the frame
          </p>
          <label className="block w-full px-4 py-2 mt-4 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer text-center bg-[#272727]">
            Or upload image
            <input
              type="file"
              accept="image/*,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
