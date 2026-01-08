import { useEffect, useState } from 'react'
import { initDB, STORE_NAME } from '@/lib/db'

/**
 * Hook do sprawdzania czy użytkownik zapisał jakiekolwiek dane w bazie danych
 * Sprawdza czy w IndexedDB istnieją jakiekolwiek wpisy oprócz ustawień
 * @param languageId - ID języka (nieużywany, ale zachowany dla kompatybilności)
 * @returns Object z informacją czy dane są puste i czy trwa sprawdzanie
 */
export function useCheckDBData(languageId: string | null) {
    const [isDataEmpty, setIsDataEmpty] = useState(true)
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const checkDataInDB = async () => {
            setIsChecking(true)
            try {
                const database = await initDB()
                const transaction = database.transaction([STORE_NAME], 'readonly')
                const store = transaction.objectStore(STORE_NAME)
                
                const request = store.getAllKeys()
                
                await new Promise((resolve, reject) => {
                    request.onsuccess = () => {
                        const keys = request.result as string[]
                        
                        const hasData = keys.some(key => key !== 'settings')
                        
                        setIsDataEmpty(!hasData)
                        resolve(undefined)
                    }
                    
                    request.onerror = () => {
                        reject('Failed to get keys from database')
                    }
                })
            } catch (error) {
                console.error('Error checking data in DB:', error)
                setIsDataEmpty(true)
            } finally {
                setIsChecking(false)
            }
        }

        checkDataInDB()
    }, [languageId])

    return { isDataEmpty, isChecking }
}
