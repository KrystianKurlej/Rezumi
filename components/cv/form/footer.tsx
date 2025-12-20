'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { Footer, updateFooter, setFooter } from '@/lib/slices/footerSlice'
import { getFooter, updateFooter as updateFooterDB } from '@/lib/db'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

export default function FooterForm() {
    const dispatch = useAppDispatch()
    const footer = useAppSelector(state => state.footer)

    useEffect(() => {
        const loadFooter = async () => {
            try {
                const savedFooter = await getFooter()
                if (savedFooter) {
                    dispatch(setFooter(savedFooter))
                }
            } catch (error) {
                console.error('Error loading footer:', error)
            }
        }
        
        loadFooter()
    }, [dispatch])
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { id, value } = e.target
        const key = id as keyof Footer
        dispatch(updateFooter({ [key]: value }))
    }

    const handleBlur = async (e: React.FocusEvent<HTMLTextAreaElement>) => {
        try {
            await updateFooterDB(footer)
        } catch (error) {
            console.error('Error saving footer:', error)
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
                        <FieldLabel htmlFor="footerText">Footer Text</FieldLabel>
                        <Textarea
                          id="footerText"
                          placeholder="Enter any legal disclaimers or additional information for the footer"
                          value={footer.footerText}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                    </Field>
                </FieldGroup>
            </AccordionContent>
        </AccordionItem>
    )
}