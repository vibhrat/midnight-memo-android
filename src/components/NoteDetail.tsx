
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CasualNote } from '@/types';
import { ArrowLeft, Trash2, Grid3x3, Share, Clock } from 'lucide-react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import TagSelector from '@/components/TagSelector';
import RichTextEditor from '@/components/RichTextEditor';
import ShareDialog from '@/components/ShareDialog';
import ReminderDialog from '@/components/ReminderDialog';
import { Badge } from '@/components/ui/badge';

interface NoteDetailProps {
  noteId: string;
  onBack: () => void;
}

const NoteDetail = ({ noteId, onBack }: NoteDetailProps) => {
  const [notes, setNotes] = useLocalStorage<CasualNote[]>('casual-notes', []);
  const [editableNote, setEditableNote] = useState<CasualNote | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);

  const clearReminder = async () => {
    try {
      const reminders = JSON.parse(localStorage.getItem('reminders') || '{}');
      const reminderKey = `note_${noteId}`;
      if (reminders[reminderKey]) {
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        await LocalNotifications.cancel({ notifications: [{ id: reminders[reminderKey].id }] });
        delete reminders[reminderKey];
        localStorage.setItem('reminders', JSON.stringify(reminders));
      }
    } catch (error) {
      console.error('Failed to clear reminder:', error);
    }
  };

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

  const autoSave = (updatedNote: Partial<CasualNote>) => {
    const now = new Date();
    const newNote = { ...editableNote, ...updatedNote, updatedAt: now };
    setEditableNote(newNote);
    setNotes(notes.map(n => 
      n.id === noteId ? newNote : n
    ));
    // Trigger data backup
    window.dispatchEvent(new CustomEvent('app-data-changed'));
  };

  const handleDelete = () => {
    setNotes(notes.filter(n => n.id !== noteId));
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
              onClick={() => setShowReminderDialog(true)}
              className="p-2 hover:bg-[#181818] rounded-lg"
            >
              <Clock size={22} className="text-[#9B9B9B]" />
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
        <div className={editableNote.isBlurred ? 'filter blur-md' : ''}>
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
        </div>
        
        {/* Tag section */}
        <div className={editableNote.isBlurred ? 'filter blur-md' : ''}>
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
        </div>
        
        {/* Rich Text Editor for Description */}
        <div className={`mb-8 ${editableNote.isBlurred ? 'filter blur-md' : ''}`}>
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
      />

      <ReminderDialog
        isOpen={showReminderDialog}
        onClose={() => setShowReminderDialog(false)}
        title={editableNote.title || 'Untitled'}
        type="note"
        reminderId={noteId}
        onClearReminder={clearReminder}
      />
    </div>
  );
};

export default NoteDetail;
