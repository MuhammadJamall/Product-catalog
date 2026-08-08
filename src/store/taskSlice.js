import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

const API_URL = '/tasks/';

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (_, thunkAPI) => {
        try {
            const response = await api.get(API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch Tasks');
            }
            const data = await response.json();
            return Array.isArray(data) ? data : data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message || 'Something went wrong'
            );
        }
    }
);

export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (taskData, { rejectWithValue }) => {
        try {
            const res = await api.post(API_URL, {
                ...taskData,
                assigned_to: Number(taskData.assigned_to),
            });

            const data = await res.json();

            if (!res.ok) return rejectWithValue(data);

            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);
export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, ...updatedData }, { rejectWithValue }) => {
        try {
            const res = await api.put(`${API_URL}${id}`, {
                ...updatedData,
                assigned_to: Number(updatedData.assigned_to),
            });

            const data = await res.json();

            if (!res.ok) return rejectWithValue(data);

            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);
export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.delete(`${API_URL}${id}`);
            if (!res.ok) {
                const data = await res.json().catch(() => null);
                return rejectWithValue(data?.detail || data || 'Failed to delete task');
            }
            return id;
        } catch (err) {
            return rejectWithValue(err.message || 'Network error');
        }
    }
);
export const fetchTaskByID = createAsyncThunk(
    'tasks/fetchTaskByID',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}${id}`);
            if (!response.ok) {
                throw new Error('failed to fetch task');
            }
            const data = await response.json();
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);
const tasksSlice = createSlice({
    name: "tasks",
    initialState: {
        items: [],
        selectedTask: null,
        status: "idle",
        error: null,
        createStatus: "idle",
        createError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = "Succeeded";
                state.items = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = "Failed";
                state.error = action.payload;
            })
            .addCase(createTask.pending, (state) => {
                state.createStatus = "loading";
                state.createError = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.createStatus = "Succeeded";
                state.items.push(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.createStatus = "Failed";
                state.createError = action.payload;
            })
            .addCase(updateTask.pending, (state) => {
                state.status = "Loading";
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.status = "Succeeded";
                state.items = state.items.map((task) =>
                    task.id === action.payload.id ? action.payload : task
                );
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.status = "Failed";
                state.error = action.payload;
            })
            .addCase(deleteTask.pending, (state) => {
                state.status = "Loading";
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.status = "Succeeded";
                state.items = state.items.filter((task) => task.id !== action.payload);
            })
            .addCase(fetchTaskByID.pending, (state) => {
                state.status = "loading";
                state.error = null;
                state.selectedTask = null;
            })
            .addCase(fetchTaskByID.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.selectedTask = action.payload;
            })
            .addCase(fetchTaskByID.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
                state.selectedTask = null;
            });
    }
});
export default tasksSlice.reducer;