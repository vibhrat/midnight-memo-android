
import { FileText, List, Lock } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'notes', icon: FileText },
    { id: 'shopping', icon: List },
    { id: 'passwords', icon: Lock },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 transition-colors ${
                activeTab === tab.id
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              <IconComponent size={24} />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
