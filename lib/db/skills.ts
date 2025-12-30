import { initDB, STORE_NAME } from './base'

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
