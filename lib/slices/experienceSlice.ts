import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DBExperience } from '../db';

export interface NewExperience {
    newExperienceTitle: string
    newExperienceCompany: string
    newExperienceStartDate: string
    newExperienceEndDate: string
    newExperienceDescription: string
    newExperienceIsOngoing: boolean
}

export interface Experiences {
    list: DBExperience[]
    isLoading: boolean
}

const initialNewExperienceState: NewExperience = {
    newExperienceTitle: '',
    newExperienceCompany: '',
    newExperienceStartDate: '',
    newExperienceEndDate: '',
    newExperienceDescription: '',
    newExperienceIsOngoing: false,
};

const initialExperiencesState: Experiences = {
    list: [],
    isLoading: false,
};

const newExperienceSlice = createSlice({
    name: 'newExperience',
    initialState: initialNewExperienceState,
    reducers: {
        updateNewExperience(state, action: PayloadAction<Partial<NewExperience>>) {
            return { ...state, ...action.payload };
        },
        resetNewExperience: () => initialNewExperienceState,
    },
});

const experiencesSlice = createSlice({
    name: 'experiences',
    initialState: initialExperiencesState,
    reducers: {
        setExperiences: (state, action: PayloadAction<DBExperience[]>) => {
            state.list = action.payload
        },
        addExperience: (state, action: PayloadAction<DBExperience>) => {
            state.list.push(action.payload)
        },
        removeExperience: (state, action: PayloadAction<number>) => {
            state.list = state.list.filter(exp => exp.id !== action.payload)
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
    },
})

export const { updateNewExperience, resetNewExperience } = newExperienceSlice.actions;
export const { setExperiences, addExperience, removeExperience, setLoading } = experiencesSlice.actions
export const newExperienceReducer = newExperienceSlice.reducer;
export const experiencesReducer = experiencesSlice.reducer;