"use client"

import { useState } from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector, useFormatCurrency } from '@/lib/hooks'
import { setApplications, deleteApplication as deleteAppAction, setLoading, updateApplication as updateAppAction, setSorting, type Application } from '@/lib/slices/applicationsSlice'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type Updater,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ApplicationEditDialog } from "./application/ApplicationEditDialog"
import { ApplicationDeleteDialog } from "./application/ApplicationDeleteDialog"
import { ApplicationNotesDialog } from "./application/ApplicationNotesDialog"
import { ApplicationAddNewDialog } from "./application/ApplicationAddNewDialog"
import { getAllApplications, deleteApplication as deleteApplicationFromDB } from '@/lib/db/applications'
import { DBApplication } from '@/lib/db/types'
import { formatDate } from '@/lib/utils'
import { handleDownloadPDF } from "../pages/Export"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { formatApplicationStatus } from "./application/ApplicationStatus"

export default function ApplicationsTable() {
  const dispatch = useAppDispatch()
  const { list: data, isLoading: loading, sorting } = useAppSelector(state => state.applications)
  const settings = useAppSelector((state) => state.settings)
  const [editDialogOpen, setEditDialogOpen] = useState<string | null>(null)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [showRejected, setShowRejected] = useState<boolean>(true);

  const handleChangeRejectsVisibility = () => {
    const newShowRejected = !showRejected;
    setShowRejected(newShowRejected);

    if (newShowRejected) {
      setColumnFilters((prev) => prev.filter((filter) => filter.id !== 'status'));
    } else {
      setColumnFilters((prev) => [
        ...prev.filter((filter) => filter.id !== 'status'),
        {
          id: 'status',
          value: ['rejected'],
        },
      ]);
    }
  }

  const handleAddApplication = async () => {
    try {
      dispatch(setLoading(true))
      const applications = await getAllApplications(settings.ghostedDelay)
      const formattedData = applications.map((app: DBApplication) => ({
        id: app.id?.toString() || '',
        companyName: app.companyName,
        position: app.position,
        url: app.url,
        notes: app.notes,
        salary: app.salary,
        dateApplied: app.dateApplied,
        status: app.status,
        statusChangedManually: app.statusChangedManually,
        cvData: app.cvData,
      }))
      dispatch(setApplications(formattedData))
    } catch (error) {
      console.error('Error loading applications:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleUpdateApplication = (updatedApplication: Application) => {
    dispatch(updateAppAction(updatedApplication))
  }

  const handleDeleteApplication = async (applicationId: string) => {
    try {
      await deleteApplicationFromDB(parseInt(applicationId))
      dispatch(deleteAppAction(applicationId))
    } catch (error) {
      console.error('Error deleting application:', error)
      alert('Failed to delete application')
    }
  }

  const handleDownloadCV = async (application: Application) => {
    if (!application.cvData) return;

    try {
      await handleDownloadPDF({
        personal: application.cvData.personal,
        experiences: application.cvData.experiences,
        educations: application.cvData.educations,
        courses: application.cvData.courses || [],
        skills: application.cvData.skills,
        freelance: application.cvData.freelance,
        footer: application.cvData.footer,
        links: {
          languageId: application.cvData.links?.languageId ?? application.cvData.languageId ?? null,
          linkedin: application.cvData.links?.linkedin || '',
          github: application.cvData.links?.github || '',
          portfolio: application.cvData.links?.portfolio || '',
          twitter: application.cvData.links?.twitter || '',
          facebook: application.cvData.links?.facebook || '',
          instagram: application.cvData.links?.instagram || '',
          website: application.cvData.links?.website || '',
        },
        filename: `CV-${application.companyName.replace(/\s+/g, '_')}-${application.dateApplied}.pdf`,
        lang: application.cvData.languageId || 'en',
        designId: application.cvData.designId || 'classic',
      });
    } catch (error) {
      console.error('Error downloading CV PDF:', error);
      alert('Failed to download CV PDF');
    }
  }

  const formatCurrency = useFormatCurrency();

  const columns: ColumnDef<Application>[] = [
    {
      accessorKey: "companyName",
      header: () => (
        <div className="font-medium">Company Name</div>
      ),
      cell: ({ row }) => (
        <div>{row.getValue("companyName")}</div>
      ),
    },
    {
      accessorKey: "position",
      header: () => (
        <div className="font-medium">Position</div>
      ),
      cell: ({ row }) => (
        <div>{row.getValue("position")}</div>
      ),
    },
    {
      accessorKey: "salary",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium hover:bg-transparent shadow-none"
        >
          Salary
          {column.getIsSorted() === "asc" ? (
            <i className="ml-2 bi bi-arrow-up text-xs"></i>
          ) : column.getIsSorted() === "desc" ? (
            <i className="ml-2 bi bi-arrow-down text-xs"></i>
          ) : (
            <i className="ml-2 bi bi-arrow-down-up text-xs opacity-50"></i>
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const salary = row.getValue("salary") as number | null;

        if (salary) {
          return <div>{formatCurrency(salary)}</div>;
        } else {
          return <div className="text-muted-foreground">N/A</div>;
        }
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="font-medium">Status</div>
      ),
      cell: ({ row }) => (
        formatApplicationStatus(row.getValue("status"))
      ),
      filterFn: (row, columnId, filterValue) => {
        const status = row.getValue(columnId);
        if (Array.isArray(filterValue)) {
          return !filterValue.includes(status);
        }
        return true;
      },
    },
    {
      accessorKey: "dateApplied",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium hover:bg-transparent shadow-none"
        >
          Date Applied
          {column.getIsSorted() === "asc" ? (
            <i className="ml-2 bi bi-arrow-up text-xs"></i>
          ) : column.getIsSorted() === "desc" ? (
            <i className="ml-2 bi bi-arrow-down text-xs"></i>
          ) : (
            <i className="ml-2 bi bi-arrow-down-up text-xs opacity-50"></i>
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div>{formatDate(row.getValue("dateApplied"), 'long')}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: '',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <ApplicationEditDialog
            application={row.original}
            open={editDialogOpen === row.original.id}
            onOpenChange={(open) => setEditDialogOpen(open ? row.original.id : null)}
            onUpdate={handleUpdateApplication}
            trigger={
              <Button variant="outline" size="icon-sm">
                <i className="bi bi-pencil-square"></i>
              </Button>
            }
          />
          <ApplicationDeleteDialog
            application={row.original}
            onDelete={() => handleDeleteApplication(row.original.id)}
            trigger={
              <Button variant="outline" size="icon-sm">
                <i className="bi bi-trash"></i>
              </Button>
            }
          />
          {row.original.cvData && (
            <Button variant="outline" size="sm" onClick={() => handleDownloadCV(row.original)}>
              Download CV
              <i className="bi bi-file-earmark-arrow-down"></i>
            </Button>
          )}
          {row.original.url && (
            <Button variant="outline" size="sm" asChild>
              <Link href={row.original.url} target="_blank" rel="noopener noreferrer">
                Link
                <i className="bi bi-arrow-up-right"></i>
              </Link>
            </Button>
          )}
          {row.original.notes && (
            <ApplicationNotesDialog
              application={row.original}
              trigger={
                <Button variant="outline" size="sm">
                  Notes
                  <i className="bi bi-sticky"></i>
                </Button>
              }
            />
          )}
        </div>
      ),
    }
  ]

  const handleSortingChange = (updaterOrValue: Updater<SortingState>) => {
    const newSorting = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue
    dispatch(setSorting(newSorting))
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      sorting: [{ id: 'dateApplied', desc: true }],
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  return (
    <div className="w-full">
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div>Loading applications...</div>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-2 pb-4">
            <div className="flex-1 space-x-2">
              <InputGroup className="max-w-sm">
                <InputGroupInput
                  placeholder="Search company..."
                  value={table.getColumn("companyName")?.getFilterValue() as string ?? ""}
                  onChange={(event) =>
                    table.getColumn("companyName")?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />
                <InputGroupAddon>
                  <i className="bi bi-search"></i>
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleChangeRejectsVisibility}>
                {showRejected ? (
                  <>
                  <i className="bi bi-eye-slash-fill"></i>
                  Hide rejected
                  </>
                ) : (
                  <>
                  <i className="bi bi-eye-fill"></i>
                  Show rejected
                  </>
                )}
              </Button>
              <ApplicationAddNewDialog
                onAdd={handleAddApplication}
                trigger={
                  <Button>
                    <i className="bi bi-plus-lg"></i>
                    Add New Application
                  </Button>
                }
              />
            </div>
          </div>
          <div className="overflow-hidden mt-2">
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
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-10">
                    Showing {table.getRowModel().rows.length} of {data.length} applications
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}

export { ApplicationsTable }