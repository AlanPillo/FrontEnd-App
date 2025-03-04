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
  IconButton,
  Paper,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Box,
  AppBar,
  Toolbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const OwnerClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/owner/clientes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setClientes(response.data);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
      setError('No se pudieron cargar los clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleDeleteClick = (cliente) => {
    setClienteToDelete(cliente);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/clientes/${clienteToDelete.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showSnackbar('Cliente eliminado correctamente', 'success');
      setOpenConfirm(false);
      setClienteToDelete(null);
      fetchClientes();
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      showSnackbar('Error al eliminar cliente', 'error');
      setOpenConfirm(false);
      setClienteToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirm(false);
    setClienteToDelete(null);
  };

  const handleEdit = (cliente) => {
    navigate(`/owner/clientes/edit/${cliente.id}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/owner/login');
  };

  return (
    <>
      <AppBar position="static" color="default" sx={{ borderBottom: '1px solid #e0e0e0', mb: 2 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Button onClick={() => navigate('/owner/dashboard')} color="inherit">
            Dashboard
          </Button>
          <Typography variant="h6" color="inherit" noWrap>
            Lista de Clientes
          </Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">{error}</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}><strong>ID</strong></TableCell>
                  <TableCell sx={{ color: '#fff' }}><strong>Nombre</strong></TableCell>
                  <TableCell sx={{ color: '#fff' }}><strong>Dirección</strong></TableCell>
                  <TableCell sx={{ color: '#fff' }}><strong>Teléfono</strong></TableCell>
                  <TableCell sx={{ color: '#fff' }}><strong>Profesión</strong></TableCell>
                  <TableCell sx={{ color: '#fff' }} align="center"><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No hay clientes registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  clientes.map((cliente) => (
                    <TableRow key={cliente.id} hover>
                      <TableCell>{cliente.id}</TableCell>
                      <TableCell>{cliente.nombre}</TableCell>
                      <TableCell>{cliente.direccion || '-'}</TableCell>
                      <TableCell>{cliente.telefono || '-'}</TableCell>
                      <TableCell>{cliente.profesion || '-'}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleEdit(cliente)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteClick(cliente)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Diálogo de confirmación */}
        <Dialog open={openConfirm} onClose={handleCancelDelete}>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de eliminar al cliente <strong>{clienteToDelete?.nombre}</strong>? Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelete} color="error">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

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

        {/* Botón para volver al dashboard */}
        <Box mt={2} display="flex" justifyContent="center">
          <Button variant="contained" onClick={() => navigate('/owner/dashboard')}>
            Volver al Dashboard
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default OwnerClientes;
