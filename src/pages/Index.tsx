
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import CasualNotes from '@/components/CasualNotes';
import ShoppingLists from '@/components/ShoppingLists';
import Passwords from '@/components/Passwords';
import FloatingActionButton from '@/components/FloatingActionButton';

const Index = () => {
  const [activeTab, setActiveTab] = useState('notes');

  const handleFloatingButtonClick = () => {
    // This will trigger the add action for the current active tab
    // The logic will be handled by each component
    console.log(`Add new ${activeTab}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'notes':
        return <CasualNotes />;
      case 'shopping':
        return <ShoppingLists />;
      case 'passwords':
        return <Passwords />;
      default:
        return <CasualNotes />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderContent()}
      <FloatingActionButton onClick={handleFloatingButtonClick} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
