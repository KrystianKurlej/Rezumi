import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Applications() {
    return(
        <ScrollArea className="h-full">
            <PageHeader iconClass="bi-envelope-arrow-up">
                <PageHeaderTitle>
                    Applications
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