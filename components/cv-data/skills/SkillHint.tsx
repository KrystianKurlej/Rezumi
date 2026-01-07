import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button";
import { DBSkill } from "@/lib/db";

interface SkillHintProps {
    skill: DBSkill;
    onCopyAndEdit: () => void;
    onDismiss: () => void;
}

export default function SkillHint({ skill, onCopyAndEdit, onDismiss }: SkillHintProps) {
    return (
        <Item variant="muted" className="mb-1">
            <ItemContent>
                <ItemTitle>{skill.skillName}</ItemTitle>
                {skill.description && (
                    <ItemDescription>
                        {skill.description}
                    </ItemDescription>
                )}
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
