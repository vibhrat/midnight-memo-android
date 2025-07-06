
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogPortal,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm }: DeleteConfirmDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogPortal>
        <AlertDialogOverlay 
          className="fixed inset-0"
          style={{
            background: 'rgba(19, 16, 16, 0.60)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
          }}
        />
        <AlertDialogContent 
          className="w-full max-w-xs mx-auto rounded-[32px] overflow-hidden border border-[#2F2F2F] p-0"
          style={{
            background: 'linear-gradient(180deg, rgba(47, 42, 42, 0.53) 0%, rgba(25, 25, 25, 0.48) 49.04%, #000 100%)',
          }}
        >
          <AlertDialogHeader className="pt-8 pb-4">
            <AlertDialogTitle className="text-center text-2xl font-semibold text-[#EAEAEA]">Erase the Relic?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="px-8 pb-8 flex flex-col gap-4">
            <AlertDialogAction 
              onClick={onConfirm} 
              className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 border-none"
              style={{ backgroundColor: '#272727' }}
            >
              Erase
            </AlertDialogAction>
            <AlertDialogCancel 
              onClick={onClose} 
              className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 border-none mt-0"
              style={{ backgroundColor: '#191919' }}
            >
              Keep
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
