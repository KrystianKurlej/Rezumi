'use client'

import { useRef, useLayoutEffect, useState } from "react"
import { Provider } from "react-redux"
import { makeStore, AppStore } from "@/lib/store"
import { loadSettingsFromDB } from "@/lib/slices/settingsSlice"
import { loadPersonalInfoFromDB } from "@/lib/slices/personalSlice"
import { loadExperiencesFromDB } from "@/lib/slices/experienceSlice"
import { loadEducationsFromDB } from "@/lib/slices/educationSlice"
import { loadSkillsFromDB } from "@/lib/slices/skillsSlice"
import { loadFooterFromDB } from "@/lib/slices/footerSlice"

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const storeRef = useRef<AppStore | null>(null)
    const [store, setStore] = useState<AppStore | null>(null)
    
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

    return store ? <Provider store={store}>{children}</Provider> : null
}