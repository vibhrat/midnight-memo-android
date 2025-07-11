
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';
import { Camera, QrCode } from 'lucide-react';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: 'note' | 'list' | 'password';
}

const ShareDialog = ({ isOpen, onClose, data, type }: ShareDialogProps) => {
  const { toast } = useToast();
  const [showQR, setShowQR] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [showScanner, setShowScanner] = useState(false);
  const [showImport, setShowImport] = useState(false);

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

  const handleGenerateQR = async () => {
    let qrData = '';
    
    switch (type) {
      case 'note':
        qrData = `CIPHER_NOTE:${JSON.stringify({
          title: data.title,
          content: data.content,
          tag: data.tag,
          isBlurred: data.isBlurred
        })}`;
        break;
      case 'list':
        qrData = `CIPHER_LIST:${JSON.stringify({
          title: data.title,
          items: data.items
        })}`;
        break;
    }

    // Check if data is too big for QR code (typical limit is around 2953 bytes)
    if (qrData.length > 2900) {
      toast({
        title: "Error",
        description: "Data is too big for QR code",
        variant: "destructive",
      });
      return;
    }

    try {
      const qrCodeUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(qrCodeUrl);
      setShowQR(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    }
  };

  const handleScanQR = () => {
    setShowScanner(true);
  };

  const handleImport = () => {
    setShowImport(true);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        processImportData(content);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to read file",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const processImportData = (content: string) => {
    try {
      // Try to parse as cipher format first
      if (content.startsWith('CIPHER_NOTE:') || content.startsWith('CIPHER_LIST:')) {
        const prefix = content.startsWith('CIPHER_NOTE:') ? 'CIPHER_NOTE:' : 'CIPHER_LIST:';
        const jsonStr = content.substring(prefix.length);
        const parsedData = JSON.parse(jsonStr);
        
        // Add to localStorage based on current type
        if (type === 'note' && prefix === 'CIPHER_NOTE:') {
          const existingNotes = JSON.parse(localStorage.getItem('casual-notes') || '[]');
          const newNote = {
            ...parsedData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date()
          };
          existingNotes.unshift(newNote);
          localStorage.setItem('casual-notes', JSON.stringify(existingNotes));
        } else if (type === 'list' && prefix === 'CIPHER_LIST:') {
          const existingLists = JSON.parse(localStorage.getItem('shopping-lists') || '[]');
          const newList = {
            ...parsedData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date()
          };
          existingLists.unshift(newList);
          localStorage.setItem('shopping-lists', JSON.stringify(existingLists));
        }
      } else {
        // Try to parse as regular JSON
        const parsedData = JSON.parse(content);
        
        if (type === 'note' && (parsedData.title !== undefined || parsedData.content !== undefined)) {
          const existingNotes = JSON.parse(localStorage.getItem('casual-notes') || '[]');
          const newNote = {
            id: Date.now().toString(),
            title: parsedData.title || '',
            content: parsedData.content || '',
            tag: parsedData.tag || '',
            isBlurred: parsedData.isBlurred || false,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          existingNotes.unshift(newNote);
          localStorage.setItem('casual-notes', JSON.stringify(existingNotes));
        } else if (type === 'list' && (parsedData.title !== undefined || parsedData.items !== undefined)) {
          const existingLists = JSON.parse(localStorage.getItem('shopping-lists') || '[]');
          const newList = {
            id: Date.now().toString(),
            title: parsedData.title || '',
            items: parsedData.items || [],
            createdAt: new Date(),
            updatedAt: new Date()
          };
          existingLists.unshift(newList);
          localStorage.setItem('shopping-lists', JSON.stringify(existingLists));
        }
      }

      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} imported successfully!`,
      });
      setShowImport(false);
      onClose();
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid file format",
        variant: "destructive",
      });
    }
  };

  if (showQR) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: 'rgba(19, 16, 16, 0.60)',
          backdropFilter: 'blur(5px)',
        }}
      >
        <div 
          className="w-full max-w-sm mx-auto rounded-[32px] overflow-hidden border border-[#2F2F2F] p-8"
          style={{
            background: 'linear-gradient(180deg, rgba(47, 42, 42, 0.53) 0%, rgba(25, 25, 25, 0.48) 49.04%, #000 100%)',
          }}
        >
          <h2 className="text-center text-2xl font-semibold text-[#EAEAEA] mb-6">QR Code</h2>
          <div className="flex justify-center mb-6">
            <img src={qrCodeDataUrl} alt="QR Code" className="rounded-lg" />
          </div>
          <button
            onClick={() => setShowQR(false)}
            className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#191919' }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (showScanner) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: 'rgba(19, 16, 16, 0.60)',
          backdropFilter: 'blur(5px)',
        }}
      >
        <div 
          className="w-full max-w-sm mx-auto rounded-[32px] overflow-hidden border border-[#2F2F2F] p-8"
          style={{
            background: 'linear-gradient(180deg, rgba(47, 42, 42, 0.53) 0%, rgba(25, 25, 25, 0.48) 49.04%, #000 100%)',
          }}
        >
          <h2 className="text-center text-2xl font-semibold text-[#EAEAEA] mb-6">Scan QR Code</h2>
          <p className="text-center text-[#9B9B9B] mb-6">QR scanner functionality would be implemented here</p>
          <button
            onClick={() => setShowScanner(false)}
            className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#191919' }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (showImport) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: 'rgba(19, 16, 16, 0.60)',
          backdropFilter: 'blur(5px)',
        }}
      >
        <div 
          className="w-full max-w-sm mx-auto rounded-[32px] overflow-hidden border border-[#2F2F2F] p-8"
          style={{
            background: 'linear-gradient(180deg, rgba(47, 42, 42, 0.53) 0%, rgba(25, 25, 25, 0.48) 49.04%, #000 100%)',
          }}
        >
          <h2 className="text-center text-2xl font-semibold text-[#EAEAEA] mb-6">Import {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          <div className="flex flex-col gap-4">
            <label className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer text-center" style={{ backgroundColor: '#272727' }}>
              Import JSON File
              <input
                type="file"
                accept=".json,.txt"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setShowImport(false)}
              className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#191919' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          {type !== 'password' && (
            <>
              <button
                onClick={handleGenerateQR}
                className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#272727' }}
              >
                <QrCode size={18} />
                Generate QR
              </button>
              <button
                onClick={handleScanQR}
                className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#272727' }}
              >
                <Camera size={18} />
                Scan QR
              </button>
              <button
                onClick={handleImport}
                className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#272727' }}
              >
                Import
              </button>
            </>
          )}
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
