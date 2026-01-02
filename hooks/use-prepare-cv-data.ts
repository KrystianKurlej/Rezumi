import { useEffect, useState } from 'react'
import { useAppSelector } from '@/lib/hooks'
import { getAllTemplates } from '@/lib/db/templates'
import type { PersonalInfo } from '@/lib/slices/personalSlice'
import type { DBExperience, DBEducation, DBCourse, DBTemplates } from '@/lib/db'
import type { Skills } from '@/lib/slices/skillsSlice'
import type { Footer } from '@/lib/slices/footerSlice'
import type { Freelance } from '@/lib/slices/freelanceSlice'

interface UsePrepareDataProps {
    lang: string
    personal: PersonalInfo
    experiences: DBExperience[]
    educations: DBEducation[]
    courses: DBCourse[]
    skills: Skills
    freelance: Freelance
    footer: Footer
}

interface PreparedData {
    lang: string
    personal: PersonalInfo
    experiences: DBExperience[]
    educations: DBEducation[]
    courses: DBCourse[]
    skills: Skills
    freelance: Freelance
    footer: Footer
}

export function usePrepareData({
    lang,
    personal,
    experiences,
    educations,
    courses,
    skills,
    freelance,
    footer
}: UsePrepareDataProps) {
    const currentTemplateId = useAppSelector((state) => state.templates.selectedTemplate)
    const [currentTemplate, setCurrentTemplate] = useState<DBTemplates | null>(null)

    useEffect(() => {
        const loadTemplate = async () => {
            if (!currentTemplateId || currentTemplateId === 'classic') {
                setCurrentTemplate(null)
                return
            }

            try {
                const templates = await getAllTemplates()
                const template = templates.find(t => t.id === Number(currentTemplateId))
                setCurrentTemplate(template || null)
            } catch (error) {
                console.error('Error loading template:', error)
                setCurrentTemplate(null)
            }
        }

        loadTemplate()
    }, [currentTemplateId])

    const preparedData: PreparedData = (() => {
        let modifiedPersonal = { ...personal }

        if (currentTemplate) {
            if (currentTemplate.personalInformation?.profilePicture?.disabled) {
                modifiedPersonal = {
                    ...modifiedPersonal,
                    photo: ''
                }
            }

            if (currentTemplate.personalInformation?.about?.disabled) {
                modifiedPersonal = {
                    ...modifiedPersonal,
                    aboutDescription: ''
                }
            } else if (currentTemplate.personalInformation?.about?.customValue) {
                modifiedPersonal = {
                    ...modifiedPersonal,
                    aboutDescription: currentTemplate.personalInformation.about.customValue
                }
            }
        }

        return {
            lang,
            personal: modifiedPersonal,
            experiences,
            educations,
            courses,
            skills,
            freelance,
            footer
        }
    })()

    return preparedData
}
