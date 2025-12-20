'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { PersonalInfo, updatePersonalInfo, setPersonalInfo } from '@/lib/slices/personalSlice'
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

export default function PersonalForm() {
    const dispatch = useAppDispatch()
    const personal = useAppSelector(state => state.personal)

    useEffect(() => {
        const loadPersonalInfo = async () => {
            try {
                const savedPersonalInfo = await getPersonalInfo()
                if (savedPersonalInfo) {
                    dispatch(setPersonalInfo(savedPersonalInfo))
                }
            } catch (error) {
                console.error('Error loading personal info:', error)
            }
        }
        
        loadPersonalInfo()
    }, [dispatch])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        const key = id as keyof PersonalInfo
        dispatch(updatePersonalInfo({ [key]: value }))
    }

    const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        try {
            await updatePersonalInfoDB(personal)
        } catch (error) {
            console.error('Error saving personal info:', error)
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
                                value={personal.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="lastName">
                                Last Name
                            </FieldLabel>
                            <Input
                                id="lastName"
                                value={personal.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Field>
                    </div>
                    <Field>
                    <FieldLabel htmlFor="email">
                        Email Address
                    </FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        value={personal.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    </Field>
                    <Field>
                    <FieldLabel htmlFor="phone">
                        Phone Number
                    </FieldLabel>
                    <Input
                        id="phone"
                        type="tel"
                        value={personal.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    </Field>
                </FieldGroup>
            </AccordionContent>
        </AccordionItem>
    )
}