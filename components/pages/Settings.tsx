import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"
import { menuIcons } from "@/components/AppSidebar";

export default function Settings() {
    return(
        <ScrollArea className="h-full">
            <PageHeader iconClass={menuIcons.settings}>
                <PageHeaderTitle>
                    Settings
                </PageHeaderTitle>
                <PageHeaderDescription>
                    Manage your application settings here.
                </PageHeaderDescription>
            </PageHeader>
            <div className="p-4">
                
            </div>
        </ScrollArea>
    )
}