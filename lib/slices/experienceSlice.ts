import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NewExperience {
    title: string
    company: string
    startDate: string
    endDate: string
    description: string
}

const initialState: NewExperience = {
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    description: '',
};

const newExperienceSlice = createSlice({
    name: 'newExperience',
    initialState,
    reducers: {
        updateNewExperience(state, action: PayloadAction<Partial<NewExperience>>) {
            return { ...state, ...action.payload };
        },
        resetNewExperience: () => initialState,
    },
});

export const { updateNewExperience, resetNewExperience } = newExperienceSlice.actions;
export default newExperienceSlice.reducer;