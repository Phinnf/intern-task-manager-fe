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
import { useSelector, useDispatch } from "react-redux";
import { addTodo, toggleTodo, deleteTodo, editTodo, fetchTodos } from "../store/todoSlice";

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

    dispatch(addTodo(inputToDo.trim()));
    setInputToDo("");
  };

  const handleToggleComplete = (id) => {
    dispatch(toggleTodo(id));
  };

  const handleDeleteTodo = (id) => {
    dispatch(deleteTodo(id));
  };

  const handleEditTodo = (id, currentText) => {
    const newText = prompt("Edit your task:", currentText);
    if (newText !== null && newText.trim() !== "") {
      dispatch(editTodo(id, newText.trim()));
    }
  };

  return (
    <Container maxWidth="md" >
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Todo List
        </Typography>

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
            sx={{ minWidth: { sm: "100px" },}}>
            Add
          </Button>
        </Box>

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
          {status === "succeeded" && todos.length === 0 ? (
            <Typography align="center" color="text.secondary" sx={{ py: 2 }}>
              No tasks yet!
            </Typography>
          ) : (
            todos.map((todo) => (
              <ListItem
                key={todo._id || todo.id}
                disablePadding
                secondaryAction={
                  <Box sx={{ display: "flex", gap: { xs: 0, sm: 1 } }}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditTodo(todo._id || todo.id, todo.taskText)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Description">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={(e) => handlePopoverEvent(e, todo._id || todo.id)}>
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
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
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
          )}
        </List>
      </Paper>
    </Container>
  );
}

export default TodoList;