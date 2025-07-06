
import { CasualNote } from '@/types';
import NoteCard from './NoteCard';

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
          onClick={onNoteClick}
        />
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
  );
};

export default NotesList;
