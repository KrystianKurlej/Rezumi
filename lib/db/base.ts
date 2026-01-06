import type { StoredItem } from './types'

export const DB_NAME = 'rezumiDB'
export const DB_VERSION = 5
export const STORE_NAME = 'rezumiStore'

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
            const oldVersion = event.oldVersion
            
            // Dla nowej instalacji
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' })
                store.createIndex('updatedAt', 'updatedAt', { unique: false })
            }
        }
    })
}

export const exportDB = async (): Promise<string> => {
    const database = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()
        request.onsuccess = () => {
            const allData = request.result
            const jsonData = JSON.stringify(allData)
            resolve(jsonData)
        }
        request.onerror = () => {
            reject('Failed to export database')
        }
    })
}

export const importDB = async (jsonData: string): Promise<void> => {
    const database = await initDB()
    let parsed = JSON.parse(jsonData)
    
    if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed)
    }
    
    const data: StoredItem[] = Array.isArray(parsed) ? parsed : []
    
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        
        const clearRequest = store.clear()
        
        clearRequest.onsuccess = () => {
            let completed = 0
            
            if (data.length === 0) {
                resolve()
                return
            }
            
            data.forEach(item => {
                const request = store.put(item)
                request.onsuccess = () => {
                    completed++
                    if (completed === data.length) {
                        resolve()
                    }
                }
                request.onerror = () => {
                    reject('Failed to import database')
                }
            })
        }
        
        clearRequest.onerror = () => {
            reject('Failed to clear database before import')
        }
    })
}
