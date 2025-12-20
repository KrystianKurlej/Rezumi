'use client'

import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { NewExperience, updateNewExperience, addExperience, resetNewExperience, setLoading, setExperiences } from '@/lib/slices/experienceSlice'
import { addExperience as addExperienceToDB, getAllExperiences, deleteExperience } from '@/lib/db'
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ExperienceForm() {
    const dispatch = useAppDispatch()
    const newExperience = useAppSelector(state => state.newExperience)
    const experiences = useAppSelector(state => state.experiences.list)
    const isAddingExperienceLoading = useAppSelector(state => state.experiences.isLoading)
    const [dialogOpen, setDialogOpen] = useState(false)

    useEffect(() => {
        const loadExperiences = async () => {
            try {
                const savedExperiences = await getAllExperiences()
                dispatch(setExperiences(savedExperiences))
            } catch (error) {
                console.error('Error loading experiences:', error)
            }
        }

        loadExperiences()
    }, [dispatch])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        const key = id as keyof NewExperience
        dispatch(updateNewExperience({ [key]: value }))
    }

    const handleSubmit = async () => {
      try {
        dispatch(setLoading(true))
        const experienceData = {
          title: newExperience.newExperienceTitle,
          company: newExperience.newExperienceCompany,
          startDate: newExperience.newExperienceStartDate,
          endDate: newExperience.newExperienceEndDate,
          description: newExperience.newExperienceDescription
        }
        const id = await addExperienceToDB(experienceData)
        dispatch(addExperience({
            id,
            createdAt: Date.now(),
            ...experienceData
        }))
        setDialogOpen(false)
        dispatch(resetNewExperience())
      } catch (error) {
        console.error('Error saving experience:', error)
      } finally {
        dispatch(setLoading(false))
      }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteExperience(id)
            dispatch(setExperiences(experiences.filter(exp => exp.id !== id)))
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
                        {experiences.length > 0 && (
                            <ul>
                                {experiences.map((experience) => (
                                    <li key={experience.id} className="mb-2">
                                        <Item variant="outline">
                                            <ItemContent>
                                                <ItemTitle>{experience.title} - {experience.company}</ItemTitle>
                                                <div>
                                                    <ItemDescription>
                                                        {experience.startDate} - {experience.endDate}
                                                    </ItemDescription>
                                                    <ItemDescription>
                                                        {experience.description}
                                                    </ItemDescription>
                                                </div>
                                            </ItemContent>
                                            <ItemActions>
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            Delete
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Delete <em>{experience.title} {experience.company && `- ${experience.company}`}</em>?</DialogTitle>
                                                            <DialogDescription>
                                                                Are you sure you want to delete this experience?
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <DialogClose asChild>
                                                                <Button variant="outline">Cancel</Button>
                                                            </DialogClose>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => handleDelete(experience.id!)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </ItemActions>
                                        </Item>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full mb-4">
                                    Add New
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Experience</DialogTitle>
                                    <DialogDescription>
                                        Add your work experience details here.
                                    </DialogDescription>
                                </DialogHeader>
                                <FieldSet>
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="newExperienceTitle">
                                                Title
                                            </FieldLabel>
                                            <Input
                                                id="newExperienceTitle"
                                                value={newExperience.newExperienceTitle}
                                                onChange={handleChange}
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="newExperienceCompany">
                                                Company
                                            </FieldLabel>
                                            <Input
                                                id="newExperienceCompany"
                                                value={newExperience.newExperienceCompany}
                                                onChange={handleChange}
                                            />
                                        </Field>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Field>
                                                <FieldLabel htmlFor="newExperienceStartDate">
                                                    Start Date
                                                </FieldLabel>
                                                <Input
                                                    id="newExperienceStartDate"
                                                    value={newExperience.newExperienceStartDate}
                                                    onChange={handleChange}
                                                    type="date"
                                                />
                                            </Field>
                                            <Field>
                                                <FieldLabel htmlFor="newExperienceEndDate">
                                                    End Date
                                                </FieldLabel>
                                                <Input
                                                    id="newExperienceEndDate"
                                                    value={newExperience.newExperienceEndDate}
                                                    onChange={handleChange}
                                                    type="date"
                                                />
                                            </Field>
                                        </div>
                                        <Field>
                                            <FieldLabel htmlFor="newExperienceDescription">
                                                Description
                                            </FieldLabel>
                                            <Textarea
                                                id="newExperienceDescription"
                                                value={newExperience.newExperienceDescription}
                                                onChange={handleChange}
                                            />
                                        </Field>
                                    </FieldGroup>
                                </FieldSet>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button onClick={handleSubmit} disabled={isAddingExperienceLoading}>
                                        Add Experience
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </FieldSet>
    )
}