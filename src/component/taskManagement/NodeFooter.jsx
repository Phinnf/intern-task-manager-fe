import React from "react";
import { Box, Typography, Button } from "@mui/material";

export default function NodeFooter({ onEdit, onDelete }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid #eee",
        pt: 1,
        mt: 2,
      }}>
      <Typography
        variant="body2"
        color="primary"
        sx={{ cursor: "pointer", fontWeight: 500 }}>
        Info
      </Typography>
      <Box>
        <Button
          size="small"
          onClick={onEdit}
          sx={{
            textTransform: "none",
            color: "#555",
            minWidth: "auto",
            p: "0 8px",
          }}>
          Edit
        </Button>
        <Button
          size="small"
          onClick={onDelete}
          sx={{
            textTransform: "none",
            color: "#d32f2f",
            minWidth: "auto",
            p: "0 8px",
          }}>
          Delete
        </Button>
      </Box>
    </Box>
  );
}
