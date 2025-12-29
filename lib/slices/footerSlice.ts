import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFooter } from '@/lib/db';
import type { AppThunk } from '@/lib/store';

export interface Footer {
    languageId?: string | null
    footerText: string
}

const initialState: Footer = {
    languageId: null,
    footerText: ''
};

const footerSlice = createSlice({
    name: 'footer',
    initialState,
    reducers: {
        setFooter(state, action: PayloadAction<Footer>) {
            return action.payload;
        },
        resetFooter: () => initialState,
    },
});

export const { setFooter, resetFooter } = footerSlice.actions;

export const loadFooterFromDB = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();
        const selectedLanguage = state.preview.selectedLanguage;
        const defaultLanguage = state.settings.defaultLanguage;
        
        const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null;
        
        const savedFooter = await getFooter(languageId);
        if (savedFooter) {
            dispatch(setFooter({
                languageId: savedFooter.languageId || null,
                footerText: savedFooter.footerText || ''
            }));
        } else {
            dispatch(setFooter({ languageId, footerText: '' }));
        }
    } catch (error) {
        console.error('Failed to load footer from DB:', error);
    }
};

export default footerSlice.reducer;