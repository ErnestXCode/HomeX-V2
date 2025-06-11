import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: {},
  profile: 'null',
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
    },
    logOutUser: (state) => {
      state.currentUser = null;
    },
   
  },
});

export const { signInSuccess, logOutUser } = userSlice.actions;
// export const selectCurrentProfile = (state) => state.user.profile; // Corrected selector
export const selectCurrentUser = (state) => state.user.currentUser; // Corrected selector
// export const selectCurrentProfile = (state) => state.user.currentUser; // Corrected selector
export default userSlice.reducer;
