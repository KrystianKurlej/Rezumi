import { configureStore } from '@reduxjs/toolkit'
import personalReducer from './slices/personalSlice'
import { newExperienceReducer, experiencesReducer } from './slices/experienceSlice'
import { newEducationReducer, educationsReducer } from './slices/educationSlice'
import footerReducer from './slices/footerSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            personal: personalReducer,
            newExperience: newExperienceReducer,
            experiences: experiencesReducer,
            newEducation: newEducationReducer,
            educations: educationsReducer,
            footer: footerReducer,
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']