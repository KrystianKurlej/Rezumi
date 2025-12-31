'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setFreelance, loadFreelanceFromDB } from '@/lib/slices/freelanceSlice'
import { updateFreelance as updateFreelanceDB } from '@/lib/db'
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

export default function FreelanceForm() {
    const dispatch = useAppDispatch()
    const freelance = useAppSelector(state => state.freelance)
    const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)
    const defaultLanguage = useAppSelector(state => state.settings.defaultLanguage)
    const [localFreelance, setLocalFreelance] = useState<string>(freelance?.freelanceText || '')
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        dispatch(loadFreelanceFromDB())
    }, [selectedLanguage, dispatch])

    useEffect(() => {
        setLocalFreelance(freelance?.freelanceText || '')
    }, [freelance])
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalFreelance(e.target.value)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null
            const freelanceData = { languageId, freelanceText: localFreelance }
            await updateFreelanceDB(freelanceData)
            dispatch(setFreelance(freelanceData))
        } catch (error) {
            console.error('Error saving freelance:', error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <AccordionItem value="freelance-section">
            <AccordionTrigger>
                Freelance & Side Projects
            </AccordionTrigger>
            <AccordionContent>
                <FieldGroup>
                    <Field>
                        <Textarea
                          id="freelanceText"
                          placeholder="- **Name of Project**: Description or details about project"
                          value={localFreelance}
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