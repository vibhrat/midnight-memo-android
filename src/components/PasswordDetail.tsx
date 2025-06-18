
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Password } from '@/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Eye, EyeOff, Copy, Edit3, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface PasswordDetailProps {
  passwordId: string;
  onBack: () => void;
}

const PasswordDetail = ({ passwordId, onBack }: PasswordDetailProps) => {
  const [passwords, setPasswords] = useLocalStorage<Password[]>('passwords', []);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: '', password: '' });
  const { toast } = useToast();

  const password = passwords.find(p => p.id === passwordId);

  if (!password) {
    return (
      <div className="min-h-screen bg-[#FBFAF5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Password not found</p>
          <Button onClick={onBack} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy password to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setFormData({
      title: password.title,
      password: password.password,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.password.trim()) return;

    const now = new Date();
    setPasswords(passwords.map(p => 
      p.id === passwordId 
        ? { ...p, ...formData, updatedAt: now }
        : p
    ));
    setIsEditing(false);
  };

  const handleDelete = () => {
    setPasswords(passwords.filter(p => p.id !== passwordId));
    onBack();
  };

  return (
    <div className="min-h-screen bg-[#FBFAF5]">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Edit3 size={16} className="text-gray-600" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Trash2 size={16} className="text-red-600" />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg" style={{ boxShadow: '0px 1px 4px 0px #E8E7E3' }}>
          <h1 className="text-2xl font-bold mb-6">{password.title}</h1>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 font-mono text-lg">
                {showPassword ? password.password : '•'.repeat(password.password.length)}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 hover:bg-gray-200 rounded-lg"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <button
                  onClick={() => copyToClipboard(password.password)}
                  className="p-2 hover:bg-gray-200 rounded-lg"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Created: {new Date(password.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Updated: {new Date(password.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Password title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Button onClick={handleSave} className="w-full bg-black text-white hover:bg-gray-800">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PasswordDetail;
