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

const OwnerPacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Funciones auxiliares para formatear fecha y hora
  const formatDate = (isoString) => {
    // Ej: "2025-03-31T03:00:00.000Z" => "2025-03-31"
    return isoString.split('T')[0];
  };

  const formatTime = (timeString) => {
    // Ej: "17:30:00" => "17:30hs"
    return timeString.slice(0, 5) + 'hs';
  };

  const fetchPacientes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/owner/pacientes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPacientes(response.data);
    } catch (error) {
      console.error('Error al obtener pacientes', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
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
            Todos los Pacientes
          </Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Todos los Pacientes
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
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Citas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pacientes.map((paciente) => (
                <TableRow key={paciente.id}>
                  <TableCell>{paciente.id}</TableCell>
                  <TableCell>{paciente.nombre}</TableCell>
                  <TableCell>{paciente.email}</TableCell>
                  <TableCell>{paciente.telefono}</TableCell>
                  {/* Se muestra el ID del cliente o el nombre si el backend lo incluyera */}
                  <TableCell>{paciente.cliente_id}</TableCell>
                  <TableCell>
                    {paciente.citas && paciente.citas.length > 0 ? (
                      paciente.citas.map((cita) => (
                        <div key={cita.id}>
                          {/* Aplicamos las funciones de formateo */}
                          {formatDate(cita.fecha)} {formatTime(cita.hora)} ({cita.estado})
                        </div>
                      ))
                    ) : (
                      'Sin citas'
                    )}
                  </TableCell>
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

export default OwnerPacientes;
