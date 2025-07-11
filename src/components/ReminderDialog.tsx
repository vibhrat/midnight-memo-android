
import { useState, useEffect } from 'react';
import { Clock, Trash2 } from 'lucide-react';
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
        className="w-full max-w-xs mx-auto rounded-[32px] overflow-hidden border border-[#2F2F2F] p-8"
        style={{
          background: 'linear-gradient(180deg, rgba(47, 42, 42, 0.53) 0%, rgba(25, 25, 25, 0.48) 49.04%, #000 100%)',
        }}
      >
        <h2 className="text-center text-2xl font-semibold text-[#EAEAEA] mb-6">Set Reminder</h2>
        
        <div className="flex justify-center items-center gap-4 mb-6">
          {/* Hour Selector */}
          <div className="flex flex-col items-center">
            <label className="text-sm text-[#9B9B9B] mb-2">Hour</label>
            <select
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              className="bg-[#181818] text-[#DBDBDB] border border-[#2A2A2A] rounded-lg px-3 py-2 text-center"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          <div className="text-[#DBDBDB] text-xl font-bold mt-6">:</div>

          {/* Minute Selector */}
          <div className="flex flex-col items-center">
            <label className="text-sm text-[#9B9B9B] mb-2">Minute</label>
            <select
              value={minute}
              onChange={(e) => setMinute(Number(e.target.value))}
              className="bg-[#181818] text-[#DBDBDB] border border-[#2A2A2A] rounded-lg px-3 py-2 text-center"
            >
              {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
              ))}
            </select>
          </div>

          {/* AM/PM Selector */}
          <div className="flex flex-col items-center">
            <label className="text-sm text-[#9B9B9B] mb-2">Period</label>
            <select
              value={ampm}
              onChange={(e) => setAmpm(e.target.value as 'AM' | 'PM')}
              className="bg-[#181818] text-[#DBDBDB] border border-[#2A2A2A] rounded-lg px-3 py-2 text-center"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

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
