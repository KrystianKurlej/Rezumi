import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DBCVData } from '../db';
import type { SortingState } from '@tanstack/react-table'

export interface Application {
    id: string
    companyName: string
    position: string
    url: string
    notes: string
    salary: number | null
    dateApplied: string
    status: 'notApplied' | 'submitted' | 'rejected' | 'offerExtendedInProgress' | 'jobRemoved' | 'ghosted' | 'offerExtendedNotAccepted' | 'rescinded' | 'notForMe' | 'sentFollowUp' | null
    cvData?: DBCVData
}

export interface NewApplication {
    newApplicationCompanyName: string
    newApplicationPosition: string
    newApplicationUrl: string
    newApplicationNotes: string
    newApplicationSalary: string
    newApplicationDateApplied: string
    newApplicationStatus: 'notApplied' | 'submitted' | 'rejected' | 'offerExtendedInProgress' | 'jobRemoved' | 'ghosted' | 'offerExtendedNotAccepted' | 'rescinded' | 'notForMe' | 'sentFollowUp' | null
}

export interface Applications {
    list: Application[]
    isLoading: boolean
    hasApplications: boolean
    sorting: SortingState
}

const initialNewApplicationState: NewApplication = {
    newApplicationCompanyName: '',
    newApplicationPosition: '',
    newApplicationUrl: '',
    newApplicationNotes: '',
    newApplicationSalary: '',
    newApplicationDateApplied: '',
    newApplicationStatus: null,
};

const initialApplicationsState: Applications = {
    list: [],
    isLoading: false,
    hasApplications: false,
    sorting: [{ id: 'dateApplied', desc: true }], // Default sort by date desc
};

const newApplicationSlice = createSlice({
    name: 'newApplication',
    initialState: initialNewApplicationState,
    reducers: {
        updateNewApplication(state, action: PayloadAction<Partial<NewApplication>>) {
            return { ...state, ...action.payload };
        },
        resetNewApplication: () => initialNewApplicationState,
    },
});

const applicationsSlice = createSlice({
    name: 'applications',
    initialState: initialApplicationsState,
    reducers: {
        setApplications: (state, action: PayloadAction<Application[]>) => {
            state.list = action.payload
            state.hasApplications = action.payload.length > 0
        },
        addApplication: (state, action: PayloadAction<Application>) => {
            state.list.push(action.payload)
            state.hasApplications = true
        },
        updateApplication: (state, action: PayloadAction<Application>) => {
            const index = state.list.findIndex(app => app.id === action.payload.id)
            if (index !== -1) {
                state.list[index] = action.payload
            }
        },
        deleteApplication: (state, action: PayloadAction<string>) => {
            state.list = state.list.filter(app => app.id !== action.payload)
            state.hasApplications = state.list.length > 0
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setSorting: (state, action: PayloadAction<SortingState>) => {
            state.sorting = action.payload
        },
    },
});

export const { updateNewApplication, resetNewApplication } = newApplicationSlice.actions;
export const { 
    setApplications, 
    addApplication, 
    updateApplication, 
    deleteApplication, 
    setLoading,
    setSorting
} = applicationsSlice.actions;

export const newApplicationReducer = newApplicationSlice.reducer;
export const applicationsReducer = applicationsSlice.reducer;