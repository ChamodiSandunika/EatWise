/**
 * Redux Auth Slice
 * Manages authentication state using Redux Toolkit
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, RegisterData, User } from '../types/auth.types';
import { loginAPI, registerAPI } from '../services/api';
import { saveUserToStorage, removeUserFromStorage } from '../utils/storage';

// Initial state
const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

/**
 * Async thunk for user login
 * Handles API call, storage, and state updates
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await loginAPI(credentials);
      
      // Save to AsyncStorage for persistent login
      await saveUserToStorage(response.user);
      
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

/**
 * Async thunk for user registration
 * Handles API call and returns user data
 */
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await registerAPI(data);
      
      // Optional: Auto-login after registration
      // await saveUserToStorage(response.user);
      
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

/**
 * Async thunk for logout
 * Clears storage and state
 */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await removeUserFromStorage();
      return;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Restore user session from AsyncStorage
     * Called on app startup
     */
    restoreSession: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isLoading = false;
      state.error = null;
    },
    
    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },
    
    /**
     * Manual logout (sync)
     */
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optional: Auto-login after registration
        // state.isLoggedIn = true;
        // state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout user
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { restoreSession, clearError, logout } = authSlice.actions;
export default authSlice.reducer;
