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

interface EducationEmptyStateProps {
  onAddClick: () => void
}

export function EducationEmptyState({ onAddClick }: EducationEmptyStateProps) {
    return (
        <Empty className="border">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <i className="bi bi-mortarboard"></i>
                </EmptyMedia>
                <EmptyTitle>
                    No education added yet
                </EmptyTitle>
                <EmptyDescription>
                    Start by adding your educational background.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button onClick={onAddClick}>
                    <i className="bi bi-plus-lg"></i>
                    Add Education
                </Button>
            </EmptyContent>
        </Empty>
    )
}