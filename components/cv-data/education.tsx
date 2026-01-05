'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { loadEducationsFromDB } from '@/lib/slices/educationSlice'
import { deleteEducation, getAllEducations, getDismissedEducationHints, dismissEducationHint, removeEducationFromAllDismissed, type DBEducation } from '@/lib/db'
import { Button } from "@/components/ui/button"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { EducationItem } from './education/EducationItem'
import { EducationAddDialog } from './education/EducationAddDialog'
import { EducationEmptyState } from './education/EducationEmptyState'
import EducationHint from './education/EducationHint'

export default function EducationForm() {
    const dispatch = useAppDispatch()
    const educations = useAppSelector(state => state.educations.list)
    const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)
    const defaultLanguage = useAppSelector(state => state.settings.defaultLanguage)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [defaultEducations, setDefaultEducations] = useState<DBEducation[]>([])
    const [dismissedHints, setDismissedHints] = useState<number[]>([])
    const [dismissedLoading, setDismissedLoading] = useState(true)
    const [educationToEdit, setEducationToEdit] = useState<DBEducation | null>(null)

    const loadEducations = useCallback(async () => {
        dispatch(loadEducationsFromDB())
    }, [dispatch])

    useEffect(() => {
        const loadData = async () => {
            setDismissedLoading(true)
            if (selectedLanguage && selectedLanguage !== defaultLanguage) {
                try {
                    const dismissed = await getDismissedEducationHints(selectedLanguage)
                    setDismissedHints(dismissed)
                    
                    const defaultEdus = await getAllEducations(null)
                    setDefaultEducations(defaultEdus)
                } catch (error) {
                    console.error('Error loading default educations:', error)
                } finally {
                    setDismissedLoading(false)
                }
            } else {
                setDefaultEducations([])
                setDismissedHints([])
                setDismissedLoading(false)
            }
        }
        
        loadData()
    }, [selectedLanguage, defaultLanguage])

    useEffect(() => {
        loadEducations()
    }, [selectedLanguage, loadEducations])

    const handleDelete = async (id: number) => {
        try {
            const languageId = selectedLanguage || defaultLanguage
            await deleteEducation(id, languageId)
            
            if (!selectedLanguage || selectedLanguage === defaultLanguage) {
                await removeEducationFromAllDismissed(id)
            }
            
            await loadEducations()
        } catch (error) {
            console.error('Error deleting education:', error)
        }
    }

    const handleCopyAndEdit = (education: DBEducation) => {
        setEducationToEdit(education)
        setDialogOpen(true)
    }

    const handleDismiss = async (educationId: number) => {
        if (!selectedLanguage) return
        
        try {
            await dismissEducationHint(selectedLanguage, educationId)
            setDismissedHints(prev => [...prev, educationId])
        } catch (error) {
            console.error('Error dismissing hint:', error)
        }
    }

    const handleDialogClose = (open: boolean) => {
        setDialogOpen(open)
        if (!open) {
            setEducationToEdit(null)
        }
    }

    const handleAdd = async () => {
        if (educationToEdit?.id && selectedLanguage) {
            try {
                await dismissEducationHint(selectedLanguage, educationToEdit.id)
                setDismissedHints(prev => [...prev, educationToEdit.id!])
            } catch (error) {
                console.error('Error dismissing hint:', error)
            }
        }
        
        await loadEducations()
    }

    const hintsToShow = !dismissedLoading 
        ? defaultEducations.filter(edu => edu.id && !dismissedHints.includes(edu.id))
        : []

    return(
        <AccordionItem value="education-section">
            <AccordionTrigger>
                Education
            </AccordionTrigger>
            <AccordionContent>
                {hintsToShow.map((education) => (
                    <EducationHint
                        key={`hint-${education.id}`}
                        education={education}
                        onCopyAndEdit={() => handleCopyAndEdit(education)}
                        onDismiss={() => handleDismiss(education.id!)}
                    />
                ))}
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
                            onOpenChange={handleDialogClose}
                            onAdd={handleAdd}
                            initialData={educationToEdit}
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
                            onOpenChange={handleDialogClose}
                            onAdd={handleAdd}
                            initialData={educationToEdit}
                        />
                    </>
                )}
            </AccordionContent>
        </AccordionItem>
    )
}