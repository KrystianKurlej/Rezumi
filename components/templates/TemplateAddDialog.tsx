'use client'

import { ReactNode, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setSelectedDesign } from "@/lib/slices/templatesSlice"
import DesignForm from "@/components/templates/Design"
import { createTemplate } from "@/lib/db/templates"

interface TemplateAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: () => Promise<void>
  trigger?: ReactNode
}

export function TemplateAddDialog({ 
  open, 
  onOpenChange, 
  onAdd,
  trigger
}: TemplateAddDialogProps) {
  const dispatch = useAppDispatch()
  const selectedDesign = useAppSelector(state => state.templates.selectedDesign)
  const [templateName, setTemplateName] = useState('')

  const handleSubmit = async () => {
    if (!templateName.trim()) return

    try {
      await createTemplate({
        name: templateName,
        description: '',
        designId: selectedDesign,
      })
      setTemplateName('')
      dispatch(setSelectedDesign('classic'))
      onOpenChange(false)
      await onAdd()
    } catch (error) {
      console.error('Failed to create template:', error)
    }
  }

  const handleDialogOpenChange = (open: boolean) => {
    onOpenChange(open)
    if (!open) {
      setTemplateName('')
      dispatch(setSelectedDesign('classic'))
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Template</DialogTitle>
          <DialogDescription>
            Choose a design and customize your new CV template.
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="template-name">
            Template Name
          </FieldLabel>
          <Input
            id="template-name"
            placeholder="e.g. Software Engineer CV"
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>
            Select Design
          </FieldLabel>
          <DesignForm />
        </Field>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            disabled={!templateName.trim()}
            onClick={handleSubmit}
          >
            Create Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
