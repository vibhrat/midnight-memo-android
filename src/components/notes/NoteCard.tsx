
import { Clock } from 'lucide-react';
import { CasualNote } from '@/types';

interface NoteCardProps {
  note: CasualNote;
  onClick: (noteId: string) => void;
}

const NoteCard = ({ note, onClick }: NoteCardProps) => {
  const getDaysAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (textContent.length <= maxLength) return textContent;
    return textContent.substring(0, maxLength) + '...';
  };

  const getTagColor = (tag: string) => {
    const colors = {
      'Note': '#3B82F6',
      'Medicine': '#EF4444', 
      'Travel': '#10B981',
      'Tech': '#8B5CF6',
      'Links': '#F59E0B',
      'Contact': '#06B6D4'
    };
    return colors[tag as keyof typeof colors] || '#6B7280';
  };

  return (
    <div 
      className={`p-3 bg-[#181818] rounded-lg cursor-pointer hover:bg-[#2A2A2A] transition-colors ${
        note.is_blurred 
          ? 'backdrop-blur-sm' 
          : ''
      }`}
      style={{ 
        filter: note.is_blurred 
          ? 'blur(4px) saturate(180%) hue-rotate(90deg) contrast(120%)' 
          : 'none'
      }}
      onClick={() => onClick(note.id)}
    >
      <div className="mb-2">
        <h3 className="font-semibold text-[#DBDBDB]" style={{ fontSize: '16px' }}>
          {note.title || 'Untitled'}
        </h3>
      </div>
      {note.tag && (
        <div 
          className="inline-flex items-center px-3 py-1.5 rounded-full mb-2 gap-2" 
          style={{ 
            fontSize: '12px',
            backgroundColor: '#2A2A2A',
            color: '#DBDBDB',
            fontWeight: '600'
          }}
        >
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: getTagColor(note.tag) }}
          />
          {note.tag}
        </div>
      )}
      <p 
        className="text-[#9B9B9B] mb-2 break-words overflow-wrap-anywhere" 
        style={{ 
          fontSize: '14px',
          wordBreak: 'break-word',
          overflowWrap: 'anywhere'
        }}
      >
        {truncateContent(note.content || '')}
      </p>
      <div className="flex items-center gap-1 text-sm font-medium text-[#9B9B9B]">
        <Clock className="w-3 h-3" />
        <span>{getDaysAgo(note.updated_at)}d</span>
      </div>
    </div>
  );
};

export default NoteCard;
