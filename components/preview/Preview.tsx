'use client'

import { useAppSelector } from "@/lib/hooks"
import dynamic from 'next/dynamic'

const PDFViewerWrapper = dynamic(
    () => import('./PDFViewerWrapper'),
    {
        ssr: false,
    }
)

export default function Preview() {
    const personal = useAppSelector(state => state.personal)
    const experiences = useAppSelector(state => state.experiences.list)
    const educations = useAppSelector(state => state.educations.list)
    const skills = useAppSelector(state => state.skills)
    const footer = useAppSelector(state => state.footer)

    return(
        <PDFViewerWrapper
            personal={personal}
            experiences={experiences}
            educations={educations}
            skills={skills}
            footer={footer}
        />
    )
}