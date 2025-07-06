
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
      <AlertDialogContent className="w-full max-w-full mx-4 rounded-lg bg-[#181818] border-[#9B9B9B] p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-bold text-[#DBDBDB]">Erase it's existence?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-4 mt-8">
          <AlertDialogCancel onClick={onClose} className="flex-1 h-14 text-lg font-semibold bg-transparent border-[#9B9B9B] text-[#DBDBDB] hover:bg-[#000000]">
            Mercy
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className="flex-1 h-14 text-lg font-semibold bg-red-600 text-white hover:bg-red-700 border-none"
          >
            Obliterate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
