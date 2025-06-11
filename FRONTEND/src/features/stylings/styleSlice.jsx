import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  isBrowseOpen: false,
  userProfile: null,
};

const styleSlice = createSlice({
  name: "customStyles",
  initialState,
  reducers: {
    openSideNav: (state) => {
      state.isOpen = true;
    },
    closeSideNav: (state) => {
      state.isOpen = false;
    },
    toggleBrowseListings: (state) => {
      state.isBrowseOpen = !state.isBrowseOpen;
    },
    addProfilePic: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});

export const { openSideNav, closeSideNav, toggleBrowseListings, addProfilePic } =
  styleSlice.actions;
export const selectSidebarState = (state) => state.customStyles.isOpen;
export const selectCurrentProfile = (state) => state.customStyles.userProfile;
export const selectBrowseListingsState = (state) =>
  state.customStyles.isBrowseOpen;
export default styleSlice.reducer;
