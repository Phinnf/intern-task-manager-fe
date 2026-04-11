import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import NodeFooter from "./NodeFooter";

export default function RiskNode({ data }) {
  // Helper function to get color based on Likelihood/Impact level
  const getLevelStyle = (level) => {
    switch (level) {
      case "High":
        return { backgroundColor: "#ffebee", color: "#c62828" }; // Red
      case "Medium":
        return { backgroundColor: "#fff3e0", color: "#e65100" }; // Orange/Yellow
      case "Low":
        return { backgroundColor: "#e8f5e9", color: "#2e7d32" }; // Green
      default:
        return { backgroundColor: "#f5f5f5", color: "#616161" };
    }
  };

  // Helper function to get color based on Risk Status
  const getStatusStyle = (status) => {
    switch (status) {
      case "Open":
        return { backgroundColor: "#fbe9e7", color: "#d84315" }; // Deep Orange
      case "Mitigated":
        return { backgroundColor: "#e3f2fd", color: "#1565c0" }; // Blue
      case "Closed":
        return { backgroundColor: "#eeeeee", color: "#616161" }; // Gray
      default:
        return { backgroundColor: "#f5f5f5", color: "#616161" };
    }
  };

  return (
    <>
      {/* Handle RootNode */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "transparent", border: "none" }}
      />

      <Card
        sx={{
          minWidth: 280,
          maxWidth: 320,
          borderRadius: "12px",
          border: "1px solid #ffcdd2",
          backgroundColor: "#fffcfc",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}>
        <CardContent sx={{ p: "20px", pb: "16px" }}>
          {/* Tag RISK */}
          <Typography
            variant="caption"
            sx={{
              backgroundColor: "#ffedd4",
              color: "#9f2d00",
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "4px",
              display: "inline-block",
              mb: 1.5,
              textTransform: "uppercase",
              fontFamily: "inherit",
            }}>
            Risk
          </Typography>

          {/* Risk title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              lineHeight: 1.2,
              mb: 1,
              color: "#1a1a1a",
            }}>
            {data.title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{ color: "#555", mb: 2, fontSize: "0.9rem" }}>
            {data.description}
          </Typography>

          {/* Tags Section */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
            {/* Tag Likelihood  */}
            <Typography
              variant="caption"
              sx={{
                ...getLevelStyle(data.likelihood),
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "4px",
                display: "inline-block",
              }}>
              Likelihood: {data.likelihood}
            </Typography>

            {/* Tag Impact  */}
            <Typography
              variant="caption"
              sx={{
                ...getLevelStyle(data.impact),
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "4px",
                display: "inline-block",
              }}>
              Impact: {data.impact}
            </Typography>

            {/* Tag Status  */}
            <Typography
              variant="caption"
              sx={{
                ...getStatusStyle(data.status),
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "4px",
                display: "inline-block",
              }}>
              {data.status}
            </Typography>
          </Box>

          {/* Render Footer (Info, Edit, Delete) */}
          <NodeFooter 
            onEdit={() => data.onEdit && data.onEdit(data)} 
            onDelete={() => data.onDelete && data.onDelete(data._id, "risk")} 
          />
        </CardContent>
      </Card>

      {/* Handle for ControlNode */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "transparent", border: "none" }}
      />
    </>
  );
}
