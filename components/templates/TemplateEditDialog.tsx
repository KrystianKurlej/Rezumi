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
  DialogClose,
  DialogDescription
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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from '../ui/textarea'

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
          <DialogDescription>Templates let you create CV variations without duplicating your data. You can hide sections or override content for specific roles.</DialogDescription>
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
        </FieldGroup>
        <Tabs defaultValue="appearance">
          <TabsList>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>
          <TabsContent value="appearance">
            <FieldGroup>
              <Field>
                <DesignForm />
              </Field>
            </FieldGroup>
          </TabsContent>
          <TabsContent value="content">
            <FieldGroup>
              <Field>
                <Accordion type="single" collapsible>
                  <AccordionItem value="personal-information">
                    <AccordionTrigger>Personal Information</AccordionTrigger>
                    <AccordionContent>
                      <div className='border p-3 rounded mb-1'>
                        <div className="text-gray-600 mb-1">Profile picture</div>
                        <div className="flex items-center space-x-2 py-1">
                          <Switch id="profile-picture-show" checked />
                          <Label htmlFor="profile-picture-show">Show section</Label>
                        </div>
                        <div className="flex items-center space-x-2 py-1">
                          <Switch id="profile-picture-custom" />
                          <Label htmlFor="profile-picture-custom">Use custom content</Label>
                        </div>
                      </div>
                      <div className='border p-3 rounded'>
                        <div className="text-gray-600 mb-1">About</div>
                        <div className="flex items-center space-x-2 py-1">
                          <Switch id="about-show" checked />
                          <Label htmlFor="about-show">Show section</Label>
                        </div>
                        <div className="flex items-center space-x-2 py-1">
                          <Switch id="about-custom" checked/>
                          <Label htmlFor="about-custom">Use custom content</Label>
                        </div>
                        <Textarea className="mt-2" placeholder="Write something about yourself" />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="experience">
                    <AccordionTrigger>Experience</AccordionTrigger>
                    <AccordionContent>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Button variant="outline" size="sm" className="mt-1">
                  Reset all content customizations
                  <i className="bi bi-arrow-clockwise ml-2"></i>
                </Button>
              </Field>
            </FieldGroup>
          </TabsContent>
        </Tabs>
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
