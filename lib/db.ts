const DB_NAME = 'rezumiDB'
const DB_VERSION = 4
const STORE_NAME = 'rezumiStore'

export interface DBCVData {
    languageId: string | null
    personal: { firstName: string; lastName: string; email: string; phone: string }
    experiences: DBExperience[]
    educations: DBEducation[]
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

type StoredItem = DBExperience | DBEducation | DBCourse | DBApplication | { id: string; type?: string }

let db: IDBDatabase | null = null

export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db)
            return
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onerror = () => {
            reject('Failed to open database')
        }

        request.onsuccess = () => {
            db = request.result
            resolve(db)
        }

        request.onupgradeneeded = (event) => {
            const database = (event.target as IDBOpenDBRequest).result
            
            // Usuń stary store jeśli istnieje
            if (database.objectStoreNames.contains(STORE_NAME)) {
                database.deleteObjectStore(STORE_NAME)
            }
            
            // Utwórz nowy store bez autoIncrement
            const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' })
            store.createIndex('updatedAt', 'updatedAt', { unique: false })
        }
    })
}

export const updateSettings = async (settings: Settings): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.put({ id: 'settings', ...settings, updatedAt: Date.now() })

        request.onsuccess = () => {
            resolve()
        }

        request.onerror = () => {
            reject('Failed to update settings')
        }
    })
}

export const getSettings = async (): Promise<Settings | null> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.get('settings')

        request.onsuccess = () => {
            resolve(request.result || null)
        }

        request.onerror = () => {
            reject('Failed to retrieve settings')
        }
    })
}

export const updatePersonalInfo = async (personalInfo: { languageId?: string | null; firstName: string; lastName: string; email: string; phone: string }): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        
        // Użyj personalInfo dla domyślnego języka, personalInfo_{languageId} dla innych
        const key = personalInfo.languageId ? `personalInfo_${personalInfo.languageId}` : 'personalInfo'
        const request = store.put({ id: key, ...personalInfo, updatedAt: Date.now() })

        request.onsuccess = () => {
            resolve()
        }

        request.onerror = () => {
            reject('Failed to update personal information')
        }
    })
}

export const getPersonalInfo = async (languageId?: string | null): Promise<{ languageId?: string | null; firstName: string; lastName: string; email: string; phone: string } | null> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        
        // Użyj personalInfo dla domyślnego języka, personalInfo_{languageId} dla innych
        const key = languageId ? `personalInfo_${languageId}` : 'personalInfo'
        const request = store.get(key)

        request.onsuccess = () => {
            resolve(request.result || null)
        }

        request.onerror = () => {
            reject('Failed to retrieve personal information')
        }
    })
}

export const addExperience = async (experience: Omit<DBExperience, 'id' | 'createdAt' | 'type'>): Promise<number> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const timestamp = Date.now()
        const id = timestamp // Użyj timestamp jako ID
        const request = store.add({ ...experience, id, type: 'experience', createdAt: timestamp })

        request.onsuccess = () => {
            resolve(id)
        }

        request.onerror = () => {
            reject('Failed to add experience')
        }
    })
}

export const getAllExperiences = async (languageId?: string | null): Promise<DBExperience[]> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = () => {
            // Filtruj tylko experiences dla danego języka
            const allResults = request.result as StoredItem[]
            const experiences = allResults.filter((item): item is DBExperience => 
                item.type === 'experience' && 
                (item as DBExperience).languageId === languageId
            )
            resolve(experiences)
        }

        request.onerror = () => {
            reject('Failed to retrieve experiences')
        }
    })
}

export const deleteExperience = async (id: number): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.delete(id)

        request.onsuccess = () => {
            resolve()
        }

        request.onerror = () => {
            reject('Failed to delete experience')
        }
    })
}

export const updateExperience = async (id: number, experience: Omit<DBExperience, 'id' | 'createdAt' | 'type'>): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const getRequest = store.get(id)

        getRequest.onsuccess = () => {
            const existingExperience = getRequest.result
            if (existingExperience) {
                const updatedExperience = {
                    ...existingExperience,
                    ...experience,
                    id,
                    type: 'experience',
                    updatedAt: Date.now()
                }
                
                const putRequest = store.put(updatedExperience)
                
                putRequest.onsuccess = () => resolve()
                putRequest.onerror = () => reject('Failed to update experience')
            } else {
                reject('Experience not found')
            }
        }

        getRequest.onerror = () => {
            reject('Failed to retrieve experience for update')
        }
    })
}

export const getAllEducations = async (languageId?: string | null): Promise<DBEducation[]> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = () => {
            const allResults = request.result as StoredItem[]
            const educations = allResults.filter((item): item is DBEducation => 
                item.type === 'education' && 
                (item as DBEducation).languageId === languageId
            )
            resolve(educations)
        }

        request.onerror = () => {
            reject('Failed to retrieve educations')
        }
    })
}

export const addEducation = async (education: Omit<DBEducation, 'id' | 'createdAt' | 'type'>): Promise<number> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const timestamp = Date.now()
        const id = timestamp // Użyj timestamp jako ID
        const request = store.add({ ...education, id, type: 'education', createdAt: timestamp })

        request.onsuccess = () => {
            resolve(id)
        }

        request.onerror = () => {
            reject('Failed to add education')
        }
    })
}

