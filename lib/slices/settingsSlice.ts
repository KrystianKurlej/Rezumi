import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getSettings } from '@/lib/db';
import type { AppThunk } from '@/lib/store';
import { setSelectedLanguage, setDefaultLanguage as setPreviewDefaultLanguage } from './previewSlice';

export interface SettingsState {
    defaultLanguage: string | null;
    availableLanguages: string[];
    defaultCurrency: string;
}

const initialState: SettingsState = {
    defaultLanguage: null,
    availableLanguages: [],
    defaultCurrency: 'USD',
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setSettings(state, action: PayloadAction<SettingsState>) {
            return action.payload;
        },
        setDefaultLanguage(state, action: PayloadAction<string | null>) {
            state.defaultLanguage = action.payload;
        },
        addLanguage(state, action: PayloadAction<string>) {
            if (!state.availableLanguages.includes(action.payload)) {
                state.availableLanguages.push(action.payload);
            }
        },
        removeLanguage(state, action: PayloadAction<string>) {
            state.availableLanguages = state.availableLanguages.filter(
                (lang) => lang !== action.payload
            );
        },
        setDefaultCurrency(state, action: PayloadAction<string>) {
            state.defaultCurrency = action.payload;
        },
        resetSettings: () => initialState,
    },
});

export const {
    setSettings,
    setDefaultLanguage,
    addLanguage,
    removeLanguage,
    setDefaultCurrency,
    resetSettings,
} = settingsSlice.actions;

export const loadSettingsFromDB = (): AppThunk => async (dispatch) => {
    try {
        const savedSettings = await getSettings();
        if (savedSettings) {
            dispatch(setSettings(savedSettings));
            
            if (savedSettings.defaultLanguage) {
                dispatch(setPreviewDefaultLanguage(savedSettings.defaultLanguage));
                dispatch(setSelectedLanguage(savedSettings.defaultLanguage));
            }
        }
    } catch (error) {
        console.error('Failed to load settings from DB:', error);
    }
};

export default settingsSlice.reducer;
