
import { useState, forwardRef, useImperativeHandle } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CasualNote } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Search } from 'lucide-react';

interface CasualNotesRef {
  triggerCreate: () => void;
}

interface CasualNotesProps {
  onNoteSelect?: (noteId: string) => void;
  onSearchClick?: () => void;
}

const CasualNotes = forwardRef<CasualNotesRef, CasualNotesProps>(({ onNoteSelect, onSearchClick }, ref) => {
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

  const getDaysAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

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

  const handleCancel = () => {
    setFormData({ title: '', tag: '', content: '' });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleCardClick = (noteId: string) => {
    if (onNoteSelect) {
      onNoteSelect(noteId);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAF5]">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#131010]" style={{ fontFamily: 'IBM Plex Mono', fontWeight: '600' }}>Notes</h1>
          <button onClick={onSearchClick} className="p-2 hover:bg-gray-100 rounded-lg">
            <Search size={20} className="text-gray-600" />
          </button>
        </div>

        {isCreating && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg" style={{ boxShadow: '0px 1px 4px 0px #E8E7E3' }}>
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

        <div className="space-y-3">
          {notes.map((note) => (
            <div 
              key={note.id} 
              className="p-3 bg-white rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              style={{ boxShadow: '0px 1px 4px 0px #E8E7E3' }}
              onClick={() => handleCardClick(note.id)}
            >
              <div className="mb-2">
                <h3 className="font-semibold" style={{ fontSize: '16px' }}>{note.title}</h3>
              </div>
              {note.tag && (
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded mb-2" style={{ fontSize: '12px' }}>
                  {note.tag}
                </span>
              )}
              <p className="text-gray-700 whitespace-pre-wrap mb-2" style={{ fontSize: '14px' }}>{truncateContent(note.content)}</p>
              <div className="flex items-center gap-1 text-sm font-medium" style={{ color: '#818181' }}>
                <Clock className="w-3 h-3" />
                <span>{getDaysAgo(note.updatedAt)}d</span>
              </div>
            </div>
          ))}
          {notes.length === 0 && !isCreating && (
            <div className="text-center py-12 text-gray-500">
              No notes yet. Create your first note!
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

CasualNotes.displayName = 'CasualNotes';

export default CasualNotes;
