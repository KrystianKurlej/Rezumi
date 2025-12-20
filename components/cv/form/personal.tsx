'use client'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { PersonalInfo, updatePersonalInfo } from '@/lib/slices/personalSlice'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function PersonalForm() {
    const dispatch = useAppDispatch()
    const personal = useAppSelector(state => state.personal)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        const key = id as keyof PersonalInfo
        dispatch(updatePersonalInfo({ [key]: value }))
    }

    return (
        <FieldSet>
            <Accordion type="single" collapsible defaultValue="personal-section">
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
                            />
                            </Field>
                        </FieldGroup>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </FieldSet>
    )
}