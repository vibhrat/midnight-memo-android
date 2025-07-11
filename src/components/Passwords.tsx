
import { useState, forwardRef, useImperativeHandle } from 'react';
import { Password } from '@/types';
import { Clock, Search } from 'lucide-react';
import PinProtection from './PinProtection';

interface PasswordsRef {
  triggerCreate: () => void;
}

interface PasswordsProps {
  onSearchClick?: () => void;
  onPasswordSelect?: (passwordId: string) => void;
  passwords: Password[];
  saveData: (data: any) => void;
}

const Passwords = forwardRef<PasswordsRef, PasswordsProps>(({ onSearchClick, onPasswordSelect, passwords, saveData }, ref) => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useImperativeHandle(ref, () => ({
    triggerCreate: () => {
      // Create a new blank password and navigate to it
      const now = new Date();
      const newPassword: Password = {
        id: Date.now().toString(),
        title: '',
        password: '',
        fields: [],
        createdAt: now,
        updatedAt: now,
      };
      
      // Update local data
      const newData = {
        notes: JSON.parse(localStorage.getItem('casual-notes') || '[]'),
        lists: JSON.parse(localStorage.getItem('shopping-lists') || '[]'),
        passwords: [newPassword, ...passwords],
        lastUpdated: new Date().toISOString()
      };
      
      saveData(newData);
      
      if (onPasswordSelect) {
        onPasswordSelect(newPassword.id);
      }
    }
  }));

  if (!isUnlocked) {
    return <PinProtection onUnlock={() => setIsUnlocked(true)} />;
  }

  const getDaysAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCardClick = (passwordId: string) => {
    if (onPasswordSelect) {
      onPasswordSelect(passwordId);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-[#DBDBDB]" style={{ fontFamily: 'IBM Plex Mono' }}>Vault</h1>
          <button onClick={onSearchClick} className="p-2 hover:bg-[#181818] rounded-lg">
            <Search size={20} className="text-[#9B9B9B]" />
          </button>
        </div>

        <div className="space-y-4">
          {passwords.map((password) => (
            <div 
              key={password.id} 
              className="p-4 bg-[#181818] rounded-lg cursor-pointer hover:bg-[#2A2A2A] transition-colors" 
              onClick={() => handleCardClick(password.id)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-[#DBDBDB]">{password.title || 'Untitled Password'}</h3>
                <div className="flex items-center gap-1 text-sm font-medium text-[#9B9B9B]">
                  <Clock className="w-3 h-3" />
                  <span>{getDaysAgo(password.createdAt)}d</span>
                </div>
              </div>
            </div>
          ))}
          {passwords.length === 0 && (
            <div className="text-center py-12 text-[#9B9B9B]">
              No passwords saved yet. Add your first password!
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Passwords.displayName = 'Passwords';

export default Passwords;
