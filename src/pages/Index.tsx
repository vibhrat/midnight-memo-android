
import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import CasualNotes from '@/components/CasualNotes';
import ShoppingLists from '@/components/ShoppingLists';
import Passwords from '@/components/Passwords';
import Search from '@/components/Search';
import NoteDetail from '@/components/NoteDetail';
import ListDetail from '@/components/ListDetail';
import PasswordDetail from '@/components/PasswordDetail';
import FloatingActionButton from '@/components/FloatingActionButton';
import AppMenu from '@/components/AppMenu';
import Auth from '@/components/Auth';
import Navigation from '@/components/Navigation';
import PinProtection from '@/components/PinProtection';

const Index = () => {
  const { user, loading } = useFirebaseAuth();
  const casualNotesRef = useRef<{ triggerCreate: () => void }>(null);
  const shoppingListsRef = useRef<{ triggerCreate: () => void }>(null);
  const passwordsRef = useRef<{ triggerCreate: () => void }>(null);
  
  const [currentPage, setCurrentPage] = useLocalStorage('current-page', 'notes');
  const [selectedNoteId, setSelectedNoteId] = useLocalStorage<string | null>('selected-note-id', null);
  const [selectedListId, setSelectedListId] = useLocalStorage<string | null>('selected-list-id', null);
  const [selectedPasswordId, setSelectedPasswordId] = useLocalStorage<string | null>('selected-password-id', null);
  const [searchQuery, setSearchQuery] = useLocalStorage('search-query', '');
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isPinProtected, setIsPinProtected] = useLocalStorage('pin-protected', false);
  const [isPinVerified, setIsPinVerified] = useState(false);

  // Show loading state while Firebase is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-[#9B9B9B]">Loading...</p>
        </div>
      </div>
    );
  }

  // Show PIN protection if enabled and not verified
  if (isPinProtected && !isPinVerified) {
    return <PinProtection onUnlock={() => setIsPinVerified(true)} />;
  }

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId);
    setSelectedListId(null);
    setSelectedPasswordId(null);
  };

  const handleListSelect = (listId: string) => {
    setSelectedListId(listId);
    setSelectedNoteId(null);
    setSelectedPasswordId(null);
  };

  const handlePasswordSelect = (passwordId: string) => {
    setSelectedPasswordId(passwordId);
    setSelectedNoteId(null);
    setSelectedListId(null);
  };

  const handleBack = () => {
    setSelectedNoteId(null);
    setSelectedListId(null);
    setSelectedPasswordId(null);
  };

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleMenuClick = () => {
    setShowMenu(true);
  };

  const handleFloatingActionClick = () => {
    if (currentPage === 'notes') {
      casualNotesRef.current?.triggerCreate();
    } else if (currentPage === 'shopping') {
      shoppingListsRef.current?.triggerCreate();
    } else if (currentPage === 'passwords') {
      passwordsRef.current?.triggerCreate();
    }
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
  };

  const handleMenuNavigate = (page: string) => {
    setShowMenu(false);
    if (page === 'auth') {
      setShowAuth(true);
    } else if (page === 'badge' || page === 'pin-management') {
      // Handle navigation to other pages if needed
    }
  };

  if (showAuth) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  if (showMenu) {
    return (
      <AppMenu 
        onBack={() => setShowMenu(false)}
        onNavigate={handleMenuNavigate}
      />
    );
  }

  if (showSearch) {
    return (
      <Search 
        onBack={() => setShowSearch(false)}
        onNoteSelect={handleNoteSelect}
        onListSelect={handleListSelect}
      />
    );
  }

  if (selectedNoteId) {
    return <NoteDetail noteId={selectedNoteId} onBack={handleBack} />;
  }

  if (selectedListId) {
    return <ListDetail listId={selectedListId} onBack={handleBack} />;
  }

  if (selectedPasswordId) {
    return <PasswordDetail passwordId={selectedPasswordId} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-[#000000] relative">
      {currentPage === 'notes' && (
        <CasualNotes 
          ref={casualNotesRef}
          onNoteSelect={handleNoteSelect}
          onSearchClick={handleSearchClick}
          onMenuClick={handleMenuClick}
        />
      )}
      
      {currentPage === 'shopping' && (
        <ShoppingLists 
          ref={shoppingListsRef}
          onListSelect={handleListSelect}
          onSearchClick={handleSearchClick}
        />
      )}
      
      {currentPage === 'passwords' && (
        <Passwords 
          ref={passwordsRef}
          onPasswordSelect={handlePasswordSelect}
          onSearchClick={handleSearchClick}
        />
      )}

      <FloatingActionButton onClick={handleFloatingActionClick} />
      
      <Navigation 
        activeTab={currentPage} 
        onTabChange={setCurrentPage}
      />
    </div>
  );
};

export default Index;
