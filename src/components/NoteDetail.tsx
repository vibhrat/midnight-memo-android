
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CasualNote } from '@/types';
import { Button } from '@/components/ui/button';
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
          <Button onClick={onBack} className="mt-4">Go Back</Button>
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
    setTimeout(() => {
      onBack();
    }, 200);
  };

  const toggleBlur = () => {
    autoSave({ isBlurred: !editableNote.isBlurred });
  };

  const handleTagSelect = (tag: string) => {
    autoSave({ tag });
    setShowTagSelector(false);
  };

  return (
    <div className="min-h-screen bg-[#FBFAF5] pb-8">
      <div className="max-w-4xl mx-auto p-4">
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
              <Grid3x3 size={22} className={editableNote.isBlurred ? "text-blue-600" : "text-black"} />
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Trash2 size={22} className="text-black" />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg" style={{ boxShadow: '0px 1px 4px 0px #E8E7E3' }}>
          <textarea
            value={editableNote.title}
            onChange={(e) => autoSave({ title: e.target.value })}
            className="text-xl font-bold mb-4 w-full border-none outline-none bg-transparent resize-none"
            placeholder="Untitled"
            rows={1}
            style={{ 
              fontSize: '20px',
              minHeight: '28px',
              height: 'auto'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
          
          {editableNote.tag && (
            <button
              onClick={() => setShowTagSelector(true)}
              className="inline-block px-3 py-1 text-sm rounded-full mb-4 border-none outline-none"
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
              className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-500 rounded-full mb-4 hover:bg-gray-200"
            >
              + Add tag
            </button>
          )}
          
          <div className="w-full">
            <textarea
              value={editableNote.content}
              onChange={(e) => autoSave({ content: e.target.value })}
              className="w-full text-gray-700 whitespace-pre-wrap leading-relaxed border-none outline-none bg-transparent resize-none"
              placeholder="Start writing..."
              style={{ 
                fontSize: '16px',
                minHeight: '400px',
                height: 'auto',
                overflow: 'hidden'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 px-2">
          <p className="text-xs text-gray-500" style={{ fontSize: '12px' }}>
            Created: {new Date(editableNote.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500" style={{ fontSize: '12px' }}>
            Updated: {new Date(editableNote.updatedAt).toLocaleDateString()}
          </p>
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

export default NoteDetail;
