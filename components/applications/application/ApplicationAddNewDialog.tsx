'use client'

import { useState, ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { NewApplication, updateNewApplication, resetNewApplication } from '@/lib/slices/applicationsSlice'
import { addApplication as addApplicationToDB } from '@/lib/db'
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

interface ApplicationAddNewDialogProps {
  trigger: ReactNode
  onAdd?: () => void
}

export function ApplicationAddNewDialog({
    trigger,
    onAdd
}: ApplicationAddNewDialogProps) {
  const dispatch = useAppDispatch()
  const newApplication = useAppSelector(state => state.newApplication)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    dispatch(updateNewApplication({ [id]: value }))
  }

  const handleStatusChange = (value: string) => {
    dispatch(updateNewApplication({ 
      newApplicationStatus: value as NewApplication['newApplicationStatus']
    }))
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const year = date.getFullYear()
      
      dispatch(updateNewApplication({ 
        newApplicationDateApplied: `${year}-${month}-${day}`
      }))
      setDateOpen(false)
    }
  }

  const handleAddNew = async () => {
    if (!newApplication.newApplicationCompanyName || !newApplication.newApplicationPosition) {
      alert('Company name and position are required')
      return
    }

    setLoading(true)
    try {
      await addApplicationToDB({
        companyName: newApplication.newApplicationCompanyName,
        position: newApplication.newApplicationPosition,
        url: newApplication.newApplicationUrl,
        notes: newApplication.newApplicationNotes,
        salary: newApplication.newApplicationSalary ? parseFloat(newApplication.newApplicationSalary) : null,
        dateApplied: newApplication.newApplicationDateApplied,
        status: newApplication.newApplicationStatus
      })
      
      // Reset form
      dispatch(resetNewApplication())
      
      setOpen(false)
      if (onAdd) onAdd()
    } catch (error) {
      console.error('Error adding application:', error)
      alert('Failed to add application')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Add New Application
          </DialogTitle>
          <DialogDescription>
            Fill in the details to add a new job application.
          </DialogDescription>
        </DialogHeader>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="newApplicationCompanyName">
                Company Name *
              </FieldLabel>
              <Input
                id="newApplicationCompanyName"
                value={newApplication.newApplicationCompanyName}
                onChange={handleChange}
                placeholder="Google, Microsoft, etc."
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newApplicationPosition">
                Position *
              </FieldLabel>
              <Input
                id="newApplicationPosition"
                value={newApplication.newApplicationPosition}
                onChange={handleChange}
                placeholder="Frontend Developer, Software Engineer, etc."
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newApplicationUrl">
                Job URL
              </FieldLabel>
              <Input
                id="newApplicationUrl"
                value={newApplication.newApplicationUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newApplicationSalary">
                Expected Salary
              </FieldLabel>
              <Input
                id="newApplicationSalary"
                type="number"
                value={newApplication.newApplicationSalary}
                onChange={handleChange}
                placeholder="50000"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newApplicationStatus">
                Status
              </FieldLabel>
              <Select onValueChange={handleStatusChange} value={newApplication.newApplicationStatus || undefined}>
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
              <FieldLabel htmlFor="newApplicationDateApplied">
                Date Applied
              </FieldLabel>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-between w-full">
                    {newApplication.newApplicationDateApplied ? newApplication.newApplicationDateApplied : 'Select date'}
                    <i className="bi bi-calendar-event"></i>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newApplication.newApplicationDateApplied ? new Date(newApplication.newApplicationDateApplied) : undefined}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </Field>
            <Field>
              <FieldLabel htmlFor="newApplicationNotes">
                Notes
              </FieldLabel>
              <Textarea
                id="newApplicationNotes"
                value={newApplication.newApplicationNotes}
                onChange={handleChange}
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
            onClick={handleAddNew}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Application'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}