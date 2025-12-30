import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"
import { menuIcons } from "@/components/AppSidebar";
import { DesignAvatar } from "@/components/templates/Design";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getAllTemplates, deleteTemplate } from "@/lib/db/templates";
import { DBTemplates } from "@/lib/db/types";
import { TemplateAddDialog } from "@/components/templates/TemplateAddDialog";
import { TemplateEditDialog } from "@/components/templates/TemplateEditDialog";
import { TemplateDeleteDialog } from "@/components/templates/TemplateDeleteDialog";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { selectTemplate, selectDesign } from "@/lib/slices/templatesSlice";

interface TemplateCardProps {
  id: number | string
  title: string
  designId?: string
  isDefault: boolean
  template?: DBTemplates
  onUpdate?: () => Promise<void>
}

function TemplateCard({id, title, designId, isDefault, template, onUpdate}: TemplateCardProps) {
    const dispatch = useAppDispatch()
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const selectedTemplate = useAppSelector(state => {
        return state.templates.selectedTemplate;
    })

    const handleDelete = async () => {
        if (template?.id) {
            await deleteTemplate(template.id)
            if (onUpdate) await onUpdate()
        }
    }

    const handleSelectTemplate = () => {
        dispatch(selectTemplate(id.toString()))
        dispatch(selectDesign(designId || 'classic'))
    }

    return (
        <>
            <Item
                variant="outline"
                className="mb-1 cursor-pointer items-center hover:bg-accent"
                onClick={handleSelectTemplate}
            >
                {id == selectedTemplate ? (
                    <i className="bi bi-check-circle-fill text-lg"></i>
                ) : (
                    <i className="bi bi-circle text-lg"></i>
                )}
                {designId && (
                    <ItemMedia>
                        <DesignAvatar designId={designId} />
                    </ItemMedia>
                )}
                <ItemContent>
                    {title && (
                        <ItemTitle>{title}</ItemTitle>
                    )}
                </ItemContent>
                {!isDefault && template && onUpdate && (
                    <ItemActions onClick={(e) => e.stopPropagation()}>
                        <TemplateEditDialog
                            template={template}
                            open={editDialogOpen}
                            onOpenChange={setEditDialogOpen}
                            onUpdate={onUpdate}
                            trigger={
                                <Button variant="outline" size="icon-sm">
                                    <i className="bi bi-pencil-square"></i>
                                </Button>
                            }
                        />
                        <TemplateDeleteDialog
                            template={template}
                            open={deleteDialogOpen}
                            onOpenChange={setDeleteDialogOpen}
                            onDelete={handleDelete}
                            trigger={
                                <Button variant="outline" size="icon-sm">
                                    <i className="bi bi-trash"></i>
                                </Button>
                            }
                        />
                    </ItemActions>
                )}
            </Item>
        </>
    )
}

export default function Templates() {
    const [templates, setTemplates] = useState<DBTemplates[]>([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const loadTemplates = async () => {
        try {
            const allTemplates = await getAllTemplates();
            setTemplates(allTemplates);
        } catch (error) {
            console.error('Failed to load templates:', error);
        }
    };

    useEffect(() => {
        const fetchTemplates = async () => {
            await loadTemplates();
        };
        fetchTemplates();
    }, []);

    return(
        <ScrollArea className="h-full">
            <PageHeader iconClass={menuIcons.templates}>
                <PageHeaderTitle>
                    Templates
                </PageHeaderTitle>
                <PageHeaderDescription>
                    Create different CV versions by choosing the layout and deciding what to show, hide, or rewrite for specific roles.
                </PageHeaderDescription>
            </PageHeader>
            <div className="p-4 pb-16">
                <div className="mb-2">
                    <TemplateCard
                        id="classic"
                        title="Default Template"
                        designId="classic"
                        isDefault={true}
                    />
                    {templates.map((template) => (
                        <TemplateCard
                            key={template.id}
                            id={template.id!}
                            title={template.name}
                            designId={template.designId}
                            isDefault={false}
                            template={template}
                            onUpdate={loadTemplates}
                        />
                    ))}
                </div>
                <TemplateAddDialog
                    open={addDialogOpen}
                    onOpenChange={setAddDialogOpen}
                    onAdd={loadTemplates}
                    trigger={
                        <Button
                            variant="outline"
                            className="w-full"
                        >
                            Add New Template
                            <i className="bi bi-plus-lg"></i>
                        </Button>
                    }
                />
            </div>
        </ScrollArea>
    )
}