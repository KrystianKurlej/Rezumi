'use client'

import { useState, ReactNode } from 'react'
import { DBEducation, updateEducation } from '@/lib/db'
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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import MarkdownInfo from '@/components/MarkdownInfo'
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface EducationEditDialogProps {
  education: DBEducation
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => Promise<void>
  trigger: ReactNode
}

export function EducationEditDialog({ 
  education, 
  open, 
  onOpenChange, 
  onUpdate,
  trigger 
}: EducationEditDialogProps) {
  const [editingEducation, setEditingEducation] = useState<DBEducation | null>(null)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  const handleEditChange = (field: keyof DBEducation, value: string) => {
    setEditingEducation((prev: DBEducation | null) => ({
      ...prev,
      [field]: field === 'isOngoing' ? value === 'true' : value
    }) as DBEducation)
  }

  const handleEditSubmit = async () => {
    try {
      if (!editingEducation) return
      
      const updatedData = {
        degree: editingEducation.degree ?? education.degree,
        institution: editingEducation.institution ?? education.institution,
        fieldOfStudy: editingEducation.fieldOfStudy ?? education.fieldOfStudy,
        startDate: editingEducation.startDate ?? education.startDate,
        endDate: editingEducation.endDate ?? education.endDate,
        description: editingEducation.description ?? education.description,
        isOngoing: editingEducation.isOngoing ?? education.isOngoing
      }
      
      await updateEducation(education.id!, updatedData)
      await onUpdate()
      setEditingEducation(null)
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating education:', error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setEditingEducation({ ...education })
    } else {
      setEditingEducation(null)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit <em>{education.degree} in {education.fieldOfStudy}</em></DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`educationDegree${education.id}`}>
              Degree
            </FieldLabel>
            <Input
              id={`educationDegree${education.id}`}
              value={editingEducation?.degree || education.degree}
              onChange={(e) => handleEditChange('degree', e.target.value)}
              placeholder="Bachelor's, Master's, PhD, etc."
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`educationInstitution${education.id}`}>
              Institution
            </FieldLabel>
            <Input
              id={`educationInstitution${education.id}`}
              value={editingEducation?.institution || education.institution}
              onChange={(e) => handleEditChange('institution', e.target.value)}
              placeholder="University name"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`educationFieldOfStudy${education.id}`}>
              Field of Study
            </FieldLabel>
            <Input
              id={`educationFieldOfStudy${education.id}`}
              value={editingEducation?.fieldOfStudy || education.fieldOfStudy}
              onChange={(e) => handleEditChange('fieldOfStudy', e.target.value)}
              placeholder="Computer Science, Business, etc."
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor={`educationStartDate${education.id}`}>
                Start Date
              </FieldLabel>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-between w-full">
                    {editingEducation?.startDate || education.startDate || 'Select start date'}
                    <i className="bi bi-calendar-event"></i>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editingEducation?.startDate ? new Date(editingEducation.startDate) : education.startDate ? new Date(education.startDate) : undefined}
                    captionLayout='dropdown'
                    onSelect={(date) => {
                      if (date) {
                        const year = date.getFullYear()
                        const month = String(date.getMonth() + 1).padStart(2, '0')
                        const day = String(date.getDate()).padStart(2, '0')
                        const formattedDate = `${year}-${month}-${day}`
                        handleEditChange('startDate', formattedDate)
                        setStartDateOpen(false)
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>
            <Field>
              <FieldLabel htmlFor={`educationEndDate${education.id}`}>
                End Date
              </FieldLabel>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-between w-full" disabled={editingEducation?.isOngoing ?? education.isOngoing}>
                    {editingEducation?.endDate || education.endDate || 'Select end date'}
                    <i className="bi bi-calendar-event"></i>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editingEducation?.endDate ? new Date(editingEducation.endDate) : education.endDate ? new Date(education.endDate) : undefined}
                    captionLayout='dropdown'
                    onSelect={(date) => {
                      if (date) {
                        const year = date.getFullYear()
                        const month = String(date.getMonth() + 1).padStart(2, '0')
                        const day = String(date.getDate()).padStart(2, '0')
                        const formattedDate = `${year}-${month}-${day}`
                        handleEditChange('endDate', formattedDate)
                        setEndDateOpen(false)
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>
          </div>
          <Field>
            <div className="flex items-center space-x-2">
              <Switch
                id={`ongoingEducation${education.id}`}
                checked={editingEducation?.isOngoing ?? education.isOngoing}
                onCheckedChange={(checked) => handleEditChange('isOngoing', checked.toString())}
              />
              <Label htmlFor={`ongoingEducation${education.id}`}>
                Currently Studying
              </Label>
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor={`educationDescription${education.id}`}>
              Description (Optional)
            </FieldLabel>
            <Textarea
              id={`educationDescription${education.id}`}
              value={editingEducation?.description || education.description}
              onChange={(e) => handleEditChange('description', e.target.value)}
              placeholder="Notable achievements, thesis, coursework, etc."
            />
            <MarkdownInfo />
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