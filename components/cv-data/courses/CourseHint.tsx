import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button";
import { DBCourse } from "@/lib/db";
import { formatDate } from "@/lib/utils";

interface CourseHintProps {
    course: DBCourse;
    onCopyAndEdit: () => void;
    onDismiss: () => void;
}

export default function CourseHint({ course, onCopyAndEdit, onDismiss }: CourseHintProps) {
    return (
        <Item variant="muted" className="mb-1">
            <ItemContent>
                <ItemTitle>{course.courseName}</ItemTitle>
                <ItemDescription>
                    {course.platform}
                </ItemDescription>
                <ItemDescription>
                    {course.isOngoing ? 'In Progress' : `Completed: ${formatDate(course.completionDate, 'long')}`}
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button variant="outline" size="sm" onClick={onCopyAndEdit}>
                    <i className="bi bi-copy"></i>
                    Copy & Edit
                </Button>
                <Button variant="outline" size="icon-sm" onClick={onDismiss}>
                    <i className="bi bi-x"></i>
                </Button>
            </ItemActions>
        </Item>
    )
}
