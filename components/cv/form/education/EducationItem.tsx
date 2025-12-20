'use client'

import { useState } from 'react'
import { DBEducation } from '@/lib/db'
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { EducationEditDialog } from './EducationEditDialog'
import { EducationDeleteDialog } from './EducationDeleteDialog'

interface EducationItemProps {
  education: DBEducation
  onUpdate: () => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function EducationItem({ education, onUpdate, onDelete }: EducationItemProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{education.degree} in {education.fieldOfStudy}</ItemTitle>
        <div>
          <ItemDescription>
            {education.institution}
          </ItemDescription>
          <ItemDescription>
            {education.startDate} - {education.isOngoing ? 'Present' : education.endDate}
          </ItemDescription>
          {education.description && (
            <ItemDescription>
              {education.description}
            </ItemDescription>
          )}
        </div>
      </ItemContent>
      <ItemActions>
        <EducationEditDialog
          education={education}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onUpdate={onUpdate}
          trigger={
            <Button variant="outline" size="icon-sm">
              <i className="bi bi-pencil-square"></i>
            </Button>
          }
        />
        <EducationDeleteDialog
          education={education}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onDelete={() => onDelete(education.id!)}
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