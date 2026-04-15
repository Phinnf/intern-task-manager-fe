import * as React from "react";
import { API_URL } from "../../config/api";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export default function AddRootDialog({ open, handleClose, nodeToEdit }) {
  const [formData, setFormData] = React.useState({
    title: "",
    department: "",
    owner: "",
  });

  React.useEffect(() => {
    if (nodeToEdit) {
      setFormData({
        title: nodeToEdit.title || "",
        department: nodeToEdit.department || "",
        owner: nodeToEdit.owner || "",
      });
    } else {
      setFormData({
        title: "",
        department: "",
        owner: "",
      });
    }
  }, [nodeToEdit, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isEdit = !!nodeToEdit;
    const url = isEdit
      ? `${API_URL}/api/root-nodes/${nodeToEdit._id}`
      : `${API_URL}/api/root-nodes`;

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
        handleClose();
        window.location.reload(); 
      } else {
        alert(
          `Failed to ${isEdit ? "update" : "create"} RootNode: ` +
            result.message
        );
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Network error. Please check if the backend server is running.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{nodeToEdit ? "Edit Root Node" : "Add New Root Node"}</DialogTitle>
      <DialogContent sx={{ padding: "24px", minWidth: "400px" }}>
        <form
          onSubmit={handleSubmit}
          id="add-root-form"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
              Title *
            </Typography>
            <TextField
              autoFocus
              required
              name="title"
              label="e.g., Enterprise Risk Management"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={handleChange}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
              Department *
            </Typography>
            <TextField
              required
              name="department"
              label="e.g., IT Security"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.department}
              onChange={handleChange}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
              Owner *
            </Typography>
            <TextField
              required
              name="owner"
              label="e.g., CIO"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.owner}
              onChange={handleChange}
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions sx={{ margin: "0px 10px 15px 10px" }}>
        <Button
          type="submit"
          form="add-root-form"
          sx={{ flex: 1, color: "white", backgroundColor: "#e7000b", "&:hover": { backgroundColor: "#c4000a" } }}
        >
          Submit
        </Button>
        <Button
          onClick={handleClose}
          sx={{ flex: 1, color: "black", backgroundColor: "#f6f3f4", "&:hover": { backgroundColor: "#e0e0e0" } }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
