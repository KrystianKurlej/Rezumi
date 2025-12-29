'use client'

import { useEffect, useState } from 'react'
import type { PersonalInfo } from '@/lib/slices/personalSlice'
import type { DBExperience, DBEducation } from '@/lib/db'
import type { Skills } from '@/lib/slices/skillsSlice'
import type { Footer } from '@/lib/slices/footerSlice'

interface PDFViewerWrapperProps {
    personal: PersonalInfo
    experiences: DBExperience[]
    educations: DBEducation[]
    skills: Skills
    footer: Footer
}

interface PDFClient {
    PDFViewer: React.ComponentType<any>
    GenerateCV: React.ComponentType<any>
}

export default function PDFViewerWrapper({
    personal,
    experiences,
    educations,
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
        return null
    }

    const { PDFViewer, GenerateCV } = Client

    return (
        <PDFViewer className='w-full h-full' showToolbar={false}>
            <GenerateCV
                personal={personal}
                experiences={experiences}
                educations={educations}
                skills={skills}
                footer={footer}
            />
        </PDFViewer>
    )
}
