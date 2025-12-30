import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"
import { menuIcons } from "@/components/AppSidebar";
import DesignForm from "@/components/templates/Design";
import { designs, DesignAvatar } from "@/components/templates/Design";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button";

function TemplateCard({id}: {id: string}) {
    const title = designs[id as keyof typeof designs]?.title || "Template";
    const description = designs[id as keyof typeof designs]?.description;

    return (
        <Item variant="outline" className="mb-1 cursor-pointer">
            <ItemMedia>
                <DesignAvatar designId={id} />
            </ItemMedia>
            <ItemContent>
                <ItemTitle>{title}</ItemTitle>
                {description &&  (
                    <ItemDescription>
                        {description}
                    </ItemDescription>
                )}
            </ItemContent>
            <ItemActions>
                <Button variant="outline" size="icon-sm">
                    <i className="bi bi-pencil-square"></i>
                </Button>
                {id !== 'classic' && (
                    <Button variant="outline" size="icon-sm">
                        <i className="bi bi-trash"></i>
                    </Button>
                )}
            </ItemActions>
        </Item>
    )
}

export default function Templates() {
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
                    <TemplateCard id="classic" />
                    <TemplateCard id="modern" />
                </div>
                <Button
                    variant="outline"
                    className="w-full"
                >
                    Add New Template
                    <i className="bi bi-plus-lg"></i>
                </Button>
                {/* <DesignForm /> */}
            </div>
        </ScrollArea>
    )
}