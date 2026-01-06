'use client'

import { useState, useEffect, type ComponentType } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector, useDefaultCurrency } from '@/lib/hooks'
import { useLoadCVData } from '@/hooks/use-load-cv-data'
import { usePrepareData } from '@/hooks/use-prepare-cv-data'
import { setCurrentPage } from '@/lib/slices/pagesSlice'
import { selectTemplate, setCurrentDesignId } from '@/lib/slices/templatesSlice'
import { menuIcons } from "@/components/AppSidebar";
import { pdf } from '@react-pdf/renderer';
import { Input } from '@/components/ui/input';
import { addApplication as addApplicationToDB } from '@/lib/db/applications'
import { DBExperience, DBEducation, DBCourse, type PersonalInfo, type Links } from '@/lib/db/types'
import type { CVTemplateProps } from '@/components/cv-templates'
import { type Skills } from '@/lib/slices/skillsSlice'
import { type Footer } from '@/lib/slices/footerSlice'
import { Dialog, DialogContent, DialogClose, DialogDescription, DialogFooter, DialogTitle } from '../ui/dialog';
import { getAllTemplates } from '@/lib/db/templates';
import { DBTemplates } from '@/lib/db/types';
import { type Freelance } from '@/lib/slices/freelanceSlice';
import { getMenuItems } from "@/components/AppSidebar";

const contentData = getMenuItems({slug: "export"});

interface DownloadPDFProps {
    personal: PersonalInfo;
    experiences: DBExperience[];
    educations: DBEducation[];
    courses: DBCourse[];
    skills: Skills;
    freelance: Freelance;
    footer: Footer;
    links: Links;
    filename: string;
    lang: string;
    designId?: string; // ID designu do użycia
}

