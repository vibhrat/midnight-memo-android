
import { Search, Menu, MoreVertical } from 'lucide-react';

interface NotesHeaderProps {
  onSearchClick?: () => void;
  onMenuClick?: () => void;
}

const NotesHeader = ({ onSearchClick, onMenuClick }: NotesHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-extrabold text-[#DBDBDB]" style={{ fontFamily: 'IBM Plex Mono' }}>
        Notes
      </h1>
      <div className="flex gap-2">
        <button onClick={onMenuClick} className="p-2 hover:bg-[#181818] rounded-lg">
          <MoreVertical size={20} className="text-[#9B9B9B]" />
        </button>
        <button onClick={onSearchClick} className="p-2 hover:bg-[#181818] rounded-lg">
          <Search size={20} className="text-[#9B9B9B]" />
        </button>
      </div>
    </div>
  );
};

export default NotesHeader;
