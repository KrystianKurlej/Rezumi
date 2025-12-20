import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Footer {
    footerText: string
}

const initialState: Footer = {
    footerText: ''
};

const footerSlice = createSlice({
    name: 'footer',
    initialState,
    reducers: {
        updateFooter(state, action: PayloadAction<Partial<Footer>>) {
            return { ...state, ...action.payload };
        },
        setFooter(state, action: PayloadAction<Footer>) {
            return action.payload;
        },
        resetFooter: () => initialState,
    },
});

export const { updateFooter, setFooter, resetFooter } = footerSlice.actions;
export default footerSlice.reducer;