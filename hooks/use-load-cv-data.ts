import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { loadPersonalInfoFromDB } from '@/lib/slices/personalSlice'
import { loadExperiencesFromDB } from '@/lib/slices/experienceSlice'
import { loadEducationsFromDB } from '@/lib/slices/educationSlice'
import { loadSkillsFromDB } from '@/lib/slices/skillsSlice'
import { loadFooterFromDB } from '@/lib/slices/footerSlice'

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
        dispatch(loadSkillsFromDB())
        dispatch(loadFooterFromDB())
    }, [selectedLanguage, dispatch])
}
