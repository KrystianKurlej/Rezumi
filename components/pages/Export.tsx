'use client'

import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Field,
  FieldDescription,
  FieldSet,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ExportButton } from '@/components/export/ExportButton'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { 
    updateQuickFilename,
    updateJobFilename,
    updateCompanyName,
    updateJobTitle,
    updateJobLink,
    updateNotes,
    generateJobFilename
} from '@/lib/slices/exportSlice'
import { menuIcons } from "@/components/AppSidebar";

export default function Export() {
    const dispatch = useAppDispatch()
    const exportData = useAppSelector(state => state.export)
    const personal = useAppSelector(state => state.personal)
    const experiences = useAppSelector(state => state.experiences.list)
    const educations = useAppSelector(state => state.educations.list)
    const skills = useAppSelector(state => state.skills)
    const footer = useAppSelector(state => state.footer)

    const getGeneratedFilename = () => {
        if (exportData.companyName && exportData.jobTitle) {
            const cleanCompany = exportData.companyName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
            const cleanTitle = exportData.jobTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()
            return `cv-${cleanCompany}-${cleanTitle}.pdf`
        }
        return exportData.jobFilename
    }

    const handleSaveApplication = () => {
        console.log('Saving application:', {
            filename: getGeneratedFilename(),
            companyName: exportData.companyName,
            jobTitle: exportData.jobTitle,
            jobLink: exportData.jobLink,
            notes: exportData.notes,
            timestamp: new Date().toISOString()
        })
        // Tu będzie logika zapisania do IndexedDB
    }

    const exportCVData = () => {
        const cvData = {
            personal,
            experiences,
            educations,
            skills,
            footer,
            exportedAt: new Date().toISOString()
        }
        
        const dataStr = JSON.stringify(cvData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'cv-data.json'
        link.click()
        URL.revokeObjectURL(url)
    }
    
    return(
        <ScrollArea className="h-full">
            <PageHeader iconClass={menuIcons.export}>
                <PageHeaderTitle>
                    Send & Save Application
                </PageHeaderTitle>
                <PageHeaderDescription>
                    Create a PDF version of your CV and save it together with job details, so you always know what you sent and where.
                </PageHeaderDescription>
            </PageHeader>
            <div className="p-4 pb-12">
                <FieldGroup>
                    <FieldSet>
                        <div>
                            <span className="text-lg font-semibold">
                                Send CV for a specific job
                            </span>
                            <FieldDescription>
                                Save this CV together with job details. When a recruiter calls, you can instantly see what version you sent and for which role.
                            </FieldDescription>
                        </div>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>
                                    Filename
                                </FieldLabel>
                                <Input
                                    type="text"
                                    value={exportData.jobFilename}
                                    onChange={(e) => dispatch(updateJobFilename(e.target.value))}
                                    placeholder="my-cv.pdf"
                                />
                                <FieldDescription>
                                    Set the desired filename for your exported CV.
                                </FieldDescription>
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel>
                                        Company Name
                                    </FieldLabel>
                                    <Input
                                        type="text"
                                        value={exportData.companyName}
                                        onChange={(e) => dispatch(updateCompanyName(e.target.value))}
                                        placeholder="Acme Corp"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>
                                        Job Title / Position
                                    </FieldLabel>
                                    <Input
                                        type="text"
                                        value={exportData.jobTitle}
                                        onChange={(e) => dispatch(updateJobTitle(e.target.value))}
                                        placeholder="Frontend Developer"
                                    />
                                </Field>
                            </div>
                            <Field>
                                <FieldLabel>
                                    Job Offer Link (optional)
                                </FieldLabel>
                                <Input
                                    type="text"
                                    value={exportData.jobLink}
                                    onChange={(e) => dispatch(updateJobLink(e.target.value))}
                                    placeholder="https://..."
                                />
                            </Field>
                            <Field>
                                <FieldLabel>
                                    Notes (optional)
                                </FieldLabel>
                                <Input
                                    type="text"
                                    value={exportData.notes}
                                    onChange={(e) => dispatch(updateNotes(e.target.value))}
                                    placeholder="Recruiter name, tech stack, salary range, etc."
                                />
                            </Field>
                        </FieldGroup>
                        <Field>
                            <ExportButton 
                                filename={getGeneratedFilename()}
                                onExportComplete={handleSaveApplication}
                            >
                                <i className="bi bi-file-earmark-arrow-down"></i>
                                Download PDF & Save as Application
                            </ExportButton>
                            <FieldDescription className="text-center text-xs">
                                This will save a snapshot of your CV exactly as it was sent.
                            </FieldDescription>
                        </Field>
                    </FieldSet>
                    <FieldSet className="mt-2 pt-5 border-t">
                        <div>
                            <span className="text-lg font-semibold">
                                Download CV only
                            </span>
                            <FieldDescription>
                                Just export your current CV as a PDF, without saving it to your applications.
                            </FieldDescription>
                        </div>
                        <Field>
                            <FieldLabel>
                                Filename
                            </FieldLabel>
                            <Input
                                type="text"
                                value={exportData.quickFilename}
                                onChange={(e) => dispatch(updateQuickFilename(e.target.value))}
                                placeholder="my-cv.pdf"
                            />
                            <FieldDescription>
                                Set the desired filename for your exported CV.
                            </FieldDescription>
                        </Field>
                        <Field>
                            <ExportButton 
                                filename={exportData.quickFilename}
                                variant="secondary"
                            >
                                <i className="bi bi-file-earmark-arrow-down"></i>
                                Download PDF
                            </ExportButton>
                        </Field>
                    </FieldSet>
                    <FieldSet className="mt-2 pt-5 border-t">
                        <div>
                            <span className="text-lg font-semibold">
                                Export CV data
                            </span>
                            <FieldDescription>
                                Download your CV data as a file. Useful for backups or moving your data to another device.
                            </FieldDescription>
                        </div>
                        <Field>
                            <Button variant="secondary" onClick={exportCVData}>
                                <i className="bi bi-download"></i>
                                Export CV Data (JSON)
                            </Button>
                            <FieldDescription className="text-center text-xs">
                                This file is not a CV. It contains editable data only.
                            </FieldDescription>
                        </Field>
                    </FieldSet>
                </FieldGroup>
            </div>
        </ScrollArea>
    )
}