
import { useState } from 'react';
import { useBiometricAuth } from '@/contexts/BiometricAuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { Fingerprint, KeyRound } from 'lucide-react';

interface BiometricLoginProps {
  onSuccess: () => void;
}

const BiometricLogin = ({ onSuccess }: BiometricLoginProps) => {
  const { biometricEnabled, authenticate } = useBiometricAuth();
  const [pin, setPin] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);
  const [savedPin] = useLocalStorage('app-pin', '');
  const { toast } = useToast();

  const handleBiometricAuth = async () => {
    const success = await authenticate();
    if (success) {
      onSuccess();
    } else {
      toast({
        title: "Authentication Failed",
        description: "Please try using PIN instead",
        variant: "destructive",
      });
      setShowPinInput(true);
    }
  };

  const handlePinAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!savedPin) {
      toast({
        title: "No PIN Set",
        description: "Please set a PIN in the app settings",
        variant: "destructive"
      });
      return;
    }

    if (pin === savedPin) {
      onSuccess();
    } else {
      toast({
        title: "Incorrect PIN",
        description: "Please try again",
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
              <defs>
                <linearGradient id="paint0_linear_4433_66" x1="60.383" y1="9.74463" x2="60.383" y2="97.9148" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3E576B"/>
                  <stop offset="1" stopColor="#BA6C6C"/>
                </linearGradient>
                <linearGradient id="paint1_linear_4433_66" x1="91.9349" y1="60.2692" x2="62.1554" y2="59.5885" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3E576B"/>
                  <stop offset="1" stopColor="#BA6C6C"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#DBDBDB] mb-2">Secure Access</h1>
          <p className="text-[#9B9B9B] text-sm">Authenticate to continue</p>
        </div>
        
        {!showPinInput ? (
          <div className="space-y-6">
            {biometricEnabled && (
              <button
                onClick={handleBiometricAuth}
                className="w-full bg-[#DBDBDB] text-[#000000] py-4 rounded-lg font-medium hover:bg-[#9B9B9B] transition-colors flex items-center justify-center gap-3"
              >
                <Fingerprint size={24} />
                Use Biometric
              </button>
            )}
            
            <button
              onClick={() => setShowPinInput(true)}
              className="w-full bg-[#181818] text-[#DBDBDB] py-4 rounded-lg font-medium hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-3 border border-[#9B9B9B]"
            >
              <KeyRound size={20} />
              Use PIN
            </button>
          </div>
        ) : (
          <form onSubmit={handlePinAuth} className="space-y-6">
            <div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-transparent border-0 border-b-2 border-[#9B9B9B] pb-2 text-lg text-center focus:outline-none focus:border-purple-600 transition-colors text-[#DBDBDB]"
                placeholder="Enter PIN"
                autoFocus
              />
            </div>
            
            <div className="space-y-3">
              {pin && (
                <button
                  type="submit"
                  className="w-full bg-[#DBDBDB] text-[#000000] py-3 rounded-lg font-medium hover:bg-[#9B9B9B] transition-colors"
                >
                  Authenticate
                </button>
              )}
              
              <button
                type="button"
                onClick={() => setShowPinInput(false)}
                className="w-full text-[#9B9B9B] py-2 hover:text-[#DBDBDB] transition-colors"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BiometricLogin;
