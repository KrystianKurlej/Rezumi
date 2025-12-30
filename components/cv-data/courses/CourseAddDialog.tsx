'use client'

import { useState, ReactNode, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { NewCourse, updateNewCourse, addCourse, resetNewCourse, setLoading } from '@/lib/slices/coursesSlice'
import { addCourse as addCourseToDB } from '@/lib/db/courses'
import { DBCourse } from '@/lib/db/types'
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

interface CourseAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: () => Promise<void>
  trigger?: ReactNode
  initialData?: DBCourse | null
}

export function CourseAddDialog({ 
  open, 
  onOpenChange, 
  onAdd,
  trigger,
  initialData
}: CourseAddDialogProps) {
  const dispatch = useAppDispatch()
  const newCourse = useAppSelector(state => state.newCourse)
  const isAddingCourseLoading = useAppSelector(state => state.courses.isLoading)
  const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)
  const defaultLanguage = useAppSelector(state => state.settings.defaultLanguage)
  const [completionDateOpen, setCompletionDateOpen] = useState(false)

  useEffect(() => {
    if (initialData && open) {
      dispatch(updateNewCourse({
        newCourseName: initialData.courseName,
        newCoursePlatform: initialData.platform,
        newCourseCompletionDate: initialData.completionDate,
        newCourseCertificateUrl: initialData.certificateUrl,
        newCourseDescription: initialData.description,
        newCourseIsOngoing: initialData.isOngoing
      }))
    }
  }, [initialData, open, dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    const key = id as keyof NewCourse
    dispatch(updateNewCourse({ [key]: value }))
  }

  const handleSubmit = async () => {
    try {
      dispatch(setLoading(true))
      const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null
      const courseData = {
        languageId,
        courseName: newCourse.newCourseName,
        platform: newCourse.newCoursePlatform,
        completionDate: newCourse.newCourseCompletionDate,
        certificateUrl: newCourse.newCourseCertificateUrl,
        description: newCourse.newCourseDescription,
        isOngoing: newCourse.newCourseIsOngoing
      }
      const id = await addCourseToDB(courseData)
      dispatch(addCourse({
        id,
        type: 'course',
        createdAt: Date.now(),
        ...courseData
      }))
      onOpenChange(false)
      dispatch(resetNewCourse())
      await onAdd()
    } catch (error) {
      console.error('Error saving course:', error)
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
          <DialogTitle>Add new course</DialogTitle>
          <DialogDescription>
            Add courses and certifications you&apos;ve completed.
          </DialogDescription>
        </DialogHeader>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="newCourseName">
                Course Name
              </FieldLabel>
              <Input
                id="newCourseName"
                value={newCourse.newCourseName}
                onChange={handleChange}
                placeholder="e.g., React - The Complete Guide"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newCoursePlatform">
                Platform / Provider
              </FieldLabel>
              <Input
                id="newCoursePlatform"
                value={newCourse.newCoursePlatform}
                onChange={handleChange}
                placeholder="e.g., Udemy, Coursera, LinkedIn Learning"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newCourseCompletionDate">
                Completion Date
              </FieldLabel>
              <Popover open={completionDateOpen} onOpenChange={setCompletionDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-between w-full" disabled={newCourse.newCourseIsOngoing}>
                    {newCourse.newCourseCompletionDate ? newCourse.newCourseCompletionDate : 'Select completion date'}
                    <i className="bi bi-calendar-event"></i>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newCourse.newCourseCompletionDate ? new Date(newCourse.newCourseCompletionDate) : undefined}
                    captionLayout='dropdown'
                    onSelect={(date) => {
                      if (date) {
                        const year = date.getFullYear()
                        const month = String(date.getMonth() + 1).padStart(2, '0')
                        const day = String(date.getDate()).padStart(2, '0')
                        const formattedDate = `${year}-${month}-${day}`
                        dispatch(updateNewCourse({ newCourseCompletionDate: formattedDate }))
                        setCompletionDateOpen(false)
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>
            <div className="flex items-center space-x-2">
              <Switch
                id="ongoingCourse"
                checked={newCourse.newCourseIsOngoing}
                onCheckedChange={(checked) => {
                  dispatch(updateNewCourse({ newCourseIsOngoing: checked }))
                }}
              />
              <Label htmlFor="ongoingCourse">
                Currently Taking
              </Label>
            </div>
            <Field>
              <FieldLabel htmlFor="newCourseCertificateUrl">
                Certificate URL (Optional)
              </FieldLabel>
              <Input
                id="newCourseCertificateUrl"
                value={newCourse.newCourseCertificateUrl}
                onChange={handleChange}
                placeholder="https://..."
                type="url"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newCourseDescription">
                Description (Optional)
              </FieldLabel>
              <Textarea
                id="newCourseDescription"
                value={newCourse.newCourseDescription}
                onChange={handleChange}
                placeholder="Key learnings, projects completed, etc."
              />
              <MarkdownInfo />
            </Field>
          </FieldGroup>
        </FieldSet>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isAddingCourseLoading}>
            Add Course
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
