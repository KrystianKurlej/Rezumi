import type { PersonalInfo, DBExperience, DBEducation, DBCourse, DBSkill, Links } from './types'
import type { Footer } from '@/lib/slices/footerSlice'
import { updatePersonalInfo } from './personal'
import { addExperience } from './experiences'
import { addEducation } from './educations'
import { addCourse } from './courses'
import { addSkill } from './skills'
import { updateLinks } from './links'
import { updateFooter } from './footer'

const samplePersonalInfo: Omit<PersonalInfo, 'photo'> = {
    languageId: null,
    firstName: 'John',
    lastName: 'Doe',
    role: 'Full Stack Developer',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    aboutDescription: 'Passionate developer with 5+ years of experience in building web applications.'
}

const sampleLinks: Links = {
    languageId: null,
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/'
}

const sampleExperiences: Omit<DBExperience, 'id' | 'createdAt' | 'type'>[] = [
    {
        languageId: null,
        company: 'Tech Corp',
        title: 'Senior Frontend Developer',
        startDate: '2021-01',
        endDate: '',
        isOngoing: true,
        description: 'Leading frontend development team, implementing new features using React and TypeScript.'
    },
    {
        languageId: null,
        company: 'StartupXYZ',
        title: 'Full Stack Developer',
        startDate: '2019-06',
        endDate: '2020-12',
        isOngoing: false,
        description: 'Developed and maintained web applications using Node.js, React, and MongoDB.'
    }
]

const sampleEducations: Omit<DBEducation, 'id' | 'createdAt' | 'type'>[] = [
    {
        languageId: null,
        institution: 'University of California',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        startDate: '2015-09',
        endDate: '2019-05',
        description: 'Focus on software engineering and web technologies.',
        isOngoing: false
    }
]

const sampleCourses: Omit<DBCourse, 'id' | 'createdAt' | 'type'>[] = [
    {
        languageId: null,
        courseName: 'Advanced React Patterns',
        platform: 'Frontend Masters',
        completionDate: '2023-03',
        certificateUrl: '',
        description: 'Deep dive into advanced React concepts and patterns.',
        isOngoing: false,
    },
    {
        languageId: null,
        courseName: 'AWS Solutions Architect',
        platform: 'AWS Training',
        completionDate: '2022-11',
        certificateUrl: '',
        description: 'Cloud architecture and AWS services certification.',
        isOngoing: false,
    }
]

const sampleSkills: Omit<DBSkill, 'id' | 'createdAt' | 'type'>[] = [
    { languageId: null, skillName: 'React', order: 1},
    { languageId: null, skillName: 'TypeScript', order: 2},
    { languageId: null, skillName: 'Node.js', order: 3},
    { languageId: null, skillName: 'PostgreSQL', order: 4},
    { languageId: null, skillName: 'AWS', order: 5},
    { languageId: null, skillName: 'Docker', order: 6}
]

const sampleFooter: Footer = {
    languageId: null,
    footerText: 'I hereby give consent for my personal data to be processed for recruitment purposes.',
}

export const seedDatabase = async (): Promise<void> => {
    try {
        await updatePersonalInfo(samplePersonalInfo)
        await updateLinks(sampleLinks)
        await updateFooter(sampleFooter)

        for (const exp of sampleExperiences) {
            await addExperience(exp)
            await new Promise(resolve => setTimeout(resolve, 10))
        }

        for (const edu of sampleEducations) {
            await addEducation(edu)
            await new Promise(resolve => setTimeout(resolve, 10))
        }

        for (const course of sampleCourses) {
            await addCourse(course)
            await new Promise(resolve => setTimeout(resolve, 10))
        }

        for (const skill of sampleSkills) {
            await addSkill(skill)
            await new Promise(resolve => setTimeout(resolve, 10))
        }
    } catch (error) {
        console.error('Failed to seed database:', error)
        throw error
    }
}