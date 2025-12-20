'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setEducations } from '@/lib/slices/educationSlice'
import { getAllEducations, deleteEducation } from '@/lib/db'
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  FieldSet,
} from "@/components/ui/field"
import { EducationItem } from './education/EducationItem'
import { EducationAddDialog } from './education/EducationAddDialog'
import { EducationEmptyState } from './education/EducationEmptyState'

export default function EducationForm() {
    const dispatch = useAppDispatch()
    const educations = useAppSelector(state => state.educations.list)
    const [dialogOpen, setDialogOpen] = useState(false)

    const loadEducations = async () => {
        try {
            const savedEducations = await getAllEducations()
            dispatch(setEducations(savedEducations))
        } catch (error) {
            console.error('Error loading educations:', error)
        }
    }

    useEffect(() => {
        loadEducations()
    }, [dispatch])

    const handleDelete = async (id: number) => {
        try {
            await deleteEducation(id)
            await loadEducations()
        } catch (error) {
            console.error('Error deleting education:', error)
        }
    }

    return(
        <AccordionItem value="education-section">
            <AccordionTrigger>
                Education
            </AccordionTrigger>
            <AccordionContent>
                {educations.length > 0 ? (
                    <>
                        <ul>
                            {educations.map((education) => (
                                <li key={education.id} className="mb-2">
                                    <EducationItem
                                        education={education}
                                        onUpdate={loadEducations}
                                        onDelete={handleDelete}
                                    />
                                </li>
                            ))}
                        </ul>
                        <EducationAddDialog
                            open={dialogOpen}
                            onOpenChange={setDialogOpen}
                            onAdd={loadEducations}
                            trigger={
                                <Button variant="outline" className="w-full mb-4">
                                    <i className="bi bi-plus-lg"></i>
                                    Add more Education
                                </Button>
                            }
                        />
                    </>
                ) : (
                    <>
                        <EducationEmptyState onAddClick={() => setDialogOpen(true)} />
                        <EducationAddDialog
                            open={dialogOpen}
                            onOpenChange={setDialogOpen}
                            onAdd={loadEducations}
                        />
                    </>
                )}
            </AccordionContent>
        </AccordionItem>
    )
}