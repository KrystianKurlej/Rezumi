'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setFooter } from '@/lib/slices/footerSlice'
import { getFooter, updateFooter as updateFooterDB } from '@/lib/db'
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
    const [localFooter, setLocalFooter] = useState<string>(footer.footerText)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const loadFooter = async () => {
            try {
                const savedFooter = await getFooter()
                if (savedFooter) {
                    dispatch(setFooter(savedFooter))
                    setLocalFooter(savedFooter.footerText)
                }
            } catch (error) {
                console.error('Error loading footer:', error)
            }
        }
        
        loadFooter()
    }, [dispatch])

    useEffect(() => {
        setLocalFooter(footer.footerText)
    }, [footer])
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalFooter(e.target.value)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const footerData = { footerText: localFooter }
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