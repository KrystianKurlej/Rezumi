"use client"

import * as React from "react"
import Link from "next/link"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const data: Application[] = [
  {
    id: "app001",
    companyName: "Google",
    position: "Senior Frontend Developer",
    url: "https://careers.google.com/jobs/results/123456789/",
    dateApplied: "2024-12-15",
    status: "submitted"
  },
  {
    id: "app002", 
    companyName: "Microsoft",
    position: "React Developer",
    url: "https://careers.microsoft.com/us/en/job/1234567/",
    notes: "Remote-first company, good benefits package",
    dateApplied: "2024-12-10",
    status: "notApplied"
  },
  {
    id: "app003",
    companyName: "Meta",
    position: "Full Stack Engineer",
    url: "https://www.metacareers.com/jobs/987654321/",
    dateApplied: "2024-12-08",
    status: "rejected"
  },
  {
    id: "app004",
    companyName: "Netflix",
    position: "Frontend Engineer",
    url: "https://jobs.netflix.com/jobs/456789/",
    dateApplied: "2024-12-12",
    status: "sentFollowUp"
  },
  {
    id: "app005",
    companyName: "Spotify",
    position: "UI/UX Developer",
    notes: "Company seems to have gone quiet after initial contact",
    dateApplied: "2024-11-28",
    status: "ghosted"
  }
]

export type Application = {
    id: string
    companyName: string,
    position: string,
    url: string,
    notes: string,
    dateApplied: string,
    notes: string,
    status: 'notApplied' | 'submitted' | 'rejected' | 'offerExtendedInProgress' | 'jobRemoved' | 'ghosted' | 'offerExtendedNotAccepted' | 'rescinded' | 'notForMe' | 'sentFollowUp' | null
}

function formatStatus(status: Application["status"]) {
    switch (status) {
        case 'notApplied':
            return(
                <div className="flex items-center gap-2">
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
                    <span>Not Applied</span>
                </div>
            )
        case 'submitted':
            return(
                <div className="flex items-center gap-2">
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
                    <span>Submitted</span>
                </div>
            )
        case 'rejected':
            return(
                <div className="flex items-center gap-2">
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#dc2626', borderRadius: '50%' }}></div>
                    <span>Rejected</span>
                </div>
            )
        case 'offerExtendedInProgress':
            return(
                <div className="flex items-center gap-2">
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                    <span>Offer In Progress</span>
                </div>
            )
        case 'sentFollowUp':
            return(
                <div className="flex items-center gap-2">
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
                    <span>Follow Up Sent</span>
                </div>
            )
        case 'ghosted':
            return(
                <div className="flex items-center gap-2">
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#6b7280', borderRadius: '50%' }}></div>
                    <span>Ghosted</span>
                </div>
            )
        case 'jobRemoved':
            return(
                <div className="flex items-center gap-2">
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%' }}></div>
                    <span>Job Removed</span>
                </div>
            )
        case 'offerExtendedNotAccepted':
            return(
                <div className="flex items-center gap-2">
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#f97316', borderRadius: '50%' }}></div>
                    <span>Offer Not Accepted</span>
                </div>
            )
        case 'rescinded':
            return(
                <div className="flex items-center gap-2">
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#b91c1c', borderRadius: '50%' }}></div>
                    <span>Rescinded</span>
                </div>
            )
        case 'notForMe':
            return(
                <div className="flex items-center gap-2">
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#8b5cf6', borderRadius: '50%' }}></div>
                    <span>Not For Me</span>
                </div>
            )
        default:
            return(
                <div className="flex items-center gap-2">
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#d1d5db', borderRadius: '50%' }}></div>
                    <span>Unknown</span>
                </div>
            )
    }
}

export const columns: ColumnDef<Application>[] = [
    {
        accessorKey: "companyName",
        header: "Company Name",
        cell: ({ row }) => (
            <div>{row.getValue("companyName")}</div>
        ),
    },
    {
        accessorKey: "position",
        header: "Position",
        cell: ({ row }) => (
            <div>{row.getValue("position")}</div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            formatStatus(row.getValue("status"))
        ),
    },
    {
        accessorKey: "dateApplied",
        header: "Date Applied",
        cell: ({ row }) => (
            <div>{row.getValue("dateApplied")}</div>
        ),
    },
    {
        accessorKey: "actions",
        header: null,
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon-sm">
                            <i className="bi bi-pencil-square"></i>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Application for {row.original.position} at {row.original.companyName}</DialogTitle>
                        </DialogHeader>
                        {/* Form fields for editing would go here */}
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                {row.original.url && (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={row.original.url} target="_blank" rel="noopener noreferrer">
                            Link
                            <i className="bi bi-arrow-up-right"></i>
                        </Link>
                    </Button>
                )}
                {row.original.notes && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                Notes
                                <i className="bi bi-sticky"></i>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Notes for {row.original.position} at {row.original.companyName}</DialogTitle>
                                </DialogHeader>
                                {row.original.notes || "No notes available."}
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Close</Button>
                                    </DialogClose>
                                </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        ),
    }
]

export default function ApplicationsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}