
import { useState, useRef } from 'react';
import Navigation from '@/components/Navigation';
import CasualNotes from '@/components/CasualNotes';
import ShoppingLists from '@/components/ShoppingLists';
import ListDetail from '@/components/ListDetail';
import Passwords from '@/components/Passwords';
import FloatingActionButton from '@/components/FloatingActionButton';

const Index = () => {
  const [activeTab, setActiveTab] = useState('notes');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const notesRef = useRef<{ triggerCreate: () => void }>(null);
  const shoppingRef = useRef<{ triggerCreate: () => void }>(null);
  const passwordsRef = useRef<{ triggerCreate: () => void }>(null);

  const handleFloatingButtonClick = () => {
    switch (activeTab) {
      case 'notes':
        notesRef.current?.triggerCreate();
        break;
      case 'shopping':
        if (!selectedListId) {
          shoppingRef.current?.triggerCreate();
        }
        break;
      case 'passwords':
        passwordsRef.current?.triggerCreate();
        break;
    }
  };

  const handleListSelect = (listId: string) => {
    setSelectedListId(listId);
  };

  const handleBackToLists = () => {
    setSelectedListId(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'notes':
        return <CasualNotes ref={notesRef} />;
      case 'shopping':
        if (selectedListId) {
          return <ListDetail listId={selectedListId} onBack={handleBackToLists} />;
        }
        return <ShoppingLists ref={shoppingRef} onListSelect={handleListSelect} />;
      case 'passwords':
        return <Passwords ref={passwordsRef} />;
      default:
        return <CasualNotes ref={notesRef} />;
    }
  };

  // Don't show FAB when viewing list details
  const showFAB = !(activeTab === 'shopping' && selectedListId);

  return (
    <div className="min-h-screen bg-white">
      {renderContent()}
      {showFAB && <FloatingActionButton onClick={handleFloatingButtonClick} />}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
