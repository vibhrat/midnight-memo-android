
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CasualNote } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit3 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface NoteDetailProps {
  noteId: string;
  onBack: () => void;
}

const NoteDetail = ({ noteId, onBack }: NoteDetailProps) => {
  const [notes, setNotes] = useLocalStorage<CasualNote[]>('casual-notes', []);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    tag: '',
    content: '',
  });

  const note = notes.find(n => n.id === noteId);

  if (!note) {
    return (
      <div className="min-h-screen bg-[#FBFAF5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Note not found</p>
          <Button onClick={onBack} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData({
      title: note.title,
      tag: note.tag,
      content: note.content,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    const now = new Date();
    setNotes(notes.map(n => 
      n.id === noteId 
        ? { ...n, ...formData, updatedAt: now }
        : n
    ));
    setIsEditing(false);
  };

  const handleDelete = () => {
    setNotes(notes.filter(n => n.id !== noteId));
    onBack();
  };

  return (
    <div className="min-h-screen bg-[#FBFAF5]">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Edit3 size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg" style={{ boxShadow: '0px 1px 4px 0px #E8E7E3' }}>
          <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
          {note.tag && (
            <span className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full mb-4">
              {note.tag}
            </span>
          )}
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{note.content}</p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Created: {new Date(note.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Updated: {new Date(note.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleDelete}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Delete Note
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Note title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Input
              placeholder="Tag (optional)"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
            />
            <Textarea
              placeholder="Write your note here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="resize-none"
            />
            <Button onClick={handleSave} className="w-full bg-black text-white hover:bg-gray-800">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoteDetail;
