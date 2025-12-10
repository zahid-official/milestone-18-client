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

// Interface for IConfirmDelete
interface IConfirmDelete {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isDeleting?: boolean;
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
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

          {/* Delete action */}
          <AlertDialogAction onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDeleteDialog;
