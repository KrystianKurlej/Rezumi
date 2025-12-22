import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"
import { menuIcons } from "@/components/AppSidebar";

export default function Themes() {
    return(
        <ScrollArea className="h-full">
            <PageHeader iconClass={menuIcons.themes}>
                <PageHeaderTitle>
                    Themes
                </PageHeaderTitle>
                <PageHeaderDescription>
                    Manage themes of your CV and customize the appearance to match your personal style or the job you&apos;re applying for.
                </PageHeaderDescription>
            </PageHeader>
            <div className="p-2">
            </div>
        </ScrollArea>
    )
}