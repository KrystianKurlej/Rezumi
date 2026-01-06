'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { loadSkillsFromDB, addSkillToDB, deleteSkillFromDB, updateSkillInDB } from '@/lib/slices/skillsSlice'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Field,
  FieldGroup,
} from "@/components/ui/field"
import { Button } from '@/components/ui/button'
import { Input } from '../ui/input'
import { Item, ItemTitle, ItemActions } from '../ui/item'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Textarea } from '../ui/textarea'

export default function SkillsForm() {
    const dispatch = useAppDispatch()
    const skills = useAppSelector(state => state.skills.skills)
    const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)
    const [newSkillName, setNewSkillName] = useState<string>('')
    const [editingSkill, setEditingSkill] = useState<{ id: number; description: string } | null>(null)

    useEffect(() => {
        dispatch(loadSkillsFromDB())
    }, [selectedLanguage, dispatch])

    const handleAddSkill = async () => {
        if (newSkillName.trim()) {
            await dispatch(addSkillToDB(newSkillName.trim()))
            setNewSkillName('')
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddSkill()
        }
    }

    const handleDeleteSkill = async (id: number) => {
        await dispatch(deleteSkillFromDB(id))
    }

    const handleEditSkill = (skill: { id?: number; skillName: string; description?: string }) => {
        if (skill.id) {
            setEditingSkill({ id: skill.id, description: skill.description || '' })
        }
    }

    const handleSaveDescription = async () => {
        if (editingSkill) {
            const skill = skills.find(s => s.id === editingSkill.id)
            if (skill) {
                await dispatch(updateSkillInDB(editingSkill.id, skill.skillName, editingSkill.description))
            }
            setEditingSkill(null)
        }
    }

    return (
        <AccordionItem value="skills-section">
            <AccordionTrigger>
                Skills
            </AccordionTrigger>
            <AccordionContent>
                <FieldGroup>
                    <Field>
                        <div className='flex gap-1'>
                            <Input
                                id="newSkill"
                                placeholder="Type a new skill and press Enter"
                                type='text'
                                value={newSkillName}
                                onChange={(e) => setNewSkillName(e.target.value)}
                                onKeyUp={handleKeyPress}
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleAddSkill}
                            >
                                <i className="bi bi-plus-lg"></i>
                            </Button>
                        </div>
                    </Field>
                    
                    {skills.length > 0 && (
                        <Field>
                            <div className='flex flex-wrap gap-2'>
                                {skills.map((skill) => (
                                    <Item key={skill.id} variant="outline" className='p-2 items-center gap-3 pl-3'>
                                        <ItemTitle>{skill.skillName}</ItemTitle>
                                        <ItemActions>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon-sm"
                                                        onClick={() => handleEditSkill(skill)}
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Skill: <em>{skill.skillName}</em></DialogTitle>
                                                    </DialogHeader>
                                                    <Textarea
                                                        value={editingSkill?.id === skill.id && editingSkill ? editingSkill.description : skill.description || ''}
                                                        onChange={(e) => {
                                                            if (editingSkill && editingSkill.id === skill.id) {
                                                                setEditingSkill({ id: editingSkill.id, description: e.target.value })
                                                            }
                                                        }}
                                                        placeholder="Add a description for this skill..."
                                                    />
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline">
                                                                Close
                                                            </Button>
                                                        </DialogClose>
                                                        <DialogClose asChild>
                                                            <Button onClick={handleSaveDescription}>
                                                                Save changes
                                                            </Button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                            <Button
                                                variant="outline"
                                                size="icon-sm"
                                                onClick={() => handleDeleteSkill(skill.id!)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </ItemActions>
                                    </Item>
                                ))}
                            </div>
                        </Field>
                    )}
                </FieldGroup>
            </AccordionContent>
        </AccordionItem>
    )
}
