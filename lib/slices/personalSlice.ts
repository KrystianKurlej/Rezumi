import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPersonalInfo } from '@/lib/db';
import type { AppThunk } from '@/lib/store';

export interface PersonalInfo {
    languageId?: string | null
    firstName: string
    lastName: string
    email: string
    phone: string
}

const initialState: PersonalInfo = {
    languageId: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
};

const personalSlice = createSlice({
    name: 'personal',
    initialState,
    reducers: {
        setPersonalInfo(state, action: PayloadAction<PersonalInfo>) {
            return action.payload;
        },
        resetPersonalInfo: () => initialState,
    },
});

export const { setPersonalInfo, resetPersonalInfo } = personalSlice.actions;

export const loadPersonalInfoFromDB = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();
        const selectedLanguage = state.preview.selectedLanguage;
        const defaultLanguage = state.settings.defaultLanguage;
        
        const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null;
        
        const savedPersonalInfo = await getPersonalInfo(languageId);
        if (savedPersonalInfo) {
            const personalInfo: PersonalInfo = {
                languageId: savedPersonalInfo.languageId || null,
                firstName: savedPersonalInfo.firstName || '',
                lastName: savedPersonalInfo.lastName || '',
                email: savedPersonalInfo.email || '',
                phone: savedPersonalInfo.phone || '',
            };
            dispatch(setPersonalInfo(personalInfo));
        } else {
            dispatch(setPersonalInfo({
                languageId,
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
            }));
        }
    } catch (error) {
        console.error('Failed to load personal info from DB:', error);
    }
};

export default personalSlice.reducer;