import type { CVTemplateProps } from './ClassicCV';

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

export type { CVTemplateProps };
