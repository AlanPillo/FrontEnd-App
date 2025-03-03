import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AgendarCita = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ fecha: '', hora: '', notas: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validar que la fecha sea posterior a hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaSeleccionada = new Date(form.fecha);
    if (fechaSeleccionada <= hoy) {
      setError('La cita debe ser agendada para un día posterior a hoy');
      setLoading(false);
      return;
    }

    try {
      await api.post('/api/citas', { paciente_id: id, ...form });
      alert('Cita agendada con éxito');
      navigate('/pacientes');
    } catch (err) {
      console.error('❌ Error al agendar cita:', err);
      setError('Error al agendar la cita.');
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
          <IconButton edge="start" color="primary" onClick={() => navigate('/pacientes')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            Agendar Cita
          </Typography>
          {/* Espacio para alinear */}
          <Box sx={{ width: '48px' }}></Box>
        </Toolbar>
      </AppBar>

      {/* Contenedor del formulario */}
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              📅
            </Typography>
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
              gap={3}
            >
              <TextField
                label="Fecha"
                type="date"
                name="fecha"
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Hora (HH:MM)"
                name="hora"
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Notas"
                name="notas"
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              fullWidth
              sx={{ paddingY: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Agendar'}
            </Button>
          </CardActions>
        </Card>
      </Container>
    </>
  );
};

export default AgendarCita;
