
import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useLocalFileSystem } from '@/hooks/useLocalFileSystem';
import { useBiometricAuth } from '@/contexts/BiometricAuthContext';
import { useLocalNotifications } from '@/hooks/useLocalNotifications';
import CasualNotes from '@/components/CasualNotes';
import ShoppingLists from '@/components/ShoppingLists';
import Passwords from '@/components/Passwords';
import Search from '@/components/Search';
import NoteDetail from '@/components/NoteDetail';
import ListDetail from '@/components/ListDetail';
import PasswordDetail from '@/components/PasswordDetail';
import FloatingActionButton from '@/components/FloatingActionButton';
import AppMenu from '@/components/AppMenu';
import BiometricLogin from '@/components/BiometricLogin';
import Navigation from '@/components/Navigation';
import PinProtection from '@/components/PinProtection';
import PinManagement from '@/components/PinManagement';
import BadgePage from '@/components/BadgePage';

const Index = () => {
  const { isAuthenticated } = useBiometricAuth();
  const { data, saveData } = useLocalFileSystem();
  const { scheduleReminder } = useLocalNotifications();
  
  const casualNotesRef = useRef<{ triggerCreate: () => void }>(null);
  const shoppingListsRef = useRef<{ triggerCreate: () => void }>(null);
  const passwordsRef = useRef<{ triggerCreate: () => void }>(null);
  
  const [currentPage, setCurrentPage] = useLocalStorage('current-page', 'notes');
  const [selectedNoteId, setSelectedNoteId] = useLocalStorage<string | null>('selected-note-id', null);
  const [selectedListId, setSelectedListId] = useLocalStorage<string | null>('selected-list-id', null);
  const [selectedPasswordId, setSelectedPasswordId] = useLocalStorage<string | null>('selected-password-id', null);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentMenuPage, setCurrentMenuPage] = useState<string>('');
  const [isPinProtected, setIsPinProtected] = useLocalStorage('pin-protected', false);
  const [isPinVerified, setIsPinVerified] = useState(false);

  // Handler functions
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

  const handleFloatingActionClick = () => {
    if (currentPage === 'notes') {
      casualNotesRef.current?.triggerCreate();
    } else if (currentPage === 'shopping') {
      shoppingListsRef.current?.triggerCreate();
    } else if (currentPage === 'passwords') {
      passwordsRef.current?.triggerCreate();
    }
  };

  // Show PIN protection if enabled and not verified
  if (isPinProtected && !isPinVerified && isAuthenticated) {
    return <PinProtection onUnlock={() => setIsPinVerified(true)} />;
  }

  // Show biometric login if not authenticated
  if (!isAuthenticated) {
    return <BiometricLogin onSuccess={() => {}} />;
  }

  // Show menu pages
  if (showMenu) {
    if (currentMenuPage === 'pin-management') {
      return (
        <PinManagement 
          onBack={() => {
            setShowMenu(false);
            setCurrentMenuPage('');
          }}
        />
      );
    }
    
    if (currentMenuPage === 'badge') {
      return (
        <BadgePage 
          onBack={() => {
            setShowMenu(false);
            setCurrentMenuPage('');
          }}
        />
      );
    }

    return (
      <AppMenu 
        onBack={() => {
          setShowMenu(false);
          setCurrentMenuPage('');
        }}
        onNavigate={(page) => {
          setCurrentMenuPage(page);
        }}
        data={data}
        saveData={saveData}
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
    return (
      <NoteDetail 
        noteId={selectedNoteId} 
        onBack={handleBack}
        notes={data.notes}
        saveData={saveData}
        scheduleReminder={scheduleReminder}
      />
    );
  }

  if (selectedListId) {
    return (
      <ListDetail 
        listId={selectedListId} 
        onBack={handleBack}
        lists={data.lists}
        saveData={saveData}
      />
    );
  }

  if (selectedPasswordId) {
    return (
      <PasswordDetail 
        passwordId={selectedPasswordId} 
        onBack={handleBack}
        passwords={data.passwords}
        saveData={saveData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] relative">
      {currentPage === 'notes' && (
        <CasualNotes 
          ref={casualNotesRef}
          onNoteSelect={handleNoteSelect}
          onSearchClick={() => setShowSearch(true)}
          onMenuClick={() => setShowMenu(true)}
          notes={data.notes}
          saveData={saveData}
        />
      )}
      
      {currentPage === 'shopping' && (
        <ShoppingLists 
          ref={shoppingListsRef}
          onListSelect={handleListSelect}
          onSearchClick={() => setShowSearch(true)}
        />
      )}
      
      {currentPage === 'passwords' && (
        <Passwords 
          ref={passwordsRef}
          onPasswordSelect={handlePasswordSelect}
          onSearchClick={() => setShowSearch(true)}
          passwords={data.passwords}
          saveData={saveData}
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
