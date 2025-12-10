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
import { Spinner } from "@/components/ui/spinner";

// Interface for IConfirmDelete
interface IConfirmDelete {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isDeleting?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

// ConfirmDeleteDialog Component
const ConfirmDeleteDialog = ({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete item",
  description,
  itemName = "this item",
  isDeleting = false,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
}: IConfirmDelete) => {
  // Fallback description when no custom text is provided
  const fallbackDescription = (
    <>
      This will permanently delete{" "}
      <span className="font-semibold text-foreground">{itemName}</span> from our
      servers. This action cannot be undone.
    </>
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {/* Title */}
          <AlertDialogTitle>{title}</AlertDialogTitle>

          {/* Description */}
          <AlertDialogDescription>
            {description || fallbackDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {/* Cancel */}
          <AlertDialogCancel disabled={isDeleting}>
            {cancelLabel}
          </AlertDialogCancel>

          {/* Delete action */}
          <AlertDialogAction onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Spinner className="mr-2 size-4" />
                Deleting...
              </>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDeleteDialog;
