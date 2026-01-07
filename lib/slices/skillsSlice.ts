import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllSkills, addSkill, updateSkill, deleteSkill, updateSkillsOrder } from '@/lib/db';
import type { AppThunk } from '@/lib/store';
import type { DBSkill } from '@/lib/db/types';

export interface SkillsState {
    skills: DBSkill[]
}

const initialState: SkillsState = {
    skills: []
};

const skillsSlice = createSlice({
    name: 'skills',
    initialState,
    reducers: {
        setSkills(state, action: PayloadAction<DBSkill[]>) {
            state.skills = action.payload;
        },
        addSkillToState(state, action: PayloadAction<DBSkill>) {
            state.skills = [action.payload, ...state.skills];
        },
        updateSkillInState(state, action: PayloadAction<DBSkill>) {
            const index = state.skills.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.skills[index] = action.payload;
            }
        },
        removeSkillFromState(state, action: PayloadAction<number>) {
            state.skills = state.skills.filter(s => s.id !== action.payload);
        },
        reorderSkills(state, action: PayloadAction<DBSkill[]>) {
            state.skills = action.payload;
        },
        resetSkills: () => initialState,
    },
});

export const { 
    setSkills, 
    addSkillToState, 
    updateSkillInState, 
    removeSkillFromState,
    reorderSkills,
    resetSkills 
} = skillsSlice.actions;

export const loadSkillsFromDB = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();
        const selectedLanguage = state.preview.selectedLanguage;
        const defaultLanguage = state.settings.defaultLanguage;
        
        const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null;
        
        const skills = await getAllSkills(languageId);
        dispatch(setSkills(skills));
    } catch (error) {
        console.error('Failed to load skills from DB:', error);
    }
};

export const addSkillToDB = (skillName: string): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();
        const selectedLanguage = state.preview.selectedLanguage;
        const defaultLanguage = state.settings.defaultLanguage;
        
        const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null;
        
        // Pobierz maksymalny order
        const maxOrder = state.skills.skills.length > 0 
            ? Math.max(...state.skills.skills.map(s => s.order ?? 0)) 
            : -1;
        
        const id = await addSkill({
            languageId,
            skillName,
            description: '',
            order: maxOrder + 1
        });
        
        dispatch(addSkillToState({
            id,
            type: 'skill',
            languageId,
            skillName,
            description: '',
            order: maxOrder + 1,
            createdAt: Date.now()
        }));
    } catch (error) {
        console.error('Failed to add skill:', error);
    }
};

export const updateSkillInDB = (id: number, skillName: string, description?: string): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();
        const selectedLanguage = state.preview.selectedLanguage;
        const defaultLanguage = state.settings.defaultLanguage;
        
        const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null;
        
        const skill = state.skills.skills.find(s => s.id === id);
        
        await updateSkill(id, {
            languageId,
            skillName,
            description,
            order: skill?.order ?? 0
        });
        
        if (skill) {
            dispatch(updateSkillInState({
                ...skill,
                skillName,
                description
            }));
        }
    } catch (error) {
        console.error('Failed to update skill:', error);
    }
};

export const deleteSkillFromDB = (id: number): AppThunk => async (dispatch) => {
    try {
        await deleteSkill(id);
        dispatch(removeSkillFromState(id));
    } catch (error) {
        console.error('Failed to delete skill:', error);
    }
};

export const updateSkillsOrderInDB = (skills: DBSkill[]): AppThunk => async (dispatch) => {
    try {
        const skillsWithOrder = skills.map((skill, index) => ({
            id: skill.id!,
            order: index
        }));
        
        await updateSkillsOrder(skillsWithOrder);
        dispatch(reorderSkills(skills.map((skill, index) => ({ ...skill, order: index }))));
    } catch (error) {
        console.error('Failed to update skills order:', error);
    }
};

export default skillsSlice.reducer;
