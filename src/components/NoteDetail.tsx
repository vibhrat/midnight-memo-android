
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { useFirebaseNotes } from '@/hooks/useFirebaseNotes';
import { CasualNote } from '@/types';
import { ArrowLeft, Trash2, Grid3x3, Share, Clock } from 'lucide-react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import TagSelector from '@/components/TagSelector';
import RichTextEditor from '@/components/RichTextEditor';
import ShareDialog from '@/components/ShareDialog';
import ReminderDialog from '@/components/ReminderDialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface NoteDetailProps {
  noteId: string;
  onBack: () => void;
}

const NoteDetail = ({ noteId, onBack }: NoteDetailProps) => {
  const { user } = useFirebaseAuth();
  const { updateNote: updateFirebaseNote } = useFirebaseNotes();
  const [localNotes, setLocalNotes] = useLocalStorage<CasualNote[]>('casual-notes', []);
  const [editableNote, setEditableNote] = useState<CasualNote | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const { toast } = useToast();

  // Use appropriate data source based on authentication
  const notes = user ? [] : localNotes; // Firebase notes would come from useFirebaseNotes hook
  const note = notes.find(n => n.id === noteId);

  useEffect(() => {
    if (note) {
      setEditableNote(note);
    }
  }, [note]);

  if (!note || !editableNote) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#9B9B9B]">Note not found</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-[#DBDBDB] text-[#000000] rounded">Go Back</button>
        </div>
      </div>
    );
  }

  const autoSave = async (updatedNote: Partial<CasualNote>) => {
    const now = new Date();
    const newNote = { ...editableNote, ...updatedNote, updatedAt: now };
    setEditableNote(newNote);
    
    if (user) {
      // Update Firebase
      await updateFirebaseNote(noteId, updatedNote);
    } else {
      // Update localStorage
      setLocalNotes(localNotes.map(n => 
        n.id === noteId ? newNote : n
      ));
    }
  };

  const handleDelete = () => {
    if (user) {
      // Delete from Firebase (would need deleteNote function)
    } else {
      setLocalNotes(localNotes.filter(n => n.id !== noteId));
    }
    setShowDeleteDialog(false);
    onBack();
  };

  const toggleBlur = () => {
    autoSave({ isBlurred: !editableNote.isBlurred });
  };

  const handleTagSelect = (tag: string) => {
    autoSave({ tag });
    setShowTagSelector(false);
  };

  const handleReminderSave = (reminder: { hour: number; minute: number; ampm: 'AM' | 'PM' }) => {
    // Convert to 24-hour format for storage
    let hour24 = reminder.hour;
    if (reminder.ampm === 'PM' && reminder.hour !== 12) {
      hour24 += 12;
    } else if (reminder.ampm === 'AM' && reminder.hour === 12) {
      hour24 = 0;
    }

    const reminderTime = new Date();
    reminderTime.setHours(hour24, reminder.minute, 0, 0);
    
    // If the time has passed today, set for tomorrow
    if (reminderTime < new Date()) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    autoSave({ reminder: reminderTime.toISOString() });
    
    // Schedule notification (mock implementation for now)
    scheduleNotification(reminderTime, editableNote.title || 'Untitled Note');
  };

  const handleReminderDelete = () => {
    autoSave({ reminder: undefined });
  };

  const scheduleNotification = (time: Date, title: string) => {
    // Mock notification scheduling
    console.log(`Notification scheduled for ${time.toLocaleString()} with title: ${title}`);
    
    // In a real implementation, this would use:
    // - Local notifications via Capacitor for mobile apps
    // - Service worker for web push notifications
    // - Firebase Cloud Functions for push notifications
  };

  const getExistingReminder = () => {
    if (!editableNote.reminder) return null;
    
    const reminderDate = new Date(editableNote.reminder);
    let hour = reminderDate.getHours();
    const minute = reminderDate.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    
    return { hour, minute, ampm };
  };

  const getTagColor = (tag: string) => {
    const colors = {
      'Note': '#3B82F6',
      'Medicine': '#EF4444', 
      'Travel': '#10B981',
      'Tech': '#8B5CF6',
      'Links': '#F59E0B',
      'Contact': '#06B6D4'
    };
    return colors[tag as keyof typeof colors] || '#6B7280';
  };

  return (
    <div className="min-h-screen bg-[#000000] overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header with back button and action buttons */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 border border-[#9B9B9B] rounded-lg hover:bg-[#181818]"
          >
            <ArrowLeft size={22} className="text-[#9B9B9B]" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setShowReminderDialog(true)}
              className={`p-2 hover:bg-[#181818] rounded-lg ${editableNote.reminder ? 'bg-[#181818]' : ''}`}
            >
              <Clock size={22} className={editableNote.reminder ? "text-blue-600" : "text-[#9B9B9B]"} />
            </button>
            <button
              onClick={toggleBlur}
              className={`p-2 hover:bg-[#181818] rounded-lg ${editableNote.isBlurred ? 'bg-[#181818]' : ''}`}
            >
              <Grid3x3 size={22} className={editableNote.isBlurred ? "text-blue-600" : "text-[#9B9B9B]"} />
            </button>
            <button
              onClick={() => setShowShareDialog(true)}
              className="p-2 hover:bg-[#181818] rounded-lg"
            >
              <Share size={22} className="text-[#9B9B9B]" />
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="p-2 hover:bg-[#181818] rounded-lg"
            >
              <Trash2 size={22} className="text-[#9B9B9B]" />
            </button>
          </div>
        </div>

        {/* Title */}
        <textarea
          value={editableNote.title}
          onChange={(e) => autoSave({ title: e.target.value })}
          className="text-2xl font-bold mb-4 w-full border-none outline-none bg-transparent resize-none text-[#DBDBDB]"
          placeholder="Untitled"
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
        
        {/* Tag section */}
        {editableNote.tag && (
          <button
            onClick={() => setShowTagSelector(true)}
            className="mb-6"
          >
            <div 
              className="inline-flex items-center px-3 py-1.5 rounded-full gap-2" 
              style={{ 
                fontSize: '12px',
                backgroundColor: '#2A2A2A',
                color: '#DBDBDB',
                fontWeight: '600'
              }}
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: getTagColor(editableNote.tag) }}
              />
              {editableNote.tag}
            </div>
          </button>
        )}

        {!editableNote.tag && (
          <button
            onClick={() => setShowTagSelector(true)}
            className="inline-block px-3 py-1 text-sm bg-[#181818] text-[#9B9B9B] rounded-full mb-6 hover:bg-[#2A2A2A]"
          >
            + Add tag
          </button>
        )}
        
        {/* Rich Text Editor for Description */}
        <div className="mb-8">
          <RichTextEditor
            content={editableNote.content}
            onChange={(content) => autoSave({ content })}
            placeholder="Start writing..."
          />
        </div>

        {/* Footer with dates */}
        <div className="flex justify-between items-center mt-8 px-2 text-xs text-[#9B9B9B]">
          <p>Created: {new Date(editableNote.createdAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(editableNote.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />

      <TagSelector
        isOpen={showTagSelector}
        onClose={() => setShowTagSelector(false)}
        onSelect={handleTagSelect}
        currentTag={editableNote.tag}
      />

      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        data={editableNote}
        type="note"
        mode="share"
      />

      <ReminderDialog
        isOpen={showReminderDialog}
        onClose={() => setShowReminderDialog(false)}
        onSave={handleReminderSave}
        onDelete={handleReminderDelete}
        existingReminder={getExistingReminder()}
      />
    </div>
  );
};

export default NoteDetail;
