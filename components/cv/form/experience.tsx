'use client'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { NewExperience, updateNewExperience } from '@/lib/slices/experienceSlice'
import { Button } from "@/components/ui/button"
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
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ExperienceForm() {
    const dispatch = useAppDispatch()
    const newExperience = useAppSelector(state => state.newExperience)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        const key = id as keyof NewExperience
        dispatch(updateNewExperience({ [key]: value }))
    }

    return(
        <>
        <FieldLegend>
            Experience
        </FieldLegend>
        <Dialog>
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
                                value={newExperience.title}
                                onChange={handleChange}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="newExperienceCompany">
                                Company
                            </FieldLabel>
                            <Input
                                id="newExperienceCompany"
                                value={newExperience.company}
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
                                    value={newExperience.startDate}
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
                                    value={newExperience.endDate}
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
                                value={newExperience.description}
                                onChange={handleChange}
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>
                        Add Experience
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
}