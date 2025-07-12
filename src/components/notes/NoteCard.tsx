
import React from 'react';
import { CasualNote } from '@/types';
import { Clock } from 'lucide-react';

interface NoteCardProps {
  note: CasualNote;
  onClick: () => void;
}

const NoteCard = ({ note, onClick }: NoteCardProps) => {
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

  const getDaysAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stripHtmlTags = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (!note) {
    return <div className="text-[#9B9B9B]">Note not found</div>;
  }

  return (
    <div
      onClick={onClick}
      className={`bg-[#181818] rounded-2xl p-4 cursor-pointer hover:bg-[#222222] transition-colors ${
        note.isBlurred ? 'filter blur-sm' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          {note.tag && (
            <div 
              className="inline-flex items-center px-3 py-1.5 rounded-full mb-3 gap-2" 
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
          <h3 className="text-lg font-bold text-[#DBDBDB] mb-2">{note.title || 'Untitled'}</h3>
          <p className="text-[#9B9B9B] text-sm">
            {note.content ? stripHtmlTags(note.content).slice(0, 80) + '...' : 'No content'}
          </p>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-[#9B9B9B] ml-4">
          <Clock className="w-3 h-3" />
          <span>{getDaysAgo(note.createdAt)}d</span>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
