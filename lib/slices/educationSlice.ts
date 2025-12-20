import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DBEducation } from '../db';

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

export const newEducationReducer = newEducationSlice.reducer;
export const educationsReducer = educationsSlice.reducer;