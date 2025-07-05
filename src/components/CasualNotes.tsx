
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
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Preload settings image when component mounts
  useEffect(() => {
    const img = new Image();
    img.src = '/lovable-uploads/0e66d0a5-0c78-4057-ae0a-31ac7f762df9.png';
  }, []);

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
    // Remove HTML tags from content to prevent showing </p> tags
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (textContent.length <= maxLength) return textContent;
    return textContent.substring(0, maxLength) + '...';
  };

  const getTagColor = (tag: string) => {
    const colors = {
      'Note': '#E3F2FD',
      'Medicine': '#FFEBEE', 
      'Travel': '#E8F5E8',
      'Tech': '#F3E5F5',
      'Links': '#FFF3E0',
      'Contact': '#E0F2F1'
    };
    return colors[tag as keyof typeof colors] || '#F5F5F5';
  };

  const getTagEmoji = (tag: string) => {
    const emojis = {
      'Note': '📝',
      'Medicine': '💊',
      'Travel': '✈️',
      'Tech': '💻',
      'Links': '🔗',
      'Contact': '📱'
    };
    return emojis[tag as keyof typeof emojis] || '';
  };

  const handleCardClick = (noteId: string) => {
    if (onNoteSelect) {
      onNoteSelect(noteId);
    }
  };

  // Get unique tags from notes
  const allTags = ['Note', 'Medicine', 'Travel', 'Tech', 'Links', 'Contact'];
  const availableTags = allTags.filter(tag => 
    notes.some(note => note.tag === tag)
  );

  // Filter notes based on selected tag
  const filteredNotes = selectedTag 
    ? notes.filter(note => note.tag === selectedTag)
    : notes;

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-[#DBDBDB]" style={{ fontFamily: 'IBM Plex Mono' }}>Notes</h1>
          <div className="flex gap-2">
            <button onClick={onSettingsClick} className="p-2 hover:bg-[#181818] rounded-lg">
              <Menu size={20} className="text-[#9B9B9B]" />
            </button>
            <button onClick={onSearchClick} className="p-2 hover:bg-[#181818] rounded-lg">
              <Search size={20} className="text-[#9B9B9B]" />
            </button>
          </div>
        </div>

        {/* Tag Filter Row */}
        {availableTags.length > 0 && (
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedTag('')}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedTag === '' 
                    ? 'bg-[#DBDBDB] text-[#000000]' 
                    : 'bg-[#181818] text-[#9B9B9B] hover:bg-[#9B9B9B] hover:text-[#000000]'
                }`}
              >
                All
              </button>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedTag === tag 
                      ? 'bg-[#DBDBDB] text-[#000000]' 
                      : 'bg-[#181818] text-[#9B9B9B] hover:bg-[#9B9B9B] hover:text-[#000000]'
                  }`}
                >
                  <span className="mr-1">{getTagEmoji(tag)}</span>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <div 
              key={note.id} 
              className={`p-3 bg-[#181818] rounded-lg cursor-pointer hover:bg-[#2A2A2A] transition-colors ${
                note.isBlurred 
                  ? 'backdrop-blur-sm' 
                  : ''
              }`}
              style={{ 
                filter: note.isBlurred 
                  ? 'blur(4px) saturate(180%) hue-rotate(90deg) contrast(120%)' 
                  : 'none'
              }}
              onClick={() => handleCardClick(note.id)}
            >
              <div className="mb-2">
                <h3 className="font-semibold text-[#DBDBDB]" style={{ fontSize: '16px' }}>
                  {note.title || 'Untitled'}
                </h3>
              </div>
              {note.tag && (
                <div 
                  className="inline-flex items-center px-3 py-1.5 rounded-full mb-2" 
                  style={{ 
                    fontSize: '12px',
                    backgroundColor: getTagColor(note.tag),
                    color: '#000000',
                    fontWeight: '600'
                  }}
                >
                  <span className="mr-1">{getTagEmoji(note.tag)}</span>
                  {note.tag}
                </div>
              )}
              <p className="text-[#9B9B9B] whitespace-pre-wrap mb-2" style={{ fontSize: '14px' }}>
                {truncateContent(note.content)}
              </p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#9B9B9B]">
                <Clock className="w-3 h-3" />
                <span>{getDaysAgo(note.updatedAt)}d</span>
              </div>
            </div>
          ))}
          {filteredNotes.length === 0 && selectedTag && (
            <div className="text-center py-12 text-[#9B9B9B]">
              No notes found for the selected tag.
            </div>
          )}
          {notes.length === 0 && (
            <div className="text-center py-12 text-[#9B9B9B]">
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
