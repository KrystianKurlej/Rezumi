'use client'

import { DBTemplates, DBExperience } from '@/lib/db/types'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from '../ui/textarea'

interface ExperienceTemplateSectionProps {
  experiences: DBExperience[]
  editingTemplate: DBTemplates | null
  onUpdate: (updater: (prev: DBTemplates | null) => DBTemplates | null) => void
}

export function ExperienceTemplateSection({ 
  experiences, 
  editingTemplate, 
  onUpdate 
}: ExperienceTemplateSectionProps) {
  return (
    <div className="space-y-2 pr-4">
      {experiences.map((exp) => {
        const expId = exp.id?.toString() || ''
        const isDisabled = editingTemplate?.experience?.disabled?.includes(expId) || false
        const hasCustomValue = editingTemplate?.experience?.customValues?.[expId] !== undefined && editingTemplate?.experience?.customValues?.[expId] !== ''
        
        return (
          <div key={expId} className='border p-3 rounded'>
            <div className="text-gray-600 mb-1 text-sm">
              {exp.title} - {exp.company}
            </div>
            
            <div className="flex items-center space-x-2 py-1">
              <Switch 
                id={`exp-show-${expId}`}
                checked={!isDisabled}
                onCheckedChange={(checked) => {
                  onUpdate(prev => {
                    if (!prev) return null
                    const disabled = prev.experience?.disabled || []
                    return {
                      ...prev,
                      experience: {
                        ...prev.experience,
                        disabled: checked 
                          ? disabled.filter(id => id !== expId)
                          : [...disabled, expId]
                      }
                    }
                  })
                }}
              />
              <Label htmlFor={`exp-show-${expId}`}>Show in CV</Label>
            </div>
            
            {!isDisabled && (
              <>
                <div className="flex items-center space-x-2 py-1">
                  <Switch 
                    id={`exp-custom-${expId}`}
                    checked={hasCustomValue}
                    onCheckedChange={(checked) => {
                      onUpdate(prev => {
                        if (!prev) return null
                        const customValues = prev.experience?.customValues || {}
                        const newCustomValues = { ...customValues }
                        
                        if (checked) {
                          newCustomValues[expId] = exp.description || ' '
                        } else {
                          delete newCustomValues[expId]
                        }
                        
                        return {
                          ...prev,
                          experience: {
                            ...prev.experience,
                            customValues: newCustomValues
                          }
                        }
                      })
                    }}
                  />
                  <Label htmlFor={`exp-custom-${expId}`}>Use custom description</Label>
                </div>
                
                {hasCustomValue && (
                  <Textarea 
                    className="mt-2" 
                    placeholder="Custom description for this experience"
                    value={editingTemplate?.experience?.customValues?.[expId] || ''}
                    onChange={(e) => {
                      onUpdate(prev => {
                        if (!prev) return null
                        return {
                          ...prev,
                          experience: {
                            ...prev.experience,
                            customValues: {
                              ...prev.experience?.customValues,
                              [expId]: e.target.value
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
      
      {experiences.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No experiences added yet
        </div>
      )}
    </div>
  )
}
