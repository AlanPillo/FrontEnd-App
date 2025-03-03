import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, AppBar, Toolbar } from '@mui/material';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      {/* Encabezado con AppBar */}
      <AppBar position="static" color="default" elevation={1} sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" color="inherit" noWrap>
            🦷 Dashboard del Dentista
          </Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <Container sx={{ marginTop: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3,
            justifyContent: 'center'
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/pacientes')}
            sx={{ minWidth: 200, padding: 2 }}
          >
            Ver Pacientes
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/agregar-paciente')}
            sx={{ minWidth: 200, padding: 2 }}
          >
            Agregar Paciente
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
