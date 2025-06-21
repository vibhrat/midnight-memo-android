
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PinProtectionProps {
  onUnlock: () => void;
}

const PinProtection = ({ onUnlock }: PinProtectionProps) => {
  const [storedPin, setStoredPin] = useLocalStorage<string>('vault-pin', '');
  const [pin, setPin] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(!storedPin);
  const [confirmPin, setConfirmPin] = useState('');
  const { toast } = useToast();

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSettingPin) {
      if (pin.length < 4) {
        toast({
          title: "Error",
          description: "PIN must be at least 4 digits",
          variant: "destructive",
        });
        return;
      }
      
      if (pin !== confirmPin) {
        toast({
          title: "Error",
          description: "PINs do not match",
          variant: "destructive",
        });
        return;
      }
      
      setStoredPin(pin);
      toast({
        title: "Success",
        description: "PIN set successfully!",
      });
      onUnlock();
    } else {
      if (pin === storedPin) {
        onUnlock();
      } else {
        toast({
          title: "Error",
          description: "Incorrect PIN",
          variant: "destructive",
        });
        setPin('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAF5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSettingPin ? 'Set PIN' : 'Enter PIN'}
          </h1>
          <p className="text-gray-600">
            {isSettingPin 
              ? 'Create a PIN to secure your vault' 
              : 'Enter your PIN to access the vault'
            }
          </p>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder={isSettingPin ? "Enter new PIN" : "Enter PIN"}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg text-center text-2xl tracking-widest"
              maxLength={6}
              required
            />
          </div>
          
          {isSettingPin && (
            <div>
              <input
                type="password"
                placeholder="Confirm PIN"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg text-center text-2xl tracking-widest"
                maxLength={6}
                required
              />
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white h-12"
          >
            {isSettingPin ? 'Set PIN' : 'Unlock'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PinProtection;
