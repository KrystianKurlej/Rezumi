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
        setFooter(state, action: PayloadAction<Footer>) {
            return action.payload;
        },
        resetFooter: () => initialState,
    },
});

export const { setFooter, resetFooter } = footerSlice.actions;
export default footerSlice.reducer;