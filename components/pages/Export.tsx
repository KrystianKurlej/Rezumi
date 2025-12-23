'use client'

import { useState } from 'react'
import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldSet,
  FieldGroup,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { useAppSelector } from '@/lib/hooks'
import { menuIcons } from "@/components/AppSidebar";
import { pdf } from '@react-pdf/renderer';
import GenerateCV from '@/components/GenerateCV';
import { Input } from '@/components/ui/input';
import { addApplication as addApplicationToDB } from '@/lib/db'

export default function Export() {
    const [loading, setLoading] = useState(false);
    const [exportData, setExportData] = useState({
        companyName: '',
        jobTitle: '',
        jobLink: '',
        salary: '',
        notes: '',
    });

    const personal = useAppSelector(state => state.personal)
    const experiences = useAppSelector(state => state.experiences.list)
    const educations = useAppSelector(state => state.educations.list)
    const skills = useAppSelector(state => state.skills)
    const footer = useAppSelector(state => state.footer)
    const filename = 'CV-' + personal.firstName + '_' + personal.lastName + '.pdf'
    
    const handleDownloadPDF = async () => {
        const blob = await pdf(
            <GenerateCV 
                personal={personal}
                experiences={experiences}
                educations={educations}
                skills={skills}
                footer={footer}
            />
        ).toBlob();
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        const key = id as keyof typeof exportData
        setExportData(prev => ({ ...prev, [key]: value }))
    }

    const handleDownload = async () => {
        setLoading(true)
        
        try {
            await handleDownloadPDF()
        } catch (error) {
            console.error('Error downloading PDF:', error)
        } finally {
            setLoading(false)
        }   
    }

    const handleSaveAndDownload = async () => {
        setLoading(true)
        
        try {
            await handleDownloadPDF()
            await addApplicationToDB({
                companyName: exportData.companyName,
                position: exportData.jobTitle,
                url: exportData.jobLink,
                notes: exportData.notes,
                salary: exportData.salary ? parseFloat(exportData.salary) : null,
                dateApplied: new Date().toISOString().split('T')[0],
                status: 'submitted'
            })
        } catch (error) {
            console.error('Error saving application and downloading PDF:', error)
        } finally {
            setLoading(false)
        }
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
                                    Job Title / Position
                                </FieldLabel>
                                <Input
                                    type="text"
                                    id="jobTitle"
                                    value={exportData.jobTitle}
                                    onChange={handleChange}
                                    placeholder="Frontend Developer"
                                />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel>
                                        Company Name
                                    </FieldLabel>
                                    <Input
                                        type="text"
                                        id="companyName"
                                        value={exportData.companyName}
                                        onChange={handleChange}
                                        placeholder="Acme Corp"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>
                                        Salary
                                    </FieldLabel>
                                    <Input
                                        type="number"
                                        id="salary"
                                        value={exportData.salary}
                                        onChange={handleChange}
                                        placeholder="5000"
                                    />
                                </Field>
                            </div>
                            <Field>
                                <FieldLabel>
                                    Job Offer Link (optional)
                                </FieldLabel>
                                <Input
                                    type="text"
                                    id="jobLink"
                                    value={exportData.jobLink}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </Field>
                            <Field>
                                <FieldLabel>
                                    Notes (optional)
                                </FieldLabel>
                                <Input
                                    type="text"
                                    id="notes"
                                    value={exportData.notes}
                                    onChange={handleChange}
                                    placeholder="Recruiter name, tech stack, salary range, etc."
                                />
                            </Field>
                        </FieldGroup>
                        <Field>
                            <Button onClick={handleSaveAndDownload} disabled={loading}>
                                <i className="bi bi-file-earmark-arrow-down"></i>
                                Download PDF & Save as Application
                            </Button>
                            <FieldDescription className="text-center text-xs">
                                This will save a snapshot of your CV exactly as it was sent.
                            </FieldDescription>
                        </Field>
                    </FieldSet>
                    <FieldSet className="mt-2 pt-5 border-t">
                        <div>
                            <Field>
                                <span className="text-lg font-semibold">
                                    Download CV only
                                </span>
                                <FieldDescription>
                                    Just export your current CV as a PDF, without saving it to your applications.
                                </FieldDescription>
                            </Field>
                        </div>
                        <Field>
                            <Button variant="secondary" onClick={handleDownload} disabled={loading}>
                                <i className="bi bi-file-earmark-arrow-down"></i>
                                Download PDF
                            </Button>
                        </Field>
                    </FieldSet>
                    {/* <FieldSet className="mt-2 pt-5 border-t">
                        <div>
                            <span className="text-lg font-semibold">
                                Export CV data
                            </span>
                            <FieldDescription>
                                Download your CV data as a file. Useful for backups or moving your data to another device.
                            </FieldDescription>
                        </div>
                        <Field>
                            <Button variant="secondary" disabled={loading}>
                                <i className="bi bi-download"></i>
                                Export CV Data (JSON)
                            </Button>
                            <FieldDescription className="text-center text-xs">
                                This file is not a CV. It contains editable data only.
                            </FieldDescription>
                        </Field>
                    </FieldSet> */}
                </FieldGroup>
            </div>
        </ScrollArea>
    )
}