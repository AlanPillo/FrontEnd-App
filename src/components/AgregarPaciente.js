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
  Alert,
  Grow
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Regex para validaciones
const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;      // Solo letras, tildes y espacios
const phoneRegex = /^[0-9]{1,9}$/;         // Entre 1 y 9 dígitos
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email básico

const AgregarPaciente = () => {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' });
  const [loading, setLoading] = useState(false);

  // Control de errores específicos por campo
  const [errors, setErrors] = useState({ nombre: '', email: '', telefono: '' });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  // ────────────────────────────────────────────────
  // Manejador de cambios en los inputs
  // ────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Limpia el error de ese campo al cambiar
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // ────────────────────────────────────────────────
  // Snackbar
  // ────────────────────────────────────────────────
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  // ────────────────────────────────────────────────
  // Validación de los campos
  // ────────────────────────────────────────────────
  const validarCampos = () => {
    let valid = true;
    let newErrors = { nombre: '', email: '', telefono: '' };

    // Validar Nombre
    if (!form.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
      valid = false;
    } else if (!nameRegex.test(form.nombre.trim())) {
      newErrors.nombre = 'El nombre solo puede contener letras y espacios.';
      valid = false;
    }

    // Validar Email
    if (!form.email.trim()) {
      newErrors.email = 'El email es obligatorio.';
      valid = false;
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = 'Formato de correo inválido.';
      valid = false;
    }

    // Validar Teléfono
    if (!form.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio.';
      valid = false;
    } else if (!phoneRegex.test(form.telefono.trim())) {
      newErrors.telefono = 'Debe ingresar solo números, con máximo 9 dígitos.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // ────────────────────────────────────────────────
  // Submit del Form
  // ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Primero validamos
    if (!validarCampos()) {
      showSnackbar('Corrige los campos marcados en rojo.', 'error');
      return; // Cancela el envío
    }

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

      {/* Contenedor del formulario con animación Grow */}
      <Grow in mountOnEnter>
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
            {/* Nombre */}
            <TextField
              label="Nombre"
              name="nombre"
              onChange={handleChange}
              value={form.nombre}
              error={Boolean(errors.nombre)}
              helperText={errors.nombre}
              required
              fullWidth
            />

            {/* Email */}
            <TextField
              label="Correo electrónico"
              type="email"
              name="email"
              onChange={handleChange}
              value={form.email}
              error={Boolean(errors.email)}
              helperText={errors.email}
              required
              fullWidth
            />

            {/* Teléfono */}
            <TextField
              label="Teléfono"
              placeholder="Ej: 099876543"
              type="tel"
              name="telefono"
              onChange={handleChange}
              value={form.telefono}
              error={Boolean(errors.telefono)}
              helperText={errors.telefono}
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
      </Grow>

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
