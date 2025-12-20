'use client'

import { ReactNode } from 'react'
import { DBExperience } from '@/lib/db'
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

interface ExperienceDeleteDialogProps {
  experience: DBExperience
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => Promise<void>
  trigger: ReactNode
}

export function ExperienceDeleteDialog({ 
  experience, 
  open, 
  onOpenChange, 
  onDelete,
  trigger 
}: ExperienceDeleteDialogProps) {
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
          <DialogTitle>Delete <em>{experience.title} {experience.company && `- ${experience.company}`}</em>?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this experience?
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