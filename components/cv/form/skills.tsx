'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { Skills, updateSkills, setSkills } from '@/lib/slices/skillsSlice'
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

export default function SkillsForm() {
    const dispatch = useAppDispatch()
    const skills = useAppSelector(state => state.skills)

    useEffect(() => {
        const loadSkills = async () => {
            try {
                const savedSkills = await getSkills()
                if (savedSkills) {
                    dispatch(setSkills(savedSkills))
                }
            } catch (error) {
                console.error('Error loading skills:', error)
            }
        }
        
        loadSkills()
    }, [dispatch])
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target
        dispatch(updateSkills(value))
    }

    const handleBlur = async (e: React.FocusEvent<HTMLTextAreaElement>) => {
        try {
            await updateSkillsDB(skills)
        } catch (error) {
            console.error('Error saving skills:', error)
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
                          value={skills.skillsText}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <MarkdownInfo />
                    </Field>
                </FieldGroup>
            </AccordionContent>
        </AccordionItem>
    )
}