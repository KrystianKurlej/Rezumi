"use client"

import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ScrollArea } from "@/components/ui/scroll-area"
import ApplicationsTable from "@/components/applications/ApplicationsTable";

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
            <div className="p-4">
                {/* <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <i className="bi bi-envelope-exclamation"></i>
                        </EmptyMedia>
                        <EmptyTitle>No Applications Yet</EmptyTitle>
                        <EmptyDescription>
                            You haven&apos;t saved any job applications yet. When you do, they&apos;ll appear here. Go to the Export page to save your CV for a specific job application.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty> */}
                <ApplicationsTable />
            </div>
        </ScrollArea>
    )
}