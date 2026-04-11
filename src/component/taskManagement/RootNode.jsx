import * as React from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import AddRiskDialog from "./AddRiskDialog";
import AddControlDialog from "./AddControlDialog";

export default function RootNode({ data }) {
  const [riskOpen, setRiskOpen] = React.useState(false);
  const [controlOpen, setControlOpen] = React.useState(false);

  const handleRiskOpen = () => setRiskOpen(true);
  const handleRiskClose = () => setRiskOpen(false);

  const handleControlOpen = () => setControlOpen(true);
  const handleControlClose = () => setControlOpen(false);

  return (
    <>
      <Card
        sx={{
          minWidth: 240,
          borderRadius: "12px",
          border: "1px solid #b9b9b9",
          backgroundColor: "#ffffff",
        }}>
        <CardContent sx={{ p: "20px" }}>
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

          {/* Department */}
          <Typography
            variant="body2"
            sx={{ color: "#555", mb: 0.5, fontSize: "1rem" }}>
            {data.department}
          </Typography>

          {/* Owner */}
          <Typography
            variant="body2"
            sx={{ color: "#555", mb: 2, fontSize: "1rem" }}>
            Owner: {data.owner}
          </Typography>

          <Divider sx={{ mb: 2, borderColor: "#f0f0f0" }} />

          {/* Typography text links */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              onClick={handleRiskOpen}
              variant="body2"
              sx={{
                color: "#d32f2f",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-block",
                width: "fit-content",
                "&:hover": { textDecoration: "underline" },
              }}>
              + Add Risk
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#1976d2",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-block",
                width: "fit-content",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={handleControlOpen}>
              + Add Control
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <AddRiskDialog
        open={riskOpen}
        handleClose={handleRiskClose}
        parentId={data.id || data._id}
      />

      <AddControlDialog
        open={controlOpen}
        handleClose={handleControlClose}
        defaultParentId={data.id || data._id}
      />

      {/* Handle - ReactFlow */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "transparent", // Hide the dot
          border: "none",
        }}
      />
    </>
  );
}
