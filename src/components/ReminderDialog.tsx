
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReminderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: { hour: number; minute: number; ampm: 'AM' | 'PM' }) => void;
  onDelete: () => void;
  existingReminder?: { hour: number; minute: number; ampm: 'AM' | 'PM' } | null;
}

const ReminderDialog = ({ isOpen, onClose, onSave, onDelete, existingReminder }: ReminderDialogProps) => {
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');
  const { toast } = useToast();

  useEffect(() => {
    if (existingReminder) {
      setHour(existingReminder.hour);
      setMinute(existingReminder.minute);
      setAmpm(existingReminder.ampm);
    } else {
      // Set to current time
      const now = new Date();
      let currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentAmPm = currentHour >= 12 ? 'PM' : 'AM';
      
      if (currentHour === 0) currentHour = 12;
      else if (currentHour > 12) currentHour -= 12;
      
      setHour(currentHour);
      setMinute(currentMinute);
      setAmpm(currentAmPm);
    }
  }, [existingReminder, isOpen]);

  const handleSave = () => {
    onSave({ hour, minute, ampm });
    toast({
      title: "Success",
      description: "Reminder set successfully!",
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    toast({
      title: "Success",
      description: "Reminder deleted successfully!",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(19, 16, 16, 0.60)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <div 
        className="w-full max-w-md mx-auto rounded-[32px] overflow-hidden border border-[#2F2F2F] p-8"
        style={{
          background: 'linear-gradient(180deg, rgba(47, 42, 42, 0.53) 0%, rgba(25, 25, 25, 0.48) 49.04%, #000 100%)',
        }}
      >
        <h2 className="text-center text-2xl font-semibold text-[#EAEAEA] mb-8">Set Reminder</h2>
        
        {/* Time Display */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-[#DBDBDB] mb-2">
            {hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')} {ampm}
          </div>
        </div>

        {/* Time Selectors */}
        <div className="flex justify-center items-start gap-4 mb-8">
          {/* Hour Selector */}
          <div className="flex flex-col items-center">
            <label className="text-sm text-[#9B9B9B] mb-3">Hour</label>
            <div className="bg-[#181818] border border-[#2A2A2A] rounded-lg overflow-hidden">
              <div className="h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2A2A2A]">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <div
                    key={h}
                    onClick={() => setHour(h)}
                    className={`px-4 py-2 cursor-pointer text-center transition-colors ${
                      hour === h 
                        ? 'bg-[#272727] text-[#DBDBDB]' 
                        : 'text-[#9B9B9B] hover:bg-[#1F1F1F] hover:text-[#DBDBDB]'
                    }`}
                  >
                    {h.toString().padStart(2, '0')}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Minute Selector */}
          <div className="flex flex-col items-center">
            <label className="text-sm text-[#9B9B9B] mb-3">Minute</label>
            <div className="bg-[#181818] border border-[#2A2A2A] rounded-lg overflow-hidden">
              <div className="h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2A2A2A]">
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <div
                    key={m}
                    onClick={() => setMinute(m)}
                    className={`px-4 py-2 cursor-pointer text-center transition-colors ${
                      minute === m 
                        ? 'bg-[#272727] text-[#DBDBDB]' 
                        : 'text-[#9B9B9B] hover:bg-[#1F1F1F] hover:text-[#DBDBDB]'
                    }`}
                  >
                    {m.toString().padStart(2, '0')}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AM/PM Selector */}
          <div className="flex flex-col items-center">
            <label className="text-sm text-[#9B9B9B] mb-3">Period</label>
            <div className="bg-[#181818] border border-[#2A2A2A] rounded-lg overflow-hidden">
              <div className="flex flex-col">
                {['AM', 'PM'].map((period) => (
                  <div
                    key={period}
                    onClick={() => setAmpm(period as 'AM' | 'PM')}
                    className={`px-4 py-3 cursor-pointer text-center transition-colors ${
                      ampm === period 
                        ? 'bg-[#272727] text-[#DBDBDB]' 
                        : 'text-[#9B9B9B] hover:bg-[#1F1F1F] hover:text-[#DBDBDB]'
                    }`}
                  >
                    {period}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSave}
            className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#272727' }}
          >
            Save Reminder
          </button>
          
          {existingReminder && (
            <button
              onClick={handleDelete}
              className="w-full px-4 py-3 rounded-xl text-base font-semibold text-red-400 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#1A1A1A' }}
            >
              <Trash2 size={16} />
              Delete Reminder
            </button>
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

export default ReminderDialog;
