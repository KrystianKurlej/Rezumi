'use client'

import { DBTemplates, DBCourse } from '@/lib/db/types'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from '../ui/textarea'

interface CoursesTemplateSectionProps {
  courses: DBCourse[]
  editingTemplate: DBTemplates | null
  onUpdate: (updater: (prev: DBTemplates | null) => DBTemplates | null) => void
}

export function CoursesTemplateSection({ 
  courses, 
  editingTemplate, 
  onUpdate 
}: CoursesTemplateSectionProps) {
  return (
    <div className="space-y-2 pr-4">
      {courses.map((course) => {
        const courseId = course.id?.toString() || ''
        const isDisabled = editingTemplate?.courses?.disabled?.includes(courseId) || false
        const hasCustomValue = editingTemplate?.courses?.customValues?.[courseId] !== undefined && editingTemplate?.courses?.customValues?.[courseId] !== ''
        
        return (
          <div key={courseId} className='border p-3 rounded'>
            <div className="text-gray-600 mb-1 text-sm">
              {course.courseName} - {course.platform}
            </div>
            
            <div className="flex items-center space-x-2 py-1">
              <Switch 
                id={`course-show-${courseId}`}
                checked={!isDisabled}
                onCheckedChange={(checked) => {
                  onUpdate(prev => {
                    if (!prev) return null
                    const disabled = prev.courses?.disabled || []
                    return {
                      ...prev,
                      courses: {
                        ...prev.courses,
                        disabled: checked 
                          ? disabled.filter(id => id !== courseId)
                          : [...disabled, courseId]
                      }
                    }
                  })
                }}
              />
              <Label htmlFor={`course-show-${courseId}`}>Show in CV</Label>
            </div>
            
            {!isDisabled && (
              <>
                <div className="flex items-center space-x-2 py-1">
                  <Switch 
                    id={`course-custom-${courseId}`}
                    checked={hasCustomValue}
                    onCheckedChange={(checked) => {
                      onUpdate(prev => {
                        if (!prev) return null
                        const customValues = prev.courses?.customValues || {}
                        const newCustomValues = { ...customValues }
                        
                        if (checked) {
                          newCustomValues[courseId] = course.description || ' '
                        } else {
                          delete newCustomValues[courseId]
                        }
                        
                        return {
                          ...prev,
                          courses: {
                            ...prev.courses,
                            customValues: newCustomValues
                          }
                        }
                      })
                    }}
                  />
                  <Label htmlFor={`course-custom-${courseId}`}>Use custom description</Label>
                </div>
                
                {hasCustomValue && (
                  <Textarea 
                    className="mt-2" 
                    placeholder="Custom description for this course"
                    value={editingTemplate?.courses?.customValues?.[courseId] || ''}
                    onChange={(e) => {
                      onUpdate(prev => {
                        if (!prev) return null
                        return {
                          ...prev,
                          courses: {
                            ...prev.courses,
                            customValues: {
                              ...prev.courses?.customValues,
                              [courseId]: e.target.value
                            }
                          }
                        }
                      })
                    }}
                    rows={4}
                  />
                )}
              </>
            )}
          </div>
        )
      })}
      
      {courses.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No courses added yet
        </div>
      )}
    </div>
  )
}
