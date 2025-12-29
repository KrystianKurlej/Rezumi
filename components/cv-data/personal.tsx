'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { PersonalInfo, setPersonalInfo, loadPersonalInfoFromDB } from '@/lib/slices/personalSlice'
import { updatePersonalInfo as updatePersonalInfoDB, getPersonalInfo } from '@/lib/db'
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
import { InputHint } from '../pages/CvData'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'

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
    const [defaultLanguageData, setDefaultLanguageData] = useState<PersonalInfo | null>(null)

    useEffect(() => {
        dispatch(loadPersonalInfoFromDB())
        
        // Jeśli nie jesteśmy na domyślnym języku, pobierz dane z domyślnego języka dla hintów
        if (selectedLanguage !== defaultLanguage) {
            getPersonalInfo(null).then(data => {
                if (data) {
                    setDefaultLanguageData({
                        languageId: null,
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        email: data.email || '',
                        phone: data.phone || ''
                    })
                }
            })
        } else {
            setDefaultLanguageData(null)
        }
    }, [selectedLanguage, defaultLanguage, dispatch])

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

    const getDefaultLanguageHint = (fieldName: keyof PersonalInfo): string | null => {
        if (selectedLanguage === defaultLanguage) return null
        if (!defaultLanguageData) return null
        if (localPersonal[fieldName]) return null
        if (!defaultLanguageData[fieldName]) return null
        
        return defaultLanguageData[fieldName] as string
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
                            <FieldLabel htmlFor="firstName">
                                First Name
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="firstName"
                                    value={localPersonal.firstName}
                                    onChange={handleChange}
                                    placeholder='John'
                                />
                                {getDefaultLanguageHint('firstName') && (
                                    <InputHint onClick={() => {
                                        setLocalPersonal(prev => ({
                                            ...prev,
                                            firstName: getDefaultLanguageHint('firstName') || ''
                                        }))
                                    }}>
                                        {getDefaultLanguageHint('firstName')}
                                    </InputHint>
                                )}
                            </InputGroup>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="lastName">
                                Last Name
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="lastName"
                                    value={localPersonal.lastName}
                                    onChange={handleChange}
                                    placeholder='Doe'
                                />
                                {getDefaultLanguageHint('lastName') && (
                                    <InputHint onClick={() => {
                                        setLocalPersonal(prev => ({
                                            ...prev,
                                            lastName: getDefaultLanguageHint('lastName') || ''
                                        }))
                                    }}>
                                        {getDefaultLanguageHint('lastName')}
                                    </InputHint>
                                )}
                            </InputGroup>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="email">
                                Email Address
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="email"
                                    type="email"
                                    value={localPersonal.email}
                                    onChange={handleChange}
                                    placeholder='john.doe@gmail.com'
                                />
                                {getDefaultLanguageHint('email') && (
                                    <InputHint onClick={() => {
                                        setLocalPersonal(prev => ({
                                            ...prev,
                                            email: getDefaultLanguageHint('email') || ''
                                        }))
                                    }}>
                                        {getDefaultLanguageHint('email')}
                                    </InputHint>
                                )}
                            </InputGroup>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="phone">
                                Phone Number
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="phone"
                                    type="tel"
                                    value={localPersonal.phone}
                                    onChange={handleChange}
                                    placeholder='+1 234 567 8900'
                                />
                                {getDefaultLanguageHint('phone') && (
                                    <InputHint onClick={() => {
                                        setLocalPersonal(prev => ({
                                            ...prev,
                                            phone: getDefaultLanguageHint('phone') || ''
                                        }))
                                    }}>
                                        {getDefaultLanguageHint('phone')}
                                    </InputHint>
                                )}
                            </InputGroup>
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