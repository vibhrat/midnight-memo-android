
import { CasualNote } from '@/types';
import NoteCard from './NoteCard';
import EmptyState from '@/components/EmptyState';

interface NotesListProps {
  notes: CasualNote[];
  filteredNotes: CasualNote[];
  selectedTag: string;
  onNoteClick: (noteId: string) => void;
  loading?: boolean;
}

const NotesList = ({ notes, filteredNotes, selectedTag, onNoteClick, loading }: NotesListProps) => {
  // Show loading state only for the first few seconds
  if (loading && notes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-[#9B9B9B]">Loading your notes...</p>
        </div>
      </div>
    );
  }

  // Show empty state when no notes exist at all
  if (notes.length === 0) {
    return <EmptyState />;
  }

  // Show filtered empty state when tag filter returns no results
  if (filteredNotes.length === 0 && selectedTag) {
    return (
      <div className="text-center py-8">
        <p className="text-[#9B9B9B]">No notes found for "{selectedTag}" tag</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredNotes.map((note) => (
        <NoteCard 
          key={note.id} 
          note={note} 
          onClick={() => onNoteClick(note.id)} 
        />
      ))}
    </div>
  );
};

export default NotesList;
