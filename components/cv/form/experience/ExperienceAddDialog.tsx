'use client'

import { ReactNode } from 'react'
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
                <Input
                  id="newExperienceStartDate"
                  value={newExperience.newExperienceStartDate}
                  onChange={handleChange}
                  type="date"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="newExperienceEndDate">
                  End Date
                </FieldLabel>
                <Input
                  id="newExperienceEndDate"
                  value={newExperience.newExperienceEndDate}
                  onChange={handleChange}
                  type="date"
                  disabled={newExperience.newExperienceIsOngoing}
                />
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