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

export const deleteSkill = async (id: number): Promise<void> => {
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
