'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setSkills } from '@/lib/slices/skillsSlice'
import { getSkills, updateSkills as updateSkillsDB } from '@/lib/db'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Field,
  FieldGroup,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import MarkdownInfo from '@/components/MarkdownInfo'
import { Button } from '@/components/ui/button'

export default function SkillsForm() {
    const dispatch = useAppDispatch()
    const skills = useAppSelector(state => state.skills)
    const [localSkills, setLocalSkills] = useState<string>(skills?.skillsText || '')
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const loadSkills = async () => {
            try {
                const savedSkills = await getSkills()
                if (savedSkills) {
                    dispatch(setSkills(savedSkills))
                    setLocalSkills(savedSkills.skillsText)
                }
            } catch (error) {
                console.error('Error loading skills:', error)
            }
        }
        
        loadSkills()
    }, [dispatch])

    useEffect(() => {
        setLocalSkills(skills?.skillsText || '')
    }, [skills])
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalSkills(e.target.value)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const skillsData = { skillsText: localSkills }
            await updateSkillsDB(skillsData)
            dispatch(setSkills(skillsData))
        } catch (error) {
            console.error('Error saving skills:', error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <AccordionItem value="skills-section">
            <AccordionTrigger>
                Skills
            </AccordionTrigger>
            <AccordionContent>
                <FieldGroup>
                    <Field>
                        <Textarea
                          id="skillsText"
                          placeholder="- **Name of Skill**: Description or details about skill"
                          value={localSkills}
                          onChange={handleChange}
                        />
                        <MarkdownInfo />
                    </Field>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        Save changes <i className="bi bi-check"></i>
                    </Button>
                </FieldGroup>
            </AccordionContent>
        </AccordionItem>
    )
}