import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '@/lib/store';

export interface NewTemplate {
    title: string;
    selectedDesign: string;
    selectedTemplate?: string;
}

const initialState: NewTemplate = {
    title: '',
    selectedDesign: 'classic',
    selectedTemplate: 'classic',
};

const templatesSlice = createSlice({
    name: 'templates',
    initialState,
    reducers: {
        setSelectedDesign(state, action: PayloadAction<string>) {
            state.selectedDesign = action.payload;
        },
        setSelectedTemplate(state, action: PayloadAction<string>) {
            state.selectedTemplate = action.payload;
        },
    },
});

export const { setSelectedDesign, setSelectedTemplate } = templatesSlice.actions;

export const selectDesign = (designId: string): AppThunk => async (dispatch) => {
    dispatch(setSelectedDesign(designId));
};

export const selectTemplate = (templateId: string): AppThunk => async (dispatch) => {
    dispatch(setSelectedTemplate(templateId));
};

export default templatesSlice.reducer;