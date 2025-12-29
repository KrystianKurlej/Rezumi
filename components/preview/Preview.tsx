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
    const lang = useAppSelector(state => state.preview.selectedLanguage)
    const personal = useAppSelector(state => state.personal)
    const experiences = useAppSelector(state => state.experiences.list)
    const educations = useAppSelector(state => state.educations.list)
    const courses = useAppSelector(state => state.courses.list)
    const skills = useAppSelector(state => state.skills)
    const footer = useAppSelector(state => state.footer)

    return(
        <PDFViewerWrapper
            lang={lang}
            personal={personal}
            experiences={experiences}
            educations={educations}
            courses={courses}
            skills={skills}
            footer={footer}
        />
    )
}