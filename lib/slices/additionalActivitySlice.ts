import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllAdditionalActivities } from '../db';
import type { AppThunk } from '@/lib/store';
import type { DBAdditionalActivity } from '../db';
import { reloadPreview } from './previewSlice';

export interface NewAdditionalActivity {
    newAdditionalActivityTitle: string
    newAdditionalActivityCompany: string
    newAdditionalActivityStartDate: string
    newAdditionalActivityEndDate: string
    newAdditionalActivityDescription: string
    newAdditionalActivityIsOngoing: boolean
}

export interface AdditionalActivities {
    list: DBAdditionalActivity[]
    isLoading: boolean
}

const initialNewAdditionalActivityState: NewAdditionalActivity = {
    newAdditionalActivityTitle: '',
    newAdditionalActivityCompany: '',
    newAdditionalActivityStartDate: '',
    newAdditionalActivityEndDate: '',
    newAdditionalActivityDescription: '',
    newAdditionalActivityIsOngoing: false,
};

const initialAdditionalActivitiesState: AdditionalActivities = {
    list: [],
    isLoading: false,
};

const newAdditionalActivitySlice = createSlice({
    name: 'newAdditionalActivity',
    initialState: initialNewAdditionalActivityState,
    reducers: {
        updateNewAdditionalActivity(state, action: PayloadAction<Partial<NewAdditionalActivity>>) {
            return { ...state, ...action.payload };
        },
        resetNewAdditionalActivity: () => initialNewAdditionalActivityState,
    },
});

const additionalActivitiesSlice = createSlice({
    name: 'additionalActivities',
    initialState: initialAdditionalActivitiesState,
    reducers: {
        setAdditionalActivities: (state, action: PayloadAction<DBAdditionalActivity[]>) => {
            state.list = action.payload
        },
        addAdditionalActivity: (state, action: PayloadAction<DBAdditionalActivity>) => {
            state.list.push(action.payload)
        },
        removeAdditionalActivity: (state, action: PayloadAction<number>) => {
            state.list = state.list.filter(exp => exp.id !== action.payload)
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
    },
})

export const { updateNewAdditionalActivity, resetNewAdditionalActivity } = newAdditionalActivitySlice.actions;
export const { setAdditionalActivities, addAdditionalActivity, removeAdditionalActivity, setLoading } = additionalActivitiesSlice.actions

export const loadAdditionalActivitiesFromDB = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();
        const selectedLanguage = state.preview.selectedLanguage;
        const defaultLanguage = state.settings.defaultLanguage;
        
        const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null;
        
        const additionalActivities = await getAllAdditionalActivities(languageId);
        dispatch(setAdditionalActivities(additionalActivities));
        dispatch(reloadPreview());
    } catch (error) {
        console.error('Failed to load additionalActivities from DB:', error);
    }
};

export const newAdditionalActivityReducer = newAdditionalActivitySlice.reducer;
export const additionalActivitiesReducer = additionalActivitiesSlice.reducer;