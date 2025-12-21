import { configureStore } from '@reduxjs/toolkit'
import previewReducer from './slices/previewSlice'
import personalReducer from './slices/personalSlice'
import { newExperienceReducer, experiencesReducer } from './slices/experienceSlice'
import { newEducationReducer, educationsReducer } from './slices/educationSlice'
import footerReducer from './slices/footerSlice'
import skillsReducer from './slices/skillsSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            preview: previewReducer,
            personal: personalReducer,
            newExperience: newExperienceReducer,
            experiences: experiencesReducer,
            newEducation: newEducationReducer,
            educations: educationsReducer,
            footer: footerReducer,
            skills: skillsReducer,
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']