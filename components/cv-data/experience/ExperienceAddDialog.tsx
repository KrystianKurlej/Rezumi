'use client'

import { useState, ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { NewExperience, updateNewExperience, addExperience, resetNewExperience, setLoading } from '@/lib/slices/experienceSlice'
import { addExperience as addExperienceToDB } from '@/lib/db'
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

interface ExperienceAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: () => Promise<void>
  trigger?: ReactNode
}

export function ExperienceAddDialog({ 
  open, 
  onOpenChange, 
  onAdd,
  trigger 
}: ExperienceAddDialogProps) {
  const dispatch = useAppDispatch()
  const newExperience = useAppSelector(state => state.newExperience)
  const isAddingExperienceLoading = useAppSelector(state => state.experiences.isLoading)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    const key = id as keyof NewExperience
    dispatch(updateNewExperience({ [key]: value }))
  }

  const handleSubmit = async () => {
    try {
      dispatch(setLoading(true))
      const experienceData = {
        title: newExperience.newExperienceTitle,
        company: newExperience.newExperienceCompany,
        startDate: newExperience.newExperienceStartDate,
        endDate: newExperience.newExperienceEndDate,
        description: newExperience.newExperienceDescription,
        isOngoing: newExperience.newExperienceIsOngoing
      }
      const id = await addExperienceToDB(experienceData)
      dispatch(addExperience({
        id,
        type: 'experience',
        createdAt: Date.now(),
        ...experienceData
      }))
      onOpenChange(false)
      dispatch(resetNewExperience())
      await onAdd()
    } catch (error) {
      console.error('Error saving experience:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new experience</DialogTitle>
          <DialogDescription>
            Add your work experience details here.
          </DialogDescription>
        </DialogHeader>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="newExperienceTitle">
                Title
              </FieldLabel>
              <Input
                id="newExperienceTitle"
                value={newExperience.newExperienceTitle}
                onChange={handleChange}
                placeholder="Software Engineer, Marketing Manager, etc."
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newExperienceCompany">
                Company
              </FieldLabel>
              <Input
                id="newExperienceCompany"
                value={newExperience.newExperienceCompany}
                onChange={handleChange}
                placeholder="Company name"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="newExperienceStartDate">
                  Start Date
                </FieldLabel>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between w-full">
                      {newExperience.newExperienceStartDate ? newExperience.newExperienceStartDate : 'Select start date'}
                      <i className="bi bi-calendar-event"></i>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newExperience.newExperienceStartDate ? new Date(newExperience.newExperienceStartDate) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const year = date.getFullYear()
                          const month = String(date.getMonth() + 1).padStart(2, '0')
                          const day = String(date.getDate()).padStart(2, '0')
                          const formattedDate = `${year}-${month}-${day}`
                          dispatch(updateNewExperience({ newExperienceStartDate: formattedDate }))
                        }
                        setStartDateOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
              <Field>
                <FieldLabel htmlFor="newExperienceEndDate">
                  End Date
                </FieldLabel>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" id="newExperienceEndDate" className="justify-between w-full" disabled={newExperience.newExperienceIsOngoing}>
                      {newExperience.newExperienceEndDate || 'Select end date'}
                      <i className="bi bi-calendar-event"></i>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newExperience.newExperienceEndDate ? new Date(newExperience.newExperienceEndDate) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const year = date.getFullYear()
                          const month = String(date.getMonth() + 1).padStart(2, '0')
                          const day = String(date.getDate()).padStart(2, '0')
                          const formattedDate = `${year}-${month}-${day}`
                          dispatch(updateNewExperience({ newExperienceEndDate: formattedDate }))
                        }
                        setEndDateOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="ongoingExperience"
                checked={newExperience.newExperienceIsOngoing}
                onCheckedChange={(checked) => {
                  dispatch(updateNewExperience({ newExperienceIsOngoing: checked }))
                }}
              />
              <Label htmlFor="ongoingExperience">
                Ongoing Position
              </Label>
            </div>
            <Field>
              <FieldLabel htmlFor="newExperienceDescription">
                Description
              </FieldLabel>
              <Textarea
                id="newExperienceDescription"
                value={newExperience.newExperienceDescription}
                onChange={handleChange}
                placeholder="Key responsibilities, achievements, projects, etc."
              />
              <MarkdownInfo />
            </Field>
          </FieldGroup>
        </FieldSet>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isAddingExperienceLoading}>
            Add Experience
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}