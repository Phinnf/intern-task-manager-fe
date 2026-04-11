import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, Typography, Box, Divider } from "@mui/material";
import NodeFooter from "./NodeFooter";

export default function ControlNode({ data }) {
  // Helper function to get color based on Control Status
  const getStatusStyle = (status) => {
    return status === "Active"
      ? { backgroundColor: "#e8f5e9", color: "#2e7d32" } // Green
      : { backgroundColor: "#eeeeee", color: "#616161" }; // Gray
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "transparent", border: "none" }}
      />
      <Card
        sx={{
          minWidth: 320,
          maxWidth: 320,
          borderRadius: "12px",
          border: "1px solid #333",
          backgroundColor: "#eff6ff",
        }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              lineHeight: 1.2,
              mb: 1.5,
              color: "#1a1a1a",
            }}>
            {data.title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#555",
              mb: 1,
              fontSize: "0.9rem",
              fontWeight: 700,
            }}>
            {data.description}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {/* Box that contain main content */}
            <Box sx={{}}>
              <Typography
                variant="body2"
                sx={{
                  color: "#555",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                }}>
                CATEGORY: {data.category} -
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography
                variant="body2"
                sx={{
                  color: "#555",
                  mb: 2,
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                }}>
                OWNER: {data.owner} -
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography
                variant="body2"
                sx={{
                  color: "#555",
                  mb: 2,
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                }}>
                CONTROLLER:{" "}
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    ...getStatusStyle(data.status),
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                  }}>
                  {data.status}
                </Typography>
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ borderColor: "#8d8d8d" }} />
          <NodeFooter 
            onEdit={() => data.onEdit && data.onEdit(data)} 
            onDelete={() => data.onDelete && data.onDelete(data._id, "control")} 
          />
        </CardContent>
      </Card>
    </>
  );
}
