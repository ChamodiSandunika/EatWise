/**
 * Redux Store Configuration
 * Central store with all reducers
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import mealsReducer from './mealsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    meals: mealsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// TypeScript types for store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
