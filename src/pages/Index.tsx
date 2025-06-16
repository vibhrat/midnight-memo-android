
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import CasualNotes from '@/components/CasualNotes';
import ShoppingLists from '@/components/ShoppingLists';
import Passwords from '@/components/Passwords';

const Index = () => {
  const [activeTab, setActiveTab] = useState('notes');

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
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
