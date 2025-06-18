
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CasualNote } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';

interface NoteDetailProps {
  noteId: string;
  onBack: () => void;
}

const NoteDetail = ({ noteId, onBack }: NoteDetailProps) => {
  const [notes, setNotes] = useLocalStorage<CasualNote[]>('casual-notes', []);
  const [editableNote, setEditableNote] = useState<CasualNote | null>(null);

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
    onBack();
  };

  return (
    <div className="min-h-screen bg-[#FBFAF5]">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg" style={{ boxShadow: '0px 1px 4px 0px #E8E7E3' }}>
          <input
            value={editableNote.title}
            onChange={(e) => autoSave({ title: e.target.value })}
            className="text-2xl font-bold mb-4 w-full border-none outline-none bg-transparent"
            placeholder="Note title"
          />
          
          {editableNote.tag && (
            <input
              value={editableNote.tag}
              onChange={(e) => autoSave({ tag: e.target.value })}
              className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full mb-4 border-none outline-none"
              placeholder="Tag"
            />
          )}
          
          <div className="prose max-w-none mb-6">
            <textarea
              value={editableNote.content}
              onChange={(e) => autoSave({ content: e.target.value })}
              className="w-full text-gray-700 whitespace-pre-wrap leading-relaxed border-none outline-none bg-transparent resize-none"
              placeholder="Write your note here..."
              rows={10}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 px-2">
          <p className="text-xs text-gray-500">
            Created: {new Date(editableNote.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500">
            Updated: {new Date(editableNote.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;
