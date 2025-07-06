
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
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/26774bb1-bc3f-4a92-b07f-d342de25dc8c.png" 
              alt="Cipher" 
              className="w-[100px] h-[100px] object-contain"
            />
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
