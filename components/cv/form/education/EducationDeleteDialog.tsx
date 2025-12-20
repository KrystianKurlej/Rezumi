'use client'

import { ReactNode } from 'react'
import { DBEducation } from '@/lib/db'
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

interface EducationDeleteDialogProps {
  education: DBEducation
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => Promise<void>
  trigger: ReactNode
}

export function EducationDeleteDialog({ 
  education, 
  open, 
  onOpenChange, 
  onDelete,
  trigger 
}: EducationDeleteDialogProps) {
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
          <DialogTitle>Delete <em>{education.degree} in {education.fieldOfStudy}</em>?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this education entry?
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