
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useBiometricAuth } from '@/contexts/BiometricAuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Fingerprint } from 'lucide-react';

interface PinManagementProps {
  onBack: () => void;
}

const PinManagement = ({ onBack }: PinManagementProps) => {
  const [storedPin, setStoredPin] = useLocalStorage<string>('app-pin', '');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const { biometricEnabled, enableBiometric, disableBiometric } = useBiometricAuth();
  const { toast } = useToast();

  const handleChangePIN = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (storedPin && currentPin !== storedPin) {
      toast({
        title: "Error",
        description: "Current PIN is incorrect",
        variant: "destructive",
      });
      return;
    }
    
    if (newPin.length < 4) {
      toast({
        title: "Error",
        description: "PIN must be at least 4 digits",
        variant: "destructive",
      });
      return;
    }
    
    if (newPin !== confirmPin) {
      toast({
        title: "Error",
        description: "New PINs do not match",
        variant: "destructive",
      });
      return;
    }
    
    setStoredPin(newPin);
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    
    toast({
      title: "Success",
      description: "PIN updated successfully!",
    });
  };

  const handleToggleBiometric = async () => {
    if (biometricEnabled) {
      disableBiometric();
      toast({
        title: "Success",
        description: "Biometric authentication disabled",
      });
    } else {
      const success = await enableBiometric();
      if (success) {
        toast({
          title: "Success",
          description: "Biometric authentication enabled",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to enable biometric authentication",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="p-2 border border-[#9B9B9B] rounded-lg hover:bg-[#181818]"
          >
            <ArrowLeft size={22} className="text-[#9B9B9B]" />
          </button>
          <h1 className="text-xl font-bold ml-4 text-[#DBDBDB]">Security Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Biometric Settings */}
          <div className="bg-[#181818] p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4 text-[#DBDBDB] flex items-center gap-2">
              <Fingerprint size={20} />
              Biometric Authentication
            </h2>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#DBDBDB]">Use fingerprint or face unlock</p>
                <p className="text-sm text-[#9B9B9B]">Quick and secure access</p>
              </div>
              <button
                onClick={handleToggleBiometric}
                className={`w-14 h-8 rounded-full transition-colors ${
                  biometricEnabled ? 'bg-[#DBDBDB]' : 'bg-[#9B9B9B]'
                } relative`}
              >
                <div
                  className={`w-6 h-6 bg-[#000000] rounded-full transition-transform absolute top-1 ${
                    biometricEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* PIN Settings */}
          <div className="bg-[#181818] p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4 text-[#DBDBDB]">PIN Settings</h2>
            
            <form onSubmit={handleChangePIN} className="space-y-4">
              {storedPin && (
                <div>
                  <label className="block text-sm font-medium text-[#9B9B9B] mb-2">
                    Current PIN
                  </label>
                  <input
                    type="password"
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value)}
                    className="w-full h-10 px-3 border border-[#9B9B9B] rounded-lg bg-[#000000] text-[#DBDBDB] placeholder:text-[#9B9B9B]"
                    placeholder="Enter current PIN"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-[#9B9B9B] mb-2">
                  New PIN
                </label>
                <input
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full h-10 px-3 border border-[#9B9B9B] rounded-lg bg-[#000000] text-[#DBDBDB] placeholder:text-[#9B9B9B]"
                  placeholder="Enter new PIN"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#9B9B9B] mb-2">
                  Confirm New PIN
                </label>
                <input
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  className="w-full h-10 px-3 border border-[#9B9B9B] rounded-lg bg-[#000000] text-[#DBDBDB] placeholder:text-[#9B9B9B]"
                  placeholder="Confirm new PIN"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#DBDBDB] hover:bg-[#9B9B9B] text-[#000000] py-3 rounded-lg font-medium transition-colors"
              >
                Update PIN
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinManagement;
