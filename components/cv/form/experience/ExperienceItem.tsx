'use client'

import { useState } from 'react'
import { DBExperience } from '@/lib/db'
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { ExperienceEditDialog } from './ExperienceEditDialog'
import { ExperienceDeleteDialog } from './ExperienceDeleteDialog'

interface ExperienceItemProps {
  experience: DBExperience
  onUpdate: () => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function ExperienceItem({ experience, onUpdate, onDelete }: ExperienceItemProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{experience.title} - {experience.company}</ItemTitle>
        <div>
          <ItemDescription>
            {experience.startDate} - {experience.isOngoing ? 'Present' : experience.endDate}
          </ItemDescription>
          <ItemDescription>
            {experience.description}
          </ItemDescription>
        </div>
      </ItemContent>
      <ItemActions>
        <ExperienceEditDialog
          experience={experience}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onUpdate={onUpdate}
          trigger={
            <Button variant="outline" size="icon-sm">
              <i className="bi bi-pencil-square"></i>
            </Button>
          }
        />
        <ExperienceDeleteDialog
          experience={experience}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onDelete={() => onDelete(experience.id!)}
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