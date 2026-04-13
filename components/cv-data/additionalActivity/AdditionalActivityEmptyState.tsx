'use client'

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

interface AdditionalActivityEmptyStateProps {
  onAddClick: () => void
}

export function AdditionalActivityEmptyState({ onAddClick }: AdditionalActivityEmptyStateProps) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <i className="bi bi-briefcase"></i>
        </EmptyMedia>
        <EmptyTitle>
          No additional activity added yet
        </EmptyTitle>
        <EmptyDescription>
          Start by adding your additional activity.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onAddClick}>
          <i className="bi bi-plus-lg"></i>
          Add Additional Activity
        </Button>
      </EmptyContent>
    </Empty>
  )
}