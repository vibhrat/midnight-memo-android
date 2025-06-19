
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CasualNote } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Search, Menu } from 'lucide-react';

interface CasualNotesRef {
  triggerCreate: () => void;
}

interface CasualNotesProps {
  onNoteSelect?: (noteId: string) => void;
  onSearchClick?: () => void;
  onSettingsClick?: () => void;
}

const CasualNotes = forwardRef<CasualNotesRef, CasualNotesProps>(({ onNoteSelect, onSearchClick, onSettingsClick }, ref) => {
  const [notes, setNotes] = useLocalStorage<CasualNote[]>('casual-notes', []);
  const [darkMode] = useLocalStorage<boolean>('dark-mode', false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
    <div className="min-h-screen bg-[#FBFAF5] dark:bg-gray-900">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-[#131010] dark:text-white" style={{ fontFamily: 'IBM Plex Mono' }}>Notes</h1>
          <div className="flex gap-2">
            <button onClick={onSettingsClick} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <Menu size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            <button onClick={onSearchClick} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <Search size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {notes.map((note) => (
            <div 
              key={note.id} 
              className={`p-3 bg-white dark:bg-gray-800 rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                note.isBlurred 
                  ? 'backdrop-blur-sm' 
                  : ''
              }`}
              style={{ 
                boxShadow: '0px 1px 4px 0px #E8E7E3',
                filter: note.isBlurred 
                  ? 'blur(4px) saturate(180%) hue-rotate(90deg) contrast(120%)' 
                  : 'none'
              }}
              onClick={() => handleCardClick(note.id)}
            >
              <div className="mb-2">
                <h3 className="font-semibold dark:text-white" style={{ fontSize: '16px' }}>
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
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-2" style={{ fontSize: '14px' }}>
                {truncateContent(note.content)}
              </p>
              <div className="flex items-center gap-1 text-sm font-medium" style={{ color: '#818181' }}>
                <Clock className="w-3 h-3" />
                <span>{getDaysAgo(note.updatedAt)}d</span>
              </div>
            </div>
          ))}
          {notes.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
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
