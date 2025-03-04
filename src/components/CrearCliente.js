// src/components/CrearCliente.jsx
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Snackbar, Alert, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CrearCliente = () => {
  const [form, setForm] = useState({ 
    nombre: '', 
    password: '', 
    direccion: '', 
    telefono: '', 
    profesion: '' 
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/clientes', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showSnackbar('Cliente creado exitosamente', 'success');
      setTimeout(() => navigate('/owner/dashboard'), 500);
    } catch (error) {
      showSnackbar('Error al crear Cliente', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/owner/login');
  };

  return (
    <>
      <AppBar position="static" color="default" sx={{ borderBottom: '1px solid #e0e0e0', mb: 2 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" color="inherit" noWrap>
            Crear Cliente
          </Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Crear Cliente
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{ maxWidth: 400, margin: '0 auto' }}
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
            name="password"
            type="password"
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Dirección"
            name="direccion"
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Teléfono"
            name="telefono"
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Profesión"
            name="profesion"
            onChange={handleChange}
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Cliente'}
          </Button>
        </Box>
        <Box mt={2} display="flex" justifyContent="center">
          <Button variant="contained" onClick={() => navigate('/owner/dashboard')}>
            Volver al Dashboard
          </Button>
        </Box>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CrearCliente;
