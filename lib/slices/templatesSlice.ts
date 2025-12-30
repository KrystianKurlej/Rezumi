import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '@/lib/store';

export interface NewTemplate {
    title: string;
    selectedDesign: string; // Design wybrany w formularzu (tymczasowy)
    selectedTemplate?: string; // ID aktywnego szablonu
    currentDesignId?: string; // DesignId aktywnego szablonu (do renderowania PDF)
}

const initialState: NewTemplate = {
    title: '',
    selectedDesign: 'classic',
    selectedTemplate: 'classic',
    currentDesignId: 'classic',
};

const templatesSlice = createSlice({
    name: 'templates',
    initialState,
    reducers: {
        setSelectedDesign(state, action: PayloadAction<string>) {
            // selectedDesign - tymczasowy stan dla formularzy dodawania/edycji szablonu
            state.selectedDesign = action.payload;
        },
        setSelectedTemplate(state, action: PayloadAction<string>) {
            // selectedTemplate - ID aktualnie wybranego szablonu do generowania CV
            state.selectedTemplate = action.payload;
        },
        setCurrentDesignId(state, action: PayloadAction<string>) {
            // currentDesignId - designId aktywnego szablonu (classic, minimalist, etc.)
            state.currentDesignId = action.payload;
        },
    },
});

export const { setSelectedDesign, setSelectedTemplate, setCurrentDesignId } = templatesSlice.actions;

export const selectDesign = (designId: string): AppThunk => async (dispatch) => {
    dispatch(setSelectedDesign(designId));
};

export const selectTemplate = (templateId: string): AppThunk => async (dispatch) => {
    dispatch(setSelectedTemplate(templateId));
};

export default templatesSlice.reducer;