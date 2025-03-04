import React, { useState, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const EditCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    nombre: '',
    password: '',
    direccion: '',
    telefono: '',
    profesion: ''
  });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [error, setError] = useState('');

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchCliente = async () => {
    try {
      // Asegúrate de tener un endpoint GET /api/owner/clientes/:id o similar
      const response = await api.get(`/api/owner/clientes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setForm({
        nombre: response.data.nombre,
        password: '', // dejamos vacío para no mostrar el hash
        direccion: response.data.direccion || '',
        telefono: response.data.telefono || '',
        profesion: response.data.profesion || ''
      });
    } catch (err) {
      setError('Error al cargar los datos del cliente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCliente();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Se permite actualizar todos los campos; si password está vacío, se enviará sin actualizarlo.
    try {
      await api.put(`/api/clientes/${id}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showSnackbar('Cliente actualizado correctamente', 'success');
      setTimeout(() => navigate('/owner/dashboard'), 500);
    } catch (err) {
      console.error(err);
      showSnackbar('Error al actualizar el cliente', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/owner/login');
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static" color="default" sx={{ borderBottom: '1px solid #e0e0e0', mb: 2 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Button onClick={() => navigate('/owner/dashboard')} color="inherit">
            Dashboard
          </Button>
          <Typography variant="h6" color="inherit" noWrap>
            Editar Cliente
          </Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Editar Cliente
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
          sx={{ maxWidth: 400, margin: '0 auto' }}
        >
          <TextField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Contraseña (dejar en blanco para no cambiar)"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Dirección"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Profesión"
            name="profesion"
            value={form.profesion}
            onChange={handleChange}
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary">
            Actualizar Cliente
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
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditCliente;
