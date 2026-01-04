'use client'

import { useAppSelector } from "@/lib/hooks"
import dynamic from 'next/dynamic'

const PDFViewerWrapper = dynamic(
    () => import('./PDFViewerWrapper'),
    {
        ssr: false,
        loading: () => <div className="flex-1"></div>,
    }
)

export default function Preview() {
    const selectedLang = useAppSelector(state => state.preview.selectedLanguage)
    const defaultLang = useAppSelector(state => state.settings.defaultLanguage)
    const reloadKey = useAppSelector(state => state.preview.reloadKey)
    const lang = selectedLang || defaultLang || 'en'
    const personal = useAppSelector(state => state.personal)
    const experiences = useAppSelector(state => state.experiences.list)
    const educations = useAppSelector(state => state.educations.list)
    const courses = useAppSelector(state => state.courses.list)
    const skills = useAppSelector(state => state.skills)
    const freelance = useAppSelector(state => state.freelance)
    const footer = useAppSelector(state => state.footer)
    const links = useAppSelector(state => state.links)

    return(
        <PDFViewerWrapper
            key={reloadKey}
            lang={lang}
            personal={personal}
            experiences={experiences}
            educations={educations}
            courses={courses}
            skills={skills}
            freelance={freelance}
            footer={footer}
            links={links}
        />
    )
}