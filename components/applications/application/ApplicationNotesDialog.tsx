'use client'

import { ReactNode } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Application } from '@/lib/slices/applicationsSlice'

interface ApplicationNotesDialogProps {
  application: Application
  trigger: ReactNode
}

export function ApplicationNotesDialog({ 
  application,
  trigger 
}: ApplicationNotesDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Notes for {application.position} at {application.companyName}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="whitespace-pre-wrap text-sm">
            {application.notes || "No notes available."}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}