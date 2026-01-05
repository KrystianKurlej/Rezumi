import { initDB, STORE_NAME } from './base'
import type { DBCourse, StoredItem } from './types'

const sortCoursesByCompletionDate = async (languageId: string | null): Promise<void> => {
    const courses = await getAllCourses(languageId)
    
    const sortedCourses = courses.sort((a, b) => {
        const dateA = new Date(a.completionDate).getTime()
        const dateB = new Date(b.completionDate).getTime()
        return dateB - dateA
    })

    const database = await initDB()
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    for (let i = 0; i < sortedCourses.length; i++) {
        const course = sortedCourses[i]
        const updatedCourse = {
            ...course,
            sortOrder: i,
            updatedAt: Date.now()
        }
        store.put(updatedCourse)
    }

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject('Failed to sort courses')
    })
}

export const addCourse = async (course: Omit<DBCourse, 'id' | 'createdAt' | 'type'>): Promise<number> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const timestamp = Date.now()
        const id = timestamp
        const request = store.add({ ...course, id, type: 'course', createdAt: timestamp })

        request.onsuccess = async () => {
            try {
                await sortCoursesByCompletionDate(course.languageId ?? null)
                resolve(id)
            } catch (error) {
                reject('Failed to sort courses after adding')
            }
        }

        request.onerror = () => {
            reject('Failed to add course')
        }
    })
}

export const getAllCourses = async (languageId?: string | null): Promise<DBCourse[]> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = () => {
            const allResults = request.result as StoredItem[]
            const courses = allResults.filter((item): item is DBCourse => 
                item.type === 'course' && 
                (item as DBCourse).languageId === languageId
            )
            
            const sortedCourses = courses.sort((a, b) => {
                const dateA = new Date(a.completionDate).getTime()
                const dateB = new Date(b.completionDate).getTime()
                return dateB - dateA
            })
            
            resolve(sortedCourses)
        }

        request.onerror = () => {
            reject('Failed to retrieve courses')
        }
    })
}

export const updateCourse = async (id: number, course: Omit<DBCourse, 'id' | 'createdAt' | 'type'>): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const getRequest = store.get(id)

        getRequest.onsuccess = () => {
            const existingCourse = getRequest.result
            if (existingCourse) {
                const updatedCourse = {
                    ...existingCourse,
                    ...course,
                    id,
                    type: 'course',
                    updatedAt: Date.now()
                }
                
                const putRequest = store.put(updatedCourse)
                
                putRequest.onsuccess = async () => {
                    try {
                        await sortCoursesByCompletionDate(course.languageId ?? null)
                        resolve()
                    } catch (error) {
                        reject('Failed to sort courses after updating')
                    }
                }
                putRequest.onerror = () => reject('Failed to update course')
            } else {
                reject('Course not found')
            }
        }

        getRequest.onerror = () => {
            reject('Failed to retrieve course for update')
        }
    })
}

export const deleteCourse = async (id: number, languageId?: string | null): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.delete(id)

        request.onsuccess = async () => {
            try {
                if (languageId !== undefined) {
                    await sortCoursesByCompletionDate(languageId)
                }
                resolve()
            } catch (error) {
                reject('Failed to sort courses after deleting')
            }
        }

        request.onerror = () => {
            reject('Failed to delete course')
        }
    })
}

export const getDismissedCourseHints = async (languageId: string): Promise<number[]> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        
        const key = `dismissedCourseHints_${languageId}`
        const request = store.get(key)

        request.onsuccess = () => {
            const result = request.result
            resolve(result?.dismissedIds || [])
        }

        request.onerror = () => {
            reject('Failed to retrieve dismissed course hints')
        }
    })
}

export const dismissCourseHint = async (languageId: string, courseId: number): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const key = `dismissedCourseHints_${languageId}`
        
        const getRequest = store.get(key)

        getRequest.onsuccess = () => {
            const existingData = getRequest.result
            const dismissedIds = existingData?.dismissedIds || []
            
            if (!dismissedIds.includes(courseId)) {
                dismissedIds.push(courseId)
            }
            
            const putRequest = store.put({
                id: key,
                dismissedIds,
                updatedAt: Date.now()
            })

            putRequest.onsuccess = () => resolve()
            putRequest.onerror = () => reject('Failed to dismiss course hint')
        }

        getRequest.onerror = () => {
            reject('Failed to retrieve dismissed course hints for update')
        }
    })
}

export const removeCourseFromAllDismissed = async (courseId: number): Promise<void> => {
    const database = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const getAllRequest = store.getAll()

        getAllRequest.onsuccess = () => {
            const allItems = getAllRequest.result
            const dismissedHintItems = allItems.filter(item => 
                typeof item.id === 'string' && 
                item.id.startsWith('dismissedCourseHints_')
            )

            if (dismissedHintItems.length === 0) {
                resolve()
                return
            }

            let completed = 0
            let hasError = false

            dismissedHintItems.forEach(item => {
                if (item.dismissedIds && Array.isArray(item.dismissedIds)) {
                    const updatedIds = item.dismissedIds.filter((id: number) => id !== courseId)
                    
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
