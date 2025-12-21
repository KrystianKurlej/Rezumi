import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Versions() {
    return(
        <ScrollArea className="h-full">
            <PageHeader iconClass="bi-book-half">
                <PageHeaderTitle>
                    Versions
                </PageHeaderTitle>
                <PageHeaderDescription>
                    Save snapshots of your CV for specific job applications and keep track of what you’ve sent.
                </PageHeaderDescription>
            </PageHeader>
            <div className="p-2">
            </div>
        </ScrollArea>
    )
}