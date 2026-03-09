import { createSlice } from '@reduxjs/toolkit';

const getStoredUser = () => {
    try {
        const user = localStorage.getItem('movieplatform_user');
        return user ? JSON.parse(user) : null;
    } catch {
        localStorage.removeItem('movieplatform_user');
        return null;
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: getStoredUser(),
        token: localStorage.getItem('movieplatform_token') || null,
        isAuthenticated: !!localStorage.getItem('movieplatform_token'),
        loading: false,
        error: null,
    },
    reducers: {
        loginStart: (state) => { state.loading = true; state.error = null; },
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.loading = false;
            localStorage.setItem('movieplatform_user', JSON.stringify(action.payload.user));
            localStorage.setItem('movieplatform_token', action.payload.token);
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            if (action.payload) {
                localStorage.setItem('movieplatform_user', JSON.stringify(action.payload));
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('movieplatform_user');
            localStorage.removeItem('movieplatform_token');
        },
        clearError: (state) => { state.error = null; },
    },
});

export const { loginStart, loginSuccess, loginFailure, setUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
