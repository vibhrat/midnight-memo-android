
import { useState, useRef } from 'react';
import Navigation from '@/components/Navigation';
import CasualNotes from '@/components/CasualNotes';
import NoteDetail from '@/components/NoteDetail';
import ShoppingLists from '@/components/ShoppingLists';
import ListDetail from '@/components/ListDetail';
import Passwords from '@/components/Passwords';
import Search from '@/components/Search';
import FloatingActionButton from '@/components/FloatingActionButton';

const Index = () => {
  const [activeTab, setActiveTab] = useState('notes');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const notesRef = useRef<{ triggerCreate: () => void }>(null);
  const shoppingRef = useRef<{ triggerCreate: () => void }>(null);
  const passwordsRef = useRef<{ triggerCreate: () => void }>(null);

  const handleFloatingButtonClick = () => {
    switch (activeTab) {
      case 'notes':
        if (!selectedNoteId) {
          notesRef.current?.triggerCreate();
        }
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

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId);
  };

  const handleBackToLists = () => {
    setSelectedListId(null);
  };

  const handleBackToNotes = () => {
    setSelectedNoteId(null);
  };

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleBackFromSearch = () => {
    setShowSearch(false);
  };

  const handleSearchNoteSelect = (noteId: string) => {
    setShowSearch(false);
    setActiveTab('notes');
    setSelectedNoteId(noteId);
  };

  const handleSearchListSelect = (listId: string) => {
    setShowSearch(false);
    setActiveTab('shopping');
    setSelectedListId(listId);
  };

  const renderContent = () => {
    if (showSearch) {
      return (
        <Search 
          onBack={handleBackFromSearch}
          onNoteSelect={handleSearchNoteSelect}
          onListSelect={handleSearchListSelect}
        />
      );
    }

    switch (activeTab) {
      case 'notes':
        if (selectedNoteId) {
          return <NoteDetail noteId={selectedNoteId} onBack={handleBackToNotes} />;
        }
        return <CasualNotes ref={notesRef} onNoteSelect={handleNoteSelect} onSearchClick={handleSearchClick} />;
      case 'shopping':
        if (selectedListId) {
          return <ListDetail listId={selectedListId} onBack={handleBackToLists} />;
        }
        return <ShoppingLists ref={shoppingRef} onListSelect={handleListSelect} onSearchClick={handleSearchClick} />;
      case 'passwords':
        return <Passwords ref={passwordsRef} onSearchClick={handleSearchClick} />;
      default:
        return <CasualNotes ref={notesRef} onNoteSelect={handleNoteSelect} onSearchClick={handleSearchClick} />;
    }
  };

  // Don't show FAB when viewing details or search
  const showFAB = !showSearch && !(activeTab === 'shopping' && selectedListId) && !(activeTab === 'notes' && selectedNoteId);

  return (
    <div className="min-h-screen bg-white">
      {renderContent()}
      {showFAB && <FloatingActionButton onClick={handleFloatingButtonClick} />}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
