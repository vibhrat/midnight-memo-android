
import { CasualNote } from '@/types';
import NoteCard from './NoteCard';
import EmptyState from '@/components/EmptyState';

interface NotesListProps {
  notes: CasualNote[];
  filteredNotes: CasualNote[];
  selectedTag: string;
  onNoteClick: (noteId: string) => void;
}

const NotesList = ({ notes, filteredNotes, selectedTag, onNoteClick }: NotesListProps) => {
  if (notes.length === 0) {
    return <EmptyState />;
  }

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
