
import { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import CasualNotes from '@/components/CasualNotes';
import ShoppingLists from '@/components/ShoppingLists';
import Passwords from '@/components/Passwords';
import NoteDetail from '@/components/NoteDetail';
import ListDetail from '@/components/ListDetail';
import PasswordDetail from '@/components/PasswordDetail';
import Search from '@/components/Search';
import AppMenu from '@/components/AppMenu';
import PinManagement from '@/components/PinManagement';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useAppDataBackup } from '@/hooks/useAppDataBackup';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

interface CasualNotesRef {
  triggerCreate: () => void;
}

interface ShoppingListsRef {
  triggerCreate: () => void;
}

interface PasswordsRef {
  triggerCreate: () => void;
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState('casual-notes');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedPasswordId, setSelectedPasswordId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageHistory, setPageHistory] = useState<string[]>(['casual-notes']);

  const casualNotesRef = useRef<CasualNotesRef>(null);
  const shoppingListsRef = useRef<ShoppingListsRef>(null);
  const passwordsRef = useRef<PasswordsRef>(null);

  // Initialize automatic backup
  useAppDataBackup();

  // Handle Android back button
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const setupBackButton = async () => {
        App.addListener('backButton', ({ canGoBack }) => {
          if (pageHistory.length > 1) {
            // Go back in app navigation
            const newHistory = [...pageHistory];
            newHistory.pop(); // Remove current page
            const previousPage = newHistory[newHistory.length - 1];
            
            setPageHistory(newHistory);
            setCurrentPage(previousPage);
            
            // Clear any selected items when going back
            setSelectedNoteId(null);
            setSelectedListId(null);
            setSelectedPasswordId(null);
            setSearchQuery('');
          } else {
            // Exit app if no more history
            App.exitApp();
          }
        });
      };
      
      setupBackButton();
    }
  }, [pageHistory]);

  const navigateToPage = (page: string, addToHistory = true) => {
    if (addToHistory) {
      setPageHistory(prev => [...prev, page]);
    }
    setCurrentPage(page);
  };

  const handleBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop(); // Remove current page
      const previousPage = newHistory[newHistory.length - 1];
      
      setPageHistory(newHistory);
      setCurrentPage(previousPage);
      
      // Clear any selected items when going back
      setSelectedNoteId(null);
      setSelectedListId(null);
      setSelectedPasswordId(null);
      setSearchQuery('');
    }
  };

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId);
    navigateToPage('note-detail');
  };

  const handleListSelect = (listId: string) => {
    setSelectedListId(listId);
    navigateToPage('list-detail');
  };

  const handlePasswordSelect = (passwordId: string) => {
    setSelectedPasswordId(passwordId);
    navigateToPage('password-detail');
  };

  const handleSearchClick = () => {
    navigateToPage('search');
  };

  const handleMenuClick = () => {
    navigateToPage('menu');
  };

  const handleFloatingActionButtonClick = () => {
    // Trigger data backup when creating new items
    window.dispatchEvent(new CustomEvent('app-data-changed'));

    switch (currentPage) {
      case 'casual-notes':
        casualNotesRef.current?.triggerCreate();
        break;
      case 'shopping-lists':
        shoppingListsRef.current?.triggerCreate();
        break;
      case 'passwords':
        passwordsRef.current?.triggerCreate();
        break;
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'casual-notes':
        return (
          <CasualNotes 
            ref={casualNotesRef} 
            onNoteSelect={handleNoteSelect}
            onSearchClick={handleSearchClick}
          />
        );
      case 'shopping-lists':
        return (
          <ShoppingLists 
            ref={shoppingListsRef}
            onListSelect={handleListSelect}
            onSearchClick={handleSearchClick}
          />
        );
      case 'passwords':
        return (
          <Passwords 
            ref={passwordsRef}
            onPasswordSelect={handlePasswordSelect}
            onSearchClick={handleSearchClick}
          />
        );
      case 'note-detail':
        return selectedNoteId ? (
          <NoteDetail 
            noteId={selectedNoteId} 
            onBack={handleBack}
          />
        ) : null;
      case 'list-detail':
        return selectedListId ? (
          <ListDetail 
            listId={selectedListId} 
            onBack={handleBack}
          />
        ) : null;
      case 'password-detail':
        return selectedPasswordId ? (
          <PasswordDetail 
            passwordId={selectedPasswordId} 
            onBack={handleBack}
          />
        ) : null;
      case 'search':
        return (
          <Search 
            onBack={handleBack}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNoteSelect={handleNoteSelect}
            onListSelect={handleListSelect}
            onPasswordSelect={handlePasswordSelect}
          />
        );
      case 'menu':
        return (
          <AppMenu 
            onBack={handleBack}
            onNavigate={(page) => navigateToPage(page)}
          />
        );
      case 'pin-management':
        return (
          <PinManagement 
            onBack={handleBack}
          />
        );
      default:
        return (
          <CasualNotes 
            ref={casualNotesRef}
            onNoteSelect={handleNoteSelect}
            onSearchClick={handleSearchClick}
          />
        );
    }
  };

  const shouldShowNavigation = !['note-detail', 'list-detail', 'password-detail', 'search', 'menu', 'pin-management'].includes(currentPage);
  const shouldShowFAB = ['casual-notes', 'shopping-lists', 'passwords'].includes(currentPage);

  return (
    <div className="relative">
      {renderCurrentPage()}
      
      {shouldShowNavigation && (
        <Navigation 
          currentPage={currentPage} 
          onPageChange={(page) => {
            setCurrentPage(page);
            setPageHistory([page]); // Reset history when using navigation
          }}
          onMenuClick={handleMenuClick}
        />
      )}
      
      {shouldShowFAB && (
        <FloatingActionButton onClick={handleFloatingActionButtonClick} />
      )}
    </div>
  );
};

export default Index;
