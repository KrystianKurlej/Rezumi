"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setApplications, setLoading } from '@/lib/slices/applicationsSlice'
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
import { ApplicationAddNewDialog } from "@/components/applications/application/ApplicationAddNewDialog";
import { Button } from "@/components/ui/button";
import { getAllApplications, type DBApplication } from '@/lib/db'
import { menuIcons } from "@/components/AppSidebar";

export default function Applications() {
    const dispatch = useAppDispatch()
    const { hasApplications, isLoading: loading } = useAppSelector(state => state.applications)

    useEffect(() => {
        checkApplications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const checkApplications = async () => {
        try {
            dispatch(setLoading(true))
            const applications = await getAllApplications()
            const formattedData = applications.map((app: DBApplication) => ({
                id: app.id?.toString() || '',
                companyName: app.companyName,
                position: app.position,
                url: app.url,
                notes: app.notes,
                salary: app.salary,
                dateApplied: app.dateApplied,
                status: app.status,
                cvData: app.cvData,
            }))
            dispatch(setApplications(formattedData))
        } catch (error) {
            console.error('Error checking applications:', error)
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleApplicationAdded = () => {
        checkApplications()
    }

    if (loading) {
        return (
            <ScrollArea className="h-full">
                <PageHeader iconClass={menuIcons.applications}>
                    <PageHeaderTitle>
                        Applications
                    </PageHeaderTitle>
                    <PageHeaderDescription>
                        Save snapshots of your CV for specific job applications and keep track of what you&apos;ve sent.
                    </PageHeaderDescription>
                </PageHeader>
                <div className="p-4 flex items-center justify-center h-32">
                    Loading...
                </div>
            </ScrollArea>
        )
    }

    return(
        <ScrollArea className="h-full">
            <PageHeader iconClass={menuIcons.applications}>
                <PageHeaderTitle>
                    Applications
                </PageHeaderTitle>
                <PageHeaderDescription>
                    Save snapshots of your CV for specific job applications and keep track of what you’ve sent.
                </PageHeaderDescription>
            </PageHeader>
            <div className="p-4 pb-16">
                {!hasApplications ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <i className="bi bi-envelope-exclamation"></i>
                            </EmptyMedia>
                            <EmptyTitle>No Applications Yet</EmptyTitle>
                            <EmptyDescription>
                                You haven&apos;t saved any job applications yet. When you do, they&apos;ll appear here. Click the button below to add your first application.
                            </EmptyDescription>
                        </EmptyHeader>
                        <ApplicationAddNewDialog
                            onAdd={handleApplicationAdded}
                            trigger={
                                <Button>
                                    <i className="bi bi-plus-lg"></i>
                                    Add Your First Application
                                </Button>
                            }
                        />
                    </Empty>
                ) : (
                    <ApplicationsTable />
                )}
            </div>
        </ScrollArea>
    )
}