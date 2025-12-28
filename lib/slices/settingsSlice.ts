import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export default settingsSlice.reducer;
