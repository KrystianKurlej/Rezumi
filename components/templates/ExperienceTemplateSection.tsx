'use client'

import { DBTemplates, DBExperience } from '@/lib/db/types'
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
    <div className="space-y-2">
      {experiences.map((exp) => {
        const expId = exp.id?.toString() || ''
        const isDisabled = editingTemplate?.experience?.disabled?.includes(expId) || false
        const customValue = editingTemplate?.experience?.customValues?.[expId]
        
        return (
          <div key={expId} className='border border-secondary p-4 rounded-md'>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text font-medium text-foreground">
                {exp.title} - {exp.company}
              </h4>
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
            </div>
            
            <Textarea 
              className="mt-2" 
              placeholder="Custom description (leave empty to use default)"
              value={customValue || ''}
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
          </div>
        )
      })}
      
      {experiences.length === 0 && (
        <div className="text-center text-muted-foreground py-4">
          No experiences added yet
        </div>
      )}
    </div>
  )
}
