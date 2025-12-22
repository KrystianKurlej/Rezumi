import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"
import { menuIcons } from "@/components/AppSidebar";

export default function Languages() {
    return(
        <ScrollArea className="h-full">
            <PageHeader iconClass={menuIcons.languages}>
                <PageHeaderTitle>
                    Languages
                </PageHeaderTitle>
                <PageHeaderDescription>
                    Manage language versions of your CV and switch between them depending on the job offer.
                </PageHeaderDescription>
            </PageHeader>
            <div className="p-2">
            </div>
        </ScrollArea>
    )
}