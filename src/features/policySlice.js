// redux/policySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllPendingPolicy, submitPolicyData, updatePolicyStatus } from './policyapi';

export const submitPolicy = createAsyncThunk(
  'policy/submitPolicy',
  async ({ userId, policyData, token }, { rejectWithValue }) => {
    try {
      const response = await submitPolicyData(userId, policyData, token);
      return response; 
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAllPendingPolicy = createAsyncThunk(
  "policies/fetchAllPendingPolicy",
  async ({ page = 1, limit = 10, manufacturer }, { rejectWithValue }) => {
    try {
      const data = await getAllPendingPolicy(page, limit, manufacturer);
      return data; 
    } catch (err) {
      console.error("Error in fetchAllPendingPolicy Thunk:", err);
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  }
);
  export const updatePolicy = createAsyncThunk(
    'policy/updatePolicy',
    async ({ userId, type,  policyData }, { rejectWithValue }) => {
      try {
        const response = await updatePolicyStatus(userId,  type, policyData);
        return response; 
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  

  const policySlice = createSlice({
    name: 'policy',
    initialState: {
      policy: null,
      pendingPolicy: {
        data: [], 
        currentPage: 1,
        totalPages: 1,
        totalPoliciesCount: 0
      },
      policyUpdate: [],
      status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(submitPolicy.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(submitPolicy.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.policy = action.payload.data;
        })
        .addCase(submitPolicy.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        .addCase(fetchAllPendingPolicy.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(fetchAllPendingPolicy.fulfilled, (state, action) => {
          state.pendingPolicy = {
            ...action.payload,
            data: action.payload.data,
          };
          state.status = 'succeeded';
        })
        .addCase(fetchAllPendingPolicy.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        .addCase(updatePolicy.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(updatePolicy.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.policyUpdate = action.payload;
        })
        .addCase(updatePolicy.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
    },
  });
  
  export default policySlice.reducer;
  