
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CasualNote } from '@/types';
import NotesHeader from './notes/NotesHeader';
import TagFilter from './notes/TagFilter';
import NotesList from './notes/NotesList';
import ShareDialog from '@/components/ShareDialog';

interface CasualNotesRef {
  triggerCreate: () => void;
}

interface CasualNotesProps {
  onNoteSelect?: (noteId: string) => void;
  onSearchClick?: () => void;
  onMenuClick?: () => void;
  notes: CasualNote[];
  saveData: (data: any) => void;
}

const CasualNotes = forwardRef<CasualNotesRef, CasualNotesProps>(({ onNoteSelect, onSearchClick, onMenuClick, notes, saveData }, ref) => {
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Preload settings image when component mounts
  useEffect(() => {
    const img = new Image();
    img.src = '/lovable-uploads/0e66d0a5-0c78-4057-ae0a-31ac7f762df9.png';
  }, []);

  useImperativeHandle(ref, () => ({
    triggerCreate: async () => {
      console.log('CasualNotes triggerCreate called');
      
      try {
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
        
        // Update local data
        const newData = {
          notes: [newNote, ...notes],
          lists: JSON.parse(localStorage.getItem('shopping-lists') || '[]'),
          passwords: JSON.parse(localStorage.getItem('passwords') || '[]'),
          lastUpdated: new Date().toISOString()
        };
        
        saveData(newData);
        
        if (onNoteSelect) {
          onNoteSelect(newNote.id);
        }
      } catch (error) {
        console.error('Error creating note:', error);
      }
    }
  }));

  const handleCardClick = (noteId: string) => {
    if (onNoteSelect) {
      onNoteSelect(noteId);
    }
  };

  const handleImportClick = () => {
    setShowImportDialog(true);
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
        <NotesHeader 
          onSearchClick={onSearchClick}
          onMenuClick={onMenuClick}
          onImportClick={handleImportClick}
        />

        <TagFilter 
          availableTags={availableTags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />

        <NotesList 
          notes={notes}
          filteredNotes={filteredNotes}
          selectedTag={selectedTag}
          onNoteClick={handleCardClick}
          loading={false}
        />
      </div>

      <ShareDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        data={{}}
        type="note"
        mode="import"
      />
    </div>
  );
});

CasualNotes.displayName = 'CasualNotes';

export default CasualNotes;
