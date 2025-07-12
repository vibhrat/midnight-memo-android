
import { CasualNote } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface NoteCardProps {
  note: CasualNote;
  onClick: (noteId: string) => void;
}

const tagColors = {
  'Note': '#F2CB2F',
  'Medicine': '#FF6B6B',
  'Travel': '#4ECDC4',
  'Tech': '#45B7D1',
  'Links': '#96CEB4',
  'Contact': '#FECA57'
};

const NoteCard = ({ note, onClick }: NoteCardProps) => {
  const getDaysAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleClick = () => {
    onClick(note.id);
  };

  return (
    <Card 
      className="cursor-pointer hover:bg-[#2A2A2A] transition-colors bg-[#181818] border-0 rounded-lg"
      onClick={handleClick}
    >
      <CardContent className="p-4 py-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {note.tag && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1A1A1A]">
                  <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: tagColors[note.tag as keyof typeof tagColors] || '#9B9B9B' }}
                  ></div>
                  <span className="text-xs font-medium text-[#9B9B9B]">{note.tag}</span>
                </div>
              )}
            </div>
            <h3 className="text-base font-bold text-[#DBDBDB] mb-1 line-clamp-1">
              {note.title || 'Untitled Note'}
            </h3>
            {note.content && (
              <p className="text-sm text-[#9B9B9B] line-clamp-2 mb-2">
                {note.content.replace(/<[^>]*>/g, '').substring(0, 100)}
              </p>
            )}
            <div className="flex items-center gap-1 text-xs font-medium text-[#9B9B9B]">
              <Clock className="w-3 h-3" />
              <span>{getDaysAgo(note.createdAt)}d</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
