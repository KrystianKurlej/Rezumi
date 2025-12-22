import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ExportData {
    quickFilename: string;
    companyName: string;
    jobTitle: string;
    jobLink: string;
    notes: string;
}

const initialState: ExportData = {
    quickFilename: 'my-cv.pdf',
    companyName: '',
    jobTitle: '',
    jobLink: '',
    notes: '',
};

const exportSlice = createSlice({
    name: 'export',
    initialState,
    reducers: {
        updateQuickFilename(state, action: PayloadAction<string>) {
            state.quickFilename = action.payload;
        },
        updateCompanyName(state, action: PayloadAction<string>) {
            state.companyName = action.payload;
        },
        updateJobTitle(state, action: PayloadAction<string>) {
            state.jobTitle = action.payload;
        },
        updateJobLink(state, action: PayloadAction<string>) {
            state.jobLink = action.payload;
        },
        updateNotes(state, action: PayloadAction<string>) {
            state.notes = action.payload;
        },
        resetExportData: () => initialState,
    },
});

export const { 
    updateQuickFilename,
    updateCompanyName,
    updateJobTitle,
    updateJobLink,
    updateNotes,
    resetExportData 
} = exportSlice.actions;

export default exportSlice.reducer;