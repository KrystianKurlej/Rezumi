import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFreelance } from '@/lib/db';
import type { AppThunk } from '@/lib/store';

export interface Freelance {
    languageId?: string | null
    freelanceText: string
}

const initialState: Freelance = {
    languageId: null,
    freelanceText: '',
};

const freelanceSlice = createSlice({
    name: 'freelance',
    initialState,
    reducers: {
        setFreelance(state, action: PayloadAction<Freelance>) {
            return action.payload;
        },
        resetFreelance: () => initialState,
    },
});

export const { setFreelance, resetFreelance } = freelanceSlice.actions;

export const loadFreelanceFromDB = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();
        const selectedLanguage = state.preview.selectedLanguage;
        const defaultLanguage = state.settings.defaultLanguage;
        
        const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null;
        
        const savedFreelance = await getFreelance(languageId);
        if (savedFreelance) {
            dispatch(setFreelance({
                languageId: savedFreelance.languageId || null,
                freelanceText: savedFreelance.freelanceText || ''
            }));
        } else {
            dispatch(setFreelance({ languageId, freelanceText: '' }));
        }
    } catch (error) {
        console.error('Failed to load freelance from DB:', error);
    }
};

export default freelanceSlice.reducer;