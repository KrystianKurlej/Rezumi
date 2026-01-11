import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { loadPersonalInfoFromDB } from '@/lib/slices/personalSlice'
import { loadExperiencesFromDB } from '@/lib/slices/experienceSlice'
import { loadEducationsFromDB } from '@/lib/slices/educationSlice'
import { loadSkillsFromDB } from '@/lib/slices/skillsSlice'
import { loadFooterFromDB } from '@/lib/slices/footerSlice'
import { loadLinksFromDB } from '@/lib/slices/linksSlice'
import { loadFreelanceFromDB } from '@/lib/slices/freelanceSlice'
import { loadCoursesFromDB } from '@/lib/slices/coursesSlice'

/**
 * Hook do automatycznego ładowania wszystkich danych CV przy zmianie języka
 */
export function useLoadCVData() {
    const dispatch = useAppDispatch()
    const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)

    useEffect(() => {
        // Załaduj wszystkie dane dla aktualnie wybranego języka
        dispatch(loadPersonalInfoFromDB())
        dispatch(loadExperiencesFromDB())
        dispatch(loadEducationsFromDB())
        dispatch(loadCoursesFromDB())
        dispatch(loadSkillsFromDB())
        dispatch(loadFreelanceFromDB())
        dispatch(loadFooterFromDB())
        dispatch(loadLinksFromDB())
    }, [selectedLanguage, dispatch])
}
