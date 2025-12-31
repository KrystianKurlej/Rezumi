import { initDB, STORE_NAME } from './base'

export const updateFreelance = async (freelance: { languageId?: string | null; freelanceText: string }): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        
        const key = freelance.languageId ? `freelance_${freelance.languageId}` : 'freelance'
        const request = store.put({ id: key, ...freelance, updatedAt: Date.now() })

        request.onsuccess = () => {
            resolve()
        }

        request.onerror = () => {
            reject('Failed to update freelance')
        }
    })
}

export const getFreelance = async (languageId?: string | null): Promise<{ languageId?: string | null; freelanceText: string } | null> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        
        const key = languageId ? `freelance_${languageId}` : 'freelance'
        const request = store.get(key)

        request.onsuccess = () => {
            resolve(request.result || null)
        }

        request.onerror = () => {
            reject('Failed to retrieve freelance')
        }
    })
}
