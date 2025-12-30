export interface DBCVData {
    languageId: string | null
    designId?: string // ID designu szablonu używanego do wygenerowania CV
    personal: { firstName: string; lastName: string; email: string; phone: string }
    experiences: DBExperience[]
    educations: DBEducation[]
    courses: DBCourse[]
    skills: { skillsText: string }
    footer: { footerText: string }
}

export interface DBExperience {
    id?: number
    type: 'experience'
    languageId?: string | null
    title: string
    company: string
    startDate: string
    endDate: string
    description: string
    isOngoing: boolean
    createdAt: number
}

export interface DBEducation {
    id?: number
    type: 'education'
    languageId?: string | null
    degree: string
    institution: string
    fieldOfStudy: string
    startDate: string
    endDate: string
    description: string
    isOngoing: boolean
    createdAt: number
}

export interface DBCourse {
    id?: number
    type: 'course'
    languageId?: string | null
    courseName: string
    platform: string
    completionDate: string
    certificateUrl: string
    description: string
    isOngoing: boolean
    createdAt: number
}

export interface DBApplication {
    id?: number
    type: 'application'
    companyName: string
    position: string
    url: string
    notes: string
    salary: number | null
    dateApplied: string
    status: 'notApplied' | 'submitted' | 'rejected' | 'offerExtendedInProgress' | 'jobRemoved' | 'ghosted' | 'offerExtendedNotAccepted' | 'rescinded' | 'notForMe' | 'sentFollowUp' | null
    createdAt: number
    cvData?: DBCVData
}

export interface Settings {
    defaultLanguage: string | null
    availableLanguages: string[]
    defaultCurrency: string
}

export interface DBTemplates {
    id?: number
    type: 'design'
    name: string
    designId: string
    createdAt: number
}

export type StoredItem = DBExperience | DBEducation | DBCourse | DBApplication | { id: string; type?: string }
