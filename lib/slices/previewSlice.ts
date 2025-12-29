import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PreviewSettings {
    scale: number,
    selectedLanguage?: string,
    defaultLanguage?: string,
}

const initialState: PreviewSettings = {
    scale: 1,
    defaultLanguage: undefined,
    selectedLanguage: undefined,
};

const previewSlice = createSlice({
    name: 'preview',
    initialState,
    reducers: {
        setScale(state, action: PayloadAction<number>) {
            state.scale = action.payload;
        },
        setSelectedLanguage(state, action: PayloadAction<string | undefined>) {
            state.selectedLanguage = action.payload;
        },
        setDefaultLanguage(state, action: PayloadAction<string | undefined>) {
            state.defaultLanguage = action.payload;
        },
    },
});

export const { setScale, setSelectedLanguage, setDefaultLanguage } = previewSlice.actions;
export default previewSlice.reducer;