import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';

const Login = () => {
  const [form, setForm] = useState({ nombre: '', password: '' });
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      console.log("🟡 Enviando login:", form);
      const response = await api.post('/api/login', form);
      console.log("✅ Respuesta del servidor:", response.data);
      localStorage.setItem('token', response.data.token);
      showSnackbar('Inicio de sesión exitoso', 'success');
      navigate('/pacientes');
    } catch (error) {
      console.error('❌ Error en el login:', error);
      setError('Credenciales incorrectas');
      showSnackbar('Credenciales incorrectas', 'error');
    }
  };

  return (
    <>
      {/* Encabezado con AppBar */}
      <AppBar position="static" color="default" sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Typography variant="h6" color="inherit">
            Sistema 
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          🔑 Iniciar Sesión
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{
            maxWidth: 400,
            margin: '0 auto',
            padding: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: '#fff'
          }}
        >
          <TextField
            label="Nombre"
            name="nombre"
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Contraseña"
            type="password"
            name="password"
            onChange={handleChange}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none', paddingY: 1.5 }}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Container>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
