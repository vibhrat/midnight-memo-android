
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Password } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';

const Passwords = () => {
  const [passwords, setPasswords] = useLocalStorage<Password[]>('passwords', []);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    password: '',
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.password.trim()) return;

    const now = new Date();

    if (editingId) {
      setPasswords(passwords.map(pwd => 
        pwd.id === editingId 
          ? { ...pwd, ...formData, updatedAt: now }
          : pwd
      ));
      setEditingId(null);
    } else {
      const newPassword: Password = {
        id: Date.now().toString(),
        ...formData,
        createdAt: now,
        updatedAt: now,
      };
      setPasswords([newPassword, ...passwords]);
    }

    setFormData({ title: '', password: '' });
    setIsCreating(false);
  };

  const handleEdit = (password: Password) => {
    setFormData({
      title: password.title,
      password: password.password,
    });
    setEditingId(password.id);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    setPasswords(passwords.filter(pwd => pwd.id !== id));
  };

  const handleCancel = () => {
    setFormData({ title: '', password: '' });
    setIsCreating(false);
    setEditingId(null);
  };

  const copyToClipboard = async (password: string, title: string) => {
    try {
      await navigator.clipboard.writeText(password);
      toast({
        title: "Copied!",
        description: `Password for ${title} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy password to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Passwords</h1>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="bg-black text-white hover:bg-gray-800">
            New Password
          </Button>
        )}
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg">
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
                {editingId ? 'Update' : 'Save'}
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
          <div key={password.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-medium">{password.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(password)}
                  className="text-sm text-gray-600 hover:text-black"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(password.id)}
                  className="text-sm text-gray-600 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Password:</span>
                  <span className="font-mono text-sm">{'•'.repeat(password.password.length)}</span>
                </div>
              </div>
              <Button
                onClick={() => copyToClipboard(password.password, password.title)}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Copy size={14} />
                Copy
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-3">
              {new Date(password.updatedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
        {passwords.length === 0 && !isCreating && (
          <div className="text-center py-12 text-gray-500">
            No passwords saved yet. Add your first password!
          </div>
        )}
      </div>
    </div>
  );
};

export default Passwords;
