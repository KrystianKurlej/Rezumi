'use client'

import { useAppSelector } from "@/lib/hooks"
import { formatRichText, formatDate } from "@/lib/utils"
import '@/app/preview.css'

export default function Preview() {
    const personal = useAppSelector(state => state.personal)
    const experiences = useAppSelector(state => state.experiences.list)
    const educations = useAppSelector(state => state.educations.list)
    const skills = useAppSelector(state => state.skills)
    const footer = useAppSelector(state => state.footer)
    const scale = useAppSelector(state => state.preview.scale)

    return(
        <div className="cv-preview-container shadow-lg my-6" style={{ scale: scale }}>
            <div className="cv-page">
                <div className="cv-header">CV</div>
                
                <div className="cv-name">{personal.firstName} {personal.lastName}</div>
                
                {(personal.email || personal.phone) && (
                    <div className="cv-contact">
                        {personal.email && <div>{personal.email}</div>}
                        {personal.phone && <div>{personal.phone}</div>}
                    </div>
                )}

                {experiences.length > 0 && (
                    <div className="cv-section">
                        <div className="cv-section-title">Experience</div>
                        <div className="cv-section-content">
                            {experiences.map((experience, index) => (
                                <div key={experience.id} className="cv-item">
                                    <div className="cv-item-header">
                                        <div className="cv-item-title">
                                            <span className="cv-item-title-main">{experience.title}</span> - {experience.company}
                                        </div>
                                        <div className="cv-item-date">
                                            {formatDate(experience.startDate, 'short')} - {experience.isOngoing ? 'Present' : formatDate(experience.endDate, 'short')}
                                        </div>
                                    </div>
                                    {experience.description && (
                                        <div className="cv-item-description" dangerouslySetInnerHTML={{ __html: formatRichText(experience.description) }}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {educations.length > 0 && (
                    <div className="cv-section">
                        <div className="cv-section-title">Education</div>
                        <div className="cv-section-content">
                            {educations.map((education, index) => (
                                <div key={education.id} className="cv-item">
                                    <div className="cv-item-header">
                                        <div className="cv-item-title">
                                            <span className="cv-item-title-main">{education.degree}</span> in {education.fieldOfStudy}
                                        </div>
                                        <div className="cv-item-date">
                                            {formatDate(education.startDate, 'short')} - {education.isOngoing ? 'Present' : formatDate(education.endDate, 'short')}
                                        </div>
                                    </div>
                                    <div className="cv-institution">{education.institution}</div>
                                    {education.description && (
                                        <div className="cv-item-description" dangerouslySetInnerHTML={{ __html: formatRichText(education.description) }}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {skills.skillsText && (
                    <div className="cv-section">
                        <div className="cv-section-title">Skills</div>
                        <div className="cv-section-content">
                            <div className="cv-skills" dangerouslySetInnerHTML={{ __html: formatRichText(skills.skillsText) }}></div>
                        </div>
                    </div>
                )}

                {footer.footerText && (
                    <div className="cv-footer">
                        <div dangerouslySetInnerHTML={{ __html: formatRichText(footer.footerText) }}></div>
                    </div>
                )}
            </div>
        </div>
    )
}