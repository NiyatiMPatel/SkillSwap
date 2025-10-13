import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import skillsReducer from './slices/skillsSlice';
import uiReducer from './slices/uiSlice';

/**
 * Redux store configuration with Redux Toolkit
 * - Modular slice structure
 * - Redux DevTools enabled in development
 * - Easy to extend with new slices (e.g., messaging in Phase 2)
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    skills: skillsReducer,
    ui: uiReducer,
    // TODO Phase 2: Add messaging slice
    // messaging: messagingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types if needed
        ignoredActions: [],
      },
    }),
  devTools: import.meta.env.DEV, // Enable Redux DevTools in development only
});

export default store;
