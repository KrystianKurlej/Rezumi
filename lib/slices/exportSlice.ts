import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ExportData {
    quickFilename: string;
    jobFilename: string;
    companyName: string;
    jobTitle: string;
    jobLink: string;
    notes: string;
}

const initialState: ExportData = {
    quickFilename: 'my-cv.pdf',
    jobFilename: 'my-cv.pdf',
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
        updateJobFilename(state, action: PayloadAction<string>) {
            state.jobFilename = action.payload;
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
        generateJobFilename(state) {
            if (state.companyName && state.jobTitle) {
                const cleanCompany = state.companyName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
                const cleanTitle = state.jobTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase();
                state.jobFilename = `cv-${cleanCompany}-${cleanTitle}.pdf`;
            }
        },
        resetExportData: () => initialState,
    },
});

export const { 
    updateQuickFilename,
    updateJobFilename,
    updateCompanyName,
    updateJobTitle,
    updateJobLink,
    updateNotes,
    generateJobFilename,
    resetExportData 
} = exportSlice.actions;

export default exportSlice.reducer;