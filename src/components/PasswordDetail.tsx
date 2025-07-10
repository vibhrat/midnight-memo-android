
import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Password, PasswordField } from '@/types';
import { ArrowLeft, Trash2, Eye, EyeOff, Copy, Plus, X } from 'lucide-react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { useToast } from '@/hooks/use-toast';

interface PasswordDetailProps {
  passwordId: string;
  onBack: () => void;
}

const PasswordDetail = ({ passwordId, onBack }: PasswordDetailProps) => {
  const [passwords, setPasswords] = useLocalStorage<Password[]>('passwords', []);
  const [editablePassword, setEditablePassword] = useState<Password | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const password = passwords.find(p => p.id === passwordId);

  useEffect(() => {
    if (password) {
      setEditablePassword(password);
    }
  }, [password]);

  if (!password || !editablePassword) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#9B9B9B]">Password not found</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-[#DBDBDB] text-[#000000] rounded">Go Back</button>
        </div>
      </div>
    );
  }

  const autoSave = (updatedPassword: Partial<Password>) => {
    const now = new Date();
    const newPassword = { ...editablePassword, ...updatedPassword, updatedAt: now };
    setEditablePassword(newPassword);
    setPasswords(passwords.map(p => 
      p.id === passwordId ? newPassword : p
    ));
  };

  const handleDelete = () => {
    setPasswords(passwords.filter(p => p.id !== passwordId));
    setShowDeleteDialog(false);
    onBack();
  };

  const copyToClipboard = async (text: string, fieldName: string = 'Password') => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleFieldVisibility = (fieldId: string) => {
    const newVisibleFields = new Set(visibleFields);
    if (visibleFields.has(fieldId)) {
      newVisibleFields.delete(fieldId);
    } else {
      newVisibleFields.add(fieldId);
    }
    setVisibleFields(newVisibleFields);
  };

  const addNewField = () => {
    const now = new Date();
    const newField: PasswordField = {
      id: Date.now().toString(),
      title: '',
      password: '',
      createdAt: now,
      updatedAt: now
    };
    autoSave({ fields: [...(editablePassword.fields || []), newField] });
  };

  const updateField = (fieldId: string, updates: Partial<PasswordField>) => {
    const updatedFields = (editablePassword.fields || []).map(field =>
      field.id === fieldId ? { ...field, ...updates, updatedAt: new Date() } : field
    );
    autoSave({ fields: updatedFields });
  };

  const deleteField = (fieldId: string) => {
    const updatedFields = (editablePassword.fields || []).filter(field => field.id !== fieldId);
    autoSave({ fields: updatedFields });
  };

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 border border-[#9B9B9B] rounded-lg hover:bg-[#181818]"
          >
            <ArrowLeft size={22} className="text-[#9B9B9B]" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="p-2 hover:bg-[#181818] rounded-lg"
            >
              <Trash2 size={22} className="text-[#9B9B9B]" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <textarea
            value={editablePassword.title}
            onChange={(e) => autoSave({ title: e.target.value })}
            className="text-2xl font-bold bg-transparent border-none outline-none resize-none w-full text-[#DBDBDB]"
            placeholder="Untitled Password"
            rows={1}
            style={{ 
              fontSize: '24px',
              minHeight: '32px',
              fontWeight: 'bold'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
        </div>

        {/* Main Password Field */}
        <div className="bg-[#181818] rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[#9B9B9B]">Password</label>
            <div className="flex gap-2">
              <button
                onClick={togglePasswordVisibility}
                className="p-1 hover:bg-[#2A2A2A] rounded"
              >
                {showPassword ? 
                  <EyeOff size={16} className="text-[#9B9B9B]" /> : 
                  <Eye size={16} className="text-[#9B9B9B]" />
                }
              </button>
              <button
                onClick={() => copyToClipboard(editablePassword.password)}
                className="p-1 hover:bg-[#2A2A2A] rounded"
              >
                <Copy size={16} className="text-[#9B9B9B]" />
              </button>
            </div>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={editablePassword.password}
            onChange={(e) => autoSave({ password: e.target.value })}
            className="w-full bg-transparent border-none outline-none text-[#DBDBDB] font-mono text-sm"
            placeholder="Enter password"
          />
        </div>

        {/* Additional Fields */}
        {editablePassword.fields && editablePassword.fields.length > 0 && (
          <div className="space-y-4 mb-6">
            {editablePassword.fields.map((field) => (
              <div key={field.id} className="bg-[#181818] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="text"
                    value={field.title}
                    onChange={(e) => updateField(field.id, { title: e.target.value })}
                    className="text-sm font-medium text-[#9B9B9B] bg-transparent border-none outline-none flex-1"
                    placeholder="Field name"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFieldVisibility(field.id)}
                      className="p-1 hover:bg-[#2A2A2A] rounded"
                    >
                      {visibleFields.has(field.id) ? 
                        <EyeOff size={16} className="text-[#9B9B9B]" /> : 
                        <Eye size={16} className="text-[#9B9B9B]" />
                      }
                    </button>
                    <button
                      onClick={() => copyToClipboard(field.password, field.title)}
                      className="p-1 hover:bg-[#2A2A2A] rounded"
                    >
                      <Copy size={16} className="text-[#9B9B9B]" />
                    </button>
                    <button
                      onClick={() => deleteField(field.id)}
                      className="p-1 hover:bg-[#2A2A2A] rounded text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <input
                  type={visibleFields.has(field.id) ? "text" : "password"}
                  value={field.password}
                  onChange={(e) => updateField(field.id, { password: e.target.value })}
                  className="w-full bg-transparent border-none outline-none text-[#DBDBDB] font-mono text-sm"
                  placeholder="Enter value"
                />
              </div>
            ))}
          </div>
        )}

        {/* Add Field Button */}
        <button
          onClick={addNewField}
          className="w-full border-2 border-dashed border-[#9B9B9B] text-[#9B9B9B] py-3 rounded-lg flex items-center justify-center gap-2 hover:border-[#DBDBDB] hover:text-[#DBDBDB] transition-colors mb-8"
        >
          <Plus size={20} />
          Add Field
        </button>

        {/* Footer with dates */}
        <div className="flex justify-between items-center px-2 text-xs text-[#9B9B9B]">
          <p>Created: {new Date(editablePassword.createdAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(editablePassword.updatedAt).toLocaleDateString()}</p>
        </div>
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
