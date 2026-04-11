import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Task = ({ content, onDelete, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isHovered, setIsHovered] = useState(false);

  const handleSaveContent = () => {
    if (editContent.trim() && editContent !== content) {
      onRename(editContent);
    } else {
      setEditContent(content);
    }
    setIsEditing(false);
  };

  let actionButtonsUI;
  if (isHovered === true || isEditing === true) {
    actionButtonsUI = (
      <Box sx={{ display: "flex", ml: 1, mt: -0.5, mr: -1 }}>
        <IconButton
          size="small"
          onClick={() => setIsEditing(true)}
          sx={{ width: 20, height: 20, mr: 0.5 }}>
          <EditIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={onDelete}
          sx={{ width: 20, height: 20 }}>
          <DeleteIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    );
  }

  let taskUI;
  if (isEditing === true) {
    taskUI = (
      <TextField
        fullWidth
        multiline
        autoFocus
        size="small"
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        onBlur={handleSaveContent}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSaveContent();
          }
          if (e.key === "Escape") {
            setEditContent(content);
            setIsEditing(false);
          }
        }}
        sx={{ bgcolor: "white", borderRadius: 1 }}
      />
    );
  } else {
    taskUI = (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}>
        <Typography
          variant="body2"
          sx={{ color: "text.primary", whiteSpace: "pre-wrap" }}>
          {content}
        </Typography>
        {actionButtonsUI}
      </Box>
    );
  }

  return (
    <Card
      sx={{
        bgcolor: "#FFFFFF",
        position: "relative",
        border: "1px solid #E5E7EB ",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <CardContent sx={{ pb: 1, "&:last-child": { pb: 2 }, color: "#6B7280" }}>
        {taskUI}
      </CardContent>
    </Card>
  );
};

export default Task;
