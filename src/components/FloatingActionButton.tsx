
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

const FloatingActionButton = ({ onClick, className = '' }: FloatingActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={`fixed bottom-20 right-6 w-14 h-14 rounded-full bg-black text-white hover:bg-gray-800 shadow-lg z-50 ${className}`}
      size="icon"
    >
      <Plus size={24} />
    </Button>
  );
};

export default FloatingActionButton;
