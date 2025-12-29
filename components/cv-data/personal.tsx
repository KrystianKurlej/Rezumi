'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { PersonalInfo, setPersonalInfo, loadPersonalInfoFromDB } from '@/lib/slices/personalSlice'
import { updatePersonalInfo as updatePersonalInfoDB } from '@/lib/db'
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
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'

export default function PersonalForm() {
    const dispatch = useAppDispatch()
    const personal = useAppSelector(state => state.personal)
    const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)
    const defaultLanguage = useAppSelector(state => state.settings.defaultLanguage)
    const [localPersonal, setLocalPersonal] = useState<PersonalInfo>({
        languageId: personal.languageId,
        firstName: personal.firstName || '',
        lastName: personal.lastName || '',
        email: personal.email || '',
        phone: personal.phone || ''
    })
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        dispatch(loadPersonalInfoFromDB())
    }, [selectedLanguage, dispatch])

    useEffect(() => {
        setLocalPersonal({
            languageId: personal.languageId,
            firstName: personal.firstName || '',
            lastName: personal.lastName || '',
            email: personal.email || '',
            phone: personal.phone || ''
        })
    }, [personal])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        const key = id as keyof PersonalInfo
        setLocalPersonal(prev => ({ ...prev, [key]: value }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null
            
            const dataToSave = {
                ...localPersonal,
                languageId
            }
            
            await updatePersonalInfoDB(dataToSave)
            dispatch(setPersonalInfo(dataToSave))
        } catch (error) {
            console.error('Error saving personal info:', error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <AccordionItem value="personal-section">
            <AccordionTrigger>
                Personal Information
            </AccordionTrigger>
            <AccordionContent>
                <FieldGroup>
                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="fistName">
                                First Name
                            </FieldLabel>
                            <Input
                                id="firstName"
                                value={localPersonal.firstName}
                                onChange={handleChange}
                                placeholder='John'
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="lastName">
                                Last Name
                            </FieldLabel>
                            <Input
                                id="lastName"
                                value={localPersonal.lastName}
                                onChange={handleChange}
                                placeholder='Doe'
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="email">
                                Email Address
                            </FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                value={localPersonal.email}
                                onChange={handleChange}
                                placeholder='john.doe@gmail.com'
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="phone">
                                Phone Number
                            </FieldLabel>
                            <Input
                                id="phone"
                                type="tel"
                                value={localPersonal.phone}
                                onChange={handleChange}
                                placeholder='+1 234 567 8900'
                            />
                        </Field>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        Save Changes <i className="bi bi-check"></i>
                    </Button>
                </FieldGroup>
            </AccordionContent>
        </AccordionItem>
    )
}