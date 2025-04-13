import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    discountCodes: [],
    loading: false,
    error: null,
    success: false
};

const discountSlice = createSlice({
    name: 'discount',
    initialState,
    reducers: {
        resetDiscountState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Discount Codes
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state) => {
                    state.loading = false;
                    state.success = true;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload?.message || 'Có lỗi xảy ra';
                }
            );
    }
});

export const { resetDiscountState } = discountSlice.actions;
export default discountSlice.reducer; 