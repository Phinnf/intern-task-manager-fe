import * as React from "react";
import { API_URL } from "../../config/api";
import {
  Box,
  Grid,
  Select,
  FormControl,
  MenuItem,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export default function AddControlDialog({
  open,
  handleClose,
  defaultParentId,
  defaultParentModel = "RootNode",
  nodeToEdit,
}) {
  const [formData, setFormData] = React.useState({
    parentId: defaultParentId,
    parentModel: defaultParentModel,
    name: "",
    description: "",
    category: "Security",
    owner: "",
    status: "Active",
  });

  const [riskNodes, setRiskNodes] = React.useState([]);

  React.useEffect(() => {
    if (nodeToEdit) {
      setFormData({
        parentId: nodeToEdit.parentId || defaultParentId,
        parentModel: nodeToEdit.parentModel || defaultParentModel,
        name: nodeToEdit.name || nodeToEdit.title || "",
        description: nodeToEdit.description || "",
        category: nodeToEdit.category || "Security",
        owner: nodeToEdit.owner || "",
        status: nodeToEdit.status || "Active",
      });
    } else {
      setFormData({
        parentId: defaultParentId,
        parentModel: defaultParentModel,
        name: "",
        description: "",
        category: "Security",
        owner: "",
        status: "Active",
      });
    }
  }, [nodeToEdit, open, defaultParentId, defaultParentModel]);

  React.useEffect(() => {
    const fetchRiskNodes = async () => {
      try {
        const response = await fetch(`${API_URL}/api/risk-nodes`, {
          method: "GET",
        });
        const result = await response.json();
        if (result.success) {
          // FILTER: Only show risk nodes that belong to the current root node (defaultParentId)
          const filteredRisks = result.data.filter(
            (risk) => risk.parentId === defaultParentId,
          );
          setRiskNodes(filteredRisks);
        }
      } catch (error) {
        console.error("Error fetching risk nodes:", error);
      }
    };

    if (open) {
      fetchRiskNodes();
    }
  }, [open, defaultParentId]);

  // Handle input changes for form fields
  const handleChange = (e) => {
    // Extract 'name' (field identifier) and 'value' (user input) from the event target
    const { name, value } = e.target;
    if (name === "parentId") {
      // If 'parentId' changes, check if it matches the default (RootNode)
      // to assign the correct 'parentModel' for the backend
      if (value === defaultParentId) {
        setFormData((prev) => ({
          ...prev,
          parentId: value,
          parentModel: defaultParentModel, // Use the prop value
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          parentId: value,
          parentModel: "Risk",
        }));
      }
    } else {
      // Update standard fields by preserving existing values and overriding the specific field [name]
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isEdit = !!nodeToEdit;
    const url =
      isEdit ?
        `${API_URL}/api/control-nodes/${nodeToEdit._id}`
      : `${API_URL}/api/control-nodes`;

    try {
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        console.log(
          `Control node ${isEdit ? "updated" : "created"} successfully:`,
          result.data,
        );
        handleClose();
        window.location.reload();
      } else {
        alert(
          `Failed to ${isEdit ? "update" : "create"} ControlNode: ${result.message}`,
        );
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Network error. Please check if the backend server is running.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {nodeToEdit ? "Edit Control" : "Add New Control"}
      </DialogTitle>
      <DialogContent sx={{ padding: "24px" }}>
        <form
          onSubmit={handleSubmit}
          id="add-control-form"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
              Parent Risk *
            </Typography>
            <FormControl fullWidth>
              <Select
                name="parentId"
                value={formData.parentId}
                onChange={handleChange}
                variant="outlined"
                sx={{ borderRadius: "8px", height: "42px" }}>
                <MenuItem value={defaultParentId}>
                  <em>Default (Root Node)</em>
                </MenuItem>
                {riskNodes.map((risk) => (
                  <MenuItem key={risk._id} value={risk._id}>
                    {risk.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
              Control Name *
            </Typography>
            <TextField
              autoFocus
              required
              name="name"
              label="e.g., Access Control"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
              Description *
            </Typography>
            <TextField
              required
              name="description"
              label="Describe the control"
              type="text"
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              value={formData.description}
              onChange={handleChange}
            />
          </Box>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: "bold" }}>
                Category *
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{ borderRadius: "8px", height: "42px" }}>
                  <MenuItem value="Security">Security</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                  <MenuItem value="Compliance">Compliance</MenuItem>
                  <MenuItem value="Financial">Financial</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={6}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: "bold" }}>
                Owner *
              </Typography>
              <TextField
                required
                name="owner"
                label="e.g., IT Admin"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.owner}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={12}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: "bold" }}>
                Status *
              </Typography>
              <FormControl fullWidth>
                <Select
                  variant="outlined"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  sx={{ borderRadius: "8px", height: "42px" }}>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions sx={{ margin: "0px 5px 10px 10px " }}>
        <Button
          type="submit"
          form="add-control-form"
          sx={{ flex: 1, color: "white", backgroundColor: "#e7000b" }}>
          Submit request
        </Button>
        <Button
          onClick={handleClose}
          sx={{ flex: 1, color: "black", backgroundColor: "#f6f3f4" }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
