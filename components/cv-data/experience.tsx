'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setExperiences, loadExperiencesFromDB } from '@/lib/slices/experienceSlice'
import { deleteExperience } from '@/lib/db'
import { Button } from "@/components/ui/button"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ExperienceItem } from './experience/ExperienceItem'
import { ExperienceAddDialog } from './experience/ExperienceAddDialog'
import { ExperienceEmptyState } from './experience/ExperienceEmptyState'

export default function ExperienceForm() {
    const dispatch = useAppDispatch()
    const experiences = useAppSelector(state => state.experiences.list)
    const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)
    const [dialogOpen, setDialogOpen] = useState(false)

    const loadExperiences = useCallback(async () => {
        dispatch(loadExperiencesFromDB())
    }, [dispatch])

    useEffect(() => {
        loadExperiences()
    }, [selectedLanguage, loadExperiences])

    const handleDelete = async (id: number) => {
        try {
            await deleteExperience(id)
            await loadExperiences()
        } catch (error) {
            console.error('Error deleting experience:', error)
        }
    }

    return(
        <AccordionItem value="experience-section">
            <AccordionTrigger>
                Experience
            </AccordionTrigger>
            <AccordionContent>
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
                            onOpenChange={setDialogOpen}
                            onAdd={loadExperiences}
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
                            onOpenChange={setDialogOpen}
                            onAdd={loadExperiences}
                        />
                    </>
                )}
            </AccordionContent>
        </AccordionItem>
    )
}