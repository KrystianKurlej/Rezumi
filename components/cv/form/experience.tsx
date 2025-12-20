'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setExperiences } from '@/lib/slices/experienceSlice'
import { getAllExperiences, deleteExperience } from '@/lib/db'
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
import { ExperienceItem } from './experience/ExperienceItem'
import { ExperienceAddDialog } from './experience/ExperienceAddDialog'
import { ExperienceEmptyState } from './experience/ExperienceEmptyState'

export default function ExperienceForm() {
    const dispatch = useAppDispatch()
    const experiences = useAppSelector(state => state.experiences.list)
    const [dialogOpen, setDialogOpen] = useState(false)

    const loadExperiences = useCallback(async () => {
        try {
            const savedExperiences = await getAllExperiences()
            dispatch(setExperiences(savedExperiences))
        } catch (error) {
            console.error('Error loading experiences:', error)
        }
    }, [dispatch])

    useEffect(() => {
        loadExperiences()
    }, [dispatch, loadExperiences])

    const handleDelete = async (id: number) => {
        try {
            await deleteExperience(id)
            await loadExperiences()
        } catch (error) {
            console.error('Error deleting experience:', error)
        }
    }

    return(
        <FieldSet>
            <Accordion type="single" collapsible defaultValue="experience-section">
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
            </Accordion>
        </FieldSet>
    )
}