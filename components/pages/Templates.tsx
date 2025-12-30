import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"
import { menuIcons } from "@/components/AppSidebar";
import DesignForm from "@/components/templates/Design";
import { DesignAvatar } from "@/components/templates/Design";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "../ui/input";
import { Field, FieldLabel } from "../ui/field";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useState, useEffect } from "react";
import { createTemplate, getAllTemplates } from "@/lib/db/templates";
import { DBTemplates } from "@/lib/db/types";
import { setSelectedDesign } from "@/lib/slices/templatesSlice";

function TemplateCard({id, title, description, designId, isDefault}: {id: number | string, title: string, description?: string, designId?: string, isDefault: boolean}) {
    return (
        <Item variant="outline" className="mb-1 cursor-pointer">
            {designId && (
                <ItemMedia>
                    <DesignAvatar designId={designId} />
                </ItemMedia>
            )}
            <ItemContent>
                {title && (
                    <ItemTitle>{title}</ItemTitle>
                )}
                {description &&  (
                    <ItemDescription>
                        {description}
                    </ItemDescription>
                )}
            </ItemContent>
            {!isDefault && (
                <ItemActions>
                    <Button variant="outline" size="icon-sm">
                        <i className="bi bi-pencil-square"></i>
                    </Button>
                    <Button variant="outline" size="icon-sm">
                        <i className="bi bi-trash"></i>
                    </Button>
                </ItemActions>
            )}
        </Item>
    )
}

export default function Templates() {
    const dispatch = useAppDispatch();
    const selectedDesign = useAppSelector(state => state.templates.selectedDesign);
    const [templateName, setTemplateName] = useState('');
    const [templates, setTemplates] = useState<DBTemplates[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const loadTemplates = async () => {
        try {
            const allTemplates = await getAllTemplates();
            setTemplates(allTemplates);
        } catch (error) {
            console.error('Failed to load templates:', error);
        }
    };

    const handleCreateTemplate = async () => {
        if (!templateName.trim()) return;

        try {
            await createTemplate({
                name: templateName,
                description: '',
                designId: selectedDesign,
            });
            setTemplateName('');
            dispatch(setSelectedDesign('classic'));
            setIsDialogOpen(false);
            await loadTemplates();
        } catch (error) {
            console.error('Failed to create template:', error);
        }
    };

    const handleDialogOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setTemplateName('');
            dispatch(setSelectedDesign('classic'));
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
            <div className="p-4">
                <div className="mb-2">
                    <TemplateCard
                        id="default"
                        title="Default Template"
                        description="The standard CV template that displays all information."
                        designId="classic"
                        isDefault={true}
                    />
                    {templates.map((template) => (
                        <TemplateCard
                            key={template.id}
                            id={template.id!}
                            title={template.name}
                            description={template.description}
                            designId={template.designId}
                            isDefault={false}
                        />
                    ))}
                </div>
                <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full"
                        >
                            Add New Template
                            <i className="bi bi-plus-lg"></i>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Template</DialogTitle>
                            <DialogDescription>
                                Choose a design and customize your new CV template.
                            </DialogDescription>
                        </DialogHeader>
                        <Field>
                            <FieldLabel htmlFor="template-name">
                                Template Name
                            </FieldLabel>
                            <Input
                                id="template-name"
                                placeholder="e.g. Software Engineer CV"
                                type="text"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel>
                                Select Design
                            </FieldLabel>
                            <DesignForm />
                        </Field>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Close</Button>
                            </DialogClose>
                            <Button 
                                disabled={!templateName.trim()}
                                onClick={handleCreateTemplate}
                            >
                                Create Template
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </ScrollArea>
    )
}