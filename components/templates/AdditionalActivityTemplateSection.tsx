'use client'

import { DBTemplates, DBAdditionalActivity } from '@/lib/db/types'
import { Switch } from "@/components/ui/switch"
import { Textarea } from '../ui/textarea'

interface AdditionalActivityTemplateSectionProps {
  additionalActivities: DBAdditionalActivity[]
  editingTemplate: DBTemplates | null
  onUpdate: (updater: (prev: DBTemplates | null) => DBTemplates | null) => void
}

export function AdditionalActivityTemplateSection({ 
  additionalActivities, 
  editingTemplate, 
  onUpdate 
}: AdditionalActivityTemplateSectionProps) {
  return (
    <div className="space-y-2">
      {additionalActivities.map((exp) => {
        const expId = exp.id?.toString() || ''
        const isDisabled = editingTemplate?.additionalActivity?.disabled?.includes(expId) || false
        const customValue = editingTemplate?.additionalActivity?.customValues?.[expId]
        
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
                    const disabled = prev.additionalActivity?.disabled || []
                    return {
                      ...prev,
                      additionalActivity: {
                        ...prev.additionalActivity,
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
                    additionalActivity: {
                      ...prev.additionalActivity,
                      customValues: {
                        ...prev.additionalActivity?.customValues,
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
      
      {additionalActivities.length === 0 && (
        <div className="text-center text-muted-foreground py-4">
          No additional activities added yet
        </div>
      )}
    </div>
  )
}
