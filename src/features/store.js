import { configureStore, createReducer } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import adminReducer from './adminDashboardSlice'
import masterReducer from './VehcleOptionsSlice'
import usersReducer from './getUserSlice'
import policyReducer from './policySlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    master: masterReducer,
    users: usersReducer,
    policy: policyReducer,
  },
});
