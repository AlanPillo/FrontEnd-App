import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EditarPaciente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const response = await api.get(`/api/pacientes/${id}`);
        // Se asume que response.data contiene { nombre, email, telefono }
        setForm(response.data);
      } catch (err) {
        setError('Error al cargar datos del paciente.');
      } finally {
        setLoading(false);
      }
    };
    fetchPaciente();
  }, [id]);

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
    try {
      await api.put(`/pacientes/${id}`, form);
      showSnackbar('Paciente actualizado', 'success');
      navigate('/pacientes');
    } catch (err) {
      console.error('Error al actualizar:', err);
      showSnackbar('Error al actualizar el paciente', 'error');
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <>
      {/* Encabezado con AppBar */}
      <AppBar position="static" color="default" elevation={1} sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" color="inherit">
            Editar Paciente
          </Typography>
          <IconButton edge="end" color="primary" onClick={() => navigate('/pacientes')}>
            <ArrowBackIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {error && (
          <Typography color="error" sx={{ mb: 2 }} align="center">
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
            padding: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: '#fff'
          }}
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
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            required
            fullWidth
          />
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" color="secondary" onClick={() => navigate('/pacientes')} sx={{ textTransform: 'none' }}>
              Volver
            </Button>
            <Button type="submit" variant="contained" color="primary" sx={{ textTransform: 'none' }}>
              Actualizar
            </Button>
          </Box>
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

export default EditarPaciente;
