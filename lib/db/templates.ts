import { initDB, STORE_NAME } from './base'
import { DBTemplates } from './types'

export const createTemplate = async (template: { name: string; description: string; designId: string; }): Promise<number> => {
    const database = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)

        const timestamp = Date.now()
        const id = timestamp

        const newTemplate = {
            ...template,
            id,
            type: 'design',
            createdAt: timestamp,
            personalInformation: {
                profilePicture: {
                    disabled: false,
                },
                about: {
                    disabled: false,
                    customValue: '',
                }
            },
            experience: {
                disabled: [],
                customValues: {},
            },
            education: {
                disabled: [],
                customValues: {},
            },
            courses: {
                disabled: [],
                customValues: {},
            },
            skills: {
                disabled: [],
                customValues: {},
            },
            links: {
                disabled: [],
            },
            freelance: {
                disabled: false,
                customValue: '',
            },
            footer: {
                disabled: false,
                customValue: '',
            },
        }

        const request = store.add(newTemplate)

        request.onsuccess = () => {
            resolve(id)
        }

        request.onerror = () => {
            reject('Failed to create template')
        }
    })
}

export const updateTemplate = async (templateId: number, updatedData: { 
    name: string; 
    designId: string;
    personalInformation?: {
        profilePicture?: {
            disabled?: boolean;
        };
        about?: {
            disabled?: boolean;
            customValue?: string;
        };
    };
    experience?: {
        disabled?: string[];
        customValues?: { [key: string]: string };
    };
    education?: {
        disabled?: string[];
        customValues?: { [key: string]: string };
    };
    courses?: {
        disabled?: string[];
        customValues?: { [key: string]: string };
    };
    skills?: {
        disabled?: string[];
        customValues?: { [key: string]: string };
    };
    links?: {
        disabled?: string[];
    };
    freelance?: {
        disabled?: boolean;
        customValue?: string;
    };
    footer?: {
        disabled?: boolean;
        customValue?: string;
    };
}): Promise<void> => {
    const database = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)

        const getRequest = store.get(templateId)

        getRequest.onsuccess = () => {
            const existingTemplate = getRequest.result

            if (!existingTemplate) {
                reject('Template not found')
                return
            }

            const updatedTemplate = {
                ...existingTemplate,
                ...updatedData,
                personalInformation: updatedData.personalInformation ? {
                    ...existingTemplate.personalInformation,
                    ...updatedData.personalInformation,
                    profilePicture: updatedData.personalInformation.profilePicture ? {
                        ...existingTemplate.personalInformation?.profilePicture,
                        ...updatedData.personalInformation.profilePicture
                    } : existingTemplate.personalInformation?.profilePicture,
                    about: updatedData.personalInformation.about ? {
                        ...existingTemplate.personalInformation?.about,
                        ...updatedData.personalInformation.about
                    } : existingTemplate.personalInformation?.about,
                } : existingTemplate.personalInformation,
                experience: updatedData.experience ? {
                    ...existingTemplate.experience,
                    ...updatedData.experience
                } : existingTemplate.experience,
                education: updatedData.education ? {
                    ...existingTemplate.education,
                    ...updatedData.education
                } : existingTemplate.education,
                courses: updatedData.courses ? {
                    ...existingTemplate.courses,
                    ...updatedData.courses
                } : existingTemplate.courses,
                skills: updatedData.skills ? {
                    ...existingTemplate.skills,
                    ...updatedData.skills
                } : existingTemplate.skills,
                links: updatedData.links ? {
                    ...existingTemplate.links,
                    ...updatedData.links
                } : existingTemplate.links,
                freelance: updatedData.freelance ? {
                    ...existingTemplate.freelance,
                    ...updatedData.freelance
                } : existingTemplate.freelance,
                footer: updatedData.footer ? {
                    ...existingTemplate.footer,
                    ...updatedData.footer
                } : existingTemplate.footer,
            }

            const putRequest = store.put(updatedTemplate)

            putRequest.onsuccess = () => {
                resolve()
            }

            putRequest.onerror = () => {
                reject('Failed to update template')
            }
        }

        getRequest.onerror = () => {
            reject('Failed to retrieve template')
        }
    })
}

export const deleteTemplate = async (templateId: number): Promise<void> => {
    const database = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)

        const request = store.delete(templateId)

        request.onsuccess = () => {
            resolve()
        }

        request.onerror = () => {
            reject('Failed to delete template')
        }
    })
}

export const getAllTemplates = async (): Promise<DBTemplates[]> => {
    const database = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)

        const request = store.getAll()

        request.onsuccess = () => {
            const templates = request.result.filter(item => item.type === 'design') as DBTemplates[]
            resolve(templates)
        }

        request.onerror = () => {
            reject('Failed to retrieve templates')
        }
    })
}

export const getTemplateById = async (templateId: number): Promise<DBTemplates | null> => {
    const database = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)

        const request = store.get(templateId)

        request.onsuccess = () => {
            const template = request.result
            if (template && template.type === 'design') {
                resolve(template as DBTemplates)
            } else {
                resolve(null)
            }
        }

        request.onerror = () => {
            reject('Failed to retrieve template')
        }
    })
}