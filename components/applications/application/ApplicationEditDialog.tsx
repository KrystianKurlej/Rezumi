'use client'

import { useState, ReactNode } from 'react'
import { updateApplication as updateApplicationInDB } from '@/lib/db'
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
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  const [dateOpen, setDateOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleEditChange = (field: keyof Application, value: string) => {
    setEditingApplication((prev: Application | null) => ({
      ...prev,
      ...application,
      [field]: value
    }) as Application)
  }

  const handleStatusChange = (value: string) => {
    handleEditChange('status', value)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const year = date.getFullYear()
      
      handleEditChange('dateApplied', `${year}-${month}-${day}`)
      setDateOpen(false)
    }
  }

  const handleEditSubmit = async () => {
    try {
      if (!editingApplication) return
      
      setLoading(true)
      
      const updatedData = {
        companyName: editingApplication.companyName ?? application.companyName,
        position: editingApplication.position ?? application.position,
        url: editingApplication.url ?? application.url,
        notes: editingApplication.notes ?? application.notes,
        dateApplied: editingApplication.dateApplied ?? application.dateApplied,
        status: editingApplication.status ?? application.status
      }
      
      await updateApplicationInDB(parseInt(application.id), updatedData)
      
      const updatedApplication: Application = {
        ...application,
        ...updatedData
      }
      
      onUpdate(updatedApplication)
      setEditingApplication(null)
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating application:', error)
      alert('Failed to update application')
    } finally {
      setLoading(false)
    }
  }

  const currentData = editingApplication || application

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
          <DialogDescription>
            Update the details of your job application.
          </DialogDescription>
        </DialogHeader>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="editCompanyName">
                Company Name *
              </FieldLabel>
              <Input
                id="editCompanyName"
                value={currentData.companyName}
                onChange={(e) => handleEditChange('companyName', e.target.value)}
                placeholder="Google, Microsoft, etc."
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="editPosition">
                Position *
              </FieldLabel>
              <Input
                id="editPosition"
                value={currentData.position}
                onChange={(e) => handleEditChange('position', e.target.value)}
                placeholder="Frontend Developer, Software Engineer, etc."
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="editUrl">
                Job URL
              </FieldLabel>
              <Input
                id="editUrl"
                value={currentData.url}
                onChange={(e) => handleEditChange('url', e.target.value)}
                placeholder="https://..."
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="editStatus">
                Status
              </FieldLabel>
              <Select onValueChange={handleStatusChange} value={currentData.status || undefined}>
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
            <Field>
              <FieldLabel htmlFor="editDateApplied">
                Date Applied
              </FieldLabel>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-between w-full">
                    {currentData.dateApplied ? currentData.dateApplied : 'Select date'}
                    <i className="bi bi-calendar-event"></i>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={currentData.dateApplied ? new Date(currentData.dateApplied) : undefined}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </Field>
            <Field>
              <FieldLabel htmlFor="editNotes">
                Notes
              </FieldLabel>
              <Textarea
                id="editNotes"
                value={currentData.notes}
                onChange={(e) => handleEditChange('notes', e.target.value)}
                placeholder="Additional notes about this application..."
                rows={3}
              />
            </Field>
          </FieldGroup>
        </FieldSet>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleEditSubmit}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Application'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}