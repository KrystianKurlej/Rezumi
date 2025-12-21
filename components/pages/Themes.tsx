import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Themes() {
    return(
        <ScrollArea className="h-full">
            <PageHeader iconClass="bi-palette2">
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