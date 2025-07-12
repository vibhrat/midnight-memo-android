import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useToast } from '@/hooks/use-toast';

interface ReminderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'note' | 'list';
}

const ReminderDialog = ({ isOpen, onClose, title, type }: ReminderDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('12:00');
  const { toast } = useToast();

  const handleSetReminder = async () => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive"
      });
      return;
    }

    try {
      // Request permission for notifications
      const permission = await LocalNotifications.requestPermissions();
      
      if (permission.display !== 'granted') {
        toast({
          title: "Permission Required",
          description: "Please enable notifications to set reminders",
          variant: "destructive"
        });
        return;
      }

      // Combine date and time
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const reminderDate = new Date(selectedDate);
      reminderDate.setHours(hours, minutes, 0, 0);

      // Check if the date is in the future
      if (reminderDate <= new Date()) {
        toast({
          title: "Error",
          description: "Please select a future date and time",
          variant: "destructive"
        });
        return;
      }

      // Schedule the notification
      await LocalNotifications.schedule({
        notifications: [
          {
            title: `${type === 'note' ? 'Note' : 'List'} Reminder`,
            body: `Reminder for: ${title}`,
            id: Date.now(),
            schedule: { at: reminderDate },
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#488AFF',
            sound: undefined,
          }
        ]
      });

      toast({
        title: "Reminder Set",
        description: `Reminder set for ${format(reminderDate, 'PPP')} at ${selectedTime}`,
      });

      onClose();
    } catch (error) {
      console.error('Error setting reminder:', error);
      toast({
        title: "Error",
        description: "Failed to set reminder. Please try again.",
        variant: "destructive"
      });
    }
  };

  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const hours = Math.floor(i / 4);
    const minutes = (i % 4) * 15;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/95 backdrop-blur-md border border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Set Reminder
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-2">
          <div>
            <label className="text-sm font-medium text-white/80 mb-3 block">
              Select Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                    !selectedDate && "text-white/60"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-black/95 backdrop-blur-md border border-white/10" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm font-medium text-white/80 mb-3 block">
              Select Time
            </label>
            <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto rounded-lg bg-white/5 p-3">
              {timeOptions.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={cn(
                    "p-2 text-xs rounded-md transition-colors",
                    selectedTime === time
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSetReminder}
              className="flex-1 bg-white/20 text-white hover:bg-white/30"
            >
              Set Reminder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderDialog;