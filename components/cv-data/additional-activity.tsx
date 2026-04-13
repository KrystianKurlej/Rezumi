'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { loadAdditionalActivitiesFromDB } from '@/lib/slices/additionalActivitySlice'
import { deleteAdditionalActivity, getAllAdditionalActivities, getDismissedAdditionalActivityHints, dismissAdditionalActivityHint, removeAdditionalActivityFromAllDismissed, type DBAdditionalActivity } from '@/lib/db'
import { Button } from "@/components/ui/button"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AdditionalActivityItem } from './additionalActivity/AdditionalActivityItem'
import { AdditionalActivityAddDialog } from './additionalActivity/AdditionalActivityAddDialog'
import { AdditionalActivityEmptyState } from './additionalActivity/AdditionalActivityEmptyState'
import AdditionalActivityHint from './additionalActivity/AdditionalActivityHint'

export default function AdditionalActivityForm() {
    const dispatch = useAppDispatch()
    const additionalActivities = useAppSelector(state => state.additionalActivities.list)
    const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)
    const defaultLanguage = useAppSelector(state => state.settings.defaultLanguage)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [defaultAdditionalActivities, setDefaultAdditionalActivities] = useState<DBAdditionalActivity[]>([])
    const [dismissedHints, setDismissedHints] = useState<number[]>([])
    const [dismissedLoading, setDismissedLoading] = useState(true)
    const [additionalActivityToEdit, setAdditionalActivityToEdit] = useState<DBAdditionalActivity | null>(null)

    const loadAdditionalActivities = useCallback(async () => {
        dispatch(loadAdditionalActivitiesFromDB())
    }, [dispatch])

    useEffect(() => {
        const loadData = async () => {
            setDismissedLoading(true)
            if (selectedLanguage && selectedLanguage !== defaultLanguage) {
                try {
                    const dismissed = await getDismissedAdditionalActivityHints(selectedLanguage)
                    setDismissedHints(dismissed)
                    
                    const defaultExps = await getAllAdditionalActivities(null)
                    setDefaultAdditionalActivities(defaultExps)
                } catch (error) {
                    console.error('Error loading default additionalActivities:', error)
                } finally {
                    setDismissedLoading(false)
                }
            } else {
                setDefaultAdditionalActivities([])
                setDismissedHints([])
                setDismissedLoading(false)
            }
        }
        
        loadData()
    }, [selectedLanguage, defaultLanguage])

    useEffect(() => {
        loadAdditionalActivities()
    }, [selectedLanguage, loadAdditionalActivities])

    const handleDelete = async (id: number) => {
        try {
            const languageId = selectedLanguage || defaultLanguage
            await deleteAdditionalActivity(id, languageId)
            
            if (!selectedLanguage || selectedLanguage === defaultLanguage) {
                await removeAdditionalActivityFromAllDismissed(id)
            }
            
            await loadAdditionalActivities()
        } catch (error) {
            console.error('Error deleting additionalActivity:', error)
        }
    }

    const handleCopyAndEdit = (additionalActivity: DBAdditionalActivity) => {
        setAdditionalActivityToEdit(additionalActivity)
        setDialogOpen(true)
    }

    const handleDismiss = async (additionalActivityId: number) => {
        if (!selectedLanguage) return
        
        try {
            await dismissAdditionalActivityHint(selectedLanguage, additionalActivityId)
            setDismissedHints(prev => [...prev, additionalActivityId])
        } catch (error) {
            console.error('Error dismissing hint:', error)
        }
    }

    const handleDialogClose = (open: boolean) => {
        setDialogOpen(open)
        if (!open) {
            setAdditionalActivityToEdit(null)
        }
    }

    const handleAdd = async () => {
        if (additionalActivityToEdit?.id && selectedLanguage) {
            try {
                await dismissAdditionalActivityHint(selectedLanguage, additionalActivityToEdit.id)
                setDismissedHints(prev => [...prev, additionalActivityToEdit.id!])
            } catch (error) {
                console.error('Error dismissing hint:', error)
            }
        }
        
        await loadAdditionalActivities()
    }

    const hintsToShow = !dismissedLoading 
        ? defaultAdditionalActivities.filter(exp => exp.id && !dismissedHints.includes(exp.id))
        : []

    return(
        <AccordionItem value="additionalActivity-section">
            <AccordionTrigger>
                Additional Activity
            </AccordionTrigger>
            <AccordionContent>
                {hintsToShow.map((additionalActivity) => (
                    <AdditionalActivityHint
                        key={`hint-${additionalActivity.id}`}
                        additionalActivity={additionalActivity}
                        onCopyAndEdit={() => handleCopyAndEdit(additionalActivity)}
                        onDismiss={() => handleDismiss(additionalActivity.id!)}
                    />
                ))}
                {additionalActivities.length > 0 ? (
                    <>
                        <ul>
                            {additionalActivities.map((additionalActivity) => (
                                <li key={additionalActivity.id} className="mb-2">
                                    <AdditionalActivityItem
                                        additionalActivity={additionalActivity}
                                        onUpdate={loadAdditionalActivities}
                                        onDelete={handleDelete}
                                    />
                                </li>
                            ))}
                        </ul>
                        <AdditionalActivityAddDialog
                            open={dialogOpen}
                            onOpenChange={handleDialogClose}
                            onAdd={handleAdd}
                            initialData={additionalActivityToEdit}
                            trigger={
                                <Button variant="outline" className="w-full mb-4">
                                    <i className="bi bi-plus-lg"></i>
                                    Add more Additional Activity
                                </Button>
                            }
                        />
                    </>
                ) : (
                    <>
                        <AdditionalActivityEmptyState onAddClick={() => setDialogOpen(true)} />
                        <AdditionalActivityAddDialog
                            open={dialogOpen}
                            onOpenChange={handleDialogClose}
                            onAdd={handleAdd}
                            initialData={additionalActivityToEdit}
                        />
                    </>
                )}
            </AccordionContent>
        </AccordionItem>
    )
}