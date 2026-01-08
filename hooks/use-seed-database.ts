import { useState } from 'react'
import { seedDatabase } from '@/lib/db/sample-data'

export const useSeedDatabase = () => {
    const [isSeeding, setIsSeeding] = useState(false)

    const seed = async () => {
        if (isSeeding) return

        setIsSeeding(true)
        try {
            await seedDatabase()
            window.location.reload()
        } catch (error) {
            console.error('Failed to seed database:', error)
            setIsSeeding(false)
        }
    }

    return { seed, isSeeding }
}