import { AlertDialog, Button } from "@heroui/react";
import type { ConfirmDialogProps } from "@/components/ui/ui.interfaces";

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isConfirmLoading = false,
  isDestructive = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AlertDialog>
      <AlertDialog.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <AlertDialog.Container size="sm">
          <AlertDialog.Dialog>
            <AlertDialog.Header className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
              <AlertDialog.Icon status={isDestructive ? "danger" : "warning"} />
              <div className="space-y-1">
                <AlertDialog.Heading>{title}</AlertDialog.Heading>
                {description ? <p className="text-sm text-muted">{description}</p> : null}
              </div>
            </AlertDialog.Header>
            <AlertDialog.Footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <AlertDialog.CloseTrigger>
                <Button variant="secondary" isDisabled={isConfirmLoading}>
                  {cancelLabel}
                </Button>
              </AlertDialog.CloseTrigger>
              <Button
                variant={isDestructive ? "danger" : "primary"}
                isDisabled={isConfirmLoading}
                onPress={handleConfirm}
              >
                {confirmLabel}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
