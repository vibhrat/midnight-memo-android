
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

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    // Reset any detail views by triggering a full navigation
    window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: tabId }));
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#9B9B9B] px-4 py-2">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-4 py-3 transition-colors ${
                activeTab === tab.id
                  ? 'text-[#DBDBDB] border-b-2 border-[#DBDBDB]'
                  : 'text-[#9B9B9B] hover:text-[#DBDBDB]'
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
