import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Pacientes from './components/Pacientes';
import AgregarPaciente from './components/AgregarPaciente';
import EditarPaciente from './components/EditarPaciente';
import AgendarCita from './components/AgendarCita';
import Login from './components/Login';

// Componentes para el owner:
import OwnerDashboard from './components/OwnerDashboard';
import OwnerLogin from './components/OwnerLogin';
import OwnerClientes from './components/OwnerClientes'; // Antes OwnerDentistas
import CrearCliente from './components/CrearCliente';   // Antes CrearDentista
import EditCliente from './components/EditCliente';     // Nuevo componente agregado
import OwnerPacientes from './components/OwnerPacientes';
import OwnerCitas from './components/OwnerCitas';

const isAuthenticated = () => !!localStorage.getItem('token');
const getUserRole = () => localStorage.getItem('role'); // 'cliente' o 'owner'

const ProtectedRoute = ({ element, requiredRole }) => {
  if (!isAuthenticated()) return <Navigate to="/login" />;
  if (requiredRole && getUserRole() !== requiredRole) {
    return <Navigate to="/" />;
  }
  return element;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/owner/login" element={<OwnerLogin />} />

        {/* Rutas protegidas para profesionales (rol "cliente") */}
        <Route path="/" element={<ProtectedRoute element={<Dashboard />} requiredRole="cliente" />} />
        <Route path="/pacientes" element={<ProtectedRoute element={<Pacientes />} requiredRole="cliente" />} />
        <Route path="/agregar-paciente" element={<ProtectedRoute element={<AgregarPaciente />} requiredRole="cliente" />} />
        <Route path="/editar-paciente/:id" element={<ProtectedRoute element={<EditarPaciente />} requiredRole="cliente" />} />
        <Route path="/agendar-cita/:id" element={<ProtectedRoute element={<AgendarCita />} requiredRole="cliente" />} />

        {/* Rutas protegidas para owner */}
        <Route path="/owner/dashboard" element={<ProtectedRoute element={<OwnerDashboard />} requiredRole="owner" />} />
        <Route path="/owner/clientes" element={<ProtectedRoute element={<OwnerClientes />} requiredRole="owner" />} />
        <Route path="/owner/clientes/create" element={<ProtectedRoute element={<CrearCliente />} requiredRole="owner" />} />
        <Route path="/owner/clientes/edit/:id" element={<ProtectedRoute element={<EditCliente />} requiredRole="owner" />} /> {/* Agregada */}
        <Route path="/owner/pacientes" element={<ProtectedRoute element={<OwnerPacientes />} requiredRole="owner" />} />
        <Route path="/owner/citas" element={<ProtectedRoute element={<OwnerCitas />} requiredRole="owner" />} />
      </Routes>
    </Router>
  );
}

export default App;
