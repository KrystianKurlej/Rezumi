'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { PersonalInfo, setPersonalInfo } from '@/lib/slices/personalSlice'
import { getPersonalInfo, updatePersonalInfo as updatePersonalInfoDB } from '@/lib/db'
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
    const [localPersonal, setLocalPersonal] = useState<PersonalInfo>({
        firstName: personal.firstName || '',
        lastName: personal.lastName || '',
        email: personal.email || '',
        phone: personal.phone || ''
    })
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const loadPersonalInfo = async () => {
            try {
                const savedPersonalInfo = await getPersonalInfo()
                if (savedPersonalInfo) {
                    const safePersonalInfo = {
                        firstName: savedPersonalInfo.firstName || '',
                        lastName: savedPersonalInfo.lastName || '',
                        email: savedPersonalInfo.email || '',
                        phone: savedPersonalInfo.phone || ''
                    }
                    dispatch(setPersonalInfo(safePersonalInfo))
                    setLocalPersonal(safePersonalInfo)
                }
            } catch (error) {
                console.error('Error loading personal info:', error)
            }
        }
        
        loadPersonalInfo()
    }, [dispatch])

    useEffect(() => {
        setLocalPersonal({
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
            await updatePersonalInfoDB(localPersonal)
            dispatch(setPersonalInfo(localPersonal))
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