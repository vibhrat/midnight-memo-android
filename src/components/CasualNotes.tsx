
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
  const [formData, setFormData] = useState({
    title: '',
    tag: '',
    content: '',
  });

  useImperativeHandle(ref, () => ({
    triggerCreate: () => {
      // Create a new blank note and navigate to it
      const now = new Date();
      const newNote: CasualNote = {
        id: Date.now().toString(),
        title: '',
        tag: '',
        content: '',
        createdAt: now,
        updatedAt: now,
        isBlurred: false
      };
      setNotes([newNote, ...notes]);
      if (onNoteSelect) {
        onNoteSelect(newNote.id);
      }
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

        <div className="space-y-3">
          {notes.map((note) => (
            <div 
              key={note.id} 
              className={`p-3 bg-white rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                note.isBlurred ? 'blur-sm' : ''
              }`}
              style={{ boxShadow: '0px 1px 4px 0px #E8E7E3' }}
              onClick={() => handleCardClick(note.id)}
            >
              <div className="mb-2">
                <h3 className="font-semibold" style={{ fontSize: '16px' }}>
                  {note.title || 'Untitled'}
                </h3>
              </div>
              {note.tag && (
                <span 
                  className="inline-block px-2 py-1 rounded mb-2" 
                  style={{ 
                    fontSize: '12px',
                    backgroundColor: getTagColor(note.tag),
                    color: getTagTextColor(note.tag)
                  }}
                >
                  {note.tag}
                </span>
              )}
              <p className="text-gray-700 whitespace-pre-wrap mb-2" style={{ fontSize: '14px' }}>
                {truncateContent(note.content)}
              </p>
              <div className="flex items-center gap-1 text-sm font-medium" style={{ color: '#818181' }}>
                <Clock className="w-3 h-3" />
                <span>{getDaysAgo(note.updatedAt)}d</span>
              </div>
            </div>
          ))}
          {notes.length === 0 && (
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
