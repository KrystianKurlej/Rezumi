'use client'

import { useState, ReactNode, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { NewAdditionalActivity, updateNewAdditionalActivity, addAdditionalActivity, resetNewAdditionalActivity, setLoading } from '@/lib/slices/additionalActivitySlice'
import { addAdditionalActivity as addAdditionalActivityToDB } from '@/lib/db/additionalActivities'
import { DBAdditionalActivity } from '@/lib/db/types'
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

interface AdditionalActivityAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: () => Promise<void>
  trigger?: ReactNode
  initialData?: DBAdditionalActivity | null
}

export function AdditionalActivityAddDialog({ 
  open, 
  onOpenChange, 
  onAdd,
  trigger,
  initialData
}: AdditionalActivityAddDialogProps) {
  const dispatch = useAppDispatch()
  const newAdditionalActivity = useAppSelector(state => state.newAdditionalActivity)
  const isAddingAdditionalActivityLoading = useAppSelector(state => state.additionalActivities.isLoading)
  const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)
  const defaultLanguage = useAppSelector(state => state.settings.defaultLanguage)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  useEffect(() => {
    if (initialData && open) {
      dispatch(updateNewAdditionalActivity({
        newAdditionalActivityTitle: initialData.title,
        newAdditionalActivityCompany: initialData.company,
        newAdditionalActivityStartDate: initialData.startDate,
        newAdditionalActivityEndDate: initialData.endDate,
        newAdditionalActivityDescription: initialData.description,
        newAdditionalActivityIsOngoing: initialData.isOngoing
      }))
    }
  }, [initialData, open, dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    const key = id as keyof NewAdditionalActivity
    dispatch(updateNewAdditionalActivity({ [key]: value }))
  }

  const handleSubmit = async () => {
    try {
      dispatch(setLoading(true))
      const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null
      const additionalActivityData = {
        languageId,
        title: newAdditionalActivity.newAdditionalActivityTitle,
        company: newAdditionalActivity.newAdditionalActivityCompany,
        startDate: newAdditionalActivity.newAdditionalActivityStartDate,
        endDate: newAdditionalActivity.newAdditionalActivityEndDate,
        description: newAdditionalActivity.newAdditionalActivityDescription,
        isOngoing: newAdditionalActivity.newAdditionalActivityIsOngoing
      }
      const id = await addAdditionalActivityToDB(additionalActivityData)
      dispatch(addAdditionalActivity({
        id,
        type: 'additionalActivity',
        createdAt: Date.now(),
        ...additionalActivityData
      }))
      onOpenChange(false)
      dispatch(resetNewAdditionalActivity())
      await onAdd()
    } catch (error) {
      console.error('Error saving additionalActivity:', error)
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
          <DialogTitle>Add new additional activity</DialogTitle>
          <DialogDescription>
            Add your additional activity details here.
          </DialogDescription>
        </DialogHeader>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="newAdditionalActivityTitle">
                Title
              </FieldLabel>
              <Input
                id="newAdditionalActivityTitle"
                value={newAdditionalActivity.newAdditionalActivityTitle}
                onChange={handleChange}
                placeholder="Software Engineer, Marketing Manager, etc."
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newAdditionalActivityCompany">
                Company
              </FieldLabel>
              <Input
                id="newAdditionalActivityCompany"
                value={newAdditionalActivity.newAdditionalActivityCompany}
                onChange={handleChange}
                placeholder="Company name"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="newAdditionalActivityStartDate">
                  Start Date
                </FieldLabel>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between w-full">
                      {newAdditionalActivity.newAdditionalActivityStartDate ? newAdditionalActivity.newAdditionalActivityStartDate : 'Select start date'}
                      <i className="bi bi-calendar-event"></i>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newAdditionalActivity.newAdditionalActivityStartDate ? new Date(newAdditionalActivity.newAdditionalActivityStartDate) : undefined}
                      captionLayout='dropdown'
                      onSelect={(date) => {
                        if (date) {
                          const year = date.getFullYear()
                          const month = String(date.getMonth() + 1).padStart(2, '0')
                          const day = String(date.getDate()).padStart(2, '0')
                          const formattedDate = `${year}-${month}-${day}`
                          dispatch(updateNewAdditionalActivity({ newAdditionalActivityStartDate: formattedDate }))
                        }
                        setStartDateOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
              <Field>
                <FieldLabel htmlFor="newAdditionalActivityEndDate">
                  End Date
                </FieldLabel>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" id="newAdditionalActivityEndDate" className="justify-between w-full" disabled={newAdditionalActivity.newAdditionalActivityIsOngoing}>
                      {newAdditionalActivity.newAdditionalActivityEndDate || 'Select end date'}
                      <i className="bi bi-calendar-event"></i>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newAdditionalActivity.newAdditionalActivityEndDate ? new Date(newAdditionalActivity.newAdditionalActivityEndDate) : undefined}
                      captionLayout='dropdown'
                      onSelect={(date) => {
                        if (date) {
                          const year = date.getFullYear()
                          const month = String(date.getMonth() + 1).padStart(2, '0')
                          const day = String(date.getDate()).padStart(2, '0')
                          const formattedDate = `${year}-${month}-${day}`
                          dispatch(updateNewAdditionalActivity({ newAdditionalActivityEndDate: formattedDate }))
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
                id="ongoingAdditionalActivity"
                checked={newAdditionalActivity.newAdditionalActivityIsOngoing}
                onCheckedChange={(checked) => {
                  dispatch(updateNewAdditionalActivity({ newAdditionalActivityIsOngoing: checked }))
                }}
              />
              <Label htmlFor="ongoingAdditionalActivity">
                Ongoing Position
              </Label>
            </div>
            <Field>
              <FieldLabel htmlFor="newAdditionalActivityDescription">
                Description
              </FieldLabel>
              <Textarea
                id="newAdditionalActivityDescription"
                value={newAdditionalActivity.newAdditionalActivityDescription}
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
          <Button onClick={handleSubmit} disabled={isAddingAdditionalActivityLoading}>
            Add Additional Activity
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}