import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"
import { menuIcons } from "@/components/AppSidebar";

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
            <div className="p-2">
            </div>
        </ScrollArea>
    )
}