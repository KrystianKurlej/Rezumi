import { initDB, STORE_NAME } from './base'

export const updatePersonalInfo = async (personalInfo: { languageId?: string | null; firstName: string; lastName: string; email: string; phone: string; aboutDescription?: string; photo?: string }): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        
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

export const getPersonalInfo = async (languageId?: string | null): Promise<{ languageId?: string | null; firstName: string; lastName: string; email: string; phone: string; aboutDescription?: string; photo?: string } | null> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        
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
