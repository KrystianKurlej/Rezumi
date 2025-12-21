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

interface ApplicationDeleteDialogProps {
  trigger: ReactNode
}

export function ApplicationAddNewDialog({
    trigger
}: ApplicationDeleteDialogProps) {
  const handleAddNew = () => {
    // Logic to add new application goes here
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add New Application
          </DialogTitle>
          <DialogDescription>
            Fill in the details to add a new application.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={handleAddNew}
            >
              Add Application
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}