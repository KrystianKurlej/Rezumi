'use client'

import { useEffect, useState } from 'react'
import { useAppSelector } from '@/lib/hooks'
import { loadCVTemplate, type CVTemplateProps } from '@/components/cv-templates'
import { usePrepareData } from '@/hooks/use-prepare-cv-data'
import { useCheckDBData } from '@/hooks/use-check-db-data'
import { useSeedDatabase } from '@/hooks/use-seed-database'
import { Button } from '../ui/button'

interface PDFClient {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PDFViewer: React.ComponentType<any>
    CVTemplate: React.ComponentType<CVTemplateProps>
}

export default function Preview() {
    const [Client, setClient] = useState<PDFClient | null>(null)
    
    const selectedLang = useAppSelector(state => state.preview.selectedLanguage)
    const defaultLang = useAppSelector(state => state.settings.defaultLanguage)
    const reloadKey = useAppSelector(state => state.preview.reloadKey)
    const currentDesignId = useAppSelector((state) => state.templates.currentDesignId)
    const personal = useAppSelector(state => state.personal)
    const experiences = useAppSelector(state => state.experiences.list)
    const educations = useAppSelector(state => state.educations.list)
    const courses = useAppSelector(state => state.courses.list)
    const skills = useAppSelector(state => state.skills.skills)
    const freelance = useAppSelector(state => state.freelance)
    const footer = useAppSelector(state => state.footer)
    const links = useAppSelector(state => state.links)
    
    const lang = selectedLang || defaultLang || 'en'
    const selectedLanguage = selectedLang
    
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
    }

    return (
        <PDFViewer key={`${currentDesignId}-${reloadKey}`} className='w-full h-full' showToolbar={false}>
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