import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllEducations } from '../db';
import type { AppThunk } from '@/lib/store';
import type { DBEducation } from '../db';
import { reloadPreview } from './previewSlice';

export interface NewEducation {
    newEducationDegree: string
    newEducationInstitution: string
    newEducationFieldOfStudy: string
    newEducationStartDate: string
    newEducationEndDate: string
    newEducationDescription: string
    newEducationIsOngoing: boolean
}

export interface Educations {
    list: DBEducation[]
    isLoading: boolean
}

const initialNewEducationState: NewEducation = {
    newEducationDegree: '',
    newEducationInstitution: '',
    newEducationFieldOfStudy: '',
    newEducationStartDate: '',
    newEducationEndDate: '',
    newEducationDescription: '',
    newEducationIsOngoing: false,
};

const initialEducationsState: Educations = {
    list: [],
    isLoading: false,
};

const newEducationSlice = createSlice({
    name: 'newEducation',
    initialState: initialNewEducationState,
    reducers: {
        updateNewEducation(state, action: PayloadAction<Partial<NewEducation>>) {
            return { ...state, ...action.payload };
        },
        resetNewEducation: () => initialNewEducationState,
    },
});

const educationsSlice = createSlice({
    name: 'educations',
    initialState: initialEducationsState,
    reducers: {
        setEducations: (state, action: PayloadAction<DBEducation[]>) => {
            state.list = action.payload
        },
        addEducation: (state, action: PayloadAction<DBEducation>) => {
            state.list.push(action.payload)
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
    },
});

export const { updateNewEducation, resetNewEducation } = newEducationSlice.actions;
export const { setEducations, addEducation, setLoading } = educationsSlice.actions;

export const loadEducationsFromDB = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();
        const selectedLanguage = state.preview.selectedLanguage;
        const defaultLanguage = state.settings.defaultLanguage;
        
        const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null;
        
        const educations = await getAllEducations(languageId);
        dispatch(setEducations(educations));
        dispatch(reloadPreview());
    } catch (error) {
        console.error('Failed to load educations from DB:', error);
    }
};

export const newEducationReducer = newEducationSlice.reducer;
export const educationsReducer = educationsSlice.reducer;