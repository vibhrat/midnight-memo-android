
import { useState } from 'react';
import { useBiometricAuth } from '@/contexts/BiometricAuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

interface BiometricLoginProps {
  onSuccess: () => void;
}

const BiometricLogin = ({ onSuccess }: BiometricLoginProps) => {
  const { biometricEnabled, authenticate } = useBiometricAuth();
  const [pin, setPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [savedPin, setSavedPin] = useLocalStorage('app-pin', '');
  const [isSettingUp, setIsSettingUp] = useState(!savedPin);
  const { toast } = useToast();

  const handlePinSetup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPin.length < 4) {
      toast({
        title: "PIN too short",
        description: "PIN must be at least 4 digits",
        variant: "destructive"
      });
      return;
    }

    if (newPin !== confirmPin) {
      toast({
        title: "PINs don't match",
        description: "Please make sure both PINs are the same",
        variant: "destructive"
      });
      return;
    }

    setSavedPin(newPin);
    setIsSettingUp(false);
    toast({
      title: "PIN Set Successfully",
      description: "You can now use your PIN to authenticate",
    });
    onSuccess();
  };

  const handlePinAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
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
          <div className="flex justify-center mb-6">
            <svg width="80" height="80" viewBox="0 0 110 114" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <p className="text-[#DBDBDB] text-lg">Authenticate</p>
        </div>
        
        {isSettingUp ? (
          <form onSubmit={handlePinSetup} className="space-y-6">
            <div>
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full bg-transparent border-0 border-b-2 border-[#9B9B9B] pb-2 text-lg text-center focus:outline-none focus:border-[#DBDBDB] transition-colors text-[#DBDBDB]"
                placeholder="Set your PIN"
                autoFocus
              />
            </div>
            
            <div>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="w-full bg-transparent border-0 border-b-2 border-[#9B9B9B] pb-2 text-lg text-center focus:outline-none focus:border-[#DBDBDB] transition-colors text-[#DBDBDB]"
                placeholder="Confirm your PIN"
              />
            </div>
            
            {newPin && confirmPin && (
              <button
                type="submit"
                className="w-full border border-[#DBDBDB] text-[#DBDBDB] py-3 rounded-lg font-medium hover:bg-[#DBDBDB] hover:text-[#000000] transition-colors"
              >
                Submit
              </button>
            )}
          </form>
        ) : (
          <form onSubmit={handlePinAuth} className="space-y-6">
            <div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-transparent border-0 border-b-2 border-[#9B9B9B] pb-2 text-lg text-center focus:outline-none focus:border-[#DBDBDB] transition-colors text-[#DBDBDB]"
                placeholder="Enter PIN"
                autoFocus
              />
            </div>
            
            {pin && (
              <button
                type="submit"
                className="w-full border border-[#DBDBDB] text-[#DBDBDB] py-3 rounded-lg font-medium hover:bg-[#DBDBDB] hover:text-[#000000] transition-colors"
              >
                Submit
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default BiometricLogin;
