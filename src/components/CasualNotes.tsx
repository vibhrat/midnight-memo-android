
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFirebaseNotes } from '@/hooks/useFirebaseNotes';
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
}

const CasualNotes = forwardRef<CasualNotesRef, CasualNotesProps>(({ onNoteSelect, onSearchClick, onMenuClick }, ref) => {
  const { notes, loading, createNote } = useFirebaseNotes();
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
      const newNote = {
        title: '',
        tag: '',
        content: '',
        createdAt: now,
        updatedAt: now,
        isBlurred: false
      };
      createNote(newNote);
      
      // Navigate to the new note (we'll need to get the ID from Firebase)
      setTimeout(() => {
        if (notes.length > 0 && onNoteSelect) {
          onNoteSelect(notes[0].id);
        }
      }, 500);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-[#9B9B9B]">Loading notes...</p>
        </div>
      </div>
    );
  }

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
