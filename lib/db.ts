export interface DBPersonalInfo {
    firstName: string
    lastName: string
    email: string
    phone: string
}

export interface DBExperience {
    id?: number
    type: 'experience'
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
    degree: string
    institution: string
    fieldOfStudy: string
    startDate: string
    endDate: string
    description: string
    isOngoing: boolean
    createdAt: number
}

const DB_NAME = 'cv-maker'
const DB_VERSION = 3
const STORE_NAME = 'cvm'

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
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                const store = database.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
                store.createIndex('updatedAt', 'updatedAt', { unique: false })
            }
        }
    })
}

export const updatePersonalInfo = async (personalInfo: DBPersonalInfo): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.put({ id: 'personalInfo', ...personalInfo, updatedAt: Date.now() })

        request.onsuccess = () => {
            resolve()
        }

        request.onerror = () => {
            reject('Failed to update personal information')
        }
    })
}

export const getPersonalInfo = async (): Promise<DBPersonalInfo | null> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.get('personalInfo')

        request.onsuccess = () => {
            resolve(request.result as DBPersonalInfo || null)
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
        const request = store.add({ ...experience, type: 'experience', createdAt: timestamp })

        request.onsuccess = () => {
            resolve(request.result as number)
        }

        request.onerror = () => {
            reject('Failed to add experience')
        }
    })
}

export const getAllExperiences = async (): Promise<DBExperience[]> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = () => {
            // Filtruj tylko experiences
            const allResults = request.result
            const experiences = allResults.filter((item: DBExperience | DBEducation | (DBPersonalInfo & { id: string })) => item.type === 'experience')
            resolve(experiences as DBExperience[])
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

export const getAllEducations = async (): Promise<DBEducation[]> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = () => {
            const allResults = request.result
            const educations = allResults.filter((item: DBExperience | DBEducation | (DBPersonalInfo & { id: string })) => item.type === 'education')
            resolve(educations as DBEducation[])
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
        const request = store.add({ ...education, type: 'education', createdAt: timestamp })

        request.onsuccess = () => {
            resolve(request.result as number)
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