import { initDB, STORE_NAME } from './base'
import type { DBExperience, StoredItem } from './types'

const sortExperiencesByStartDate = async (languageId: string | null): Promise<void> => {
    const experiences = await getAllExperiences(languageId)
    
    const sortedExperiences = experiences.sort((a, b) => {
        const dateA = new Date(a.startDate).getTime()
        const dateB = new Date(b.startDate).getTime()
        return dateB - dateA
    })

    const database = await initDB()
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    for (let i = 0; i < sortedExperiences.length; i++) {
        const experience = sortedExperiences[i]
        const updatedExperience = {
            ...experience,
            sortOrder: i,
            updatedAt: Date.now()
        }
        store.put(updatedExperience)
    }

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject('Failed to sort experiences')
    })
}

export const addExperience = async (experience: Omit<DBExperience, 'id' | 'createdAt' | 'type'>): Promise<number> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const timestamp = Date.now()
        const id = timestamp
        const request = store.add({ ...experience, id, type: 'experience', createdAt: timestamp })

        request.onsuccess = async () => {
            try {
                await sortExperiencesByStartDate(experience.languageId ?? null)
                resolve(id)
            } catch (error) {
                reject('Failed to sort experiences after adding')
            }
        }

        request.onerror = () => {
            reject('Failed to add experience')
        }
    })
}

export const getAllExperiences = async (languageId?: string | null): Promise<DBExperience[]> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = () => {
            const allResults = request.result as StoredItem[]
            const experiences = allResults.filter((item): item is DBExperience => 
                item.type === 'experience' && 
                (item as DBExperience).languageId === languageId
            )
            
            const sortedExperiences = experiences.sort((a, b) => {
                const dateA = new Date(a.startDate).getTime()
                const dateB = new Date(b.startDate).getTime()
                return dateB - dateA
            })
            
            resolve(sortedExperiences)
        }

        request.onerror = () => {
            reject('Failed to retrieve experiences')
        }
    })
}

export const updateExperience = async (id: number, experience: Omit<DBExperience, 'id' | 'createdAt' | 'type'>): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const getRequest = store.get(id)

        getRequest.onsuccess = () => {
            const existingExperience = getRequest.result
            if (existingExperience) {
                const updatedExperience = {
                    ...existingExperience,
                    ...experience,
                    id,
                    type: 'experience',
                    updatedAt: Date.now()
                }
                
                const putRequest = store.put(updatedExperience)
                
                putRequest.onsuccess = async () => {
                    try {
                        await sortExperiencesByStartDate(experience.languageId ?? null)
                        resolve()
                    } catch (error) {
                        reject('Failed to sort experiences after updating')
                    }
                }
                putRequest.onerror = () => reject('Failed to update experience')
            } else {
                reject('Experience not found')
            }
        }

        getRequest.onerror = () => {
            reject('Failed to retrieve experience for update')
        }
    })
}

export const deleteExperience = async (id: number, languageId?: string | null): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.delete(id)

        request.onsuccess = async () => {
            try {
                if (languageId !== undefined) {
                    await sortExperiencesByStartDate(languageId)
                }
                resolve()
            } catch (error) {
                reject('Failed to sort experiences after deleting')
            }
        }

        request.onerror = () => {
            reject('Failed to delete experience')
        }
    })
}

export const getDismissedExperienceHints = async (languageId: string): Promise<number[]> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        
        const key = `dismissedExperienceHints_${languageId}`
        const request = store.get(key)

        request.onsuccess = () => {
            const result = request.result
            resolve(result?.dismissedIds || [])
        }

        request.onerror = () => {
            reject('Failed to retrieve dismissed experience hints')
        }
    })
}

export const dismissExperienceHint = async (languageId: string, experienceId: number): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const key = `dismissedExperienceHints_${languageId}`
        
        const getRequest = store.get(key)

        getRequest.onsuccess = () => {
            const existingData = getRequest.result
            const dismissedIds = existingData?.dismissedIds || []
            
            if (!dismissedIds.includes(experienceId)) {
                dismissedIds.push(experienceId)
            }
            
            const putRequest = store.put({
                id: key,
                dismissedIds,
                updatedAt: Date.now()
            })

            putRequest.onsuccess = () => resolve()
            putRequest.onerror = () => reject('Failed to dismiss experience hint')
        }

        getRequest.onerror = () => {
            reject('Failed to retrieve dismissed experience hints for update')
        }
    })
}

export const removeExperienceFromAllDismissed = async (experienceId: number): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const getAllRequest = store.getAll()

        getAllRequest.onsuccess = () => {
            const allItems = getAllRequest.result
            const dismissedHintItems = allItems.filter(item => 
                typeof item.id === 'string' && 
                item.id.startsWith('dismissedExperienceHints_')
            )

            if (dismissedHintItems.length === 0) {
                resolve()
                return
            }

            let completed = 0
            let hasError = false

            dismissedHintItems.forEach(item => {
                if (item.dismissedIds && Array.isArray(item.dismissedIds)) {
                    const updatedIds = item.dismissedIds.filter((id: number) => id !== experienceId)
                    
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
