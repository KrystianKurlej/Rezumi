'use client'

import { useState, ReactNode, useEffect } from 'react'
import { useAppDispatch } from '@/lib/hooks'
import { addSkillToDB } from '@/lib/slices/skillsSlice'
import { DBSkill } from '@/lib/db/types'
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface SkillAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: () => Promise<void>
  trigger?: ReactNode
  initialData?: DBSkill | null
}

export function SkillAddDialog({ 
  open, 
  onOpenChange, 
  onAdd,
  trigger,
  initialData
}: SkillAddDialogProps) {
  const dispatch = useAppDispatch()
  const [skillName, setSkillName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialData && open) {
      setSkillName(initialData.skillName)
      setDescription(initialData.description || '')
    } else if (!open) {
      setSkillName('')
      setDescription('')
    }
  }, [initialData, open])

  const handleSubmit = async () => {
    if (!skillName.trim()) return

    try {
      setIsLoading(true)
      await dispatch(addSkillToDB(skillName.trim(), description.trim()))
      onOpenChange(false)
      setSkillName('')
      setDescription('')
      await onAdd()
    } catch (error) {
      console.error('Error saving skill:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillName.trim()) {
      e.preventDefault()
      handleSubmit()
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
          <DialogTitle>Add new skill</DialogTitle>
          <DialogDescription>
            Add a skill to your CV. You can optionally add a description.
          </DialogDescription>
        </DialogHeader>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="skillName">
                Skill Name
              </FieldLabel>
              <Input
                id="skillName"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                onKeyUp={handleKeyPress}
                placeholder="React, Python, Project Management, etc."
                autoFocus
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="skillDescription">
                Description (optional)
              </FieldLabel>
              <Textarea
                id="skillDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details about your proficiency level or experience..."
                rows={3}
              />
            </Field>
          </FieldGroup>
        </FieldSet>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleSubmit}
            disabled={!skillName.trim() || isLoading}
          >
            Add Skill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
