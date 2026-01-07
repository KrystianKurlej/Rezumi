import { initDB, STORE_NAME } from './base'
import type { DBSkill, StoredItem } from './types'

export const addSkill = async (skill: Omit<DBSkill, 'id' | 'createdAt' | 'type'>): Promise<number> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const timestamp = Date.now()
        const id = timestamp
        const request = store.add({ ...skill, id, type: 'skill', createdAt: timestamp })

        request.onsuccess = () => {
            resolve(id)
        }

        request.onerror = () => {
            reject('Failed to add skill')
        }
    })
}

export const getAllSkills = async (languageId?: string | null): Promise<DBSkill[]> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = () => {
            const allResults = request.result as StoredItem[]
            const skills = allResults.filter((item): item is DBSkill => 
                item.type === 'skill' && 
                (item as DBSkill).languageId === languageId
            )
            
            // Sortuj po order, jeśli nie ma order to używaj createdAt
            const sortedSkills = skills.sort((a, b) => {
                const orderA = a.order !== undefined ? a.order : a.createdAt;
                const orderB = b.order !== undefined ? b.order : b.createdAt;
                return orderA - orderB;
            })
            
            resolve(sortedSkills)
        }

        request.onerror = () => {
            reject('Failed to retrieve skills')
        }
    })
}

export const updateSkill = async (id: number, skill: Omit<DBSkill, 'id' | 'createdAt' | 'type'>): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const getRequest = store.get(id)

        getRequest.onsuccess = () => {
            const existingSkill = getRequest.result
            if (existingSkill) {
                const updatedSkill = {
                    ...existingSkill,
                    ...skill,
                    id,
                    type: 'skill',
                    updatedAt: Date.now()
                }
                const putRequest = store.put(updatedSkill)
                
                putRequest.onsuccess = () => {
                    resolve()
                }
                
                putRequest.onerror = () => {
                    reject('Failed to update skill')
                }
            } else {
                reject('Skill not found')
            }
        }

        getRequest.onerror = () => {
            reject('Failed to retrieve skill')
        }
    })
}

export const deleteSkill = async (id: number, languageId?: string | null): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.delete(id)

        request.onsuccess = () => {
            resolve()
        }

        request.onerror = () => {
            reject('Failed to delete skill')
        }
    })
}

export const updateSkillsOrder = async (skills: { id: number; order: number }[]): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        let completedUpdates = 0
        
        skills.forEach(({ id, order }) => {
            const getRequest = store.get(id)
            
            getRequest.onsuccess = () => {
                const existingSkill = getRequest.result
                if (existingSkill) {
                    const updatedSkill = {
                        ...existingSkill,
                        order,
                        updatedAt: Date.now()
                    }
                    const putRequest = store.put(updatedSkill)
                    
                    putRequest.onsuccess = () => {
                        completedUpdates++
                        if (completedUpdates === skills.length) {
                            resolve()
                        }
                    }
                    
                    putRequest.onerror = () => {
                        reject('Failed to update skill order')
                    }
                }
            }
            
            getRequest.onerror = () => {
                reject('Failed to retrieve skill')
            }
        })
    })
}

export const getDismissedSkillHints = async (languageId: string): Promise<number[]> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const key = `dismissedSkillHints_${languageId}`
        const request = store.get(key)

        request.onsuccess = () => {
            const result = request.result
            resolve(result?.dismissedIds || [])
        }

        request.onerror = () => {
            reject('Failed to retrieve dismissed skill hints')
        }
    })
}

export const dismissSkillHint = async (languageId: string, skillId: number): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const key = `dismissedSkillHints_${languageId}`
        
        const getRequest = store.get(key)

        getRequest.onsuccess = () => {
            const existingData = getRequest.result
            const dismissedIds = existingData?.dismissedIds || []
            
            if (!dismissedIds.includes(skillId)) {
                dismissedIds.push(skillId)
            }
            
            const putRequest = store.put({
                id: key,
                dismissedIds,
                updatedAt: Date.now()
            })

            putRequest.onsuccess = () => resolve()
            putRequest.onerror = () => reject('Failed to dismiss skill hint')
        }

        getRequest.onerror = () => {
            reject('Failed to retrieve dismissed skill hints for update')
        }
    })
}

export const removeSkillFromAllDismissed = async (skillId: number): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const getAllRequest = store.getAll()

        getAllRequest.onsuccess = () => {
            const allItems = getAllRequest.result
            const dismissedHintItems = allItems.filter(item => 
                typeof item.id === 'string' && 
                item.id.startsWith('dismissedSkillHints_')
            )

            if (dismissedHintItems.length === 0) {
                resolve()
                return
            }

            let completed = 0
            let hasError = false

            dismissedHintItems.forEach(item => {
                if (item.dismissedIds && Array.isArray(item.dismissedIds)) {
                    const updatedIds = item.dismissedIds.filter((id: number) => id !== skillId)
                    
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
            reject('Failed to retrieve all items')
        }
    })
}
