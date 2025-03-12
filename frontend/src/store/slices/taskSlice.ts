import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  dueDate: string;
  order: number;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tasks`, {
    withCredentials: true,
  });
  return data;
});

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task: Omit<Task, '_id' | 'order'>) => {
    const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}`, task, {
      withCredentials: true,
    });
    return data;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, task }: { id: string; task: Partial<Task> }) => {
    const { data } = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${id}`,
      task,
      { withCredentials: true }
    );
    return data;
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string) => {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${id}`, {
      withCredentials: true,
    });
    return id;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload || [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
