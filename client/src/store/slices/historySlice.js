import { createSlice } from '@reduxjs/toolkit';

const historySlice = createSlice({
    name: 'history',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        setHistory: (state, action) => { state.items = action.payload; },
        addToHistory: (state, action) => {
            state.items = state.items.filter(h => h.tmdbId !== action.payload.tmdbId);
            state.items.unshift(action.payload);
            if (state.items.length > 50) state.items = state.items.slice(0, 50);
        },
        removeFromHistory: (state, action) => {
            state.items = state.items.filter(h => h.tmdbId !== action.payload);
        },
        clearHistory: (state) => { state.items = []; },
        setLoading: (state, action) => { state.loading = action.payload; },
    },
});

export const { setHistory, addToHistory, removeFromHistory, clearHistory, setLoading } = historySlice.actions;
export default historySlice.reducer;
