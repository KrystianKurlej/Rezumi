'use client'

import { useAppSelector } from "@/lib/hooks"

export default function Preview() {
    const personal = useAppSelector(state => state.personal)
    const experiences = useAppSelector(state => state.experiences.list)
    const educations = useAppSelector(state => state.educations.list)

    return(
        <div className="p-10 bg-white shadow-sm">
            <div className="text-sm">CV</div>
            <div className="text-4xl font-semibold">{personal.firstName} {personal.lastName}</div>
            <div className="py-1">
                <div>{personal.email}</div>
                <div>{personal.phone}</div>
            </div>
            {experiences.length > 0 && (
                <div className="mt-4">
                    <div className="text-xl font-semibold pb-1 mb-2 border-b border-gray-300">Experience</div>
                    <ul>
                        {experiences.map((experience) => (
                            <li key={experience.id} className={"mb-2" + (experiences.length - 1 !== experiences.indexOf(experience) ? " border-b border-gray-200 pb-2" : "")}>
                                <div className="flex gap-4">
                                    <div className="grow"><span className="font-semibold">{experience.title}</span> - {experience.company}</div>
                                    <div className="shrink-0">{experience.startDate} - {experience.isOngoing ? 'Present' : experience.endDate}</div>
                                </div>
                                <div className="text-sm">{experience.description}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {educations.length > 0 && (
                <div className="mt-4">
                    <div className="text-xl font-semibold pb-1 mb-2 border-b border-gray-300">Education</div>
                    <ul>
                        {educations.map((education) => (
                            <li key={education.id} className={"mb-2" + (educations.length - 1 !== educations.indexOf(education) ? " border-b border-gray-200 pb-2" : "")}>
                                <div className="flex gap-4">
                                    <div className="grow"><span className="font-semibold">{education.degree}</span> in {education.fieldOfStudy}</div>
                                    <div className="shrink-0">{education.startDate} - {education.isOngoing ? 'Present' : education.endDate}</div>
                                </div>
                                <div className="text-sm font-medium">{education.institution}</div>
                                {education.description && <div className="text-sm">{education.description}</div>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}