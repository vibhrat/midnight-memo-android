
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Password, PasswordField } from '@/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Eye, EyeOff, Copy, Plus, Trash2 } from 'lucide-react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { Skeleton } from '@/components/ui/skeleton';

interface PasswordDetailProps {
  passwordId: string;
  onBack: () => void;
}

const PasswordDetail = ({ passwordId, onBack }: PasswordDetailProps) => {
  const [passwords, setPasswords] = useLocalStorage<Password[]>('passwords', []);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'main' | 'field', id?: string }>({ type: 'main' });
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const password = passwords.find(p => p.id === passwordId);

  // Auto-save title and password changes
  const handleTitleChange = (newTitle: string) => {
    setPasswords(passwords.map(p => 
      p.id === passwordId 
        ? { ...p, title: newTitle, updatedAt: new Date() }
        : p
    ));
  };

  const handlePasswordChange = (newPassword: string) => {
    setPasswords(passwords.map(p => 
      p.id === passwordId 
        ? { ...p, password: newPassword, updatedAt: new Date() }
        : p
    ));
  };

  const handleFieldChange = (fieldId: string, key: 'title' | 'password', value: string) => {
    setPasswords(passwords.map(p => 
      p.id === passwordId 
        ? { 
            ...p, 
            passwordFields: (p.passwordFields || []).map(f => 
              f.id === fieldId ? { ...f, [key]: value, updatedAt: new Date() } : f
            ),
            updatedAt: new Date()
          }
        : p
    ));
  };

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
    const now = new Date();
    const passwordField: PasswordField = {
      id: Date.now().toString(),
      title: '',
      password: '',
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
  };

  const handleDelete = () => {
    setIsDeleting(true);
    
    if (deleteTarget.type === 'main') {
      setPasswords(passwords.filter(p => p.id !== passwordId));
      setTimeout(() => {
        onBack();
      }, 1000);
    } else if (deleteTarget.id) {
      setPasswords(passwords.map(p => 
        p.id === passwordId 
          ? { 
              ...p, 
              passwordFields: (p.passwordFields || []).filter(f => f.id !== deleteTarget.id),
              updatedAt: new Date()
            }
          : p
      ));
      setTimeout(() => {
        setIsDeleting(false);
      }, 500);
    }
  };

  const openDeleteDialog = (type: 'main' | 'field', id?: string) => {
    setDeleteTarget({ type, id });
    setShowDeleteDialog(true);
  };

  const renderPasswordField = (field: { id: string; title: string; password: string; createdAt: Date; updatedAt: Date }, isMain = false) => (
    <div key={field.id} className="bg-white p-4 rounded-lg mb-4" style={{ boxShadow: '0px 1px 4px 0px #E8E7E3' }}>
      <div className="flex justify-between items-center mb-3">
        <input
          type="text"
          value={field.title}
          onChange={(e) => isMain ? handleTitleChange(e.target.value) : handleFieldChange(field.id, 'title', e.target.value)}
          className="text-lg font-extrabold bg-transparent border-none outline-none flex-1"
          placeholder="Password Title"
          style={{ fontSize: '20px' }}
        />
        {!isMain && (
          <button
            onClick={() => openDeleteDialog('field', field.id)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        )}
      </div>
      
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
        <div className="flex-1 font-mono text-lg">
          <input
            type={showPasswords[field.id] ? 'text' : 'password'}
            value={field.password}
            onChange={(e) => isMain ? handlePasswordChange(e.target.value) : handleFieldChange(field.id, 'password', e.target.value)}
            className="bg-transparent border-none outline-none w-full font-mono text-lg"
            placeholder="Enter password"
          />
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
        <p className="text-gray-500" style={{ fontSize: '12px' }}>
          Created: {new Date(field.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-500" style={{ fontSize: '12px' }}>
          Updated: {new Date(field.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );

  if (isDeleting) {
    return (
      <div className="min-h-screen bg-[#FBFAF5] flex flex-col justify-center items-center p-4">
        <div className="space-y-4 w-full max-w-2xl">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFAF5]">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={() => openDeleteDialog('main')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Trash2 size={20} className="text-black" />
          </button>
        </div>
        
        {/* Main password field */}
        {renderPasswordField(password, true)}

        {/* Additional password fields */}
        {password.passwordFields?.map(field => renderPasswordField(field))}

        {/* Add Field Button - dotted with grey stroke */}
        <button
          onClick={addPasswordField}
          className="w-full border-2 border-dashed border-gray-400 text-gray-600 py-3 rounded-lg flex items-center justify-center gap-2 hover:border-gray-500 hover:text-gray-700 transition-colors"
        >
          <Plus size={20} />
          Add Field
        </button>
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default PasswordDetail;
