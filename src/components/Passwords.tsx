
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Search, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Password } from '@/types';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import ShareDialog from './ShareDialog';

interface PasswordsRef {
  triggerCreate: () => void;
}

interface PasswordsProps {
  onPasswordSelect: (passwordId: string) => void;
  onSearchClick: () => void;
}

const Passwords = forwardRef<PasswordsRef, PasswordsProps>(
  ({ onPasswordSelect, onSearchClick }, ref) => {
    const [passwords, setPasswords] = useState<Password[]>([]);
    const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [passwordToDelete, setPasswordToDelete] = useState<Password | null>(null);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [passwordToShare, setPasswordToShare] = useState<Password | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { toast } = useToast();

    useImperativeHandle(ref, () => ({
      triggerCreate: async () => {
        if (!user) return;

        try {
          const now = new Date().toISOString();
          const { data, error } = await supabase
            .from('passwords')
            .insert([{
              title: '',
              password: '',
              created_at: now,
              updated_at: now,
              user_id: user.id
            }])
            .select()
            .single();

          if (error) throw error;

          setPasswords(prev => [data, ...prev]);
          onPasswordSelect(data.id);
        } catch (error) {
          console.error('Error creating password:', error);
          toast({
            title: "Error",
            description: "Failed to create password",
            variant: "destructive"
          });
        }
      }
    }));

    useEffect(() => {
      if (user) {
        loadPasswords();
      }
    }, [user]);

    const loadPasswords = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('passwords')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPasswords(data || []);
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

    const togglePasswordVisibility = (passwordId: string) => {
      setVisiblePasswords(prev => {
        const newSet = new Set(prev);
        if (newSet.has(passwordId)) {
          newSet.delete(passwordId);
        } else {
          newSet.add(passwordId);
        }
        return newSet;
      });
    };

    const handleDeletePassword = (password: Password) => {
      setPasswordToDelete(password);
      setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
      if (!passwordToDelete || !user) return;

      try {
        const { error } = await supabase
          .from('passwords')
          .delete()
          .eq('id', passwordToDelete.id)
          .eq('user_id', user.id);

        if (error) throw error;

        setPasswords(passwords.filter(password => password.id !== passwordToDelete.id));
        toast({
          title: "Success",
          description: "Password deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting password:', error);
        toast({
          title: "Error",
          description: "Failed to delete password",
          variant: "destructive"
        });
      } finally {
        setDeleteDialogOpen(false);
        setPasswordToDelete(null);
      }
    };

    const handleSharePassword = (password: Password) => {
      setPasswordToShare(password);
      setShareDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
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
        <p className="text-[#666666] text-sm mt-2">Create your first password to get started</p>
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
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-extrabold text-[#DBDBDB]" style={{ fontFamily: 'IBM Plex Mono' }}>
              Vault
            </h1>
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
                  className="p-4 rounded-lg border border-[#2F2F2F] bg-[#1A1A1A] hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                  onClick={() => onPasswordSelect(password.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-[#DBDBDB]">{password.title || 'Untitled'}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePasswordVisibility(password.id);
                        }}
                        className="p-1 hover:bg-[#3A3A3A] rounded"
                      >
                        {visiblePasswords.has(password.id) ? (
                          <EyeOff size={16} className="text-[#9B9B9B]" />
                        ) : (
                          <Eye size={16} className="text-[#9B9B9B]" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSharePassword(password);
                        }}
                        className="p-1 hover:bg-[#3A3A3A] rounded"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#9B9B9B]">
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="16,6 12,2 8,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePassword(password);
                        }}
                        className="text-red-500 hover:text-red-400 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-[#9B9B9B] text-sm font-mono">
                    {visiblePasswords.has(password.id) 
                      ? password.password 
                      : '•'.repeat(Math.max(8, password.password.length))
                    }
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-[#666666]">
                      {formatDate(password.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
        />

        <ShareDialog
          isOpen={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          data={passwordToShare}
          type="password"
        />
      </div>
    );
  }
);

Passwords.displayName = 'Passwords';

export default Passwords;
