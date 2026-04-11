import React, { useState } from "react";

import {
  Typography,
  Paper,
  Stack,
  TextField,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Task from "./Task";
import { Draggable } from "../../util/Draggable";

const Column = ({
  id,
  title,
  tasks,
  onDelete,
  onRename,
  onAddTask,
  onDeleteTask,
  onRenameTask,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleText, setEditTitleText] = useState(title);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");

  const handleSaveTitle = () => {
    if (editTitleText.trim() && editTitleText !== title) {
      onRename(id, editTitleText);
    }
    setIsEditingTitle(false);
  };

  const handleSaveTask = () => {
    if (newTaskContent.trim()) {
      onAddTask(id, newTaskContent);
      setNewTaskContent("");
      setIsAddingTask(false);
    }
  };

  let titleUI = false;
  if (isEditingTitle === true) {
    titleUI = (
      <TextField
        autoFocus
        size="small"
        value={editTitleText}
        onChange={(e) => setEditTitleText(e.target.value)}
        onBlur={handleSaveTitle}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSaveTitle();
          if (e.key === "Escape") {
            setEditTitleText(title);
            setIsEditingTitle(false);
          }
        }}
        sx={{ bgcolor: "white", flex: 1, mr: 1 }}
      />
    );
  } else {
    titleUI = (
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          cursor: "text",
          flex: 1,
          pl: 1,
          color: "#111827",
        }}
        onClick={() => setIsEditingTitle(true)}>
        {title}
      </Typography>
    );
  }

  let addTaskUI;
  if (isAddingTask === true) {
    addTaskUI = (
      <Box>
        <TextField
          fullWidth
          multiline
          autoFocus
          size="small"
          placeholder="Enter card title..."
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          sx={{ bgcolor: "white", borderRadius: 1, mb: 1 }}
        />
        <Stack direction="row" spacing={1}>
          <Button variant="contained" size="small" onClick={handleSaveTask}>
            Add card
          </Button>
          <Button size="small" onClick={() => setIsAddingTask(false)}>
            Cancel
          </Button>
        </Stack>
      </Box>
    );
  } else {
    addTaskUI = (
      <Typography
        variant="body2"
        onClick={() => setIsAddingTask(true)}
        sx={{
          cursor: "pointer",
          color: "rgb(31, 61, 122)",
          padding: 1,
          "&:hover": { bgcolor: "rgba(0,0,0,0.08)", borderRadius: 1 },
        }}>
        + Add a card
      </Typography>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        minWidth: 300,
        bgcolor: "#FFFFFF",
        p: 2,
        borderRadius: 2,
      }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}>
        {titleUI}
        <IconButton size="small" color="error" onClick={() => onDelete(id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      <Stack spacing={2}>
        {tasks.map((task, index) => (
          <Draggable key={index} id={task.id}>
            <Task
              key={task.id || index}
              content={task.content}
              onDelete={() => onDeleteTask(id, task.id)}
              onRename={(newContent) => onRenameTask(id, task.id, newContent)}
            />
          </Draggable>
        ))}
        {addTaskUI}
      </Stack>
    </Paper>
  );
};

export default Column;
