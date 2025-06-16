
import { useState } from 'react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'notes', label: 'Notes' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'passwords', label: 'Passwords' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
