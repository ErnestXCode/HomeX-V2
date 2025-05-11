import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: state => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.currentUser = action.payload;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }, 
        logOutUser: (state) => {state.currentUser = null}
    }
})

export const { signInFailure, signInStart, signInSuccess, logOutUser } = userSlice.actions;
export const selectCurrentUser = (state) => state.user.currentUser; // Corrected selector
export default userSlice.reducer;
