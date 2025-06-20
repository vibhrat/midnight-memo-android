import { useState, useRef, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import CasualNotes from '@/components/CasualNotes';
import NoteDetail from '@/components/NoteDetail';
import ShoppingLists from '@/components/ShoppingLists';
import ListDetail from '@/components/ListDetail';
import Passwords from '@/components/Passwords';
import PasswordDetail from '@/components/PasswordDetail';
import Search from '@/components/Search';
import Settings from '@/components/Settings';
import FloatingActionButton from '@/components/FloatingActionButton';

const Index = () => {
  const [activeTab, setActiveTab] = useState('notes');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedPasswordId, setSelectedPasswordId] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const notesRef = useRef<{ triggerCreate: () => void }>(null);
  const shoppingRef = useRef<{ triggerCreate: () => void }>(null);
  const passwordsRef = useRef<{ triggerCreate: () => void }>(null);

  useEffect(() => {
    const handleNavigateToTab = (event: CustomEvent) => {
      const tabId = event.detail;
      // Reset all detail views when navigating to a tab
      setSelectedListId(null);
      setSelectedNoteId(null);
      setSelectedPasswordId(null);
      setShowSearch(false);
      setShowSettings(false);
    };

    window.addEventListener('navigate-to-tab', handleNavigateToTab as EventListener);
    return () => window.removeEventListener('navigate-to-tab', handleNavigateToTab as EventListener);
  }, []);

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
        if (!selectedPasswordId) {
          passwordsRef.current?.triggerCreate();
        }
        break;
    }
  };

  const handleListSelect = (listId: string) => {
    setSelectedListId(listId);
  };

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId);
  };

  const handlePasswordSelect = (passwordId: string) => {
    setSelectedPasswordId(passwordId);
  };

  const handleBackToLists = () => {
    setSelectedListId(null);
  };

  const handleBackToNotes = () => {
    setSelectedNoteId(null);
  };

  const handleBackToPasswords = () => {
    setSelectedPasswordId(null);
  };

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleBackFromSearch = () => {
    setShowSearch(false);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleBackFromSettings = () => {
    setShowSettings(false);
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
    if (showSettings) {
      return <Settings onBack={handleBackFromSettings} />;
    }

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
        return <CasualNotes ref={notesRef} onNoteSelect={handleNoteSelect} onSearchClick={handleSearchClick} onSettingsClick={handleSettingsClick} />;
      case 'shopping':
        if (selectedListId) {
          return <ListDetail listId={selectedListId} onBack={handleBackToLists} />;
        }
        return <ShoppingLists ref={shoppingRef} onListSelect={handleListSelect} onSearchClick={handleSearchClick} />;
      case 'passwords':
        if (selectedPasswordId) {
          return <PasswordDetail passwordId={selectedPasswordId} onBack={handleBackToPasswords} />;
        }
        return <Passwords ref={passwordsRef} onPasswordSelect={handlePasswordSelect} onSearchClick={handleSearchClick} />;
      default:
        return <CasualNotes ref={notesRef} onNoteSelect={handleNoteSelect} onSearchClick={handleSearchClick} onSettingsClick={handleSettingsClick} />;
    }
  };

  // Don't show FAB when viewing details, search, or settings
  const showFAB = !showSearch && !showSettings &&
    !(activeTab === 'shopping' && selectedListId) && 
    !(activeTab === 'notes' && selectedNoteId) &&
    !(activeTab === 'passwords' && selectedPasswordId);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {renderContent()}
      {showFAB && <FloatingActionButton onClick={handleFloatingButtonClick} />}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
