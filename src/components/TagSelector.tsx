
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
    { name: 'Note', color: '#E3F2FD', textColor: '#1976D2' },
    { name: 'Medicine', color: '#FFE8E8', textColor: '#D32F2F' },
    { name: 'Travel', color: '#E8F5E8', textColor: '#388E3C' },
    { name: 'Tech', color: '#F3E5F5', textColor: '#7B1FA2' },
    { name: 'Links', color: '#FFF3E0', textColor: '#F57C00' },
    { name: 'Contact', color: '#E0F2F1', textColor: '#00796B' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Select a tag</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 p-6">
          {tags.map((tag) => (
            <button
              key={tag.name}
              onClick={() => onSelect(tag.name)}
              className={`p-6 rounded-xl text-lg font-semibold transition-all hover:scale-105 duration-200 ${
                currentTag === tag.name ? 'ring-2 ring-gray-400' : ''
              }`}
              style={{
                backgroundColor: tag.color,
                color: tag.textColor
              }}
            >
              {tag.name}
            </button>
          ))}
        </div>
        {currentTag && (
          <div className="px-6 pb-6">
            <button
              onClick={() => onSelect('')}
              className="w-full p-4 bg-gray-100 text-gray-600 rounded-xl text-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Remove tag
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TagSelector;
