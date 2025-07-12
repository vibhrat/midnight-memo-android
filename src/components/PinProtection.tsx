
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

interface PinProtectionProps {
  onUnlock: () => void;
}

const PinProtection = ({ onUnlock }: PinProtectionProps) => {
  const [pin, setPin] = useState('');
  const [savedPin] = useLocalStorage('app-pin', '');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!savedPin) {
      toast({
        title: "Error",
        description: "No PIN has been set. Please set a PIN in settings first.",
        variant: "destructive"
      });
      return;
    }

    if (pin === savedPin) {
      onUnlock();
    } else {
      toast({
        title: "Error", 
        description: "Incorrect PIN. Please try again.",
        variant: "destructive"
      });
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col p-4" style={{ marginTop: '200px' }}>
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="57" height="57" viewBox="0 0 57 57" fill="none">
              <path d="M28 7L33.4018 21.5982L48 27L33.4018 32.4018L28 47L22.5982 32.4018L8 27L22.5982 21.5982L28 7Z" fill="url(#paint0_linear_14364_49)"/>
              <g filter="url(#filter0_d_14364_49)">
                <path d="M14.778 13.4763L28.6059 20.6231L43.0323 14.778L35.8855 28.6059L41.7306 43.0323L27.9027 35.8855L13.4763 41.7306L20.6231 27.9027L14.778 13.4763Z" fill="url(#paint1_linear_14364_49)"/>
              </g>
              <defs>
                <filter id="filter0_d_14364_49" x="9.47607" y="13.4763" width="37.5562" height="37.5559" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="4"/>
                  <feGaussianBlur stdDeviation="2"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_14364_49"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_14364_49" result="shape"/>
                </filter>
                <linearGradient id="paint0_linear_14364_49" x1="28" y1="7" x2="28" y2="47" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#424242"/>
                  <stop offset="0.485135" stopColor="#9B9B9B"/>
                  <stop offset="1" stopColor="#3D3D3D"/>
                </linearGradient>
                <linearGradient id="paint1_linear_14364_49" x1="14.778" y1="13.4763" x2="41.7306" y2="43.0323" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#424242"/>
                  <stop offset="0.485135" stopColor="#9B9B9B"/>
                  <stop offset="1" stopColor="#3D3D3D"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="text-[#9B9B9B] text-sm">Authenticate</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-[#9B9B9B] pb-2 text-lg text-center focus:outline-none focus:border-purple-600 transition-colors text-[#DBDBDB]"
              autoFocus
            />
          </div>
          
          {pin && (
            <button
              type="submit"
              className="w-full bg-transparent border border-[#DBDBDB] text-[#DBDBDB] py-3 rounded-lg font-medium hover:bg-[#181818] transition-colors text-base"
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default PinProtection;
