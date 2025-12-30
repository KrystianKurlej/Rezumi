import { initDB, STORE_NAME } from './base'
import { DBTemplates } from './types'

export const createTemplate = async (template: { name: string; description: string; designId: string; }): Promise<number> => {
    const database = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)

        const timestamp = Date.now()
        const id = timestamp

        const newTemplate = {
            ...template,
            id,
            type: 'design',
            createdAt: timestamp,
        }

        const request = store.add(newTemplate)

        request.onsuccess = () => {
            resolve(id)
        }

        request.onerror = () => {
            reject('Failed to create template')
        }
    })
}

export const deleteTemplate = async (templateId: number): Promise<void> => {
    const database = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)

        const request = store.delete(templateId)

        request.onsuccess = () => {
            resolve()
        }

        request.onerror = () => {
            reject('Failed to delete template')
        }
    })
}

export const getAllTemplates = async (): Promise<DBTemplates[]> => {
    const database = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)

        const request = store.getAll()

        request.onsuccess = () => {
            const templates = request.result.filter(item => item.type === 'design') as DBTemplates[]
            resolve(templates)
        }

        request.onerror = () => {
            reject('Failed to retrieve templates')
        }
    })
}