'use client'

import { useRef, useLayoutEffect, useState } from "react"
import { Provider } from "react-redux"
import { makeStore, AppStore } from "@/lib/store"

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
        }
        setStore(storeRef.current)
    }, [])

    return store ? <Provider store={store}>{children}</Provider> : null
}