
import { useState, useRef, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import CasualNotes from '@/components/CasualNotes';
import NoteDetail from '@/components/NoteDetail';
import ShoppingLists from '@/components/ShoppingLists';
import ListDetail from '@/components/ListDetail';
import Passwords from '@/components/Passwords';
import PasswordDetail from '@/components/PasswordDetail';
import Search from '@/components/Search';
import AppMenu from '@/components/AppMenu';
import PinProtection from '@/components/PinProtection';
import PinManagement from '@/components/PinManagement';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('notes');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedPasswordId, setSelectedPasswordId] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPinManagement, setShowPinManagement] = useState(false);
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [savedPin] = useLocalStorage('app-pin', '');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['main']);
  const notesRef = useRef<{ triggerCreate: () => void }>(null);
  const shoppingRef = useRef<{ triggerCreate: () => void }>(null);
  const passwordsRef = useRef<{ triggerCreate: () => void }>(null);

  const handleVaultUnlock = () => {
    setIsVaultUnlocked(true);
  };

  // Reset vault unlock when switching away from passwords tab
  useEffect(() => {
    if (activeTab !== 'passwords') {
      setIsVaultUnlocked(false);
    }
  }, [activeTab]);

  useEffect(() => {
    const handleNavigateToTab = (event: CustomEvent) => {
      const tabId = event.detail;
      // Reset all detail views when navigating to a tab
      setSelectedListId(null);
      setSelectedNoteId(null);
      setSelectedPasswordId(null);
      setShowSearch(false);
      setShowMenu(false);
      setShowPinManagement(false);
      setNavigationHistory(['main']);
    };

    window.addEventListener('navigate-to-tab', handleNavigateToTab as EventListener);
    return () => window.removeEventListener('navigate-to-tab', handleNavigateToTab as EventListener);
  }, []);

  // Handle Android back button
  useEffect(() => {
    const handleBackButton = () => {
      if (navigationHistory.length > 1) {
        const newHistory = [...navigationHistory];
        newHistory.pop();
        const previousPage = newHistory[newHistory.length - 1];
        
        setNavigationHistory(newHistory);
        
        switch (previousPage) {
          case 'main':
            setSelectedListId(null);
            setSelectedNoteId(null);
            setSelectedPasswordId(null);
            setShowSearch(false);
            setShowMenu(false);
            setShowPinManagement(false);
            break;
          case 'menu':
            setShowMenu(true);
            setShowPinManagement(false);
            break;
          case 'search':
            setShowSearch(true);
            setSelectedListId(null);
            setSelectedNoteId(null);
            break;
        }
        return true;
      }
      return false;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleBackButton();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // For mobile back gesture
    const handlePopState = () => {
      handleBackButton();
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigationHistory]);

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
        if (!selectedPasswordId && (isVaultUnlocked || !savedPin)) {
          passwordsRef.current?.triggerCreate();
        }
        break;
    }
  };

  const handleListSelect = (listId: string) => {
    setSelectedListId(listId);
    setNavigationHistory(prev => [...prev, 'list-detail']);
  };

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId);
    setNavigationHistory(prev => [...prev, 'note-detail']);
  };

  const handlePasswordSelect = (passwordId: string) => {
    setSelectedPasswordId(passwordId);
    setNavigationHistory(prev => [...prev, 'password-detail']);
  };

  const handleBackToLists = () => {
    setSelectedListId(null);
    setNavigationHistory(prev => prev.slice(0, -1));
  };

  const handleBackToNotes = () => {
    setSelectedNoteId(null);
    setNavigationHistory(prev => prev.slice(0, -1));
  };

  const handleBackToPasswords = () => {
    setSelectedPasswordId(null);
    setNavigationHistory(prev => prev.slice(0, -1));
  };

  const handleSearchClick = () => {
    setShowSearch(true);
    setNavigationHistory(prev => [...prev, 'search']);
  };

  const handleBackFromSearch = () => {
    setShowSearch(false);
    setNavigationHistory(prev => prev.slice(0, -1));
  };

  const handleMenuClick = () => {
    setShowMenu(true);
    setNavigationHistory(prev => [...prev, 'menu']);
  };

  const handleBackFromMenu = () => {
    setShowMenu(false);
    setNavigationHistory(prev => prev.slice(0, -1));
  };

  const handleNavigate = (page: string) => {
    if (page === 'pin-management') {
      setShowPinManagement(true);
      setShowMenu(false);
      setNavigationHistory(prev => [...prev, 'pin-management']);
    }
  };

  const handleBackFromPin = () => {
    setShowPinManagement(false);
    setShowMenu(true);
    setNavigationHistory(prev => prev.slice(0, -1));
  };

  const handleSearchNoteSelect = (noteId: string) => {
    setShowSearch(false);
    setActiveTab('notes');
    setSelectedNoteId(noteId);
    setNavigationHistory(prev => [...prev.slice(0, -1), 'note-detail']);
  };

  const handleSearchListSelect = (listId: string) => {
    setShowSearch(false);
    setActiveTab('shopping');
    setSelectedListId(listId);
    setNavigationHistory(prev => [...prev.slice(0, -1), 'list-detail']);
  };

  const renderContent = () => {
    if (showPinManagement) {
      return <PinManagement onBack={handleBackFromPin} />;
    }

    if (showMenu) {
      return (
        <AppMenu 
          onBack={handleBackFromMenu} 
          onNavigate={handleNavigate}
        />
      );
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
        return <CasualNotes ref={notesRef} onNoteSelect={handleNoteSelect} onSearchClick={handleSearchClick} onMenuClick={handleMenuClick} />;
      case 'shopping':
        if (selectedListId) {
          return <ListDetail listId={selectedListId} onBack={handleBackToLists} />;
        }
        return <ShoppingLists ref={shoppingRef} onListSelect={handleListSelect} onSearchClick={handleSearchClick} />;
      case 'passwords':
        // Show PIN protection only for passwords/vault section
        if (savedPin && !isVaultUnlocked) {
          return <PinProtection onUnlock={handleVaultUnlock} />;
        }
        if (selectedPasswordId) {
          return <PasswordDetail passwordId={selectedPasswordId} onBack={handleBackToPasswords} />;
        }
        return <Passwords ref={passwordsRef} onPasswordSelect={handlePasswordSelect} onSearchClick={handleSearchClick} />;
      default:
        return <CasualNotes ref={notesRef} onNoteSelect={handleNoteSelect} onSearchClick={handleSearchClick} onMenuClick={handleMenuClick} />;
    }
  };

  // Don't show FAB when viewing details, search, menu, or pin management
  const showFAB = !showSearch && !showMenu && !showPinManagement &&
    !(activeTab === 'shopping' && selectedListId) && 
    !(activeTab === 'notes' && selectedNoteId) &&
    !(activeTab === 'passwords' && selectedPasswordId) &&
    !(activeTab === 'passwords' && savedPin && !isVaultUnlocked);

  return (
    <div className="min-h-screen bg-[#000000]">
      {renderContent()}
      {showFAB && <FloatingActionButton onClick={handleFloatingButtonClick} />}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
