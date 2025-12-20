import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PersonalInfo {
    firstName: string
    lastName: string
    email: string
    phone: string
}

const initialState: PersonalInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
};

const personalSlice = createSlice({
    name: 'personal',
    initialState,
    reducers: {
        updatePersonalInfo(state, action: PayloadAction<Partial<PersonalInfo>>) {
            return { ...state, ...action.payload };
        },
        setPersonalInfo(state, action: PayloadAction<PersonalInfo>) {
            return action.payload;
        },
        resetPersonalInfo: () => initialState,
    },
});

export const { updatePersonalInfo, setPersonalInfo, resetPersonalInfo } = personalSlice.actions;
export default personalSlice.reducer;