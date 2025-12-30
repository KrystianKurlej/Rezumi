'use client'

import { ReactNode } from 'react'
import { DBTemplates } from '@/lib/db/types'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"

interface TemplateDeleteDialogProps {
  template: DBTemplates
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => Promise<void>
  trigger: ReactNode
}

export function TemplateDeleteDialog({ 
  template, 
  open, 
  onOpenChange, 
  onDelete,
  trigger 
}: TemplateDeleteDialogProps) {
  const handleDelete = async () => {
    await onDelete()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete <em>{template.name}</em>?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this template? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
