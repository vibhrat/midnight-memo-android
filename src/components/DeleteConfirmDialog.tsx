
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm }: DeleteConfirmDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md mx-4">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-lg">Erase it's existence?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-3 sm:gap-3 mt-6">
          <AlertDialogCancel onClick={onClose} className="flex-1 h-12 text-base">
            Mercy
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className="flex-1 h-12 text-base bg-red-600 text-white hover:bg-red-700"
          >
            Obliterate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
