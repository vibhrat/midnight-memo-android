
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TagSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tag: string) => void;
  currentTag?: string;
}

const TagSelector = ({ isOpen, onClose, onSelect, currentTag }: TagSelectorProps) => {
  const tags = [
    { 
      name: 'Note', 
      emoji: '📝',
      backgroundColor: '#E3F2FD',
    },
    { 
      name: 'Medicine', 
      emoji: '💊',
      backgroundColor: '#FFEBEE',
    },
    { 
      name: 'Travel', 
      emoji: '✈️',
      backgroundColor: '#E8F5E8',
    },
    { 
      name: 'Tech', 
      emoji: '💻',
      backgroundColor: '#F3E5F5',
    },
    { 
      name: 'Links', 
      emoji: '🔗',
      backgroundColor: '#FFF3E0',
    },
    { 
      name: 'Contact', 
      emoji: '📱',
      backgroundColor: '#E0F2F1',
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm mx-auto bg-[#181818] rounded-3xl overflow-hidden border-[#9B9B9B]">
        <DialogHeader className="pt-8 pb-4">
          <DialogTitle className="text-center text-2xl font-bold text-[#DBDBDB]">Select a tag</DialogTitle>
        </DialogHeader>
        <div className="px-8 pb-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {tags.map((tag) => (
              <button
                key={tag.name}
                onClick={() => onSelect(tag.name)}
                className={`relative px-4 py-6 rounded-2xl text-base font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                  currentTag === tag.name ? 'ring-2 ring-[#DBDBDB] ring-offset-2 ring-offset-[#181818]' : ''
                }`}
                style={{
                  backgroundColor: tag.backgroundColor,
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{tag.emoji}</span>
                  <span className="text-black font-semibold">{tag.name}</span>
                </div>
              </button>
            ))}
          </div>
          {currentTag && (
            <button
              onClick={() => onSelect('')}
              className="w-full p-4 bg-[#000000] text-[#9B9B9B] rounded-2xl text-base font-semibold hover:bg-[#2A2A2A] transition-colors"
            >
              Remove tag
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TagSelector;
