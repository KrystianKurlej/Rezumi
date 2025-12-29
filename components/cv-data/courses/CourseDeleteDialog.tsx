'use client'

import { ReactNode } from 'react'
import { DBCourse } from '@/lib/db'
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

interface CourseDeleteDialogProps {
  course: DBCourse
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => Promise<void>
  trigger: ReactNode
}

export function CourseDeleteDialog({ 
  course, 
  open, 
  onOpenChange, 
  onDelete,
  trigger 
}: CourseDeleteDialogProps) {
  const handleDelete = async () => {
    try {
      await onDelete()
      onOpenChange(false)
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Course</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{course.courseName}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
