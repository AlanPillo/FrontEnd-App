import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AgregarPaciente = () => {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
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
      await api.post('/api/pacientes', form);
      showSnackbar('Paciente agregado exitosamente', 'success');
      navigate('/pacientes');
    } catch (error) {
      console.error('Error al agregar paciente:', error);
      showSnackbar('Hubo un problema al agregar el paciente', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Encabezado */}
      <AppBar
        position="static"
        color="default"
        elevation={1}
        sx={{ borderBottom: '1px solid #e0e0e0' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" color="inherit" noWrap>
            Agregar Paciente
          </Typography>
          <IconButton edge="end" color="primary" onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Contenedor del formulario */}
      <Container sx={{ marginTop: 4 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            maxWidth: 500,
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
            label="Correo electrónico"
            type="email"
            name="email"
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Teléfono"
            type="tel"
            name="telefono"
            onChange={handleChange}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            sx={{ paddingY: 1.5, textTransform: 'none' }}
          >
            {loading ? 'Guardando...' : 'Guardar'}
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

export default AgregarPaciente;
