import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
  Box,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Alert
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openHistory, setOpenHistory] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedCitas, setSelectedCitas] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    cargarPacientes();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const cargarPacientes = async () => {
    try {
      const response = await api.get('/api/pacientes');
      // Cada paciente tendrá sus citas (se asume que el endpoint retorna citas abiertas)
      const pacientesFormateados = response.data.map((paciente) => ({
        ...paciente,
        citas: paciente.citas || []
      }));
      setPacientes(pacientesFormateados);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error al obtener pacientes:', err);
      setError("No se pudieron cargar los pacientes.");
      setLoading(false);
    }
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAgregarCita = (id) => {
    navigate(`/agendar-cita/${id}`);
  };

  const handleEditarPaciente = (id) => {
    navigate(`/editar-paciente/${id}`);
  };

  const handleEliminarCita = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar la cita?")) {
      try {
        await api.delete(`/api/citas/${id}`);
        showSnackbar('Cita eliminada correctamente', 'success');
        cargarPacientes();
      } catch (err) {
        console.error('❌ Error al eliminar cita:', err);
        showSnackbar('Error al eliminar la cita', 'error');
      }
    }
  };

  // Actualiza la asistencia de la cita abierta del paciente
  const handleActualizarAsistencia = async (citaId, value) => {
    if (value === null) return;
    try {
      const asistio = value === "true";
      // Se actualiza la asistencia y se cierra la cita (estado = 'cerrado')
      await api.put(`/api/citas/${citaId}/asistencia`, { asistio });
      showSnackbar("Asistencia actualizada", "success");
      cargarPacientes();
    } catch (error) {
      console.error("❌ Error al actualizar asistencia:", error);
      showSnackbar("Error al actualizar asistencia", "error");
    }
  };

  // Al hacer clic en "Ver Histórico", se consulta el historial completo (citas cerradas) del paciente
  const handleOpenHistory = async (paciente) => {
    try {
      const result = await api.get(`/api/citas/historial/${paciente.id}`);
      setSelectedPatient(paciente);
      setSelectedCitas(result.data);
      setOpenHistory(true);
    } catch (error) {
      console.error("❌ Error al obtener historial:", error);
      showSnackbar("Error al obtener historial de citas", "error");
    }
  };

  const handleCloseHistory = () => {
    setOpenHistory(false);
    setSelectedPatient(null);
    setSelectedCitas([]);
  };

  // Permite actualizar la asistencia en el historial (revertir o cambiar)
  const handleToggleAsistencia = async (citaId, current) => {
    try {
      const newStatus = current ? "false" : "true";
      await handleActualizarAsistencia(citaId, newStatus);
    } catch (error) {
      console.error("❌ Error al actualizar asistencia en historial:", error);
      showSnackbar("Error al actualizar asistencia", "error");
    }
  };

  // Filtrar pacientes por nombre
  const filteredPacientes = pacientes.filter((paciente) =>
    paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      {/* Encabezado */}
      <AppBar position="static" color="default" elevation={1} sx={{ borderBottom: '1px solid #e0e0e0', mb: 2 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" color="inherit">
            Lista de Pacientes
          </Typography>
          <Box>
            <IconButton color="primary" onClick={() => navigate('/')}>
              <DashboardIcon />
            </IconButton>
            <IconButton color="error" onClick={handleCerrarSesion}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ mb: 3 }}>
        {/* Buscador */}
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={3} alignItems="center">
          <TextField
            label="Buscar por nombre"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </Box>
      </Container>

      <Container>
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1976d2' }}>
              <TableRow>
                <TableCell sx={{ color: '#fff' }}><strong>Nombre</strong></TableCell>
                <TableCell sx={{ color: '#fff' }}><strong>Email</strong></TableCell>
                <TableCell sx={{ color: '#fff' }}><strong>Teléfono</strong></TableCell>
                <TableCell sx={{ color: '#fff' }} align="center"><strong>Editar</strong></TableCell>
                <TableCell sx={{ color: '#fff' }}><strong>Cita Agendada</strong></TableCell>
                <TableCell sx={{ color: '#fff' }} align="center"><strong>Acciones</strong></TableCell>
                <TableCell sx={{ color: '#fff' }} align="center"><strong>Histórico</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPacientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No hay pacientes registrados.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPacientes.map((paciente) => (
                  <TableRow key={paciente.id} hover>
                    <TableCell>{paciente.nombre}</TableCell>
                    <TableCell>{paciente.email}</TableCell>
                    <TableCell>{paciente.telefono}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditarPaciente(paciente.id)}
                        sx={{ textTransform: 'none' }}
                      >
                        Editar
                      </Button>
                    </TableCell>
                    <TableCell>
                      {paciente.citas.length > 0 ? (
                        paciente.citas.map((cita) => (
                          <Box key={cita.id} display="flex" alignItems="center" gap={1} mb={1}>
                            <Typography variant="body2">
                              {cita.fecha.split('T')[0]}-{cita.hora.substring(0, 5)}hs
                            </Typography>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<DeleteIcon />}
                              sx={{ padding: '6px 12px', textTransform: 'none' }}
                              onClick={() => handleEliminarCita(cita.id)}
                            >
                              Eliminar
                            </Button>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2">No tiene cita</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {paciente.citas.length > 0 ? (
                        <ToggleButtonGroup
                          exclusive
                          value=""
                          onChange={(event, newValue) => {
                            if (newValue !== null) {
                              // Asumimos que paciente.citas[0] es la cita abierta
                              handleActualizarAsistencia(paciente.citas[0].id, newValue);
                            }
                          }}
                        >
                          <ToggleButton value="true">Asistió</ToggleButton>
                          <ToggleButton value="false">No asistió</ToggleButton>
                        </ToggleButtonGroup>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<AddIcon />}
                          sx={{ textTransform: 'none' }}
                          onClick={() => handleAgregarCita(paciente.id)}
                        >
                          Agendar
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        startIcon={<HistoryIcon />}
                        sx={{ textTransform: 'none' }}
                        onClick={() => handleOpenHistory(paciente)}
                      >
                        Ver Histórico
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Modal para historial de citas */}
      <Dialog open={openHistory} onClose={handleCloseHistory} maxWidth="md" fullWidth>
        <DialogTitle>Histórico de Citas de {selectedPatient?.nombre}</DialogTitle>
        <DialogContent dividers>
          {selectedCitas.length === 0 ? (
            <Typography>No hay citas registradas.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: '#1976d2' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#fff' }}><strong>Fecha</strong></TableCell>
                    <TableCell sx={{ color: '#fff' }}><strong>Hora</strong></TableCell>
                    <TableCell sx={{ color: '#fff' }}><strong>Confirmada</strong></TableCell>
                    <TableCell sx={{ color: '#fff' }}><strong>Asistencia</strong></TableCell>
                    <TableCell sx={{ color: '#fff' }} align="center"><strong>Acción</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedCitas.map((cita) => (
                    <TableRow key={cita.id} hover>
                      <TableCell>{cita.fecha.split('T')[0]}</TableCell>
                      <TableCell>{cita.hora}</TableCell>
                      <TableCell>{cita.confirmada ? 'Sí' : 'No'}</TableCell>
                      <TableCell>{cita.asistio ? 'Asistió' : 'No asistió'}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          sx={{ textTransform: 'none' }}
                          onClick={() => handleToggleAsistencia(cita.id, cita.asistio)}
                        >
                          {cita.asistio ? 'Cambiar a No asistió' : 'Cambiar a Asistió'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistory} variant="contained" color="secondary" sx={{ textTransform: 'none' }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

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

export default Pacientes;
