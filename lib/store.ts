import { configureStore } from '@reduxjs/toolkit'
import personalReducer from './slices/personalSlice'
import { newExperienceReducer, experiencesReducer } from './slices/experienceSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            personal: personalReducer,
            newExperience: newExperienceReducer,
            experiences: experiencesReducer,
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']