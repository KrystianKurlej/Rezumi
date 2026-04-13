'use client'

import { useState } from 'react'
import { DBAdditionalActivity } from '@/lib/db'
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { AdditionalActivityEditDialog } from './AdditionalActivityEditDialog'
import { AdditionalActivityDeleteDialog } from './AdditionalActivityDeleteDialog'
import { formatDate } from '@/lib/utils'

interface AdditionalActivityItemProps {
  additionalActivity: DBAdditionalActivity
  onUpdate: () => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function AdditionalActivityItem({ additionalActivity, onUpdate, onDelete }: AdditionalActivityItemProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{additionalActivity.title} - {additionalActivity.company}</ItemTitle>
        <div>
          <ItemDescription>
            {formatDate(additionalActivity.startDate, 'long')} - {additionalActivity.isOngoing ? 'Present' : formatDate(additionalActivity.endDate, 'long')}
          </ItemDescription>
          <ItemDescription>
            {additionalActivity.description}
          </ItemDescription>
        </div>
      </ItemContent>
      <ItemActions>
        <AdditionalActivityEditDialog
          additionalActivity={additionalActivity}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onUpdate={onUpdate}
          trigger={
            <Button variant="outline" size="icon-sm">
              <i className="bi bi-pencil-square"></i>
            </Button>
          }
        />
        <AdditionalActivityDeleteDialog
          additionalActivity={additionalActivity}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onDelete={() => onDelete(additionalActivity.id!)}
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