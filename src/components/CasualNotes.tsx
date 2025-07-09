
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Search, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasualNote } from '@/types';
import { Badge } from '@/components/ui/badge';
import TagSelector from './TagSelector';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import ShareDialog from './ShareDialog';

interface CasualNotesProps {
  onBack: () => void;
  onNoteClick: (note: CasualNote) => void;
  onAddNote: () => void;
  onSearch: () => void;
}

const CasualNotes = ({ onBack, onNoteClick, onAddNote, onSearch }: CasualNotesProps) => {
  const [notes, setNotes] = useState<CasualNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<CasualNote[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<CasualNote | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [noteToShare, setNoteToShare] = useState<CasualNote | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('casual_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (selectedTag === 'all') {
      setFilteredNotes(notes);
    } else {
      setFilteredNotes(notes.filter(note => note.tag === selectedTag));
    }
  }, [notes, selectedTag]);

  const handleDeleteNote = (note: CasualNote) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!noteToDelete || !user) return;

    try {
      const { error } = await supabase
        .from('casual_notes')
        .delete()
        .eq('id', noteToDelete.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotes(notes.filter(note => note.id !== noteToDelete.id));
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  const handleShareNote = (note: CasualNote) => {
    setNoteToShare(note);
    setShareDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-2 border border-[#9B9B9B] rounded-lg hover:bg-[#181818] mr-4"
            >
              <ArrowLeft size={22} className="text-[#9B9B9B]" />
            </button>
            <h1 className="text-xl font-bold text-[#DBDBDB]">Casual Notes</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onSearch}
              className="p-2 border border-[#9B9B9B] rounded-lg hover:bg-[#181818]"
            >
              <Search size={22} className="text-[#9B9B9B]" />
            </button>
            <button
              onClick={onAddNote}
              className="p-2 border border-[#9B9B9B] rounded-lg hover:bg-[#181818]"
            >
              <Plus size={22} className="text-[#9B9B9B]" />
            </button>
          </div>
        </div>

        {/* Tag Filter */}
        <TagSelector
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          notes={notes}
        />

        {/* Notes List */}
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-lg border border-[#2F2F2F] bg-[#1A1A1A] hover:bg-[#2A2A2A] transition-colors cursor-pointer"
              onClick={() => onNoteClick(note)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-[#DBDBDB]">{note.title}</h3>
                  {note.tag && (
                    <Badge variant={note.tag.toLowerCase() as any} tag={note.tag}>
                      {note.tag}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareNote(note);
                    }}
                    className="p-1 hover:bg-[#3A3A3A] rounded"
                  >
                    <Share2 size={16} className="text-[#9B9B9B]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note);
                    }}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-[#9B9B9B] text-sm line-clamp-2">
                {note.content}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-[#666666]">
                  {formatDate(note.created_at)}
                </span>
                {note.is_blurred && (
                  <span className="text-xs text-[#666666] bg-[#2F2F2F] px-2 py-1 rounded">
                    Blurred
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#9B9B9B] text-lg">No notes found</p>
            <p className="text-[#666666] text-sm mt-2">
              {selectedTag === 'all' 
                ? "Create your first note to get started"
                : `No notes found with tag "${selectedTag}"`
              }
            </p>
          </div>
        )}
      </div>

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
      />

      <ShareDialog
        isOpen={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        data={noteToShare}
        type="note"
      />
    </div>
  );
};

export default CasualNotes;
