import { initDB, STORE_NAME } from './base'
import type { DBEducation, StoredItem } from './types'

export const addEducation = async (education: Omit<DBEducation, 'id' | 'createdAt' | 'type'>): Promise<number> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const timestamp = Date.now()
        const id = timestamp
        const request = store.add({ ...education, id, type: 'education', createdAt: timestamp })

        request.onsuccess = () => {
            resolve(id)
        }

        request.onerror = () => {
            reject('Failed to add education')
        }
    })
}

export const getAllEducations = async (languageId?: string | null): Promise<DBEducation[]> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = () => {
            const allResults = request.result as StoredItem[]
            const educations = allResults.filter((item): item is DBEducation => 
                item.type === 'education' && 
                (item as DBEducation).languageId === languageId
            )
            resolve(educations)
        }

        request.onerror = () => {
            reject('Failed to retrieve educations')
        }
    })
}

export const updateEducation = async (id: number, education: Omit<DBEducation, 'id' | 'createdAt' | 'type'>): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const getRequest = store.get(id)

        getRequest.onsuccess = () => {
            const existingEducation = getRequest.result
            if (existingEducation) {
                const updatedEducation = {
                    ...existingEducation,
                    ...education,
                    id,
                    type: 'education',
                    updatedAt: Date.now()
                }
                
                const putRequest = store.put(updatedEducation)
                
                putRequest.onsuccess = () => resolve()
                putRequest.onerror = () => reject('Failed to update education')
            } else {
                reject('Education not found')
            }
        }

        getRequest.onerror = () => {
            reject('Failed to retrieve education for update')
        }
    })
}

export const deleteEducation = async (id: number): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.delete(id)

        request.onsuccess = () => {
            resolve()
        }

        request.onerror = () => {
            reject('Failed to delete education')
        }
    })
}

export const getDismissedEducationHints = async (languageId: string): Promise<number[]> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        
        const key = `dismissedEducationHints_${languageId}`
        const request = store.get(key)

        request.onsuccess = () => {
            const result = request.result
            resolve(result?.dismissedIds || [])
        }

        request.onerror = () => {
            reject('Failed to retrieve dismissed education hints')
        }
    })
}

export const dismissEducationHint = async (languageId: string, educationId: number): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const key = `dismissedEducationHints_${languageId}`
        
        const getRequest = store.get(key)

        getRequest.onsuccess = () => {
            const existingData = getRequest.result
            const dismissedIds = existingData?.dismissedIds || []
            
            if (!dismissedIds.includes(educationId)) {
                dismissedIds.push(educationId)
            }
            
            const putRequest = store.put({
                id: key,
                dismissedIds,
                updatedAt: Date.now()
            })

            putRequest.onsuccess = () => resolve()
            putRequest.onerror = () => reject('Failed to dismiss education hint')
        }

        getRequest.onerror = () => {
            reject('Failed to retrieve dismissed education hints for update')
        }
    })
}

export const removeEducationFromAllDismissed = async (educationId: number): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const getAllRequest = store.getAll()

        getAllRequest.onsuccess = () => {
            const allItems = getAllRequest.result
            const dismissedHintItems = allItems.filter(item => 
                typeof item.id === 'string' && 
                item.id.startsWith('dismissedEducationHints_')
            )

            if (dismissedHintItems.length === 0) {
                resolve()
                return
            }

            let completed = 0
            let hasError = false

            dismissedHintItems.forEach(item => {
                if (item.dismissedIds && Array.isArray(item.dismissedIds)) {
                    const updatedIds = item.dismissedIds.filter((id: number) => id !== educationId)
                    
                    if (updatedIds.length !== item.dismissedIds.length) {
                        const updateRequest = store.put({
                            ...item,
                            dismissedIds: updatedIds,
                            updatedAt: Date.now()
                        })

                        updateRequest.onsuccess = () => {
                            completed++
                            if (completed === dismissedHintItems.length && !hasError) {
                                resolve()
                            }
                        }

                        updateRequest.onerror = () => {
                            if (!hasError) {
                                hasError = true
                                reject('Failed to update dismissed hints')
                            }
                        }
                    } else {
                        completed++
                        if (completed === dismissedHintItems.length && !hasError) {
                            resolve()
                        }
                    }
                } else {
                    completed++
                    if (completed === dismissedHintItems.length && !hasError) {
                        resolve()
                    }
                }
            })
        }

        getAllRequest.onerror = () => {
            reject('Failed to retrieve dismissed hints')
        }
    })
}
