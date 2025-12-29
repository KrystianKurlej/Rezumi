'use client'

import { useState } from 'react'
import { DBCourse } from '@/lib/db'
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { CourseEditDialog } from './CourseEditDialog'
import { CourseDeleteDialog } from './CourseDeleteDialog'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface CourseItemProps {
  course: DBCourse
  onUpdate: () => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function CourseItem({ course, onUpdate, onDelete }: CourseItemProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{course.courseName}</ItemTitle>
        <div>
          <ItemDescription>
            {course.platform}
          </ItemDescription>
          <ItemDescription>
            {course.isOngoing ? 'In Progress' : `Completed: ${formatDate(course.completionDate, 'long')}`}
          </ItemDescription>
          {course.certificateUrl && (
            <ItemDescription>
              <Link href={course.certificateUrl} target="_blank" rel="noopener noreferrer">
                Certificate URL
              </Link>
            </ItemDescription>
          )}
          {course.description && (
            <ItemDescription>
              {course.description}
            </ItemDescription>
          )}
        </div>
      </ItemContent>
      <ItemActions>
        <CourseEditDialog
          course={course}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onUpdate={onUpdate}
          trigger={
            <Button variant="outline" size="icon-sm">
              <i className="bi bi-pencil-square"></i>
            </Button>
          }
        />
        <CourseDeleteDialog
          course={course}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onDelete={() => onDelete(course.id!)}
          trigger={
            <Button variant="outline" size="icon-sm">
              <i className="bi bi-trash"></i>
            </Button>
          }
        />
      </ItemActions>
    </Item>
  )
}
