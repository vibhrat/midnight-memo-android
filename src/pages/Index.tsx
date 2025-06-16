
import { useState, useRef } from 'react';
import Navigation from '@/components/Navigation';
import CasualNotes from '@/components/CasualNotes';
import ShoppingLists from '@/components/ShoppingLists';
import Passwords from '@/components/Passwords';
import FloatingActionButton from '@/components/FloatingActionButton';

const Index = () => {
  const [activeTab, setActiveTab] = useState('notes');
  const notesRef = useRef<{ triggerCreate: () => void }>(null);
  const shoppingRef = useRef<{ triggerCreate: () => void }>(null);
  const passwordsRef = useRef<{ triggerCreate: () => void }>(null);

  const handleFloatingButtonClick = () => {
    switch (activeTab) {
      case 'notes':
        notesRef.current?.triggerCreate();
        break;
      case 'shopping':
        shoppingRef.current?.triggerCreate();
        break;
      case 'passwords':
        passwordsRef.current?.triggerCreate();
        break;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'notes':
        return <CasualNotes ref={notesRef} />;
      case 'shopping':
        return <ShoppingLists ref={shoppingRef} />;
      case 'passwords':
        return <Passwords ref={passwordsRef} />;
      default:
        return <CasualNotes ref={notesRef} />;
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
