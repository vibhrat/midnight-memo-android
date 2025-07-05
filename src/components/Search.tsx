import { useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CasualNote, ShoppingList, Password } from '@/types';
import { Input } from '@/components/ui/input';
import { ArrowLeft, FileText, ShoppingCart, Lock, Clock } from 'lucide-react';

interface SearchProps {
  onBack: () => void;
  onNoteSelect?: (noteId: string) => void;
  onListSelect?: (listId: string) => void;
}

const Search = ({ onBack, onNoteSelect, onListSelect }: SearchProps) => {
  const [query, setQuery] = useState('');
  const [notes] = useLocalStorage<CasualNote[]>('casual-notes', []);
  const [lists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);
  const [passwords] = useLocalStorage<Password[]>('passwords', []);

  const getDaysAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const truncateContent = (content: string, maxLength: number = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const results: Array<{
      id: string;
      type: 'note' | 'list' | 'password';
      title: string;
      content?: string;
      date: Date;
      itemCount?: number;
    }> = [];

    // Search notes
    notes.forEach(note => {
      if (
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.tag.toLowerCase().includes(query.toLowerCase())
      ) {
        results.push({
          id: note.id,
          type: 'note',
          title: note.title,
          content: note.content,
          date: note.updatedAt,
        });
      }
    });

    // Search lists
    lists.forEach(list => {
      const itemsText = list.items.map(item => item.name).join(' ');
      if (
        list.title.toLowerCase().includes(query.toLowerCase()) ||
        itemsText.toLowerCase().includes(query.toLowerCase())
      ) {
        results.push({
          id: list.id,
          type: 'list',
          title: list.title,
          date: list.updatedAt,
          itemCount: list.items.length,
        });
      }
    });

    // Search passwords
    passwords.forEach(password => {
      if (password.title.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          id: password.id,
          type: 'password',
          title: password.title,
          date: password.updatedAt,
        });
      }
    });

    // Sort by date (most recent first)
    return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [query, notes, lists, passwords]);

  const handleResultClick = (result: typeof searchResults[0]) => {
    if (result.type === 'note' && onNoteSelect) {
      onNoteSelect(result.id);
    } else if (result.type === 'list' && onListSelect) {
      onListSelect(result.id);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <FileText size={16} className="text-blue-500" />;
      case 'list':
        return <ShoppingCart size={16} className="text-green-500" />;
      case 'password':
        return <Lock size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'note':
        return 'Note';
      case 'list':
        return 'List';
      case 'password':
        return 'Password';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 border border-[#9B9B9B] rounded-lg hover:bg-[#181818]"
          >
            <ArrowLeft size={16} className="text-[#9B9B9B]" />
          </button>
          <Input
            placeholder="Search notes, lists, and passwords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-[#181818] border-[#9B9B9B] text-[#DBDBDB] placeholder:text-[#9B9B9B]"
            autoFocus
          />
        </div>

        <div className="space-y-3">
          {searchResults.length === 0 && query.trim() && (
            <div className="text-center py-12 text-[#9B9B9B]">
              No results found for "{query}"
            </div>
          )}

          {searchResults.length === 0 && !query.trim() && (
            <div className="text-center py-12 text-[#9B9B9B]">
              Start typing to search your notes, lists, and passwords
            </div>
          )}

          {searchResults.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              className="p-4 bg-[#181818] rounded-lg cursor-pointer hover:bg-[#2A2A2A] transition-colors"
              onClick={() => handleResultClick(result)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getIcon(result.type)}
                  <h3 className="font-medium text-[#DBDBDB]">{result.title}</h3>
                </div>
                <span className="text-xs text-[#9B9B9B] bg-[#000000] px-2 py-1 rounded">
                  {getTypeLabel(result.type)}
                </span>
              </div>

              {result.content && (
                <p className="text-sm text-[#9B9B9B] mb-2">
                  {truncateContent(result.content)}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm font-medium text-[#9B9B9B]">
                  <Clock className="w-3 h-3" />
                  <span>{getDaysAgo(result.date)}d</span>
                </div>
                {result.itemCount !== undefined && (
                  <span className="text-sm font-medium text-[#9B9B9B]">
                    {result.itemCount} items
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
