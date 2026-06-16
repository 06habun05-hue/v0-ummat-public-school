'use client'

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DeleteConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  title?: string
  description?: string
}

export function DeleteConfirmDialog({
  open, onClose, onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading font-black">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl font-bold text-xs uppercase tracking-widest">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-xl bg-accent text-white font-bold text-xs uppercase tracking-widest hover:bg-accent/90"
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
