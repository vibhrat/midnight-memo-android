
interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Custom SVG Components
const NotesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M0 2C0 0.895431 0.89543 0 2 0H7.46667V16H2C0.895432 16 0 15.1046 0 14V2Z" fill="currentColor"/>
    <rect x="8.5332" width="4.26667" height="16" fill="currentColor"/>
    <rect x="13.8667" width="2.13333" height="16" fill="currentColor"/>
  </svg>
);

const ListsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M0 1C0 0.447715 0.447715 0 1 0H15C15.5523 0 16 0.447715 16 1V2H0V1Z" fill="currentColor"/>
    <rect y="7" width="16" height="2" fill="currentColor"/>
    <path d="M0 14H16V15C16 15.5523 15.5523 16 15 16H1C0.447715 16 0 15.5523 0 15V14Z" fill="currentColor"/>
  </svg>
);

const VaultIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M0 1C0 0.447715 0.447715 0 1 0H15C15.5523 0 16 0.447715 16 1V2H0V1Z" fill="currentColor"/>
    <rect y="7" width="16" height="2" fill="currentColor"/>
    <path d="M0 14H16V15C16 15.5523 15.5523 16 15 16H1C0.447715 16 0 15.5523 0 15V14Z" fill="currentColor"/>
  </svg>
);

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'notes', icon: NotesIcon },
    { id: 'shopping', icon: ListsIcon },
    { id: 'passwords', icon: VaultIcon },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    // Reset any detail views by triggering a full navigation
    window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: tabId }));
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 px-4 py-2 z-[100]"
      style={{ 
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #1D1D1D 100%)',
        backdropFilter: 'blur(2px)'
      }}
    >
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <div key={tab.id} className="flex flex-col items-center">
              <button
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-3 transition-colors ${
                  activeTab === tab.id
                    ? 'text-[#DBDBDB]'
                    : 'text-[#9B9B9B] hover:text-[#DBDBDB]'
                }`}
              >
                <IconComponent />
              </button>
              {activeTab === tab.id && (
                <div className="w-1 h-1 rounded-full bg-[#DBDBDB] -mt-1"></div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
