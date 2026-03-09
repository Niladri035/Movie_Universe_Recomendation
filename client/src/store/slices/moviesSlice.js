import { createSlice } from '@reduxjs/toolkit';

const moviesSlice = createSlice({
    name: 'movies',
    initialState: {
        trending: [],
        popular: [],
        topRated: [],
        tvShows: [],
        nowPlaying: [],
        upcoming: [],
        searchResults: [],
        currentMovie: null,
        genres: [],
        loading: false,
        searchLoading: false,
        error: null,
        popularPage: 1,
        hasMorePopular: true,
    },
    reducers: {
        setTrending: (state, action) => { state.trending = action.payload; },
        setPopular: (state, action) => { state.popular = action.payload; },
        appendPopular: (state, action) => {
            const ids = new Set(state.popular.map(m => m.id));
            const newMovies = action.payload.filter(m => !ids.has(m.id));
            state.popular = [...state.popular, ...newMovies];
        },
        setTopRated: (state, action) => { state.topRated = action.payload; },
        setTvShows: (state, action) => { state.tvShows = action.payload; },
        setNowPlaying: (state, action) => { state.nowPlaying = action.payload; },
        setUpcoming: (state, action) => { state.upcoming = action.payload; },
        setSearchResults: (state, action) => { state.searchResults = action.payload; },
        setCurrentMovie: (state, action) => { state.currentMovie = action.payload; },
        setGenres: (state, action) => { state.genres = action.payload; },
        setLoading: (state, action) => { state.loading = action.payload; },
        setSearchLoading: (state, action) => { state.searchLoading = action.payload; },
        setError: (state, action) => { state.error = action.payload; },
        setPopularPage: (state, action) => { state.popularPage = action.payload; },
        setHasMorePopular: (state, action) => { state.hasMorePopular = action.payload; },
    },
});

export const {
    setTrending, setPopular, appendPopular, setTopRated, setTvShows,
    setNowPlaying, setUpcoming, setSearchResults, setCurrentMovie, setGenres,
    setLoading, setSearchLoading, setError, setPopularPage, setHasMorePopular,
} = moviesSlice.actions;
export default moviesSlice.reducer;
