  import { createSlice } from '@reduxjs/toolkit';
  import api from '../../utils/api';

  export const getInitialUser = async() => {
    try {
    const token = localStorage.getItem('token')
    
    const res = await api.get("/currentuser/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      return res ? res.data.user : null;
   
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('user');
      return null;
    }
  };



  const initialState = {
    user: await getInitialUser(),
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  };

  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      loginStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      loginSuccess: (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      },
      loginFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
      logout: (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      },
    },
  });


  export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
  export default authSlice.reducer;
