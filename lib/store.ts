import { configureStore } from '@reduxjs/toolkit'
import personalReducer from './slices/personalSlice'
import experienceReducer from './slices/experienceSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            personal: personalReducer,
            newExperience: experienceReducer,
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']