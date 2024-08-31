import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import {
  addNewAgent,
  deleteAgent,
  getAllMbAgents,
  getAllMgAgents,
} from "./adminApi";

export const fetchAllMbAgents = createAsyncThunk(
  "agents/fetchAllMbAgents",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllMbAgents();
      return data.mbAgents;
    } catch (err) {
      console.error("Error in fetchAllMbAgents Thunk:", err);
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  }
);

export const fetchAllMgAgents = createAsyncThunk(
  "agents/fetchAllMgAgents",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllMgAgents();
      return data.mgAgents;
    } catch (err) {
      console.error("Error in fetchAllMgAgents Thunk:", err);
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  }
);

export const addAgent = createAsyncThunk(
  "agents/addAgent",
  async (agentData, { rejectWithValue }) => {
    try {
      const response = await addNewAgent(agentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteAgentData = createAsyncThunk(
  "agents/deleteAgent",
  async (userId, { rejectedValue }) => {
    try {
      const response = await deleteAgent(userId);
      return response;
    } catch (error) {
      return rejectedValue(error.response.data);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    mbAgents: [],
    mgAgents: [],
    newAgent: [],
    deleteAgent: [],
    status: "idle",
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMbAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMbAgents.fulfilled, (state, action) => {
        state.mbAgents = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllMbAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllMgAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMgAgents.fulfilled, (state, action) => {
        state.mgAgents = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllMgAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAgent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addAgent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.newAgent.push(action.payload);
      })
      .addCase(addAgent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteAgentData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAgentData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deleteAgent.push(action.payload);
      })
      .addCase(deleteAgentData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
