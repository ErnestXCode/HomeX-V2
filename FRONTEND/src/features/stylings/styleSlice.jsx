import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
    isBrowseOpen: false
}

const styleSlice = createSlice({
    name: 'customStyles',
    initialState, 
    reducers: {
        openSideNav: (state) => {state.isOpen = true},
        closeSideNav: (state) => {state.isOpen = false},
        toggleBrowseListings: (state) => {state.isBrowseOpen = !state.isBrowseOpen}
    }
})

export const { openSideNav, closeSideNav, toggleBrowseListings } = styleSlice.actions;
export const selectSidebarState = (state) => state.customStyles.isOpen; 
export const selectBrowseListingsState = (state) => state.customStyles.isBrowseOpen; 
export default styleSlice.reducer;