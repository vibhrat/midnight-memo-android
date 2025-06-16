import { useState, forwardRef, useImperativeHandle } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CasualNote } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CasualNotesRef {
  triggerCreate: () => void;
}

const CasualNotes = forwardRef<CasualNotesRef>((_, ref) => {
  const [notes, setNotes] = useLocalStorage<CasualNote[]>('casual-notes', []);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    tag: '',
    content: '',
  });

  useImperativeHandle(ref, () => ({
    triggerCreate: () => {
      setIsCreating(true);
    }
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const now = new Date();

    if (editingId) {
      setNotes(notes.map(note => 
        note.id === editingId 
          ? { ...note, ...formData, updatedAt: now }
          : note
      ));
      setEditingId(null);
    } else {
      const newNote: CasualNote = {
        id: Date.now().toString(),
        ...formData,
        createdAt: now,
        updatedAt: now,
      };
      setNotes([newNote, ...notes]);
    }

    setFormData({ title: '', tag: '', content: '' });
    setIsCreating(false);
  };

  const handleEdit = (note: CasualNote) => {
    setFormData({
      title: note.title,
      tag: note.tag,
      content: note.content,
    });
    setEditingId(note.id);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleCancel = () => {
    setFormData({ title: '', tag: '', content: '' });
    setIsCreating(false);
    setEditingId(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Notes</h1>
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="space-y-4">
            <Input
              placeholder="Note title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border-gray-300"
            />
            <Input
              placeholder="Tag (optional)"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              className="border-gray-300"
            />
            <Textarea
              placeholder="Write your note here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="border-gray-300 resize-none"
            />
            <div className="flex gap-2">
              <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                {editingId ? 'Update' : 'Save'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">{note.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(note)}
                  className="text-sm text-gray-600 hover:text-black"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-sm text-gray-600 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
            {note.tag && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded mb-2">
                {note.tag}
              </span>
            )}
            <p className="text-gray-700 whitespace-pre-wrap mb-2">{note.content}</p>
            <p className="text-xs text-gray-500">
              {new Date(note.updatedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
        {notes.length === 0 && !isCreating && (
          <div className="text-center py-12 text-gray-500">
            No notes yet. Create your first note!
          </div>
        )}
      </div>
    </div>
  );
});

CasualNotes.displayName = 'CasualNotes';

export default CasualNotes;
