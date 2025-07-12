
import { CasualNote } from '@/types';
import NoteCard from './NoteCard';
import EmptyStateIllustration from '../EmptyStateIllustration';

interface NotesListProps {
  notes: CasualNote[];
  filteredNotes: CasualNote[];
  selectedTag: string;
  onNoteClick: (noteId: string) => void;
}

const NotesList = ({ notes, filteredNotes, selectedTag, onNoteClick }: NotesListProps) => {
  return (
    <div className="space-y-3">
      {filteredNotes.map((note) => (
        <NoteCard 
          key={note.id}
          note={note}
          onClick={() => onNoteClick(note.id)}
        />
      ))}
      {filteredNotes.length === 0 && selectedTag && (
        <div className="text-center py-12 text-[#9B9B9B]">
          No notes found for the selected tag.
        </div>
      )}
      {notes.length === 0 && (
        <EmptyStateIllustration />
      )}
    </div>
  );
};

export default NotesList;
