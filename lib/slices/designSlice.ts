import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '@/lib/store';

export interface DesignState {
    selectedDesign: string;
}

const initialState: DesignState = {
    selectedDesign: 'classic',
};

const designSlice = createSlice({
    name: 'design',
    initialState,
    reducers: {
        setSelectedDesign(state, action: PayloadAction<string>) {
            state.selectedDesign = action.payload;
        },
    },
});

export const { setSelectedDesign } = designSlice.actions;

export const selectDesign = (designId: string): AppThunk => async (dispatch) => {
    dispatch(setSelectedDesign(designId));
};

export default designSlice.reducer;