
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
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg width="110" height="114" viewBox="0 0 110 114" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60.383" cy="53.8297" r="41.7021" stroke="url(#paint0_linear_4433_66)" strokeWidth="4.76596"/>
              <path d="M61.5744 85.0068C67.4642 85.1415 73.2617 83.5265 78.2337 80.3663C83.2057 77.206 87.1289 72.6423 89.5073 67.2524C91.8856 61.8624 92.6122 55.8882 91.5952 50.0853C90.5782 44.2824 87.8632 38.9114 83.7937 34.6515" stroke="url(#paint1_linear_4433_66)" strokeWidth="4.76596" strokeLinecap="round"/>
              <path d="M30.5979 28.5762C30.7887 28.924 31.0753 29.2105 31.4231 29.4014L41.2004 34.7656L31.4231 40.1299C31.0752 40.3208 30.7888 40.6072 30.5979 40.9551L25.2336 50.7324L19.8694 40.9551C19.6785 40.6073 19.392 40.3207 19.0442 40.1299L9.26587 34.7656L19.0442 29.4014C19.3922 29.2105 19.6785 28.9242 19.8694 28.5762L25.2336 18.7979L30.5979 28.5762Z" fill="#131010" stroke="url(#paint2_linear_4433_66)" strokeWidth="2.97872"/>
              <path d="M56.6669 41.5989C56.7946 41.7743 56.9485 41.9291 57.1239 42.0569L61.4276 45.1907L57.1239 48.3264C56.9924 48.4222 56.8729 48.5331 56.7675 48.6565L56.6669 48.7834L53.5311 53.0872L50.3973 48.7834L50.2968 48.6565C50.1911 48.5329 50.071 48.4223 49.9393 48.3264L45.6356 45.1907L49.9393 42.0569C50.1148 41.9291 50.2695 41.7743 50.3973 41.5989L53.5311 37.2952L56.6669 41.5989Z" fill="#131010" stroke="url(#paint3_linear_4433_66)" strokeWidth="2.97872"/>
              <path d="M32.6808 2L32.6808 5.87234M32.6808 9.74468L32.6808 5.87234M32.6808 5.87234L37.1489 5.87234M32.6808 5.87234L28.2128 5.87234" stroke="url(#paint4_linear_4433_66)" strokeWidth="2.97872" strokeLinecap="round"/>
              <path d="M6.46807 12.7234L6.46807 16.5957M6.46807 20.4681L6.46807 16.5957M6.46807 16.5957L10.9362 16.5957M6.46807 16.5957L1.99999 16.5957" stroke="url(#paint5_linear_4433_66)" strokeWidth="2.97872" strokeLinecap="round"/>
              <path d="M33.5746 93.4468H87.1918C91.9624 93.447 95.8295 97.3148 95.8295 102.085V102.979H24.936V102.085C24.936 97.3146 28.8038 93.4468 33.5746 93.4468Z" fill="#131010" stroke="url(#paint6_linear_4433_66)" strokeWidth="4.17021"/>
              <path d="M22.2555 102.383H98.5104C103.281 102.383 107.149 106.251 107.149 111.021V111.915H13.6168V111.021C13.6168 106.251 17.4847 102.383 22.2555 102.383Z" fill="#131010" stroke="url(#paint7_linear_4433_66)" strokeWidth="4.17021"/>
              <defs>
                <linearGradient id="paint0_linear_4433_66" x1="60.383" y1="9.74463" x2="60.383" y2="97.9148" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3E576B"/>
                  <stop offset="1" stopColor="#BA6C6C"/>
                </linearGradient>
                <linearGradient id="paint1_linear_4433_66" x1="91.9349" y1="60.2692" x2="62.1554" y2="59.5885" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3E576B"/>
                  <stop offset="1" stopColor="#BA6C6C"/>
                </linearGradient>
                <linearGradient id="paint2_linear_4433_66" x1="25.234" y1="15.7021" x2="25.234" y2="53.8298" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3E576B"/>
                  <stop offset="1" stopColor="#BA6C6C"/>
                </linearGradient>
                <linearGradient id="paint3_linear_4433_66" x1="53.5319" y1="34.7659" x2="53.5319" y2="55.6169" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3E576B"/>
                  <stop offset="1" stopColor="#BA6C6C"/>
                </linearGradient>
                <linearGradient id="paint4_linear_4433_66" x1="37.1489" y1="5.87234" x2="28.2128" y2="5.87234" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3E576B"/>
                  <stop offset="1" stopColor="#BA6C6C"/>
                </linearGradient>
                <linearGradient id="paint5_linear_4433_66" x1="10.9362" y1="16.5957" x2="1.99999" y2="16.5957" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3E576B"/>
                  <stop offset="1" stopColor="#BA6C6C"/>
                </linearGradient>
                <linearGradient id="paint6_linear_4433_66" x1="60.3829" y1="91.3618" x2="60.3829" y2="105.064" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3E576B"/>
                  <stop offset="1" stopColor="#BA6C6C"/>
                </linearGradient>
                <linearGradient id="paint7_linear_4433_66" x1="60.3829" y1="100.298" x2="60.3829" y2="114" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3E576B"/>
                  <stop offset="1" stopColor="#BA6C6C"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#DBDBDB] mb-2">State the cipher</h1>
          <p className="text-[#9B9B9B] text-sm">A memory from other side</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-transparent border-0 border-b-2 border-[#9B9B9B] pb-2 text-lg text-center focus:outline-none focus:border-purple-600 transition-colors text-[#DBDBDB]"
              autoFocus
            />
          </div>
          
          {pin && (
            <button
              type="submit"
              className="w-full bg-[#DBDBDB] text-[#000000] py-3 rounded-lg font-medium hover:bg-[#9B9B9B] transition-colors text-base"
            >
              Engage
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default PinProtection;
