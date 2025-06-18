
import { useState, forwardRef, useImperativeHandle } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Password } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Clock, Search } from 'lucide-react';

interface PasswordsRef {
  triggerCreate: () => void;
}

interface PasswordsProps {
  onSearchClick?: () => void;
  onPasswordSelect?: (passwordId: string) => void;
}

const Passwords = forwardRef<PasswordsRef, PasswordsProps>(({ onSearchClick, onPasswordSelect }, ref) => {
  const [passwords, setPasswords] = useLocalStorage<Password[]>('passwords', []);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    password: '',
  });

  useImperativeHandle(ref, () => ({
    triggerCreate: () => {
      setIsCreating(true);
    }
  }));

  const getDaysAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.password.trim()) return;

    const now = new Date();
    const newPassword: Password = {
      id: Date.now().toString(),
      ...formData,
      createdAt: now,
      updatedAt: now,
    };
    setPasswords([newPassword, ...passwords]);

    setFormData({ title: '', password: '' });
    setIsCreating(false);
  };

  const handleCancel = () => {
    setFormData({ title: '', password: '' });
    setIsCreating(false);
  };

  const handleCardClick = (passwordId: string) => {
    if (onPasswordSelect) {
      onPasswordSelect(passwordId);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAF5]">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#131010]" style={{ fontFamily: 'IBM Plex Mono', fontWeight: '600' }}>Vault</h1>
          <button onClick={onSearchClick} className="p-2 hover:bg-gray-100 rounded-lg">
            <Search size={20} className="text-gray-600" />
          </button>
        </div>

        {isCreating && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg" style={{ boxShadow: '0px 1px 4px 0px #E8E7E3' }}>
            <div className="space-y-4">
              <Input
                placeholder="Password title (e.g., Gmail, Facebook)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border-gray-300"
              />
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border-gray-300"
              />
              <div className="flex gap-2">
                <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                  Save
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {passwords.map((password) => (
            <div 
              key={password.id} 
              className="p-4 bg-white rounded-lg cursor-pointer hover:shadow-md transition-shadow" 
              style={{ boxShadow: '0px 1px 4px 0px #E8E7E3' }}
              onClick={() => handleCardClick(password.id)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold">{password.title}</h3>
                <div className="flex items-center gap-1 text-sm font-medium" style={{ color: '#818181' }}>
                  <Clock className="w-3 h-3" />
                  <span>{getDaysAgo(password.createdAt)}d</span>
                </div>
              </div>
            </div>
          ))}
          {passwords.length === 0 && !isCreating && (
            <div className="text-center py-12 text-gray-500">
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
