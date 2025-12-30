import { initDB, STORE_NAME } from './base'
import type { DBApplication, StoredItem } from './types'

export const addApplication = async (application: Omit<DBApplication, 'id' | 'createdAt' | 'type'>): Promise<number> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const timestamp = Date.now()
        const id = timestamp
        const request = store.add({ ...application, id, type: 'application', createdAt: timestamp })

        request.onsuccess = () => {
            resolve(id)
        }

        request.onerror = () => {
            reject('Failed to add application')
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
