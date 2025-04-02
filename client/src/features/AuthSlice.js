import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInst from '../utils/axiosInst';

const getStoredToken = () => localStorage.getItem('access_token') || null;

export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue, dispatch }) => {
  try {
    const { data } = await axiosInst.post('/login', userData);
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token); // Add this line
    
    const userResponse = await dispatch(getUser());
    return { 
      token: data.access_token,
      user: userResponse.payload.user 
    };
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.error?.message || 
      error.response?.data?.message || 
      'Login failed. Check your credentials.'
    );  
  }
});

export const initializeAuth = createAsyncThunk('auth/initialize', async (_, { dispatch }) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    await dispatch(getUser()); 
  }
});

export const getUser= createAsyncThunk(
  'auth/getUser', async(_,{rejectWithValue})=>{
  try {
    const response = await axiosInst.get('/user');
    return {user: response.data, token: getStoredToken()};
  } catch (error){
    localStorage.removeItem('access_token');
    return rejectWithValue('Please login!');
  }
});

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInst.post('/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { getState }) => {
  try {
    await axiosInst.post('/logout'); 
  } catch (e) {
    console.error('Logout error:', e);
  } finally {
    localStorage.clear(); 
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch User
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(getUser.rejected, (state) => {
        state.user = null;
        state.token = null;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;