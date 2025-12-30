import { initDB, STORE_NAME } from './base'

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
