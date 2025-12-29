'use client'

import { useState, ReactNode } from 'react'
import { DBCourse, updateCourse } from '@/lib/db'
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

interface CourseEditDialogProps {
  course: DBCourse
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => Promise<void>
  trigger: ReactNode
}

export function CourseEditDialog({ 
  course, 
  open, 
  onOpenChange, 
  onUpdate,
  trigger 
}: CourseEditDialogProps) {
  const [editingCourse, setEditingCourse] = useState<DBCourse | null>(null)
  const [completionDateOpen, setCompletionDateOpen] = useState(false)

  const handleEditChange = (field: keyof DBCourse, value: string) => {
    setEditingCourse((prev: DBCourse | null) => ({
      ...prev,
      [field]: field === 'isOngoing' ? value === 'true' : value
    }) as DBCourse)
  }

  const handleEditSubmit = async () => {
    try {
      if (!editingCourse) return
      
      const updatedData = {
        languageId: editingCourse.languageId,
        courseName: editingCourse.courseName ?? course.courseName,
        platform: editingCourse.platform ?? course.platform,
        completionDate: editingCourse.completionDate ?? course.completionDate,
        certificateUrl: editingCourse.certificateUrl ?? course.certificateUrl,
        description: editingCourse.description ?? course.description,
        isOngoing: editingCourse.isOngoing ?? course.isOngoing
      }
      
      await updateCourse(course.id!, updatedData)
      await onUpdate()
      setEditingCourse(null)
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating course:', error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setEditingCourse({ ...course })
    } else {
      setEditingCourse(null)
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
          <DialogTitle>Edit <em>{course.courseName}</em></DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`courseName${course.id}`}>
              Course Name
            </FieldLabel>
            <Input
              id={`courseName${course.id}`}
              value={editingCourse?.courseName || course.courseName}
              onChange={(e) => handleEditChange('courseName', e.target.value)}
              placeholder="e.g., React - The Complete Guide"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`coursePlatform${course.id}`}>
              Platform / Provider
            </FieldLabel>
            <Input
              id={`coursePlatform${course.id}`}
              value={editingCourse?.platform || course.platform}
              onChange={(e) => handleEditChange('platform', e.target.value)}
              placeholder="e.g., Udemy, Coursera, LinkedIn Learning"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`courseCompletionDate${course.id}`}>
              Completion Date
            </FieldLabel>
            <Popover open={completionDateOpen} onOpenChange={setCompletionDateOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-between w-full" disabled={editingCourse?.isOngoing ?? course.isOngoing}>
                  {editingCourse?.completionDate || course.completionDate || 'Select completion date'}
                  <i className="bi bi-calendar-event"></i>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={editingCourse?.completionDate ? new Date(editingCourse.completionDate) : course.completionDate ? new Date(course.completionDate) : undefined}
                  captionLayout='dropdown'
                  onSelect={(date) => {
                    if (date) {
                      const year = date.getFullYear()
                      const month = String(date.getMonth() + 1).padStart(2, '0')
                      const day = String(date.getDate()).padStart(2, '0')
                      const formattedDate = `${year}-${month}-${day}`
                      handleEditChange('completionDate', formattedDate)
                      setCompletionDateOpen(false)
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </Field>
          <Field>
            <div className="flex items-center space-x-2">
              <Switch
                id={`ongoingCourse${course.id}`}
                checked={editingCourse?.isOngoing ?? course.isOngoing}
                onCheckedChange={(checked) => {
                  setEditingCourse((prev: DBCourse | null) => ({
                    ...prev,
                    isOngoing: checked
                  }) as DBCourse)
                }}
              />
              <Label htmlFor={`ongoingCourse${course.id}`}>
                Currently Taking
              </Label>
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor={`courseCertificateUrl${course.id}`}>
              Certificate URL (Optional)
            </FieldLabel>
            <Input
              id={`courseCertificateUrl${course.id}`}
              value={editingCourse?.certificateUrl || course.certificateUrl}
              onChange={(e) => handleEditChange('certificateUrl', e.target.value)}
              placeholder="https://..."
              type="url"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`courseDescription${course.id}`}>
              Description (Optional)
            </FieldLabel>
            <Textarea
              id={`courseDescription${course.id}`}
              value={editingCourse?.description || course.description}
              onChange={(e) => handleEditChange('description', e.target.value)}
              placeholder="Key learnings, projects completed, etc."
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
