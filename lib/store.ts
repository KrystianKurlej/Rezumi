import { configureStore } from '@reduxjs/toolkit'
import previewReducer from './slices/previewSlice'
import personalReducer from './slices/personalSlice'
import { newExperienceReducer, experiencesReducer } from './slices/experienceSlice'
import { newEducationReducer, educationsReducer } from './slices/educationSlice'
import { newCourseReducer, coursesReducer } from './slices/coursesSlice'
import { newApplicationReducer, applicationsReducer } from './slices/applicationsSlice'
import footerReducer from './slices/footerSlice'
import skillsReducer from './slices/skillsSlice'
import pagesReducer from './slices/pagesSlice'
import settingsReducer from './slices/settingsSlice'
import templatesReducer from './slices/templatesSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            pages: pagesReducer,
            preview: previewReducer,
            personal: personalReducer,
            newExperience: newExperienceReducer,
            experiences: experiencesReducer,
            newEducation: newEducationReducer,
            educations: educationsReducer,
            newCourse: newCourseReducer,
            courses: coursesReducer,
            newApplication: newApplicationReducer,
            applications: applicationsReducer,
            footer: footerReducer,
            skills: skillsReducer,
            settings: settingsReducer,
            templates: templatesReducer,
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ReturnType = void> = (
    dispatch: AppDispatch,
    getState: () => RootState
) => ReturnType | Promise<ReturnType>