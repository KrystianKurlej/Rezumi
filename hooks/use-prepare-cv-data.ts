import { useEffect, useState } from 'react'
import { useAppSelector } from '@/lib/hooks'
import { getAllTemplates } from '@/lib/db/templates'
import type { PersonalInfo, DBExperience, DBEducation, DBCourse, DBTemplates, Links } from '@/lib/db'
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
    links: Links
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
    links: Links
}

export function usePrepareData({
    lang,
    personal,
    experiences,
    educations,
    courses,
    skills,
    freelance,
    footer,
    links
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
        let modifiedExperiences = [...experiences]
        let modifiedEducations = [...educations]
        let modifiedCourses = [...courses]
        let modifiedSkills = { ...skills }
        let modifiedFreelance = { ...freelance }
        let modifiedFooter = { ...footer }
        let modifiedLinks = { ...links }

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

            if (currentTemplate.experience?.disabled && currentTemplate.experience.disabled.length > 0) {
                modifiedExperiences = modifiedExperiences.filter(exp =>
                    !currentTemplate.experience?.disabled?.includes(exp.id?.toString() || '')
                )
            }

            if (currentTemplate.experience?.customValues) {
                modifiedExperiences = modifiedExperiences.map(exp => {
                    const expId = exp.id?.toString() || ''
                    const customDescription = currentTemplate.experience?.customValues?.[expId]

                    if (customDescription !== undefined && customDescription !== '') {
                        return {
                            ...exp,
                            description: customDescription
                        }
                    }

                    return exp
                })
            }

            if (currentTemplate.education?.disabled && currentTemplate.education.disabled.length > 0) {
                modifiedEducations = modifiedEducations.filter(edu =>
                    !currentTemplate.education?.disabled?.includes(edu.id?.toString() || '')
                )
            }

            if (currentTemplate.education?.customValues) {
                modifiedEducations = modifiedEducations.map(edu => {
                    const eduId = edu.id?.toString() || ''
                    const customDescription = currentTemplate.education?.customValues?.[eduId]

                    if (customDescription !== undefined && customDescription !== '') {
                        return {
                            ...edu,
                            description: customDescription
                        }
                    }

                    return edu
                })
            }

            if (currentTemplate.courses?.disabled && currentTemplate.courses.disabled.length > 0) {
                modifiedCourses = modifiedCourses.filter(course =>
                    !currentTemplate.courses?.disabled?.includes(course.id?.toString() || '')
                )
            }

            if (currentTemplate.courses?.customValues) {
                modifiedCourses = modifiedCourses.map(course => {
                    const courseId = course.id?.toString() || ''
                    const customDescription = currentTemplate.courses?.customValues?.[courseId]

                    if (customDescription !== undefined && customDescription !== '') {
                        return {
                            ...course,
                            description: customDescription
                        }
                    }

                    return course
                })
            }

            if (currentTemplate.skills?.disabled) {
                modifiedSkills = {
                    skillsText: ''
                }
            } else if (currentTemplate.skills?.customValue) {
                modifiedSkills = {
                    skillsText: currentTemplate.skills.customValue
                }
            }

            if (currentTemplate.freelance?.disabled) {
                modifiedFreelance = {
                    freelanceText: ''
                }
            } else if (currentTemplate.freelance?.customValue) {
                modifiedFreelance = {
                    freelanceText: currentTemplate.freelance.customValue
                }
            }

            if (currentTemplate.footer?.disabled) {
                modifiedFooter = {
                    footerText: ''
                }
            } else if (currentTemplate.footer?.customValue) {
                modifiedFooter = {
                    footerText: currentTemplate.footer.customValue
                }
            }
        }

        return {
            lang,
            personal: modifiedPersonal,
            experiences: modifiedExperiences,
            educations: modifiedEducations,
            courses: modifiedCourses,
            skills: modifiedSkills,
            freelance: modifiedFreelance,
            footer: modifiedFooter,
            links: modifiedLinks
        }
    })()

    return preparedData
}
