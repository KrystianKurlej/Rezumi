'use client'

import { useEffect, useState } from 'react'
import { useAppSelector } from '@/lib/hooks'
import type { PersonalInfo, DBExperience, DBEducation, DBCourse, Links, DBSkill } from '@/lib/db'
import type { Footer } from '@/lib/slices/footerSlice'
import { loadCVTemplate, type CVTemplateProps } from '@/components/cv-templates'
import { Freelance } from '@/lib/slices/freelanceSlice'
import { usePrepareData } from '@/hooks/use-prepare-cv-data'
import { useCheckDBData } from '@/hooks/use-check-db-data'
import { Button } from '../ui/button'
import { useSeedDatabase } from '@/hooks/use-seed-database'

interface PDFViewerWrapperProps {
    lang: string
    personal: PersonalInfo
    experiences: DBExperience[]
    educations: DBEducation[]
    courses: DBCourse[]
    skills: DBSkill[]
    freelance: Freelance
    footer: Footer
    links: Links
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
    footer,
    links
}: PDFViewerWrapperProps) {
    const [Client, setClient] = useState<PDFClient | null>(null)
    const currentDesignId = useAppSelector((state) => state.templates.currentDesignId)
    const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)
    const { isDataEmpty, isChecking } = useCheckDBData(selectedLanguage || null)
    const { seed, isSeeding } = useSeedDatabase()
    
    const preparedData = usePrepareData({
        lang,
        personal,
        experiences,
        educations,
        courses,
        skills,
        freelance,
        footer,
        links
    })

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

    if (!Client || isChecking) {
        return <div className="flex-1"></div>
    }

    const { PDFViewer, CVTemplate } = Client

    if (isDataEmpty) {
        return (
            <div className='w-full h-full flex flex-col items-center justify-center text-white text-center p-4'>
                <i className="bi bi-file-earmark-text text-6xl"></i>
                <h1 className="text-4xl font-medium mt-4">Your CV preview will appear here</h1>
                <p className='mt-2'>Start by filling in your CV data.<br />As you add content, your resume will update in real time.</p>
                <p className='my-4 opacity-50'>or</p>
                <Button
                    variant='outline'
                    style={{ backgroundColor: '#282828' }}
                    className='hover:text-white hover:!bg-secondary/10 !border-white'
                    onClick={seed}
                    disabled={isSeeding}
                >
                    Start with sample CV data
                </Button>
            </div>
        )
    } else {
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
                    links={preparedData.links}
                />
            </PDFViewer>
        )
    }
}
