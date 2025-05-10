import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
    isBrowseOpen: false
}

const styleSlice = createSlice({
    name: 'customStyles',
    initialState, 
    reducers: {
        toggleSideNav: (state) => {state.isOpen = !state.isOpen},
        toggleBrowseListings: (state) => {state.isBrowseOpen = !state.isBrowseOpen}
    }
})

export const { toggleSideNav, toggleBrowseListings } = styleSlice.actions;
export const selectSidebarState = (state) => state.customStyles.isOpen; 
export const selectBrowseListingsState = (state) => state.customStyles.isBrowseOpen; 
export default styleSlice.reducer;