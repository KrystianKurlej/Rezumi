'use client'

import { useRef, useLayoutEffect, useState, useEffect } from "react"
import { Provider } from "react-redux"
import { makeStore, AppStore } from "@/lib/store"
import { loadSettingsFromDB } from "@/lib/slices/settingsSlice"
import { loadPersonalInfoFromDB } from "@/lib/slices/personalSlice"
import { loadExperiencesFromDB } from "@/lib/slices/experienceSlice"
import { loadEducationsFromDB } from "@/lib/slices/educationSlice"
import { loadSkillsFromDB } from "@/lib/slices/skillsSlice"
import { loadFooterFromDB } from "@/lib/slices/footerSlice"
import { getSettings } from "@/lib/db"
import Intro from "@/components/pages/Intro"
import { useTheme } from "next-themes"

function StoreContent({ 
    children, 
    showIntro,
    onIntroComplete 
}: { 
    children: React.ReactNode
    showIntro: boolean
    onIntroComplete: () => void
}) {
    const { setTheme } = useTheme()

    useEffect(() => {
        const loadTheme = async () => {
            const settings = await getSettings()
            if (settings?.theme) {
                setTheme(settings.theme)
            }
        }
        loadTheme()
    }, [setTheme])

    return <>{showIntro ? <Intro onComplete={onIntroComplete} /> : children}</>
}

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const storeRef = useRef<AppStore | null>(null)
    const [store, setStore] = useState<AppStore | null>(null)
    const [showIntro, setShowIntro] = useState<boolean | null>(null)
    
    useLayoutEffect(() => {
        if (storeRef.current === null) {
            storeRef.current = makeStore()
            // Ładuj wszystkie dane z DB przy starcie aplikacji
            storeRef.current.dispatch(loadSettingsFromDB())
            storeRef.current.dispatch(loadPersonalInfoFromDB())
            storeRef.current.dispatch(loadExperiencesFromDB())
            storeRef.current.dispatch(loadEducationsFromDB())
            storeRef.current.dispatch(loadSkillsFromDB())
            storeRef.current.dispatch(loadFooterFromDB())
        }
        setStore(storeRef.current)
    }, [])

    useEffect(() => {
        const checkSettings = async () => {
            const settings = await getSettings()
            setShowIntro(!settings)
        }
        checkSettings()
    }, [])

    if (!store || showIntro === null) {
        return null // Loading state
    }

    return (
        <Provider store={store}>
            <StoreContent showIntro={showIntro} onIntroComplete={() => setShowIntro(false)}>
                {children}
            </StoreContent>
        </Provider>
    )
}