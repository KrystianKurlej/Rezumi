'use client'

import { useState, ReactNode } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Application } from '../ApplicationsTable'

interface ApplicationEditDialogProps {
  application: Application
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (updatedApplication: Application) => void
  trigger: ReactNode
}

export function ApplicationEditDialog({ 
  application,
  open,
  onOpenChange,
  onUpdate,
  trigger 
}: ApplicationEditDialogProps) {
  const [editingApplication, setEditingApplication] = useState<Application | null>(null)

  const handleEditChange = (field: keyof Application, value: string) => {
    setEditingApplication((prev: Application | null) => ({
      ...prev!,
      [field]: value
    }))
  }

  const handleEditSubmit = () => {
    if (!editingApplication) return
    
    onUpdate(editingApplication)
    setEditingApplication(null)
    onOpenChange(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setEditingApplication({ ...application })
    } else {
      setEditingApplication(null)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Edit Application: <em>{application.position} - {application.companyName}</em>
          </DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor={`applicationCompany${application.id}`}>
                Company Name
              </FieldLabel>
              <Input
                id={`applicationCompany${application.id}`}
                value={editingApplication?.companyName || application.companyName}
                onChange={(e) => handleEditChange('companyName', e.target.value)}
                placeholder="Company name"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`applicationPosition${application.id}`}>
                Position
              </FieldLabel>
              <Input
                id={`applicationPosition${application.id}`}
                value={editingApplication?.position || application.position}
                onChange={(e) => handleEditChange('position', e.target.value)}
                placeholder="Job position"
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor={`applicationUrl${application.id}`}>
              Job URL
            </FieldLabel>
            <Input
              id={`applicationUrl${application.id}`}
              value={editingApplication?.url || application.url}
              onChange={(e) => handleEditChange('url', e.target.value)}
              placeholder="https://..."
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor={`applicationDate${application.id}`}>
                Date Applied
              </FieldLabel>
              <Input
                id={`applicationDate${application.id}`}
                type="date"
                value={editingApplication?.dateApplied || application.dateApplied}
                onChange={(e) => handleEditChange('dateApplied', e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`applicationStatus${application.id}`}>
                Status
              </FieldLabel>
              <Select
                value={editingApplication?.status || application.status || 'notApplied'}
                onValueChange={(value) => handleEditChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notApplied">Not Applied</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="offerExtendedInProgress">Offer In Progress</SelectItem>
                  <SelectItem value="sentFollowUp">Follow Up Sent</SelectItem>
                  <SelectItem value="ghosted">Ghosted</SelectItem>
                  <SelectItem value="jobRemoved">Job Removed</SelectItem>
                  <SelectItem value="offerExtendedNotAccepted">Offer Not Accepted</SelectItem>
                  <SelectItem value="rescinded">Rescinded</SelectItem>
                  <SelectItem value="notForMe">Not For Me</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor={`applicationNotes${application.id}`}>
              Notes
            </FieldLabel>
            <Textarea
              id={`applicationNotes${application.id}`}
              value={editingApplication?.notes || application.notes || ''}
              onChange={(e) => handleEditChange('notes', e.target.value)}
              placeholder="Recruiter contact, salary details, interview notes, etc."
              rows={4}
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}