export const updateEducation = async (id: number, education: Omit<DBEducation, 'id' | 'createdAt' | 'type'>): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const getRequest = store.get(id)

        getRequest.onsuccess = () => {
            const existingEducation = getRequest.result
            if (existingEducation) {
                const updatedEducation = {
                    ...existingEducation,
                    ...education,
                    id,
                    type: 'education',
                    updatedAt: Date.now()
                }
                
                const putRequest = store.put(updatedEducation)
                
                putRequest.onsuccess = () => resolve()
                putRequest.onerror = () => reject('Failed to update education')
            } else {
                reject('Education not found')
            }
        }

        getRequest.onerror = () => {
            reject('Failed to retrieve education for update')
        }
    })
}

export const deleteEducation = async (id: number): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.delete(id)

        request.onsuccess = () => {
            resolve()
        }

        request.onerror = () => {
            reject('Failed to delete education')
        }
    })
}

export const getAllCourses = async (languageId?: string | null): Promise<DBCourse[]> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = () => {
            const allResults = request.result as StoredItem[]
            const courses = allResults.filter((item): item is DBCourse => 
                item.type === 'course' && 
                (item as DBCourse).languageId === languageId
            )
            resolve(courses)
        }

        request.onerror = () => {
            reject('Failed to retrieve courses')
        }
    })
}

export const addCourse = async (course: Omit<DBCourse, 'id' | 'createdAt' | 'type'>): Promise<number> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const timestamp = Date.now()
        const id = timestamp
        const request = store.add({ ...course, id, type: 'course', createdAt: timestamp })

        request.onsuccess = () => {
            resolve(id)
        }

        request.onerror = () => {
            reject('Failed to add course')
        }
    })
}

export const updateCourse = async (id: number, course: Omit<DBCourse, 'id' | 'createdAt' | 'type'>): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const getRequest = store.get(id)

        getRequest.onsuccess = () => {
            const existingCourse = getRequest.result
            if (existingCourse) {
                const updatedCourse = {
                    ...existingCourse,
                    ...course,
                    id,
                    type: 'course',
                    updatedAt: Date.now()
                }
                
                const putRequest = store.put(updatedCourse)
                
                putRequest.onsuccess = () => resolve()
                putRequest.onerror = () => reject('Failed to update course')
            } else {
                reject('Course not found')
            }
        }

        getRequest.onerror = () => {
            reject('Failed to retrieve course for update')
        }
    })
}

export const deleteCourse = async (id: number): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.delete(id)

        request.onsuccess = () => {
            resolve()
        }

        request.onerror = () => {
            reject('Failed to delete course')
        }
    })
}

export const updateSkills = async (skills: { languageId?: string | null; skillsText: string }): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        
        const key = skills.languageId ? `skills_${skills.languageId}` : 'skills'
        const request = store.put({ id: key, ...skills, updatedAt: Date.now() })

        request.onsuccess = () => {
            resolve()
        }

        request.onerror = () => {
            reject('Failed to update skills')
        }
    })
}

export const getSkills = async (languageId?: string | null): Promise<{ languageId?: string | null; skillsText: string } | null> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        
        const key = languageId ? `skills_${languageId}` : 'skills'
        const request = store.get(key)

        request.onsuccess = () => {
            resolve(request.result || null)
        }

        request.onerror = () => {
            reject('Failed to retrieve skills')
        }
    })
}

export const updateFooter = async (footer: { languageId?: string | null; footerText: string }): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        
        const key = footer.languageId ? `footer_${footer.languageId}` : 'footer'
        const request = store.put({ id: key, ...footer, updatedAt: Date.now() })

        request.onsuccess = () => {
            resolve()
        }

        request.onerror = () => {
            reject('Failed to update footer')
        }
    })
}

export const getFooter = async (languageId?: string | null): Promise<{ languageId?: string | null; footerText: string } | null> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        
        const key = languageId ? `footer_${languageId}` : 'footer'
        const request = store.get(key)

        request.onsuccess = () => {
            resolve(request.result || null)
        }

        request.onerror = () => {
            reject('Failed to retrieve footer')
        }
    })
}

export const getAllApplications = async (): Promise<DBApplication[]> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = () => {
            const allResults = request.result as StoredItem[]
            const applications = allResults.filter((item): item is DBApplication => item.type === 'application')
            resolve(applications)
        }

        request.onerror = () => {
            reject('Failed to retrieve applications')
        }
    })
}

export const addApplication = async (application: Omit<DBApplication, 'id' | 'createdAt' | 'type'>): Promise<number> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const timestamp = Date.now()
        const id = timestamp // Użyj timestamp jako ID
        const request = store.add({ ...application, id, type: 'application', createdAt: timestamp })

        request.onsuccess = () => {
            resolve(id)
        }

        request.onerror = () => {
            reject('Failed to add application')
        }
    })
}

export const updateApplication = async (id: number, application: Omit<DBApplication, 'id' | 'createdAt' | 'type'>): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const getRequest = store.get(id)

        getRequest.onsuccess = () => {
            const existingApplication = getRequest.result
            if (existingApplication) {
                const updatedApplication = {
                    ...existingApplication,
                    ...application,
                    id,
                    type: 'application',
                    updatedAt: Date.now()
                }
                
                const putRequest = store.put(updatedApplication)
                
                putRequest.onsuccess = () => resolve()
                putRequest.onerror = () => reject('Failed to update application')
            } else {
                reject('Application not found')
            }
        }

        getRequest.onerror = () => {
            reject('Failed to retrieve application for update')
        }
    })
}

export const deleteApplication = async (id: number): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.delete(id)

        request.onsuccess = () => {
            resolve()
        }

        request.onerror = () => {
            reject('Failed to delete application')
        }
    })
}