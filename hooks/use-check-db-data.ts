import { useEffect, useState } from 'react'
import { 
    getPersonalInfo, 
    getAllExperiences, 
    getAllEducations, 
    getAllCourses, 
    getAllSkills, 
    getFooter, 
    getLinks 
} from '@/lib/db'

/**
 * Hook do sprawdzania czy użytkownik zapisał jakiekolwiek dane w bazie danych
 * @param languageId - ID języka dla którego sprawdzamy dane
 * @returns Object z informacją czy dane są puste i czy trwa sprawdzanie
 */
export function useCheckDBData(languageId: string | null) {
    const [isDataEmpty, setIsDataEmpty] = useState(true)
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const checkDataInDB = async () => {
            setIsChecking(true)
            try {
                const [
                    dbPersonal,
                    dbExperiences,
                    dbEducations,
                    dbCourses,
                    dbSkills,
                    dbFooter,
                    dbLinks
                ] = await Promise.all([
                    getPersonalInfo(languageId),
                    getAllExperiences(languageId),
                    getAllEducations(languageId),
                    getAllCourses(languageId),
                    getAllSkills(languageId),
                    getFooter(languageId),
                    getLinks(languageId)
                ])

                // Sprawdź czy użytkownik zapisał jakiekolwiek dane w bazie
                const hasPersonal = dbPersonal !== null
                const hasExperiences = dbExperiences && dbExperiences.length > 0
                const hasEducations = dbEducations && dbEducations.length > 0
                const hasCourses = dbCourses && dbCourses.length > 0
                const hasSkills = dbSkills && dbSkills.length > 0
                const hasFooter = dbFooter !== null
                const hasLinks = dbLinks && Object.keys(dbLinks).length > 0

                // Dane są puste jeśli nic nie zostało zapisane
                const isEmpty = !hasPersonal && !hasExperiences && !hasEducations && 
                                !hasCourses && !hasSkills && !hasFooter && !hasLinks
                
                setIsDataEmpty(isEmpty)
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
