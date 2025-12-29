'use client'

import { useEffect, useState } from 'react'
import type { PersonalInfo } from '@/lib/slices/personalSlice'
import type { DBExperience, DBEducation, DBCourse } from '@/lib/db'
import type { Skills } from '@/lib/slices/skillsSlice'
import type { Footer } from '@/lib/slices/footerSlice'

interface PDFViewerWrapperProps {
    lang: string
    personal: PersonalInfo
    experiences: DBExperience[]
    educations: DBEducation[]
    courses: DBCourse[]
    skills: Skills
    footer: Footer
}

interface PDFClient {
    PDFViewer: React.ComponentType<any>
    GenerateCV: React.ComponentType<any>
}

export default function PDFViewerWrapper({
    lang,
    personal,
    experiences,
    educations,
    courses,
    skills,
    footer
}: PDFViewerWrapperProps) {
    const [Client, setClient] = useState<PDFClient | null>(null)

    useEffect(() => {
        const loadPDF = async () => {
            const { PDFViewer } = await import('@react-pdf/renderer')
            const GenerateCV = (await import('../GenerateCV')).default
            
            setClient({
                PDFViewer,
                GenerateCV
            })
        }
        
        loadPDF()
    }, [])

    if (!Client) {
        return <div className="flex-1"></div>
    }

    const { PDFViewer, GenerateCV } = Client

    return (
        <PDFViewer className='w-full h-full' showToolbar={false}>
            <GenerateCV
                lang={lang}
                personal={personal}
                experiences={experiences}
                educations={educations}
                courses={courses}
                skills={skills}
                footer={footer}
            />
        </PDFViewer>
    )
}
