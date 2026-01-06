export interface DBCVData {
    languageId: string | null
    designId?: string // ID designu szablonu używanego do wygenerowania CV
    templateId?: number | string // ID szablonu używanego do wygenerowania CV
    personal: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string,
        aboutDescription?: string
    }
    experiences: DBExperience[]
    educations: DBEducation[]
    courses: DBCourse[]
    skills: DBSkill[]
    freelance: { freelanceText: string }
    footer: { footerText: string }
    links?: Links
}

export interface PersonalInfo {
    languageId?: string | null
    firstName: string
    lastName: string
    role?: string
    email: string
    phone: string
    aboutDescription?: string
    photo?: string
}

export interface Links {
    languageId?: string | null
    linkedin?: string
    github?: string
    portfolio?: string
    twitter?: string
    facebook?: string
    instagram?: string
    website?: string
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

export interface DBSkill {
    id?: number
    type: 'skill'
    languageId?: string | null
    skillName: string
    description?: string
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
    personalInformation: {
        profilePicture: {
            disabled: boolean
        }
        about: {
            disabled: boolean
            customValue?: string
        }
    }
    experience: {
        disabled?: string[]
        customValues?: { [key: string]: string }
    }
    education: {
        disabled?: string[]
        customValues?: { [key: string]: string }
    }
    courses: {
        disabled?: string[]
        customValues?: { [key: string]: string }
    }
    skills: {
        disabled: boolean
        customValue?: string
    }
    freelance: {
        disabled: boolean
        customValue?: string
    }
    footer: {
        disabled: boolean
        customValue?: string
    }
    createdAt: number
}

export type StoredItem = DBExperience | DBEducation | DBCourse | DBSkill | DBApplication | { id: string; type?: string }
