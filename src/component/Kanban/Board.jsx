import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import Column from "./Column";
import { boardData } from "./MockData";
import { Droppable } from "../../util/Droppable";
import { DragDropProvider } from "@dnd-kit/react";

const Board = () => {
  const [columns, setColumns] = useState(boardData);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const handleAddNewColumn = () => {
    if (!newColumnTitle.trim()) return;
    const newColumn = {
      id: `column-${Date.now()}`,
      title: newColumnTitle,
      tasks: [],
    };
    setColumns([...columns, newColumn]);
    setNewColumnTitle("");
    setIsAddingColumn(false);
  };

  const handleDeleteColumn = (idToRemove) => {
    setColumns(columns.filter((col) => col.id !== idToRemove));
  };

  const handleRenameColumn = (idToRename, newTitle) => {
    setColumns(
      columns.map((col) =>
        col.id === idToRename ? { ...col, title: newTitle } : col,
      ),
    );
  };

  const handleAddTask = (columnId, taskContent) => {
    const newTask = {
      id: `task-${Date.now()}`,
      content: taskContent,
    };
    setColumns(
      columns.map((col) =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col,
      ),
    );
  };

  const handleDeleteTask = (columnId, taskId) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId ?
          { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
        : col,
      ),
    );
  };

  const handleRenameTask = (columnId, taskId, newContent) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId ?
          {
            ...col,
            tasks: col.tasks.map((t) =>
              t.id === taskId ? { ...t, content: newContent } : t,
            ),
          }
        : col,
      ),
    );
  };

  let addColumnUI = false;
  if (isAddingColumn === true) {
    addColumnUI = (
      <Box sx={{ bgcolor: "white", p: 1, borderRadius: 1 }}>
        <TextField
          size="small"
          fullWidth
          autoFocus
          placeholder="Column name..."
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Stack direction="row" spacing={1}>
          <Button variant="contained" size="small" onClick={handleAddNewColumn}>
            Add Column
          </Button>
          <Button size="small" onClick={() => setIsAddingColumn(false)}>
            Cancel
          </Button>
        </Stack>
      </Box>
    );
  } else {
    addColumnUI = (
      <Button
        variant="contained"
        onClick={() => setIsAddingColumn(true)}
        sx={{
          width: "100%",
          justifyContent: "flex-start",
          color: "black",
          bgcolor: "rgba(255, 255, 255, 0.4)",
          "&:hover": { bgcolor: "rgba(255, 255, 255, 0.6)" },
        }}>
        + Add new column
      </Button>
    );
  }

  const moveTask = (boardData, taskId, targetColumnId) => {
    let taskToMove = null;

    // 1. Remove task from source column
    const newBoard = boardData.map((col) => {
      const taskIndex = col.tasks.findIndex((t) => t.id === taskId);

      if (taskIndex !== -1) {
        taskToMove = col.tasks[taskIndex];
        return {
          ...col,
          tasks: col.tasks.filter((t) => t.id !== taskId),
        };
      }
      return col;
    });

    if (!taskToMove) return boardData; // task not found

    // 2. Add task to target column
    const finalBoard = newBoard.map((col) => {
      if (col.id === targetColumnId) {
        return {
          ...col,
          tasks: [...col.tasks, taskToMove], // add to end
        };
      }
      return col;
    });
    return finalBoard;
  };

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.operation.target) {
          const source = event.operation.source.id;
          const target = event.operation.target.id;
          const updatedBoard = moveTask(columns, source, target);
          setColumns(updatedBoard);
        }
      }}>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          padding: 3,
          alignItems: "flex-start",
          overflowX: "auto",
        }}>
        {columns.map((columnData, index) => (
          <Droppable key={index} id={columnData.id}>
            <Column
              key={columnData.id}
              id={columnData.id}
              title={columnData.title}
              tasks={columnData.tasks}
              onDelete={handleDeleteColumn}
              onRename={handleRenameColumn}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onRenameTask={handleRenameTask}
            />
          </Droppable>
        ))}
        <Box sx={{ minWidth: 300 }}>{addColumnUI}</Box>
      </Box>
    </DragDropProvider>
  );
};

export default Board;
