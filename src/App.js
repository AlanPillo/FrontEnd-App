import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Pacientes from './components/Pacientes';
import AgregarPaciente from './components/AgregarPaciente';
import EditarPaciente from './components/EditarPaciente';
import AgendarCita from './components/AgendarCita';
import Login from './components/Login';

const isAuthenticated = () => !!localStorage.getItem('token');

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/pacientes" element={<ProtectedRoute element={<Pacientes />} />} />
        <Route path="/agregar-paciente" element={<ProtectedRoute element={<AgregarPaciente />} />} />
        <Route path="/editar-paciente/:id" element={<ProtectedRoute element={<EditarPaciente />} />} />
        <Route path="/agendar-cita/:id" element={<ProtectedRoute element={<AgendarCita />} />} />
      </Routes>
    </Router>
  );
}

export default App;
