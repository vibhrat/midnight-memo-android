import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CasualNote } from '@/types';
import NotesHeader from './notes/NotesHeader';
import TagFilter from './notes/TagFilter';
import NotesList from './notes/NotesList';
import ImportDialog from './ImportDialog';
import BackgroundGrid from './BackgroundGrid';

interface CasualNotesRef {
  triggerCreate: () => void;
}

interface CasualNotesProps {
  onNoteSelect?: (noteId: string) => void;
  onSearchClick?: () => void;
  onMenuClick?: () => void;
}

const CasualNotes = forwardRef<CasualNotesRef, CasualNotesProps>(({ onNoteSelect, onSearchClick, onMenuClick }, ref) => {
  const [notes, setNotes] = useLocalStorage<CasualNote[]>('casual-notes', []);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showImportDialog, setShowImportDialog] = useState(false);

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
    <div className="min-h-screen bg-[#000000] relative">
      <BackgroundGrid />
      <div className="max-w-2xl mx-auto p-4 pb-20 relative z-10">
        <NotesHeader 
          onSearchClick={onSearchClick}
          onMenuClick={onMenuClick}
          onImportClick={() => setShowImportDialog(true)}
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
        />

        <ImportDialog
          isOpen={showImportDialog}
          onClose={() => setShowImportDialog(false)}
          type="note"
        />
      </div>
    </div>
  );
});

CasualNotes.displayName = 'CasualNotes';

export default CasualNotes;
