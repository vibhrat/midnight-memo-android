
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Password } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Clock, Search } from 'lucide-react';
import PinProtection from './PinProtection';

interface PasswordsRef {
  triggerCreate: () => void;
}

interface PasswordsProps {
  onSearchClick?: () => void;
  onPasswordSelect?: (passwordId: string) => void;
}

const Passwords = forwardRef<PasswordsRef, PasswordsProps>(({ onSearchClick, onPasswordSelect }, ref) => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useImperativeHandle(ref, () => ({
    triggerCreate: () => {
      const now = new Date().toISOString();
      const newPassword: Partial<Password> = {
        title: '',
        password: '',
        created_at: now,
        updated_at: now,
      };
      createPassword(newPassword);
    }
  }));

  useEffect(() => {
    if (user && isUnlocked) {
      loadPasswords();
    }
  }, [user, isUnlocked]);

  const loadPasswords = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('passwords')
        .select(`
          *,
          password_fields (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedPasswords = data?.map(password => ({
        ...password,
        fields: password.password_fields || []
      })) || [];
      
      setPasswords(formattedPasswords);
    } catch (error) {
      console.error('Error loading passwords:', error);
      toast({
        title: "Error",
        description: "Failed to load passwords",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPassword = async (passwordData: Partial<Password>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('passwords')
        .insert([{
          ...passwordData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      const newPassword = { ...data, fields: [] };
      setPasswords(prev => [newPassword, ...prev]);
      if (onPasswordSelect) {
        onPasswordSelect(data.id);
      }
    } catch (error) {
      console.error('Error creating password:', error);
      toast({
        title: "Error",
        description: "Failed to create password",
        variant: "destructive"
      });
    }
  };

  if (!isUnlocked) {
    return <PinProtection onUnlock={() => setIsUnlocked(true)} />;
  }

  const getDaysAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCardClick = (passwordId: string) => {
    if (onPasswordSelect) {
      onPasswordSelect(passwordId);
    }
  };

  const EmptyStateIllustration = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <svg xmlns="http://www.w3.org/2000/svg" width="108" height="116" viewBox="0 0 108 116" fill="none" className="mb-6">
        <path d="M38.9805 21.1748H66.6563C89.3787 21.1748 107.799 39.5949 107.799 62.3172V84.2181H38.9805V21.1748Z" fill="#484848"/>
        <path d="M16.3623 44.034C16.3623 31.4092 26.5967 21.1748 39.2215 21.1748V21.1748C51.8463 21.1748 62.0808 31.4092 62.0808 44.034V84.2181H16.3623V44.034Z" fill="#272727"/>
        <path d="M21.6562 41.3872C21.6562 30.2242 30.7056 21.1748 41.8686 21.1748V21.1748C53.0316 21.1748 62.081 30.2242 62.081 41.3872V79.8869H21.6562V41.3872Z" fill="#111111"/>
        <rect y="79.8877" width="42.831" height="4.33122" fill="#272727"/>
        <rect x="42.8311" y="79.8877" width="19.2499" height="4.33122" fill="#484848"/>
        <rect x="73.6309" width="2.40623" height="49.5684" fill="#272727"/>
        <rect x="59.6748" y="84.2188" width="4.33122" height="31.281" fill="#272727"/>
        <rect x="76.0381" width="2.40623" height="49.5684" fill="#6E6E6E"/>
        <rect x="64.0059" y="84.2188" width="7.2187" height="31.281" fill="#484848"/>
        <path d="M78.4434 10.3468V0L93.362 5.77496L78.4434 10.3468Z" fill="#8D8D8D"/>
        <path d="M65.4502 115.499L71.2252 91.6777V115.499H65.4502Z" fill="#6E6E6E"/>
        <path d="M73.6306 25.506V49.5684H69.54L72.1869 25.506L71.465 24.3029L70.5025 23.3404L69.7807 22.6185L68.3369 21.1748H70.7431L72.6681 23.0998L73.6306 25.506Z" fill="#111111"/>
        <circle cx="77.2414" cy="47.885" r="0.72187" fill="#B4AFAF"/>
      </svg>
      <p className="text-[#9B9B9B] text-lg font-medium">No passwords yet</p>
      <p className="text-[#666666] text-sm mt-2">Add your first password to get started</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-[#9B9B9B]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-[#DBDBDB]" style={{ fontFamily: 'IBM Plex Mono' }}>Vault</h1>
          <button onClick={onSearchClick} className="p-2 hover:bg-[#181818] rounded-lg">
            <Search size={20} className="text-[#9B9B9B]" />
          </button>
        </div>

        {passwords.length === 0 ? (
          <EmptyStateIllustration />
        ) : (
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
                    <span>{getDaysAgo(password.created_at)}d</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

Passwords.displayName = 'Passwords';

export default Passwords;
