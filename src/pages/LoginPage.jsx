import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container, Paper, Alert, Link } from "@mui/material";
import { useAuth } from "../context/authContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login({ email, password });
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message || "Invalid credentials");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography component="h1" variant="h5" gutterBottom sx={{ fontWeight: 'bold', }}>
            Sign In
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.2 }}>
              Login
            </Button>
            <Link 
              component={RouterLink} 
              to="/register" 
              variant="body2" 
              sx={{ 
                textDecoration: "none",
                color: "text.secondary",
                "&:hover": { color: "primary.main", textDecoration: "underline" }
              }}
            >
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
