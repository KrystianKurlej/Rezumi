import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Skills {
    skillsText: string
}

const initialState: Skills = {
    skillsText: '',
};

const skillsSlice = createSlice({
    name: 'skills',
    initialState,
    reducers: {
        updateSkills(state, action: PayloadAction<string>) {
            state.skillsText = action.payload;
        },
        setSkills(state, action: PayloadAction<Skills>) {
            return action.payload;
        },
        resetSkills: () => initialState,
    },
});

export const { updateSkills, setSkills, resetSkills } = skillsSlice.actions;
export default skillsSlice.reducer;