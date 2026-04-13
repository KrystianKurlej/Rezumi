import { initDB, STORE_NAME } from './base'
import type { DBAdditionalActivity, StoredItem } from './types'

const sortAdditionalActivitiesByDate = async (languageId: string | null): Promise<void> => {
    const additionalActivities = await getAllAdditionalActivities(languageId)
    
    const sortedAdditionalActivities = additionalActivities.sort((a, b) => {
        if (a.isOngoing && !b.isOngoing) return -1
        if (!a.isOngoing && b.isOngoing) return 1
        
        if (a.isOngoing && b.isOngoing) {
            const dateA = new Date(a.startDate).getTime()
            const dateB = new Date(b.startDate).getTime()
            return dateB - dateA
        }
        
        const endDateA = new Date(a.endDate).getTime()
        const endDateB = new Date(b.endDate).getTime()
        return endDateB - endDateA
    })

    const database = await initDB()
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    for (let i = 0; i < sortedAdditionalActivities.length; i++) {
        const additionalActivity = sortedAdditionalActivities[i]
        const updatedAdditionalActivity = {
            ...additionalActivity,
            sortOrder: i,
            updatedAt: Date.now()
        }
        store.put(updatedAdditionalActivity)
    }

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject('Failed to sort additionalActivities')
    })
}

export const addAdditionalActivity = async (additionalActivity: Omit<DBAdditionalActivity, 'id' | 'createdAt' | 'type'>): Promise<number> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const timestamp = Date.now()
        const id = timestamp
        const request = store.add({ ...additionalActivity, id, type: 'additionalActivity', createdAt: timestamp })

        request.onsuccess = async () => {
            try {
                await sortAdditionalActivitiesByDate(additionalActivity.languageId ?? null)
                resolve(id)
            } catch (error) {
                reject('Failed to sort additionalActivities after adding')
            }
        }

        request.onerror = () => {
            reject('Failed to add additionalActivity')
        }
    })
}

export const getAllAdditionalActivities = async (languageId?: string | null): Promise<DBAdditionalActivity[]> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = () => {
            const allResults = request.result as StoredItem[]
            const additionalActivities = allResults.filter((item): item is DBAdditionalActivity => 
                item.type === 'additionalActivity' && 
                (item as DBAdditionalActivity).languageId === languageId
            )
            
            const sortedAdditionalActivities = additionalActivities.sort((a, b) => {
                // Doświadczenia trwające na początku
                if (a.isOngoing && !b.isOngoing) return -1
                if (!a.isOngoing && b.isOngoing) return 1
                
                // Oba trwające - sortuj od najnowszej daty rozpoczęcia
                if (a.isOngoing && b.isOngoing) {
                    const dateA = new Date(a.startDate).getTime()
                    const dateB = new Date(b.startDate).getTime()
                    return dateB - dateA
                }
                
                // Oba zakończone - sortuj od najnowszej daty zakończenia
                const endDateA = new Date(a.endDate).getTime()
                const endDateB = new Date(b.endDate).getTime()
                return endDateB - endDateA
            })
            
            resolve(sortedAdditionalActivities)
        }

        request.onerror = () => {
            reject('Failed to retrieve additionalActivities')
        }
    })
}

export const updateAdditionalActivity = async (id: number, additionalActivity: Omit<DBAdditionalActivity, 'id' | 'createdAt' | 'type'>): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const getRequest = store.get(id)

        getRequest.onsuccess = () => {
            const existingAdditionalActivity = getRequest.result
            if (existingAdditionalActivity) {
                const updatedAdditionalActivity = {
                    ...existingAdditionalActivity,
                    ...additionalActivity,
                    id,
                    type: 'additionalActivity',
                    updatedAt: Date.now()
                }
                
                const putRequest = store.put(updatedAdditionalActivity)
                
                putRequest.onsuccess = async () => {
                    try {
                        await sortAdditionalActivitiesByDate(additionalActivity.languageId ?? null)
                        resolve()
                    } catch (error) {
                        reject('Failed to sort additionalActivities after updating')
                    }
                }
                putRequest.onerror = () => reject('Failed to update additionalActivity')
            } else {
                reject('AdditionalActivity not found')
            }
        }

        getRequest.onerror = () => {
            reject('Failed to retrieve additionalActivity for update')
        }
    })
}

export const deleteAdditionalActivity = async (id: number, languageId?: string | null): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.delete(id)

        request.onsuccess = async () => {
            try {
                if (languageId !== undefined) {
                    await sortAdditionalActivitiesByDate(languageId)
                }
                resolve()
            } catch (error) {
                reject('Failed to sort additionalActivities after deleting')
            }
        }

        request.onerror = () => {
            reject('Failed to delete additionalActivity')
        }
    })
}

export const getDismissedAdditionalActivityHints = async (languageId: string): Promise<number[]> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        
        const key = `dismissedAdditionalActivityHints_${languageId}`
        const request = store.get(key)

        request.onsuccess = () => {
            const result = request.result
            resolve(result?.dismissedIds || [])
        }

        request.onerror = () => {
            reject('Failed to retrieve dismissed additionalActivity hints')
        }
    })
}

export const dismissAdditionalActivityHint = async (languageId: string, additionalActivityId: number): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const key = `dismissedAdditionalActivityHints_${languageId}`
        
        const getRequest = store.get(key)

        getRequest.onsuccess = () => {
            const existingData = getRequest.result
            const dismissedIds = existingData?.dismissedIds || []
            
            if (!dismissedIds.includes(additionalActivityId)) {
                dismissedIds.push(additionalActivityId)
            }
            
            const putRequest = store.put({
                id: key,
                dismissedIds,
                updatedAt: Date.now()
            })

            putRequest.onsuccess = () => resolve()
            putRequest.onerror = () => reject('Failed to dismiss additionalActivity hint')
        }

        getRequest.onerror = () => {
            reject('Failed to retrieve dismissed additionalActivity hints for update')
        }
    })
}

export const removeAdditionalActivityFromAllDismissed = async (additionalActivityId: number): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const getAllRequest = store.getAll()

        getAllRequest.onsuccess = () => {
            const allItems = getAllRequest.result
            const dismissedHintItems = allItems.filter(item => 
                typeof item.id === 'string' && 
                item.id.startsWith('dismissedAdditionalActivityHints_')
            )

            if (dismissedHintItems.length === 0) {
                resolve()
                return
            }

            let completed = 0
            let hasError = false

            dismissedHintItems.forEach(item => {
                if (item.dismissedIds && Array.isArray(item.dismissedIds)) {
                    const updatedIds = item.dismissedIds.filter((id: number) => id !== additionalActivityId)
                    
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
