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

interface CourseEmptyStateProps {
  onAddClick: () => void
}

export function CourseEmptyState({ onAddClick }: CourseEmptyStateProps) {
  return (
    <Empty className="border">
        <EmptyHeader>
            <EmptyMedia variant="icon">
                <i className="bi bi-patch-check"></i>
            </EmptyMedia>
            <EmptyTitle>
                No courses yet
            </EmptyTitle>
            <EmptyDescription>
                Add courses and certifications you&apos;ve completed to showcase your continuous learning.
            </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
            <Button onClick={onAddClick}>
                <i className="bi bi-plus-lg"></i>
                Add Your First Course
            </Button>
        </EmptyContent>
    </Empty>
  )
}
