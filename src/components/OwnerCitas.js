import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  AppBar,
  Toolbar,
  Button,
  Box
} from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const OwnerCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Funciones auxiliares para formatear fecha y hora
  const formatDate = (dateStr) => {
    // Si dateStr es un string ISO (ej: "2025-03-31T03:00:00.000Z"), separamos en 'T'
    return dateStr.split('T')[0];
  };

  const formatTime = (timeStr) => {
    // Si timeStr es "17:30:00" se recorta a "17:30hs"
    return timeStr.slice(0, 5) + 'hs';
  };

  const fetchCitas = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/owner/citas', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCitas(response.data);
    } catch (error) {
      console.error('Error al obtener citas', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/owner/login');
  };

  return (
    <>
      <AppBar position="static" color="default" sx={{ borderBottom: '1px solid #e0e0e0', mb: 2 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" color="inherit" noWrap>
            Todas las Citas
          </Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Todas las Citas
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Paciente</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Cliente</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {citas.map((cita) => (
                <TableRow key={cita.id}>
                  <TableCell>{cita.id}</TableCell>
                  <TableCell>{cita.paciente}</TableCell>
                  <TableCell>{cita.email}</TableCell>
                  <TableCell>{cita.telefono}</TableCell>
                  <TableCell>{formatDate(cita.fecha)}</TableCell>
                  <TableCell>{formatTime(cita.hora)}</TableCell>
                  <TableCell>{cita.estado}</TableCell>
                  <TableCell>{cita.cliente}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Box mt={2} display="flex" justifyContent="center">
          <Button variant="contained" onClick={() => navigate('/owner/dashboard')}>
            Volver al Dashboard
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default OwnerCitas;
