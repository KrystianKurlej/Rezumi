import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getSkills } from '@/lib/db';
import type { AppThunk } from '@/lib/store';

export interface Skills {
    languageId?: string | null
    skillsText: string
}

const initialState: Skills = {
    languageId: null,
    skillsText: '',
};

const skillsSlice = createSlice({
    name: 'skills',
    initialState,
    reducers: {
        setSkills(state, action: PayloadAction<Skills>) {
            return action.payload;
        },
        resetSkills: () => initialState,
    },
});

export const { setSkills, resetSkills } = skillsSlice.actions;

export const loadSkillsFromDB = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();
        const selectedLanguage = state.preview.selectedLanguage;
        const defaultLanguage = state.settings.defaultLanguage;
        
        const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null;
        
        const savedSkills = await getSkills(languageId);
        if (savedSkills) {
            dispatch(setSkills({
                languageId: savedSkills.languageId || null,
                skillsText: savedSkills.skillsText || ''
            }));
        } else {
            dispatch(setSkills({ languageId, skillsText: '' }));
        }
    } catch (error) {
        console.error('Failed to load skills from DB:', error);
    }
};

export default skillsSlice.reducer;