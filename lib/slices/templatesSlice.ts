import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '@/lib/store';

export interface NewTemplate {
    title: string;
    description?: string;
    selectedDesign: string;
}

const initialState: NewTemplate = {
    title: '',
    description: '',
    selectedDesign: 'classic',
};

const templatesSlice = createSlice({
    name: 'templates',
    initialState,
    reducers: {
        setSelectedDesign(state, action: PayloadAction<string>) {
            state.selectedDesign = action.payload;
        },
    },
});

export const { setSelectedDesign } = templatesSlice.actions;

export const selectDesign = (designId: string): AppThunk => async (dispatch) => {
    dispatch(setSelectedDesign(designId));
};

export default templatesSlice.reducer;