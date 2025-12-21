import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PreviewSettings {
    scale: number
}

const initialState: PreviewSettings = {
    scale: 1,
};

const previewSlice = createSlice({
    name: 'preview',
    initialState,
    reducers: {
        setScale(state, action: PayloadAction<number>) {
            state.scale = action.payload;
        },
    },
});

export const { setScale } = previewSlice.actions;
export default previewSlice.reducer;