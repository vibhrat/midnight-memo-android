
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Password, PasswordField } from '@/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Eye, EyeOff, Copy, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface PasswordDetailProps {
  passwordId: string;
  onBack: () => void;
}

const PasswordDetail = ({ passwordId, onBack }: PasswordDetailProps) => {
  const [passwords, setPasswords] = useLocalStorage<Password[]>('passwords', []);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [isAddingField, setIsAddingField] = useState(false);
  const [newField, setNewField] = useState({ title: '', password: '' });
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

  const togglePasswordVisibility = (fieldId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }));
  };

  const addPasswordField = () => {
    if (!newField.title.trim() || !newField.password.trim()) return;

    const now = new Date();
    const passwordField: PasswordField = {
      id: Date.now().toString(),
      title: newField.title,
      password: newField.password,
      createdAt: now,
      updatedAt: now,
    };

    setPasswords(passwords.map(p => 
      p.id === passwordId 
        ? { 
            ...p, 
            passwordFields: [...(p.passwordFields || []), passwordField],
            updatedAt: now 
          }
        : p
    ));

    setNewField({ title: '', password: '' });
    setIsAddingField(false);
  };

  const deletePasswordField = (fieldId: string) => {
    setPasswords(passwords.map(p => 
      p.id === passwordId 
        ? { 
            ...p, 
            passwordFields: (p.passwordFields || []).filter(f => f.id !== fieldId),
            updatedAt: new Date()
          }
        : p
    ));
  };

  const renderPasswordField = (field: { id: string; title: string; password: string; createdAt: Date; updatedAt: Date }, isMain = false) => (
    <div key={field.id} className="bg-white p-4 rounded-lg mb-4" style={{ boxShadow: '0px 1px 4px 0px #E8E7E3' }}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">{field.title}</h3>
        {!isMain && (
          <button
            onClick={() => deletePasswordField(field.id)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        )}
      </div>
      
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
        <div className="flex-1 font-mono text-lg">
          {showPasswords[field.id] ? field.password : '•'.repeat(field.password.length)}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => togglePasswordVisibility(field.id)}
            className="p-2 hover:bg-gray-200 rounded-lg"
          >
            {showPasswords[field.id] ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <button
            onClick={() => copyToClipboard(field.password)}
            className="p-2 hover:bg-gray-200 rounded-lg"
          >
            <Copy size={20} />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">
          Created: {new Date(field.createdAt).toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-500">
          Updated: {new Date(field.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );

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
          <button
            onClick={() => setIsAddingField(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Plus size={16} className="text-gray-600" />
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-6">{password.title}</h1>
        
        {/* Main password field */}
        {renderPasswordField(password, true)}

        {/* Additional password fields */}
        {password.passwordFields?.map(field => renderPasswordField(field))}
      </div>

      <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
        <DialogContent className="sm:max-w-md" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Add Password Field</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Field title"
              value={newField.title}
              onChange={(e) => setNewField({ ...newField, title: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Password"
              value={newField.password}
              onChange={(e) => setNewField({ ...newField, password: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={addPasswordField} className="flex-1 bg-black text-white hover:bg-gray-800">
                Add Field
              </Button>
              <Button variant="outline" onClick={() => setIsAddingField(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PasswordDetail;
