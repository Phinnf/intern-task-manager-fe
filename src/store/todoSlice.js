import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../config/api";

export const fetchTodos = createAsyncThunk("todos/fetchTodo", async () => {
  const response = await fetch(`${API_URL}/api/todos`);
  if (!response.ok) {
    throw new Error(`Failed to fetch todos ${response.status}`);
  }
  const result = await response.json();
  return result.data;
});

export const addTodosAPI = createAsyncThunk(
  "todos/addTodo",
  async (taskText) => {
    const newTodoData = { taskText, completed: false };
    const response = await fetch(`${API_URL}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodoData),
    });
    if (!response.ok) {
      throw new Error(`Failed to add todo ${response.status}`);
    }
      const result = await response.json();
      return result.data;
  },
);
export const editTodosAPI = createAsyncThunk(
  "todos/editTodo",
  async (editTodoData) => {
    const id = editTodoData._id;
    const response = await fetch(`${API_URL}/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editTodoData),
    });
    if (!response.ok) throw new Error(`Failed to edit todo ${response.status}`);
     const result = await response.json();
     return result.data;
  },
);

export const toggleTodo = createAsyncThunk("todos/toggleTodo", async (id, thunkAPI) => {
  const state = thunkAPI.getState();
  const existingTodo = state.todos.items.find((todo) => todo._id === id);
  
  const response = await fetch(`${API_URL}/api/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !existingTodo.completed }),
  });
  if (!response.ok) throw new Error("Failed to toggle todo");
  
  const result = await response.json();
  return result.data;
});

export const deleteTodoAPI = createAsyncThunk(
  "todos/deleteTodo",
  async (id) => {
    const response = await fetch(`${API_URL}/api/todos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok)
      throw new Error(`Failed to delete todo ${response.status}`);
    return id;
  },
);

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
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
      })
      .addCase(addTodosAPI.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteTodoAPI.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo._id !== action.payload);
      })
      .addMatcher(
        (action) =>
          action.type === editTodosAPI.fulfilled.type ||
          action.type === toggleTodo.fulfilled.type,
        (state, action) => {
          const index = state.items.findIndex(
            (todo) => todo._id === action.payload._id,
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        },
      );
  },
});

export default todoSlice.reducer;
