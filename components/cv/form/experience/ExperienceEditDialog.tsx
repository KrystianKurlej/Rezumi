'use client'

import { useState, ReactNode } from 'react'
import { DBExperience, updateExperience } from '@/lib/db'
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

interface ExperienceEditDialogProps {
  experience: DBExperience
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => Promise<void>
  trigger: ReactNode
}

export function ExperienceEditDialog({ 
  experience, 
  open, 
  onOpenChange, 
  onUpdate,
  trigger 
}: ExperienceEditDialogProps) {
  const [editingExperience, setEditingExperience] = useState<DBExperience | null>(null)

  const handleEditChange = (field: keyof DBExperience, value: string) => {
    setEditingExperience((prev: DBExperience | null) => ({
      ...prev,
      [field]: field === 'isOngoing' ? value === 'true' : value
    }) as DBExperience)
  }

  const handleEditSubmit = async () => {
    try {
      if (!editingExperience) return
      
      const updatedData = {
        title: editingExperience.title ?? experience.title,
        company: editingExperience.company ?? experience.company,
        startDate: editingExperience.startDate ?? experience.startDate,
        endDate: editingExperience.endDate ?? experience.endDate,
        description: editingExperience.description ?? experience.description,
        isOngoing: editingExperience.isOngoing ?? experience.isOngoing
      }
      
      await updateExperience(experience.id!, updatedData)
      await onUpdate()
      setEditingExperience(null)
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating experience:', error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setEditingExperience({ ...experience })
    } else {
      setEditingExperience(null)
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
          <DialogTitle>Edit <em>{experience.title} {experience.company && `- ${experience.company}`}</em></DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`experienceTitle${experience.id}`}>
              Title
            </FieldLabel>
            <Input
              id={`experienceTitle${experience.id}`}
              value={editingExperience?.title || experience.title}
              onChange={(e) => handleEditChange('title', e.target.value)}
              placeholder="Software Engineer, Marketing Manager, etc."
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`experienceCompany${experience.id}`}>
              Company
            </FieldLabel>
            <Input
              id={`experienceCompany${experience.id}`}
              value={editingExperience?.company || experience.company}
              onChange={(e) => handleEditChange('company', e.target.value)}
              placeholder="Company name"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor={`experienceStartDate${experience.id}`}>
                Start Date
              </FieldLabel>
              <Input
                id={`experienceStartDate${experience.id}`}
                value={editingExperience?.startDate || experience.startDate}
                type="date"
                onChange={(e) => handleEditChange('startDate', e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`experienceEndDate${experience.id}`}>
                End Date
              </FieldLabel>
              <Input
                id={`experienceEndDate${experience.id}`}
                value={editingExperience?.endDate || experience.endDate}
                type="date"
                disabled={editingExperience?.isOngoing ?? experience.isOngoing}
                onChange={(e) => handleEditChange('endDate', e.target.value)}
              />
            </Field>
          </div>
          <Field>
            <div className="flex items-center space-x-2">
              <Switch
                id={`ongoingExperience${experience.id}`}
                checked={editingExperience?.isOngoing ?? experience.isOngoing}
                onCheckedChange={(checked) => handleEditChange('isOngoing', checked.toString())}
              />
              <Label htmlFor={`ongoingExperience${experience.id}`}>
                Ongoing Position
              </Label>
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor={`experienceDescription${experience.id}`}>
              Description
            </FieldLabel>
            <Textarea
              id={`experienceDescription${experience.id}`}
              value={editingExperience?.description || experience.description}
              onChange={(e) => handleEditChange('description', e.target.value)}
              placeholder="Key responsibilities, achievements, projects, etc."
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