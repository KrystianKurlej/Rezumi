import { initDB, STORE_NAME } from './base'
import { PersonalInfo } from '@/lib/db/types'

export const updatePersonalInfo = async (personalInfo: PersonalInfo): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        
        const key = personalInfo.languageId ? `personalInfo_${personalInfo.languageId}` : 'personalInfo'
        
        // If saving to non-default language, remove photo field as it's stored only in default language
        const dataToSave = personalInfo.languageId 
            ? { id: key, ...personalInfo, photo: undefined, updatedAt: Date.now() }
            : { id: key, ...personalInfo, updatedAt: Date.now() }
        
        const request = store.put(dataToSave)

        request.onsuccess = () => {
            resolve()
        }

        request.onerror = () => {
            reject('Failed to update personal information')
        }
    })
}

export const getPersonalInfo = async (languageId?: string | null): Promise<PersonalInfo | null> => {
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
