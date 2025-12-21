import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Pages{
    currentPage: string
}

const initialPagesState: Pages = {
    currentPage: 'personal',
};

const pagesSlice = createSlice({
    name: 'pages',
    initialState: initialPagesState,
    reducers: {
        setCurrentPage: (state, action: PayloadAction<string>) => {
            state.currentPage = action.payload;
        },
    },
});

export const { setCurrentPage } = pagesSlice.actions;
export default pagesSlice.reducer;