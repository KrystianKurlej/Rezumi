import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PreviewSettings {
    scale: number,
    selectedLanguage?: string,
    defaultLanguage?: string,
    reloadKey: number,
}

const initialState: PreviewSettings = {
    scale: 1,
    defaultLanguage: undefined,
    selectedLanguage: undefined,
    reloadKey: 0,
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
        reloadPreview(state) {
            state.reloadKey = state.reloadKey + 1;
        },
    },
});

export const { setScale, setSelectedLanguage, setDefaultLanguage, reloadPreview } = previewSlice.actions;
export default previewSlice.reducer;