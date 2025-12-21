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

interface ExperienceEmptyStateProps {
  onAddClick: () => void
}

export function ExperienceEmptyState({ onAddClick }: ExperienceEmptyStateProps) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <i className="bi bi-briefcase"></i>
        </EmptyMedia>
        <EmptyTitle>
          No experience added yet
        </EmptyTitle>
        <EmptyDescription>
          Start by adding your work experience.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onAddClick}>
          <i className="bi bi-plus-lg"></i>
          Add Experience
        </Button>
      </EmptyContent>
    </Empty>
  )
}