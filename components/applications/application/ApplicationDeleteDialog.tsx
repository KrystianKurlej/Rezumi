'use client'

import { ReactNode } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Application } from '../ApplicationsTable'

interface ApplicationDeleteDialogProps {
  application: Application
  onDelete: () => void
  trigger: ReactNode
}

export function ApplicationDeleteDialog({ 
  application,
  onDelete,
  trigger 
}: ApplicationDeleteDialogProps) {
  const handleDelete = () => {
    onDelete()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Application for {application.position} at {application.companyName}?
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this application? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
