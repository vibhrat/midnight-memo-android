
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
      color: '#3B82F6',
    },
    { 
      name: 'Medicine', 
      color: '#EF4444',
    },
    { 
      name: 'Travel', 
      color: '#10B981',
    },
    { 
      name: 'Tech', 
      color: '#8B5CF6',
    },
    { 
      name: 'Links', 
      color: '#F59E0B',
    },
    { 
      name: 'Contact', 
      color: '#06B6D4',
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-full max-w-sm mx-auto rounded-3xl overflow-hidden border border-[#2A2A2A]" 
        style={{
          background: 'linear-gradient(180deg, rgba(47, 42, 42, 0.53) 0%, rgba(25, 25, 25, 0.48) 49.04%, #000 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <DialogHeader className="pt-8 pb-4">
          <DialogTitle className="text-center text-2xl font-bold text-[#DBDBDB]">Select a tag</DialogTitle>
        </DialogHeader>
        <div className="px-8 pb-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {tags.map((tag) => (
              <button
                key={tag.name}
                onClick={() => onSelect(tag.name)}
                className={`relative px-4 py-6 rounded-2xl text-base font-semibold transition-all duration-200 hover:scale-105 active:scale-95 border-2 ${
                  currentTag === tag.name ? 'border-[#645D51]' : 'border-transparent'
                }`}
                style={{
                  background: 'rgba(42, 42, 42, 0.7)',
                  backdropFilter: 'blur(5px)',
                  WebkitBackdropFilter: 'blur(5px)',
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="text-[#DBDBDB] font-semibold">{tag.name}</span>
                </div>
              </button>
            ))}
          </div>
          {currentTag && (
            <button
              onClick={() => onSelect('')}
              className="w-full p-4 rounded-2xl text-base font-semibold hover:bg-[#2A2A2A] transition-colors"
              style={{
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
                color: '#9B9B9B'
              }}
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
