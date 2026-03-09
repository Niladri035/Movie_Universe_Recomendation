import { createSlice } from '@reduxjs/toolkit';

const storedTheme = localStorage.getItem('movieplatform_theme') || 'dark';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        theme: storedTheme,
        isTrailerModalOpen: false,
        trailerVideoId: null,
        isSearchOpen: false,
    },
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('movieplatform_theme', state.theme);
        },
        openTrailerModal: (state, action) => {
            state.isTrailerModalOpen = true;
            state.trailerVideoId = action.payload;
        },
        closeTrailerModal: (state) => {
            state.isTrailerModalOpen = false;
            state.trailerVideoId = null;
        },
        toggleSearch: (state) => {
            state.isSearchOpen = !state.isSearchOpen;
        },
    },
});

export const { toggleTheme, openTrailerModal, closeTrailerModal, toggleSearch } = uiSlice.actions;
export default uiSlice.reducer;
