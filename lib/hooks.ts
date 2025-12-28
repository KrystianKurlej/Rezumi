import { useDispatch, useSelector, useStore } from 'react-redux'
import type { AppDispatch, AppStore, RootState } from './store'
import { formatCurrency } from './utils'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()

// Custom hooks for common selectors
export const useSettings = () => useAppSelector((state) => state.settings)
export const useDefaultCurrency = () => useAppSelector((state) => state.settings.defaultCurrency)
export const useDefaultLanguage = () => useAppSelector((state) => state.settings.defaultLanguage)
export const useAvailableLanguages = () => useAppSelector((state) => state.settings.availableLanguages)

// Custom hook for formatting currency with default currency from settings
export const useFormatCurrency = () => {
    const defaultCurrency = useDefaultCurrency()
    return (amount: number, currencyCode?: string) => {
        return formatCurrency(amount, currencyCode || defaultCurrency)
    }
}