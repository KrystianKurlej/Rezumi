'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { loadExperiencesFromDB } from '@/lib/slices/experienceSlice'
import { deleteExperience, getAllExperiences, getDismissedExperienceHints, dismissExperienceHint, removeExperienceFromAllDismissed, type DBExperience } from '@/lib/db'
import { Button } from "@/components/ui/button"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ExperienceItem } from './experience/ExperienceItem'
import { ExperienceAddDialog } from './experience/ExperienceAddDialog'
import { ExperienceEmptyState } from './experience/ExperienceEmptyState'
import ExperienceHint from './experience/ExperienceHint'

export default function ExperienceForm() {
    const dispatch = useAppDispatch()
    const experiences = useAppSelector(state => state.experiences.list)
    const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)
    const defaultLanguage = useAppSelector(state => state.settings.defaultLanguage)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [defaultExperiences, setDefaultExperiences] = useState<DBExperience[]>([])
    const [dismissedHints, setDismissedHints] = useState<number[]>([])
    const [dismissedLoading, setDismissedLoading] = useState(true)
    const [experienceToEdit, setExperienceToEdit] = useState<DBExperience | null>(null)

    const loadExperiences = useCallback(async () => {
        dispatch(loadExperiencesFromDB())
    }, [dispatch])

    useEffect(() => {
        const loadData = async () => {
            setDismissedLoading(true)
            if (selectedLanguage && selectedLanguage !== defaultLanguage) {
                try {
                    const dismissed = await getDismissedExperienceHints(selectedLanguage)
                    setDismissedHints(dismissed)
                    
                    const defaultExps = await getAllExperiences(null)
                    setDefaultExperiences(defaultExps)
                } catch (error) {
                    console.error('Error loading default experiences:', error)
                } finally {
                    setDismissedLoading(false)
                }
            } else {
                setDefaultExperiences([])
                setDismissedHints([])
                setDismissedLoading(false)
            }
        }
        
        loadData()
    }, [selectedLanguage, defaultLanguage])

    useEffect(() => {
        loadExperiences()
    }, [selectedLanguage, loadExperiences])

    const handleDelete = async (id: number) => {
        try {
            const languageId = selectedLanguage || defaultLanguage
            await deleteExperience(id, languageId)
            
            if (!selectedLanguage || selectedLanguage === defaultLanguage) {
                await removeExperienceFromAllDismissed(id)
            }
            
            await loadExperiences()
        } catch (error) {
            console.error('Error deleting experience:', error)
        }
    }

    const handleCopyAndEdit = (experience: DBExperience) => {
        setExperienceToEdit(experience)
        setDialogOpen(true)
    }

    const handleDismiss = async (experienceId: number) => {
        if (!selectedLanguage) return
        
        try {
            await dismissExperienceHint(selectedLanguage, experienceId)
            setDismissedHints(prev => [...prev, experienceId])
        } catch (error) {
            console.error('Error dismissing hint:', error)
        }
    }

    const handleDialogClose = (open: boolean) => {
        setDialogOpen(open)
        if (!open) {
            setExperienceToEdit(null)
        }
    }

    const handleAdd = async () => {
        if (experienceToEdit?.id && selectedLanguage) {
            try {
                await dismissExperienceHint(selectedLanguage, experienceToEdit.id)
                setDismissedHints(prev => [...prev, experienceToEdit.id!])
            } catch (error) {
                console.error('Error dismissing hint:', error)
            }
        }
        
        await loadExperiences()
    }

    const hintsToShow = !dismissedLoading 
        ? defaultExperiences.filter(exp => exp.id && !dismissedHints.includes(exp.id))
        : []

    return(
        <AccordionItem value="experience-section">
            <AccordionTrigger>
                Experience
            </AccordionTrigger>
            <AccordionContent>
                {hintsToShow.map((experience) => (
                    <ExperienceHint
                        key={`hint-${experience.id}`}
                        experience={experience}
                        onCopyAndEdit={() => handleCopyAndEdit(experience)}
                        onDismiss={() => handleDismiss(experience.id!)}
                    />
                ))}
                {experiences.length > 0 ? (
                    <>
                        <ul>
                            {experiences.map((experience) => (
                                <li key={experience.id} className="mb-2">
                                    <ExperienceItem
                                        experience={experience}
                                        onUpdate={loadExperiences}
                                        onDelete={handleDelete}
                                    />
                                </li>
                            ))}
                        </ul>
                        <ExperienceAddDialog
                            open={dialogOpen}
                            onOpenChange={handleDialogClose}
                            onAdd={handleAdd}
                            initialData={experienceToEdit}
                            trigger={
                                <Button variant="outline" className="w-full mb-4">
                                    <i className="bi bi-plus-lg"></i>
                                    Add more Experience
                                </Button>
                            }
                        />
                    </>
                ) : (
                    <>
                        <ExperienceEmptyState onAddClick={() => setDialogOpen(true)} />
                        <ExperienceAddDialog
                            open={dialogOpen}
                            onOpenChange={handleDialogClose}
                            onAdd={handleAdd}
                            initialData={experienceToEdit}
                        />
                    </>
                )}
            </AccordionContent>
        </AccordionItem>
    )
}