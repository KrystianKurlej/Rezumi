'use client'

import { ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { NewEducation, updateNewEducation, addEducation, resetNewEducation, setLoading } from '@/lib/slices/educationSlice'
import { addEducation as addEducationToDB } from '@/lib/db'
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

interface EducationAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: () => Promise<void>
  trigger?: ReactNode
}

export function EducationAddDialog({ 
  open, 
  onOpenChange, 
  onAdd,
  trigger 
}: EducationAddDialogProps) {
  const dispatch = useAppDispatch()
  const newEducation = useAppSelector(state => state.newEducation)
  const isAddingEducationLoading = useAppSelector(state => state.educations.isLoading)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    const key = id as keyof NewEducation
    dispatch(updateNewEducation({ [key]: value }))
  }

  const handleSubmit = async () => {
    try {
      dispatch(setLoading(true))
      const educationData = {
        degree: newEducation.newEducationDegree,
        institution: newEducation.newEducationInstitution,
        fieldOfStudy: newEducation.newEducationFieldOfStudy,
        startDate: newEducation.newEducationStartDate,
        endDate: newEducation.newEducationEndDate,
        description: newEducation.newEducationDescription,
        isOngoing: newEducation.newEducationIsOngoing
      }
      const id = await addEducationToDB(educationData)
      dispatch(addEducation({
        id,
        createdAt: Date.now(),
        ...educationData
      }))
      onOpenChange(false)
      dispatch(resetNewEducation())
      await onAdd()
    } catch (error) {
      console.error('Error saving education:', error)
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
          <DialogTitle>Add new education</DialogTitle>
          <DialogDescription>
            Add your educational background here.
          </DialogDescription>
        </DialogHeader>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="newEducationDegree">
                Degree
              </FieldLabel>
              <Input
                id="newEducationDegree"
                value={newEducation.newEducationDegree}
                onChange={handleChange}
                placeholder="Bachelor's, Master's, PhD, etc."
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newEducationInstitution">
                Institution
              </FieldLabel>
              <Input
                id="newEducationInstitution"
                value={newEducation.newEducationInstitution}
                onChange={handleChange}
                placeholder="University name"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newEducationFieldOfStudy">
                Field of Study
              </FieldLabel>
              <Input
                id="newEducationFieldOfStudy"
                value={newEducation.newEducationFieldOfStudy}
                onChange={handleChange}
                placeholder="Computer Science, Business, etc."
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="newEducationStartDate">
                  Start Date
                </FieldLabel>
                <Input
                  id="newEducationStartDate"
                  value={newEducation.newEducationStartDate}
                  onChange={handleChange}
                  type="date"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="newEducationEndDate">
                  End Date
                </FieldLabel>
                <Input
                  id="newEducationEndDate"
                  value={newEducation.newEducationEndDate}
                  onChange={handleChange}
                  type="date"
                  disabled={newEducation.newEducationIsOngoing}
                />
              </Field>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="ongoingEducation"
                checked={newEducation.newEducationIsOngoing}
                onCheckedChange={(checked) => {
                  dispatch(updateNewEducation({ newEducationIsOngoing: checked }))
                }}
              />
              <Label htmlFor="ongoingEducation">
                Currently Studying
              </Label>
            </div>
            <Field>
              <FieldLabel htmlFor="newEducationDescription">
                Description (Optional)
              </FieldLabel>
              <Textarea
                id="newEducationDescription"
                value={newEducation.newEducationDescription}
                onChange={handleChange}
                placeholder="Notable achievements, thesis, coursework, etc."
              />
              <MarkdownInfo />
            </Field>
          </FieldGroup>
        </FieldSet>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isAddingEducationLoading}>
            Add Education
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}