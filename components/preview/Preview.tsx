'use client'

import { useAppSelector } from "@/lib/hooks"
import { PDFViewer } from '@react-pdf/renderer';
import GenerateCV from "../GenerateCV";

export default function Preview() {
    const personal = useAppSelector(state => state.personal)
    const experiences = useAppSelector(state => state.experiences.list)
    const educations = useAppSelector(state => state.educations.list)
    const skills = useAppSelector(state => state.skills)
    const footer = useAppSelector(state => state.footer)

    return(
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