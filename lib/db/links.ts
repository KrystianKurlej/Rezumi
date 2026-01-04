import { initDB, STORE_NAME } from './base'
import { Links } from './types';

export const updateLinks = async (links: Links): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        
        const key = links.languageId ? `links_${links.languageId}` : 'links'
        const request = store.put({ id: key, ...links, updatedAt: Date.now() })

        request.onsuccess = () => {
            resolve()
        }

        request.onerror = () => {
            reject('Failed to update links')
        }
    })
}

export const getLinks = async (languageId?: string | null): Promise<Links | null> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        
        const key = languageId ? `links_${languageId}` : 'links'
        const request = store.get(key)

        request.onsuccess = () => {
            resolve(request.result || null)
        }

        request.onerror = () => {
            reject('Failed to retrieve links')
        }
    })
}