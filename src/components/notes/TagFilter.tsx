
interface TagFilterProps {
  availableTags: string[];
  selectedTag: string;
  onTagSelect: (tag: string) => void;
}

const TagFilter = ({ availableTags, selectedTag, onTagSelect }: TagFilterProps) => {
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

  if (availableTags.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => onTagSelect('')}
          className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedTag === '' 
              ? 'bg-[#2A2A2A] text-[#DBDBDB]' 
              : 'bg-[#181818] text-[#9B9B9B] hover:bg-[#9B9B9B] hover:text-[#000000]'
          }`}
        >
          All
        </button>
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
              selectedTag === tag 
                ? 'bg-[#2A2A2A] text-[#DBDBDB]' 
                : 'bg-[#181818] text-[#9B9B9B] hover:bg-[#9B9B9B] hover:text-[#000000]'
            }`}
          >
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: getTagColor(tag) }}
            />
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;
