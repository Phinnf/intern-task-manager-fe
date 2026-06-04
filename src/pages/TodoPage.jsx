import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Paper,
  Box,
  Divider,
  Popover,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTodos,
  addTodosAPI,
  editTodosAPI,
  toggleTodo,
  deleteTodoAPI,
} from "../store/todoSlice";
import { API_URL } from "../config/api";

function TodoList() {
  const { items: todos, status, error } = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  const [inputToDo, setInputToDo] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTodoId, setSelectedTodoId] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  const handlePopoverEvent = (e, todoId) => {
    setAnchorEl(e.currentTarget);
    setSelectedTodoId(todoId);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedTodoId(null);
  };
  const open = Boolean(anchorEl);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (inputToDo.trim() === "") return;

    dispatch(addTodosAPI(inputToDo.trim()));
    setInputToDo("");
  };

  const handleToggleComplete = (id) => {
    dispatch(toggleTodo(id));
  };

  const handleDeleteTodo = (id) => {
    dispatch(deleteTodoAPI(id));
  };

  const handleEditTodo = (id, currentText) => {
    const newText = prompt("Edit your task:", currentText);
    if (newText !== null && newText.trim() !== "") {
      dispatch(editTodosAPI({ _id: id, taskText: newText.trim() }));
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch(`${API_URL}/api/todos/export`);
      if (!response.ok) throw new Error("Failed to export todos");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "todos.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export CSV Error:", error);
      alert("Error exporting CSV: " + error.message);
    }
  };

  const handleImportCSV = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvText = event.target?.result;
        if (!csvText) throw new Error("Failed to read CSV file content");

        const response = await fetch(`${API_URL}/api/todos/import`, {
          method: "POST",
          headers: {
            "Content-Type": "text/csv",
          },
          body: csvText,
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to import CSV");
        }

        alert(result.message || "Imported successfully!");
        dispatch(fetchTodos());
      } catch (error) {
        console.error("Import CSV Error:", error);
        alert("Error importing CSV: " + error.message);
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // Reset file input
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Todo List
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            gap: 2,
            mb: 2,
          }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<FileUploadIcon />}
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-1px)",
              },
            }}>
            Import CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleImportCSV}
            />
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            size="small"
            onClick={handleExportCSV}
            disableElevation
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-1px)",
              },
            }}>
            Export CSV
          </Button>
        </Box>
        {/* List Input:  */}
        <Box
          component="form"
          onSubmit={handleAddTodo}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
          }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="What needs to be done?"
            value={inputToDo}
            onChange={(e) => setInputToDo(e.target.value)}
          />
          <Button
            variant="contained"
            type="submit"
            disableElevation
            sx={{ minWidth: { sm: "100px" } }}>
            Add
          </Button>
        </Box>

        {/* CSV Import/Export Actions */}

        <Divider sx={{ mb: 2 }} />

        {/* Status Handling */}
        {status === "loading" && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {status === "failed" && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* List Todo */}
        <List>
          {status === "succeeded" && todos.length === 0 ?
            <Typography align="center" color="text.secondary" sx={{ py: 2 }}>
              No tasks yet!
            </Typography>
          : todos.map((todo) => (
              <ListItem
                key={todo._id || todo.id}
                disablePadding
                secondaryAction={
                  <Box sx={{ display: "flex", gap: { xs: 0, sm: 1 } }}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          handleEditTodo(todo._id || todo.id, todo.taskText)
                        }>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Description">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={(e) =>
                          handlePopoverEvent(e, todo._id || todo.id)
                        }>
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteTodo(todo._id || todo.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Popover
                      id={`popover-${todo._id || todo.id}`}
                      open={open && selectedTodoId === (todo._id || todo.id)}
                      anchorEl={anchorEl}
                      onClose={handlePopoverClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}>
                      <Typography sx={{ p: 2 }}>{todo.taskText}</Typography>
                    </Popover>
                  </Box>
                }>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Checkbox
                    edge="start"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo._id || todo.id)}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={todo.taskText}
                  sx={{
                    mr: { xs: 12, sm: 15 },
                    "& .MuiListItemText-primary": {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                    textDecoration: todo.completed ? "line-through" : "none",
                    color: todo.completed ? "text.secondary" : "text.primary",
                  }}
                />
              </ListItem>
            ))
          }
        </List>
      </Paper>
    </Container>
  );
}

export default TodoList;
