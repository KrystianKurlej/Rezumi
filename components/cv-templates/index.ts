import { PersonalInfo } from '@/lib/db/types';
import { DBExperience, DBEducation, DBCourse } from '@/lib/db';
import { Skills } from '@/lib/slices/skillsSlice';
import { Footer } from '@/lib/slices/footerSlice';
import { Freelance } from '@/lib/slices/freelanceSlice';

export interface CVTemplateProps {
    lang: string;
    personal: PersonalInfo;
    experiences: DBExperience[];
    educations: DBEducation[];
    courses: DBCourse[];
    skills: Skills;
    freelance: Freelance;
    footer: Footer;
}

export const designs = {
    "classic": {
        title: "Classic",
        description: "A traditional layout with clear sections and headings.",
    },
    "minimalist": {
        title: "Minimalist",
        description: "A clean and simple design focusing on content.",
    },
    "confident": {
        title: "Confident",
        description: "A bold design with strong typography and accents.",
    },
};

const CV_TEMPLATES = {
    classic: () => import('./ClassicCV'),
    minimalist: () => import('./MinimalisticCV'),
    confident: () => import('./ConfidentCV'),
} as const;

export type CVTemplateType = keyof typeof CV_TEMPLATES;

export async function loadCVTemplate(templateId: string) {
    const templateKey = templateId as CVTemplateType;
    
    const loader = CV_TEMPLATES[templateKey] || CV_TEMPLATES.classic;
    
    const templateModule = await loader();
    return templateModule.default;
}
