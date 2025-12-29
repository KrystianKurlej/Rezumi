'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setCourses, loadCoursesFromDB } from '@/lib/slices/coursesSlice'
import { deleteCourse } from '@/lib/db'
import { Button } from "@/components/ui/button"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CourseItem } from './courses/CourseItem'
import { CourseAddDialog } from './courses/CourseAddDialog'
import { CourseEmptyState } from './courses/CourseEmptyState'

export default function CoursesForm() {
    const dispatch = useAppDispatch()
    const courses = useAppSelector(state => state.courses.list)
    const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)
    const [dialogOpen, setDialogOpen] = useState(false)

    const loadCourses = useCallback(async () => {
        dispatch(loadCoursesFromDB())
    }, [dispatch])

    useEffect(() => {
        loadCourses()
    }, [selectedLanguage, loadCourses])

    const handleDelete = async (id: number) => {
        try {
            await deleteCourse(id)
            await loadCourses()
        } catch (error) {
            console.error('Error deleting course:', error)
        }
    }

    return(
        <AccordionItem value="courses-section">
            <AccordionTrigger>
                Courses & Certifications
            </AccordionTrigger>
            <AccordionContent>
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
                            onOpenChange={setDialogOpen}
                            onAdd={loadCourses}
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
                            onOpenChange={setDialogOpen}
                            onAdd={loadCourses}
                        />
                    </>
                )}
            </AccordionContent>
        </AccordionItem>
    )
}
