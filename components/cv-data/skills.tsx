'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { loadSkillsFromDB, addSkillToDB, deleteSkillFromDB, updateSkillInDB, updateSkillsOrderInDB } from '@/lib/slices/skillsSlice'
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableSkillItemProps {
    skill: { id?: number; skillName: string; description?: string };
    editingSkill: { id: number; description: string } | null;
    onEdit: () => void;
    onDelete: () => void;
    onDescriptionChange: (description: string) => void;
    onSaveDescription: () => void;
}

function SortableSkillItem({
    skill,
    editingSkill,
    onEdit,
    onDelete,
    onDescriptionChange,
    onSaveDescription,
}: SortableSkillItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: skill.id! });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Item 
            ref={setNodeRef} 
            style={style} 
            variant="outline" 
            className='p-2 items-center gap-3 pl-3'
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing touch-none"
                style={{ marginRight: '4px' }}
            >
                <i className="bi bi-grip-vertical"></i>
            </button>
            <ItemTitle className='flex-1'>{skill.skillName}</ItemTitle>
            <ItemActions>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={onEdit}
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
                            onChange={(e) => onDescriptionChange(e.target.value)}
                            placeholder="Add a description for this skill..."
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">
                                    Close
                                </Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button onClick={onSaveDescription}>
                                    Save changes
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={onDelete}
                >
                    <i className="bi bi-trash"></i>
                </Button>
            </ItemActions>
        </Item>
    );
}

export default function SkillsForm() {
    const dispatch = useAppDispatch()
    const skills = useAppSelector(state => state.skills.skills)
    const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)
    const [newSkillName, setNewSkillName] = useState<string>('')
    const [editingSkill, setEditingSkill] = useState<{ id: number; description: string } | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        dispatch(loadSkillsFromDB())
    }, [selectedLanguage, dispatch])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = skills.findIndex((skill) => skill.id === active.id);
            const newIndex = skills.findIndex((skill) => skill.id === over.id);

            const newSkills = arrayMove(skills, oldIndex, newIndex);
            dispatch(updateSkillsOrderInDB(newSkills));
        }
    };

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
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={skills.map((s) => s.id!)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className='flex flex-col gap-2'>
                                        {skills.map((skill) => (
                                            <SortableSkillItem
                                                key={skill.id}
                                                skill={skill}
                                                editingSkill={editingSkill}
                                                onEdit={() => handleEditSkill(skill)}
                                                onDelete={() => handleDeleteSkill(skill.id!)}
                                                onDescriptionChange={(description) => {
                                                    if (editingSkill && editingSkill.id === skill.id) {
                                                        setEditingSkill({ id: editingSkill.id, description })
                                                    }
                                                }}
                                                onSaveDescription={handleSaveDescription}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        </Field>
                    )}
                </FieldGroup>
            </AccordionContent>
        </AccordionItem>
    )
}
