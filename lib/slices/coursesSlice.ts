import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllCourses } from '../db';
import type { AppThunk } from '@/lib/store';
import type { DBCourse } from '../db';

export interface NewCourse {
    newCourseName: string
    newCoursePlatform: string
    newCourseCompletionDate: string
    newCourseCertificateUrl: string
    newCourseDescription: string
    newCourseIsOngoing: boolean
}

export interface Courses {
    list: DBCourse[]
    isLoading: boolean
}

const initialNewCourseState: NewCourse = {
    newCourseName: '',
    newCoursePlatform: '',
    newCourseCompletionDate: '',
    newCourseCertificateUrl: '',
    newCourseDescription: '',
    newCourseIsOngoing: false,
};

const initialCoursesState: Courses = {
    list: [],
    isLoading: false,
};

const newCourseSlice = createSlice({
    name: 'newCourse',
    initialState: initialNewCourseState,
    reducers: {
        updateNewCourse(state, action: PayloadAction<Partial<NewCourse>>) {
            return { ...state, ...action.payload };
        },
        resetNewCourse: () => initialNewCourseState,
    },
});

const coursesSlice = createSlice({
    name: 'courses',
    initialState: initialCoursesState,
    reducers: {
        setCourses: (state, action: PayloadAction<DBCourse[]>) => {
            state.list = action.payload
        },
        addCourse: (state, action: PayloadAction<DBCourse>) => {
            state.list.push(action.payload)
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
    },
});

export const { updateNewCourse, resetNewCourse } = newCourseSlice.actions;
export const { setCourses, addCourse, setLoading } = coursesSlice.actions;

export const loadCoursesFromDB = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();
        const selectedLanguage = state.preview.selectedLanguage;
        const defaultLanguage = state.settings.defaultLanguage;
        
        const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null;
        
        const courses = await getAllCourses(languageId);
        dispatch(setCourses(courses));
    } catch (error) {
        console.error('Failed to load courses from DB:', error);
    }
};

export const newCourseReducer = newCourseSlice.reducer;
export const coursesReducer = coursesSlice.reducer;
