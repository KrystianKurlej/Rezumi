'use client'

import { DBTemplates, DBSkill } from '@/lib/db/types'
import { Switch } from "@/components/ui/switch"
import { Textarea } from '../ui/textarea'

interface SkillsTemplateSectionProps {
  skills: DBSkill[]
  editingTemplate: DBTemplates | null
  onUpdate: (updater: (prev: DBTemplates | null) => DBTemplates | null) => void
}

export function SkillsTemplateSection({ 
  skills, 
  editingTemplate, 
  onUpdate 
}: SkillsTemplateSectionProps) {
  const skillsList = skills || []
  
  return (
    <div className="space-y-2">
      {skillsList.map((skill) => {
        const skillId = skill.id?.toString() || ''
        const disabled = editingTemplate?.skills?.disabled
        const isDisabled = Array.isArray(disabled) ? disabled.includes(skillId) : false
        const customValue = editingTemplate?.skills?.customValues?.[skillId]
        
        return (
          <div key={skillId} className='border border-secondary p-4 rounded-md'>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text font-medium text-foreground">
                {skill.skillName}
              </h4>
              <Switch 
                id={`skill-show-${skillId}`}
                checked={!isDisabled}
                onCheckedChange={(checked) => {
                  onUpdate(prev => {
                    if (!prev) return null
                    const disabled = prev.skills?.disabled || []
                    return {
                      ...prev,
                      skills: {
                        ...prev.skills,
                        disabled: checked 
                          ? disabled.filter(id => id !== skillId)
                          : [...disabled, skillId]
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
                    skills: {
                      ...prev.skills,
                      customValues: {
                        ...prev.skills?.customValues,
                        [skillId]: e.target.value
                      }
                    }
                  }
                })
              }}
              rows={3}
            />
          </div>
        )
      })}
      
      {skillsList.length === 0 && (
        <div className="text-center text-muted-foreground py-4">
          No skills added yet
        </div>
      )}
    </div>
  )
}
