import React, { useState, useCallback, useEffect } from "react";
import { API_URL } from "../../config/api";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// Import Custom Nodes
import RootNode from "./RootNode";
import RiskNode from "./RiskNode";
import ControlNode from "./ControlNode";
import AddRiskDialog from "./AddRiskDialog";
import AddControlDialog from "./AddControlDialog";
import AddRootDialog from "./AddRootDialog";

// Register node types with React Flow
const nodeTypes = {
  rootNode: RootNode,
  riskNode: RiskNode,
  controlNode: ControlNode,
};

export default function GRCReactFlow() {
  // STATE: Store nodes and edges for the diagram
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // STATE: for Edit Dialogs
  const [editRiskOpen, setEditRiskOpen] = useState(false);
  const [editControlOpen, setEditControlOpen] = useState(false);
  const [addRootOpen, setAddRootOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const handleEditNode = useCallback((nodeData) => {
    setSelectedNode(nodeData);
    if (nodeData.type === "Risk") {
      setEditRiskOpen(true);
    } else if (nodeData.type === "Control") {
      setEditControlOpen(true);
    } else {
      setAddRootOpen(true);
    }
  }, []);

  const handleDeleteNode = useCallback(async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`))
      return;

    let endpoint = "";
    if (type === "risk") endpoint = "risk-nodes";
    else if (type === "control") endpoint = "control-nodes";
    else endpoint = "root-nodes";

    try {
      const response = await fetch(`${API_URL}/api/${endpoint}/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setNodes((nds) => nds.filter((node) => node.id !== id));
        setEdges((eds) =>
          eds.filter((edge) => edge.source !== id && edge.target !== id),
        );
      } else {
        alert("Failed to delete node: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting node:", error);
      alert("Network error while deleting node.");
    }
  }, []);

  // EFFECT: Fetch and process data once when the component mounts
  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        // Use Promise.all to fetch all three endpoints concurrently
        const [rootRes, riskRes, controlRes] = await Promise.all([
          fetch(`${API_URL}/api/root-nodes`),
          fetch(`${API_URL}/api/risk-nodes`),
          fetch(`${API_URL}/api/control-nodes`),
        ]);

        const rootData = await rootRes.json();
        const riskData = await riskRes.json();
        const controlData = await controlRes.json();

        // Check if all API calls were successful
        if (!rootData.success || !riskData.success || !controlData.success) {
          console.error("Error: Failed to fetch data from backend!");
          return;
        }

        // FORMAT DATA FOR REACT FLOW USING .MAP()

        // --- Column 1: Root Nodes (Position x: 0) ---
        const rootNodes = rootData.data.map((item, index) => ({
          id: item._id,
          type: "rootNode",
          position: { x: 0, y: index * 350 },
          data: {
            ...item,
            type: "Root",
            onEdit: handleEditNode,
            onDelete: handleDeleteNode,
          },
        }));

        // --- Column 2: Risk Nodes (Position x: 400) ---
        const riskNodes = riskData.data.map((item, index) => ({
          id: item._id,
          type: "riskNode",
          position: { x: 400, y: index * 350 },
          data: {
            ...item,
            title: item.name,
            type: "Risk",
            onEdit: handleEditNode,
            onDelete: handleDeleteNode,
          }, // Adapt BE 'name' to FE 'title'
        }));

        // Create edges from Root -> Risk
        // Filter out items without parentId, then map to edge objects
        const riskEdges = riskData.data
          .filter((item) => item.parentId)
          .map((item) => ({
            id: `edge-${item.parentId}-to-${item._id}`,
            source: item.parentId,
            target: item._id,
            style: { stroke: "#d32f2f", strokeWidth: 1.5 }, // Red color for Risk
          }));

        // --- Column 3: Control Nodes (Position x: 800) ---
        const controlNodes = controlData.data.map((item, index) => ({
          id: item._id,
          type: "controlNode",
          position: { x: 800, y: index * 350 },
          data: {
            ...item,
            title: item.name,
            type: "Control",
            onEdit: handleEditNode,
            onDelete: handleDeleteNode,
          }, // Adapt BE 'name' to FE 'title'
        }));

        // Create edges from Risk -> Control
        const controlEdges = controlData.data
          .filter((item) => item.parentId)
          .map((item) => ({
            id: `edge-${item.parentId}-to-${item._id}`,
            source: item.parentId,
            target: item._id,
            style: { stroke: "#1976d2", strokeWidth: 1.5 }, // Blue color for Control
          }));

        // Use spread operator to merge all nodes and edges into single arrays
        setNodes([...rootNodes, ...riskNodes, ...controlNodes]);
        setEdges([...riskEdges, ...controlEdges]);
      } catch (error) {
        console.error("Error loading GRC data:", error);
      }
    };

    fetchAndProcessData();
  }, [handleDeleteNode, handleEditNode]);

  //  EVENT HANDLERS: Handle drag and drop, selection, etc. FlowReact
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  // 4. RENDER
  return (
    <div style={{ width: "100%", height: "95vh", backgroundColor: "#fdfdfd" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView // Automatically zoom and pan to fit all nodes
      >
        <Background color="#e0e0e0" /> {/* Dotted/Grid background */}
        <Controls /> {/* Zoom/Pan toolbar */}
        <Panel position="top-left">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setAddRootOpen(true)}
            sx={{
              backgroundColor: "#e7000b",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "#115293",
              },
            }}>
            Add Root Node
          </Button>
        </Panel>
      </ReactFlow>

      {/* Edit Dialogs */}
      <AddRootDialog
        open={addRootOpen}
        handleClose={() => {
          setAddRootOpen(false);
          setSelectedNode(null);
        }}
        nodeToEdit={selectedNode}
      />
      <AddRiskDialog
        open={editRiskOpen}
        handleClose={() => {
          setEditRiskOpen(false);
          setSelectedNode(null);
        }}
        nodeToEdit={selectedNode}
      />
      <AddControlDialog
        open={editControlOpen}
        handleClose={() => {
          setEditControlOpen(false);
          setSelectedNode(null);
        }}
        nodeToEdit={selectedNode}
        defaultParentId={selectedNode?.parentId}
      />
    </div>
  );
}
