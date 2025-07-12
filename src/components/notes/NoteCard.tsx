import React from 'react';
import { CasualNote } from '@/types';

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
      {note.tag && (
        <div 
          className="inline-flex items-center px-3 py-1.5 rounded-full mb-4 gap-2" 
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
      <h3 className="text-lg font-bold text-[#DBDBDB] mb-2">{note.title}</h3>
      <p className="text-[#9B9B9B]">{note.content?.slice(0, 50)}...</p>
    </div>
  );
};

export default NoteCard;
