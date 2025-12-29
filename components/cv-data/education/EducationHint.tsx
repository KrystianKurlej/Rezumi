import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button";
import { DBEducation } from "@/lib/db";
import { formatDate } from "@/lib/utils";

interface EducationHintProps {
    education: DBEducation;
    onCopyAndEdit: () => void;
    onDismiss: () => void;
}

export default function EducationHint({ education, onCopyAndEdit, onDismiss }: EducationHintProps) {
    return (
        <Item variant="muted" className="mb-1">
            <ItemContent>
                <ItemTitle>{education.degree} in {education.fieldOfStudy}</ItemTitle>
                <ItemDescription>
                    {education.institution}
                </ItemDescription>
                <ItemDescription>
                    {formatDate(education.startDate, 'long')} - {education.isOngoing ? 'Present' : formatDate(education.endDate, 'long')}
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
