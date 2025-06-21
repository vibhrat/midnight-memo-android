
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
      gradient: 'linear-gradient(135deg, #E8F4FD 0%, #B8E6FF 100%)',
      shadow: '0 4px 15px rgba(59, 130, 246, 0.15)'
    },
    { 
      name: 'Medicine', 
      emoji: '💊',
      gradient: 'linear-gradient(135deg, #FFE8E8 0%, #FFB8B8 100%)',
      shadow: '0 4px 15px rgba(239, 68, 68, 0.15)'
    },
    { 
      name: 'Travel', 
      emoji: '✈️',
      gradient: 'linear-gradient(135deg, #E8F5E8 0%, #B8E6B8 100%)',
      shadow: '0 4px 15px rgba(34, 197, 94, 0.15)'
    },
    { 
      name: 'Tech', 
      emoji: '💻',
      gradient: 'linear-gradient(135deg, #F3E8FF 0%, #D8B4FE 100%)',
      shadow: '0 4px 15px rgba(147, 51, 234, 0.15)'
    },
    { 
      name: 'Links', 
      emoji: '🔗',
      gradient: 'linear-gradient(135deg, #FFF3E0 0%, #FFCC80 100%)',
      shadow: '0 4px 15px rgba(245, 124, 0, 0.15)'
    },
    { 
      name: 'Contact', 
      emoji: '📱',
      gradient: 'linear-gradient(135deg, #E0F2F1 0%, #80CBC4 100%)',
      shadow: '0 4px 15px rgba(0, 121, 107, 0.15)'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm mx-auto bg-white rounded-3xl overflow-hidden">
        <DialogHeader className="pt-8 pb-4">
          <DialogTitle className="text-center text-2xl font-bold text-gray-800">Select a tag</DialogTitle>
        </DialogHeader>
        <div className="px-8 pb-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {tags.map((tag) => (
              <button
                key={tag.name}
                onClick={() => onSelect(tag.name)}
                className={`relative px-4 py-6 rounded-2xl text-base font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                  currentTag === tag.name ? 'ring-2 ring-gray-400 ring-offset-2' : ''
                }`}
                style={{
                  background: tag.gradient,
                  boxShadow: tag.shadow,
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{tag.emoji}</span>
                  <span className="text-gray-700">{tag.name}</span>
                </div>
              </button>
            ))}
          </div>
          {currentTag && (
            <button
              onClick={() => onSelect('')}
              className="w-full p-4 bg-gray-100 text-gray-600 rounded-2xl text-base font-semibold hover:bg-gray-200 transition-colors"
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
