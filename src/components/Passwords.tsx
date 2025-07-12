import { useState, forwardRef, useImperativeHandle } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Password } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Search, Eye, EyeOff, Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmptyStateIllustration from './EmptyStateIllustration';
import BackgroundGrid from './BackgroundGrid';

interface PasswordsRef {
  triggerCreate: () => void;
}

interface PasswordsProps {
  onPasswordSelect?: (passwordId: string) => void;
  onSearchClick?: () => void;
}

const Passwords = forwardRef<PasswordsRef, PasswordsProps>(({ onPasswordSelect, onSearchClick }, ref) => {
  const [passwords, setPasswords] = useLocalStorage<Password[]>('passwords', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState({});
  const { toast } = useToast();

  useImperativeHandle(ref, () => ({
    triggerCreate: () => {
      // Create a new blank password and navigate to it
      const now = new Date();
      const newPassword: Password = {
        id: Date.now().toString(),
        title: '',
        username: '',
        password: '',
        url: '',
        notes: '',
        createdAt: now,
        updatedAt: now,
      };
      setPasswords([newPassword, ...passwords]);
      if (onPasswordSelect) {
        onPasswordSelect(newPassword.id);
      }
    }
  }));

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

  const togglePasswordVisibility = (id: string) => {
    setShowPassword(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
    });
  };

  const filteredPasswords = passwords.filter((password) => {
    const searchText = searchTerm.toLowerCase();
    return (
      password.title.toLowerCase().includes(searchText) ||
      password.username.toLowerCase().includes(searchText) ||
      password.url?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-[#000000] relative">
      <BackgroundGrid />
      <div className="max-w-2xl mx-auto p-4 pb-20 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-[#DBDBDB]" style={{ fontFamily: 'IBM Plex Mono' }}>Passwords</h1>
          <div className="flex gap-2">
            <button onClick={onSearchClick} className="p-2 hover:bg-[#181818] rounded-lg">
              <Search size={20} className="text-[#9B9B9B]" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPasswords.map((password) => (
            <Card
              key={password.id}
              className="cursor-pointer hover:bg-[#2A2A2A] transition-colors bg-[#181818] border-0 rounded-lg"
              onClick={() => handleCardClick(password.id)}
            >
              <CardContent className="p-4 py-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[#F2CB2F]"></div>
                      <h3 className="text-base font-bold text-[#DBDBDB]">{password.title || 'Untitled Password'}</h3>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-sm font-medium text-[#9B9B9B]">
                        <Clock className="w-3 h-3" />
                        <span>{getDaysAgo(password.createdAt)}d</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(password.password);
                        }} className="hover:bg-[#2A2A2A] p-1 rounded">
                          <Copy className="w-4 h-4 text-[#9B9B9B]" />
                        </button>
                        <button onClick={(e) => {
                          e.stopPropagation();
                          togglePasswordVisibility(password.id);
                        }} className="hover:bg-[#2A2A2A] p-1 rounded">
                          {showPassword[password.id] ? (
                            <EyeOff className="w-4 h-4 text-[#9B9B9B]" />
                          ) : (
                            <Eye className="w-4 h-4 text-[#9B9B9B]" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {passwords.length === 0 && (
            <EmptyStateIllustration />
          )}
        </div>
      </div>
    </div>
  );
});

Passwords.displayName = 'Passwords';

export default Passwords;
