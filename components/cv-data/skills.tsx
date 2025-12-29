'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setSkills, loadSkillsFromDB } from '@/lib/slices/skillsSlice'
import { updateSkills as updateSkillsDB } from '@/lib/db'
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
    const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)
    const defaultLanguage = useAppSelector(state => state.settings.defaultLanguage)
    const [localSkills, setLocalSkills] = useState<string>(skills?.skillsText || '')
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        dispatch(loadSkillsFromDB())
    }, [selectedLanguage, dispatch])

    useEffect(() => {
        setLocalSkills(skills?.skillsText || '')
    }, [skills])
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalSkills(e.target.value)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null
            const skillsData = { languageId, skillsText: localSkills }
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