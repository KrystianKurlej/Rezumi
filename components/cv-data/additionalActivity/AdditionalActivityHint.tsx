import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button";
import { DBAdditionalActivity } from "@/lib/db";
import { formatDate } from "@/lib/utils";

interface AdditionalActivityHintProps {
    additionalActivity: DBAdditionalActivity;
    onCopyAndEdit: () => void;
    onDismiss: () => void;
}

export default function AdditionalActivityHint({ additionalActivity, onCopyAndEdit, onDismiss }: AdditionalActivityHintProps) {
    return (
        <Item variant="muted" className="mb-1">
            <ItemContent>
                <ItemTitle>{additionalActivity.title} - {additionalActivity.company}</ItemTitle>
                <ItemDescription>
                    {formatDate(additionalActivity.startDate, 'long')} - {additionalActivity.isOngoing ? 'Present' : formatDate(additionalActivity.endDate, 'long')}
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