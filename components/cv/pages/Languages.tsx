import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Languages() {
    return(
        <ScrollArea className="h-full">
            <PageHeader iconClass="bi-translate">
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