export const handleDownloadPDF = async ({ personal, experiences, educations, courses, skills, freelance, footer, links, filename, lang, designId }: DownloadPDFProps) => {
    // Dynamicznie ładuj szablon na podstawie designId
    const { loadCVTemplate } = await import('@/components/cv-templates')
    const CVTemplate = await loadCVTemplate(designId || 'classic') as ComponentType<CVTemplateProps>
    
    const blob = await pdf(
        <CVTemplate 
            personal={personal}
            experiences={experiences}
            educations={educations}
            courses={courses}
            skills={skills}
            freelance={freelance}
            footer={footer}
            links={links}
            lang={lang}
        />
    ).toBlob();
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

export default function Export() {
    const dispatch = useAppDispatch()

    useLoadCVData()

    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [exportData, setExportData] = useState({
        companyName: '',
        jobTitle: '',
        jobLink: '',
        salary: '',
        notes: '',
    });
    const [templates, setTemplates] = useState<DBTemplates[]>([]);
    const defaultCurrency = useDefaultCurrency()

    const personal = useAppSelector(state => state.personal)
    const experiences = useAppSelector(state => state.experiences.list)
    const educations = useAppSelector(state => state.educations.list)
    const courses = useAppSelector(state => state.courses.list)
    const skills = useAppSelector(state => state.skills.skills)
    const freelance = useAppSelector(state => state.freelance)
    const footer = useAppSelector(state => state.footer)
    const links = useAppSelector(state => state.links)
    const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)
    const defaultLanguage = useAppSelector(state => state.settings.defaultLanguage)
    const selectedTemplateId = useAppSelector(state => state.templates.selectedTemplate)
    const currentDesignId = useAppSelector(state => state.templates.currentDesignId)
    
    const preparedData = usePrepareData({
        lang: selectedLanguage || defaultLanguage || 'en',
        personal,
        experiences,
        educations,
        courses,
        skills,
        freelance,
        footer,
        links
    })
    
    const filename = 'CV-' + preparedData.personal.firstName + '_' + preparedData.personal.lastName + '.pdf'

    const loadTemplates = async () => {
        try {
            const allTemplates = await getAllTemplates();
            setTemplates(allTemplates);
        } catch (error) {
            console.error('Failed to load templates:', error);
        }
    };

    useEffect(() => {
        const fetchTemplates = async () => {
            await loadTemplates();
        };
        fetchTemplates();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        const key = id as keyof typeof exportData
        setExportData(prev => ({ ...prev, [key]: value }))
    }

    const handleTemplateChange = (templateId: string) => {
        dispatch(selectTemplate(templateId))
        
        if (templateId === 'classic') {
            dispatch(setCurrentDesignId('classic'))
        } else {
            const template = templates.find(t => t.id?.toString() === templateId)
            if (template) {
                dispatch(setCurrentDesignId(template.designId || 'classic'))
            }
        }
    }

    const handleDownload = async () => {
        setLoading(true)
        
        try {
            await handleDownloadPDF({ 
                personal: preparedData.personal, 
                experiences: preparedData.experiences, 
                educations: preparedData.educations, 
                courses: preparedData.courses, 
                skills: preparedData.skills,
                freelance: preparedData.freelance,
                footer: preparedData.footer,
                links: preparedData.links,
                filename, 
                lang: preparedData.lang,
                designId: currentDesignId || 'classic'
            })
        } catch (error) {
            console.error('Error downloading PDF:', error)
        } finally {
            setLoading(false)
        }   
    }

    const handleSaveAndDownload = async () => {
        setLoading(true)
        
        try {
            await handleDownloadPDF({ 
                personal: preparedData.personal, 
                experiences: preparedData.experiences, 
                educations: preparedData.educations, 
                courses: preparedData.courses, 
                skills: preparedData.skills,
                freelance: preparedData.freelance,
                footer: preparedData.footer,
                links: preparedData.links,
                filename, 
                lang: preparedData.lang,
                designId: currentDesignId || 'classic'
            })
            
            const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null
            
            await addApplicationToDB({
                companyName: exportData.companyName,
                position: exportData.jobTitle,
                url: exportData.jobLink,
                notes: exportData.notes,
                salary: exportData.salary ? parseFloat(exportData.salary) : null,
                dateApplied: new Date().toISOString().split('T')[0],
                status: 'submitted',
                cvData: {
                    languageId,
                    designId: currentDesignId || 'classic',
                    templateId: selectedTemplateId,
                    personal: preparedData.personal,
                    experiences: preparedData.experiences,
                    educations: preparedData.educations,
                    courses: preparedData.courses,
                    skills: preparedData.skills,
                    freelance: preparedData.freelance,
                    footer: preparedData.footer,
                    links: preparedData.links
                }
            })
            setLoading(false)
            setDialogOpen(true)
        } catch (error) {
            setLoading(false)
            console.error('Error saving application and downloading PDF:', error)
        }
    }
    
    return(
        <>
            <ScrollArea className="h-full">
                <PageHeader iconClass={menuIcons.export}>
                    <PageHeaderTitle>
                        {contentData?.title}
                    </PageHeaderTitle>
                    <PageHeaderDescription>
                        {contentData?.description}
                    </PageHeaderDescription>
                </PageHeader>
                <div className="p-4 pb-16">
                    <FieldGroup>
                        <FieldSet>
                            <Field className="mt-1">
                                <FieldLabel>
                                    Select CV Template
                                </FieldLabel>
                                <Select value={selectedTemplateId || 'classic'} onValueChange={handleTemplateChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choose template..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem key="default" value="classic">
                                            Default Template
                                        </SelectItem>
                                        {templates.map((template) => (
                                            <SelectItem key={template.id} value={template.id?.toString() || ''}>
                                                {template.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        </FieldSet>
                        <FieldSet className="mt-2 pt-5 border-t">
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
                                            Listed Salary {defaultCurrency && `(${defaultCurrency})`}
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
                    </FieldGroup>
                </div>
            </ScrollArea>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogTitle>
                        Application saved successfully!
                    </DialogTitle>
                    <DialogDescription>
                        Remember to update application state in your applications list as you progress through the hiring process.
                    </DialogDescription>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button onClick={() => dispatch(setCurrentPage('applications'))}>
                                Go to Applications
                                <i className='bi bi-arrow-right'></i>
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}