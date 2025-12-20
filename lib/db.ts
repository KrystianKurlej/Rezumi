export interface DBExperience {
    id?: number
    title: string
    company: string
    startDate: string
    endDate: string
    description: string
    createdAt: number
}

const DB_NAME = 'cv-maker'
const DB_VERSION = 1
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

export const addExperience = async (experience: Omit<DBExperience, 'id' | 'createdAt'>): Promise<number> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const timestamp = Date.now()
        const request = store.add({ ...experience, createdAt: timestamp })

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
            resolve(request.result as DBExperience[])
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

export const updateExperience = async (id: number, experience: Omit<DBExperience, 'id' | 'createdAt'>): Promise<void> => {
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