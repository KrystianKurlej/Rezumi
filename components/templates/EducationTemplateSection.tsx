'use client'

import { DBTemplates, DBEducation } from '@/lib/db/types'
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from '../ui/textarea'
import { Label } from "@/components/ui/label"

interface EducationTemplateSectionProps {
  educations: DBEducation[]
  editingTemplate: DBTemplates | null
  onUpdate: (updater: (prev: DBTemplates | null) => DBTemplates | null) => void
}

export function EducationTemplateSection({ 
  educations, 
  editingTemplate, 
  onUpdate 
}: EducationTemplateSectionProps) {
  return (
    <div className="space-y-2">
      {educations.map((edu) => {
        const eduId = edu.id?.toString() || ''
        const isDisabled = editingTemplate?.education?.disabled?.includes(eduId) || false
        const customValue = editingTemplate?.education?.customValues?.[eduId]
        
        return (
          <div key={eduId} className='border border-secondary p-4 rounded-md'>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text font-medium text-foreground">
                {edu.degree} in {edu.fieldOfStudy}
              </h4>
              <Switch 
                id={`edu-show-${eduId}`}
                checked={!isDisabled}
                onCheckedChange={(checked) => {
                  onUpdate(prev => {
                    if (!prev) return null
                    const disabled = prev.education?.disabled || []
                    return {
                      ...prev,
                      education: {
                        ...prev.education,
                        disabled: checked 
                          ? disabled.filter(id => id !== eduId)
                          : [...disabled, eduId]
                      }
                    }
                  })
                }}
              />
            </div>
            
            <div className="text-sm text-muted-foreground mb-3">{edu.institution}</div>
            
            <Textarea 
              className="mt-2" 
              placeholder="Custom description (leave empty to use default)"
              value={customValue || ''}
              onChange={(e) => {
                onUpdate(prev => {
                  if (!prev) return null
                  return {
                    ...prev,
                    education: {
                      ...prev.education,
                      customValues: {
                        ...prev.education?.customValues,
                        [eduId]: e.target.value
                      }
                    }
                  }
                })
              }}
              rows={4}
            />
          </div>
        )
      })}
      
      {educations.length === 0 && (
        <div className="text-center text-muted-foreground py-4">
          No education entries added yet
        </div>
      )}
    </div>
  )
}
