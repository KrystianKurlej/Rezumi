import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Export() {
    return(
        <ScrollArea className="h-full">
            <PageHeader iconClass="bi-book-half">
                <PageHeaderTitle>
                    Export
                </PageHeaderTitle>
                <PageHeaderDescription>
                    Export your CV to PDF, ready to send to recruiters.
                </PageHeaderDescription>
            </PageHeader>
            <div className="p-2">
            </div>
        </ScrollArea>
    )
}