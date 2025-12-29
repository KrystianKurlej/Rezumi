'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setEducations, loadEducationsFromDB } from '@/lib/slices/educationSlice'
import { deleteEducation } from '@/lib/db'
import { Button } from "@/components/ui/button"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { EducationItem } from './education/EducationItem'
import { EducationAddDialog } from './education/EducationAddDialog'
import { EducationEmptyState } from './education/EducationEmptyState'

export default function EducationForm() {
    const dispatch = useAppDispatch()
    const educations = useAppSelector(state => state.educations.list)
    const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)
    const [dialogOpen, setDialogOpen] = useState(false)

    const loadEducations = useCallback(async () => {
        dispatch(loadEducationsFromDB())
    }, [dispatch])

    useEffect(() => {
        loadEducations()
    }, [selectedLanguage, loadEducations])

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