'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setFooter, loadFooterFromDB } from '@/lib/slices/footerSlice'
import { updateFooter as updateFooterDB } from '@/lib/db'
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

export default function FooterForm() {
    const dispatch = useAppDispatch()
    const footer = useAppSelector(state => state.footer)
    const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)
    const defaultLanguage = useAppSelector(state => state.settings.defaultLanguage)
    const [localFooter, setLocalFooter] = useState<string>(footer?.footerText || '')
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        dispatch(loadFooterFromDB())
    }, [selectedLanguage, dispatch])

    useEffect(() => {
        setLocalFooter(footer?.footerText || '')
    }, [footer])
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalFooter(e.target.value)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null
            const footerData = { languageId, footerText: localFooter }
            await updateFooterDB(footerData)
            dispatch(setFooter(footerData))
        } catch (error) {
            console.error('Error saving footer:', error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <AccordionItem value="footer-section">
            <AccordionTrigger>
                Footer
            </AccordionTrigger>
            <AccordionContent>
                <FieldGroup>
                    <Field>
                        <Textarea
                          id="footerText"
                          placeholder="Enter any legal disclaimers or additional information for the footer"
                          value={localFooter}
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