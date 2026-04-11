import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:4000/api/todos";

// Thunk for fetching todos
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }
  return response.json();
});

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: {
      prepare: (taskText) => ({
        payload: {
          id: Date.now(),
          taskText,
          completed: false,
        },
      }),
      reducer: (state, action) => {
        state.items.push(action.payload);
      },
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    editTodo: {
      prepare: (id, taskText) => ({
        payload: { id, taskText },
      }),
      reducer: (state, action) => {
        const { id, taskText } = action.payload;
        const todo = state.items.find((t) => t.id === id);
        if (todo) {
          todo.taskText = taskText;
        }
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addTodo, toggleTodo, deleteTodo, editTodo } = todoSlice.actions;
export default todoSlice.reducer;
