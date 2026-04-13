'use client'

import { useState, ReactNode } from 'react'
import { DBAdditionalActivity, updateAdditionalActivity } from '@/lib/db'
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

interface AdditionalActivityEditDialogProps {
  additionalActivity: DBAdditionalActivity
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => Promise<void>
  trigger: ReactNode
}

export function AdditionalActivityEditDialog({ 
  additionalActivity, 
  open, 
  onOpenChange, 
  onUpdate,
  trigger 
}: AdditionalActivityEditDialogProps) {
  const [editingAdditionalActivity, setEditingAdditionalActivity] = useState<DBAdditionalActivity | null>(null)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  const handleEditChange = (field: keyof DBAdditionalActivity, value: string) => {
    setEditingAdditionalActivity((prev: DBAdditionalActivity | null) => ({
      ...prev,
      [field]: field === 'isOngoing' ? value === 'true' : value
    }) as DBAdditionalActivity)
  }

  const handleEditSubmit = async () => {
    try {
      if (!editingAdditionalActivity) return
      
      const updatedData = {
        languageId: editingAdditionalActivity.languageId,
        title: editingAdditionalActivity.title ?? additionalActivity.title,
        company: editingAdditionalActivity.company ?? additionalActivity.company,
        startDate: editingAdditionalActivity.startDate ?? additionalActivity.startDate,
        endDate: editingAdditionalActivity.endDate ?? additionalActivity.endDate,
        description: editingAdditionalActivity.description ?? additionalActivity.description,
        isOngoing: editingAdditionalActivity.isOngoing ?? additionalActivity.isOngoing
      }
      
      await updateAdditionalActivity(additionalActivity.id!, updatedData)
      await onUpdate()
      setEditingAdditionalActivity(null)
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating additionalActivity:', error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setEditingAdditionalActivity({ ...additionalActivity })
    } else {
      setEditingAdditionalActivity(null)
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
          <DialogTitle>Edit <em>{additionalActivity.title} {additionalActivity.company && `- ${additionalActivity.company}`}</em></DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`additionalActivityTitle${additionalActivity.id}`}>
              Title
            </FieldLabel>
            <Input
              id={`additionalActivityTitle${additionalActivity.id}`}
              value={editingAdditionalActivity?.title || additionalActivity.title}
              onChange={(e) => handleEditChange('title', e.target.value)}
              placeholder="Software Engineer, Marketing Manager, etc."
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`additionalActivityCompany${additionalActivity.id}`}>
              Company
            </FieldLabel>
            <Input
              id={`additionalActivityCompany${additionalActivity.id}`}
              value={editingAdditionalActivity?.company || additionalActivity.company}
              onChange={(e) => handleEditChange('company', e.target.value)}
              placeholder="Company name"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor={`additionalActivityStartDate${additionalActivity.id}`}>
                Start Date
              </FieldLabel>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" id={`additionalActivityStartDate${additionalActivity.id}`} className="justify-between w-full">
                    {editingAdditionalActivity?.startDate || additionalActivity.startDate || 'Select date'}
                    <i className="bi bi-calendar-event"></i>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editingAdditionalActivity?.startDate ? new Date(editingAdditionalActivity.startDate) : additionalActivity.startDate ? new Date(additionalActivity.startDate) : undefined}
                    captionLayout='dropdown'
                    onSelect={(date) => {
                      if (date) {
                        const year = date.getFullYear()
                        const month = String(date.getMonth() + 1).padStart(2, '0')
                        const day = String(date.getDate()).padStart(2, '0')
                        handleEditChange('startDate', `${year}-${month}-${day}`)
                      }
                      setStartDateOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>
            <Field>
              <FieldLabel htmlFor={`additionalActivityEndDate${additionalActivity.id}`}>
                End Date
              </FieldLabel>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" id={`additionalActivityEndDate${additionalActivity.id}`} className="justify-between w-full" disabled={editingAdditionalActivity?.isOngoing ?? additionalActivity.isOngoing}>
                    {editingAdditionalActivity?.endDate || additionalActivity.endDate || 'Select date'}
                    <i className="bi bi-calendar-event"></i>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editingAdditionalActivity?.endDate ? new Date(editingAdditionalActivity.endDate) : additionalActivity.endDate ? new Date(additionalActivity.endDate) : undefined}
                    captionLayout='dropdown'
                    onSelect={(date) => {
                      if (date) {
                        const year = date.getFullYear()
                        const month = String(date.getMonth() + 1).padStart(2, '0')
                        const day = String(date.getDate()).padStart(2, '0')
                        handleEditChange('endDate', `${year}-${month}-${day}`)
                      }
                      setEndDateOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>
          </div>
          <Field>
            <div className="flex items-center space-x-2">
              <Switch
                id={`ongoingAdditionalActivity${additionalActivity.id}`}
                checked={editingAdditionalActivity?.isOngoing ?? additionalActivity.isOngoing}
                onCheckedChange={(checked) => handleEditChange('isOngoing', checked.toString())}
              />
              <Label htmlFor={`ongoingAdditionalActivity${additionalActivity.id}`}>
                Ongoing Position
              </Label>
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor={`additionalActivityDescription${additionalActivity.id}`}>
              Description
            </FieldLabel>
            <Textarea
              id={`additionalActivityDescription${additionalActivity.id}`}
              value={editingAdditionalActivity?.description || additionalActivity.description}
              onChange={(e) => handleEditChange('description', e.target.value)}
              placeholder="Key responsibilities, achievements, projects, etc."
            />
            <MarkdownInfo />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleEditSubmit}>
            Save Changes <i className="bi bi-check"></i>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}