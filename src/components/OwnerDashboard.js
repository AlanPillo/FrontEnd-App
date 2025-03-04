// src/components/OwnerDashboard.jsx
import React from 'react';
import { Container, Typography, Button, Box, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/owner/login');
  };

  return (
    <>
      <AppBar
        position="static"
        color="default"
        sx={{ borderBottom: '1px solid #e0e0e0', mb: 2 }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" color="inherit" noWrap>
            Bienvenido, Owner
          </Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Box display="flex" flexDirection="column" gap={2} alignItems="center">
          <Button
            variant="contained"
            onClick={() => navigate('/owner/clientes')}
            sx={{ minWidth: 200 }}
          >
            Listar Clientes
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/owner/clientes/create')}
            sx={{ minWidth: 200 }}
          >
            Crear Cliente
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/owner/pacientes')}
            sx={{ minWidth: 200 }}
          >
            Ver Todos los Pacientes
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/owner/citas')}
            sx={{ minWidth: 200 }}
          >
            Ver Todas las Citas
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default OwnerDashboard;
