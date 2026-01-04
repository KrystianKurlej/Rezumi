'use client'

import { useEffect, useState } from 'react'
import { useAppSelector } from '@/lib/hooks'
import type { PersonalInfo, DBExperience, DBEducation, DBCourse } from '@/lib/db'
import type { Skills } from '@/lib/slices/skillsSlice'
import type { Footer } from '@/lib/slices/footerSlice'
import { loadCVTemplate, type CVTemplateProps } from '@/components/cv-templates'
import { Freelance } from '@/lib/slices/freelanceSlice'
import { usePrepareData } from '@/hooks/use-prepare-cv-data'

interface PDFViewerWrapperProps {
    lang: string
    personal: PersonalInfo
    experiences: DBExperience[]
    educations: DBEducation[]
    courses: DBCourse[]
    skills: Skills
    freelance: Freelance
    footer: Footer
}

interface PDFClient {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PDFViewer: React.ComponentType<any>
    CVTemplate: React.ComponentType<CVTemplateProps>
}

export default function PDFViewerWrapper({
    lang,
    personal,
    experiences,
    educations,
    courses,
    skills,
    freelance,
    footer
}: PDFViewerWrapperProps) {
    const [Client, setClient] = useState<PDFClient | null>(null)
    const currentDesignId = useAppSelector((state) => state.templates.currentDesignId)
    
    const preparedData = usePrepareData({
        lang,
        personal,
        experiences,
        educations,
        courses,
        skills,
        freelance,
        footer
    })
    
    console.log("🚀 ~ PDFViewerWrapper ~ preparedData:", preparedData)

    useEffect(() => {
        const loadPDF = async () => {
            const { PDFViewer } = await import('@react-pdf/renderer')
            const CVTemplate = await loadCVTemplate(currentDesignId || 'classic')
            
            setClient({
                PDFViewer,
                CVTemplate
            })
        }
        
        loadPDF()
    }, [currentDesignId])

    if (!Client) {
        return <div className="flex-1"></div>
    }

    const { PDFViewer, CVTemplate } = Client

    return (
        <PDFViewer key={currentDesignId} className='w-full h-full' showToolbar={false}>
            <CVTemplate
                lang={preparedData.lang}
                personal={preparedData.personal}
                experiences={preparedData.experiences}
                educations={preparedData.educations}
                courses={preparedData.courses}
                skills={preparedData.skills}
                freelance={preparedData.freelance}
                footer={preparedData.footer}
            />
        </PDFViewer>
    )
}
