'use client'

import { DBTemplates, DBEducation } from '@/lib/db/types'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from '../ui/textarea'

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
    <div className="space-y-2 pr-4">
      {educations.map((edu) => {
        const eduId = edu.id?.toString() || ''
        const isDisabled = editingTemplate?.education?.disabled?.includes(eduId) || false
        const hasCustomValue = editingTemplate?.education?.customValues?.[eduId] !== undefined && editingTemplate?.education?.customValues?.[eduId] !== ''
        
        return (
          <div key={eduId} className='border p-3 rounded'>
            <div className="text-primary mb-1 text-sm">
              {edu.degree} - {edu.institution}
            </div>
            
            <div className="flex items-center space-x-2 py-1">
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
              <Label htmlFor={`edu-show-${eduId}`}>Show in CV</Label>
            </div>
            
            {!isDisabled && (
              <>
                <div className="flex items-center space-x-2 py-1">
                  <Switch 
                    id={`edu-custom-${eduId}`}
                    checked={hasCustomValue}
                    onCheckedChange={(checked) => {
                      onUpdate(prev => {
                        if (!prev) return null
                        const customValues = prev.education?.customValues || {}
                        const newCustomValues = { ...customValues }
                        
                        if (checked) {
                          newCustomValues[eduId] = edu.description || ' '
                        } else {
                          delete newCustomValues[eduId]
                        }
                        
                        return {
                          ...prev,
                          education: {
                            ...prev.education,
                            customValues: newCustomValues
                          }
                        }
                      })
                    }}
                  />
                  <Label htmlFor={`edu-custom-${eduId}`}>Use custom description</Label>
                </div>
                
                {hasCustomValue && (
                  <Textarea 
                    className="mt-2" 
                    placeholder="Custom description for this education"
                    value={editingTemplate?.education?.customValues?.[eduId] || ''}
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
                )}
              </>
            )}
          </div>
        )
      })}
      
      {educations.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No education entries added yet
        </div>
      )}
    </div>
  )
}
