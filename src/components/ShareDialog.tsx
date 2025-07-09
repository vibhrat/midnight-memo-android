
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: 'note' | 'list' | 'password';
}

const ShareDialog = ({ isOpen, onClose, data, type }: ShareDialogProps) => {
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}-${data.id || Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "JSON exported successfully!",
    });
    onClose();
  };

  const handleShareText = () => {
    let textData = '';
    
    switch (type) {
      case 'note':
        textData = `CIPHER_NOTE:${JSON.stringify({
          title: data.title,
          content: data.content,
          tag: data.tag,
          isBlurred: data.isBlurred
        })}`;
        break;
      case 'list':
        textData = `CIPHER_LIST:${JSON.stringify({
          title: data.title,
          items: data.items
        })}`;
        break;
      case 'password':
        textData = `CIPHER_PASSWORD:${JSON.stringify({
          title: data.title,
          password: data.password,
          fields: data.fields
        })}`;
        break;
    }

    navigator.clipboard.writeText(textData).then(() => {
      toast({
        title: "Success",
        description: "Text copied to clipboard!",
      });
      onClose();
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(19, 16, 16, 0.60)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <div 
        className="w-full max-w-xs mx-auto rounded-[32px] overflow-hidden border border-[#2F2F2F] p-8"
        style={{
          background: 'linear-gradient(180deg, rgba(47, 42, 42, 0.53) 0%, rgba(25, 25, 25, 0.48) 49.04%, #000 100%)',
        }}
      >
        <h2 className="text-center text-2xl font-semibold text-[#EAEAEA] mb-6">Share {type}</h2>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleExportJSON}
            className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#272727' }}
          >
            Export as JSON
          </button>
          <button
            onClick={handleShareText}
            className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#272727' }}
          >
            Share as Text
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#191919' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;
