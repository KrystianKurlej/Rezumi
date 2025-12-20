import { configureStore } from '@reduxjs/toolkit'
import personalReducer from './slices/personalSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            personal: personalReducer,
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']