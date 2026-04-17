import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container, Paper, Alert, Link } from "@mui/material";
import { useAuth } from "../context/authContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await register(formData);
    if (result.success) {
      navigate("/login");
    } else {
      setError(result.message || "Registration failed");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography component="h1" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Create Account
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.2 }}>
              Sign Up
            </Button>
            <Link 
              component={RouterLink} 
              to="/login" 
              variant="body2" 
              sx={{ 
                textDecoration: "none",
                color: "text.secondary",
                "&:hover": { color: "primary.main", textDecoration: "underline" }
              }}
            >
              {"Already have an account? Sign In"}
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
