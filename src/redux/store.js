import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';

export const store = configureStore({
  reducer: rootReducer,  // Use rootReducer to manage the state
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),  // Default middleware
  devTools: process.env.NODE_ENV !== 'production',  // Enable Redux DevTools in non-production environments
});
