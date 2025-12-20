import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PersonalInfo {
    fistName: string
    lastName: string
    email: string
    phone: string
}

const initialState: PersonalInfo = {
    fistName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
};

const personalSlice = createSlice({
    name: 'personal',
    initialState,
    reducers: {
        updatePersonalInfo(state, action: PayloadAction<Partial<PersonalInfo>>) {
            return { ...state, ...action.payload };
        },
        resetPersonalInfo: () => initialState,
    },
});

export const { updatePersonalInfo, resetPersonalInfo } = personalSlice.actions;
export default personalSlice.reducer;