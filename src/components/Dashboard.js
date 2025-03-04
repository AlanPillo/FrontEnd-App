import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Grow
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

/**
 * Dashboard con diseño elegante y mensaje de bienvenida.
 */
const Dashboard = () => {
  const navigate = useNavigate();

  // Ejemplo: si el nombre del usuario está en localStorage
  const userName = localStorage.getItem('userName') || 'Usuario';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <>
      {/* Encabezado con AppBar */}
      <AppBar
        position="static"
        elevation={2}
        sx={{
          background: 'linear-gradient(135deg, #1976d2 30%, #2196f3 90%)',
          color: '#fff'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Nombre de la aplicación o logo */}
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Dashboard
          </Typography>

          {/* Botón de Cerrar Sesión */}
          <Button
            variant="contained"
            sx={{ textTransform: 'none', backgroundColor: '#e53935' }}
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* Contenedor principal con efecto Grow */}
      <Grow in style={{ transformOrigin: 'top center' }}>
        <Box
          sx={{
            minHeight: 'calc(100vh - 64px)', // Altura restante menos el AppBar
            background: 'linear-gradient(135deg, #f0f2f5 30%, #fafafa 90%)',
            py: 5
          }}
        >
          <Container sx={{ textAlign: 'center' }}>
            {/* Mensaje de bienvenida */}
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              ¡Bienvenido, {userName}!
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#555', mb: 4 }}>
              Estamos encantados de tenerte de vuelta. Elige una de las opciones.
            </Typography>

            {/* Botones de acción con animación Grow individual */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3,
                justifyContent: 'center'
              }}
            >
              <Grow in timeout={700}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<FolderSharedIcon />}
                  sx={{
                    minWidth: 220,
                    py: 1.5,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    boxShadow: 3
                  }}
                  onClick={() => navigate('/pacientes')}
                >
                  Ver Pacientes
                </Button>
              </Grow>

              <Grow in timeout={900}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<PersonAddIcon />}
                  sx={{
                    minWidth: 220,
                    py: 1.5,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    boxShadow: 3
                  }}
                  onClick={() => navigate('/agregar-paciente')}
                >
                  Agregar Paciente
                </Button>
              </Grow>
            </Box>
          </Container>
        </Box>
      </Grow>
    </>
  );
};

export default Dashboard;
