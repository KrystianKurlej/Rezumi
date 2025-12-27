import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PreviewSettings {
    scale: number,
    defaultLanguage?: string,
}

const initialState: PreviewSettings = {
    scale: 1,
    defaultLanguage: undefined,
};

const previewSlice = createSlice({
    name: 'preview',
    initialState,
    reducers: {
        setScale(state, action: PayloadAction<number>) {
            state.scale = action.payload;
        },
        setDefaultLanguage(state, action: PayloadAction<string | undefined>) {
            state.defaultLanguage = action.payload;
        },
    },
});

export const { setScale, setDefaultLanguage } = previewSlice.actions;
export default previewSlice.reducer;