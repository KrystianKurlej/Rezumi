'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { loadCoursesFromDB } from '@/lib/slices/coursesSlice'
import { deleteCourse, getAllCourses, getDismissedCourseHints, dismissCourseHint, removeCourseFromAllDismissed, type DBCourse } from '@/lib/db'
import { Button } from "@/components/ui/button"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CourseItem } from './courses/CourseItem'
import { CourseAddDialog } from './courses/CourseAddDialog'
import { CourseEmptyState } from './courses/CourseEmptyState'
import CourseHint from './courses/CourseHint'

export default function CoursesForm() {
    const dispatch = useAppDispatch()
    const courses = useAppSelector(state => state.courses.list)
    const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)
    const defaultLanguage = useAppSelector(state => state.settings.defaultLanguage)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [defaultCourses, setDefaultCourses] = useState<DBCourse[]>([])
    const [dismissedHints, setDismissedHints] = useState<number[]>([])
    const [dismissedLoading, setDismissedLoading] = useState(true)
    const [courseToEdit, setCourseToEdit] = useState<DBCourse | null>(null)

    const loadCourses = useCallback(async () => {
        dispatch(loadCoursesFromDB())
    }, [dispatch])

    useEffect(() => {
        const loadData = async () => {
            setDismissedLoading(true)
            if (selectedLanguage && selectedLanguage !== defaultLanguage) {
                try {
                    const dismissed = await getDismissedCourseHints(selectedLanguage)
                    setDismissedHints(dismissed)
                    
                    const defaultCrs = await getAllCourses(null)
                    setDefaultCourses(defaultCrs)
                } catch (error) {
                    console.error('Error loading default courses:', error)
                } finally {
                    setDismissedLoading(false)
                }
            } else {
                setDefaultCourses([])
                setDismissedHints([])
                setDismissedLoading(false)
            }
        }
        
        loadData()
    }, [selectedLanguage, defaultLanguage])

    useEffect(() => {
        loadCourses()
    }, [selectedLanguage, loadCourses])

    const handleDelete = async (id: number) => {
        try {
            await deleteCourse(id)
            
            if (!selectedLanguage || selectedLanguage === defaultLanguage) {
                await removeCourseFromAllDismissed(id)
            }
            
            await loadCourses()
        } catch (error) {
            console.error('Error deleting course:', error)
        }
    }

    const handleCopyAndEdit = (course: DBCourse) => {
        setCourseToEdit(course)
        setDialogOpen(true)
    }

    const handleDismiss = async (courseId: number) => {
        if (!selectedLanguage) return
        
        try {
            await dismissCourseHint(selectedLanguage, courseId)
            setDismissedHints(prev => [...prev, courseId])
        } catch (error) {
            console.error('Error dismissing hint:', error)
        }
    }

    const handleDialogClose = (open: boolean) => {
        setDialogOpen(open)
        if (!open) {
            setCourseToEdit(null)
        }
    }

    const handleAdd = async () => {
        if (courseToEdit?.id && selectedLanguage) {
            try {
                await dismissCourseHint(selectedLanguage, courseToEdit.id)
                setDismissedHints(prev => [...prev, courseToEdit.id!])
            } catch (error) {
                console.error('Error dismissing hint:', error)
            }
        }
        
        await loadCourses()
    }

    const hintsToShow = !dismissedLoading 
        ? defaultCourses.filter(crs => crs.id && !dismissedHints.includes(crs.id))
        : []

    return(
        <AccordionItem value="courses-section">
            <AccordionTrigger>
                Courses & Certifications
            </AccordionTrigger>
            <AccordionContent>
                {hintsToShow.map((course) => (
                    <CourseHint
                        key={`hint-${course.id}`}
                        course={course}
                        onCopyAndEdit={() => handleCopyAndEdit(course)}
                        onDismiss={() => handleDismiss(course.id!)}
                    />
                ))}
                {courses.length > 0 ? (
                    <>
                        <ul>
                            {courses.map((course) => (
                                <li key={course.id} className="mb-2">
                                    <CourseItem
                                        course={course}
                                        onUpdate={loadCourses}
                                        onDelete={handleDelete}
                                    />
                                </li>
                            ))}
                        </ul>
                        <CourseAddDialog
                            open={dialogOpen}
                            onOpenChange={handleDialogClose}
                            onAdd={handleAdd}
                            initialData={courseToEdit}
                            trigger={
                                <Button variant="outline" className="w-full mb-4">
                                    <i className="bi bi-plus-lg"></i>
                                    Add More Courses
                                </Button>
                            }
                        />
                    </>
                ) : (
                    <>
                        <CourseEmptyState onAddClick={() => setDialogOpen(true)} />
                        <CourseAddDialog
                            open={dialogOpen}
                            onOpenChange={handleDialogClose}
                            onAdd={handleAdd}
                            initialData={courseToEdit}
                        />
                    </>
                )}
            </AccordionContent>
        </AccordionItem>
    )
}
