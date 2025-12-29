import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button";
import { DBExperience } from "@/lib/db";
import { formatDate } from "@/lib/utils";

interface ExperienceHintProps {
    experience: DBExperience;
    onCopyAndEdit: () => void;
    onDismiss: () => void;
}

export default function ExperienceHint({ experience, onCopyAndEdit, onDismiss }: ExperienceHintProps) {
    return (
        <Item variant="muted" className="mb-1">
            <ItemContent>
                <ItemTitle>{experience.title} - {experience.company}</ItemTitle>
                <ItemDescription>
                    {formatDate(experience.startDate, 'long')} - {experience.isOngoing ? 'Present' : formatDate(experience.endDate, 'long')}
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