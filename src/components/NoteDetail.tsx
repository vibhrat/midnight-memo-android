
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CasualNote } from '@/types';
import { ArrowLeft, Trash2, Grid3x3 } from 'lucide-react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import TagSelector from '@/components/TagSelector';

interface NoteDetailProps {
  noteId: string;
  onBack: () => void;
}

const NoteDetail = ({ noteId, onBack }: NoteDetailProps) => {
  const [notes, setNotes] = useLocalStorage<CasualNote[]>('casual-notes', []);
  const [editableNote, setEditableNote] = useState<CasualNote | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState(false);

  const note = notes.find(n => n.id === noteId);

  useEffect(() => {
    if (note) {
      setEditableNote(note);
    }
  }, [note]);

  if (!note || !editableNote) {
    return (
      <div className="min-h-screen bg-[#FBFAF5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Note not found</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-black text-white rounded">Go Back</button>
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
      'Note': '#E3F2FD',
      'Medicine': '#FFE8E8', 
      'Travel': '#E8F5E8',
      'Tech': '#F3E5F5',
      'Links': '#FFF3E0',
      'Contact': '#E0F2F1'
    };
    return colors[tag as keyof typeof colors] || '#F5F5F5';
  };

  const getTagTextColor = (tag: string) => {
    const colors = {
      'Note': '#1976D2',
      'Medicine': '#D32F2F',
      'Travel': '#388E3C',
      'Tech': '#7B1FA2',
      'Links': '#F57C00',
      'Contact': '#00796B'
    };
    return colors[tag as keyof typeof colors] || '#666666';
  };

  return (
    <div className="min-h-screen bg-[#FBFAF5] overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header with back button and action buttons */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="flex gap-2">
            <button
              onClick={toggleBlur}
              className={`p-2 hover:bg-gray-100 rounded-lg ${editableNote.isBlurred ? 'bg-gray-200' : ''}`}
            >
              <Grid3x3 size={22} className={editableNote.isBlurred ? "text-blue-600" : "text-gray-600"} />
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Trash2 size={22} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Title */}
        <textarea
          value={editableNote.title}
          onChange={(e) => autoSave({ title: e.target.value })}
          className="text-2xl font-bold mb-4 w-full border-none outline-none bg-transparent resize-none"
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
            className="inline-block px-3 py-1 text-sm rounded-full mb-6 border-none outline-none"
            style={{
              backgroundColor: getTagColor(editableNote.tag),
              color: getTagTextColor(editableNote.tag)
            }}
          >
            {editableNote.tag}
          </button>
        )}

        {!editableNote.tag && (
          <button
            onClick={() => setShowTagSelector(true)}
            className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-500 rounded-full mb-6 hover:bg-gray-200"
          >
            + Add tag
          </button>
        )}
        
        {/* Description */}
        <textarea
          value={editableNote.content}
          onChange={(e) => autoSave({ content: e.target.value })}
          className="w-full text-gray-700 whitespace-pre-wrap leading-relaxed border-none outline-none bg-transparent resize-none font-medium"
          placeholder="Start writing..."
          style={{ 
            fontSize: '16px',
            height: '100vh',
            fontWeight: '500'
          }}
        />

        {/* Footer with dates */}
        <div className="flex justify-between items-center mt-8 px-2 text-xs text-gray-500">
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
    </div>
  );
};

export default NoteDetail;
