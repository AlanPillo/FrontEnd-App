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
  Alert,
  Grow,
  TablePagination
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';

const formatearFechaHora = (fechaStr, horaStr) => {
  if (!fechaStr) return '';
  const [year, month, day] = fechaStr.split('-');
  if (!year || !month || !day) return fechaStr;
  const y = parseInt(year, 10);
  const m = parseInt(month, 10) - 1;
  const d = parseInt(day, 10);
  const dateObj = new Date(y, m, d);
  if (isNaN(dateObj.getTime())) return fechaStr;
  let hourNumber = 0;
  let minuteNumber = 0;
  if (horaStr) {
    const [hh, mm] = horaStr.split(':');
    hourNumber = parseInt(hh, 10) || 0;
    minuteNumber = parseInt(mm, 10) || 0;
  }
  const meses = [
    'enero', 'febrero', 'marzo', 'abril',
    'mayo', 'junio', 'julio', 'agosto',
    'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const diaNum = dateObj.getDate();
  const mes = meses[dateObj.getMonth()];
  const anio = dateObj.getFullYear();
  const horaFinal =
    minuteNumber > 0
      ? `${hourNumber}:${String(minuteNumber).padStart(2, '0')}hs`
      : `${hourNumber}hs`;
  return `${diaNum} de ${mes} de ${anio}, ${horaFinal}`;
};

const obtenerCitaMasCercana = (citas) => {
  if (!citas || citas.length === 0) return null;
  const fechas = citas.map((c) => {
    const [year, month, day] = c.fecha.split('-');
    const dateObj = new Date(year, parseInt(month, 10) - 1, day);
    if (c.hora) {
      const [hh, mm] = c.hora.split(':');
      dateObj.setHours(parseInt(hh, 10) || 0, parseInt(mm, 10) || 0);
    }
    return dateObj;
  });
  fechas.sort((a, b) => a - b);
  return fechas[0];
};

const Pacientes = () => {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openHistory, setOpenHistory] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedCitas, setSelectedCitas] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [openConfirmCita, setOpenConfirmCita] = useState(false);
  const [citaToDelete, setCitaToDelete] = useState(null);
  const [motivoEliminacion, setMotivoEliminacion] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 6;

  const cargarPacientes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/pacientes');
      setPacientes(response.data);
    } catch (err) {
      console.error('❌ Error al obtener pacientes:', err);
      setError('No se pudieron cargar los pacientes.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleEliminarCitaClick = (cita) => {
    setCitaToDelete(cita);
    setMotivoEliminacion('');
    setOpenConfirmCita(true);
  };

  const handleConfirmEliminarCita = async () => {
    if (!citaToDelete) return;
    try {
      await api.delete(`/api/citas/${citaToDelete.id}`, {
        data: { motivo: motivoEliminacion },
      });
      showSnackbar(`Cita eliminada (Motivo: ${motivoEliminacion})`, 'success');
      setOpenConfirmCita(false);
      setCitaToDelete(null);
      setMotivoEliminacion('');
      cargarPacientes();
    } catch (err) {
      console.error('❌ Error al eliminar cita:', err);
      showSnackbar('Error al eliminar la cita', 'error');
      setOpenConfirmCita(false);
      setCitaToDelete(null);
    }
  };

  const handleCancelEliminarCita = () => {
    setOpenConfirmCita(false);
    setCitaToDelete(null);
    setMotivoEliminacion('');
  };

  const handleActualizarAsistencia = async (citaId, value) => {
    if (value === null) return;
    try {
      const asistio = value === 'true';
      await api.put(`/api/citas/${citaId}/asistencia`, { asistio });
      showSnackbar('Asistencia actualizada', 'success');
      cargarPacientes();
    } catch (error) {
      console.error('❌ Error al actualizar asistencia:', error);
      showSnackbar('Error al actualizar asistencia', 'error');
    }
  };

  const handleToggleAsistencia = async (citaId, current) => {
    try {
      const newStatus = current ? 'false' : 'true';
      await handleActualizarAsistencia(citaId, newStatus);
    } catch (error) {
      console.error('❌ Error al actualizar asistencia:', error);
      showSnackbar('Error al actualizar asistencia', 'error');
    }
  };

  const handleOpenHistory = async (paciente) => {
    try {
      const result = await api.get(`/api/citas/historial/${paciente.id}`);
      setSelectedPatient(paciente);
      setSelectedCitas(result.data);
      setOpenHistory(true);
    } catch (error) {
      console.error('❌ Error al obtener historial:', error);
      showSnackbar('Error al obtener historial de citas', 'error');
    }
  };

  const handleCloseHistory = () => {
    setOpenHistory(false);
    setSelectedPatient(null);
    setSelectedCitas([]);
  };

  const handleDeletePatientClick = (paciente) => {
    setPatientToDelete(paciente);
    setOpenConfirm(true);
  };

  const handleConfirmDeletePatient = async () => {
    if (!patientToDelete) return;
    try {
      await api.delete(`/api/pacientes/${patientToDelete.id}`);
      showSnackbar('Paciente eliminado correctamente', 'success');
      setOpenConfirm(false);
      setPatientToDelete(null);
      cargarPacientes();
    } catch (err) {
      console.error('❌ Error al eliminar paciente:', err);
      showSnackbar('Error al eliminar el paciente', 'error');
      setOpenConfirm(false);
      setPatientToDelete(null);
    }
  };

  const handleCancelDeletePatient = () => {
    setOpenConfirm(false);
    setPatientToDelete(null);
  };

  const filteredPacientes = pacientes.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPacientes = [...filteredPacientes].sort((a, b) => {
    const fechaA = obtenerCitaMasCercana(a.citas);
    const fechaB = obtenerCitaMasCercana(b.citas);
    if (fechaA && fechaB) return fechaA - fechaB;
    if (fechaA && !fechaB) return -1;
    if (!fechaA && fechaB) return 1;
    return 0;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedPacientes = sortedPacientes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const renderTableBody = () => {
    if (paginatedPacientes.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} align="center">
            No hay pacientes registrados.
          </TableCell>
        </TableRow>
      );
    }
    return paginatedPacientes.map((paciente, index) => (
      <Grow in timeout={(index + 1) * 200} key={paciente.id} style={{ transformOrigin: 'center top' }}>
        <TableRow hover>
          <TableCell align="center">
            <IconButton color="error" size="small" onClick={() => handleDeletePatientClick(paciente)}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
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
            {paciente.citas && paciente.citas.length > 0 ? (
              paciente.citas.map((cita) => {
                const fechaFormateada = formatearFechaHora(cita.fecha, cita.hora);
                return (
                  <Box key={cita.id} mb={1}>
                    <Typography variant="body2">{fechaFormateada}</Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      sx={{ padding: '4px 8px', textTransform: 'none', mt: 0.5 }}
                      onClick={() => handleEliminarCitaClick(cita)}
                    >
                      Eliminar
                    </Button>
                  </Box>
                );
              })
            ) : (
              <Typography variant="body2">No tiene cita</Typography>
            )}
          </TableCell>
          <TableCell align="center">
            {paciente.citas && paciente.citas.length > 0 ? (
              <ToggleButtonGroup
                exclusive
                value=""
                onChange={(event, newValue) => {
                  if (newValue !== null) {
                    const citaId = paciente.citas[0].id;
                    handleActualizarAsistencia(citaId, newValue);
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
      </Grow>
    ));
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1} sx={{ borderBottom: '1px solid #e0e0e0', mb: 2, backgroundColor: '#fafafa' }}>
        <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" sx={{ mb: { xs: 1, sm: 0 } }}>
            Lista de Pacientes
          </Typography>
          <Box>
            <IconButton color="primary" onClick={() => navigate('/')}>
              <DashboardIcon />
            </IconButton>
            <IconButton color="error" onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ mb: 3 }}>
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={3} alignItems="center" justifyContent="space-between">
          <TextField
            label="Buscar por nombre"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            sx={{ maxWidth: 400 }}
          />
        </Box>
      </Container>

      <Container>
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1976d2' }}>
              <TableRow>
                <TableCell sx={{ color: '#fff' }} align="center"><strong>Eliminar</strong></TableCell>
                <TableCell sx={{ color: '#fff' }}><strong>Nombre</strong></TableCell>
                <TableCell sx={{ color: '#fff' }}><strong>Email</strong></TableCell>
                <TableCell sx={{ color: '#fff' }}><strong>Teléfono</strong></TableCell>
                <TableCell sx={{ color: '#fff' }} align="center"><strong>Editar</strong></TableCell>
                <TableCell sx={{ color: '#fff' }}><strong>Cita Agendada</strong></TableCell>
                <TableCell sx={{ color: '#fff' }} align="center"><strong>Acciones</strong></TableCell>
                <TableCell sx={{ color: '#fff' }} align="center"><strong>Histórico</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderTableBody()}</TableBody>
          </Table>
          <TablePagination
            component="div"
            count={sortedPacientes.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
            labelRowsPerPage=""
            sx={{ borderTop: '1px solid #ccc' }}
          />
        </TableContainer>
      </Container>

      <Dialog open={openHistory} onClose={handleCloseHistory} maxWidth="md" fullWidth>
        <DialogTitle>Histórico de Citas de {selectedPatient?.nombre}</DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <Typography variant="subtitle1">
              Asistió: {selectedCitas.filter(c => c.asistio).length} veces | No asistió: {selectedCitas.filter(c => c.asistio === false).length} veces
            </Typography>
          </Box>
          {selectedCitas.length === 0 ? (
            <Typography>No hay citas registradas.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: '#1976d2' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#fff' }}><strong>Fecha - Hora</strong></TableCell>
                    <TableCell sx={{ color: '#fff' }}><strong>Confirmada</strong></TableCell>
                    <TableCell sx={{ color: '#fff' }}><strong>Asistencia</strong></TableCell>
                    <TableCell sx={{ color: '#fff' }} align="center"><strong>Acción</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedCitas.map((cita) => {
                    const fechaCompleta = formatearFechaHora(cita.fecha, cita.hora);
                    return (
                      <TableRow key={cita.id} hover>
                        <TableCell>{fechaCompleta}</TableCell>
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
                    );
                  })}
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

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de eliminar permanentemente al paciente <strong>{patientToDelete?.nombre}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="secondary" variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDeletePatient} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmCita} onClose={handleCancelEliminarCita}>
        <DialogTitle>Eliminar Cita</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            ¿Estás seguro de eliminar la cita? Se notificará al cliente de la eliminación.
          </Typography>
          <Typography gutterBottom>Por favor, indica el motivo:</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Motivo de eliminación"
            value={motivoEliminacion}
            onChange={(e) => setMotivoEliminacion(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEliminarCita} color="secondary" variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleConfirmEliminarCita} color="error" variant="contained" disabled={!motivoEliminacion}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Pacientes;
