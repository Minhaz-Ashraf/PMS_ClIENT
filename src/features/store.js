import { configureStore, createReducer } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import adminReducer from './adminDashboardSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer
   
  },
});
