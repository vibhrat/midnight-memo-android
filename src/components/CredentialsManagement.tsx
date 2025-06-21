
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

interface CredentialsManagementProps {
  onBack: () => void;
}

const CredentialsManagement = ({ onBack }: CredentialsManagementProps) => {
  const [storedPin, setStoredPin] = useLocalStorage<string>('vault-pin', '');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
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

  return (
    <div className="min-h-screen bg-[#FBFAF5]">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-xl font-bold ml-4">Manage Credentials</h1>
        </div>

        <div className="bg-white p-6 rounded-lg" style={{ boxShadow: '0px 1px 4px 0px #E8E7E3' }}>
          <h2 className="text-lg font-bold mb-4">Change Vault PIN</h2>
          
          <form onSubmit={handleChangePIN} className="space-y-4">
            {storedPin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current PIN
                </label>
                <input
                  type="password"
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                  placeholder="Enter current PIN"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New PIN
              </label>
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                placeholder="Enter new PIN"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New PIN
              </label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                placeholder="Confirm new PIN"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white"
            >
              Update PIN
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CredentialsManagement;
