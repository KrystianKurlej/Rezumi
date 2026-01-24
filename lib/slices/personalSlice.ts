import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPersonalInfo } from '@/lib/db';
import type { AppThunk } from '@/lib/store';
import { PersonalInfo } from '@/lib/db/types'
import { reloadPreview } from './previewSlice';

const initialState: PersonalInfo = {
    languageId: null,
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    phone: '',
    aboutDescription: '',
    photo: '',
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
                role: savedPersonalInfo.role || '',
                email: savedPersonalInfo.email || '',
                phone: savedPersonalInfo.phone || '',
                aboutDescription: savedPersonalInfo.aboutDescription || '',
                photo: savedPersonalInfo.photo || '',
            };
            dispatch(setPersonalInfo(personalInfo));
        } else {
            dispatch(setPersonalInfo({
                languageId,
                firstName: '',
                lastName: '',
                role: '',
                email: '',
                phone: '',
                aboutDescription: '',
                photo: '',
            }));
        }

        dispatch(reloadPreview());
    } catch (error) {
        console.error('Failed to load personal info from DB:', error);
    }
};

export default personalSlice.reducer;