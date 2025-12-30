'use client'

import { useState, ReactNode } from 'react'
import { updateTemplate } from '@/lib/db/templates'
import { DBTemplates } from '@/lib/db/types'
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
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setSelectedDesign } from "@/lib/slices/templatesSlice"
import DesignForm from "@/components/templates/Design"

interface TemplateEditDialogProps {
  template: DBTemplates
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => Promise<void>
  trigger: ReactNode
}

export function TemplateEditDialog({ 
  template, 
  open, 
  onOpenChange, 
  onUpdate,
  trigger 
}: TemplateEditDialogProps) {
  const dispatch = useAppDispatch()
  const selectedDesign = useAppSelector(state => state.templates.selectedDesign)
  const [editingTemplate, setEditingTemplate] = useState<DBTemplates | null>(null)

  const handleEditChange = (field: keyof DBTemplates, value: string) => {
    setEditingTemplate((prev: DBTemplates | null) => ({
      ...prev,
      [field]: value
    }) as DBTemplates)
  }

  const handleEditSubmit = async () => {
    try {
      if (!editingTemplate) return
      
      const updatedData = {
        name: editingTemplate.name ?? template.name,
        designId: selectedDesign
      }
      
      await updateTemplate(template.id!, updatedData)
      await onUpdate()
      setEditingTemplate(null)
      dispatch(setSelectedDesign('classic'))
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating template:', error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setEditingTemplate({ ...template })
      dispatch(setSelectedDesign(template.designId))
    } else {
      setEditingTemplate(null)
      dispatch(setSelectedDesign('classic'))
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
          <DialogTitle>Edit <em>{template.name}</em></DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`templateName${template.id}`}>
              Template Name
            </FieldLabel>
            <Input
              id={`templateName${template.id}`}
              value={editingTemplate?.name || template.name}
              onChange={(e) => handleEditChange('name', e.target.value)}
              placeholder="e.g. Software Engineer CV"
            />
          </Field>
          <Field>
            <FieldLabel>
              Select Design
            </FieldLabel>
            <DesignForm />
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
