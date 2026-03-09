import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        setFavorites: (state, action) => { state.items = action.payload; },
        addFavorite: (state, action) => {
            const exists = state.items.find(f => f.tmdbId === action.payload.tmdbId);
            if (!exists) state.items.unshift(action.payload);
        },
        removeFavorite: (state, action) => {
            state.items = state.items.filter(f => f.tmdbId !== action.payload);
        },
        setLoading: (state, action) => { state.loading = action.payload; },
        setError: (state, action) => { state.error = action.payload; },
    },
});

export const { setFavorites, addFavorite, removeFavorite, setLoading, setError } = favoritesSlice.actions;
export default favoritesSlice.reducer;
